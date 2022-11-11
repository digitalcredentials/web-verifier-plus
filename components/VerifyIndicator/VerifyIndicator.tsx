import { useVerificationContext } from "lib/verificationContext";
import styles from './VerifyIndicator.module.css';

export const VerifyIndicator = () => {
  const { loading, verificationResult } = useVerificationContext();
  let className: string = '';
  let icon: JSX.Element | null = null;
  let text: string = '';
  if (loading) {
    className = styles.loading;
    text = 'Verifying...';
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
}