import React from 'react';
import styles from "../Styles/home.module.css"
import buttonDescriptions from "../data/buttonDescriptions.json";


const Modal = ({onClose, clickedBodyId}) => {
    const adjustedId = clickedBodyId-8;

    if(buttonDescriptions[adjustedId].hasOwnProperty("italic")){
        return (
            <div className={styles.modal} onClick={onClose}>
              <div className="modal-content">
                <button className={styles.closeButton} onClick={onClose}>x</button>
                <div className={styles.textDiv}>
                    <h1 className={styles.title}>{buttonDescriptions[adjustedId].title}</h1>
                    <p className={styles.mainParagraph}><br />{buttonDescriptions[adjustedId].paragraph}<br /><br /></p>
                    <p className={styles.indentedItalic}> <q> {buttonDescriptions[adjustedId].italic}</q><br /><br /></p>
                    <p className={styles.indentedItalic}>-Lieu</p>
                </div>
              </div>
            </div>
          );
    }
    else{
        return (
            <div className={styles.modal} onClick={onClose}>
              <div className="modal-content">
                <button className={styles.closeButton} onClick={onClose}>x</button>
                <div className={styles.textDiv}>
                    <h1 className={styles.title}>{buttonDescriptions[adjustedId].title}</h1>
                    <p className={styles.mainParagraph}><br />{buttonDescriptions[adjustedId].paragraph}<br /><br /></p>
                </div>
              </div>
            </div>
          );
    }

    

    
  };

export default Modal;