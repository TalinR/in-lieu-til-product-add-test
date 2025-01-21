import { useEffect, useRef } from 'react';
import ShopifyBuy from 'shopify-buy';

export const useShopifyBuyButton = (productId, options) => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Create Shopify Buy Button
        const client = ShopifyBuy.buildClient({
            domain: 'your-shopify-domain.myshopify.com',
            storefrontAccessToken: 'your-storefront-access-token',
        });

        const ui = ShopifyBuy.UI.init(client);

        const createComponent = () => {
            ui.createComponent('product', {
                id: productId,
                node: containerRef.current,
                options: options,
            });
        };

        createComponent();

        // Cleanup function to remove Shopify Buy Button instance
        return () => {
            // You might need to handle cleanup depending on the Shopify Buy Button library
            containerRef.current.innerHTML = '';
        };
    }, [productId, options]);

    return containerRef;
};


export default useShopifyBuyButton;