import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Index from "./pages/Index/index.jsx";
import Registration from "./pages/Registration/registration.jsx";
import Login from "./pages/Login/login.jsx";
import './main.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index/>,
        children: [
            {
                path: 'registration/',
                element: <Registration/>
            },
            {
                path: 'login/',
                element: <Login/>
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
