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

const Home: NextPage = () => {
  const [textArea, setTextArea] = useState('');
  const [isDark, setIsDark] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [presentation, setPresentation] = useState<VerifiablePresentation | null>(null);
  const credentialContext = useVerification(Array.isArray(presentation?.verifiableCredential) ? presentation?.verifiableCredential[0] : presentation?.verifiableCredential as Credential);
  
  useEffect(() => {
    window.addEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string ?? '';
        checkPresentation(text);
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file]);
  
  function handlePop() {
    history.replaceState(null, '', '');
    setPresentation(null);
  }

  function checkPresentation(json: string) {
    try {
      const presentation = JSON.parse(json) as VerifiablePresentation;
      verifyPresentation(presentation);
      history.pushState(null, '', '#verify/results');
      setPresentation(presentation);
    } catch {
      console.log('there was an error');
    }
  }

  function verifyPresentation(presentation: VerifiablePresentation) {
    console.log('write me');
  }
  function ScanButtonOnClick() {
    setIsOpen(!isOpen);
  }

  function verifyTextArea() {
    console.log("verify button was pushed");
    checkPresentation(textArea);
  }

  async function onScan(result: string) {
    history.pushState(null, '', '#test');
    setPresentation(await credentialsFromQrText(result));
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

  if (presentation !== null) {
    return (
      <div className={styles.container}>
        <TopBar hasLogo={true} isDark={isDark} setIsDark={setIsDark} />
        <div className={styles.verifyContainer}>
          <VerificationContext.Provider value={credentialContext}>
            <Container>
              <CredentialCard presentation={presentation} />
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
          <p className={styles.title}>
            VerifierPlus
          </p>
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
        <div className={styles.textAreaContainer}>
          <textarea
            className={styles.textarea}
            placeholder='Paste JSON or URL'
            value={textArea}
            onChange={(e) => setTextArea(e.target.value)}
          />
          <Button className={styles.verifyTextArea} text='Verify' onClick={verifyTextArea}/>
        </div>

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
        <ScanModal isOpen={isOpen} setIsOpen={setIsOpen} onScan={onScan}/>
      </div>
      <BottomBar isDark={isDark}/>
    </div>
  )
}

export default Home
