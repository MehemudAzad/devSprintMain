import { useContext} from "react";
import { AuthContext } from "../../context/AuthProvider";
import RepositoryPage from './RepositoryPage';

const AddRepository = ({getProjects}) => {
    const {user} = useContext(AuthContext);
    const user_id = user?.id;

  //   const getProjects = async ()=>{
  //     const response = await fetch(`http://localhost:5003/user/project/${user?.id}`);
  //     const data = await response.json();
  //     console.log(data);
  //     setRepositories(data);
  // }   

  
    const handleSubmit = async (e) => {
      console.log("hello")
        e.preventDefault();
        //calling the form with event.target
        const form = e.target; 
        const name = form.name.value;
        const description = form.description.value;
        const category = form.price.value;
        
        try {
          const response = await fetch('http://localhost:5003/project', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              creator_id: user_id,
              name: name,
              description: description,
              category: category,
            }),
          });
    
          if (response.ok) {
            const result = await response.json();
            console.log('Course added successfully. Course ID:', result.courseId);
            // Add any additional logic or UI updates here
          } else {
            console.error('Failed to add course.');
          }
          //reset the form
          form.reset();
        } catch (error) {
          console.error('Error:', error);
          
        }
        getProjects();
      };
    
      return (
        <div className='mx-auto bg-white'>
                <form onSubmit={handleSubmit}  className='w-[600px] mt-12 mb-32 bg-indigo-50'>
                {/* <h1 className='text-4xl font-semibold text-blue-600 mb-5'>ADD NEW COURSE</h1> */}
                {/* name */}
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text text-blue-500">What is the name of this repository?</span>
                    </label>
                    <input  type="text"  name='name' placeholder="name" className="input input-bordered w-full "  required/>
                </div>
                <div className="form-control w-full ">
                    <label className="label">
                        <span className="label-text text-blue-500">What is the type of this Repository?</span>
                    </label>
                    <input type="text" name='price' placeholder="Technology/Science/" className="input input-bordered w-full "  required/>
                    </div>
                <div className="form-control">
                <label className="label">
                    <span className="label-text text-blue-500">Repository Description:</span>
                    <span className="label-text-alt"></span>
                </label> 
                <textarea className="textarea textarea-bordered h-24 " name='description' placeholder="description" required></textarea>
                </div>
                <button type="submit" class="w-full inline-block px-6 py-2 border-2 mt-5 border-blue-600 text-xl text-blue-600 font-medium leading-normal uppercase rounded hover:bg-blue-500 hover:text-white  focus:outline-none focus:ring-0 transition duration-150 ease-in-out">
                    CREATE REPOSITORY
                </button>
                </form>
            </div>
      )
}
 
export default AddRepository;

