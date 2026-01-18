import { createContext, useContext, useEffect, useState } from "react";

export type UserData = {
	id: string;
	name: string;
	token: string;
	user: {
		name: string;
        email: string;
	};
};

interface UserProviderProps {
	children: React.ReactNode;
}

type UserContextType = {
	userInfo: UserData | null;
	loading: boolean;
	putUserData: (userInfo: UserData) => void;
	logout: () => void;
};

export const userLocalStorageKey = `${import.meta.env.VITE_LOCALSTORAGE_KEY}:userData`;

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: UserProviderProps) => {
	const [userInfo, setUserInfo] = useState<UserData | null>(null);

	const [loading, setLoading] = useState(true);

	const putUserData = (userInfo: UserData) => {
		setUserInfo(userInfo);
		localStorage.setItem(userLocalStorageKey, JSON.stringify(userInfo));
	};

	const logout = () => {
		setUserInfo(null);
		localStorage.removeItem(userLocalStorageKey);
	};

	useEffect(() => {
		const userInfoLocalStorage = localStorage.getItem(userLocalStorageKey);

		if (userInfoLocalStorage) {
			setUserInfo(JSON.parse(userInfoLocalStorage));
		}

		setLoading(false);
	}, []);

	return (
		<UserContext.Provider value={{ userInfo, loading, putUserData, logout }}>
			{children}
		</UserContext.Provider>
	);
};

export function useUser() {
	const context = useContext(UserContext);

	if (!context) {
		throw new Error("useUser deve ser usado dentro de um UserProvider");
	}

	return context;
}

export default UserProvider;
