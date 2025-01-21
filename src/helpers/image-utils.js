// utils/importImages.js
export const importAll = (requireContext) => {
    let images = {};
    requireContext.keys().forEach((item) => {
        images[item.replace('./', '')] = requireContext(item).default;
    });
    return images;
};

// Import images from the directory
const images = importAll(require.context('../assets/images', false, /\.(jpg|jpeg|png|svg)$/));
