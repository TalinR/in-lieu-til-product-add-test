import React, { useEffect, useState, useRef } from "react";
import "../Styles/main.css";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import shopping_cart_logo from "../assets/images/shopping_bag_icon.svg";
import burger_menu_icon from "../assets/images/burger_menu.svg";
import EmailForm from "./EmailForm";
import { motion } from "framer-motion";

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedItem, setSelectedItem] = useState(null);
  const [cartCount, setCartCount] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);

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

  useEffect(() => {
    // Wait for Snipcart to be fully loaded
    const initSnipcart = () => {
      if (window.Snipcart) {
        // Initial cart state
        const state = window.Snipcart.store.getState();
        setCartCount(state.cart.items.count || 0);

        // Subscribe to changes
        window.Snipcart.store.subscribe(() => {
          setTimeout(() => {
            const state = window.Snipcart.store.getState();
            console.log('Snipcart State:', state); // Debug log
            setCartCount(state.cart.items.count || 0);
          }, 100);
        });
      } else {
        setTimeout(initSnipcart, 100);
      }
    };

    initSnipcart();

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
    setSelectedItem(null);
  };

  const handleLinkClick = (path) => {
    // Return a function that handles the click event
    return () => {
      // Close cart and sidebar
      setSidebarOpen(false);
      if (window.Snipcart && isCartOpen) {
        window.Snipcart.api.theme.cart.close();
        setIsCartOpen(false);
      }
      
      // Use navigate to ensure redirection
      window.location.href = path;
    };
  };

  const handleItemClick = (item) => {
    setSelectedItem(item === selectedItem ? null : item);
  };

  const toggleCart = () => {
    if (window.Snipcart) {
      console.log('Current cart state:', isCartOpen); // Debug log
      if (isCartOpen) {
        window.Snipcart.api.theme.cart.close();
        setIsCartOpen(false);
      } else {
        window.Snipcart.api.theme.cart.open();
        setIsCartOpen(true);
      }
    }
  };

  return (
    <>
      <header>
        <input
          type="checkbox"
          id="menu-toggle"
          className="menu-toggle"
          checked={isSidebarOpen}
          onChange={toggleSidebar}
        />
        <label htmlFor="menu-toggle" className="menu-icon">
          <img src={burger_menu_icon} alt="Menu" />
        </label>
        <h1 className="logo">
          <Link 
          to="/"
          onClick={handleLinkClick("/")}>
            <img src={logo} alt="Logo" />
          </Link>
        </h1>
        <nav>
          <ul className="nav-items">
            <li>
              <Link 
                to="/lookbook" 
                onClick={handleLinkClick("/lookbook")}
              >
                LOOKBOOK
              </Link>
            </li>
            <li className="cart-item">
              <div className="alt-font" onClick={toggleCart}>
                MY BAG ({cartCount})
              </div>
            </li>
          </ul>
        </nav>
        <div className="mobile-icons">
          <div className="cart-icon" onClick={toggleCart}>
            <img src={shopping_cart_logo} alt="Cart" />
            <div className="overlay-text">{cartCount}</div>
          </div>
        </div>
      </header>
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={toggleSidebar}>
          ✕
        </button>
        <ul className="top-list">
          <li className="listItems">
            <Link 
              to="/lookbook" 
              onClick={handleLinkClick("/lookbook")}
            >
              LOOKBOOK
            </Link>
          </li>
          <li className="listItems">
            <Link 
              to="/about" 
              onClick={handleLinkClick("/about")}
            >
              ABOUT
            </Link>
          </li>
        </ul>

        <div className="sidebar-center">
          <motion.div
            key={selectedItem || "default"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0 }}
            className="center-heading"
          >
            {selectedItem ? selectedItem.split(" - ")[0] : "COLLECTION"}
          </motion.div>

          <motion.ul
            className="center-list"
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
                  className="centerListItems"
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </motion.li>
              ))
            ) : (
              // Render variants of selected item
              <>
                <div className="centerListItems">
                  {collection[selectedItem].map((variant, index) => (
                    <React.Fragment key={variant}>
                      <Link
                        to={`/${slugMapping[selectedItem].slug}?color=${slugMapping[selectedItem].variants[variant]}`}
                        onClick={handleLinkClick(`/${slugMapping[selectedItem].slug}?color=${slugMapping[selectedItem].variants[variant]}`)}
                        className="variant-link"
                      >
                        {variant}
                      </Link>
                      {index < collection[selectedItem].length - 1 && (
                        <span className="separator"> / </span>
                      )}
                    </React.Fragment>
                  ))}
                </div>

                <motion.li
                  className="centerListItems arrow"
                  onClick={() => setSelectedItem(null)}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0 }}
                >
                  <span className="arrow-icon">⟵</span>
                </motion.li>
              </>
            )}
          </motion.ul>
        </div>

        <div className="sidebar-bottom">
          <ul className="bottom-list">
            <li className="listItemsBottom">
              <a href="https://www.instagram.com/inlieu.official" onClick={handleLinkClick("/about")}>INSTAGRAM</a>
            </li>
            <li className="listItemsBottom">
              <Link to="/delivery-and-returns" onClick={handleLinkClick("/delivery-and-returns")}>DELIVERY AND RETURNS</Link>
            </li>
          </ul>

          <EmailForm />
        </div>
      </aside>
    </>
  );
};

export default Navbar;
