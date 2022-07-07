import type { ButtonProps } from './Button.d';
import styles from './Button.module.css';
export const Button = ({secondary = false, onClick = () => {}, text, icon = null}: ButtonProps) => {
  return (
    <button className={`${styles.button} ${secondary ? styles.secondaryButton : ''}`} onClick={onClick}>
      {icon} {text}
    </button>
  )
}