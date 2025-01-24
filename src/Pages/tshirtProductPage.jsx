import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation} from "react-router-dom";
import products from "../data/products.json";
import "../Styles/ProductPage.css";
import ShopifyBuy from "@shopify/buy-button-js";
import size_chart from "../assets/images/size_charts/shion_size_chart.png";


function importAll(r) {
  let images = {};
  r.keys().forEach((item) => {
    images[item.replace("./", "")] = r(item);
  });
  return images;
}

// Import all images
const tshirtCharcoalImages = importAll(
  require.context("../assets/images/tshirt/charcoal", false, /\.jpg$/)
);
const tshirtBeigeImages = importAll(
  require.context("../assets/images/tshirt/cream", false, /\.jpg$/)
);

const allImages = {
  Charcoal: tshirtCharcoalImages,
  Cream: tshirtBeigeImages,
};

const TshirtProductPage = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState({});
  const buyButtonInitialized = useRef(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialColor = query.get("color") || "Hibiscus Brown";
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedColorRef, setSelectedColorRef] = useState(initialColor.toLowerCase().replace(" ", "_"));
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState({});
  const [variants, setVariants] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showSizingDetails, setShowSizingDetails] = useState(false);
  const baseUrl = window.location.origin;

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
    const fetchInventory = async () => {
      try {
        const response = await fetch('https://app.snipcart.com/api/products', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa("ST_NGYwNDEwZjctYTliMS00NjU2LWI3ZjMtYTU1ZDE3NWZjNmNkNjM4NzMyNzUxNjE4MTE5Nzk0" + ':')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const inventoryMap = {};
          const variantsMap = {};
          
          // Find the t-shirt product
          const tshirtProduct = data.items.find(item => item.userDefinedId === "shion_tshirt");
          
          if (tshirtProduct) {
            inventoryMap[tshirtProduct.userDefinedId] = {
              stock: tshirtProduct.stock,
              variants: tshirtProduct.variants,
              price: tshirtProduct.price
            };
            
            // Extract sizes and colors
            const sizes = new Set();
            const colors = new Set();
            
            tshirtProduct.variants?.forEach(variant => {
              variant.variation.forEach(v => {
                if (v.name === 'Size') sizes.add(v.option);
                if (v.name === 'Colour') colors.add(v.option);
              });
            });
            
            variantsMap[tshirtProduct.userDefinedId] = {
              sizes: Array.from(sizes),
              colors: Array.from(colors)
            };
            
            setPrice(tshirtProduct.price);
          }
          
          setInventory(inventoryMap);
          setVariants(variantsMap);
          setSelectedSize(variantsMap.shion_tshirt?.sizes[0] || "");
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const isOutOfStock = (size, color) => {
    const productInventory = inventory.shion_tshirt;
    if (!productInventory) return false;
    
    if (productInventory.variants) {
      const variant = productInventory.variants.find(v => 
        v.variation.some(varItem => varItem.name === 'Size' && varItem.option === size) &&
        v.variation.some(varItem => varItem.name === 'Colour' && varItem.option === color)
      );
      return !variant || variant.stock <= 0;
    }
    
    return productInventory.stock <= 0;
  };

  useEffect(() => {
    const selectedId = `shion-tshirt-${selectedColor}`;
    
    const foundProduct = products.find((p) => p.productId === selectedId);

    if (foundProduct) {
      console.log(foundProduct)

      setProduct(foundProduct);
      const { color } = foundProduct;
      const { colourId } = foundProduct;

      // console.log(id)

      setSelectedColorRef(colourId);

      setImages(allImages[color] || {}); // Set images based on the color id

      const url = new URL(window.location);
      url.searchParams.set("color", selectedColor);
      window.history.pushState({}, "", url);
    }
  }, [productId, selectedColor]);

  // Effect to update selected color when the URL changes
  useEffect(() => {
    
    const currentColor = query.get("color") || "Charcoal";
    console.log(currentColor)
    
    console.log("HERE")
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
          id: "7361223491674",
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

  const { title, description, modelInfo, colorDescriptor, buttonDescription, productBulletPoint, disclaimerNote } = product;
  const productVariants = variants.shion_tshirt || { sizes: [], colors: [] };
  const outOfStock = isOutOfStock(selectedSize, selectedColor);

  const BuyButton = (
    <div>
      <div className="snipcart-selectors-container">
        <select 
          value={selectedSize}
          onChange={(e) => setSelectedSize(e.target.value)}
        >
          {productVariants.sizes.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>

        <select 
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        >
          {productVariants.colors.map(color => (
            <option key={color} value={color}>{color}</option>
          ))}
        </select>
      </div>
      
      <button 
        className={`snipcart-add-item ${outOfStock ? 'out-of-stock' : ''}`}
        data-item-id="shion_tshirt"
        data-item-price={price}
        data-item-url={`${baseUrl}/api/products.json`}
        data-item-description={description}
        data-item-image={images[`${selectedColorRef}_tshirt_1.jpg`]}
        data-item-name={title}
        data-item-custom1-name="Size"
        data-item-custom1-value={selectedSize}
        data-item-custom1-options={productVariants.sizes.join('|')}
        data-item-custom1-required="true"
        data-item-custom2-name="Colour"
        data-item-custom2-value={selectedColor}
        data-item-custom2-options={productVariants.colors.join('|')}
        data-item-custom2-required="true"
        disabled={outOfStock}
      >
        {outOfStock ? 'Out of Stock' : 'add to bag'}
      </button>
    </div>
  );

  const Mobileview = (children) => {
    return (
      <div className="mobile-view">
        {/* top image mobile */}
        {console.log({selectedColorRef})}
        <img
          src={images[`${selectedColorRef}_tshirt_4.jpg`]}
          alt="Mobile 1"
          className="main-image"
        />
        <div className="product-details">
          <h2>{title}</h2>
          <h3>{price}</h3>
          <p className="italic">Shion (n)</p>
          <p >{description}</p>
          <p className="italic">
              When worn alone, I am Shion. When layered, wear me in lieu of your daily blank T-Shirt. 
          </p>
          <p>{colorDescriptor}</p>

          <p className="italic-model-info">{modelInfo}</p>
          {disclaimerNote && <p className="disclaimer-font">{disclaimerNote}</p>}
          <p className="disclaimer-font">*Kindly note this is a pre-order. We anticipate delivering your 'Time in Lieu' product by February 14th. Thank you for your patience.</p>

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
                  {product.productBulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  {/* • 100% Cotton
                  <br />
                  • Seasonal 'Time in lieu' backprint
                  <br />
                  • Wash in cold gentle cycle
                  <br />
                  • Made in China 
                  <br /> */}
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
        {/* bottom 3 mobile images */}
        <div className="gallery">
          <img src={images[`${selectedColorRef}_tshirt_1.jpg`]} alt="Mobile 2" />
          <img src={images[`${selectedColorRef}_tshirt_3.jpg`]} alt="Mobile 3" />
          <img src={images[`${selectedColorRef}_tshirt_2.jpg`]} alt="Mobile 4" />
          <img src={images[`${selectedColorRef}_tshirt_5.jpg`]} alt="Mobile 5" />
          <img src={images[`${selectedColorRef}_tshirt_6.jpg`]} alt="Mobile 6" />
        </div>
      </div>
    );
  };

  const DesktopView = (children) => {
    return (
      <div className="desktop-view">
        {/* desktop top 3 images */}
        <div className="top-images">
          <img src={images[`${selectedColorRef}_tshirt_1.jpg`]} alt="Desktop 1" />
          <img src={images[`${selectedColorRef}_tshirt_2.jpg`]} alt="Desktop 2" />
          <img src={images[`${selectedColorRef}_tshirt_3.jpg`]} alt="Desktop 3" />
        </div>
        <div className="product-details">
          <div className="product-info">
            <div className="top-info">
              <h2>{title}</h2>
              {/* {priceLoaded ? <h3>{price}</h3> : <h3>Loading price...</h3>} */}
              <h3>{price}</h3>
              <p className="italic">Shion (n)</p>
              <p className="indented">{description}</p>
              <p className="indented italic">
                Avery, worn in lieu of your daily hoodie.
              </p>
              <p>{colorDescriptor}</p>
              {disclaimerNote && <p className="disclaimer-font">{disclaimerNote}</p>}
              <p className="disclaimer-font">*Kindly note this is a pre-order. We anticipate delivering your 'Time in Lieu' product by February 14th. Thank you for your patience.</p>

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
                    {product.productBulletPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                      {/* • 100% Cotton
                      <br />
                      • Seasonal 'Time in lieu' backprint
                      <br />
                      • Wash in cold gentle cycle
                      <br />
                      • Made in China 
                      <br /> */}
                    </p>
                  </div>
                )}
              </div>

              <div className="dropdown-container">
                {/* on desktop we want these sizing details to scroll into view */}
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
          {/* desktop next to product description */}
          <div className="product-image">
            <img
              src={images[`${selectedColorRef}_tshirt_4.jpg`]}
              alt="Desktop 4"
            />
          </div>
        </div>
        <div className="bottom-images">
          <img src={images[`${selectedColorRef}_tshirt_5.jpg`]} alt="Desktop 5" />
          <img src={images[`${selectedColorRef}_tshirt_6.jpg`]} alt="Desktop 6" />
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

export default TshirtProductPage;
