const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // This allows your HTML to talk to the server
app.use(bodyParser.json());

// --- MYSQL CONNECTION ---
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '', // Default XAMPP password is empty
    database: 'hvac_db'
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to XAMPP MySQL Database.');
});

// --- API ENDPOINT TO SAVE DATA ---
app.post('/save-order', (req, res) => {
    const { name, email, phone, addr, amount, items } = req.body;
    const tx_ref = "AXTON_" + Date.now();
    const day = new Date().toLocaleString('en-us', {weekday: 'long'});

    const sql = `INSERT INTO orders (customer_name, email, phone, address, items, amount, tx_ref, order_day) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;

    db.query(sql, [name, email, phone, addr, items, amount, tx_ref, day], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Database Error" });
        }
        res.send({ status: "Success", message: "Order logged in database" });
    });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));