import type { InfoBlockProps } from './InfoBlock.d';
import styles from './InfoBlock.module.css';

export const InfoBlock = ({header, contents}: InfoBlockProps) => {
  return (
    <div className={styles.infoBlock}>
      <h3 className={styles.smallHeader}>{header}</h3>
      <div className={styles.contents}>{contents}</div>
    </div>
  );
}