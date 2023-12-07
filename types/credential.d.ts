export type IssuerURI = string;
export type IssuerObject = {
  readonly id: IssuerURI;
  readonly type?: string;
  readonly name?: string;
  readonly url?: string;
  readonly image?: string;
}
export type Issuer = IssuerURI | IssuerObject;

export type CreditValue = {
  value?: string;
}

export type CompletionDocument = {
  readonly type?: string;
  readonly identifier?: string;
  readonly name?: string;
  readonly description?: string;
  readonly numberOfCredits?: CreditValue;
  readonly startDate?: string;
  readonly endDate?: string;
}

export type EducationalOperationalCredentialExtensions = {
  readonly type?: string[];
  readonly awardedOnCompletionOf?: CompletionDocument;
}

export type EducationalOperationalCredential = EducationalOperationalCredentialExtensions & {
  readonly id: string;
  readonly name?: string;
  readonly description?: string;
  readonly competencyRequired?: string;
  readonly credentialCategory?: string;
}

export type OpenBadgeAchievement = {
  readonly achievementType?: string;
  readonly criteria?: {
        readonly narrative?: string
      };
  readonly description?: string;
  readonly id?: string;
  readonly name?: string;
  readonly type?: string;
  readonly image?: achievementImage;
}

type achievementImage = {
  readonly id?: string;
  readonly type?: string;
}

type SubjectExtensions = {
  readonly type?: string;
  readonly name?: string;
  readonly hasCredential?: EducationalOperationalCredential; // https://schema.org/hasCredential
  readonly achievement?: OpenBadgeAchievement
}

export type Subject = SubjectExtensions & {
  readonly id?: string;
}

export type Proof = {
  type: string;
  created: string;
  verificationMethod: string;
  proofPurpose: string;
  proofValue?: string;
  challenge?: string;
  jws?: string;
  cryptosuite?: string;
}

export type Status = {
  id: string;
  type: string | [];
  statusPurpose: string;
  statusListIndex: string;
  statusListCredential: string;
}

// https://digitalcredentials.github.io/dcc/v1/dcc-context-v1.json
export type VerifiableCredential = {
  readonly name: string | undefined;
  readonly credentialStatus?: Status;    // https://w3c.github.io/vc-data-model/#status
  readonly '@context': string[];         // https://w3c.github.io/vc-data-model/#contexts
  readonly id?: string;                   // https://w3c.github.io/vc-data-model/#identifiers
  readonly type: string[];               // https://w3c.github.io/vc-data-model/#types
  readonly issuer: Issuer;               // https://w3c.github.io/vc-data-model/#issuer
  readonly issuanceDate?: string;         // https://w3c.github.io/vc-data-model/#issuance-date
  readonly expirationDate?: string;      // https://w3c.github.io/vc-data-model/#expiration
  readonly credentialSubject: Subject;   // https://w3c.github.io/vc-data-model/#credential-subject
  readonly proof?: Proof;                // https://w3c.github.io/vc-data-model/#proofs-signatures
}

export enum CredentialErrorTypes {
  IsNotVerified = 'Credential is not verified.',
  CouldNotBeVerified = 'Credential could not be checked for verification and may be malformed.',
  DidNotInRegistry = 'Could not find issuer in registry with given DID.',
}

export type CredentialError = {
  details: ErrorDetails,
  message: string,
  name: string,
  stack?: string,
}

export type ErrorDetails = {
  cause: ErrorCause;
  code?: string;
  url?: string;
}

export type ErrorCause = {
  message: string;
  name: string;
  stack?: string
}

export type VerifyResultLog = {
  id: string,
  valid: boolean
}

export type VerifyResult = {
  verified: boolean;
  credential: VerifiableCredential;
  error: CredentialError;
  log: VerifyResultLog[];
}

export type VerifyResponse = {
  verified: boolean;
  results: VerifyResult[];
  registryName?: string;
}
