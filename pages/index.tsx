import type { NextPage } from 'next'
import styles from './index.module.css'
import { Button } from 'components/Button/Button'
import { useEffect, useState,  } from 'react'
import { ScanModal } from 'components/ScanModal/ScanModal'
import { CredentialCard } from 'components/CredentialCard/CredentialCard'
import { Container } from 'components/Container/Container'
import { VerificationCard } from 'components/VerificationCard/VerificationCard'
import { VerificationContext } from 'lib/verificationContext'
import { VerifiableCredential } from 'types/credential'
import { useVerification } from 'lib/useVerification'
import { credentialsFromQrText } from 'lib/decode';
import { TopBar } from 'components/TopBar/TopBar'
import { BottomBar } from 'components/BottomBar/BottomBar'
import { extractCredentialsFrom, VerifiableObject } from 'lib/verifiableObject'
import Link from 'next/link'

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
  const [credential, setCredential] = useState<VerifiableCredential | undefined>(undefined);
  const credentialContext = useVerification(credential);
  const [wasMulti, setWasMulti] = useState(false);

  useEffect(() => {
    document.documentElement.lang = "en";
    document.title = "VerifierPlus Home page";
    window.addEventListener('popstate', handlePop);
  }, []);

  useEffect(() => {
    if (credential === undefined) {
      setTextAreaError(false);
      setFileError(false);
      setScanError(false);
      // history.replaceState(null, '', '');
    }
  }, [credential])

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
          setFileError(false);
        }
      };
      reader.readAsText(file, 'UTF-8');
    }
  }, [file]);

  function handlePop() {
    setCredential(undefined);
    setWasMulti(false);
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
    if(vc.length > 1) { setWasMulti(true); }
    setCredential(vc[0]);
    return result;
  }

  function ScanButtonOnClick() {
    setIsOpen(!isOpen);
  }

  async function getJSONFromURL(url: string) {
    try {
      let response = await fetch(url);
      let responseJson = await response.json(); //.json()
      return JSON.stringify(responseJson);
    } catch (error) {
      console.error(error);
      return "";
    }
  }

  async function verifyTextArea() {
    // check if textarea is json
    let input = "";
    if (!checkJson(textArea)) {
      const fromUrl = await getJSONFromURL(textArea);
      if (fromUrl !== "") {
        // console.log(fromUrl);
        input = fromUrl;
      }
    } else { input = textArea; }
    // if its not json check if its a url

    const result = verifyCredential(input);
    if (!result) {
      setTextAreaError(true);
    } else {
      setTextAreaError(false);
    }
  }

  async function onScan(json: string) : Promise<Boolean> {
    const fromqr = await credentialsFromQrText(json);
    // console.log('here');
    // console.log(fromqr);
    if (fromqr === null) { return false; }
    // get first cred. this will eventually need to be changed
    const cred = fromqr[0];

    history.pushState(null, '', '#verify/results');
    if(fromqr.length > 1) { setWasMulti(true); }
    setCredential(cred);
    return true;
  }

  function handleFileDrop(e: React.DragEvent<HTMLInputElement>) {
    console.log("file was dropped");
    e.stopPropagation();
    e.preventDefault();
    setFile(e.dataTransfer.items[0].getAsFile())
  }

  function handleBrowse(e: React.ChangeEvent<HTMLInputElement>) {
    // console.log(e);
    setFile(e.target.files !== null ? e.target.files[0] : null);
  }

  if (credential !== undefined) {
    return (
      <main className={styles.container}>
        <TopBar hasLogo={true} isDark={isDark} setIsDark={setIsDark} setCredential={setCredential}/>
        <div className={styles.verifyContainer}>
          <VerificationContext.Provider value={credentialContext}>
            <Container>
              <CredentialCard credential={credential} wasMulti={wasMulti}/>
              <VerificationCard />
            </Container>
          </VerificationContext.Provider>
        </div>

        <BottomBar isDark={isDark}/>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <TopBar isDark={isDark} setIsDark={setIsDark} setCredential={setCredential}/>
      <div className={styles.contentContainer}>
        <div>
          <h1 className={styles.title}>
            VerifierPlus <span className={styles.betaTag}>Beta</span>
          </h1>
        </div>
        <div>
          <p className={styles.descriptionBlock}>
            VerifierPlus allows users to verify any <Link href='faq#supported'>supported</Link> digital academic credential.
            This site is hosted by
             the <a href='https://digitalcredentials.mit.edu/'>Digital Credentials Consortium</a>
             , a network of leading international universities designing an open
              infrastructure for digital academic credentials. <Link href='faq#trust'>Why trust us?</Link>
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
              Invalid QR code
            </p>
          </div>
        )}

        <div className={styles.textAreaContainer}>
          <div className={styles.floatingTextarea}>
            <textarea
              aria-labelledby='textarea-label'
              placeholder=' '
              value={textArea}
              onChange={(e) => setTextArea(e.target.value)}
              id='textarea'
            />
            <label id='textarea-label' htmlFor='textarea'>Paste JSON or URL</label>
          </div>
          <Button className={styles.verifyTextArea} text='Verify' onClick={verifyTextArea}/>
        </div>

        {textAreaError && (
          <div className={styles.errorContainer}>
            <span className="material-icons-outlined">
              warning
            </span>
            <p className={styles.error}>
              JSON cannot be parsed
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
    </main>
  )
}

export default Home
