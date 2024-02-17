import { useState } from "react";
import { Link } from "react-router-dom";

const Home = () => {
    const [submissions, setSubmissions] = useState([]);
    const [commits, setCommits] = useState([]);
    const [username, setUsername] = useState('');
    const [projects, setProjects] = useState([]);


    const handleSearch = async () => {
        try {
          console.log(username);
          const response = await fetch(`http://localhost:5003/projects/search/${username}`);
          if(response.ok) {
              const data = await response.json();
              setProjects(data);
              console.log(data);
          }
        } catch (error) {
          console.error('Error searching for user:', error.response);
          setProjects(null);
        }
      };


    const handleRequest = async () => {

    }
   
    return ( 

        
        <div className="p-5">
            <div className="">
                <h2 className="text-3xl mb-4">Search by repository </h2>
            </div>
            <div className="flex items-center gap-4">
                             <input className="input w-full"
                                type="text"
                                placeholder="Enter repository name"
                                value={username}
                                onChange={(e) => {
                                    setUsername(e.target.value); 
                                    handleSearch();
                                }} />
                             </div>

                            <div className="mt-3">
                                {projects && 
                                 projects?.map(project =>
                                    <div onClick={()=>handleRequest(project.id)} className="bg-gray-200 rounded-md p-2">
                                    <Link to={`/repository/${project?.id}`}><p>Repository : <span className="text-blue-500">{project?.name}</span></p></Link>
                                    <Link to={`/view/profile/${project?.creator_id}`}><p >Owner : <span className="text-blue-500">{project?.username}</span></p></Link>
                                    <p></p>
                                    {/* Display other user data as needed */}
                                    </div>
                                )
                               }

                            </div>
        </div>
     );
}
 
export default Home;