import { Outlet } from "react-router";
import { Header } from "../components/Header";
import { SiderBar } from "../components/SideBar";

function Layout() {
	return (
		<div>
			<Header />
			<div className="flex">
				<SiderBar />
				<Outlet />
			</div>
		</div>
	);
}

export default Layout;
