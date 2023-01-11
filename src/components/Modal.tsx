import React from "react";
import styles from "./Modal.module.scss";

export function Modal(props: any) {
  return (
    props.isOpen && (
      <div className={styles.modal} onClick={props.onClose}>
        <div className={styles.content}>
          <h2 className={styles.h2}>{props.title}</h2>
          <p>{props.text}</p>
          {props.source && <a href={props.source} target="_blank" rel="noreferrer">Fuente</a>}
        </div>
      </div>
    )
  );
}
