import React from "react";
import styles from "../Styles/about.module.css"; // Import the CSS module

const about = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <div className={styles.productInfoPage}>
        <p className={styles.aboutParagraph}>
          <b>in lieu</b> is from Sydney, Australia. With a strong focus on
          simplicity yet elegance in design, we are driven to create timeless
          and wearable garments portraying an aesthetic that may always be worn,
          in lieu of what one already owns in their wardrobe.
          <br />
          <br />
          Who are you? You are Lieu.
          <br />
          <br />
          In Lieu’s world, the simple joys in life are championed.
          <br />
          <br />
        </p>
        <p className={styles.aboutParagraphIndent}>
          Warm cups of coffee or tea in the morning. Melodies of yesteryears
          playing on the turntable in the corner of a curated space in which you
          feel most at home. Incense burning fragrant whispers of pine and
          cedar. An art piece, meaningless to most, adorning a blank wall. The
          relationships you have fostered through time, grounding you, making
          sure you never step too far from who you are – Lieu.
          <br />
          <br />
        </p>
        <p className={styles.aboutParagraph}>in lieu (n):</p>
        <p className={styles.aboutParagraphIndent}>
          instead; in place of; in replacement.
          <br />
          <i>Lieu decided that he would purchase something new, in lieu of
          something old.</i>
        </p>
      </div>
    </div>
  );
};

export default about;
