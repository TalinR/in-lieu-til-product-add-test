import React from 'react';
import products from "../data/snipcartProductTesting.json";
import "../Styles/ProductPage.css";

const TestingSnipcart = () => {
  // Get the base URL of your site
  const baseUrl = window.location.origin;
  console.log(baseUrl);
  
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
              data-item-url={`${baseUrl}/snipcart-test`}
              data-item-description={product.description}
              data-item-image={product.image}
              data-item-name={product.title}
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