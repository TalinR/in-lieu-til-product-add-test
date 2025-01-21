import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation} from "react-router-dom";
import products from "../data/products.json";
import "../Styles/ProductPage.css";
import ShopifyBuy from "@shopify/buy-button-js";
import size_chart from "../assets/images/size_charts/como_size_chart.png";


function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// Import all images
const pulloverCampariImages = importAll(
  require.context("../assets/images/pullover/campari", false, /\.jpg$/)
);
const pulloverLimoncelloImages = importAll(
  require.context("../assets/images/pullover/limoncello", false, /\.jpg$/)
);

const allImages = {
  Campari: pulloverCampariImages,
  Limoncello: pulloverLimoncelloImages,
};

const PulloverProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState({});
  const buyButtonInitialized = useRef(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialColor = query.get("color") || "Campari"; // Default to 'campari' if no color is provided
  const [selectedColor, setSelectedColor] = useState(initialColor); // Default to 'campari'
  const [selectedColorRef, setSelectedColorRef] = useState(
    useState(initialColor.toLowerCase())
  );
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [price, setPrice] = useState("");
  const [priceLoaded, setPriceLoaded] = useState(false);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showSizingDetails, setShowSizingDetails] = useState(false);

  const toggleProductDetails = () => setShowProductDetails(!showProductDetails);
  const toggleSizingDetails = () => setShowSizingDetails(!showSizingDetails);

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
      }
      prevWidth = window.innerWidth;
    };

    // Add event listener on mount
    window.addEventListener("resize", handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {

    const selectedId = `como-pullover-${selectedColor}`;
    
    const foundProduct = products.find((p) => p.productId === selectedId);

    if (foundProduct) {

      setProduct(foundProduct);
      const { color } = foundProduct;
      const { colourId } = foundProduct;


      setSelectedColorRef(colourId);

      setImages(allImages[color] || {}); // Set images based on the color id

      const url = new URL(window.location);
      url.searchParams.set("color", selectedColor);
      window.history.pushState({}, "", url);
    }
  }, [productId, selectedColor]);

  // Effect to update selected color when the URL changes
  useEffect(() => {
    
    const currentColor = query.get("color") || "Campari";
    
    if (currentColor !== selectedColor) {
      // console.log(currentColor)
      setSelectedColor(currentColor);

        const selectElements = document.querySelectorAll(".shopify-buy__option-select__select");

      // Iterate over each select element
      selectElements.forEach((selectElement) => {
          // Assuming selectedColor corresponds to an option value
          selectElement.value = currentColor;

          // Manually trigger the change event if necessary
          const event = new Event('change', { bubbles: true });
          selectElement.dispatchEvent(event);
      });

    }
    
  }, [location.search]);

  useEffect(() => {
    if (buyButtonInitialized.current) return;

    if (product) {
      const client = ShopifyBuy.buildClient({
        domain: "nc173t-ah.myshopify.com",
        storefrontAccessToken: "836eeafd9f000cca2e63ccd0f5eca722",
      });

      const ui = ShopifyBuy.UI.init(client);

      const createBuyButton = (elementId) => {
        ui.createComponent("product", {
          id: "7361223426138",
          node: document.getElementById(elementId),
          moneyFormat: "%24%7B%7Bamount_no_decimals%7D%7D AUD",
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
                price: false,
              },
              text: {
                button: "Add to cart",
              },

              events: {
                afterInit: function (component) {
                  if (selectedColor)
                    component.updateVariant("Color", selectedColor);
                  console.log("select color")

                  // price.current = component.view.component.formattedPrice
                },
                afterRender: function (component) {
                  const updatedPrice = component.view.component.formattedPrice;
                  setPrice(updatedPrice);
                  setPriceLoaded(true); // Indicate that the price has been loaded
                  document
                    .querySelectorAll(".shopify-buy__option-select__select")
                    .forEach(function (selectElement) {
                      selectElement.addEventListener("change", function () {
                        setTimeout(() => {
                          const selectedColor = component.selectedOptions.Color;

                          console.log(selectedColor)

                          setSelectedColor(selectedColor);
                        }, 10); // Add a slight delay to allow Shopify component to update
                      });
                    });
                },
              },
            },
            cart: {
              iframe: true,
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
          },
        });
      };

      createBuyButton("product-component");
      buyButtonInitialized.current = true; // Mark the buy button as initialized
    }
  }, [product, selectedColor, isMobile]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const { title, description, modelInfo, colorDescriptor, passportHolderNote } = product;

  const BuyButton = <div id="product-component"></div>;

  const Mobileview = (children) => {
    return (
      <div className="mobile-view">
        <img
          src={images[`${selectedColorRef}_pullover_4.jpg`]}
          alt="Mobile 1"
          className="main-image"
        />
        <div className="product-details">
          <h2>{title}</h2>
          <h3>{price}</h3>
          <p className="italic">Como (n)</p>
          <p >{description}</p>
          <p className="italic">
            Como, best worn when taking time off in lieu.
          </p>
          <p>{colorDescriptor}</p>
          <p className="italic-model-info">{modelInfo}</p>
          <p className="disclaimer-font">
            *{passportHolderNote}
            <div className="spacer"></div>
 
            *Kindly note this is a pre-order. We anticipate delivering your 'Time in Lieu' product by February 14th. Thank you for your patience.
            </p>

          {/* {priceLoaded ? <p>{price}</p> : <p>Loading price...</p>} */}

          <div className="dropdown-container">
            <div className="dropdown-header" onClick={toggleProductDetails}>
              <h4>PRODUCT DETAILS</h4>
              <svg
                className={`arrow down ${showProductDetails ? "hidden" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
              <svg
                className={`arrow up ${showProductDetails ? "" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 11.354a.5.5 0 0 1 .708 0L8 5.707l5.646 5.647a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z"
                />
              </svg>
            </div>
            {showProductDetails && (
              <div className="dropdown-content">
                <p className="dropdown-text">
                      • 65% Cotton, 35% Polyester
                      <br />
                      • Hand wash cold
                      <br />
                      • Made in China
                      <br />
                </p>
              </div>
            )}
          </div>

          <div className="dropdown-container">
            <div className="dropdown-header" onClick={toggleSizingDetails}>
              <h4>SIZING</h4>
              <svg
                className={`arrow down ${showSizingDetails ? "hidden" : ""}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                />
              </svg>
              <svg
                className={`arrow up ${showSizingDetails ? "" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                viewBox="0 0 16 16"
              >
                <path
                  fillRule="evenodd"
                  d="M1.646 11.354a.5.5 0 0 1 .708 0L8 5.707l5.646 5.647a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z"
                />
              </svg>
            </div>
            {showSizingDetails && (
              <div className="dropdown-content">
                <img src={size_chart}  className="size-chart-image" alt= "Size Chart"/>
              </div>
            )}
          </div>

          <div className="spacing-div"></div>

          {children}
        </div>
        <div className="gallery">
          <img src={images[`${selectedColorRef}_pullover_1.jpg`]} alt="Mobile 2" />
          <img src={images[`${selectedColorRef}_pullover_3.jpg`]} alt="Mobile 3" />
          <img src={images[`${selectedColorRef}_pullover_2.jpg`]} alt="Mobile 4" />
          <img src={images[`${selectedColorRef}_pullover_5.jpg`]} alt="Mobile 5" />
          <img src={images[`${selectedColorRef}_pullover_6.jpg`]} alt="Mobile 6" />
        </div>
      </div>
    );
  };

  const DesktopView = (children) => {
    return (
      <div className="desktop-view">
        <div className="top-images">
          <img src={images[`${selectedColorRef}_pullover_1.jpg`]} alt="Desktop 1" />
          <img src={images[`${selectedColorRef}_pullover_2.jpg`]} alt="Desktop 2" />
          <img src={images[`${selectedColorRef}_pullover_3.jpg`]} alt="Desktop 3" />
        </div>
        <div className="product-details">
          <div className="product-info">
            <div className="top-info">
              <h2>{title}</h2>
              {/* {priceLoaded ? <h3>{price}</h3> : <h3>Loading price...</h3>} */}
              <h3>{price}</h3>
              <p className="italic">Como (n)</p>
              <p className="indented">{description}</p>
              <p className="indented italic">
                Como, best worn when taking time off in lieu. 
              </p>
              <p>{colorDescriptor}</p>
              <p className="italic-model-info">{modelInfo}</p>
              <p className="disclaimer-font">
                *All COMO orders will receive a complimentary passport holder
                <div className="spacer"></div>
                *Please note that this is a pre-order: we aim to have your 'Time in Lieu' product to you by the 14th of February
              

              </p>


              <div className="dropdown-container">
                <div className="dropdown-header" onClick={toggleProductDetails}>
                  <h4>PRODUCT DETAILS</h4>
                  <svg
                    className={`arrow down ${
                      showProductDetails ? "hidden" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                  <svg
                    className={`arrow up ${showProductDetails ? "" : "hidden"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 11.354a.5.5 0 0 1 .708 0L8 5.707l5.646 5.647a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z"
                    />
                  </svg>
                </div>
                {showProductDetails && (
                  <div className="dropdown-content">
                    <p className="dropdown-text">
                      • 65% Cotton, 35% Polyester
                      <br />
                      • Hand wash cold
                      <br /> 
                      • Made in China
                      <br />
                    </p>
                  </div>
                )}
              </div>

              <div className="dropdown-container">
                <div className="dropdown-header" onClick={toggleSizingDetails}>
                  <h4>SIZING</h4>
                  <svg
                    className={`arrow down ${
                      showSizingDetails ? "hidden" : ""
                    }`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
                    />
                  </svg>
                  <svg
                    className={`arrow up ${showSizingDetails ? "" : "hidden"}`}
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1.646 11.354a.5.5 0 0 1 .708 0L8 5.707l5.646 5.647a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1-.708 0l-6 6a.5.5 0 0 1 0 .708z"
                    />
                  </svg>
                </div>
                {showSizingDetails && (
                  <div className="dropdown-content">
                    
                    <img src={size_chart}  className="size-chart-image" alt= "Size Chart"/>
                  </div>
                )}
              </div>
            </div>
            <div className="bottom-info">{children}</div>
          </div>
          <div className="product-image">
            <img
              src={images[`${selectedColorRef}_pullover_4.jpg`]}
              alt="Desktop 4"
            />
          </div>
        </div>
        <div className="bottom-images">
          <img src={images[`${selectedColorRef}_pullover_5.jpg`]} alt="Desktop 5" />
          <img src={images[`${selectedColorRef}_pullover_6.jpg`]} alt="Desktop 6" />
        </div>
      </div>
    );
  };

  return (
    <div className="container">
      {/* <Navbar /> */}
      <div className="product-page">
        {isMobile ? Mobileview(BuyButton) : DesktopView(BuyButton)}
      </div>
    </div>
  );
};

export default PulloverProductPage;
