import React, { useState, useEffect } from 'react';
import '../Styles/splitflap.css';
import SplitFlapDisplay from '../Components/SplitFlapDisplay';
import LedScroller from '../Components/LedScroller';
import { Link } from 'react-router-dom';

const COLUMN_CONFIG = {
  TIME: { width: 5, key: 'time' },
  FROM: { width: 5, key: 'from' },
  FLIGHT: { width: 6, key: 'flight' },
  REMARKS: { width: 10, key: 'remarks' }
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
      time: "07:30",
      from: "COMO",
      flight: "FR123",
      remarks: "LIMONCELLO PULLOVER"
    },
    'row2': {
      time: "08:45",
      from: "SHION",
      flight: "KR5678",
      remarks: "CREAM TSHIRT"
    },
    'row3': {
      time: "09:30",
      from: "AVERY",
      flight: "EM9012",
      remarks: "KYOHO HOODIE"
    }
  });

  const scrollSpeed = useResponsiveSpeed();

  // Function to fetch Snipcart orders
  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...');
      const response = await fetch('https://app.snipcart.com/api/orders', {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_SNIPCART_API_KEY}`
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Orders fetched successfully:', data);
      
      // Log specific details about each order
      data.items?.forEach((order, index) => {
        console.log(`Order ${index + 1}:`, {
          orderNumber: order.invoiceNumber,
          date: order.creationDate,
          items: order.items?.map(item => ({
            name: item.name,
            customFields: item.customFields
          }))
        });
      });

    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Add a button to test the API call
  useEffect(() => {
    // Fetch orders when component mounts
    fetchOrders();
  }, []);

  return (
    <div className="full-width-container">
      <div className="departure-board">
        <div className="board-content-wrapper">
          <div className="board-content">
            <h1 className="board-title">Départs &nbsp; Departures</h1>
            <button 
              onClick={fetchOrders}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                padding: '5px 10px',
                background: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Fetch Orders
            </button>
            <BoardHeader />
            <BoardRow data={boardData['row1']} />
            <BoardRow data={boardData['row2']} />
            <BoardRow data={boardData['row3']} />
            <LedScroller 
              text="WELCOME TO IN LIEU AIRPORT — LIEU LOVES YOU — NEW ARRIVALS AVAILABLE"
              speed={scrollSpeed}
              color="#ff0000"
            />
            <h1 className="board-title-bottom">Avgångar &nbsp; 出発</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartureBoard; 