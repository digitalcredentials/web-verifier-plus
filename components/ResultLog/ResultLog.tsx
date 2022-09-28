import type { ResultLogProps } from './ResultLog.d';
import styles from './ResultLog.module.css';

export const ResultLog = ({ verificationResult }: ResultLogProps) => {
  const ResultItem = ({verified = true, positiveMessage = '', negativeMessage = '', issuer = false}) => {
    return (
      <div className={styles.resultItem}>
        <span aria-hidden className={`material-icons ${verified ? styles.verified : styles.notVerified}`}>
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
  // console.log('1: ', verificationResult);
  // console.log('2: ',verificationResult.results[0]);
  // console.log('3: ',verificationResult.results[0]?.log);
  const logMap = verificationResult.results[0]?.log?.reduce((acc: Record<string, boolean>, log) => {
    acc[log.id] = log.valid;
    return acc;
  }, {}) ?? {};

  // console.log('logmap: ', logMap);
  // console.log(logMap['issuer_did_resolves']);


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
  );
}