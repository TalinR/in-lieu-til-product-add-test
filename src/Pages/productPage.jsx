import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation} from "react-router-dom";
import products from "../data/products.json";
import "../Styles/ProductPage.css";
import ShopifyBuy from "@shopify/buy-button-js";
import size_chart from "../assets/images/updated_size_chart.png";


function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// Import all images
const hibiscusImages = importAll(
  require.context("../assets/images/hibiscus", false, /\.jpg$/)
);
const senchaImages = importAll(
  require.context("../assets/images/sencha", false, /\.jpg$/)
);
const oolongImages = importAll(
  require.context("../assets/images/oolong", false, /\.jpg$/)
);

const allImages = {
  Hibiscus: hibiscusImages,
  Sencha: senchaImages,
  Oolong: oolongImages,
};

const ProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState({});
  const buyButtonInitialized = useRef(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialColor = query.get("color") || "Sencha"; // Default to 'Sencha' if no color is provided
  const [selectedColor, setSelectedColor] = useState(initialColor); // Default to 'sencha'
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
    const foundProduct = products.find((p) => p.color === selectedColor);

    if (foundProduct) {
      setProduct(foundProduct);
      const { color } = foundProduct;
      const { id } = foundProduct;

      // console.log(id)

      setSelectedColorRef(id);

      setImages(allImages[color] || {}); // Set images based on the color id

      const url = new URL(window.location);
      url.searchParams.set("color", selectedColor);
      window.history.pushState({}, "", url);
    }
  }, [productId, selectedColor]);

  // Effect to update selected color when the URL changes
  useEffect(() => {
    
    const currentColor = query.get("color") || "Sencha";
    if (currentColor !== selectedColor) {
      console.log(currentColor)

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
        domain: "b1df9b-e3.myshopify.com",
        storefrontAccessToken: "755e0cfdd1e1f9277e389116d88e443b",
      });

      const ui = ShopifyBuy.UI.init(client);

      const createBuyButton = (elementId) => {
        ui.createComponent("product", {
          id: "9653892710721",
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

  const { title, description, modelInfo, colorDescriptor, buttonDescription } = product;

  const BuyButton = <div id="product-component"></div>;

  const Mobileview = (children) => {
    return (
      <div className="mobile-view">
        <img
          src={images[`${selectedColorRef}_casual.jpg`]}
          alt="Main Product"
          className="main-image"
        />
        <div className="product-details">
          <h2>{title}</h2>
          <h3>{price}</h3>
          <p className="italic">Avery (n)</p>
          <p >{description}</p>
          <p className="italic">
            Avery, worn in lieu of your daily hoodie.
          </p>
          <p>{colorDescriptor}</p>
          <p className="italic-model-info">{modelInfo}</p>
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
                  • 43% Nylon, 40% Acrylic, 17% Wool
                  <br />
                  • Ribbed cuffs and hem
                  <br />
                  • {buttonDescription}
                  <br />
                  • Balaclava styled hood 
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
          <img src={images[`${selectedColorRef}_back.jpg`]} alt="Back" />
          <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Angled" />
          <img src={images[`${selectedColorRef}_front.jpg`]} alt="Front" />
        </div>
      </div>
    );
  };

  const DesktopView = (children) => {
    return (
      <div className="desktop-view">
        <div className="top-images">
          <img src={images[`${selectedColorRef}_front.jpg`]} alt="Front" />
          <img src={images[`${selectedColorRef}_casual.jpg`]} alt="Casual" />
          <img src={images[`${selectedColorRef}_hooded.jpg`]} alt="Hooded" />
        </div>
        <div className="product-details">
          <div className="product-info">
            <div className="top-info">
              <h2>{title}</h2>
              {/* {priceLoaded ? <h3>{price}</h3> : <h3>Loading price...</h3>} */}
              <h3>{price}</h3>
              <p className="italic">Avery (n)</p>
              <p className="indented">{description}</p>
              <p className="indented italic">
                Avery, worn in lieu of your daily hoodie.
              </p>
              <p>{colorDescriptor}</p>
              <p className="italic-model-info">{modelInfo}</p>

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
                      • 43% Nylon, 40% Acrylic, 17% Wool
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
              src={images[`${selectedColorRef}_front_close.jpg`]}
              alt="Front"
            />
          </div>
        </div>
        <div className="bottom-images">
          <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Angled" />
          <img src={images[`${selectedColorRef}_back.jpg`]} alt="Back" />
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

export default ProductPage;
