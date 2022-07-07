import { Button } from 'components/Button/Button';
import Image from 'next/image';
import { IssuerObject } from 'types/credential';
import type {CredentialCardProps} from './CredentialCard.d';
import styles from './CredentialCard.module.css';

export const CredentialCard = ({ credential }: CredentialCardProps) => {
  const issuer = credential.issuer as IssuerObject;
  return (
    <div className={styles.card}>
      <div className={styles.primaryColumn}>
        <div className={styles.credentialName}>{credential.credentialSubject.hasCredential?.name}</div>
        <div className={styles.subjectName}>Issued to: {credential.credentialSubject.name}</div>
        <div className={styles.credentialDescription}>{credential.credentialSubject.hasCredential?.competencyRequired}</div>
        <div className={styles.criteriaHeader}>Criteria</div>
        <div className={styles.credentialCriteria}>{credential.credentialSubject.hasCredential?.description}</div>
        {
          issuer.image && (
            <div className={styles.imageContainer}>
              <Image className={styles.issuerImage} src={issuer.image} alt="Issuer image" width="100" height="100"/>
            </div>
          )
        }
      </div>
      <div className={styles.secondaryColumn}>
        <div>
          <Button text="Share" secondary/>
          <Button text="View Source" secondary/>
        </div>
      </div>
    </div>
  );
}
