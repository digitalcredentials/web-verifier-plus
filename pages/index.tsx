import type { NextPage } from 'next'
import styles from './index.module.css'
import { Button } from 'components/Button/Button'
import { useEffect, useState,  } from 'react'
import { ScanModal } from 'components/ScanModal/ScanModal'
import { VerifiablePresentation } from 'types/presentation'
import { CredentialCard } from 'components/CredentialCard/CredentialCard'
import { Container } from 'components/Container/Container'
import { VerificationCard } from 'components/VerificationCard/VerificationCard'
import { VerificationContext } from 'lib/verificationContext'
import { Credential } from 'types/credential'
import { useVerification } from 'lib/useVerification'
import { credentialsFromQrText } from 'lib/decode';
import { TopBar } from 'components/TopBar/TopBar'
import { BottomBar } from 'components/BottomBar/BottomBar'
import { extractCredentialsFrom, VerifiableObject } from 'lib/verifiableObject'

// NOTE: We currently only support one credential at a time. If a presentation with more than one credential
// is dropped, pasted, or scanned we only look at the first one

const Home: NextPage = () => {
  const [textArea, setTextArea] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [textAreaError, setTextAreaError] = useState(false);
  const [fileError, setFileError] = useState(false);
  const [scanError, setScanError] = useState(false);
  const [credential, setCredential] = useState<Credential | undefined>(undefined);
  const credentialContext = useVerification(credential);
  
  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "VerifierPlus Home page";
    window.addEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string ?? '';
        const result = verifyCredential(text);
        if (!result) {
          console.log('file parse error');
          setFileError(true);
        } else {
          // console.log('no file parse error');
          setFileError(false);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file]);
  
  function handlePop() {
    history.replaceState(null, '', '');
    setCredential(undefined);
  }

  function checkJson(json: string) {
    try {
      JSON.parse(json);
    } catch {
      return false;
    }
    return true;
  }

  function verifyCredential(json: string) {
    const result = checkJson(json);
    if (!result) { return result; }
    const parsedJson = JSON.parse(json);
    let newCredential: VerifiableObject = parsedJson;

    const vc = extractCredentialsFrom(newCredential);
    if (vc === null) { return; }
    history.pushState(null, '', '#verify/results');
    // get first cred. this will eventually need to be changed
    setCredential(vc[0]);
    return result;
  } 

  function ScanButtonOnClick() {
    setIsOpen(!isOpen);
  }

  function verifyTextArea() {
    // console.log("verify button was pushed");
    const result = verifyCredential(textArea);
    if (!result) {
      setTextAreaError(true);
    } else {
      // console.log('no text area parse error');
      setTextAreaError(false);
    }
  }

  async function onScan(json: string) {
    const fromqr = await credentialsFromQrText(json);
    if (fromqr === null) { return; }
    // get first cred. this will eventually need to be changed
    const cred = fromqr[0];

    history.pushState(null, '', '#verify/results');
    setCredential(cred);
  }

  function handleFileDrop(e: React.DragEvent<HTMLInputElement>) {
    console.log("file was dropped");
    e.stopPropagation();
    e.preventDefault();
    setFile(e.dataTransfer.items[0].getAsFile())
  }

  function handleBrowse(e: React.ChangeEvent<HTMLInputElement>) {
    console.log(e);
    setFile(e.target.files !== null ? e.target.files[0] : null);
  }

  if (credential !== undefined) {
    return (
      <div className={styles.container}>
        <TopBar hasLogo={true} isDark={isDark} setIsDark={setIsDark} />
        <div className={styles.verifyContainer}>
          <VerificationContext.Provider value={credentialContext}>
            <Container>
              <CredentialCard credential={credential} />
              <VerificationCard />
            </Container>
          </VerificationContext.Provider>
        </div>
        
        <BottomBar isDark={isDark}/>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <TopBar isDark={isDark} setIsDark={setIsDark} />
      <div className={styles.contentContainer}>
        <div>
          <h1 className={styles.title}>
            VerifierPlus
          </h1>
        </div>
        <div>
          <p className={styles.descriptionBlock}>
            This is an explanation of what this site is and what it does. 
            This is an explanation of what this site is and what it does. 
            This is an explanation of what this site is and what it does. <a className={styles.trustLink}>Why trust us?</a>
          </p>
        </div>
        <Button 
          icon={<span className="material-icons">qr_code_scanner</span>} 
          className={styles.scan} 
          text='Scan QR Code'
          onClick={ScanButtonOnClick}
        />

        {scanError && (
          <div className={styles.errorContainer}>  
            <span className="material-icons-outlined">
              warning
            </span>
            <p className={styles.error}>
              Invalid Qr code
            </p>
          </div>
        )}

        <div className={styles.textAreaContainer}>
            <textarea
            className={styles.textarea}
            placeholder='Paste JSON or URL'
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
            id='textarea'
            title='Input for raw JSON'
          />
          <Button className={styles.verifyTextArea} text='Verify' onClick={verifyTextArea}/>
        </div>

        {textAreaError && (
          <div className={styles.errorContainer}>  
            <span className="material-icons-outlined">
              warning
            </span>
            <p className={styles.error}>
              Json cannot be parsed
            </p>
          </div>
      )}

        <div
          className={styles.dndUpload}
          onDrop={handleFileDrop}
          onDragOver={(e) => { e.preventDefault(); }}
          >
            <div className={styles.dndUploadText}>
              Drag and drop a file here or <label className={styles.fileUpload}>
                <input type='file' onChange={handleBrowse} />
                <span className={styles.browseLink}>browse</span>
              </label>
            </div>
            <span className={styles.supportText}>Supports JSON</span>
        </div>

        {fileError && (
          <div className={styles.errorContainer}>  
            <span className="material-icons-outlined">
              warning
            </span>
            <p className={styles.error}>
              Json cannot be parsed
            </p>
          </div>
      )}
        <ScanModal isOpen={isOpen} setIsOpen={setIsOpen} onScan={onScan} setErrorMessage={setScanError} />
      </div>
      <BottomBar isDark={isDark}/>
    </div>
  )
}

export default Home
