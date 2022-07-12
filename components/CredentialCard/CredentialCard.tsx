import { Button } from 'components/Button/Button';
import { Issuer } from 'components/Issuer/Issuer';
import { IssuerObject } from 'types/credential';
import type {CredentialCardProps} from './CredentialCard.d';
import styles from './CredentialCard.module.css';

export const CredentialCard = ({ credential }: CredentialCardProps) => {
  const issuer = credential.issuer as IssuerObject; // TODO figure out other issuer type

  return (
    <div className={styles.card}>
      <div className={styles.primaryColumn}>
        <div className={styles.credentialName}>{credential.credentialSubject.hasCredential?.name}</div>
        <div className={styles.subjectName}>Issued to: {credential.credentialSubject.name}</div>
        <div className={styles.credentialDescription}>{credential.credentialSubject.hasCredential?.description}</div>
        <div className={styles.smallHeader}>Criteria</div>
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
      </div>
    </div>
  );
}
