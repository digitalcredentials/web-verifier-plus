import { Button } from 'components/Button/Button';
import type { ScanModalProps } from './ScanModal.d';
import styles from './ScanModal.module.css';
import { QrReader } from 'react-qr-reader';
import { useState } from 'react';

export const ScanModal = ({ isOpen, setIsOpen }: ScanModalProps) => {
  //TODO: change hover style of close icon if possible
  //TODO: add scan capabilities
  //TODO: close modal if something outside of modal is clicked?
  const [data, setData] = useState('');
  const handleScan = (newData, error) => {
    if (newData !== undefined){
      console.log(newData);
      setData(newData);
    }

    if (error){
      // console.log(error);
    }
  }
 
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      {
        isOpen ? (
          <div className={styles.container}>
            <div className={styles.topRow}>
              <span className={styles.title}>Scan a QR Code</span>
              <span 
                className="material-icons-outlined"
                onClick={closeModal}
              >
                close
              </span>
            </div>

            <div className={styles.cameraContainer}>
              <QrReader 
                onResult={(result, error) => handleScan(result, error)}
                constraints={{facingMode: "environment"}}
                className={styles.qrReader}
              />
            </div>
            <div className={styles.bottomRow}>
              {/* <p>{data}</p> */}
              <Button 
                className={styles.closeButton} 
                text='Close'
                onClick={closeModal} 
              />
            </div>
          </div>
        ) : null
      }
    </div>
  )
}