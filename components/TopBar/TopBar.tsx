import type { TopBarProps } from "./TopBar.d"
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import Link from "next/link";
import { useEffect, useState } from "react"
import styles from './TopBar.module.css'

//TODO: home button

export const TopBar = ({hasLogo}: TopBarProps) => {
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
        { hasLogo ? 
          <div className={styles.logo}>
            {/* <image></image> */}
            <p>DCC Verifier</p>
          </div>
         : null
        }
        <ToggleSwitch
          isOn={isDark}
          handleToggle={handleToggle}
          icon={ <span aria-hidden className={`material-icons ${styles.darkmodeIcon}`}> dark_mode </span> }
        />
        <button className={styles.loginButton} type='button'>
          <span aria-hidden className={`material-icons ${styles.loginIcon}`}> login </span>
          Login
        </button>
        
      </div>
  )
}