import { useVerificationContext } from "lib/verificationContext";
import styles from './VerifyIndicator.module.css';

export const VerifyIndicator = () => {
  const { loading, verificationResult } = useVerificationContext();
  let className: string = '';
  let icon: JSX.Element | null = null;
  let text: string = '';

  const result = verificationResult?.results?.[0];
  const log = result?.log ?? [];
  const issuerLog = log.find(entry => entry.id === 'registered_issuer');
  const issuerWarning = issuerLog && issuerLog.valid === false;

  if (loading) {
    className = styles.loading;
    text = 'Verifying...';
  } else if (issuerWarning) {
    icon = <span className={`material-icons ${styles.indicatorIcon}`}>priority_high</span>;
    text = 'Warning';
    className = styles.warning;
  } else if (verificationResult?.verified) {
    icon = <span className={`material-icons ${styles.indicatorIcon}`}>check_circle</span>;
    text = 'Verified';
    className = styles.verified;
  } else {
    icon = <span className={`material-icons ${styles.indicatorIcon}`}>cancel</span>;
    text = 'Not Verified';
    className = styles.notVerified;
  }

  return (
    <div className={styles.container}>
      <span className={`${styles.indicator} ${className}`}>
        {icon}
        {text}
      </span>
    </div>
  );
};
