import React, { useState } from 'react';
import products from "../data/snipcartProductTesting.json";
import "../Styles/ProductPage.css";

const TestingSnipcart = () => {
  // Get the base URL of your site
  const baseUrl = window.location.origin;
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  
  const handleSizeChange = (productId, size) => {
    setSelectedSizes({
      ...selectedSizes,
      [productId]: size
    });
  };

  const handleColorChange = (productId, color) => {
    setSelectedColors({
      ...selectedColors,
      [productId]: color
    });
  };
  
  return (
    <div className="product-page">
      <div>
        {products.map(product => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            
            {/* Size selector */}
            <select 
              value={selectedSizes[product.id] || 'Small'} 
              onChange={(e) => handleSizeChange(product.id, e.target.value)}
              style={{ marginBottom: '10px' }}
            >
              <option value="Small">S</option>
              <option value="Medium">M</option>
              <option value="Large">L</option>
              <option value="XL">XL</option>
            </select>
            
            {/* Color selector */}
            <select 
              value={selectedColors[product.id] || 'Yellow'} 
              onChange={(e) => handleColorChange(product.id, e.target.value)}
              style={{ marginBottom: '10px', marginLeft: '10px' }}
            >
              <option value="Yellow">Yellow</option>
              <option value="Red">Red</option>
            </select>
            
            <button 
              className="snipcart-add-item"
              data-item-id={product.id}
              data-item-price={product.price}
              data-item-url={`${baseUrl}/api/products.json`}
              data-item-description={product.description}
              data-item-image={product.image}
              data-item-name={product.title}
              data-item-custom1-name="Size"
              data-item-custom1-value={selectedSizes[product.id] || 'Small'}
              data-item-custom1-options="Small|Medium|Large|XL"
              data-item-custom1-required="true"
              data-item-custom2-name="Colour"
              data-item-custom2-value={selectedSizes[product.id] || 'Yellow'}
              data-item-custom2-options="Yellow|Red"
              data-item-custom2-required="true"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestingSnipcart;