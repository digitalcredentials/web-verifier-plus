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

    return result;
  } catch (err) {
    console.warn(err);
    throw new Error(PresentationError.CouldNotBeVerified);
  }
}

export async function verifyCredential(credential: VerifiableCredential): Promise<VerifyResponse> {
  const { issuer } = credential;

  if (!checkID(credential)) {
    return createFatalErrorResult(credential, "The credential's id uses an invalid format. It may have been issued as part of an early pilot. Please contact the issuer to get a replacement.")
  }

  const { malformed, message } = checkMalformed(credential);
  if (malformed) {
    return createFatalErrorResult(credential, message);
  }

  if (credential?.proof?.type === 'DataIntegrityProof') {
    return createFatalErrorResult(credential,
      `Proof type not supported: DataIntegrityProof (cryptosuite: ${credential.proof.cryptosuite}).`);
  }

  try {
    const extractedCredential = extractCredentialsFrom(credential)?.find(
      vc => vc.credentialStatus);
    const checkStatus = extractedCredential ?
      getCredentialStatusChecker(extractedCredential)
      : undefined;

    /*
    basic structure of object returned from verifyCredential call
    {
        verified: false,
        results: [{credential, verified: false, error}],
        error
      };
    */
    const result = await vc.verifyCredential({
      credential,
      suite,
      documentLoader,
      // Only check revocation status if VC has a 'credentialStatus' property
      checkStatus
    });
    result.fatal = false;
    if (result?.error?.name === 'VerificationError') {
      return createFatalErrorResult(credential, CredentialErrorTypes.CouldNotBeVerified);
    }

    if (result.statusResult?.verified === false) {
      (result.results[0].log ??= []).push({ id: 'revocation_status', valid: false })
      if (result.statusResult.error) {
        result.hasStatusError = true;
      }
    }

    if (!result.results) {
      result.results = [{}];
    }

    for (const res of result.results) {
      if (!res.credential) {
        res.credential = credential;
      }
    }

    const issuerDid = typeof issuer === 'string' ? issuer : issuer.id;
    await registryCollections.issuerDid.fetchRegistries();
    const isInRegistry = await registryCollections.issuerDid.isInRegistryCollection(issuerDid);
    if (isInRegistry) {
      const registryInfo = await registryCollections.issuerDid.registriesFor(issuerDid)
      result.registryName = registryInfo[0].name;
    } else {
      result.verified = false;
      (result.results[0].log ??= []).push({ id: 'issuer_did_resolves', valid: false })
      addErrorToResult(result, CredentialErrorTypes.DidNotInRegistry, false)
    }

    return result;
  } catch (err) {
    console.warn(err);
    //throw new Error(CredentialErrorTypes.CouldNotBeVerified);
    return createFatalErrorResult(credential, CredentialErrorTypes.CouldNotBeVerified)
  }
}

function checkMalformed(credential: VerifiableCredential) {
  let message = '';

  // check credential for proof
  if (!credential.proof) {
    message += 'This is not a Verifiable Credential (does not have a digital signature).'
  }

  if (message) {
    return { malformed: true, message: message };
  }
  return { malformed: false, message: message };

}

function checkID(credential: VerifiableCredential) : boolean {

  try {
    new URL(credential.id as string);
  } catch (e) {
    return false
  }
  return true
  
}

function createFatalErrorResult(credential: VerifiableCredential, message: string): VerifyResponse {
  const result = {
    verified: false,
    results: [
      {
        verified: false,
        credential: credential,
        log: [
          { id: 'expiration', valid: false },
          { id: 'valid_signature', valid: false },
          { id: 'issuer_did_resolves', valid: false },
          { id: 'revocation_status', valid: false }
        ]
      }
    ]
  }
  addErrorToResult(result, message, true)
  return result as VerifyResponse
}

function addErrorToResult(result: any, message: string, isFatal: boolean = true) {
  result.results[0].error =
  {
    details: {
      cause: {
        message,
        name: 'Error',
      },
    },
    message,
    name: 'Error',
    isFatal
  }
}
