import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Repository from "../pages/repositories/Repository";
import Home from "../pages/home/Home";
import ErrorPage from "../pages/ErrorPage";
import LoginLayout from "../layout/LoginLayout";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";



export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Main></Main>,
        children:[
            {
                path:'/',
                element:<Repository></Repository>
            },
       
            {
                path: '/about',
                element:<Home></Home>
            },

        ]
    },
    {//layout for login and authentication
        path:'/auth',
        element:<LoginLayout></LoginLayout>,
        children:[
            {
                path:'/auth/login',
                element:<Login></Login>
            },
            {
                path:'/auth/register',
                element:<Register></Register>
            },
            // {
            //     path:'/teacherlogin',
            //     element:<TeacherLogin></TeacherLogin>
            // }
        ]
    },
    // {//layout for lessons page and lecture display
    //     path: '/lessons/:id',
    //     element: <LessonsLayout></LessonsLayout>,
    //     loader:({params})=> fetch(`http://localhost:5002/lectures/${params.id}`),
    //     children: [
    //         {
    //             path: '/lessons/:id',
    //             element: <LessonPage></LessonPage>,
    //             // loader:({params})=> fetch(`http://localhost:5002/lecture/${params.id}`)
    //         },
    //         {
    //             path: '/lessons/:id/lecture/:lecture_id',
    //             element: <LecturesPage></LecturesPage>,
    //             loader:({params})=> fetch(`http://localhost:5002/lecture/${params.lecture_id}`)
    //         }
    //     ]
    // },
    {
        path:'*',
        element:<ErrorPage></ErrorPage>
    }
])