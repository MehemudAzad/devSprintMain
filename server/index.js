const express = require('express');
const cors = require('cors');
const pool = require('./src/config/db');
// const bcrypt = require('bcrypt');

const port = process.env.PORT || 5002;
const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();

//middleware
app.use(cors());
app.use(express.json());
//listening to the port
app.listen(port, () => {
    console.log(`test server running on ${port}`);
})
