import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "../Styles/passwordModal.module.css"; // Import your CSS module
import Container from "react-bootstrap/Container";
import EmailAndNameForm from "./EmailAndNameForm";
import logo from "../assets/images/logo.svg";
import BallPool from '../Components/BallPool';
import ballPoolStyles from '../Styles/ballPool.module.css'


const PasswordModal = ({ isOpen, onSubmit, onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(password);
  };

  // Check query parameter for authentication
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const authToken = params.get("qrAuthCode");
    
    // console.log('Environment Variable:', process.env.REACT_APP_PRESALE_PWORD);

    if (authToken === process.env.REACT_APP_PRESALE_PWORD) {
      // Automatically authenticate if token matches
      onAuthenticate(authToken);
    }
  }, [location.search, onAuthenticate]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.passwordProtection}>
        {/* <div className={styles.ballPoolContainer}>
          <BallPool className={ballPoolStyles.matterjs} />
        </div> */}

      <div className={styles.content}>
        <h1 className={styles.logo}>
          <img src={logo} alt="Logo" />
        </h1>
        <div className={styles.formContainer}>
          <Container className={styles.passwordFormContainer}>
            <div>
              <form onSubmit={handleSubmit} className={styles.passwordForm}>
                <input
                  type="password"
                  placeholder="Password"
                  className={styles.passwordInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit" className={styles.passwordButton}>
                  Submit
                </button>
              </form>
            </div>
          </Container>
          <div className={styles.emailFormContainer}>
            <EmailAndNameForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordModal;
