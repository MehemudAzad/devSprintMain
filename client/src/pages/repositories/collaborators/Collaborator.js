import { Link } from "react-router-dom";

const Collaborator = ({collaborator}) => {
    const {id, username } = collaborator;
    return ( 
        <>
            <section className="mb-2 border p-4 rounded-lg max-w-full bg-indigo-50">
            <div className="mx-auto">
                <div className="card md:flex max-w-lg">
                    <div className="w-20 h-20 mx-auto mb-6 md:mr-6 flex-shrink-0">
                    <img className="w-[80px] h-[80px] rounded-full mb-2" src="https://images.unsplash.com/photo-1474447976065-67d23accb1e3?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" alt="" />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <p className="font-bold">Senior Developer</p>
                        <Link to={`/view/profile/${id}`}><h3 className="text-xl heading hover:underline text-blue-600">{username}</h3></Link>
                        <p className="mt-2 mb-3">{username} is a Senior Developer, mainly works in backend technologies.</p>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
 
export default Collaborator;