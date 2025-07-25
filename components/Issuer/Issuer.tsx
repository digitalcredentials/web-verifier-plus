import { useRef } from 'react';
import type { IssuerProps } from './Issuer.d';
import styles from './Issuer.module.css';

export const Issuer = ({ issuer, header, infoButtonPushed }: IssuerProps) => {
  const issuerImage = useRef<HTMLImageElement>(null);

  const handleonError = () => {
    if (issuerImage.current != null) {
      issuerImage.current.style.visibility = 'hidden';
    }
  }

  return (
    <div>
      {(issuer?.image || issuer?.name || issuer?.url) && (
        <div>
          <h2 className={styles.header}>{header}</h2>
          <div className={styles.issuer}>
            {issuer.image && (
              <img src={issuer.image?.id || issuer.image} width={36} height={36} alt={`${issuer.name} logo`} ref={issuerImage} onError={handleonError} />
            )}
            <div className={styles.issuerInformation}>
              <div>{issuer.name}
                {/* <span className={`material-icons-outlined ${styles.infoIcon}`} onClick={infoButtonPushed}>
                  info
                </span> */}
              </div>
              <p className={styles.issuerAddress}>{issuer.address}</p>
              <a href={issuer.url}>{issuer.url}</a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
