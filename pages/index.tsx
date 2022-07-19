import type { NextPage } from 'next'
import styles from './index.module.css'
import { Button } from 'components/Button/Button'
import { useState } from 'react'
import { BottomBar } from 'components/BottomBar/BottomBar'
import { ScanModal } from 'components/ScanModal/ScanModal'

const Home: NextPage = () => {
  const [file, setFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  function ScanButtonOnClick() {
    setIsOpen(!isOpen);
  }

  function handleFileDrop(e) {
    e.stopPropagation();
    e.preventDefault();
    setFile(e.dataTransfer.items[0].getAsFile())
  }

  function handleBrowse(e) {
    console.log(e);
    setFile(e.target.files[0]);
  }

  return (
    <div className={styles.container}>
      {/* <TopBar /> */}
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
        <textarea className={styles.textarea} placeholder='Past JSON or URL' />
        {/* <BottomBar /> */}
        <ScanModal isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  )
}

export default Home
