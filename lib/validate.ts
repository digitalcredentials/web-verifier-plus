import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
import { purposes } from 'jsonld-signatures';
import * as vc from '@digitalcredentials/vc';
import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
import { securityLoader } from '@digitalcredentials/security-document-loader';
import { extractCredentialsFrom } from './verifiableObject';
import { registryCollections } from '@digitalcredentials/issuer-registry-client';
import { getCredentialStatusChecker } from './credentialStatus';
const documentLoader = securityLoader({ fetchRemoteContexts: true }).build()
const suite = new Ed25519Signature2020();
const presentationPurpose = new purposes.AssertionProofPurpose();

export type ResultLog = {
  id: string,
  valid: boolean
}

export type Result = {
  verified: boolean;
  credential: VerifiableCredential;
  error: CredentialError;
  log: ResultLog[];
  registryName?: string;
}

export type VerifyResponse = {
  verified: boolean;
  results: Result[];
}

export async function verifyPresentation(
  presentation: VerifiablePresentation,
  unsignedPresentation = true,
): Promise<VerifyResponse> {
  try {
    const result = await vc.verify({
      presentation,
      presentationPurpose,
      suite,
      documentLoader,
      unsignedPresentation,
    });

    console.log(JSON.stringify(result));
    return result;
  } catch (err) {
    console.warn(err);

    throw new Error(PresentationError.CouldNotBeVerified);
  }
}

export async function verifyCredential(credential: VerifiableCredential): Promise<VerifyResponse> {
  const { issuer } = credential;

  const {malformed, message} = checkMalformed(credential);
  if (malformed) {
    return createErrorMessage(credential, message);
  }

  if (credential?.proof?.type === 'DataIntegrityProof') {
    return createErrorMessage(credential,
      `Proof type not supported: DataIntegrityProof (cryptosuite: ${credential.proof.cryptosuite}).`);
  }

  const issuerDid = typeof issuer === 'string' ? issuer : issuer.id;

  await registryCollections.issuerDid.fetchRegistries();
  const isInRegistry = await registryCollections.issuerDid.isInRegistryCollection(issuerDid);
  if (!isInRegistry) {
    // throw new Error(CredentialErrorTypes.DidNotInRegistry);
    return createErrorMessage(credential, CredentialErrorTypes.DidNotInRegistry)
  }

  try {
    const extractedCredential = extractCredentialsFrom(credential)?.find(
      vc => vc.credentialStatus);
    const checkStatus = extractedCredential ?
      getCredentialStatusChecker(extractedCredential)
      : undefined;
    const result = await vc.verifyCredential({
      credential,
      suite,
      documentLoader,
      // Only check revocation status if VC has a 'credentialStatus' property
      checkStatus
    });

    if (result?.error?.name === 'VerificationError') {
      return createErrorMessage(credential, CredentialErrorTypes.CouldNotBeVerified);
    }

    if (!result.results) {
      result.results = [{}];
    }

    for (const res of result.results) {
      if (!res.credential) {
        res.credential = credential;
      }
    }

    const registryInfo = await registryCollections.issuerDid.registriesFor(issuerDid)
    result.registryName  = registryInfo[0].name;

    return result;
  } catch (err) {
    console.warn(err);
    throw new Error(CredentialErrorTypes.CouldNotBeVerified);
  }
}

function checkMalformed(credential: VerifiableCredential) {
  let message = '';

  // check credential for proof
  if (!credential.proof){
    message += 'This is not a Verifiable Credential (does not have a digital signature).'
  }

  if (message) {
    return {malformed: true, message: message};
  }
  return {malformed: false, message: message};

}

function createErrorMessage(credential: VerifiableCredential, message: string) {
  return {
    verified: false,
    results: [
      {
        verified: false,
        credential,
        error: {
          details: {
            cause: {
              message: message,
              name: 'Error',
            },
          },
          message: message,
          name: 'Error',
        },
        log: [
            { id: 'expiration', valid: false },
            { id: 'valid_signature', valid: false },
            { id: 'issuer_did_resolves', valid: false },
            { id: 'revocation_status', valid: false },
            { id: 'suspension_status', valid: false }
          ],
      }
    ]
  }
}
