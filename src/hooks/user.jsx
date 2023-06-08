// login logout register user auth using appwrite (use context)

import { useNavigate } from 'react-router-dom';
import {client, account, storage} from '../utils/appwrite'
import { useState, useEffect, useContext, createContext } from "react";

const UserContext = createContext()

export function UserProvider({children}) {


    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();


    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await account.get()
                setUser(user)
            } catch (error) {
                setUser(null)
            }
            setLoading(false)
        }
        checkUser()
    }, [])


    const loginUser = async (email, password) => {
        try {
            await account.createEmailSession(email, password)
            const user = await account.get()
            setUser(user)
            // navigate('/')
        }
        catch (error) {
            console.log(error)
        }

    }

    const loginWithGithub = async() => {
        try {
            await account.createOAuth2Session(
              "github",
              "http://localhost:5173"
            );
            const user = await account.get()
            setUser(user)
        } catch (error) {
            console.log(error)
        }
    }


    const registerUser = async (name, email, password) =>{
        try {
            setLoading(true)
            await account.create('unique()', email, password, name);
            await loginUser(email, password)
            setLoading(false)
        } catch (error) {
            console.log(error)
        }
    }

    async function logout() {
        try {
            await account.deleteSession('current')
            setUser(null)
        } catch (error) {
            console.log(error)
        }
    }

    const value = {
      user,
      loginUser,
      loginWithGithub,
      registerUser,
      logout,
    };


    return (
        <UserContext.Provider value={value}>
            {!loading && children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)