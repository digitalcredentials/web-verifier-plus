import { v4 as uuidv4 } from 'uuid';
import { dbCredentials } from './database';
import { VerifiablePresentation } from '../types/presentation';
import { VerifiableCredential } from '../types/credential';

export type StoreCredentialPayload = {
  // a signed VP containing one VC (more than one will be supported in the future)
  vp: VerifiablePresentation;
}

export type GetCredentialResult = {
  vp: VerifiablePresentation;
  id: string;
  // controller DID (entity who asked for the credential to be stored)
  controller: string;
  // VC extracted from the VP for client-side convenience
  credential: VerifiableCredential;
}

/**
 * Adds a credential from a VerifiablePresentation to the database.
 * Requires a signed VP with a holder property (the result of DID Auth).
 *
 * @param vp {VerifiablePresentation}
 *
 * @returns {Promise<string>} Relative URL at which the credential was stored.
 */
export async function post({ vp }: StoreCredentialPayload): Promise<string> {
  const { holder } = vp;
  if(!holder) {
    throw new Error("Missing 'holder' property. DID Authentication is required.");
  }

  const Credentials = await dbCredentials.open();
  const credential = _extractCredential(vp);
  const id = publicIdFrom(holder, credential);
  await Credentials.insert({
    id,
    controller: holder,
    vp
  });
  await dbCredentials.close();

  return `/credentials/${id}`
}

export function publicIdFrom (holder: string, credential: VerifiableCredential): string {
  // Going with UUID for the moment
  // Future work: make this deterministic, a hash(holderDid + hash(credential))
  return uuidv4();
}

function _extractCredential(vp: VerifiablePresentation): VerifiableCredential {
  return Array.isArray(vp.verifiableCredential)
    ? vp.verifiableCredential[0]
    : vp.verifiableCredential;
}

/**
 * Loads a credential from database by id.
 *
 * @param credentialId {VerifiablePresentation}
 *
 * @returns {Promise<GetCredentialResult>}
 */
export async function get({ publicCredentialId }: any): Promise<GetCredentialResult> {
  const Credentials = await dbCredentials.open();
  const result = await Credentials.findOne({ id: publicCredentialId });
  await dbCredentials.close();

  const credential = _extractCredential(result.vp);

  return { credential, ...result }
}
