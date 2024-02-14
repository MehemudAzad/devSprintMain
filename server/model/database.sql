CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    date_of_birth DATE,
    user_photo VARCHAR(2000)
);

CREATE TABLE project (
    id SERIAL PRIMARY KEY,
    category VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

CREATE TABLE project_user (
    project_id INTEGER REFERENCES project(id),
    user_id INTEGER REFERENCES users(id),
    PRIMARY KEY (project_id, user_id)

);

CREATE TABLE commit (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES project(id),
    file_name TEXT,
    file_path TEXT,
    commit_message TEXT
);

