import { NextPage } from "next";
import styles from './infopages.module.css'
import { BottomBar } from "components/BottomBar/BottomBar";
import { TopBar } from "components/TopBar/TopBar";
import { useEffect, useState } from "react";

const Privacy: NextPage = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "VerifierPlus Home page";
  }, []);

  return (
    <main className={styles.main}>
      <TopBar hasLogo={true} isDark={isDark} setIsDark={setIsDark}/>
      <div className={styles.textContent}>
        <div>
          <h1 className={styles.title}>VerifierPlus Privacy Policy</h1>
          <h2>Introduction</h2>
          <p>VerifierPlus is an open source open source digital credential verification and public sharing website developed by the <a href="https://digitalcredentials.mit.edu">Digital Credentials Consortium</a>, a network of leading international universities designing an open infrastructure for academic credentials.</p>
          <p>This Privacy Policy explains how VerifierPlus collects, uses, and processes personal information about our learners.</p>
          <h2>What Personal Information We Collect</h2>
          <p>We do not collect any personal information.</p>
          <h2>Additional Information</h2>
          <p>We may change this Privacy Policy from time to time. If we make any significant changes in the way we treat your personal information we will make this clear on our website or by contacting you directly.</p>
          <p>The controller for your personal information is the VerifierPlus project at MIT. We can be contacted at verifierplus-support@mit.edu.</p>
        </div>
      </div>
      <BottomBar isDark={isDark}/>
    </main>
  );
}

export default Privacy;
