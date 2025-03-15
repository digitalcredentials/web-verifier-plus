//import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
//import { purposes } from 'jsonld-signatures';
//import * as vc from '@digitalcredentials/vc';
//import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
//import { securityLoader } from '@digitalcredentials/security-document-loader';
//import { extractCredentialsFrom } from './verifiableObject';
//import { RegistryClient } from '@digitalcredentials/issuer-registry-client';
//import { getCachedRegistryClient } from './registryManager';
//import { getCredentialStatusChecker } from './credentialStatus';
import { verifyCredential as coreVerify} from '@digitalcredentials/verifier-core';
import { KnownDidRegistries as knownDIDRegistries } from 'data/knownRegistries';

////const documentLoader = securityLoader({ fetchRemoteContexts: true }).build()
//const suite = new Ed25519Signature2020();
//const presentationPurpose = new purposes.AssertionProofPurpose();

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

/* export async function verifyPresentation(
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
} */

export async function verifyCredential(credential: VerifiableCredential): Promise<VerifyResponse> {
  
  const result = await coreVerify({ credential, knownDIDRegistries, reloadIssuerRegistry: true })
  console.log("the result")
  console.log(result)
  return result;
}

