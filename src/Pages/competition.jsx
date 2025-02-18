import React, { useState, useEffect } from 'react';
import '../Styles/competition.css';
import SplitFlapDisplay from '../Components/SplitFlapDisplay';
import LedScroller from '../Components/LedScroller';
import { Link } from 'react-router-dom';

const COLUMN_CONFIG = {
  TIME: { width: 5, key: 'time' },
  FLIGHT: { width: 9, key: 'flight' },
  REMARKS: { width: 11, key: 'remarks' }
};

const BoardHeader = () => (
  <div className="board-headers">
    {Object.keys(COLUMN_CONFIG).map(header => (
      <div key={header} className="header-item">{header}</div>
    ))}
  </div>
);

const splitText = (text, width, isRemarks = false) => {
  if (!isRemarks) {
    // For non-remarks columns, just return a single line
    return [text.padEnd(width), ''];
  }

  // For remarks, split into two lines as before
  const words = text.split(' ');
  let firstLine = '';
  let secondLine = '';

  for (const word of words) {
    if (!firstLine || (firstLine.length + 1 + word.length) <= width) {
      firstLine = firstLine ? `${firstLine} ${word}` : word;
    }
    else if (!secondLine || (secondLine.length + 1 + word.length) <= width) {
      secondLine = secondLine ? `${secondLine} ${word}` : word;
    }
    else {
      break;
    }
  }

  firstLine = firstLine.padEnd(width);
  secondLine = secondLine.padEnd(width);

  return [firstLine, secondLine];
};

const BoardRow = ({ data }) => {
  // Function to determine the link based on the remarks
  const getProductLink = (remarks) => {
    const words = remarks.toLowerCase().split(' ');
    let color = '';
    let baseUrl = '/';

    // Extract color and product type from remarks
    if (words.includes('pullover')) {
      baseUrl = '/como-pullover';
      color = words.includes('limoncello') ? 'Limoncello' : 'Campari';
    } else if (words.includes('hoodie')) {
      baseUrl = '/avery-hoodie';
      color = 'Kyoho';
    } else if (words.includes('tshirt')) {
      baseUrl = '/shion-tshirt';
      color = words.includes('cream') ? 'Cream' : 'Charcoal';
    } else if (words.includes('black') || words.includes('beige')) {
      baseUrl = '/lyon-pants';
      color = words.includes('black') ? 'Black' : 'Beige';
    }

    return `${baseUrl}?color=${color}`;
  };

  return (
    <Link 
      to={getProductLink(data.remarks)}
      className="board-row"
      style={{ textDecoration: 'none', cursor: 'pointer' }}
    >
      {Object.entries(COLUMN_CONFIG).map(([header, config]) => (
        <div key={header} className="row-item">
          <div className={`display-stack ${header === 'REMARKS' ? 'double-height' : 'single-height'}`}>
            {(() => {
              const [firstLine, secondLine] = splitText(data[config.key], config.width, header === 'REMARKS');
              return (
                <>
                  <SplitFlapDisplay 
                    word={[firstLine]} 
                    width={config.width}
                    type={header}
                  />
                  {header === 'REMARKS' && (
                    <SplitFlapDisplay 
                      word={[secondLine || ' '.repeat(config.width)]} 
                      width={config.width}
                      type={header}
                    />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      ))}
    </Link>
  );
};

const useResponsiveSpeed = () => {
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const calculateSpeed = () => {
      const width = window.innerWidth;
      if (width < 576) { // Mobile
        return 1;
      } else if (width < 768) { // Tablet
        return 1.5;
      } else if (width < 992) { // Small laptop
        return 2;
      } else if (width < 1200) { // Large laptop
        return 2.5;
      } else { // Extra large screens
        return 3;
      }
    };

    const handleResize = () => {
      setSpeed(calculateSpeed());
    };

    // Initial calculation
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return speed;
};

const DepartureBoard = () => {
  const [boardData, setBoardData] = useState({
    'row1': {
      time: "",
      flight: "",
      remarks: ""
    },
    'row2': {
      time: "",
      flight: "",
      remarks: ""
    },
    'row3': {
      time: "",
      flight: "",
      remarks: ""
    },
    'row4': {
      time: "",
      flight: "",
      remarks: ""
    },
    'row5': {
      time: "",
      flight: "",
      remarks: ""
    },
    'row6': {
      time: "",
      flight: "",
      remarks: ""
    }
  });

  // Update the predefined updates to match new structure
  const boardUpdates = [
    {
      rowIndex: 1,
      data: {
        time: "21:00",
        flight: "THANK YOU  ",
        remarks: "FOR ENTERING"
      },
      delay: 1000
    },
    {
      rowIndex: 2,
      data: {
        time: "21:00",
        flight: "OUR SHION  ",
        remarks: "TSHIRT GIVEAWAY"
      },
      delay: 2500
    },
    {
      rowIndex: 3,
      data: {
        time: "21:00",
        flight: "CONGRATS",
        remarks: ""
      },
      delay: 4000
    },
    {
      rowIndex: 3,
      data: {
        time: "21:00",
        flight: "CONGRATS",
        remarks: "********* *********"
      },
      delay: 5500
    },
    {
      rowIndex: 3,
      data: {
        time: "21:00",
        flight: "CONGRATS",
        remarks: "@WILLLLOH @JONNG23"
      },
      delay: 8000
    },
    {
      rowIndex: 4,
      data: {
        time: "21:00",
        flight: "DM US",
        remarks: "YOUR ADDRESS"
      },
      delay: 9500
    },
    {
      rowIndex: 5,
      data: {
        time: "21:00",
        flight: "SEE",
        remarks: "YOU     GUYS"
      },
      delay: 11000
    },
    {
      rowIndex: 6,
      data: {
        time: "21:00",
        flight: "AT OUR",
        remarks: "OFFICIAL LAUNCH"
      },
      delay: 12500
    }
  ];

  // Function to apply a board update
  const applyBoardUpdate = (update) => {
    setBoardData(prevData => ({
      ...prevData,
      [`row${update.rowIndex}`]: update.data
    }));
  };

  // Set up the predefined updates
  useEffect(() => {
    boardUpdates.forEach(update => {
      setTimeout(() => {
        console.log(`Applying update to row ${update.rowIndex}:`, update.data);
        applyBoardUpdate(update);
      }, update.delay);
    });
  }, []); // Run once on component mount

  const scrollSpeed = useResponsiveSpeed();

  return (
    <div className="full-width-container">
      <div className="departure-board">
        <div className="board-content-wrapper">
          <div className="board-content">
            <h1 className="board-title">出发 &nbsp; Departures</h1>
            <BoardHeader />
            <BoardRow data={boardData['row1']} />
            <BoardRow data={boardData['row2']} />
            <BoardRow data={boardData['row3']} />
            <BoardRow data={boardData['row4']} />
            <BoardRow data={boardData['row5']} />
            <BoardRow data={boardData['row6']} />
            <LedScroller 
              text="WELCOME TO INTERLIEUTIONAL AIRPORT — IN LIEU LOVES YOU — TIME IN LIEU COMING SOON"
              speed={scrollSpeed}
              color="#ff0000"
            />
            <h1 className="board-title-bottom">출발 &nbsp; Départs</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartureBoard; 



