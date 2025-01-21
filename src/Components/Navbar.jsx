import React, { useEffect, useState, useRef } from "react";
import "../Styles/main.css";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import ShopifyBuy from "@shopify/buy-button-js";
import shopping_cart_logo from "../assets/images/shopping_bag_icon.svg";
import burger_menu_icon from "../assets/images/burger_menu.svg";

import EmailForm from "./EmailForm";

import { motion } from "framer-motion";


const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const buyButtonInitialized = useRef(false);
  const [buyButtonComponent, setbuyButtonComponent] = useState(null);
  const toggleButton = useRef(null);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedItem, setSelectedItem] = useState(null); // for changing selected item on sidebar

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
    // Keep track of previous window width to detect view mode changes
    let prevWidth = window.innerWidth;

    // Handler to call on window resize
    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      if (
        (prevWidth <= 768 && window.innerWidth > 768) ||
        (prevWidth > 768 && window.innerWidth <= 768)
      ) {
        buyButtonInitialized.current = false;
        setIsMobile(isCurrentlyMobile);

        if (isCurrentlyMobile) {
          if (buyButtonComponent) {
            buyButtonComponent.updater.updateConfig({
              options: {
                toggle: {
                  templates: {
                    count:
                      '<div class="{{data.classes.toggle.count}}" data-element="toggle.count"> {{data.count}}</div>',
                  },
                },
              },
            });
          }

          if (toggleButton.current) {
            document
              .getElementById("custom-cart-toggle-location-mobile")
              .appendChild(toggleButton.current);
          }
        } else {
          if (buyButtonComponent) {
            buyButtonComponent.updater.updateConfig({
              options: {
                toggle: {
                  templates: {
                    count:
                      '<div class="{{data.classes.toggle.count}}" data-element="toggle.count"> MY BAG ({{data.count}})</div>',
                  },
                },
              },
            });
          }

          if (toggleButton.current) {
            document
              .getElementById("custom-cart-toggle-location-desktop")
              .appendChild(toggleButton.current);
          }
        }
      }
      prevWidth = window.innerWidth;
    };

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, [buyButtonComponent]);

  useEffect(() => {
    if (buyButtonInitialized.current) return;

    const initialIsMobile = window.innerWidth <= 768;
    setIsMobile(initialIsMobile);

    const count =
      initialIsMobile
        ? '<div class="{{data.classes.toggle.count}}" data-element="toggle.count"> {{data.count}}</div>'
        : '<div class="{{data.classes.toggle.count}}" data-element="toggle.count"> MY BAG ({{data.count}})</div>';
    const element_location = initialIsMobile
      ? "custom-cart-toggle-location-mobile"
      : "custom-cart-toggle-location-desktop";

    const client = ShopifyBuy.buildClient({
      domain: "nc173t-ah.myshopify.com",
      storefrontAccessToken: "836eeafd9f000cca2e63ccd0f5eca722",
    });

    const ui = ShopifyBuy.UI.init(client);

    const createBuyButton = (elementId) => {
      ui.createComponent("product", {
        id: "",
        node: document.getElementById(elementId),
        moneyFormat: "%24%7B%7Bamount%7D%7D",
        options: {
          product: {
            iframe: false,
            width: "100%",
            styles: {
              product: {
                "text-align": "left",
              },
              button: {
                ":hover": {
                  "background-color": "#000000",
                },
                "background-color": "#000000",
                ":focus": {
                  "background-color": "#000000",
                },
                "border-radius": "32px",
                padding: "10px 0",
                display: "block",
                width: "100%",
              },
            },
            contents: {
              img: false,
              title: false,
              variantTitle: false,
              price: false,
              options: false,
              quantity: false,
              quantityIncrement: false,
              quantityDecrement: false,
              quantityInput: false,
              button: false,
              description: false,
            },
          },
          cart: {
            iframe: true,
            popup: false,
            styles: {
              button: {
                ":hover": {
                  "background-color": "#000000",
                },
                "background-color": "#000000",
                ":focus": {
                  "background-color": "#000000",
                },
                "border-radius": "32px",
              },
            },
            text: {
              total: "Subtotal",
              button: "Checkout",
            },
          },
          toggle: {
            templates: {
              count: count,
            },
            iframe: false,
            sticky: false,
            contents: {
              count: true,
              icon: false,
              title: false,
            },
            order: ["title", "count"],
            classes: {
              wrapper: "shopify-buy__cart-toggle-wrapper",
              toggle: "shopify-buy__cart-toggle",
              title: "shopify-buy__cart-toggle__title",
              count: "shopify-buy__cart-toggle__count",
              icon: "shopify-buy__icon-cart shopify-buy__icon-cart--side",
              iconPath: "shopify-buy__icon-cart__group",
            },
            text: {
              title: "BAG (",
            },
            events: {
              afterInit: function (component) {
                setbuyButtonComponent(component);
                toggleButton.current = document.querySelector(
                  ".shopify-buy-frame--toggle"
                );
                if (toggleButton.current) {
                  document
                    .getElementById(element_location)
                    .appendChild(toggleButton.current);
                }
              },
              beforeUpdateConfig: function () {
              },
            },
          },
        },
      });
    };

    createBuyButton("product-component");

    buyButtonInitialized.current = true;
  });

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (isSidebarOpen && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebarOpen(false);
      }
    };

    // Attach the event listener for clicks outside the sidebar
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
    setSelectedItem(null); // Reset to default state
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  const handleItemClick = (item) => {
    setSelectedItem(item === selectedItem ? null : item);
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
          <img src={burger_menu_icon} alt="img" />
        </label>
        <h1 className="logo">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
        </h1>
        <nav>
          <ul className="nav-items">
            <li>
              <Link to="/lookbook">LOOKBOOK</Link>
            </li>
            <li className="cart-item">
              <div className="alt-font" id="custom-cart-toggle-location-desktop"></div>
            </li>
          </ul>
        </nav>
        <div className="mobile-icons">
          <img src={shopping_cart_logo} alt="img" />
          <div className="overlay-text" id="custom-cart-toggle-location-mobile"></div>
        </div>
      </header>
      <aside ref={sidebarRef} className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="sidebar-close" onClick={toggleSidebar}>
          ✕
        </button>
        <ul className="top-list">
        <li className="listItems">
          <Link to="/lookbook" onClick={handleLinkClick}>LOOKBOOK</Link>
        </li>
        <li className="listItems">
          <Link to="/about" onClick={handleLinkClick}>ABOUT</Link>
        </li>
      </ul>

      {/* <div className="sidebar-center">
        <ul className="center-list">
          <li className="centerListHeading">
            COLLECTION:
          </li>
          <li className="centerListItems">
            LYON - PANT
          </li>
          <li className="centerListItems">
            COMO - PULLOVER
          </li>
          <li className="centerListItems">
            SHION - TSHIRT
          </li>
          <li className="centerListItems">
            AVERY - HOODIE
          </li>
        </ul>
      </div> */}
      {/* <div className="sidebar-center">
          <ul className="center-list">
            {!selectedItem ? (
              // Show main collection list
              Object.keys(collection).map((item) => (
                <li
                  key={item}
                  className="centerListItems"
                  onClick={() => handleItemClick(item)}
                >
                  {item}
                </li>
              ))
            ) : (
              // Show variants of selected item
              <>
                <li className="centerListItems back-option" onClick={() => handleItemClick(null)}>
                  ⟵ Back
                </li>
                {collection[selectedItem].map((variant) => (
                  <li key={variant} className="centerListItems">
                    <Link to={`/product/${selectedItem}-${variant}`} onClick={handleLinkClick}>
                      {variant}
                    </Link>
                  </li>
                ))}
              </>
            )}
          </ul>
        </div> */}

<div className="sidebar-center">
  <motion.div
    key={selectedItem || "default"}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.8, delay: 0 }}
    // initial={{ opacity: 0, y: 20 }}
    // animate={{ opacity: 1, y: 0 }}
    // exit={{ opacity: 0, y: -20 }}
    // transition={{ duration: 0.4 }}
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
            onClick={handleLinkClick}
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
            <a href="https://www.instagram.com/inlieu.official" onClick={handleLinkClick}>INSTAGRAM</a>
          </li>
          <li className="listItemsBottom">
            <Link to="/delivery-and-returns" onClick={handleLinkClick}>DELIVERY AND RETURNS</Link>
          </li>
        </ul>


          <EmailForm />
        </div>
      </aside>
    </>
  );
};

export default Navbar;
