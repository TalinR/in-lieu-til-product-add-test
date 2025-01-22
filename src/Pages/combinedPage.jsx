import React from 'react';
import FloatingObjectsBackground from './floatingObjectsBackground';
import HomePage from './home';
import styles from '../Styles/home.module.css'

function CombinedPage() {
  return (
    <>
    <div className = {styles.mainPage}>
      <FloatingObjectsBackground />
      <HomePage />
    </div>
    </>
  );
}

export default CombinedPage;
