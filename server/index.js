const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const readCards = () => {
    const data = fs.readFileSync('./data/db.json');
    return JSON.parse(data).cards;
};

const readColors = () => {
    const data = fs.readFileSync('./data/db.json');
    return JSON.parse(data).colors;
};

const writeCards = (cards) => {
    const data = JSON.parse(fs.readFileSync('./data/db.json'));
    data.cards = cards;
    fs.writeFileSync('./data/db.json', JSON.stringify(data, null, 2));
};
const writeColors = (colors) => {
    const data = JSON.parse(fs.readFileSync('./data/db.json'));
    data.colors = colors;
    fs.writeFileSync('./data/db.json', JSON.stringify(data, null, 2));
};

// GET 
app.get('/cards', (req, res) => {
    const cards = readCards();
    res.json(cards);
});

// POST 
app.post('/cards', (req, res) => {
    const newCard = req.body;
    const cards = readCards();

    newCard.id = cards.length ? Math.max(...cards.map(card => card.id)) + 1 : 1;

    cards.push(newCard);
    writeCards(cards);
    res.status(201).json(newCard);
});

// PUT  
app.put('/cards/:id', (req, res) => {
    const cardId = Number(req.params.id);
    const updatedCard = req.body;
    const cards = readCards();

    const cardIndex = cards.findIndex(card => card.id === cardId);
    if (cardIndex === -1) {
        return res.status(404).send('Card not found');
    }

    updatedCard.id = cardId; 
    cards[cardIndex] = updatedCard;
    writeCards(cards);
    res.json(updatedCard);
});

// DELETE 
app.delete('/cards/:id', (req, res) => {
    const cardId = Number(req.params.id);
    let cards = readCards();

    cards = cards.filter(card => card.id !== cardId);
    writeCards(cards);
    res.status(204).send(); 
});

// GET 
app.get('/colors', (req, res) => {
    const colors = readColors();
    res.json(colors);
});

app.post('/colors', (req, res) => {
    const newColor = req.body.color; 

    if (!newColor) {
        return res.status(400).send('Color is required');
    }

    const colors = readColors();
    if (colors.includes(newColor)) {
        return res.status(400).send('Color already exists');
    }

    colors.push(newColor); 
    writeColors(colors); 

    res.status(201).json(colors); 
});


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
