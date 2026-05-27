import { createContext, useContext, useEffect, useState } from "react";
import { initialState, type ActivityEntry, type Credentials, type User } from "../types";
import { useNavigate } from "react-router-dom";
import mockApi from "../assets/mockApi";

const AppContext = createContext(initialState)

export const AppProvider = ({children}: {children: React.ReactNode})=>{

    const navigate = useNavigate();
    const [user, setUser] = useState<User>(null);
    const [isUserFetched, setIsUserFetched] = useState(false);
    const [onboardingCompleted, setOnboardingCompleted] = useState(false);
    const [allActivityLogs, setAllActivityLogs] = useState<ActivityEntry[]>([]);

    const signup = async(credentials: Credentials) =>{
        const {data} = await mockApi.auth.register(credentials)
        setUser(data.user)
        if(data?.user.age && data?.user?.weight && data?.user?.goal){
            setOnboardingCompleted(true)
        }
        localStorage.setItem("token", data.jwt)
    }

    const login = async(credentials: Credentials) =>{
        const {data} = await mockApi.auth.login(credentials)
        setUser({...data.user, token: data.jwt})
        if(data?.user.age && data?.user?.weight && data?.user?.goal){
            setOnboardingCompleted(true)
        }
        localStorage.setItem("token", data.jwt)
    }

    const logout = () =>{
        localStorage.removeItem('token');
        setUser(null);
        setOnboardingCompleted(false);
        navigate('/ ')
    }

    const fetchUser = async(token: string) =>{
        const {data} = await mockApi.user.me()
        setUser({...data, token})
        if(data?.age && data?.weight && data?.goal){
            setOnboardingCompleted(true)
        }
        setIsUserFetched(true)
    }

    const fetchActivityLogs = async () =>{
        const {data} = await mockApi.activityLogs.list()
        setAllActivityLogs(data)
    }

    useEffect(()=>{
        const token = localStorage.getItem('token')
        if(token){
            (async ()=>{
                await fetchUser(token)
                await fetchActivityLogs()
            })()
        } else {
            setIsUserFetched(true)
        }
    }, [])

    const value = {
        user, setUser, isUserFetched, fetchUser, signup, login, logout, onboardingCompleted, setOnboardingCompleted, allActivityLogs, setAllActivityLogs
    }
    return <AppContext.Provider value={value}>
        {children}
    </AppContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => useContext(AppContext)