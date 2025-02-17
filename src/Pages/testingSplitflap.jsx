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

const PRODUCT_TYPES = {
  'COMO': ['PULLOVER'],
  'KYOHO': ['HOODIE'],
  'SHION': ['TSHIRT'],
  'LYON': ['PANTS']
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
    },
    'row4': {
      time: "07:30",
      from: "LYON",
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

  // New state for order management
  const [displayedOrders, setDisplayedOrders] = useState([]);
  const [lastFetchedOrders, setLastFetchedOrders] = useState([]);
  const [occurrenceDict, setOccurrenceDict] = useState({
    'COMO': 0,
    'LYON': 0,
    'SHION': 0,
    'KYOHO': 0
  });

  // Product Coverage Check Function
  const ensureProductCoverage = (allOrders, currentOrders) => {
    console.log('Checking product coverage...');
    
    // Get current product occurrences
    const occurrences = {
      'COMO': 0,
      'LYON': 0,
      'SHION': 0,
      'KYOHO': 0
    };
    
    currentOrders.forEach(order => {
      const productType = order.productName;
      if (productType) {
        occurrences[productType]++;
      }
    });
    
    console.log('Current product occurrences:', occurrences);

    // Find missing products
    const missingProducts = Object.entries(occurrences)
      .filter(([_, count]) => count === 0)
      .map(([type]) => type);
    
    console.log('Missing products:', missingProducts);

    if (missingProducts.length === 0) {
      return currentOrders;
    }

    // Find orders with missing products
    const updatedOrders = [...currentOrders];
    let remainingOrders = allOrders.slice(6); // Orders not in initial display

    missingProducts.forEach(missingType => {
      // Find first order with missing product type
      const replacementOrderIndex = remainingOrders.findIndex(
        order => order.productName === missingType
      );

      if (replacementOrderIndex !== -1) {
        // Find order to replace (bottom-up)
        for (let i = updatedOrders.length - 1; i >= 0; i--) {
          const currentType = updatedOrders[i].productName;
          if (occurrences[currentType] > 1) {
            console.log(`Replacing duplicate ${currentType} with missing ${missingType}`);
            // Replace order
            const replacementOrder = remainingOrders[replacementOrderIndex];
            updatedOrders[i] = replacementOrder;
            occurrences[currentType]--;
            occurrences[missingType]++;
            remainingOrders = remainingOrders.filter((_, index) => index !== replacementOrderIndex);
            break;
          }
        }
      }
    });

    console.log('Orders after coverage check:', updatedOrders);
    return updatedOrders;
  };

  // Order Replacement Function
  const replaceOrder = (oldOrder, newOrder) => {
    console.log('Attempting to replace order:', { old: oldOrder, new: newOrder });
    
    // Get current occurrences
    const currentOccurrences = { ...occurrenceDict };
    
    // Check if replacement would break product coverage
    if (currentOccurrences[oldOrder.productName] <= 1) {
      console.log('Cannot replace - would break product coverage');
      return false;
    }

    // Update occurrences
    currentOccurrences[oldOrder.productName]--;
    currentOccurrences[newOrder.productName]++;

    return true;
  };

  // Helper function to get product type from product name
  const getDisplayType = (productName) => {
    const brand = productName.split(' ')[0]; // Get the brand name (COMO, KYOHO, etc)
    return PRODUCT_TYPES[brand]?.[0] || productName; // Return the type or fallback to full name
  };

  // Initialize board with first 6 orders
  const initializeBoard = async () => {
    try {
      console.log('Initializing board...');
      
      // 1. Fetch first 50 orders
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api/orders'
        : '/api/orders';
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const orders = await response.json();
      
      console.log('Fetched orders:', orders);

      // 2. Take first 6 for initial display
      let initialOrders = orders.slice(0, 6);
      console.log('Initial 6 orders:', initialOrders);

      // 3. Ensure product coverage
      initialOrders = ensureProductCoverage(orders, initialOrders);
      console.log('Orders after ensuring coverage:', initialOrders);

      // 4. Update occurrenceDict for final orders
      const initialOccurrences = {
        'COMO': 0,
        'LYON': 0,
        'SHION': 0,
        'KYOHO': 0
      };
      
      initialOrders.forEach(order => {
        const productType = order.productName;
        if (productType) {
          initialOccurrences[productType]++;
        }
      });
      
      console.log('Final product occurrences:', initialOccurrences);

      // 5. Format orders for display
      const formattedOrders = initialOrders.map(order => {
        const displayType = getDisplayType(order.productName);
        const orderDate = new Date(order.creationDate);

        return {
          time: orderDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          from: order.productName.substring(0, 5),
          flight: order.orderNumber || `OR${Math.random().toString(36).substr(2, 6)}`,
          remarks: `${order.color} ${displayType}`.toUpperCase(),
          itemId: order.itemId,
          productName: order.productName
        };
      });

      console.log('Final formatted orders:', formattedOrders);
      
      // 6. Update state
      setDisplayedOrders(formattedOrders);
      setLastFetchedOrders(orders.slice(0, 10));
      setOccurrenceDict(initialOccurrences);
      
      // For now, also update boardData to maintain existing display
      const updatedBoardData = { ...boardData };
      formattedOrders.forEach((order, index) => {
        const rowKey = `row${index + 1}`;
        updatedBoardData[rowKey] = {
          time: order.time,
          from: order.from,
          flight: order.flight,
          remarks: order.remarks
        };
      });
      setBoardData(updatedBoardData);

    } catch (error) {
      console.error('Error initializing board:', error);
    }
  };

  // Initialize board when component mounts
  useEffect(() => {
    initializeBoard();
  }, []);

  // Check for new orders function
  const checkForNewOrders = async () => {
    try {
      console.log('Checking for new orders...');
      
      // 1. Fetch latest orders
      const apiUrl = process.env.NODE_ENV === 'development' 
        ? 'http://localhost:5000/api/orders'
        : '/api/orders';
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Failed to fetch orders');
      const latestOrdersAll = await response.json();
      const latestOrders = latestOrdersAll.slice(0, 10);
      
      console.log('Latest orders:', latestOrders);

      // 2. Compare with lastFetchedOrders using itemId
      const lastFetchedIds = lastFetchedOrders.map(order => order.itemId);
      const newOrders = latestOrders.filter(order => !lastFetchedIds.includes(order.itemId));
      
      console.log('Truly new orders (not in last fetch):', newOrders.length);
      
      if (newOrders.length === 0) return [];

      // Update lastFetchedOrders with the new fetch
      setLastFetchedOrders(latestOrders);

      // 3. Filter new orders that can be displayed
      const displayableOrders = newOrders.filter(newOrder => {
        const brand = newOrder.productName.split(' ')[0];
        // Check if we can replace an order of the same type
        return occurrenceDict[brand] > 1;
      });

      console.log('Displayable new orders:', displayableOrders);
      return displayableOrders;
    } catch (error) {
      console.error('Error checking for new orders:', error);
      return [];
    }
  };

  // Set up polling for new orders
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      const newOrders = await checkForNewOrders();
      
      if (newOrders.length > 0) {
        // Format the new order for display
        const newOrder = newOrders[0]; // Take the first new order
        const displayType = getDisplayType(newOrder.productName);
        const orderDate = new Date(newOrder.creationDate);
        
        const formattedNewOrder = {
          time: orderDate.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: false 
          }),
          from: newOrder.productName.substring(0, 5),
          flight: newOrder.orderNumber || `OR${Math.random().toString(36).substr(2, 6)}`,
          remarks: `${newOrder.color} ${displayType}`.toUpperCase(),
          itemId: newOrder.itemId,
          productName: newOrder.productName
        };

        // Find an order to replace (bottom-up)
        const brand = newOrder.productName.split(' ')[0];
        const updatedOrders = [...displayedOrders];
        let replaced = false;

        for (let i = updatedOrders.length - 1; i >= 0; i--) {
          const currentOrder = updatedOrders[i];
          const currentBrand = currentOrder.productName.split(' ')[0];
          
          if (currentBrand === brand && occurrenceDict[brand] > 1) {
            console.log(`Replacing order at position ${i}`);
            updatedOrders[i] = formattedNewOrder;
            replaced = true;
            break;
          }
        }

        if (replaced) {
          // Update states
          setDisplayedOrders(updatedOrders);
          
          // Update boardData
          const updatedBoardData = { ...boardData };
          updatedOrders.forEach((order, index) => {
            const rowKey = `row${index + 1}`;
            updatedBoardData[rowKey] = {
              time: order.time,
              from: order.from,
              flight: order.flight,
              remarks: order.remarks
            };
          });
          setBoardData(updatedBoardData);
        }
      }
    }, 5000); // Poll every 5 seconds

    // Cleanup
    return () => clearInterval(pollInterval);
  }, [displayedOrders, occurrenceDict]); // Dependencies for the polling effect

  const scrollSpeed = useResponsiveSpeed();

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