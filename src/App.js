import React, { useState } from 'react';
import './styles.css';

const App = () => {
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const [currentPalette, setCurrentPalette] = useState(() => 
    Array.from({ length: 5 }, () => getRandomColor())
  );
  const [savedPalettes, setSavedPalettes] = useState([]);
  const [lockedColors, setLockedColors] = useState(Array(5).fill(false));
  const [paletteName, setPaletteName] = useState("");

  const generateNewPalette = () => {
    setCurrentPalette(prevPalette => 
      prevPalette.map((color, index) => 
        lockedColors[index] ? color : getRandomColor()
      )
    );
  };

  const savePalette = () => {
    if (!paletteName.trim()) {
      alert("Please enter a palette name");
      return;
    }
    setSavedPalettes(prev => [...prev, {
      name: paletteName,
      colors: [...currentPalette]
    }]);
    setPaletteName("");
  };

  const deletePalette = (indexToDelete) => {
    setSavedPalettes(prev => 
      prev.filter((_, index) => index !== indexToDelete)
    );
  };

  const toggleLock = (index) => {
    setLockedColors(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const copyToClipboard = (color) => {
    navigator.clipboard.writeText(color)
      .then(() => alert(`Copied ${color} to clipboard!`))
      .catch(() => alert('Failed to copy color code'));
  };

  return (
    <div className="container">
      <h1 className="title">Color Palette Generator</h1>

      <div className="palette-container">
        <div className="colors-container">
          {currentPalette.map((color, index) => (
            <div
              key={index}
              className={`color-box ${lockedColors[index] ? 'locked' : ''}`}
              style={{ backgroundColor: color }}
              onClick={() => toggleLock(index)}
            >
              <div 
                className="color-code"
                onClick={(e) => {
                  e.stopPropagation();
                  copyToClipboard(color);
                }}
              >
                {color}
              </div>
            </div>
          ))}
        </div>

        <div className="controls">
          <button
            className="button button-generate"
            onClick={generateNewPalette}
          >
            Generate New Palette
          </button>
          <div className='save-controls'>
            <input
              type="text"
              className="input"
              value={paletteName}
              onChange={(e) => setPaletteName(e.target.value)}
              placeholder="Enter palette name"
            />
            <button
              className="button button-save"
              onClick={savePalette}
            >
              Save Palette
            </button>
          </div>
        </div>
      </div>

      <div className="saved-palettes">
        <p className='saved-palettes-title'>Saved Palettes</p>
        {savedPalettes.map((palette, paletteIndex) => (
          <div
            key={paletteIndex}
            className="saved-palette"
          >
            <div className='saved-palette-header'>
              <p className="palette-name">{palette.name}</p>
              <button
                className="button button-delete"
                onClick={() => deletePalette(paletteIndex)}
              >
                Delete
              </button>
            </div>
            <div className="saved-colors">
              {palette.colors.map((color, colorIndex) => (
                <div
                  key={colorIndex}
                  className="saved-color"
                  style={{ backgroundColor: color }}
                  onClick={() => copyToClipboard(color)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;