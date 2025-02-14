import React, { useState, useEffect, useRef } from 'react';
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

const POLLING_INTERVAL = 5000; // Check for new orders every 5 seconds

const DepartureBoard = () => {
  // State for managing board data and product coverage
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
    },
    'row4': {
      time: "07:30",
      from: "COMO",
      flight: "FR123",
      remarks: "LIMONCELLO PULLOVER"
    },
    'row5': {
      time: "08:45",
      from: "SHION",
      flight: "KR5678",
      remarks: "CREAM TSHIRT"
    },
    'row6': {
      time: "09:30",
      from: "AVERY",
      flight: "EM9012",
      remarks: "KYOHO HOODIE"
    }
  });
  
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [productCoverage, setProductCoverage] = useState(new Map());
  const pollingInterval = useRef(null);

  const scrollSpeed = useResponsiveSpeed();

  // Function to update product coverage count
  const updateProductCoverage = (orders) => {
    const coverage = new Map();
    orders.forEach(order => {
      coverage.set(
        order.productName,
        (coverage.get(order.productName) || 0) + 1
      );
    });
    setProductCoverage(coverage);
  };

  // Function to format order data for display
  const formatOrderForDisplay = (order) => ({
    time: new Date().toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    }),
    from: order.productName,
    flight: `OR${order.orderId.slice(-4)}`,
    remarks: `${order.color} ${order.productName}`.toUpperCase(),
    orderId: order.orderId,
    productName: order.productName,
    timestamp: order.timestamp
  });

  // Function to fetch and process new orders
  const fetchOrders = async () => {
    try {
      console.log('Fetching orders from backend...');
      const response = await fetch('/api/orders');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const orders = await response.json();
      console.log('Orders fetched successfully:', orders);

      // If this is the first fetch, initialize the board
      if (displayedOrders.length === 0) {
        const initialOrders = orders.map(formatOrderForDisplay);
        setDisplayedOrders(initialOrders);
        updateProductCoverage(orders);
        
        // Update board data
        const updatedBoardData = {};
        initialOrders.forEach((order, index) => {
          updatedBoardData[`row${index + 1}`] = order;
        });
        setBoardData(updatedBoardData);
        return;
      }

      // Find new orders
      const newOrders = orders.filter(order => 
        !displayedOrders.find(displayed => displayed.orderId === order.orderId)
      );

      if (newOrders.length === 0) return;

      // Sort displayed orders by timestamp (oldest first)
      const sortedDisplayed = [...displayedOrders].sort((a, b) => a.timestamp - b.timestamp);

      // Process each new order
      newOrders.forEach(newOrder => {
        const formattedNewOrder = formatOrderForDisplay(newOrder);
        
        // Find the oldest order that can be replaced
        const replaceableIndex = sortedDisplayed.findIndex(oldOrder => {
          const productCount = productCoverage.get(oldOrder.productName);
          return productCount > 1;
        });

        if (replaceableIndex === -1) return; // Can't replace any orders safely

        const oldOrder = sortedDisplayed[replaceableIndex];
        
        // Update product coverage
        setProductCoverage(prev => {
          const updated = new Map(prev);
          updated.set(oldOrder.productName, prev.get(oldOrder.productName) - 1);
          updated.set(newOrder.productName, (prev.get(newOrder.productName) || 0) + 1);
          return updated;
        });

        // Update displayed orders
        setDisplayedOrders(prev => {
          const updated = [...prev];
          const index = updated.findIndex(o => o.orderId === oldOrder.orderId);
          updated[index] = formattedNewOrder;
          return updated;
        });

        // Update board data
        setBoardData(prev => {
          const rowNumber = Object.keys(prev).find(key => 
            prev[key].orderId === oldOrder.orderId
          );
          return {
            ...prev,
            [rowNumber]: formattedNewOrder
          };
        });

        // Remove the replaced order from sorted array
        sortedDisplayed.splice(replaceableIndex, 1);
      });
      
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  // Set up polling interval
  useEffect(() => {
    // Initial fetch
    fetchOrders();

    // Set up polling interval
    pollingInterval.current = setInterval(fetchOrders, POLLING_INTERVAL);

    // Cleanup
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  return (
    <div className="full-width-container">
      <div className="departure-board">
        <div className="board-content-wrapper">
          <div className="board-content">
            <h1 className="board-title">Départs &nbsp; Departures</h1>
            <BoardHeader />
            <BoardRow data={boardData['row1']} />
            <BoardRow data={boardData['row2']} />
            <BoardRow data={boardData['row3']} />
            <BoardRow data={boardData['row4']} />
            <BoardRow data={boardData['row5']} />
            <BoardRow data={boardData['row6']} />
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