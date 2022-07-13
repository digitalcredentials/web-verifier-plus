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

export const CredentialCard = ({ presentation }: CredentialCardProps) => {
  const credential = presentation.verifiableCredential as Credential;
  const issuer = credential.issuer as IssuerObject; // TODO figure out other issuer type

  return (
    <div className={styles.card}>
      <div className={styles.primaryColumn}>
        <VerifyIndicator />
        <div className={styles.credentialName}>{credential.credentialSubject.hasCredential?.name}</div>
        <div className={styles.subjectName}>Issued to: {credential.credentialSubject.name}</div>
        <div className={styles.credentialDescription}>{credential.credentialSubject.hasCredential?.description}</div>
        <div className={styles.sectionHeader}>Criteria</div>
        <div className={styles.credentialCriteria}>{credential.credentialSubject.hasCredential?.competencyRequired}</div>
        {
          issuer.image && (
            <div className={styles.imageContainer}>
              <img className={styles.issuerImage} src={issuer.image} alt="Issuer image" width="100" height="100"/>
            </div>
          )
        }
      </div>
      <div className={styles.secondaryColumn}>
        <div>
          <div className={styles.buttonContainer}>
            <Button
              text="Share"
              icon={<span className="material-icons">share</span>}
              secondary
            />
            <Button
              className={styles.viewSource}
              icon={<span className="material-icons">code</span>}
              text="View Source"
              secondary
            />
          </div>
          <div className={styles.smallHeader}>Issuer</div>
          <Issuer issuer={issuer}/>
          <div className={styles.headerRow}>
            <InfoBlock header="Issuance Date" contents={DateTime.fromISO(credential.issuanceDate).toLocaleString(DateTime.DATE_MED)} />

            {credential.expirationDate && (
              <InfoBlock header="Expriration Date" contents={DateTime.fromISO(credential.expirationDate).toLocaleString(DateTime.DATE_MED)} />
            )}
          </div>
          {credential.credentialSubject.hasCredential?.awardedOnCompletionOf && (
            <CompletionDocumentSection completionDocument={credential.credentialSubject.hasCredential.awardedOnCompletionOf} />
          )}
        </div>
        <div className={styles.qrCodeContainer}>
          <QRCodeSVG value={JSON.stringify(credential)} className={styles.qrCode}/>
        </div>
      </div>
    </div>
  );
}
