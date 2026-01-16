import { Navigate, Outlet } from "react-router";
import { useUser } from "../hooks/auth";

const PrivateRoutes = () => {
	const { userInfo } = useUser();

	if (!userInfo) {
		return <Navigate to="/entrar" replace />;
	}

	return <Outlet />;
};

export default PrivateRoutes;
