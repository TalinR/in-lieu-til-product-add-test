import React from 'react';
import styles from '../Styles/passwordProtection.module.css'; // Import the CSS module
import logo from "../assets/images/logo_white.svg";
import EmailAndNameForm from "../Components/EmailAndNameForm";

const PasswordProtection = () => {
  return (
    <div className={styles.passwordProtection}>
      <div className={styles.content}>
        {/* <h1 className={styles.logo}>in lieu</h1> */}

        <h1 className={styles.logo}>
          <img src={logo} alt="Logo" />
        </h1>

        <div className={styles.formContainer}>
          <EmailAndNameForm />

        </div>
      </div>
    </div>
  );
};

export default PasswordProtection;
