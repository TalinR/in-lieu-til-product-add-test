import React, { useState } from 'react';
import BallPool from '../Components/BallPool';
import styles from '../Styles/home.module.css'

function FloatingObjectsBackground() {
  return (
    <div className = {styles.backgroundContainer}>
    <BallPool className = {styles.matterjs}/>
  </div>
  );
}

export default FloatingObjectsBackground;