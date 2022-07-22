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

const Home: NextPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [presentation, setPresentation] = useState<VerifiablePresentation | null>(null);
  const credentialContext = useVerification(Array.isArray(presentation?.verifiableCredential) ? presentation?.verifiableCredential[0] : presentation?.verifiableCredential as Credential);

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string ?? '';
        try {
          const presentation = JSON.parse(text) as VerifiablePresentation;
          // TODO: verify that it is a valid presentation
          setPresentation(presentation);
        } catch {
          console.log('there was an error');
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file]);

  function ScanButtonOnClick() {
    setIsOpen(!isOpen);
  }

  async function onScan(result: string) {
    setPresentation(await credentialsFromQrText(result));
  }

  function handleFileDrop(e) {
    console.log("file was dropped");
    e.stopPropagation();
    e.preventDefault();
    setFile(e.dataTransfer.items[0].getAsFile())
  }

  function handleBrowse(e) {
    console.log(e);
    setFile(e.target.files[0]);
  }
  if (presentation !== null) {
    return (
      <VerificationContext.Provider value={credentialContext}>
        <TopBar />
        <Container>
          <CredentialCard presentation={presentation} />
          <VerificationCard />
        </Container>
      </VerificationContext.Provider>
    );
  }

  return (
    <div className={styles.container}>
      <TopBar />
        <div>
          <p className={styles.title}>
            DCC Verifier+
          </p>
        </div>
        <div>
          <p className={styles.descriptionBlock}>
            This is an explanation of what this site is and what it does. This is an explanation of what this site is and what it does. This is an explanation of what this site is and what it does.
          </p>
        </div>
        <Button 
          icon={<span className="material-icons">qr_code_scanner</span>} 
          className={styles.scan} 
          text='Scan QR Code'
          onClick={ScanButtonOnClick}
        />
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
        <textarea
          className={styles.textarea}
          placeholder='Paste JSON or URL'
        />
        <ScanModal isOpen={isOpen} setIsOpen={setIsOpen} onScan={onScan}/>
    </div>
  )
}

export default Home
