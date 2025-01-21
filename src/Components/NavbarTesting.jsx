import React, { useEffect, useState, useRef } from "react";
import "../Styles/main.css";
import logo from "../assets/images/logo.svg";
import { Link } from "react-router-dom";
import ShopifyBuy from "@shopify/buy-button-js";
import shopping_cart_logo from "../assets/images/shopping_bag_icon.svg";
import EmailForm from "../Components/EmailForm";
import Hamburger from 'hamburger-react';

const Navbar = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const buyButtonInitialized = useRef(false);
  const [buyButtonComponent, setbuyButtonComponent] = useState(null);
  const toggleButton = useRef(null);
  const sidebarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    let prevWidth = window.innerWidth;

    const handleResize = () => {
      const isCurrentlyMobile = window.innerWidth <= 768;
      if (
        (prevWidth <= 768 && window.innerWidth > 768) ||
        (prevWidth > 768 && window.innerWidth <= 768)
      ) {
        buyButtonInitialized.current = false;
        setIsMobile(isCurrentlyMobile);
        console.log("View mode changed");

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

    window.addEventListener("resize", handleResize);
    handleResize();

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
      domain: "b1df9b-e3.myshopify.com",
      storefrontAccessToken: "755e0cfdd1e1f9277e389116d88e443b",
    });

    const ui = ShopifyBuy.UI.init(client);

    const createBuyButton = (elementId) => {
      ui.createComponent("product", {
        id: "9653892710721",
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
                console.log("UPDATES");
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

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen((prevState) => !prevState);
  };

  const handleLinkClick = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <header>
        <div className="menu-icon">
          <Hamburger toggled={isSidebarOpen} toggle={setSidebarOpen} />
        </div>
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
        <ul>
          <li>
            <Link to="/lookbook" onClick={handleLinkClick}>LOOKBOOK</Link>
          </li>
          <li>
            <Link to="/avery-hoodie" onClick={handleLinkClick}>COLLECTION</Link>
          </li>
          <li>
            <Link to="/about" onClick={handleLinkClick}>ABOUT</Link>
          </li>
        </ul>
        <div className="sidebar-bottom">
          <EmailForm />
        </div>
      </aside>
    </>
  );
};

export default Navbar;
