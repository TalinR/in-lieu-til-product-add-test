import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import homeStyles from '../Styles/home.module.css';
// 

function HomePage() {
  // Example state to mimic the functionality in the sidebar
  const [selectedItem, setSelectedItem] = useState(null);

    // Collection data with variants
    const collection = {
      "LYON - PANT": ["BLACK", "BEIGE"],
      "COMO - PULLOVER": ["LIMONCELLO", "CAMPARI"],
      "SHION - TSHIRT": ["CHARCOAL", "CREAM"],
      "AVERY - HOODIE": ["KYOHO"],
    };


    const slugMapping = {
      "LYON - PANT": {
        slug: "lyon-pants",
        variants: {
          BLACK: "Black",
          BEIGE: "Beige",
        },
      },
      "COMO - PULLOVER": {
        slug: "como-pullover",
        variants: {
          LIMONCELLO: "Limoncello",
          CAMPARI: "Campari",
        },
      },
      "SHION - TSHIRT": {
        slug: "shion-tshirt",
        variants: {
          CHARCOAL: "Charcoal",
          CREAM: "Cream",
        },
      },
      "AVERY - HOODIE": {
        slug: "avery-hoodie",
        variants: {
          KYOHO: "Kyoho",
        },
      },
    };
  const handleItemClick = (item) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const handleLinkClick = () => {
    setSelectedItem(null);
  };

  return (
    <div className={homeStyles.mainPage}>
      <div className={homeStyles.centerContent}>
        <motion.div
          key={selectedItem || 'default'}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className={homeStyles.centerHeading}
        >
          {selectedItem ? selectedItem.split(' - ')[0] : 'COLLECTION'}
        </motion.div>

        <motion.ul
          className={homeStyles.centerList}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {!selectedItem ? (
            // Render main collection items
            Object.keys(collection).map((item) => (
              <motion.li
                key={item}
                className={homeStyles.centerListItems}
                whileHover={{ scale: 1.05 }}
                onClick={() => handleItemClick(item)}
              >
                {item}
              </motion.li>
            ))
          ) : (
            // Render variants of selected item
            <>
              <div className={homeStyles.centerListItems}>
                {collection[selectedItem].map((variant, index) => (
                  <React.Fragment key={variant}>
                    <Link
                                to={`/${slugMapping[selectedItem].slug}?color=${slugMapping[selectedItem].variants[variant]}`}
                                onClick={handleLinkClick}
                                className="variant-link"
                              >
                                {variant}
                              </Link>
                    {index < collection[selectedItem].length - 1 && (
                      <span className={homeStyles.separator}> / </span>
                    )}
                  </React.Fragment>
                ))}
              </div>

              <motion.li
                className={`${homeStyles.centerListItems} ${homeStyles.arrow}`}
                onClick={() => setSelectedItem(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8, delay: 0 }}
              >
                <span className={homeStyles.arrowIcon}>⟵</span>
              </motion.li>
            </>
          )}
        </motion.ul>
      </div>
    </div>
  );
}

export default HomePage;
