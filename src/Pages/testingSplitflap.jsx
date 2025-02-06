import React, { useState, useEffect } from 'react';
import '../Styles/splitflap.css';
import SplitFlapDisplay from '../Components/SplitFlapDisplay';
import LedScroller from '../Components/LedScroller';

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

const BoardRow = ({ data }) => (
  <div className="board-row">
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
  </div>
);

const DepartureBoard = () => {
  const [boardData, setBoardData] = useState({
    'row1': {
      time: "07:00",
      from: "LYON",
      flight: "AU1209",
      remarks: "BLACK"
    },
    'row2': {
      time: "08:30",
      from: "AVERY",
      flight: "FR2210",
      remarks: "KYOHO HOODIE"
    },
    'row3': {
      time: "09:15",
      from: "COMO",
      flight: "JP4402",
      remarks: "CAMPARI PULLOVER"
    }
  });

  // Function to update a specific row
  const updateRow = (rowKey, newData) => {
    setBoardData(prev => ({
      ...prev,
      [rowKey]: newData
    }));
  };

  // Test function to simulate live updates
  useEffect(() => {
    const updates = [
      {
        rowKey: 'row1',
        data: {
          time: "07:30",
          from: "COMO",
          flight: "FR123",
          remarks: "LIMONCELLO PULLOVER"
        }
      },
      {
        rowKey: 'row2',
        data: {
          time: "08:45",
          from: "SHION",
          flight: "KR5678",
          remarks: "CREAM TSHIRT"
        }
      },
      {
        rowKey: 'row3',
        data: {
          time: "09:30",
          from: "AVERY",
          flight: "EM9012",
          remarks: "KYOHO HOODIE"
        }
      }
    ];

    let updateIndex = 0;
    const interval = setInterval(() => {
      if (updateIndex < updates.length) {
        const { rowKey, data } = updates[updateIndex];
        updateRow(rowKey, data);
        updateIndex++;
      } else {
        clearInterval(interval);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="departure-board">
      <h1 className="board-title">Départs Departures</h1>
      <div className="board-content">
        <BoardHeader />
        <BoardRow data={boardData['row1']} />
        <BoardRow data={boardData['row2']} />
        <BoardRow data={boardData['row3']} />
        <BoardRow data={boardData['row1']} />
        <BoardRow data={boardData['row2']} />
        <BoardRow data={boardData['row3']} />
        <LedScroller 
          text="WELCOME TO IN LIEU — SHOP NOW OPEN — NEW ARRIVALS AVAILABLE"
          speed={1}
          color="#ff0000"
        />
      </div>
    </div>
  );
};

export default DepartureBoard; 