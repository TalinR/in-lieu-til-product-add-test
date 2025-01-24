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

  const getOptions = (product, fieldName) => {
    const field = product.customFields?.find(f => f.name === fieldName);
    return field ? field.options.split('|') : [];
  };
  
  return (
    <div className="product-page">
      <div>
        {products.map(product => {
          const sizes = getOptions(product, 'Size');
          const colors = getOptions(product, 'Colour');
          
          return (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              
              <select 
                value={selectedSizes[product.id] || sizes[0]} 
                onChange={(e) => handleSizeChange(product.id, e.target.value)}
                style={{ marginBottom: '10px' }}
              >
                {sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              
              <select 
                value={selectedColors[product.id] || colors[0]} 
                onChange={(e) => handleColorChange(product.id, e.target.value)}
                style={{ marginBottom: '10px', marginLeft: '10px' }}
              >
                {colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
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
                data-item-custom1-value={selectedSizes[product.id] || sizes[0]}
                data-item-custom1-options={sizes.join('|')}
                data-item-custom1-required="true"
                data-item-custom2-name="Colour"
                data-item-custom2-value={selectedColors[product.id] || colors[0]}
                data-item-custom2-options={colors.join('|')}
                data-item-custom2-required="true"
              >
                Add to Cart
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestingSnipcart;