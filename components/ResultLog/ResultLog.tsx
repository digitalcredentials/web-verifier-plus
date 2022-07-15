import type { ResultLogProps } from './ResultLog.d';
import styles from './ResultLog.module.css';

export const ResultLog = ({ verificationResult }: ResultLogProps) => {
  const ResultItem = ({verified = true, positiveMessage = '', negativeMessage = ''}) => {
    return (
      <div className={styles.resultItem}>
        <span className={`material-icons ${verified ? styles.verified : styles.notVerified}`}>
          {verified ? 'check' : 'close'}
        </span>
        {verified ? positiveMessage : negativeMessage}
      </div>
    )
  }
  console.log(verificationResult);
  const logMap = verificationResult.results[0]?.log?.reduce((acc: Record<string, boolean>, log) => {
    acc[log.id] = log.valid;
    return acc;
  }, {}) ?? {};

  console.log(logMap)


  return (
    <div className={styles.resultLog}>
      <div className={styles.issuer}>
        <div className={styles.header}>Issuer</div>
        <ResultItem
          verified={logMap['issuer_did_resolves'] ?? true}
          positiveMessage="Issuing institution can be reached for verification"
          negativeMessage="Issuing institution cannot be reached for verification"
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