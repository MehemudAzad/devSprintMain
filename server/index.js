const express = require('express');
const cors = require('cors');
const pool = require('./db');
// const bcrypt = require('bcrypt');

const port = process.env.PORT || 5003;
// const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();



//middleware
app.use(cors());
app.use(express.json());


async function run (){
    try{
        console.log("hello ");
        
    }finally{

    }
}

//running the function
run().catch(err => console.error(err));

//listening to the port
app.listen(port, () => {
    console.log(`test server running on ${port}`);
})
