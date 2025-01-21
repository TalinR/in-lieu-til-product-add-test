import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import React, { useRef, useState } from "react";
import styles from "../Styles/EmailAndNameForm.module.css"; // Import your CSS module



const EmailAndNameForm = () => {
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
      {submitted ? (
        <div className={styles.thankYouMessage}>
          We'll be in touch soon
        </div>
      ) : (
        <Form ref={formRef} onSubmit={handleSubmit} className={styles.emailForm}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Control
              type="text"
              placeholder="Name"
              name="Name"
              required
              className={styles.nameInput}
            />
          </Form.Group>
          <Form.Group className="mb-3 emailGroup" controlId="formBasicEmail">
            <Form.Control
              type="email"
              placeholder="Email"
              name="Email"
              required
              className={styles.emailInput}
            />
          </Form.Group>
          <Button variant="link" type="submit" className={styles.subscribeButton}>
            Subscribe
          </Button>
        </Form>
      )}
    </Container>
  );
};

export default EmailAndNameForm;
