const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

// test comment for nodemon
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname,)));

app.get('/api-key', (req, res) => {
    res.json({ apiKey: process.env.NREL_API_KEY });
});

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});