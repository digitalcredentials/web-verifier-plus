import type { InfoBlockProps } from './InfoBlock.d';
import styles from './InfoBlock.module.css';

export const InfoBlock = ({header, contents}: InfoBlockProps) => {
  return (
    <div className={styles.infoBlock}>
      <div className={styles.smallHeader}>{header}</div>
      <div className={styles.contents}>{contents}</div>
    </div>
  );
}