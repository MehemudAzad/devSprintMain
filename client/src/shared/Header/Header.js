import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthProvider';
// import { AuthContext } from '../../context/AuthProvider';

const Header = () => {
    const {user, setUser} = useContext(AuthContext);
    console.log(user?user:"null");

    //logout user
    const handleLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
    }
    // useEffect(() => {
    //     // Load user data from localStorage on component mount
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //       setUser(JSON.parse(storedUser));
    //     }
    //   }, []); 
    //   console.log(user);
    return ( 
        <>
        <nav class="bg-green-200 border-gray-200 dark:bg-gray-900 ">
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://flowbite.com/docs/images/logo.svg" class="h-8" alt="Flowbite Logo" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Github Clone</span>
          </Link>

          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 bg-green-200" id="navbar-user">
            <ul class="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg  md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 ">
              <li>
                  {/* {
                    user?.role === "student" ? <Link to="/student/dashboard"> Dashboard</Link>
                    :<> </>
                  }
                  {
                    user?.role === "teacher" ? <Link to="/teacher/dashboard"> Dashboard</Link>
                    :<> </>
                  } */}
              </li>
              <li>
              <Link to="/" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Home</Link>
              </li>
              <li>
                <Link to="/about" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">About</Link>
              </li>
              <li>
              <Link to="/courses" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Repositories</Link>
              </li>
              {/* <li>
                <Link to="/blogs" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Blogs</Link>
              </li> */}
              <li>
                <Link to="/auth/login" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Login</Link>
              </li>
            </ul>
          </div>
        
          </div>
        </nav>
        </>
     );
}
 
export default Header;



