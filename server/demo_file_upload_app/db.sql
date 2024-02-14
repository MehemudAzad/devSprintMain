CREATE DATABASE file_test;

CREATE TABLE files (
    id SERIAL PRIMARY KEY,
    originalname TEXT,
    path TEXT
);
