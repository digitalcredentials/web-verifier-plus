import type { BottomBarProps } from './BottomBar.d'
import styles from './BottomBar.module.css'

export const BottomBar = ({isDark}: BottomBarProps) => {

  const getVersionNumber = () => {
    const gitCommit = '98c0a2a';
    const version = "0.1.0";

    return gitCommit + ' ' + version;

  }

  return(
    <footer className={styles.container}>
      <div className={styles.logoContainer}>
        <a href='https://digitalcredentials.mit.edu/'>
          <img
            src={isDark ? '/DarkModeLogo.png' : '/LightModeLogo.png'}
            alt='Digital Credenials Consortium logo'
            className={styles.logo}
          />
        </a>
      </div>
      <div className={styles.linkContainer}>
        <a href='/terms' className={styles.link}>Terms and Conditions of Use</a>
        <a href='/privacy' className={styles.link}>Privacy Policy</a>
        <a className={styles.link} href='https://accessibility.mit.edu/'>Accessibility</a>
        <a className={styles.link}>View on Github</a>
      </div>
      <p className={styles.version}>VerifierPlus Version {getVersionNumber()}</p>
    </footer>
  )
}