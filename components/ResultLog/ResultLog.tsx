import { useState } from 'react';
import { CredentialError } from 'types/credential.d';
import type { ResultLogProps } from './ResultLog.d';
import styles from './ResultLog.module.css';
import { StatusPurpose, hasStatusPurpose } from 'lib/credentialStatus';

enum LogId {
  ValidSignature = 'valid_signature',
  Expiration = 'expiration',
  IssuerDIDResolves = 'issuer_did_resolves',
  RevocationStatus = 'revocation_status',
  SuspensionStatus = 'suspension_status'
}

export const ResultLog = ({ verificationResult }: ResultLogProps) => {
  const [moreInfo, setMoreInfo] = useState(false);
  const ResultItem = ({verified = true, positiveMessage = '', negativeMessage = '', issuer = false}) => {
    return (
      <div className={styles.resultItem}>
        <span role='img' aria-label={verified ? 'green checkmark': 'red x'} className={`material-icons ${verified ? styles.verified : styles.notVerified}`}>
          {verified ? 'check' : 'close'}
        </span>
        <div>
          {verified ? positiveMessage : negativeMessage}
          { issuer ?
            <ul className={styles.issuerList}>
              {verificationResult.registryName ?
              <li>{verificationResult.registryName}</li>
              : null
              }
            </ul> :
            null
          }
        </div>
      </div>
    )
  }

  let logMap: { [x: string]: any; };
  let hasKnownError = false;
  let shouldShowKnownError = false;
  let hasUnknownError = false;
  let hasSigningError = false;
  let error: CredentialError;
  let hasResult = verificationResult.results[0];

  if (hasResult) {
    let log = []
    const result = verificationResult.results[0]
    const hasResultLog = !!result.log;
    const hasErrorLog = !!result.error?.log
    hasKnownError = !!result.error
    shouldShowKnownError = !!result.error?.isFatal
    if (hasKnownError) {
      error = result.error
      console.log('Error: ', error);
    }

    if (hasResultLog) {
      log = result.log
    } else if (hasErrorLog) {
      log = result.error.log
    }
    logMap = log.reduce((acc: Record<string, boolean>, logEntry: any) => {
      acc[logEntry.id] = logEntry.valid;
      return acc;
    }, {}) ?? {};
  
    hasSigningError = ! logMap[LogId.ValidSignature];
    
} else {
  hasUnknownError = true;
}

  const result = () => {
    if (shouldShowKnownError) {
      return (
        <div>
          <p className={styles.error}>There was an error verifing this credential. <span className={styles.moreInfoLink} onClick={() => setMoreInfo(!moreInfo)}>More Info</span></p>
          {moreInfo && (
            <div className={styles.errorContainer}>
              <p>{error.message}</p>
            </div>
          )}
        </div>
      )
    } else if (hasSigningError) {
      return (
        <div>
          <p className={styles.error}>"This credential cannot be verified. Note that the JSON code is sensitive to changes in code text including spaces and characters. Please ensure you have input the correct code." <span className={styles.moreInfoLink} onClick={() => setMoreInfo(!moreInfo)}>More Info</span></p>
          {moreInfo && (
            <div className={styles.errorContainer}>
              <p>Something has changed in the credential so that the electronic signature no longer matches the content. This could be something as simple as inadvertently adding a space.</p>
            </div>
          )}
        </div>
      )
    } else if (hasUnknownError) {
      return (<div>
        <p className={styles.error}>There was an unknown error verifing this credential. <span className={styles.moreInfoLink} onClick={() => setMoreInfo(!moreInfo)}>More Info</span></p>
        {moreInfo && (
          <div className={styles.errorContainer}>
            <p>"Please try again, or let us know."</p>
          </div>
        )}
      </div>)
      
    } else {
      const { credential } = verificationResult.results[0];
      const hasCredentialStatus = credential.credentialStatus !== undefined;
      const hasRevocationStatus = hasStatusPurpose(credential, StatusPurpose.Revocation);
      const hasSuspensionStatus = hasStatusPurpose(credential, StatusPurpose.Suspension);
      return (
        <div className={styles.resultLog}>
          <div className={styles.issuer}>
            <div className={styles.header}>Issuer</div>
            <ResultItem
              verified={logMap[LogId.IssuerDIDResolves] ?? true}
              positiveMessage="Has been issued by a registered institution:"
              negativeMessage="Could not find issuer in registry with given DID."
              issuer={true}
            />
          </div>
          <div className={styles.credential}>
            <div className={styles.header}>Credential</div>
            <ResultItem
              verified={logMap[LogId.ValidSignature] ?? true}
              positiveMessage="Has a valid digital signature"
              negativeMessage="Has an invalid digital signature"
            />
            <ResultItem
              verified={logMap[LogId.Expiration] ?? true}
              positiveMessage="Has not expired"
              negativeMessage="Has expired"
            />
            {hasCredentialStatus && hasRevocationStatus &&
            <ResultItem
              verified={logMap[LogId.RevocationStatus] ?? true}
              positiveMessage="Has not been revoked by issuer"
              negativeMessage={verificationResult.hasStatusError?"Revocation status could not be checked":"Has been revoked by issuer"}
            />}
            {hasCredentialStatus && hasSuspensionStatus &&
            <ResultItem
              verified={logMap[LogId.SuspensionStatus] ?? true}
              positiveMessage="Has not been suspended by issuer"
              negativeMessage="Has been suspended by issuer"
            />}
          </div>
        </div>
      )
    }
  }

  return (
    result()
  );
}
