import type { NextPage } from 'next'
import * as polyfill from 'credential-handler-polyfill'
import styles from './index.module.css'
import { Button } from 'components/Button/Button'
import { useEffect, useState  } from 'react'
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

    polyfill.loadOnce()
      .then((_: any) => { console.log('CHAPI polyfill loaded.') })
      .catch((e: any) => { console.error('Error loading CHAPI polyfill:', e) })

    const handlePopstate = () => {
      if (window.location.hash === '/') {
        setCredential(undefined);
        setWasMulti(false);
      } else {
        window.location.replace('/');
      }
    };

    window.addEventListener('popstate', handlePopstate);
  }, []);

  useEffect(() => {
    if (credential === undefined) {
      setTextAreaError(false);
      setFileError(false);
      setScanError(false);
    }
  }, [credential])

  useEffect(() => {
    if (file !== null) {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        let text = e.target?.result as string ?? '';
        if(file.type == 'image/png'){
          // Search for keyword and extract the object following it
          const keyword = 'openbadgecredential';  
          const keywordIndex = text.indexOf(keyword);

          // Check if the keyword is found
          if (keywordIndex !== -1) {
            // Extract the portion of the string after the keyword
            const startIndex = keywordIndex + keyword.length;

            // Find start of the object
            const objectStart = text.indexOf('{', startIndex);

            if (objectStart !== -1) {
              // Find matching closing brace
              let braceCount = 0;
              let objectEnd = objectStart;

              while (objectEnd < text.length) {
                if (text[objectEnd] === '{') {
                  braceCount++;
                } else if (text[objectEnd] === '}') {
                  braceCount--;
                }

                // When brace count goes back to zero = found the end of object
                if (braceCount === 0) {
                  break;
                }

                objectEnd++;
              }

              // Slice string to capture the entire object (including braces)
              const objectString = text.slice(objectStart, objectEnd + 1);

              // Parse object
              try {
                const parsedObject = JSON.parse(objectString);
                text = JSON.stringify(parsedObject, null, 2);
              } catch (error) {
                console.error('Failed to parse JSON:', error);
              }
            } 
          } else {
            console.log('Keyword not found');
          }
        }

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

  async function requestVcOnClick() {
    const credentialQuery = {
      web: {
        VerifiablePresentation: {
          query: [
            {
              type: 'QueryByExample',
              credentialQuery: {
                reason: 'VerifierPlus is requesting any credential for verification.',
                example: {
                  type: ['VerifiableCredential']
                }
              }
            }
          ]
        }
      }
    } as CredentialRequestOptions

    const chapiResult = await navigator.credentials.get(credentialQuery) as any

    if(!chapiResult?.data) {
      console.log('no credentials received');
    }

    console.log(chapiResult);

    const { data: vp } = chapiResult
    // @ts-ignore
    const vc = extractCredentialsFrom(vp)[0]

    console.log('Extracted VC:', vc)

    setCredential(vc)
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
            VerifierPlus
          </h1>
        </div>
        <div>
          <p className={styles.descriptionBlock}>
            VerifierPlus allows users to verify any <Link href='faq#supported'>supported</Link> digital academic
            credential.
            This site is hosted by
            the <a href='https://digitalcredentials.mit.edu/'>Digital Credentials Consortium</a>
            , a network of leading international universities designing an open
            infrastructure for digital academic credentials. <Link href='faq#trust'>Why trust us?</Link>
          </p>
        </div>

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

        <div>
          <Button
            icon={<span className="material-icons">wallet</span>}
            className={styles.scan}
            text='Request Credential from Wallet'
            onClick={requestVcOnClick}
          />
        </div>

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
            The JSON is not a Verifiable Credential or an Open Badge 3.0
            </p>
          </div>
        )}

        <div
          className={styles.dndUpload}
          onDrop={handleFileDrop}
          onDragOver={(e) => {
            e.preventDefault();
          }}
        >
          <div className={styles.dndUploadText}>
            Drag and drop a file here or <label className={styles.fileUpload}>
            <input type='file' onChange={handleBrowse}/>
            <span className={styles.browseLink}>browse</span>
          </label>
          </div>
          <span className={styles.supportText}>Supports JSON</span>
        </div>

        <div style={{marginTop: '1em'}}>
          <Button
            icon={<span className="material-icons">qr_code_scanner</span>}
            className={styles.scan}
            text='Scan QR Code'
            onClick={ScanButtonOnClick}
          />
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
        <ScanModal isOpen={isOpen} setIsOpen={setIsOpen} onScan={onScan} setErrorMessage={setScanError}/>
      </div>
      <BottomBar isDark={isDark}/>
    </main>
  )
}

export default Home
