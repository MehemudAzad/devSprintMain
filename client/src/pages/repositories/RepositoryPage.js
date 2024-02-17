import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthProvider";
import Repository from "./Repository";
import { Link } from "react-router-dom";
import AddRepository from "./AddRepository";
import { FaDiagramProject } from "react-icons/fa6";

const RepositoryPage = () => {
    const {user} = useContext(AuthContext);
    const [repositories, setRepositories] = useState([]);
    // const {id} = user;
    console.log(user?.id);

    const getProjects = async ()=>{
        const response = await fetch(`http://localhost:5003/user/project/${user?.id}`);
        const data = await response.json();
        console.log(data);
        setRepositories(data);
    }   

    useEffect(()=> { 
        try {
            getProjects();
        } catch (error) {
            console.log("Error : problem getting repositories");
        }    
    }, []);
    console.log(repositories);
    return ( 
        <div className="">
                <div className="grid grid-cols-3 p-4">
            <div className="col-span-2 border-t-4 border-neutral-500">
                <section className=" p-10 bg-indigo-100">
                    <h2 className="text-4xl">Repositories({repositories.length}) </h2>  
                    <div className='grid grid-cols-1 gap-x-6 gap-y-3 mt-4' >
                    {
                        repositories?.map(repository => 
                            <Repository key={repository?.id} repository = {repository} />
                        )
                    }
                    </div>
                    <div>
                {/* Add pagination controls */}
                {/* <div className='flex justify-center items-center bg-neutral-950 w-[38%] p-3 m-auto rounded-lg mt-20'>
                    <button className='btn btn-accent mr-10 w-[150px]' disabled={page === 1} onClick={() => setPage(page - 1)}>
                    Previous Page
                    </button>
                    <span className='text-md text-white decoration-dashed'>Page {page} of {totalPages}</span>
                    <button className='btn btn-accent ml-10 w-[150px]' disabled={page === totalPages} onClick={() => setPage(page + 1)}>
                    Next Page
                    </button>
                </div> */}
                    </div>
                </section>
            </div>
            
            <div className="p-4 border-t-4 border-indigo-500">
                <div className="flex items-center gap-6">
                    <h2 className="text-3xl">Create Repository  </h2>
                    <FaDiagramProject  className="text-3xl"/>
                </div>
                
                <AddRepository></AddRepository>
            </div>
        </div>
        </div>
        
     );
}
 
export default RepositoryPage;