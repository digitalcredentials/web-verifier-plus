import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
import { purposes } from '@digitalcredentials/jsonld-signatures';
import { checkStatus } from '@digitalcredentials/vc-status-list';
import vc from '@digitalcredentials/vc';
import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
import { securityLoader } from '@digitalcredentials/security-document-loader';
import { registries } from './registry';
import { extractCredentialsFrom } from './verifiableObject';
const documentLoader = securityLoader().build();
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

  const issuerDid = typeof issuer === 'string' ? issuer : issuer.id;

  if (!registries.issuerDid.isInRegistry(issuerDid)) {
    throw new Error(CredentialErrorTypes.DidNotInRegistry);
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

    return result;
  } catch (err) {
    console.warn(err);
    throw new Error(CredentialErrorTypes.CouldNotBeVerified);
  }
}
