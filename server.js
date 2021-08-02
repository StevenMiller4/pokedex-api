require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const POKEDEX = require('./pokedex.json');

const app = express();

app.use(morgan('dev'));

app.use(function validateBearerToken(req, res, next) {
    const authToken = req.get('Authorization')
    const apiToken = process.env.API_TOKEN

    console.log('validate bearer token middleware')

    if (!authToken || authToken.split(' ')[1] !== apiToken) {
        return res.status(401).json({ error: 'Unauthorized request' })
    }

    next()
});

const validTypes = ['Bugs', 'Dark', 'Dragon', 'Electric', 'Fairy', 'Fighting', 'Fire', 'Flying', 'Ghost', 'Grass', 'Ground', 'Ice', 'Normal', 'Poison', 'Psychic', 'Rock', 'Steel', 'Water'];

function handleGetTypes(req, res) {
    res.json(validTypes);
}

app.get('/types', handleGetTypes);

function handleGetPokemon(req, res) {
    let response = POKEDEX.pokemon;

    if (req.query.name) {
        response = response.filter(pokemon =>
            pokemon.name.toLowerCase().includes(req.query.name.toLowerCase())    
        )
    }

    res.json(response);
}

app.get('/pokemon', handleGetPokemon);

const PORT = 8000;

app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});