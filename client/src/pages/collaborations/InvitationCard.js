import { useContext } from "react";
import { AuthContext } from "../../context/AuthProvider";

const InvitationCard = ({invitation}) => {
    const {user} = useContext(AuthContext);
    const {name, username : creator_name, project_id} = invitation;
    const {id} = user;

    const acceptInvitation = async (user_id)=>{
        console.log('inside invite functino ' , user_id);
        try{
            fetch('http://localhost:5003/project/invite/accept', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id : id, project_id : project_id})
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


    const rejectInvitation = async ()=>{
        try{
            fetch('http://localhost:5003/project/invite/deny', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({user_id : id, project_id : project_id})
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

    return ( 
        <>  
            <div className="bg-base-200 p-4 w-[80%] my-3">
                <div className="flex items-center gap-5">
                    <h2 className="text-2xl text-blue-600 hover:underline">{name}</h2>
                    <p className="bg-base-300 p-1 px-2 rounded-md">Created by {creator_name}</p>
                </div>
                <button className="my-2 mr-4 btn btn-primary" onClick={acceptInvitation}>ACCEPT</button>
                <button className="btn btn-primary" onClick={rejectInvitation}>DENY</button>
            </div>
        </>
     );
}
 
export default InvitationCard;