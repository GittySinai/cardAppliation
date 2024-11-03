import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './Card';
import './CardList.scss';

const CardList = () => {
    const [cards, setCards] = useState([]);
    const [colorOptions, setColorOptions] = useState([]);
    const [isColorDialogOpen, setIsColorDialogOpen] = useState(false);
    const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
    const [newCardText, setNewCardText] = useState('');
    const [newColor, setNewColor] = useState('');
    const [newColorPlatte, setNewColorPlatte] = useState('');


    useEffect(() => {
        const fetchCards = async () => {
            try {
                const response = await axios.get('http://localhost:3000/cards');
                setCards(response.data);
            } catch (error) {
                console.error('Error fetching cards:', error);
            }
        };

        const fetchColors = async () => {
            try {
                const response = await axios.get('http://localhost:3000/colors');
                setColorOptions(response.data);
                console.log('Fetched colors:', response.data); 
            } catch (error) {
                console.error('Error fetching colors:', error);
            }
        };

        fetchCards();
        fetchColors();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/cards/${id}`);
            setCards(prevCards => prevCards.filter(card => card.id !== id));
        } catch (error) {
            console.error('Error deleting card:', error);
        }
    };

    const toggleColorDialog = () => {
        setIsColorDialogOpen(prev => !prev);
    };

    const toggleCardDialog = () => {
        setIsCardDialogOpen(prev => !prev);
    };

    const toggleDialogs = () => {
        setIsCardDialogOpen(prev => !prev);
        setIsColorDialogOpen(prev => !prev);
    };

    const handleAddColor = async () => {
        try {
            await axios.post('http://localhost:3000/colors', { color: newColorPlatte });
            setColorOptions(prevColors => [...prevColors, newColorPlatte]);
            toggleColorDialog();
            setNewColorPlatte('');
        } catch (error) {
            console.error('Error adding color:', error);
        }
    };

    const handleAddCard = async () => {
        try {
            const newCard = { text: newCardText, color: newColor };
            await axios.post('http://localhost:3000/cards', newCard);
            setCards(prevCards => [...prevCards, newCard]);
            toggleCardDialog();
            setNewCardText('');
            setNewColor('');
        } catch (error) {
            console.error('Error adding card:', error);
        }
    };

    return (
        <div className="card-list">
            {cards.map(card => (
                <Card 
                    key={card.id} 
                    id={card.id}
                    color={card.color} 
                    text={card.text} 
                    onDelete={() => handleDelete(card.id)} 
                    colorOptions={colorOptions}
                />
            ))}
            <button className="add-button" onClick={toggleDialogs}>
                +
            </button>
            {isCardDialogOpen || isColorDialogOpen ? (
                <div className="dialog-overlay">
                    <div className="dialog-container">
                        {isCardDialogOpen && (
                            <div className="dialog-content">
                                <h2>Add new Card</h2>
                                <input className='card-input'
                                    type="text"
                                    value={newCardText}
                                    onChange={(e) => setNewCardText(e.target.value)}
                                    placeholder="Add new card text"
                                />
                                <input  className='card-input'
                                    type="color"
                                    value={newColor}
                                    onChange={(e) => setNewColor(e.target.value)}
                                    placeholder="Choose color"
                                />
                                <button onClick={handleAddCard}>Add Card</button>
                                <button onClick={() => setIsCardDialogOpen(false)}>x</button>
                            </div>
                        )}
                        {isColorDialogOpen && (
                            <div className="dialog-content">
                                <h2>Add new Color</h2>
                                <input
                                    type="color"
                                    value={newColorPlatte}
                                    onChange={(e) => setNewColorPlatte(e.target.value)}
                                    placeholder="Add new color"
                                />
                                <button onClick={handleAddColor}>Add Color</button>
                                <button onClick={() => setIsColorDialogOpen(false)}>x</button>
                            </div>
                        )}
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default CardList;
