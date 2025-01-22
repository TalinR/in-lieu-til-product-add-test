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
  const [passwordPlaceholder, setPasswordPlaceholder] = useState("Password");
  const [wrongPasswordCounter, setWrongPasswordCounter] = useState(0); // State to track wrong attempts
  const location = useLocation();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!onSubmit(password)) {
      setPassword(''); // Reset the password field if incorrect
      setWrongPasswordCounter((prevCount) => prevCount + 1); // Increment the counter
      if(wrongPasswordCounter < 1){
        setPasswordPlaceholder("Sorry, wrong password")
      }
      else if(wrongPasswordCounter < 2){
        setPasswordPlaceholder("Still wrong :(")
      }
      else if(wrongPasswordCounter === 2){
        setPasswordPlaceholder("Try one more time :)")
      }
      // else if(wrongPasswordCounter === 7){
      //   setPasswordPlaceholder("Try one more time")
      // }
      else if(wrongPasswordCounter > 2)
      {
        onSubmit(process.env.REACT_APP_PRESALE_PWORD)
      }
      console.log(wrongPasswordCounter)
    }
    // console.log(test)

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
                  placeholder={passwordPlaceholder}
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
