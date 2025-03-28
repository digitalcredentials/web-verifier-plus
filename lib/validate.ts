import { Ed25519Signature2020 } from '@digitalcredentials/ed25519-signature-2020';
import { purposes } from 'jsonld-signatures';
// import * as vc from '@digitalcredentials/vc';
import * as verifier from '@digitalcredentials/verifier-core';
import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
import { securityLoader } from '@digitalcredentials/security-document-loader';
// import { extractCredentialsFrom } from './verifiableObject';
// import { RegistryClient } from '@digitalcredentials/issuer-registry-client';
// import { getCachedRegistryClient } from './registryManager';
// import { getCredentialStatusChecker } from './credentialStatus';
import { KnownDidRegistries } from './../data/knownRegistries'

const documentLoader = securityLoader({ fetchRemoteContexts: true }).build()
const suite = new Ed25519Signature2020();
const presentationPurpose = new purposes.AssertionProofPurpose();

export type ResultLog = {
  id: string,
  valid: boolean,
  foundInRegistries?: string[],
  error?: any
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
    const result = await verifier.verify({
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


  if (credential?.proof?.type === 'DataIntegrityProof') {
    return createFatalErrorResult(credential,
      `Proof type not supported: DataIntegrityProof (cryptosuite: ${credential.proof.cryptosuite}).`);
  }

  try {
    /*
    basic structure of object returned from verifyCredential call
    {
        verified: false,
        results: [{credential, verified: false, error}],
        error
      };
    */
 

   const reloadIssuerRegistry = true;
   const result = await verifier.verifyCredential({
      credential,
      knownDIDRegistries:KnownDidRegistries,
      reloadIssuerRegistry
      // Only check revocation status if VC has a 'credentialStatus' property
    });
    result.verified = Array.isArray(result.log)
    ? result.log.every((check: { valid: any; }) => check.valid)
    : false;
    if (result?.errors) {
      return createFatalErrorResult(credential, CredentialErrorTypes.CouldNotBeVerified);
    }
    if (!result.results) {
      result.results = [{
        verified: (result.log as ResultLog[]).every(check => check.valid),
        log: result.log,
        credential: result.credential
      }];
    }
    if (result?.verified === false) {
      const revocationObject = (result.log as ResultLog[]).find(c => c.id === "revocation_status");
      if (revocationObject) {
        const revocationResult = { 
          id: "revocation_status",
          valid: revocationObject.valid ?? false,
        };
        (result.results[0].log ??= []).push(revocationResult)
        result.hasStatusError = !!revocationObject.error;
      }
    }
    if (result.log) {
      const registryNames = (result.log as ResultLog[]).find(c => c.id === "registered_issuer")?.foundInRegistries || [];
      result.registryName = registryNames;
    } else {
      result.verified = false;
      (result.results[0].log ??= []).push({ id: 'registered_issuer', valid: false })
      addErrorToResult(result, CredentialErrorTypes.DidNotInRegistry, false)
    }
    return result;
  } catch (err) {
    console.warn(err);
    //throw new Error(CredentialErrorTypes.CouldNotBeVerified);
    return createFatalErrorResult(credential, CredentialErrorTypes.CouldNotBeVerified)
  }
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
