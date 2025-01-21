# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)




so at the top we have our navbar (for mobile and desktop)

for desktop:

under the navbar will be 3 square images side by side that take up the width of the page.

the next section is a product title, description, pricing and cart options on the left with an image on the right that matches the height of the product description

the next section is just 2 images side by side that take up the width of the page

for mobile:

under the navbar we have 1 full width image
under the first image we have the product title, description, pricing and cart options
the next section is just 3 full width images


<div id='product-component-1722224009829'></div>
<script type="text/javascript">
/*<![CDATA[*/
(function () {
  var scriptURL = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
  if (window.ShopifyBuy) {
    if (window.ShopifyBuy.UI) {
      ShopifyBuyInit();
    } else {
      loadScript();
    }
  } else {
    loadScript();
  }
  function loadScript() {
    var script = document.createElement('script');
    script.async = true;
    script.src = scriptURL;
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(script);
    script.onload = ShopifyBuyInit;
  }
  function ShopifyBuyInit() {
    var client = ShopifyBuy.buildClient({
      domain: 'b1df9b-e3.myshopify.com',
      storefrontAccessToken: '755e0cfdd1e1f9277e389116d88e443b',
    });
    ShopifyBuy.UI.onReady(client).then(function (ui) {
      ui.createComponent('product', {
        id: '9653892710721',
        node: document.getElementById('product-component-1722224009829'),
        moneyFormat: '%24%7B%7Bamount%7D%7D',
        options: {
  "product": {
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "calc(25% - 20px)",
          "margin-left": "20px",
          "margin-bottom": "50px"
        }
      },
      "button": {
        ":hover": {
          "background-color": "#000000"
        },
        "background-color": "#000000",
        ":focus": {
          "background-color": "#000000"
        },
        "border-radius": "32px"
      }
    },
    "contents": {
      "img": false,
      "title": false,
      "price": false
    },
    "text": {
      "button": "Add to cart"
    }
  },
  "productSet": {
    "styles": {
      "products": {
        "@media (min-width: 601px)": {
          "margin-left": "-20px"
        }
      }
    }
  },
  "modalProduct": {
    "contents": {
      "img": false,
      "imgWithCarousel": true,
      "button": false,
      "buttonWithQuantity": true
    },
    "styles": {
      "product": {
        "@media (min-width: 601px)": {
          "max-width": "100%",
          "margin-left": "0px",
          "margin-bottom": "0px"
        }
      },
      "button": {
        ":hover": {
          "background-color": "#000000"
        },
        "background-color": "#000000",
        ":focus": {
          "background-color": "#000000"
        },
        "border-radius": "32px"
      }
    },
    "text": {
      "button": "Add to cart"
    }
  },
  "option": {},
  "cart": {
    "styles": {
      "button": {
        ":hover": {
          "background-color": "#000000"
        },
        "background-color": "#000000",
        ":focus": {
          "background-color": "#000000"
        },
        "border-radius": "32px"
      }
    },
    "text": {
      "total": "Subtotal",
      "button": "Checkout"
    }
  },
  "toggle": {
    "styles": {
      "toggle": {
        "background-color": "#000000",
        ":hover": {
          "background-color": "#000000"
        },
        ":focus": {
          "background-color": "#000000"
        }
      }
    }
  }
},
      });
    });
  }
})();
/*]]>*/
</script>



# todo
- right now on viewport change we're listening to the selected colour but we're not doing the same for size, we need to listen to/ change size on viewport change too
- desktop view for product page (spacing to right and image height needs to change/ image needs to be cropped)
- need to add url query/ change url query for every single colour change (so that link can be copied and right colour will always display)
- cart icon for mobile view (but do we even actually want this?)
  - if we do, we need to link it to the numbers/ need to link it to the actual cart which would be a lot of work potentially




when the scroll bar kept disappearing from a full length page and i didnt want to to be scrollable:

the solution actually ended up being to set 

```
height: 100lvh;

and 

body, html {
overflow: hidden;
}
```

however, note:

There are now three new viewport units:
sv* - Smallest possible viewport, the size without the address bar
lv* - Largest possible viewport, the size including the address bar
dv* - Dynamic viewport, the size depending on whether the address bar is visible



- Tidy up navbar (not all items are centred rn)
- Need to do size guide
- We can’t use price from JSON, we need to use the shopify price
- Might need to check if the price is being displayed correctly in local currency. Unsure if this is currently the case
    - From here we can display *currency code*{price}
- Need to change colour title “hibiscus” etc to fk roman font



Navbar:
- Tidy up navbar (not all items are centred rn)
- Animate the buttons/ make slide out transition smoother

Product page:
- Need to do size guide

Email submission:
- Have to use a different gmail account (not my personal one)
- Style it better

Lookbook:
- Font ontop of mobile has to change (ideally it should always be max width) so some variable size font to always span the width would be nice
- Gaps between images (particularly on bottom and top) needs to be smaller/ change so the images are closer together
- I have higher resolution photos (need to switch)

Password page:

https://script.google.com/macros/s/AKfycbxhI_erZZRkgDlOMEERNeZ4vnyDtal-Dx5PHDRuumDV-Kgs0cYt_Uyo1-Juvrmi3wP6/exec


A	inlieuofficial.com	75.2.70.75

About page: 
- Change font and weight


