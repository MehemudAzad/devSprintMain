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
         *  USERS
        -=-=-=-=-=-=-=-=-=*/
        app.get('/user/:user_id', async (req, res) => {
            try {
              const userId = req.params.user_id;
              const query = 'SELECT * FROM users WHERE id = $1';
              const values = [userId];
              const userResult = await pool.query(query, values);

              const query2 = 'SELECT * FROM users u JOIN project_user pu on $1 = pu.user_id JOIN project p on p.id = pu.project_id WHERE u.id = $1 AND (pu.is_approved = $2 OR pu.is_approved = $3)';
              const values2 = [userId, 'APPROVED', 'ACCEPTED'];
              const projectResult = await pool.query(query2, values2);

              const points = await pool.query(
                `
                SELECT COUNT(*)
                FROM "commit"
                WHERE user_id = $1
                `, [userId]
              );


              res.json({user: userResult.rows[0], projects: projectResult.rows, points: points.rows[0].count});
            } catch (error) {
              console.error('Error fetching files:', error);
              res.status(500).send('Error fetching files');
            }
          });


        //search users
        // API endpoint to search for users by username
        app.get('/users/:username', async (req, res) => {
            const username = req.params.username;
        
            try {
            const query = 'SELECT * FROM users WHERE username LIKE $1';
            const result = await pool.query(query, [`%${username}%`]);
        
            // if (result.rowCount === 0) {
            //     // If no user found with the provided username
            //     // return res.status(404).json({ message: 'No users found' });
            // }
        
            // If users found, send the user data
            res.json(result.rows)
            } catch (error) {
            console.error('Error searching for user:', error);
            res.status(500).json({ message: 'Internal server error' });
            }
        });
  
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
              const userInfo = userResult.rows[0];
              // console.log(userId);
  
              res.json({ success: true, userInfo });
            //   res.status(201).json({ message: 'User registered successfully' });
            } catch (error) {
              console.error('Error registering user', error);
              res.status(500).send('Internal Server Error');
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
            console.log(creator_id, category, name, description);

            const projectResult = await pool.query(
                `
                INSERT INTO project (creator_id, category, name, description) VALUES ($1, $2, $3, $4) RETURNING *
                `, [creator_id, category, name, description]
            );

            const project_id = projectResult.rows[0].id;

            await pool.query(
                `INSERT INTO project_user (project_id, user_id, is_approved) values ($1, $2, $3)`, [project_id, creator_id, 'APPROVED']
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
                WHERE PU.project_id = $1 AND (PU.is_approved = 'APPROVED' OR PU.is_approved ='ACCEPTED')
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
                select * 
                from project
                where id in(
                    SELECT project_id 
                    FROM project_user PU 
                    join users U ON (PU.user_id = $1) 
                    join project P ON (P.id = PU.project_id)
                    WHERE PU.is_approved = $2
                    group by project_id)
                `, [userId, 'APPROVED']
            );

            res.json(projects.rows);

        } catch (error) {
            console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });

    // API endpoint to search for projects by category
    app.get('/projects/:category', async (req, res) => {
        const category = req.params.category;
    
        try {
        const query = 'SELECT * FROM project WHERE category LIKE $1';
        const result = await pool.query(query, [`%${category}%`]);
    
        // if (result.rowCount === 0) {
        //     // If no project found with the provided category
        //     return res.status(404).json({ message: 'No projects found' });
        // }
    
        // If projects found, send the project data
        res.json(result.rows);
        } catch (error) {
        console.error('Error searching for projects:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
    });

    // API endpoint to search for projects by category
    app.get('/projects/search/:name', async (req, res) => {
        const name = req.params.name;
        console.log(name); 
        try {
        const query = 'SELECT P.*, U.username, U.email, U.user_photo FROM project P join users U on U.id = P.creator_id WHERE name ILIKE $1 OR category ILIKE $2';
        const result = await pool.query(query, [`%${name}%`, `%${name}%`]);
    
        // if (result.rowCount === 0) {
        //     // If no project found with the provided category
        //     return res.status(404).json({ message: 'No projects found' });
        // }
    
        // If projects found, send the project data
        res.json(result.rows);
        } catch (error) {
        console.error('Error searching for projects:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
    });
    app.get('/users/:username', async (req, res) => {
        const username = req.params.username;
    
        try {
        const query = 'SELECT * FROM users WHERE username LIKE $1';
        const result = await pool.query(query, [`%${username}%`]);
    
        // if (result.rowCount === 0) {
        //     // If no user found with the provided username
        //     // return res.status(404).json({ message: 'No users found' });
        // }
    
        // If users found, send the user data
        res.json(result.rows)
        } catch (error) {
        console.error('Error searching for user:', error);
        res.status(500).json({ message: 'Internal server error' });
        }
    });
  
    /**-=--=-=-=-=-=-=-
     *  COLLABORATION
    -=-=-=-=-=-=-=-=-=*/
    // invite collaborators
    app.post('/project/invite', async(req, res) => {
        try {
            
            const project_id = req.body.project_id;
            const user_id = req.body.user_id;
            console.log(project_id, user_id);
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
    //get invitation for a particular user_id
    app.get('/project/invite/:user_id', async(req,res)=> {
        try{
            const user_id = req.params.user_id;
            const query = `SELECT * FROM project_user PU join project P ON (P.id = PU.project_id) join users U ON (P.creator_id = U.id) WHERE PU.user_id = $1 AND PU.is_approved = $2`;
            const values = [user_id, 'INVITED'];
            const invitationsResult = await pool.query(query, values);

            res.json(invitationsResult.rows);
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
            console.log('requested ', project_id, user_id)

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

    //Get all collaboration requests
    app.get('/project/requests/:project_id', async(req, res)=> {
        try {
            
            const project_id = req.params.project_id;
            const requests = await pool.query(
                `
                SELECT PU.project_id, PU.user_id, U.username, U.email
                FROM project_user PU
                JOIN users U ON U.id = PU.user_id
                WHERE PU.project_id = $1 AND PU.is_approved = 'REQUESTED'
                `, [project_id]
            );

            res.json(requests.rows);

        } catch (error) {
            console.error('error executing query: ', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    })

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
     *  COMMITS
    =-=--=-=-=-=-=-=-=-=-=*/
      app.get('/commits/:project_id', async (req,res) => {
        try{
            const project_id = req.params.project_id;
            const query =  'SELECT * FROM commit WHERE project_id = $1';
            const values = [project_id];
            const result = await pool.query(query, values);

            res.json(result.rows);
        }catch(error){
            console.log('Error fetching commits : ', error);
            res.status(500).send('Error fetching commits');
        }
      })
       /**-=--=-=-=-=-=-=-=-=-
     *  SUBMISSIONS
    =-=--=-=-=-=-=-=-=-=-=*/
      app.get('/submission/:project_id', async (req, res) => {
        try {
          const projectId = req.params.project_id;
          const query = 'SELECT * FROM submission WHERE project_id = $1';
          const values = [projectId];
          const result = await pool.query(query, values);
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
          console.log(filePath);
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
