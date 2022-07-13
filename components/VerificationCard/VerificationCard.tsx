import { VerificationControls } from 'components/VerificationControls/VerificationControls';
import { useVerificationContext } from 'lib/verificationContext';
import { VerifyResult } from 'types/credential';
import styles from './VerificationCard.module.css';

export const VerificationCard = () => {
  const { loading, verificationResult, verifyCredential } = useVerificationContext();
  return (
    <div className={styles.card}>
      <div className={styles.verification}>
        {
          loading ? (
            <div className={styles.loadingIndicator}>
              <span className="material-icons">sync</span>
              Verifying
            </div>
          ) : (
            <VerificationControls verificationResult={verificationResult as VerifyResult} verifyCredential={verifyCredential} />
          )
        }
      </div>
      <div className={styles.resultLog}>
        {
          loading ? (
            <div className={styles.loadingMessage}>Please wait while we verify your credential.</div>
          ) : (
            <div>Put log here</div>
          )
        }
      </div>
    </div>
  );
};
