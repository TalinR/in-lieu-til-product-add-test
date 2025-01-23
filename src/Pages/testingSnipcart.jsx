import React from 'react';
import { useSnipcart } from 'use-snipcart';
import products from "../data/snipcartProductTesting.json";
import "../Styles/ProductPage.css";

const TestingSnipcart = () => {
  const { cart = {} } = useSnipcart();
  console.log('Snipcart State:', cart); // This will help debug
  
  return (
    <div className="product-page">
      <div>
        {products.map(product => (
          <div key={product.id}>
            <h3>{product.title}</h3>
            <p>{product.description}</p>
            <p>${product.price}</p>
            <button 
              className="snipcart-add-item"
              data-item-id={product.id}
              data-item-price={product.price}
              data-item-url={window.location.pathname} // Use current path
              data-item-description={product.description}
              data-item-image={product.image}
              data-item-name={product.title}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      
      {/* Debug info */}
      <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5' }}>
        <p>Cart Total: ${cart.subtotal || '0.00'}</p>
        <p>Items in Cart: {cart.items?.length || 0}</p>
      </div>
    </div>
  );
};

export default TestingSnipcart;