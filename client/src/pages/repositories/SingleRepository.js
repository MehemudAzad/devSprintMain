import { useContext, useEffect, useState } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { FaPlusCircle } from "react-icons/fa";
import Submission from "./Submission";
import Collaborator from "./collaborators/Collaborator";
import { FaFileDownload } from "react-icons/fa";
import { useLocation, useNavigate} from "react-router-dom";

const SingleRepository = () => {
    const {user} = useContext(AuthContext);
    const projects = useLoaderData();
    const collaborators = projects.collaborators;
    const repository = projects.project;
    const [submissions, setSubmissions] = useState([]);
    const [commits, setCommits] = useState([]);
    const [username, setUsername] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    let authFlag = false;
    let arrayOfIds = collaborators.map(obj => obj.id);
    if (arrayOfIds.includes(user?.id)) {
        authFlag = true;
    } 
    
    const handleInvitation = async (user_id) => {
        console.log('inside invite functino ' , user_id);
        try{
            fetch('http://localhost:5003/project/invite', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id : user_id, project_id :repository.id})
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log('File uploaded successfully:', data);
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
        }finally{

        }  
    }

    const handleSearch = async () => {
      try {
        console.log(username);
        const response = await fetch(`http://localhost:5003/users/${username}`);
        if(response.ok) {
            const data = await response.json();
            setUsers(data);
            console.log(data);
        }
      } catch (error) {
        console.error('Error searching for user:', error.response);
        setUsers(null);
      }
    };
 
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };
    const getSubmissions = async () => {
      try {
          const response = await fetch(`http://localhost:5003/submission/${repository?.id}`);
          if (response.ok) {
              const data = await response.json();
              setSubmissions(data);
          } else {
              throw new Error('Failed to fetch submissions');
          }
      } catch (error) {
          console.error('Error fetching submissions:', error);
      }
  };

      const getCommits = async () => {
        try {
            const response = await fetch(`http://localhost:5003/commits/${repository?.id}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Submissions:', data);
                setCommits(data);
            } else {
                throw new Error('Failed to fetch submissions');
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };

    useEffect(() => {
        getSubmissions();
        if (repository?.id) {
            getSubmissions();
        }
        if (repository?.id) {
            getCommits();
        }

    }, [repository]);

    const handleFileUpload = () => {
        if (selectedFile) {
          const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('user_id', user?.id);
        formData.append('project_id', repository?.id);
            
          fetch('http://localhost:5003/upload', {
            method: 'POST',
            body: formData
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log('File uploaded successfully:', data);

          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
        }
        getSubmissions();
        getCommits();
      };

      const handleRequest = async () => {
        console.log('requested' , user?.id);
        try{
            fetch('http://localhost:5003/project/request', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id : user?.id, project_id :repository.id})
          })
          .then(response => {
            if (response.ok) {
              return response.json();
            }
            throw new Error('Network response was not ok.');
          })
          .then(data => {
            console.log('File uploaded successfully:', data);
          })
          .catch(error => {
            console.error('Error uploading file:', error);
          });
        }finally{
            console.log("failed to request ");
        }  
      }

 
    return ( 
        <div className="p-5 pb-80">
            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 p-1">   
                    <h1 className="text-3xl text-blue-600">{repository?.name}</h1>
                    {
                        authFlag ? 
                        <>
                        <div className="flex items-center justify-between">
                        <h2 className="text-2xl my-3 flex items-cneter gap-2">Upload Files <FaFileDownload /> </h2>
                        <div>
                        <Link to={'/auth/editor'}><button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Code Editor
                        </span>
                        </button></Link>
                        <Link to={'/auth/whiteboard'}><button class="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
                        <span class="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        WhiteBoard
                        </span>
                        </button></Link>
                        </div>

                        </div>
                      
                        </> :
                        <>
                              <h2 className="text-2xl my-3 flex items-cneter gap-2">Uploaded Files <FaFileDownload /> </h2>
                        </>
                    } 
                    <div className="flex items-center justify-between bg-indigo-950 p-4 rounded-t-md">
                        {
                            authFlag ? <>
                                <div className="flex items-center gap-5 rounded-t-xl">
                                <input className="btn btn-primary flex items-center text-xl p-2" type="file"  onChange={handleFileChange} />
                                <button className="btn btn-primary" onClick={handleFileUpload}>Upload <FaPlusCircle /></button>
                                </div>
                                <h2 className="text-2xl text-white">Commits({commits.length})</h2>
                            </> : <>
                            <div className="mb-4"></div>
                                <h2 className="text-2xl ml-0">Commits({commits.length})</h2>
                                <button className="btn btn-primary" onClick={handleRequest}>Request to collaborate</button>
                            </>
                             
                        }
                    </div>
                    <div className="shadow-2xl p-2 border-t-4 bg-indigo-200 rounded-b-md">
                    {
                        submissions?.map(submission => 
                            <Submission key={submission?.id} submission = {submission} />
                        )
                    }
                    </div>
                </div>
                {/* display collaborators  */}
                <div className="bg-indigo-950 p-2 rounded-xl">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-3xl text-white">Collaborators: </h2>
                        <button className="btn" onClick={()=>document.getElementById('my_modal_4').showModal()}>Invite <FaPlusCircle /></button>

                    {/* You can open the modal using document.getElementById('ID').showModal() method */}
                        <dialog id="my_modal_4" className="modal">
                        <div className="modal-box w-11/12 max-w-5xl h-[500px]">
                            <h3 className="font-bold text-lg mb-3">Search for collaborators!</h3>
                             {/* take input  */}
                             <div className="flex items-center gap-4">
                             <input className="input w-full"
                                type="text"
                                placeholder="Enter username"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value); 
                                    handleSearch();
                                }} />
                             </div>

                            <div className="mt-3">
                                {users && 
                                 users?.map(user =>
                                    <div className="flex items-center justify-between bg-gray-200 rounded-md p-2 my-2">
                                      <div>
                                        <p>Email: {user.email}</p>
                                        <Link to={`/view/profile/${user?.id}`}><p>Username: <span className="text-blue-600 hover:underline">{user.username}</span></p></Link>
                                      </div>
                                      {/* Display other user data as needed */}
                                      <div className="modal-action">
                                        <form method="dialog">
                                          <button onClick={()=>handleInvitation(user.id)} className="btn btn-primary">Invite</button>
                                        </form>
                                      </div>
                                    </div>
                                )
                               }

                            </div>
                            <div className="modal-action">
                            <form method="dialog">
                                {/* if there is a button, it will close the modal */}
                                <button className="btn btn-primary">Close</button>
                            </form>
                            </div>
                        </div>
                        </dialog>
                    </div> 
                    
                    <div>
                        {
                            collaborators.map(collaborator => 
                                <Collaborator key={collaborator?.id} collaborator={collaborator}/>
                            )
                        }
                    </div>
                    
                </div>
            </div>
        </div>
     );
}
 
export default SingleRepository;
