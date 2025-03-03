const express = require('express');
require('dotenv').config();
const pool = require('./db/pool');
const { singup } = require('./db/queries');
const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

async function testDB() {
  try {
    const results = await pool.query('SELECT * FROM users');
    console.log('Results from DB: ', results.rows[0]);
  } catch (error) {
    console.log('Error:: ', error);
  }
}

testDB();

const port = process.env.PORT;
app.listen(port, () => {
  console.log('App lisenting on port ', port);
});

// add detailsb details
