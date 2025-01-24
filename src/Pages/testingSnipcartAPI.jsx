import React, { useState, useEffect } from 'react';
import products from "../data/snipcartProductTesting.json";
import "../Styles/ProductPage.css";

const TestingSnipcartAPI = () => {
  // Get the base URL of your site
  const baseUrl = window.location.origin;
  const [selectedSizes, setSelectedSizes] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [inventory, setInventory] = useState({});
  const [variants, setVariants] = useState({});
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await fetch('https://app.snipcart.com/api/products', {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Basic ${btoa(process.env.REACT_APP_SNIPCART_SECRET_KEY + ':')}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          const inventoryMap = {};
          const variantsMap = {};
          
          data.items.forEach(product => {
            inventoryMap[product.userDefinedId] = {
              stock: product.stock,
              variants: product.variants
            };

            
            // Extract unique sizes and colors from variants
            const sizes = new Set();
            const colors = new Set();
            
            product.variants?.forEach(variant => {
              variant.variation.forEach(v => {
                if (v.name === 'Size') sizes.add(v.option);
                if (v.name === 'Colour') colors.add(v.option);
              });
            });
            
            variantsMap[product.userDefinedId] = {
              sizes: Array.from(sizes),
              colors: Array.from(colors)
            };
          });
          
          setInventory(inventoryMap);
          setVariants(variantsMap);
        }
      } catch (error) {
        console.error('Error fetching inventory:', error);
      }
    };

    fetchInventory();
  }, []);
  
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
  
  const isOutOfStock = (productId, size, color) => {
    const productInventory = inventory[productId];
    if (!productInventory) return false; // Default to in stock if we can't verify
    
    if (productInventory.variants) {
      const variant = productInventory.variants.find(v => 
        v.variation.some(varItem => varItem.name === 'Size' && varItem.option === size) &&
        v.variation.some(varItem => varItem.name === 'Colour' && varItem.option === color)
      );
      return !variant || variant.stock <= 0;
    }
    
    return productInventory.stock <= 0;
  };
  
  return (
    <div className="product-page">
      <div>
        {products.map(product => {
          const productVariants = variants[product.id] || { sizes: [], colors: [] };
          const outOfStock = isOutOfStock(
            product.id, 
            selectedSizes[product.id] || productVariants.sizes[0],
            selectedColors[product.id] || productVariants.colors[0]
          );
          
          return (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              
              <select 
                value={selectedSizes[product.id] || productVariants.sizes[0]} 
                onChange={(e) => handleSizeChange(product.id, e.target.value)}
                style={{ marginBottom: '10px' }}
              >
                {productVariants.sizes.map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
              
              <select 
                value={selectedColors[product.id] || productVariants.colors[0]} 
                onChange={(e) => handleColorChange(product.id, e.target.value)}
                style={{ marginBottom: '10px', marginLeft: '10px' }}
              >
                {productVariants.colors.map(color => (
                  <option key={color} value={color}>{color}</option>
                ))}
              </select>
              
              <button 
                className={`snipcart-add-item ${outOfStock ? 'out-of-stock' : ''}`}
                data-item-id={product.id}
                data-item-price={product.price}
                data-item-url={`${baseUrl}/api/products.json`}
                data-item-description={product.description}
                data-item-image={product.image}
                data-item-name={product.title}
                data-item-custom1-name="Size"
                data-item-custom1-value={selectedSizes[product.id] || productVariants.sizes[0]}
                data-item-custom1-options={productVariants.sizes.join('|')}
                data-item-custom1-required="true"
                data-item-custom2-name="Colour"
                data-item-custom2-value={selectedColors[product.id] || productVariants.colors[0]}
                data-item-custom2-options={productVariants.colors.join('|')}
                data-item-custom2-required="true"
                disabled={outOfStock}
              >
                {outOfStock ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestingSnipcartAPI;