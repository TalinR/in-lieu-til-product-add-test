import React from 'react';
import products from "../data/snipcartProductTesting.json";
import "../Styles/ProductPage.css";

const TestingSnipcart = () => {

    console.log(products);
  return (
    <div className="product-page">
      <div>
        {products.map(product => {
          return (
            <div key={product.id}>
              <h3>{product.title}</h3>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <p>
                <button 
                  className="snipcart-add-item"
                  data-item-id={product.id}
                  data-item-image={product.image}
                  data-item-name={product.title}
                  data-item-price={product.price}
                >
                  Add to Cart
                </button>
                <button 
                  class="snipcart-add-item"
                  data-item-id="starry-night"
                  data-item-price="79.99"
                  data-item-url="/paintings/starry-night"
                  data-item-description="High-quality replica of The Starry Night by the Dutch post-impressionist painter Vincent van Gogh."
                  data-item-image="/assets/images/starry-night.jpg"
                  data-item-name="The Starry Night"
                  data-item-custom1-name="Frame color"
                  data-item-custom1-options="Black|Brown|Gold">
                  
                </button>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TestingSnipcart;

