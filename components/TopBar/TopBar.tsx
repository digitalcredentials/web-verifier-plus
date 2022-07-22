import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import { useEffect, useState } from "react"
import styles from './TopBar.module.css'

export const TopBar = () => {
  const [isDark, setIsDark] = useState(false);

  // get local storage value for darkmode on mount
  useEffect(() => {
    let darkMode = localStorage.getItem('darkMode');
    //console.log('darkMode: ', darkMode);
    if (darkMode === 'true') { setIsDark(true); enableDarkMode(); }
    else { setIsDark(false); }
  },[]);

  const enableDarkMode = () => {
    //console.log('enableDarkMode');
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'true');
    setIsDark(true);
  }

  const disableDarkMode = () => {
    //console.log('disableDarkMode');
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', 'false');
    setIsDark(false)
  }

  const handleToggle = () => {
    //console.log('handleToggle');
    //console.log('isDark: ', isDark);
    if (isDark) {
      disableDarkMode();
    }
    else {
      enableDarkMode();
    }
  }

  return(
      <div className={styles.container}>
        <div className={styles.switchContainer}>
          <ToggleSwitch
            isOn={isDark}
            handleToggle={handleToggle}
            icon={ <span className={`material-icons ${styles.darkmodeIcon}`}> dark_mode </span> }
          />
        </div>
        <div className={styles.loginContainer}>
          <span className={`material-icons ${styles.loginIcon}`}> login </span>
          <span className={styles.loginText}>Login</span>
        </div>
        
      </div>
  )
}