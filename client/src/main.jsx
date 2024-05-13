import React from 'react'
import ReactDOM from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import Index from "./pages/Index/index.jsx";
import './main.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <Index/>,
        children: [
            {
                path: '/',
                element: <h1>ПОПКА</h1>
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>,
)
