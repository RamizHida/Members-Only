const express = require('express');
require('dotenv').config();

const app = express();

app.get('/', (req, res) => {
  res.send('Hello');
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log('App lisenting on port ', port);
});
