import {useLoaderData} from 'react-router-dom';
import InvitationCard from './InvitationCard';

const InvitationPage = () => {
    const invitations = useLoaderData();
    console.log(invitations);



    return ( 
        <>
            ({invitations.length}) Invitations 
            {
                invitations.map(invitation =>
                    <InvitationCard key={`${invitation.user_id}-${invitation.project_id}`} invitation={invitation}></InvitationCard>
                )
            }
        </>
     );
}
 
export default InvitationPage;