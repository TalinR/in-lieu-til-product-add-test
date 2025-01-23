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
                {/* <button 
                  className="snipcart-add-item"
                  data-item-id={product.id}
                  data-item-image={product.image}
                  data-item-name={product.title}
                  data-item-price={product.price}
                >
                  Add to Cart
                </button> */}

                <button 
                className="snipcart-add-item"
                data-item-id="example-item"
                data-item-name="Example Product"
                data-item-price="19.99"
                data-item-url="https://time-in-lieu-site-git-main-talinrs-projects.vercel.app/snipcart-test"
                data-item-description="An example product for testing.">
                Add to Cart
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

