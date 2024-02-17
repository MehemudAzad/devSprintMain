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

    return ( 
        <>
        <nav class="bg-indigo-700 text-white border-gray-200 dark:bg-gray-900 ">
          <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <Link to="/" class="flex items-center space-x-3 rtl:space-x-reverse">
              <img src="https://www.pinpng.com/pngs/m/94-945585_github-logo-png-transparent-png.png" class="h-8" alt="Flowbite Logo" />
              <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"></span>
          </Link>
          <div class="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
              <div type="button" class="flex text-sm text-whit  rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600 pl-1 pr-3" id="user-menu-button" aria-expanded="false" data-dropdown-toggle="user-dropdown" data-dropdown-placement="bottom">
        {
        user?.id ?
        <>
            <div className="dropdown dropdown-end">
            <div className='flex flex-row-reverse items-center'>
            <h3>{user?.username}</h3>
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full">
                <img src={user?.photoURL ? user.photoURL : "https://w7.pngwing.com/pngs/96/435/png-transparent-world-chess-championship-pawn-chess-piece-chess-engine-cheess-game-king-queen-thumbnail.png"}/>
                </div>
            </label>
            </div>
            <ul tabIndex={0} className="mt-3 p-2 text-black shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-10">
                <li>
                    <Link to={`/profile/${user?.id}`}>My Profile</Link>
                </li>
                <li>
                    <Link to={`/invitation/${user?.id}`}>Invites</Link>
                </li>
                <li><Link onClick={handleLogout} to='/auth/login'>Logout</Link></li>
            </ul>
            </div>
        </>
        :
        <>
            <div>
                <Link to="/auth/login" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:underline md:p-0 text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 font-bold">Login</Link>
            </div>
        </>
        }
              </div>  
          </div>
          <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1 " id="navbar-user">
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
              <Link to="/" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:underline md:p-0 text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">DashBoard</Link>
              </li>
              <li>
              <Link to="/repository" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:underline md:p-0 text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Repositories</Link>
              </li>
              {/* <li>
                <Link to="/blogs" class="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Blogs</Link>
              </li> */}
            </ul>
          </div>
        
          </div>
        </nav>
        </>
     );
}
 
export default Header;



