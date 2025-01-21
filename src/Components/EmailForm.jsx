import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import React, { useRef, useState } from "react";
import styles from "../Styles/emailForm.module.css"; // Ensure your custom styles are imported

const EmailForm = () => {
  const formRef = useRef(null);
  const [submitted, setSubmitted] = useState(false); // State to track form submission


  const handleSubmit = (e) => {
    // On SUBMIT, update the state to show the thank you message
    setSubmitted(true);
    e.preventDefault();
    fetch(process.env.REACT_APP_GOOGLE_FORM_LINK, {
      method: 'POST',
      body: new FormData(formRef.current),
    }).then(res => res.json())
      .then(data => {
        // // On success, update the state to show the thank you message
        // setSubmitted(true);
      })
      .catch(err => console.log(err));
  };

  return (
    
    <Container className={styles.emailFormContainer}>
      
      <Form ref={formRef} onSubmit={handleSubmit} className={styles.emailForm}>
        <Form.Group className={`mb-3 ${styles.emailGroup}`} controlId="formBasicEmail">
        {submitted ? (
        <div className={styles.thankYouMessage}>
          Thank you!
        </div>
      ) : (
          <Form.Control
            type="email"
            placeholder="Enter your email"
            name="Email"
            required
            className={styles.emailInput}
          />
      )}
        </Form.Group>
        <Button variant="link" type="submit" className={styles.subscribeButton}>
          Subscribe
        </Button>
      </Form>
      
    </Container>
  );
};

export default EmailForm;
