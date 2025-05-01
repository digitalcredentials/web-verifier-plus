
import React from 'react';
import styles from './RegistryCard.module.css';

type RegistryCardProps = {
  registryName: string;
  issuerName?: string;
  issuerId?: string;
  issuerLogo?: string | { id: string };
  issuerLegalName?: string;
  issuerUrl?: string;
};

export const RegistryCard: React.FC<RegistryCardProps> = ({ registryName, issuerName, issuerId, issuerLogo, issuerLegalName, issuerUrl }) => {
  return (
    <div className={styles.registryCard}>
      <p className={styles.registryName}><strong>Issuer Details</strong></p>
      <strong className={styles.registryName}>{registryName}</strong>{' '}
      {/* <a href="#" className={styles.registryLink} onClick={(e) => e.preventDefault()}>
        (More info on governance)
      </a> */}

      <div className={styles.issuerMeta}>
      {issuerLogo && (
  <div className={styles.logoPlaceholder}>
    <img
      src={typeof issuerLogo === 'string' ? issuerLogo : issuerLogo.id}
      alt="Issuer Logo"
    />
  </div>
)}
        <div>
          {issuerName && (
            <p className={styles.registryName}>
              <strong>Issuer Name:</strong>{' '}
              {issuerUrl ? (
                <a href={issuerUrl} target="_blank" rel="noopener noreferrer">
                  {issuerName}
                </a>
              ) : (
                issuerName
              )}
            </p>
          )}
          {issuerLegalName && (
            <p>
              <strong  className={styles.registryName}>Legal Name:</strong> {issuerLegalName}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};