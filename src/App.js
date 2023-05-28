import React, { useEffect, useState } from "react";
import PlaybackModal from "./PlaybackModal.js";
import "./style.css";

function App() {
  const [grid, setGrid] = useState([...Array(10)].map(() => Array(10).fill(0)));
  const [rowClues, setRowClues] = useState(Array(10).fill(""));
  const [colClues, setColClues] = useState(Array(10).fill(""));
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [gridHistory, setGridHistory] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaybackModal, setShowPlaybackModal] = useState(false);

  const handleClick = (event) => {
    if (isPlaying) return; 

    const cell = event.target;
    const rowIndex = cell.parentNode.rowIndex;
    const colIndex = cell.cellIndex;

    const newGrid = grid.map((row) => [...row]);

    newGrid[rowIndex][colIndex] = newGrid[rowIndex][colIndex] === 0 ? 1 : 0;

    setGrid(newGrid);

    if (!cell.classList.contains("clicked")) {
      cell.style.backgroundColor = "black";
      cell.style.borderColor = "white";
      cell.classList.add("clicked");
    } else {
      cell.style.backgroundColor = "white";
      cell.style.borderColor = "black";
      cell.classList.remove("clicked");
    }

    setGridHistory((prevHistory) => [...prevHistory, newGrid]);
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    const cell = event.target;
    const rowIndex = cell.parentNode.rowIndex;
    const colIndex = cell.cellIndex;
    const newGrid = grid.map((row) => [...row]);
    newGrid[rowIndex][colIndex] = newGrid[rowIndex][colIndex] === 0 ? 2 : 0;

    if (cell.innerText === "X") {
      cell.innerText = "";
    } else {
      cell.innerText = "X";
    }
    setGrid(newGrid);
  };

  const handleNewGame = () => {
    setGrid([...Array(10)].map(() => Array(10).fill(0)));
    setRowClues(Array(10).fill(""));
    setColClues(Array(10).fill(""));
    setGridHistory([]);
    setYear("");
    setMonth("");
    setDay("");
    window.location.reload();
  };
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleLoadPuzzle = async () => {
  };
  
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  useEffect(() => {
    const cells = document.querySelectorAll(".cell");

    cells.forEach((cell) => {
      cell.addEventListener("click", handleClick);
      cell.addEventListener("contextmenu", handleRightClick);
    });

    return () => {
      cells.forEach((cell) => {
        cell.removeEventListener("click", handleClick);
        cell.removeEventListener("contextmenu", handleRightClick);
      });
    };
  }, );

  const handlePlayback = () => {
    if (gridHistory.length === 0) return;

    setIsPlaying(true);
    setShowPlaybackModal(true);
  };

  const handleCloseModal = () => {
    setIsPlaying(false);
    setShowPlaybackModal(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const rowCluesText = rowClues.map((clue) => `[${clue}]`).join(", ");
    const colCluesText = colClues.map((clue) => `[${clue}]`).join(", ");
    const gridArrayText = gridHistory.map((grid) =>
    `[\n${grid.map((row) => `  [${row.map((cell) => (cell === "X" ? 2 : cell))
    .join(", ")}]`).join(",\n")}\n]`)
    .join(",\n\n");

    const text = `row_clues = [${rowCluesText}]
    column_clues = [${colCluesText}]
    grid = [

    ${gridArrayText}
    ]`;

    const file = new Blob([text], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = "data.json";
    a.click();
  };

  return (
    <div className="App">
      <div className="header">
        <h1>Nonogram Puzzle</h1>
        <div className="form">
          <label>
            Year:
            <input
              type="text"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            />
          </label>
          <label>
            Month:
            <input
              type="text"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
            />
          </label>
          <label>
            Day:
            <input
              type="text"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </label>
          <button onClick={handleLoadPuzzle}>Load Puzzle</button>
        </div>
        <button onClick={handleNewGame}>New Game</button>
        <div className="controls">
      <button onClick={handlePlayback} disabled={isPlaying}>
        {isPlaying ? "Playing..." : "Playback"}
      </button>
    </div>
      </div>
      <div className="clues">
        <div className="row-clues">
          <h2>↓ Row Clues ↓</h2>
          {rowClues.map((clue, index) => (
            <input
              key={`row-clue-${index}`}
              type="text"
              placeholder={`Enter row clue ${index + 1}`}
              value={clue}
              onChange={(e) => {
                const newRowClues = [...rowClues];
                newRowClues[index] = e.target.value;
                setRowClues(newRowClues);
              }}
            />
          ))}
        </div>
        <div className="col-clues">
          <h2>→ Column Clues →</h2>
          {colClues.map((clue, index) => (
            <input
              key={`col-clue-${index}`}
              type="text"
              placeholder={`Enter column clue ${index + 1}`}
              value={clue}
              onChange={(e) => {
                const newColClues = [...colClues];
                newColClues[index] = e.target.value;
                setColClues(newColClues);
              }}
            />
          ))}
        </div>
      </div>
      <h3>Puzzle Grid</h3>
      <table>

        <thead>
            <th></th>
            {colClues.map((_, index) => (
              <th key={`col-clue-${index}`} className="clue-col">
                {colClues[index]}
              </th>
            ))}
        </thead>
        
        <tbody>
          {grid.map((row, rowIndex) => (
            <tr key={rowIndex}>

              <tr>
              <th className="clue-row">{rowClues[rowIndex]}</th>
              </tr>

              {row.map((cell, colIndex) => (
                <td
                  className={`cell ${cell === 1 ? "clicked" : ""}`}
                  id={`${rowIndex + 1}${colIndex + 1}`}
                  key={`${rowIndex + 1}${colIndex + 1}`}
                ></td>
              ))}
            </tr>
          ))}
          <tr>
            <td colSpan={colClues.length + 1}>
              <button onClick={handleSubmit}>Submit</button>
            </td>
          </tr>
        </tbody>
      </table>
      {showPlaybackModal && (
        <PlaybackModal gridHistory={gridHistory} onClose={handleCloseModal} />
      )}
 </div>
  );
}

export default App;
