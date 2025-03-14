import React, { useState } from 'react';
import type { AccordionProps } from './Accordion.d';
import styles from './Accordion.module.css';

export const Accordion = ({icon, title, children}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`${styles.floatingTextarea}`}>
        
      <button className={`${styles.button}`} onClick={toggleOpen}>
      {icon ? <span>{icon}</span> : null} {title} {isOpen ? ' - ' : ' + '}
      </button>
      {isOpen && <div className={`${styles.floatingTextarea}`}>{children}</div>}
    </div>
  );
}
