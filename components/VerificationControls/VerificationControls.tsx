import { DateTime } from 'luxon';
import type { VerificationControlsProps } from './VerificationControls.d';
import styles from './VerificationControls.module.css';

export const VerificationControls = ({ verificationResult, verifyCredential }: VerificationControlsProps ) => {
  const { verified } = verificationResult;
  return (
    <div>
      <div className={styles.result}>
        <span className={`material-icons ${verified ? styles.verified : styles.notVerified}`}>
          {verified ? 'check_circle' : 'cancel'}
        </span>
        <div className={styles.messageContainer}>
          <div>
            {verified ? 'Credential Verified' : 'Credential Not Verified'}
          </div>
          <div className={styles.lastChecked}>Last Checked: {DateTime.now().toLocaleString(DateTime.DATE_MED)}</div>
        </div>
      </div>
      <button className={styles.verifyButton} type="button" onClick={verifyCredential}>
        <span className="material-icons">sync</span>
        Run Verification
      </button>
    </div>
  );
};