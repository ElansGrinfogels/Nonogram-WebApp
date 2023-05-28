import React, { useEffect, useState } from "react";
import "./PlaybackModal.css";

const PlaybackModal = ({ gridHistory, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (currentIndex < gridHistory.length - 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, gridHistory]);

  const grid = gridHistory[currentIndex];

  return (
    <div className="modal-container">
      <div className="modal-content">
        <h2>Playback</h2>
        <table>
          <tbody>
            {grid.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td
                    className={`cell ${cell === 1 ? "clicked" : ""}`}
                    key={colIndex}
                    style={{
                      backgroundColor: cell === 1 ? "black" : "white",
                      borderColor: cell === 1 ? "white" : "black",
                    }}
                  ></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default PlaybackModal;