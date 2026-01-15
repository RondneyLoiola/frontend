/** biome-ignore-all lint/style/noNonNullAssertion: createRoot */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ToastContainer } from "react-toastify";
import "./index.css";
import App from "./App.tsx";
import UserProvider from "./hooks/auth.tsx";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<UserProvider>
			<BrowserRouter>
				<App />
			</BrowserRouter>
			<ToastContainer autoClose={2000} theme="dark" />
		</UserProvider>
	</StrictMode>,
);
