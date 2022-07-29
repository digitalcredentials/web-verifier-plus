import styles from './BottomBar.module.css'

export const BottomBar = () => {
  return(
    <div className={styles.container}>
      <a className={styles.link}>DCC</a>
      <a className={styles.link}>MIT Open Learning</a>
      {/* <a className={styles.link}>Terms & Conditions</a> */}
      {/* <a className={styles.link}>Privacy Policy</a> */}
      <a className={styles.link}>Accessibility</a>
      <a className={styles.link}>View on Github</a>
    </div>
  )
}