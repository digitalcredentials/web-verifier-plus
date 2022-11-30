import type { VerifiableCredential, Proof, Issuer } from './credential';

export type VerifiablePresentation = {
  readonly '@context': string | string[];
  readonly holder?: string;
  readonly type: string;
  readonly verifiableCredential: VerifiableCredential | VerifiableCredential[];
  readonly proof?: Proof;
}

export enum PresentationError {
  IsNotVerified = 'Presentation is not verified.',
  CouldNotBeVerified = 'Presentation encoded could not be checked for verification and may be malformed.',
}
