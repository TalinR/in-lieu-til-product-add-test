import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import products from "../data/products.json";
import "../Styles/ProductPage.css";
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
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const initialColor = query.get("color") || "Campari";
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedColorRef, setSelectedColorRef] = useState(initialColor.toLowerCase());
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [price, setPrice] = useState("");
  const [inventory, setInventory] = useState({});
  const [variants, setVariants] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showSizingDetails, setShowSizingDetails] = useState(false);
  const baseUrl = window.location.origin;

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('https://app.snipcart.com/api/products', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa("ST_ZjkwMDRmZDQtNmFkOC00MWFjLWE1YjctOTJiY2U1MTA1YzZkNjM4NzMyODc5MTUyMjc5MjE5" + ':')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const inventoryMap = {};
          const variantsMap = {};
          
          // Find the pullover product
          const pulloverProduct = data.items.find(item => item.userDefinedId === "como_pullover");
          
          if (pulloverProduct) {
            inventoryMap[pulloverProduct.userDefinedId] = {
              stock: pulloverProduct.stock,
              variants: pulloverProduct.variants,
              price: pulloverProduct.price
            };
            
            // Extract sizes and colors
            const sizes = new Set();
            const colors = new Set();
            
            pulloverProduct.variants?.forEach(variant => {
              variant.variation.forEach(v => {
                if (v.name === 'Size') sizes.add(v.option);
                if (v.name === 'Colour') colors.add(v.option);
              });
            });
            
            variantsMap[pulloverProduct.userDefinedId] = {
              sizes: Array.from(sizes),
              colors: Array.from(colors)
            };
            
            setPrice(pulloverProduct.price);
          }
          
          setInventory(inventoryMap);
          setVariants(variantsMap);
          setSelectedSize(variantsMap.como_pullover?.sizes[0] || "");
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);

  const isOutOfStock = (size, color) => {
    const productInventory = inventory.como_pullover;
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
      setSelectedColor(currentColor);
    }
  }, [location.search]);

  if (!product) {
    return <div>Product not found</div>;
  }

  const { title, description, modelInfo, colorDescriptor } = product;
  const productVariants = variants.como_pullover || { sizes: [], colors: [] };
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
        data-item-id="como_pullover"
        data-item-price={price}
        data-item-url={`${baseUrl}/api/products.json`}
        data-item-description={description}
        data-item-image={images[`${selectedColorRef}_pullover_1.jpg`]}
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
        <img
          src={images[`${selectedColorRef}_pullover_4.jpg`]}
          alt="Mobile 1"
          className="main-image"
        />
        <div className="product-details">
          <h2>{title}</h2>
          <h3>${price}</h3>
          <p className="italic">Como (n)</p>
          <p >{description}</p>
          <p className="italic">
            Como, best worn when taking time off in lieu.
          </p>
          <p>{colorDescriptor}</p>
          <p className="italic-model-info">{modelInfo}</p>
          <p className="disclaimer-font">
            *Kindly note this is a pre-order. We anticipate delivering your 'Time in Lieu' product by February 14th. Thank you for your patience.
          </p>

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
              <h3>${price}</h3>
              <p className="italic">Como (n)</p>
              <p className="indented">{description}</p>
              <p className="indented italic">
                Como, best worn when taking time off in lieu. 
              </p>
              <p>{colorDescriptor}</p>
              <p className="italic-model-info">{modelInfo}</p>
              <p className="disclaimer-font">
                *Kindly note this is a pre-order. We anticipate delivering your 'Time in Lieu' product by February 14th. Thank you for your patience.
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
      <div className="product-page">
        {isMobile ? Mobileview(BuyButton) : DesktopView(BuyButton)}
      </div>
    </div>
  );
};

export default PulloverProductPage;