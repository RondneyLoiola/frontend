import { Route, Routes } from "react-router";
import Layout from "./Layout/layout";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
	return (
		<Routes>
			<Route element={<Layout />}>
				<Route path="/despesas" element={<Home />} />
				<Route path="/entrar" element={<Login />} />
				<Route path="/cadastro" element={<Register />} />
			</Route>
		</Routes>
	);
}

export default App;
