import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import '../Styles/ledScroller.css';

/**
 * LedScroller Component
 * Renders a horizontally scrolling LED display with repeating text
 * 
 * @component
 * @param {Object} props - Component props
 * @param {string} [props.text="IN LIEU"] - Text to be displayed and repeated
 * @param {number} [props.speed=2] - Scroll speed in pixels per frame
 * @param {string} [props.color="#ffffff"] - Color of the LED text
 * @param {number} [props.gap=100] - Gap between repeated text in pixels
 * @returns {React.ReactElement} A scrolling LED display
 */
const LedScroller = ({ 
  text = "IN LIEU", 
  speed = 2, // pixels per frame
  color = "#ffffff", // LED color
  gap = 100 // pixels between repeated text
}) => {
  // Refs for DOM elements
  const scrollerRef = useRef(null);      // Reference to the scroller container
  const containerRef = useRef(null);      // Reference to the outer container
  
  // State to track horizontal positions of each text copy
  const [positions, setPositions] = useState([0]);

  useEffect(() => {
    // Wait for refs to be available
    if (!scrollerRef.current || !containerRef.current) return;
    
    // Calculate dimensions
    const containerWidth = containerRef.current.offsetWidth;
    const textWidth = scrollerRef.current.children[0].offsetWidth;
    const totalWidth = textWidth + gap; // Single text instance width including gap
    
    // Calculate number of copies needed to fill screen plus one for smooth transition
    const numberOfCopies = Math.ceil(containerWidth / totalWidth) + 1;
    
    // Initialize position for each text copy
    // Start all copies off-screen to the right and space them evenly
    setPositions(Array.from({ length: numberOfCopies }, (_, i) => 
      containerWidth + (i * totalWidth)
    ));

    /**
     * Animation function that updates positions of all text copies
     * Creates infinite scrolling effect by repositioning elements
     * when they move off-screen
     */
    const animate = () => {
      setPositions(prev => {
        return prev.map(pos => {
          // Move each copy left by speed amount
          let newPos = pos - speed;
          
          // If copy has moved completely off screen to the left
          if (newPos < -textWidth) {
            // Find the rightmost position and place copy there
            newPos = Math.max(...prev) + totalWidth;
          }
          return newPos;
        });
      });
    };

    // Set up animation loop at 60fps
    const animationFrame = setInterval(animate, 1000/60);

    // Cleanup animation on unmount or when dependencies change
    return () => clearInterval(animationFrame);
  }, [speed, gap]); // Re-initialize when speed or gap changes

  return (
    <div className="led-scroller-container" ref={containerRef}>
      {/* Fixed LED matrix background */}
      <div className="led-matrix" />
      
      {/* Container for scrolling text copies */}
      <div ref={scrollerRef}>
        {/* Render each text copy at its calculated position */}
        {positions.map((position, index) => (
          <div 
            key={index}
            className="led-scroller-text"
            style={{ 
              transform: `translateX(${position}px)`,
              color: color
            }}
          >
            {text}
          </div>
        ))}
      </div>
    </div>
  );
};

// PropTypes for development error checking
LedScroller.propTypes = {
  text: PropTypes.string,
  speed: PropTypes.number,
  color: PropTypes.string,
  gap: PropTypes.number
};

export default LedScroller; 