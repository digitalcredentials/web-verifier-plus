import { DateTime } from 'luxon';
import { Button } from 'components/Button/Button';
import { CompletionDocumentSection } from 'components/CompletionDocumentSection/CompletionDocumentSection';
import { Issuer } from 'components/Issuer/Issuer';
import { Credential, IssuerObject } from 'types/credential';
import type {CredentialCardProps} from './CredentialCard.d';
import styles from './CredentialCard.module.css';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import { QRCodeSVG } from 'qrcode.react';
import { VerifyIndicator } from 'components/VerifyIndicator/VerifyIndicator';
import { IssuerInfoModal } from 'components/IssuerInfoModal/IssuerInfoModal';
import { useState } from 'react';

export const CredentialCard = ({ credential }: CredentialCardProps) => {
  //TODO: add back IssuerInfoModal
  //TODO: add icon back to Issuer
  const issuer = credential.issuer as IssuerObject; // TODO figure out other issuer type
  const [isOpen, setIsOpen] = useState(false);

  const infoButtonPushed = () => {
    setIsOpen(true);
  }

  return (
    <main aria-labelledby='title'>
      <div className={styles.card}>
        <div className={styles.topCard}>
          <div className={styles.verifyContainer}>
            <VerifyIndicator />
            <div className={styles.buttonContainer}>
              {/* <Button
                text="Share"
                icon={<span className="material-icons">share</span>}
                secondary
              /> */}
              {/* <Button
                // className={styles.viewSource}
                icon={<span className="material-icons">code</span>}
                text="View Source"
                secondary
              /> */}
            </div>
          </div>
          <h1 id='title' className={styles.credentialName}>{credential.credentialSubject.hasCredential?.name}</h1>
          <div className={styles.subjectName}>Issued to: {credential.credentialSubject.name}</div>
        </div>
        <div className={styles.mainCard}>
          <div className={styles.secondaryColumn}>
            <section>
              <Issuer issuer={issuer} infoButtonPushed={infoButtonPushed} header='Issuer'/>
              <div className={styles.headerRow}>
                {credential.issuanceDate && (
                  <InfoBlock header="Issuance Date" contents={DateTime.fromISO(credential.issuanceDate).toLocaleString(DateTime.DATE_MED)} />
                )}

                {credential.expirationDate && (
                  <InfoBlock header="Expiration Date" contents={DateTime.fromISO(credential.expirationDate).toLocaleString(DateTime.DATE_MED)} />
                )}
              </div>
              {credential.credentialSubject.hasCredential?.awardedOnCompletionOf && (
                <CompletionDocumentSection completionDocument={credential.credentialSubject.hasCredential.awardedOnCompletionOf} />
              )}
            </section>
            {/* <div className={styles.qrCodeContainer}>
              <QRCodeSVG value={JSON.stringify(credential)} className={styles.qrCode}/>
            </div> */}
          </div>

          <div className={styles.primaryColumn}>
            <div className={styles.credentialDescription}>{credential.credentialSubject.hasCredential?.description}</div>
            {credential.credentialSubject.hasCredential?.competencyRequired && (
              <div>
                <h3 className={styles.smallHeader}>Criteria</h3>
                <div className={styles.credentialCriteria}>{credential.credentialSubject.hasCredential?.competencyRequired}</div>
              </div>
            )}
              
            
            {
              // issuer.image && (
              //   <div className={styles.imageContainer}>
              //     <img className={styles.issuerImage} src={issuer.image} alt="Issuer image" width="100" height="100"/>
              //   </div>
              // )
            }
          </div>
        </div>
      </div>
      {/* <IssuerInfoModal isOpen={isOpen} setIsOpen={setIsOpen} issuer={issuer}/> */}
    </main>
  );
}
