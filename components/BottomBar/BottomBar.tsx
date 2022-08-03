import type { BottomBarProps } from './BottomBar.d'
import styles from './BottomBar.module.css'

export const BottomBar = ({isDark}: BottomBarProps) => {

  return(
    <div className={styles.container}>
      <div className={styles.logoContainer}>
        <a>
          <img
            src={isDark ? '/DarkModeLogo.png' : '/LightModeLogo.png'}
            alt='logo'
            className={styles.logo}
          />
        </a>
      </div>
      <div className={styles.linkContainer}>
        <a className={styles.link}>DCC</a>
        <a className={styles.link}>MIT Open Learning</a>
        <a className={styles.link}>Accessibility</a>
        <a className={styles.link}>View on Github</a>
      </div>
    </div>
  )
}