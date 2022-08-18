import type { IssuerProps } from './Issuer.d';
import styles from './Issuer.module.css';
export const Issuer = ({issuer, header}: IssuerProps ) => {

  const img: HTMLElement = document.getElementById("IssuerImage")!;
  console.log(img);
  const handleonError = () => {
    img.style.visibility = 'hidden';
  }
  return (
    <div>
      <h3 className={styles.header}>{header}</h3>
      <div className={styles.issuer}>
        {issuer.image && (
          <img src={issuer.image} width={36} height={36} alt="Issuer Image" id='IssuerImage' onError={handleonError} />
        )}
        <div className={styles.issuerInformation}>
          <div>{issuer.name}</div>
          <a href={issuer.url}>{issuer.url}</a>
        </div>
      </div>
    </div>
  );
}