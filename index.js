const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
dotenv.config();

// Create a connection to the database
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: 'cake_reviews'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to database');
});

// Create the reviews table if it doesn't exist
db.query(`CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    review TEXT,
    rating INT
)`, (err) => {
    if (err) throw err;
});

// Get all reviews
app.get('/reviews', (req, res) => {
    db.query('SELECT * FROM reviews', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a new review
app.post('/reviews', (req, res) => {
    const { name, review, rating } = req.body;
    const sql = 'INSERT INTO reviews (name, review, rating) VALUES (?, ?, ?)';
    db.query(sql, [name, review, rating], (err) => {
        if (err) throw err;
        res.status(201).send('Review added');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
