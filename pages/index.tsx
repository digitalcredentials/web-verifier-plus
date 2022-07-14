import type { NextPage } from 'next'
import styles from './index.module.css'
import { Button } from 'components/Button/Button'
import { useState } from 'react'

const Home: NextPage = () => {
  const [file, setFile] = useState(null);

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
      <div className={styles.wrapper}>
        <div>
          <p className={styles.title}>
            DCC Verifier+
          </p>
        </div>
        <div>
          <p className={styles.description}>
            This is an explanation of what this site is and what it does. This is an explanation of what this site is and what it does. This is an explanation of what this site is and what it does.
          </p>
        </div>
        <Button text='Scan QR Code' />
        <div
          className={styles.dndUpload}
          onDrop={handleFileDrop}
          onDragOver={(e) => { e.preventDefault(); }}
          >
            Drag and drop a file here or <label className={styles.fileUpload}>
              <input type='file' onChange={handleBrowse} />
              <span className={styles.browseLink}>browse</span>
            </label>
            <h6>Supports JSON</h6>
        </div>
        <textarea className={styles.textarea} placeholder='Past JSON or URL' />
      </div>
    </div>
  )
}

export default Home
