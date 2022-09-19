import type { BottomBarProps } from './BottomBar.d'
import styles from './BottomBar.module.css'

export const BottomBar = ({isDark}: BottomBarProps) => {
  return(
    <div className={styles.container}>
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
        <a href='/html/terms.html' className={styles.link}>Terms and Conditions of Use</a>
        <a href='/html/privacy.html' className={styles.link}>Privacy Policy</a>
        <a className={styles.link} href='https://accessibility.mit.edu/'>Accessibility</a>
        <a className={styles.link}>View on Github</a>
      </div>
      <p className={styles.version}>VerifierPlus Version 1.0.1</p>
    </div>
  )
}