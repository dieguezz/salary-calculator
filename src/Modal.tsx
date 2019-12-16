import React, { useState } from "react";
import "./Modal.scss";

export function Modal(props: any) {
  return (
    props.isOpen && (
      <div className="modal" onClick={props.onClose}>
        <div className="content">
          <h2 className="h2">{props.title}</h2>
          <p>{props.text}</p>
          {props.source && <a href={props.source} target="_blank">Fuente</a>}
        </div>
      </div>
    )
  );
}
