const Collaborator = ({collaborator}) => {
    const {id, username } = collaborator;
    return ( 
        <>
            <section className="mb-2 border bg-neutral-100 p-4 rounded-lg max-w-full bg-neutral-100">
            <div className="mx-auto">
                <div className="card md:flex max-w-lg">
                    <div className="w-20 h-20 mx-auto mb-6 md:mr-6 flex-shrink-0">
                        <img className="object-cover rounded-full" src="https://tailwindflex.com/public/images/user.png"/>
                    </div>
                    <div className="flex-grow text-center md:text-left">
                        <p className="font-bold">Senior Developer</p>
                        <h3 className="text-xl heading">{username}</h3>
                        <p className="mt-2 mb-3">John is a Senior Developer, mainly works in backend technologies.</p>
                    </div>
                </div>
            </div>
        </section>
        </>
    );
}
 
export default Collaborator;