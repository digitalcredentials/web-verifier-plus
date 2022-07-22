import type {ToggleSwitchProps} from './ToggleSwitch.d'
import styles from './ToggleSwitch.module.css';

export const ToggleSwitch = ({ icon, isOn, handleToggle }: ToggleSwitchProps) => {
  // isOn = true : ball is on left hand side
  // isOn = false : ball is on the right hand side

  return(
    <div>
      <div className={styles.container}>
        {icon}
        <label
          className={styles.switch}
          // onClick={handleToggle}
        >
          <input
            type="checkbox"
            onClick={handleToggle}
          />
          <span className={styles.slider}></span>
        </label>
      </div>
    </div>
  )

}