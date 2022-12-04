import { v4 as uuidv4 } from 'uuid';
import { dbCredentials } from './database';
import { VerifiablePresentation } from '../types/presentation';
import { VerifiableCredential } from '../types/credential';

export type CredentialPayload = {
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
  // 'shared' is used for "soft delete" -- if set to 'false', the VC is deleted/unshared
  shared: boolean;
}

/**
 * Adds a credential from a VerifiablePresentation to the database.
 * Requires a signed VP with a holder property (the result of DID Auth).
 *
 * @param vp {VerifiablePresentation}
 *
 * @returns {Promise<string>} Relative URL at which the credential was stored.
 */
export async function post({ vp }: CredentialPayload): Promise<string> {
  const { holder } = vp;
  if(!holder) {
    throw new Error("Missing 'holder' property. DID Authentication is required.");
  }

  const Credentials = await dbCredentials.open();
  const credential = _extractCredential(vp);
  const publicId = publicIdFrom(holder, credential);

  // TODO: Set automatic expiration date
  // @see https://www.mongodb.com/docs/v6.0/tutorial/expire-data/

  await Credentials.insert({
    id: publicId,
    controller: holder,
    vp,
    shared: true
  });
  await dbCredentials.close();

  return `/credentials/${publicId}`
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
 * @param credentialId {string}
 *
 * @returns {Promise<GetCredentialResult>}
 */
export async function get({ publicCredentialId }: any): Promise<GetCredentialResult> {
  const Credentials = await dbCredentials.open();
  const result = await Credentials.findOne({ id: publicCredentialId });
  await dbCredentials.close();

  if(!result || !result.shared) {
    const notFound: any = new Error('Public share of this credential expired, unshared, or not found.')
    notFound.statusCode = 404;
    notFound.statusText = 'Not found'
    throw notFound;
  }

  const credential = _extractCredential(result.vp);

  return { credential, ...result }
}

/**
 * Unshares a credential from database by id (performs a "soft delete").
 *
 * @param publicCredentialId {string}
 * @param payload {CredentialPayload} - { vp: signedVerifiablePresentation }
 *
 * @returns {Promise<GetCredentialResult>}
 */
export async function unshare({ publicCredentialId, payload }: any): Promise<GetCredentialResult> {
  const Credentials = await dbCredentials.open();
  const result = await Credentials.findOne({ id: publicCredentialId });

  if(!result) {
    const notFound: any = new Error('This credential does not exist, has expired, or has already been unshared.')
    notFound.statusCode = 404;
    notFound.statusText = 'Not found'
    await dbCredentials.close();
    throw notFound;
  }

  const filter = { id: publicCredentialId };
  const options = { upsert: false }
  const update = {
    $set: {
      shared: false
    }
  }

  const unshareResult: any = await Credentials.updateOne(filter, update, options);

  console.log('VC unshare result:', JSON.stringify(unshareResult, null, 2));

  await dbCredentials.close();

  return { ...unshareResult }
}
