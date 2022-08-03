import type { TopBarProps } from "./TopBar.d"
import { ToggleSwitch } from "components/ToggleSwitch/ToggleSwitch";
import Link from "next/link";
import { useEffect, useState } from "react"
import styles from './TopBar.module.css'

//TODO: home button
//TODO: if hasLogo === true, set background of to dif color

export const TopBar = ({hasLogo = false, isDark, setIsDark}: TopBarProps) => {

  // get local storage value for darkmode on mount
  useEffect(() => {
    let darkMode = localStorage.getItem('darkMode');
    if (darkMode === 'true') { setIsDark(true); enableDarkMode(); }
    else { setIsDark(false); }
  },[]);

  const enableDarkMode = () => {
    document.body.classList.add('darkmode');
    localStorage.setItem('darkMode', 'true');
    setIsDark(true);
  }

  const disableDarkMode = () => {
    document.body.classList.remove('darkmode');
    localStorage.setItem('darkMode', 'false');
    setIsDark(false)
  }

  const handleToggle = () => {
    if (isDark) {
      disableDarkMode();
    }
    else {
      enableDarkMode();
    }
  }

  return(
      <div className={`${hasLogo ? styles.hasLogoContainer : styles.container}`}>
        { hasLogo ? 
          <div className={styles.logo}>
            <p>Verifier+</p>
          </div>
         : null
        }
        <ToggleSwitch
          isOn={isDark}
          handleToggle={handleToggle}
          icon={ <span aria-hidden className={`material-icons ${styles.darkmodeIcon}`}> dark_mode </span> }
        />
        {/* <button className={styles.loginButton} type='button'>
          <span aria-hidden className={`material-icons ${styles.loginIcon}`}> login </span>
          Login
        </button> */}
        
      </div>
  )
}