import { useState } from 'react';
import { CredentialError } from 'types/credential';
import type { ResultLogProps } from './ResultLog.d';
import styles from './ResultLog.module.css';

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
              <li>DCC Trust Registry</li>
            </ul> :
            null
          }
        </div>
      </div>
    )
  }

  const logMap = verificationResult.results[0]?.log?.reduce((acc: Record<string, boolean>, log) => {
    acc[log.id] = log.valid;
    return acc;
  }, {}) ?? {};

  console.log(verificationResult.results[0]);
  let hasError = false;
  let error: CredentialError;
  if (verificationResult.results[0].error) {
    hasError = true;
    error = verificationResult.results[0].error
    console.log('Error: ', error);
  }

  const result = () => {
    if (hasError) {
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
    } else {
      return (
        <div className={styles.resultLog}>
          <div className={styles.issuer}>
            <div className={styles.header}>Issuer</div>
            <ResultItem
              verified={logMap['issuer_did_resolves'] ?? true}
              positiveMessage="Has been issued by a registered institution:"
              negativeMessage="Issuing institution cannot be reached for verification"
              issuer={true}
            />
          </div>
          <div className={styles.credential}>
            <div className={styles.header}>Credential</div>
            <ResultItem
              verified={logMap['valid_signature'] ?? true}
              positiveMessage="Has a valid digital signature"
              negativeMessage="Has an invalid digital signature"
            />
            <ResultItem
              verified={logMap['expiration'] ?? true}
              positiveMessage="Has not expired"
              negativeMessage="Has expired"
            />
            <ResultItem
              verified={logMap['revocation_status'] ?? true}
              positiveMessage="Has not been revoked by issuer"
              negativeMessage="Has been revoked by issuer"
            />
          </div>
        </div>
      )
    }
  }

  return (
    result()
  );
}
