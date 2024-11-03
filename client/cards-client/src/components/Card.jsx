import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Card.scss';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CircleIcon from '@mui/icons-material/Circle';

const Card = ({ id, color, text, onDelete, colorOptions }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [newText, setNewText] = useState(text);
    const [newColor, setNewColor] = useState(color);
    const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);

    const handleTextClick = () => {
        setIsEditing(true);
    };

    const handleTextChange = (event) => {
        setNewText(event.target.value);
    };

    const handleTextSubmit = async () => {
        setIsEditing(false);
        if (newText !== text) {
            try {
                const updatedCard = { id, text: newText, color: newColor }; 
                await axios.put(`http://localhost:3000/cards/${id}`, updatedCard);
            } catch (error) {
                console.error('Error updating text:', error);
            }
        }
    };

    const toggleColorPalette = () => {
        setIsColorPaletteOpen(prev => !prev);
    };

    const handleColorChange = async (selectedColor) => {
        setNewColor(selectedColor);
        const updatedCard = { id, text: newText, color: selectedColor };
        try {
            await axios.put(`http://localhost:3000/cards/${id}`, updatedCard);
        } catch (error) {
            console.error('Error updating color:', error);
        }
        setIsColorPaletteOpen(false);
    };
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (isColorPaletteOpen && !event.target.closest('.color-platte') && !event.target.closest('.circle-icon')) {
                setIsColorPaletteOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isColorPaletteOpen]);

    return (
        <div className="card" style={{ backgroundColor: newColor }}> 
            {isEditing ? (
                <input
                    type="text"
                    value={newText}
                    onChange={handleTextChange}
                    onBlur={handleTextSubmit}
                    onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
                    autoFocus
                />
            ) : (
                <p onClick={handleTextClick}>{newText}</p>
            )}

            <div className="card-actions">
                <div className="circle-icon" onClick={toggleColorPalette}></div> 
                <DeleteForeverIcon onClick={onDelete} className="delete-icon" />
            </div>

            {isColorPaletteOpen && (
                <div className='color-platte'>
                    {colorOptions.map((colorOption) => (
                        <div
                            key={colorOption}
                            className="color-swatch"
                            style={{ backgroundColor: colorOption }}
                            onClick={() => handleColorChange(colorOption)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Card;
