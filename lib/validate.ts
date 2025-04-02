import * as verifierCore from '@digitalcredentials/verifier-core';
import { VerifiablePresentation, PresentationError } from 'types/presentation.d';
import { VerifiableCredential, CredentialError, CredentialErrorTypes } from 'types/credential.d';
import { KnownDidRegistries } from './../data/knownRegistries'

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
    const result = await verifierCore.verifyPresentation({
      presentation
    });

    return result;
  } catch (err) {
    console.warn(err);
    throw new Error(PresentationError.CouldNotBeVerified);
  }
}

export async function verifyCredential(credential: VerifiableCredential): Promise<VerifyResponse> {
  try {
    /*
    basic structure of object returned from verifyCredential call
    {
        verified: false,
        results: [{credential, verified: false, error}],
        error
      };
    */

    const result = await verifierCore.verifyCredential({
      credential,
      knownDIDRegistries: KnownDidRegistries
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
        if (revocationObject.error) {
          if (revocationObject.error.name === "status_list_not_found") {
            result.verified = true;
          } else {
            const revocationResult = {
              id: "revocation_status",
              valid: revocationObject.valid ?? false,
            };
            (result.results[0].log ??= []).push(revocationResult)
            result.hasStatusError = !!revocationObject.error;
          }
        }
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
