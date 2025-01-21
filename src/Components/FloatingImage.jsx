import React from 'react';
import Draggable from 'react-draggable';

const FloatingImage = ({ imageSrc, onImageClick }) => {
    return (
        <Draggable bounds="parent">
            <img
                src={imageSrc}
                alt="floating"
                style={{ cursor: 'grab', position: 'absolute' }}
                onClick={onImageClick}
            />
        </Draggable>
    );
};

export default FloatingImage;
