import { useLoaderData } from "react-router-dom";

const ProfileViewer = () => {
    const userInfo = useLoaderData();
    console.log(userInfo.user);
    const user = userInfo?.user;
    const projects = userInfo?.projects;
    return ( 
        <div className="p-5">
            this is viweing this persons profile 
            <h1 className="text-3xl ">{user?.username}</h1>
        </div>
    );
}
 
export default ProfileViewer;