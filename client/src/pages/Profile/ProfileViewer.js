import { useLoaderData } from "react-router-dom";
import Repository from "../repositories/Repository";
import { FaUser } from "react-icons/fa";
import { useEffect, useState } from "react";

const ProfileViewer = () => {
    const userInfo = useLoaderData();
    console.log(userInfo);
    const projects = userInfo.projects;
    const user = userInfo.user;
    console.log( user);
    const [commitCount, setCommitCount] = useState(0);

    const getCommitCount = async () => {
        try {
            const response = await fetch(`http://localhost:5003/commits/user/${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Submissions:', data[0]?.count);
                setCommitCount(data[0]?.count);
            } else {
                throw new Error('Failed to fetch submissions');
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };
    ///commits/users/:user_id
    useEffect(()=>{
        getCommitCount();
        console.log(commitCount);
    }, []);

    return ( 
        <div className="p-5 grid grid-cols-3">
            <section className="col-span-1 text-bold bg-indigo-100 rounded-xl p-5">
            <img className="w-[400px] h-[400px] rounded-full mb-4" src="https://images.unsplash.com/photo-1474447976065-67d23accb1e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl text-blue-700">{user.username} </h2>
                <FaUser  className="text-3xl text-blue-600"/>
                </div> 
                <h3 className="text-2xl text-blue-900">{user.email}</h3>
                <h4 className="text-3xl mt-5 text-blue-950">Total Contributions ({commitCount})</h4>
                <div className="flex gap-5 text-xl py-5">
                    <p>Followers  (0)</p>
                    <p>Following  (0)</p>
                </div>
                <button className="btn btn-primary mt-10 text-xl">Follow </button>
                {/* <h1 className="text-3xl text-blue-600">{user?.username}</h1> */}
            </section>

            <section className=" p-10 rounded-2xl col-span-2">
                    <div className="flex items-center justify-between">
                    <h2 className="text-4xl">Total Repositories {projects.length}</h2>  
                    <h4 className="text-3xl text-blue-950">Total Contributions ({commitCount})</h4>
                    </div>
                    <div className='grid grid-cols-1 gap-x-6 gap-y-3 mt-4' >
                    {
                        projects?.map(repository => 
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
    );
}
 
export default ProfileViewer;