import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
import { purposes } from '@digitalcredentials/jsonld-signatures';
import { checkStatus } from '@digitalcredentials/vc-status-list';
import vc from '@digitalcredentials/vc';
import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
import { securityLoader } from '@digitalcredentials/security-document-loader';
import { extractCredentialsFrom } from './verifiableObject';
import { RegistryClient } from '@digitalcredentials/issuer-registry-client';
import { getCachedRegistryClient } from './registryManager';
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

  const registries = await getCachedRegistryClient();


  const registryNames = issuerInRegistries({
    issuer,
    registries
  });
  
  if (!registryNames) {
    // throw new Error(CredentialErrorTypes.DidNotInRegistry);
    return createErrorMessage(credential, CredentialErrorTypes.DidNotInRegistry)
  }

  try {
    const hasRevocation = extractCredentialsFrom(credential)?.find(vc => vc.credentialStatus);
    const result = await vc.verifyCredential({
      credential,
      suite,
      documentLoader,
      // Only check revocation status if VC has a 'credentialStatus' property
      checkStatus: hasRevocation ? checkStatus : undefined
    });
    if (result?.error?.name === 'VerificationError') {
      return createErrorMessage(credential, CredentialErrorTypes.CouldNotBeVerified);
    }

    result.registryName = registryNames;

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

function issuerInRegistries({
  issuer,
  registries,
}: {
  issuer: string | any;
  registries: RegistryClient;
}): string[] | null {
  const issuerDid = typeof issuer === 'string' ? issuer : issuer.id;
  const issuerInfo = registries.didEntry(issuerDid);

  // See if the issuer DID appears in any of the known registries
  // If yes, assemble a list of registries it appears in
  return issuerInfo?.inRegistries
    ? Array.from(issuerInfo.inRegistries).map((r) => r.name)
    : null;
}

function createErrorMessage(credential: VerifiableCredential, message: string) {
  return {
    verified: false,
    results: [
      {
        verified: false,
        credential: credential,
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
            { id: 'revocation_status', valid: false }
          ],
      }
    ]
  }
}
