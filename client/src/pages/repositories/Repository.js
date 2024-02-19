import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthProvider";
import { useContext } from "react";

const Repository = ({repository}) => {
    const {id, name, cateogry, description, creator_id} = repository;
    console.log(repository);
    const {user} = useContext(AuthContext);
    const {id: user_id} = user;
    return (
            <div className="bg-white my-2 shadow-inner p-5 border-t-4 border-indigo-500">
                <div className="flex items-center">
                <Link to={`/repository/${repository?.id}`}> <p className="text-2xl text-blue-600 hover:underline">{name}</p>  </Link>
                    <p className="bg-base-300 px-2 ml-4 mr-4 rounded-2xl">public</p>
                    {
                        creator_id === user_id ? 
                        <> <p className="bg-base-300 p-1 px-2 rounded-2xl">created by you</p>
                        </> : <><p className="bg-base-300 p-1 px-2 rounded-2xl">Forked from {repository?.creator_name}</p>
                        </>
                     }
                </div>
                <p>{description}</p>
            </div>
     );
}
 
export default Repository;