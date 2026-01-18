import { Route, Routes } from "react-router";
import Layout from "./Layout/layout";
import Categories from "./pages/Categories";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PrivateRoutes from "./routes/PrivateRoutes";

function App() {
	return (
		<Routes>
			<Route element={<PrivateRoutes />}>
				<Route element={<Layout />}>
					<Route path="/despesas" element={<Home />} />
					<Route path="/categorias" element={<Categories />} />
				</Route>
			</Route>
			<Route path="/entrar" element={<Login />} />
			<Route path="/cadastro" element={<Register />} />
		</Routes>
	);
}

export default App;
