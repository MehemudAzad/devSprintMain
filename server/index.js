const express = require('express');
const cors = require('cors');
const pool = require('./db');
const multer = require('multer');
// const bcrypt = require('bcrypt');

const port = process.env.PORT || 5003;
// const jwt = require('jsonwebtoken');

require('dotenv').config();
const app = express();



//middleware
app.use(cors());
app.use(express.json());
//app.use('/files', express.static('public/files'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      return cb(null, './public/files');
    },
    filename: function (req, file, cb) {
      return cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

async function run (){
    try{

        /**-=--=-=-=-=-=-=-
         *  AUTHENTICATION
        -=-=-=-=-=-=-=-=-=*/
        //login
        app.post('/login', async (req, res) => {
            const { email, password } = req.body;
            try {
                // Check if the user with the provided email and password exists
                const user = await pool.query(
                    'SELECT * FROM users WHERE users.email = $1 AND users.password = $2',
                    [email, password]
                );
                
                //get the user role
                const userId = user?.rows[0]?.id;
                console.log(userId);
                const userInfo = user.rows[0];
                res.json({ success: true, message: 'Authentication successful', userInfo });
            } 
            catch (error) {
                    console.error('Error during login:', error);
                    res.status(500).json({ success: false, message: 'Internal server error' });
                }
        });

        //register
        app.post('/register', async (req, res) => {
            try {
              const { email, username, password } = req.body;
  
              // Step 1: Insert into the users table
              const userResult = await pool.query(
                'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING *',
                [email, username, password]
              );
              const userId = userResult.rows[0].id;
              const role = userResult.rows[0].role;
              // console.log(userId);
  
              res.json({ success: true, userId });
              res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
              console.error('Error registering user', error);
              res.status(500).send('Internal Server Error');
            }
          });

          // Details of a particular user
          app.get('/user/:id', async (req, res) => {
            try {

                const id = req.params.id;

                const user = await pool.query(
                    `
                    SELECT * FROM users WHERE id = $1
                    `, [id]
                );

                res.json(user.rows[0]);
                
            } catch (error) {
                console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
            }

          });

          // Get list of projects where a user requested to collaborate
          app.get('/user/request/:id', async(req, res) => {
            try {
              
              const {id} = req.params;
              const projects = await pool.query(
                `
                SELECT PU.user_id, PU.project_id, P.creator_id, P.category, P.name, P.description
                FROM project_user PU
                JOIN project P ON P.id = PU.project_id
                WHERE PU.user_id = $1 AND PU.is_approved = 'REQUESTED'
                `, [id]
              );

              res.json(projects.rows);

            } catch (error) {
              console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
            }
          });

          // Search users by name
          app.get('/users', async (req, res) => {
            const { name } = req.query;
          
            try {
              // Using ILIKE for case-insensitive search and similarity function for similarity ranking
              const query = `
                SELECT id, username, email, user_photo, 
                       SIMILARITY(username, $1) AS similarity 
                FROM users 
                WHERE username ILIKE $1 
                ORDER BY similarity DESC
                LIMIT 1
              `;
              
              const { rows } = await pool.query(query, [`%${name}%`]);
          
              if (rows.length > 0) {
                const users = rows;
                res.json(users);
              } else {
                res.status(404).json({ message: 'User not found' });
              }
            } catch (error) {
              console.error('Error executing query', error);
              res.status(500).json({ message: 'Internal server error' });
            }
          });
  
        /**-=--=-=-=-=-=-=-
         *  PROJECTS
        -=-=-=-=-=-=-=-=-=*/
       // Create project
       app.post('/project', async (req, res) => {
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
    app.get('/project', async(req, res) => {
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

    // Search projects by name
    app.get('/projects', async (req, res) => {
        const { name } = req.query;
      
        try {
          // Using ILIKE for case-insensitive search and similarity function for similarity ranking
          const query = `
            SELECT id, creator_id, category, name 
            FROM project 
            WHERE name ILIKE $1 
            ORDER BY SIMILARITY(name, $1) DESC
            `;
          
          const { rows } = await pool.query(query, [`%${name}%`]);
      
          if (rows.length > 0) {
            res.json(rows);
          } else {
            res.status(404).json({ message: 'No projects found' });
          }
        } catch (error) {
          console.error('Error executing query', error);
          res.status(500).json({ message: 'Internal server error' });
        }
      });

    // Get a particular project
    // app.get('/project/:id', async(req, res) => {
    //     try {
            
    //         const id = req.params.id;

    //         const project = await pool.query(
    //             `
    //             SELECT * FROM project
    //             WHERE id = $1
    //             `, [id]
    //         );

    //         res.json(project.rows[0]);

    //     } catch (error) {
    //         console.error('error executing query: ', error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // });
    // Get a particular project
    app.get('/project/:id', async(req, res) => {
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
                SELECT U.id, U.email, U.username, U.user_photo
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
    app.get('/user/project/:userId', async(req, res) => {
        try {
            
            const userId = req.params.userId;

            const projects = await pool.query(
                `
                SELECT * FROM project
                WHERE creator_id = $1
                `, [userId]
            );

            res.json(projects.rows);

        } catch (error) {
            console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Get all users that requested to collaborate on a particular project
    app.get('/project/requests/:id', async(req, res) => {
      try {
        
        const {id} = req.params;
        const users = await pool.query(
          `
          SELECT PU.project_id, U.id, U.email, U.username, U.user_photo
          FROM project_user PU
          JOIN users U ON U.id = PU.user_id
          WHERE PU.project_id = $1 AND PU.is_approved = 'REQUESTED'
          `, [id]
        );

        res.json(users.rows);

      } catch (error) {
        console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
      }
    })


    /**-=--=-=-=-=-=-=-
     *  COLLABORATION
    -=-=-=-=-=-=-=-=-=*/
    // invite collaborators
    app.post('/project/invite', async(req, res) => {
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

    // Accept collaborator invitation
    app.post('/project/invite/accept', async(req, res) => {
        try {
            
            const project_id = req.body.project_id;
            const user_id = req.body.user_id;
            await pool.query(
                `
                UPDATE project_user SET is_approved = 'APPROVED'
                WHERE project_id = $1 AND user_id = $2
                `, [project_id, user_id]
            );

            res.json({message: `Accepted`});

        } catch (error) {
            console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // Request to collaborate
    app.post('/project/request', async(req, res) => {
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

    // Approve collaborator
    app.post('/project/invite/approve', async(req, res) => {
        try {
            
            const project_id = req.body.project_id;
            const user_id = req.body.user_id;
            
            await pool.query(
                `
                UPDATE project_user SET is_approved = 'APPROVED'
                WHERE project_id = $1 AND user_id = $2
                `, [project_id, user_id]
            );

            res.json({message: `Approved`});

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

    /**-=--=-=-=-=-=-=-
     *  FILES 
    -=-=-=-=-=-=-=-=-=*/

    /**-=--=-=-=-=-=-=-=-=-
     *  STORAGE AND UPLOAD
    =-=--=-=-=-=-=-=-=-=-=*/
      // Upload submission
      app.post('/upload', upload.single('file'), async (req, res) => {
        // const { originalname, path } = req.file;
        const { user_id, project_id, commit_message } = req.body;
        // Check if a file was provided
        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        try{
            const queryCommit = 'INSERT INTO commit (project_id, commit_message, user_id) VALUES ($1, $2, $3) RETURNING *';
            const valuesCommit = [project_id, commit_message, user_id];
            const resultCommit = await pool.query(queryCommit, valuesCommit);
            const commitId = resultCommit.rows[0].id;
    
    
            const query = 'INSERT INTO submission (commit_id, user_id, project_id, file_name, file_path) VALUES ($1, $2, $3, $4, $5) RETURNING *';
            const values = [commitId, user_id, project_id, req.file?.originalname, req.file?.path];
            
            console.log("upload called");
            const result = await pool.query(query, values);
            res.status(200).send('File uploaded successfully');
        }catch (error){
            console.error('Error uploading file:', error);
            res.status(500).send('Error uploading file');
        }
       
      });

       /**-=--=-=-=-=-=-=-=-=-
     *  SUBMISSIONS
    =-=--=-=-=-=-=-=-=-=-=*/
      app.get('/submission/:project_id', async (req, res) => {
        try {
          const projectId = req.params.project_id;
        //   console.log("Fetching submissions for project ID:", projectId);
      
          const query = 'SELECT * FROM submission WHERE project_id = $1';
          const values = [projectId];
          const result = await pool.query(query, values);
        //   console.log("Result:", result.rows);
      
          res.json(result.rows);
        } catch (error) {
          console.error('Error fetching files:', error);
          res.status(500).send('Error fetching files');
        }
      });

      app.get('/submission-download/:id', async (req, res) => {
        const fileId = req.params.id;
        // console.log(fileId);
        const query = 'SELECT * FROM submission WHERE id = $1';
        const values = [fileId];
      
        try {
          const result = await pool.query(query, values);
          const file = result.rows[0];
          const filePath = file.file_path;
          //const filename = file.file_name;
          //console.log(filename, filePath);
          //res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
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
