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
                    SELECT U.user_id, U.email, U.username, U.user_photo
                    FROM project_user PU
                    JOIN users U
                    ON U.id = PU.user_id
                    WHERE PU.project_id = $1
                    `, [id]
                );

                res.json({project: project.rows[0], collaborators: collaborators.rows});

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
        })



    }finally{

    }
}

//running the function
run().catch(err => console.error(err));

//listening to the port
app.listen(port, () => {
    console.log(`test server running on ${port}`);
})
