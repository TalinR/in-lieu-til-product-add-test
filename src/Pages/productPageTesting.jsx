import React, { useEffect, useState, useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Navbar from "../Components/Navbar";
import products from '../data/products.json';
import "../Styles/ProductPageTest.css";
import ShopifyBuy from '@shopify/buy-button-js';
// import useShopifyBuyButton from './useShopifyBuyButton'; 


function importAll(r) {
    let images = {};
    r.keys().forEach((item) => { images[item.replace('./', '')] = r(item); });
    return images;
}

// Import all images
const hibiscusImages = importAll(require.context('../assets/images/hibiscus', false, /\.jpg$/));
const senchaImages = importAll(require.context('../assets/images/sencha', false, /\.jpg$/));
const oolongImages = importAll(require.context('../assets/images/oolong', false, /\.jpg$/));

const allImages = {
    Hibiscus: hibiscusImages,
    Sencha: senchaImages,
    Oolong: oolongImages,
};


const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [images, setImages] = useState({});
    const buyButtonInitialized = useRef(false);
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const initialColor = query.get('color') || 'Sencha'; // Default to 'Sencha' if no color is provided
    const [selectedColor, setSelectedColor] = useState(initialColor); // Default to 'sencha'
    const [selectedColorRef, setSelectedColorRef] = useState(useState(initialColor.toLowerCase()));
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // const containerRef = useRef(null);


    // useEffect(() => {
    //     // if (!containerRef.current) return;



    // const options = {
    //     "product": {
    //         "iframe": false,
    //         "width": "100%",
    //         "styles": {
    //             "product": {
    //                 "text-align": "left"
    //             },
    //             "button": {
    //                 ":hover": {
    //                     "background-color": "#000000"
    //                 },
    //                 "background-color": "#000000",
    //                 ":focus": {
    //                     "background-color": "#000000"
    //                 },
    //                 "border-radius": "32px",
    //                 'padding': '10px 0',
    //                 'display': 'block',
    //                 'width': '100%',
    //             },
    //         },
    //         "contents": {
    //             "img": false,
    //             "title": false,
    //             "price": false
    //         },
    //         "text": {
    //             "button": "Add to cart"
    //         },
                            
    //         "events": {
    //             afterInit:function (component) {
    //                 console.log("HERE")
    //                 if(selectedColor)
    //                 component.updateVariant("Color", selectedColor)
    //             },
    //             afterRender: function (component) {
    //                 document.querySelectorAll('.shopify-buy__option-select__select').forEach(function (selectElement) {
    //                     selectElement.addEventListener('change', function () {
    //                         setTimeout(() => {
    //                             const selectedColor = component.selectedOptions.Color;
    //                             console.log('calling setter to udpate selectedColor', selectedColor);
    //                             setSelectedColor(selectedColor);
    //                         }, 100); // Add a slight delay to allow Shopify component to update
    //                     });
    //                 });
    //             }
    //         }
    //     },
    //     "cart": {
    //         "iframe": true,
    //         "styles": {
    //             "button": {
    //                 ":hover": {
    //                     "background-color": "#000000"
    //                 },
    //                 "background-color": "#000000",
    //                 ":focus": {
    //                     "background-color": "#000000"
    //                 },
    //                 "border-radius": "32px"
    //             }
    //         },
    //         "text": {
    //             "total": "Subtotal",
    //             "button": "Checkout"
    //         }
    //     }
    // }

    //     // Create Shopify Buy Button
    //     const client = ShopifyBuy.buildClient({
    //         domain: 'your-shopify-domain.myshopify.com',
    //         storefrontAccessToken: 'your-storefront-access-token',
    //     });

    //     const ui = ShopifyBuy.UI.init(client);

    //     const createComponent = () => {
    //         ui.createComponent('product', {
    //             id: productId,
    //             node: containerRef.current,
    //             options: options,
    //         });
    //     };

    //     createComponent();

    //     // Cleanup function to remove Shopify Buy Button instance
    //     return () => {
    //         // You might need to handle cleanup depending on the Shopify Buy Button library
    //         containerRef.current.innerHTML = '';
    //     };
    // }, [productId, selectedColor]);

    // const shopifyBuyButtonRef = containerRef;


    // const buyButtonRef = useShopifyBuyButton()


    useEffect(() => {
        // Keep track of previous window width to detect view mode changes
        let prevWidth = window.innerWidth;
        
        // Handler to call on window resize
        const handleResize = () => {
            const isCurrentlyMobile = window.innerWidth <= 768;
            if ((prevWidth <= 768 && window.innerWidth > 768) || (prevWidth > 768 && window.innerWidth <= 768)) {
                buyButtonInitialized.current = false;
                setIsMobile(isCurrentlyMobile);
                console.log("View mode changed");
            }
            prevWidth = window.innerWidth;
        };

        // Add event listener on mount
        window.addEventListener('resize', handleResize);

        // Call handler right away so state gets updated with initial window size
        handleResize();

        // Remove event listener on cleanup
        return () => window.removeEventListener('resize', handleResize);
    }, []);


    useEffect(() => {
        const foundProduct = products.find(p => p.color === selectedColor);

        if (foundProduct) {
            setProduct(foundProduct);
            const { color } = foundProduct;
            // console.log(foundProduct)

            const { id } = foundProduct;

            setSelectedColorRef(id)

            setImages(allImages[color] || {}); // Set images based on the color id
            // console.log(images)

            
            
        }
    }, [productId, selectedColor]);

    useEffect(() => {
        if (buyButtonInitialized.current) return;

        if (product) {
            const client = ShopifyBuy.buildClient({
                domain: 'b1df9b-e3.myshopify.com',
                storefrontAccessToken: '755e0cfdd1e1f9277e389116d88e443b',
            });

            const ui = ShopifyBuy.UI.init(client);

            const createBuyButton = (elementId) => {
                ui.createComponent('product', {
                    id: '9653892710721',
                    node: document.getElementById(elementId),
                    moneyFormat: '%24%7B%7Bamount%7D%7D',
                    options: {
                        "product": {
                            "iframe": false,
                            "width": "100%",
                            "styles": {
                                "product": {
                                    "text-align": "left"
                                },
                                "button": {
                                    ":hover": {
                                        "background-color": "#000000"
                                    },
                                    "background-color": "#000000",
                                    ":focus": {
                                        "background-color": "#000000"
                                    },
                                    "border-radius": "32px",
                                    'padding': '10px 0',
                                    'display': 'block',
                                    'width': '100%',
                                },
                            },
                            "contents": {
                                "img": false,
                                "title": false,
                                "price": false
                            },
                            "text": {
                                "button": "Add to cart"
                            },
                                            
                            "events": {
                                afterInit:function (component) {
                                    console.log("HERE")
                                    if(selectedColor)
                                    component.updateVariant("Color", selectedColor)
                                },
                                afterRender: function (component) {
                                    document.querySelectorAll('.shopify-buy__option-select__select').forEach(function (selectElement) {
                                        selectElement.addEventListener('change', function () {
                                            setTimeout(() => {
                                                const selectedColor = component.selectedOptions.Color;
                                                console.log('calling setter to udpate selectedColor', selectedColor);
                                                setSelectedColor(selectedColor);
                                            }, 10); // Add a slight delay to allow Shopify component to update
                                        });
                                    });
                                }
                            }
                        },
                        "cart": {
                            "iframe": true,
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
                        }
                    },
                });
            };
            
            

            createBuyButton('product-component-desktop');
            // createBuyButton('product-component-mobile');
            buyButtonInitialized.current = true; // Mark the buy button as initialized
        }
    }, [product, selectedColor,isMobile]);

    if (!product) {
        return <div>Product not found</div>;
    }
    

    
    const { title, description, price, id, modelInfo} = product;

    const BuyButton =  
         (<div id="product-component-desktop" ></div>)


    const Mobileview = (children) => {

        
        return (            
        <div className="mobile-view">
            <img src={images[`${selectedColorRef}_back.jpg`]} alt="Main Product" className="main-image" />
            <div className="product-details">
                <h2>{title}</h2>
                <p className="italic">Avery (n)</p>
                <p className="indented">Unisex relaxed fit hoodie knitted from a soft wool and nylon blend for comfort against skin. Avery features a tortoise shell button at the hood - intended to fit like a loose balaclava when buttoned.</p>
                <p className="indented italic">Avery, worn in lieu of your daily hoodie.</p>
                <p>Colour: {selectedColorRef}</p>
                <p className="italic">{modelInfo}</p>
                <p>{price}</p>
                {/* <div id="product-component-desktop" ></div> */}
                {children}
            </div>
            <div className="gallery">
                <img src={images[`${selectedColorRef}_back.jpg`]} alt="Gallery Image 1" />
                <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Gallery Image 2" />
                <img src={images[`${selectedColorRef}_front.jpg`]} alt="Gallery Image 3" />
            </div>
        </div> )

    }

    const DesktopView = (children) => {

        return   (          
        <div className="desktop-view">
            <div className="top-images">
                <img src={images[`${selectedColorRef}_front.jpg`]} alt="Top Image 1" />
                <img src={images[`${selectedColorRef}_casual.jpg`]} alt="Top Image 2" />
                <img src={images[`${selectedColorRef}_hooded.jpg`]} alt="Top Image 3" />
            </div>
            <div className="product-details">
                <div className="product-info">
                    <div className="top-info">
                        <h2>{title}</h2>
                        <p className="italic">Avery (n)</p>
                        <p className="indented">{description}</p>
                        <p className="indented italic">Avery, worn in lieu of your daily hoodie.</p>
                        <p>Colour: {selectedColor}</p>
                        <p className="italic">{modelInfo}</p>
                    </div>
                    <div className="bottom-info">
                        <p>{price}</p>
                        {/* <div id="product-component-desktop" ></div> */}
                        {children}
                    </div>
                </div>
                <div className="product-image">
                    <img src={images[`${selectedColorRef}_front.jpg`]} alt="Product" />
                </div>
            </div>
            <div className="bottom-images">
                <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Bottom Image 1" />
                <img src={images[`${selectedColorRef}_back.jpg`]} alt="Bottom Image 2" />
            </div>
        </div>)            


    }

    return (
        <div className="container">
            <Navbar />

            <div className="product-page">
                {console.log('isMobile', isMobile)}

                {isMobile ? Mobileview(BuyButton) : DesktopView(BuyButton)}

                {/* Desktop View */}
                {/* <div className="desktop-view">
                    <div className="top-images">
                        <img src={images[`${selectedColorRef}_front.jpg`]} alt="Top Image 1" />
                        <img src={images[`${selectedColorRef}_casual.jpg`]} alt="Top Image 2" />
                        <img src={images[`${selectedColorRef}_hooded.jpg`]} alt="Top Image 3" />
                    </div>
                    <div className="product-details">
                        <div className="product-info">
                            <div className="top-info">
                                <h2>{title}</h2>
                                <p className="italic">Avery (n)</p>
                                <p className="indented">{description}</p>
                                <p className="indented italic">Avery, worn in lieu of your daily hoodie.</p>
                                <p>Colour: {selectedColor}</p>
                                <p className="italic">{modelInfo}</p>
                            </div>
                            <div className="bottom-info">
                                <p>{price}</p>
                                <div id="product-component-desktop"></div>
                            </div>
                        </div>
                        <div className="product-image">
                            <img src={images[`${selectedColorRef}_front.jpg`]} alt="Product" />
                        </div>
                    </div>
                    <div className="bottom-images">
                        <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Bottom Image 1" />
                        <img src={images[`${selectedColorRef}_back.jpg`]} alt="Bottom Image 2" />
                    </div>
                </div> */}

                {/* Mobile View */}
                {/* <div className="mobile-view">
                    <img src={images[`${selectedColorRef}_back.jpg`]} alt="Main Product" className="main-image" />
                    <div className="product-details">
                        <h2>{title}</h2>
                        <p className="italic">Avery (n)</p>
                        <p className="indented">Unisex relaxed fit hoodie knitted from a soft wool and nylon blend for comfort against skin. Avery features a tortoise shell button at the hood - intended to fit like a loose balaclava when buttoned.</p>
                        <p className="indented italic">Avery, worn in lieu of your daily hoodie.</p>
                        <p>Colour: {selectedColorRef}</p>
                        <p className="italic">{modelInfo}</p>
                        <p>{price}</p>
                        <div id="product-component-mobile"></div>
                    </div>
                    <div className="gallery">
                        <img src={images[`${selectedColorRef}_back.jpg`]} alt="Gallery Image 1" />
                        <img src={images[`${selectedColorRef}_angled.jpg`]} alt="Gallery Image 2" />
                        <img src={images[`${selectedColorRef}_front.jpg`]} alt="Gallery Image 3" />
                    </div>
                </div> */}
            </div>
        </div>
    );
};

export default ProductPage;