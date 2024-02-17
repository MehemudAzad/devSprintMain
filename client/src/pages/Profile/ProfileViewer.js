import { useLoaderData } from "react-router-dom";

const ProfileViewer = () => {
    const userInfo = useLoaderData();
    console.log(userInfo);
    
    return ( 
        <>
            this is viweing this persons profile 
            {userInfo.username}
        </>
    );
}
 
export default ProfileViewer;