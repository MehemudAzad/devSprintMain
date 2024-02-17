import { createBrowserRouter } from "react-router-dom";
import Main from "../layout/Main";
import Repository from "../pages/repositories/RepositoryPage";
import Home from "../pages/home/Home";
import ErrorPage from "../pages/ErrorPage";
import LoginLayout from "../layout/LoginLayout";
import Login from "../pages/authentication/Login";
import Register from "../pages/authentication/Register";
import RepositoryPage from "../pages/repositories/RepositoryPage";
import SingleRepository from "../pages/repositories/SingleRepository";
import Profile from "../pages/Profile/Profile";
import ProfileViewer from "../pages/Profile/ProfileViewer";
import InvitationPage from "../pages/collaborations/invitationPage";
import HomePage from "../pages/home/HomePage";
import CodeEditor from "../components/codeEditor/CodeEditor";
import Canvas from "../components/canvas/Canvas";
// import InvitationModal from "../pages/collaborations/invitationModal";
// import InvitationPage from "../pages/collaborations/InvitationPage";



export const routes = createBrowserRouter([
    {
        path:'/',
        element:<Main></Main>,
        children:[
            {
                path:'/repository',
                element:<RepositoryPage></RepositoryPage>
            },
       
            {
                path: '/',
                element:<HomePage></HomePage>
            },
            {
                path: `/repository/:repoId`,
                element: <SingleRepository></SingleRepository>,
                loader:({params})=> fetch(`http://localhost:5003/project/${params.repoId}`)
            },
            {
                path: `/profile/:user_id`,
                element: <Profile></Profile>,
                loader:({params})=> fetch(`http://localhost:5003/user/${params.user_id}`)
            },
            {
                path: `/view/profile/:user_id`,
                element: <ProfileViewer></ProfileViewer>,
                loader:({params})=> fetch(`http://localhost:5003/user/${params.user_id}`)
            },
            {
                path: `/invitation/:user_id`,
                element: <InvitationPage></InvitationPage>,
                loader:({params})=> fetch(`http://localhost:5003/project/invite/${params.user_id}`)
            }

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
            {
                path:'/auth/editor',
                element:<CodeEditor></CodeEditor>
            },
            {
                path:'/auth/whiteboard',
                element:<Canvas></Canvas>
            }
      
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