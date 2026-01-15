import { createContext, useContext, useEffect, useState } from "react";

export type UserData = {
    id: string;
    name: string;
    token: string;
}

interface UserProviderProps {
    children: React.ReactNode
}

//Tipo completo do contexto incluindo as funções
type UserContextType = {
    userInfo: UserData;
    putUserData: (userInfo: UserData) => void;
    logout: () => void;
}

export const userLocalStorageKey = `${import.meta.env.VITE_LOCALSTORAGE_KEY}:userData`

//Context com valor inicial undefined para detectar uso incorreto
const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({children}: UserProviderProps) => {
    const [userInfo, setUserInfo] = useState({} as UserData);

    const putUserData = (userInfo: UserData) => {
        setUserInfo(userInfo);
        localStorage.setItem(userLocalStorageKey, JSON.stringify(userInfo));
    }

    const logout = () => {
        setUserInfo({} as UserData);
        localStorage.removeItem(userLocalStorageKey);
    }

    useEffect(() => {
        // Use a constante em vez de hardcoded
        const userInfoLocalStorage = localStorage.getItem(userLocalStorageKey);

        if(userInfoLocalStorage){
            setUserInfo(JSON.parse(userInfoLocalStorage));
        }
    }, [])

    return (
        <UserContext.Provider value={{userInfo, putUserData, logout}}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext);

    if(!context) {
        throw new Error('useUser deve ser usado dentro de um UserProvider');  
    }

    return context
}

export default UserProvider