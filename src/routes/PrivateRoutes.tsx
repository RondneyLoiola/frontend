import { Navigate, Outlet } from "react-router";
import { useUser } from "../hooks/auth";

const PrivateRoutes = () => {
	const { userInfo, loading } = useUser();

	if (loading) {
		return <div>Carregando...</div>;
	}

	if (!userInfo || !userInfo.token) {
		return <Navigate to="/entrar" replace />;
	}

	return <Outlet />;
};

export default PrivateRoutes;