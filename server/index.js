const express = require('express');
const cors = require('cors');
const pool = require('./db');
// const bcrypt = require('bcrypt');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 5003;
// const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

//middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));


async function run (){
    try{
        

        // Create project
        app.post('./project', async (req, res) => {
            try {
                
                const creator_id = req.body.creator_id;
                const category = req.body.category;
                const name = req.body.name;
                const description = req.body.description;

                await pool.query(
                    `
                    INSERT INTO project (creator_id, category, name, description) VALUES ($1, $2, $3, $4)
                    `, [creator_id, category, name, description]
                );

                res.json({message: `Project added`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Delete project
        app.get('/project/delete/:id', async(req, res) => {
            try {
                
                const id = req.params.id;
                
                await pool.query(
                    `
                    DELETE FROM project WHERE id = $1
                    `, [id]
                );

                res.json({message: `Deleted project: ${id}`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Get all projects
        app.get('./project', async(req, res) => {
            try {
                
                const projects = await pool.query(
                    `
                    SELECT * FROM project
                    `
                );

                res.json(projects.rows);

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Get a particular project
        app.get('./project/:id', async(req, res) => {
            try {
                
                const id = req.params.id;

                const project = await pool.query(
                    `
                    SELECT * FROM project
                    WHERE id = $1
                    `, [id]
                );

                const collaborators = await pool.query(
                    `
                    SELECT * 
                    FROM project P
                    JOIN project_user PU
                    ON P.id = PU.project_id

                    `
                );

                res.json(project.rows[0]);

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Get all projects under a particular user
        app.get('./user/:id/project', async(req, res) => {
            try {
                
                const id = req.params.id;

                const projects = await pool.query(
                    `
                    SELECT * FROM project
                    WHERE creator_id = $1
                    `, [id]
                );

                res.json(projects.rows);

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // invite collaborators
        app.post('./project/invite', async(req, res) => {
            try {
                
                const project_id = req.body.project_id;
                const user_id = req.body.user_id;
                const is_approved = "INVITED";

                await pool.query(
                    `
                    INSERT INTO project_user (project_id, user_id, is_approved) VALUES ($1, $2, $3)
                    `, [project_id, user_id, is_approved]
                );

                res.json({message: `Invited`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Approve collaborator
        app.post('./project/invite/approve', async(req, res) => {
            try {
                
                const project_id = req.body.project_id;
                const user_id = req.body.user_id;
                
                await pool.query(
                    `
                    UPDATE project_user SET is_approved = APPROVED
                    WHERE project_id = $1 AND user_id = $2
                    `, [project_id, user_id]
                );

                res.json({message: `Approved`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Request to collaborate
        app.post('./project/request', async(req, res) => {
            try {
        
                const project_id = req.body.project_id;
                const user_id = req.body.user_id;
                const is_approved = "REQUESTED";

                await pool.query(
                    `
                    INSERT INTO project_user (project_id, user_id, is_approved) VALUES ($1, $2, $3)
                    `, [project_id, user_id, is_approved]
                );

                res.json({message: `Requested`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Deny request to collaborate
        app.post('/project/request/deny', async(req, res) => {
            try {

                const project_id = req.body.project_id;
                const user_id = req.body.user_id;

                await pool.query(
                    `
                    DELETE FROM project_user WHERE project_id = $1 AND user_id = $2
                    `, [project_id, user_id]
                );

                res.json({message: `Request denied`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Deny invitation to collaborate
        app.post('/project/invite/deny', async(req, res) => {
            try {

                const project_id = req.body.project_id;
                const user_id = req.body.user_id;

                await pool.query(
                    `
                    DELETE FROM project_user WHERE project_id = $1 AND user_id = $2
                    `, [project_id, user_id]
                );

                res.json({message: `Invitation denied`});

            } catch (error) {
                console.error('error executing query: ', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });

        // Upload submission
        app.post('/upload', upload.single('file'), async (req, res) => {
            const { originalname, path } = req.file;
            const { commit_id, user_id, project_id } = req.body;
            const query = 'INSERT INTO submission (commit_id, user_id, project_id, file_name, file_path) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [commit_id, user_id, project_id, originalname, path];
          
            try {
              const result = await pool.query(query, values);
              res.status(200).send('File uploaded successfully');
            } catch (error) {
              console.error('Error uploading file:', error);
              res.status(500).send('Error uploading file');
            }
          });

          app.get('/submission', async (req, res) => {
            const query = 'SELECT * FROM submission';
          
            try {
              const result = await pool.query(query);
              console.log(result.rows);
              res.json(result.rows);
            } catch (error) {
              console.error('Error fetching files:', error);
              res.status(500).send('Error fetching files');
            }
          });

          app.get('/submission/:id', async (req, res) => {
            const fileId = req.params.id;
            console.log(fileId);
            const query = 'SELECT * submissions WHERE id = $1';
            const values = [fileId];
          
            try {
              const result = await pool.query(query, values);
              const file = result.rows[0];
              const filePath = file.file_path;
              res.download(filePath);
            } catch (error) {
              console.error('Error fetching file:', error);
              res.status(500).send('Error fetching file');
            }
          });


    }finally{

    }
}

//running the function
run().catch(err => console.error(err));

//listening to the port
app.listen(port, () => {
    console.log(`test server running on ${port}`);
})













