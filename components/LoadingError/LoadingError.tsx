import styles from './LoadingError.module.css'

export const LoadingError = () => {

  return(
    <div className={styles.loadingErrorContainer}>
      <h1 className={styles.errorCode}>404 credential not found</h1>
      <h3 className={styles.message}>Double check that you used the right public id for your credential</h3>
    </div>
  )
}