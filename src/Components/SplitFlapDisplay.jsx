import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const SplitFlapCharacters = [
  ' ',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', ':'
];

const Flap = ({ index }) => (
  <div key={index} className="flap flex-center-all">
    <div className="top">
      <div className="top-flap-queued">
        <span>_</span>
      </div>
      <div className='top-flap-visible'>
        <span>a</span>
      </div>
    </div>
    <div className="bottom">
      <div className="bottom-flap-queued">
        <span>_</span>
      </div>
      <div className='bottom-flap-visible'>
        <span>a</span>
      </div>
    </div>
  </div>
);

const NoiseFilter = () => (
  <svg viewBox='0 0 100 100' preserveAspectRatio="none" xmlns='http://www.w3.org/2000/svg'>
    <filter id='noiseFilter'>
      <feTurbulence 
        type='fractalNoise' 
        baseFrequency='0.8' 
        numOctaves='3' 
        stitchTiles='stitch'/>
      <feColorMatrix type="saturate" values="0"/>
    </filter>
    <rect width='100%' height='100%' filter='url(#noiseFilter)'/>
  </svg>
);

const SplitFlapDisplay = ({ word, width = 7 }) => {
  const flapRef = useRef(null);
  const animationRef = useRef({});
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const timeoutRef = useRef(null);
  const completedFlapsRef = useRef(0);

  const WORDS = Array.isArray(word) ? word : [word];

  const cleanupAnimations = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    Object.values(animationRef.current).forEach(({ topListener, bottomListener, element }) => {
      if (element) {
        const top = element.querySelector('.top-flap-visible');
        const bottom = element.querySelector('.bottom-flap-queued');
        if (top && topListener) top.removeEventListener('animationend', topListener);
        if (bottom && bottomListener) bottom.removeEventListener('animationend', bottomListener);
      }
    });
    animationRef.current = {};
  };

  const moveToNextWord = () => {
    const nextIndex = (currentWordIndex + 1) % WORDS.length;

    console.log('next word')
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setCurrentWordIndex(nextIndex);
      completedFlapsRef.current = 0;
    }, 5000);
  };

  const setup = (currentPos, symbolOrder, target) => {
    if (!flapRef.current) return;
    
    cleanupAnimations();
    completedFlapsRef.current = 0;

    [...flapRef.current.children].forEach((item, index) => {
      if (item.tagName.toLowerCase() === 'svg') return;

      // Skip animation if current character is the same as target
      if (currentPos[index] === target[index]) {
        completedFlapsRef.current += 1;
        if (completedFlapsRef.current === width) {
          moveToNextWord();
        }
        return;
      }

      let symbolCursor = symbolOrder.indexOf(currentPos[index]);
      if (symbolCursor === -1) symbolCursor = 0;

      const top_flap_queued = item.querySelector(".top-flap-queued");
      const top_flap_visible = item.querySelector(".top-flap-visible");
      const bottom_flap_queued = item.querySelector(".bottom-flap-queued");
      const bottom_flap_visible = item.querySelector(".bottom-flap-visible");

      if (!top_flap_queued || !top_flap_visible || !bottom_flap_queued || !bottom_flap_visible) return;

      const checkCompletion = () => {
        completedFlapsRef.current += 1;
        if (completedFlapsRef.current === width) {
          moveToNextWord();
        }
      };

      const updateTopFlaps = () => {
        symbolCursor = (symbolCursor + 1) % symbolOrder.length;
        top_flap_visible.innerHTML = `<span>${symbolOrder[symbolCursor]}</span>`;
        top_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
      };

      const updateBottomFlaps = () => {
        bottom_flap_visible.innerHTML = `<span>${symbolOrder[symbolCursor]}</span>`;
        bottom_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;

        if (symbolOrder[symbolCursor] === target[index]) {
          top_flap_visible.removeEventListener("animationend", updateTopFlaps);
          bottom_flap_queued.removeEventListener("animationend", updateBottomFlaps);
          checkCompletion();
          return;
        }

        requestAnimationFrame(() => {
          if (top_flap_visible && bottom_flap_queued) {
            top_flap_visible.classList.remove("top-flap-animation");
            bottom_flap_queued.classList.remove("bottom-flap-animation");
            void top_flap_visible.offsetWidth;
            void bottom_flap_queued.offsetWidth;
            top_flap_visible.classList.add("top-flap-animation");
            bottom_flap_queued.classList.add("bottom-flap-animation");
          }
        });
      };

      animationRef.current[index] = {
        topListener: updateTopFlaps,
        bottomListener: updateBottomFlaps,
        element: item
      };

      top_flap_visible.innerHTML = `<span>${symbolOrder[symbolCursor]}</span>`;
      top_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
      bottom_flap_queued.innerHTML = `<span>${symbolOrder[(symbolCursor + 1) % symbolOrder.length]}</span>`;
      bottom_flap_visible.innerHTML = `<span>${currentPos[index]}</span>`;

      top_flap_visible.addEventListener("animationend", updateTopFlaps);
      bottom_flap_queued.addEventListener("animationend", updateBottomFlaps);

      setTimeout(() => {
        if (top_flap_visible && bottom_flap_queued) {
          top_flap_visible.classList.remove("top-flap-animation");
          bottom_flap_queued.classList.remove("bottom-flap-animation");
          void top_flap_visible.offsetWidth;
          void bottom_flap_queued.offsetWidth;
          top_flap_visible.classList.add("top-flap-animation");
          bottom_flap_queued.classList.add("bottom-flap-animation");
        }
      }, index * 30);

      if (symbolOrder[symbolCursor] === target[index]) {
        checkCompletion();
      }
    });
  };

  useEffect(() => {
    if (!isInitialized && flapRef.current) {
      const initialChars = Array(width).fill('a');
      const targetWord = WORDS[0].padEnd(width, ' ').split('');
      setup(initialChars, SplitFlapCharacters, targetWord);
      setIsInitialized(true);
    }
  }, [isInitialized, width, WORDS]);

  useEffect(() => {
    if (!isInitialized || !flapRef.current) return;

    const currentChars = [...flapRef.current.children]
      .filter(item => item.tagName.toLowerCase() !== 'svg')
      .map(item => {
        const visibleChar = item.querySelector('.bottom-flap-visible span')?.textContent || 'a';
        return visibleChar;
      });

    const targetWord = WORDS[currentWordIndex].padEnd(width, ' ').split('');
    setup(currentChars, SplitFlapCharacters, targetWord);

    return () => {
      cleanupAnimations();
    };
  }, [currentWordIndex, isInitialized, width, WORDS]);

  return (
    <div className="split-flap-display" ref={flapRef}>
      {[...Array(width)].map((_, index) => (
        <Flap key={index} index={index} />
      ))}
      {/* <NoiseFilter /> */}
    </div>
  );
};

SplitFlapDisplay.propTypes = {
  word: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]).isRequired,
  width: PropTypes.number
};

export default SplitFlapDisplay;
