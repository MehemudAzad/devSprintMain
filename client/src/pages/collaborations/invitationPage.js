import {useLoaderData} from 'react-router-dom';
import InvitationCard from './InvitationCard';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthProvider';

const InvitationPage = () => {
    const invitations = useLoaderData();
    const {user} = useContext(AuthContext);
    const [invites, setInvites] = useState([]);
    console.log(invitations);

    useEffect(()=>{
        setInvites(invitations);
        console.log('hello');
    }, [])

    const getInvitations = async () => {
        try {
            console.log('Fetching submissions...');
            const response = await fetch(`http://localhost:5003/project/invite/${user?.id}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Submissions:', data);
                setInvites(data);
            } else {
                throw new Error('Failed to fetch submissions');
            }
        } catch (error) {
            console.error('Error fetching submissions:', error);
        }
    };
    return ( 
        <div className='p-5'>
            <h1 className='text-3xl p-4'>({invites.length}) Invitations </h1>
            {
                invites.map(invitation =>
                    <InvitationCard key={`${invitation.user_id}-${invitation.project_id}`} invitation={invitation} getInvitations={getInvitations}></InvitationCard>
                )
            }
        </div>
     );
}
 
export default InvitationPage;