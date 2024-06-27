import { DateTime, Info } from 'luxon';
import { CompletionDocumentSection } from 'components/CompletionDocumentSection/CompletionDocumentSection';
import { Issuer } from 'components/Issuer/Issuer';
import { IssuerObject, VerifiableCredential } from 'types/credential.d';
import type {CredentialCardProps, CredentialDisplayFields} from './CredentialCard.d';
import styles from './CredentialCard.module.css';
import { InfoBlock } from 'components/InfoBlock/InfoBlock';
import { VerifyIndicator } from 'components/VerifyIndicator/VerifyIndicator';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { getExpirationDate, getIssuanceDate } from 'lib/credentialValidityPeriod';

export const CredentialCard = ({ credential, wasMulti = false }: CredentialCardProps) => {
  // TODO: add back IssuerInfoModal
  // TODO: add icon back to Issuer
  // NOTE: unused imports will be used when above features get reinstated

  const displayValues = mapCredDataToDisplayValues(credential)
  const issuer = credential?.issuer as IssuerObject;
  const [isOpen, setIsOpen] = useState(false);

  const infoButtonPushed = () => {
    setIsOpen(true);
  }


  return (
    <main aria-labelledby='title'>
      {wasMulti && (
        <div className={styles.errorContainer}>

          <span className={`material-icons-outlined ${styles.warningIcon}`}>
            warning
          </span>
          <p className={styles.error}>Presentation had multiple credentials but only the first is displayed</p>
        </div>
      )}
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
          <div className={styles.achivementInfo}>
            {displayValues.achievementImage ? <img className={styles.achievementImage} src={displayValues.achievementImage} alt="achievement image"/>: null}
            <div>
              <h1 id='title' className={styles.credentialName}>{displayValues.credentialName}</h1>
              {displayValues.achievementType ? <p className={styles.achievementType}>Achievement Type : {displayValues.achievementType}</p> : null}
            </div>
          </div>
        </div>
        <div className={styles.mainCard}>
          <div className={styles.secondaryColumn}>
            <section>
              <Issuer issuer={issuer} infoButtonPushed={infoButtonPushed} header='Issuer'/>
              <div className={styles.headerRow}>
                {displayValues.issuanceDate && (
                  <InfoBlock header="Issuance Date" contents={DateTime.fromISO(displayValues.issuanceDate).toLocaleString(DateTime.DATE_MED)} />
                )}

                {displayValues.expirationDate && (
                  <InfoBlock header="Expiration Date" contents={DateTime.fromISO(displayValues.expirationDate).toLocaleString(DateTime.DATE_MED)} />
                )}
              </div>
              {credential?.credentialSubject?.hasCredential?.awardedOnCompletionOf && (
                <CompletionDocumentSection completionDocument={credential.credentialSubject.hasCredential.awardedOnCompletionOf} />
              )}
            </section>
            {/* <div className={styles.qrCodeContainer}>
              <QRCodeSVG value={JSON.stringify(credential)} className={styles.qrCode}/>
            </div> */}
          </div>

          <div className={styles.primaryColumn}>
            {displayValues.issuedTo ? 
            <InfoBlock header="Issued To" contents={displayValues.issuedTo} />
            :
            null
            }
            {displayValues.credentialDescription ? 
              <InfoBlock header="Description" contents={displayValues.credentialDescription}/>
              :
              null
            }
            {displayValues.criteria && (
              <div>
                <h3 className={styles.smallHeader}>Criteria</h3>
                {/* <div className={styles.credentialCriteria}>{displayValues.criteria}</div> */}
                <div className={styles.markdownContainer}>
                  <ReactMarkdown >{displayValues.criteria}</ReactMarkdown>
                </div>
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

const mapCredDataToDisplayValues = (credential?: VerifiableCredential): CredentialDisplayFields => {
  if (!credential) {
    return {
      issuedTo: '',
      issuanceDate: '',
      expirationDate: '',
      credentialName: '',
      credentialDescription: '',
      criteria: ''
    }
  }
  const common = {
    issuedTo: credential.credentialSubject.name,
    issuanceDate: getIssuanceDate(credential),
    expirationDate: getExpirationDate(credential)
  }
  if (credential.type.includes("OpenBadgeCredential") || credential.type.includes("AchievementCredential")){
    return {...common,
      credentialName: credential.name,
      credentialDescription: credential.credentialSubject.achievement?.description,
      criteria: credential.credentialSubject.achievement?.criteria?.narrative,
      achievementImage: credential.credentialSubject.achievement?.image?.id,
      achievementType: credential.credentialSubject.achievement?.achievementType

    }
  } else {
    return {...common,
      credentialName: credential.credentialSubject.hasCredential?.name,
      credentialDescription: credential.credentialSubject.hasCredential?.description,
      criteria: credential.credentialSubject.hasCredential?.competencyRequired
    }
  }
}
