const express = require('express');
const multer = require('multer');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'file_test',
  password: 'postgres123',
  port: 5432,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/upload', upload.single('file'), async (req, res) => {
  const { originalname, path } = req.file;
  const query = 'INSERT INTO files (originalname, path) VALUES ($1, $2) RETURNING *';
  const values = [originalname, path];

  try {
    const result = await pool.query(query, values);
    res.status(200).send('File uploaded successfully');
  } catch (error) {
    console.error('Error uploading file:', error);
    res.status(500).send('Error uploading file');
  }
});

app.get('/files', async (req, res) => {
  const query = 'SELECT * FROM files';

  try {
    const result = await pool.query(query);
    console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching files:', error);
    res.status(500).send('Error fetching files');
  }
});

app.get('/file/:id', async (req, res) => {
  const fileId = req.params.id;
  console.log(fileId);
  const query = 'SELECT * FROM files WHERE id = $1';
  const values = [fileId];

  try {
    const result = await pool.query(query, values);
    const file = result.rows[0];
    const filePath = file.path;
    res.download(filePath);
  } catch (error) {
    console.error('Error fetching file:', error);
    res.status(500).send('Error fetching file');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
