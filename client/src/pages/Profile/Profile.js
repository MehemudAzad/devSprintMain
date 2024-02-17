import { useLoaderData } from "react-router-dom";
import Repository from "../repositories/Repository";
import { FaDiagramProject } from "react-icons/fa6";
import { FaUser } from "react-icons/fa";

const Profile = () => {
    const userInfo = useLoaderData();
    console.log(userInfo);
    const repositories = userInfo.projects;
    const user = userInfo.user;
    console.log( user);

    
    return ( 
        <>
        <div className="grid grid-cols-3 p-4">
            <div className="col-span-1 py-10 px-6">
                <img className="w-[400px] h-[400px] rounded-full mb-4" src="https://images.unsplash.com/photo-1474447976065-67d23accb1e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl">{user.username} </h2>
                <FaUser  className="text-3xl"/>
                </div> 
                <h3 className="text-2xl">{user.email}</h3>
            </div> 
            <div className="p-4 border-t-4 border-indigo-500 col-span-2">
                <div className= "border-neutral-500">
                <section className=" p-10 rounded-2xl">
                    <h2 className="text-4xl">Total Repositories : {repositories.length} </h2>  
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
            </div>
        </div>
        </>
    );

}
 
export default Profile;