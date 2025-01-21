// utils/loadShopifyBuy.js
export const loadShopifyBuy = () => {
    return new Promise((resolve, reject) => {
        if (window.ShopifyBuy) {
            resolve(window.ShopifyBuy);
            return;
        }

        const script = document.createElement('script');
        script.src = 'https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js';
        script.async = true;

        script.onload = () => {
            if (window.ShopifyBuy) {
                resolve(window.ShopifyBuy);
            } else {
                reject(new Error('ShopifyBuy failed to load.'));
            }
        };

        script.onerror = () => reject(new Error('ShopifyBuy failed to load.'));

        document.head.appendChild(script);
    });
};
