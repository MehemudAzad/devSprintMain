import {useLoaderData} from 'react-router-dom';
import InvitationCard from './InvitationCard';

const InvitationPage = () => {
    const invitations = useLoaderData();
    console.log(invitations);



    return ( 
        <div className='p-5'>
            <h1 className='text-3xl p-4'>({invitations.length}) Invitations </h1>
            {
                invitations.map(invitation =>
                    <InvitationCard key={`${invitation.user_id}-${invitation.project_id}`} invitation={invitation}></InvitationCard>
                )
            }
        </div>
     );
}
 
export default InvitationPage;