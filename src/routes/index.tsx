import { createBrowserRouter } from "react-router";
import Habits from "../pages/Habits";
import Login from "../pages/Login";

const router = createBrowserRouter([
    {
        path: '/',
        element: <Habits />
    },
    {
        path: '/entrar',
        element: <Login />
    }
])

export default router