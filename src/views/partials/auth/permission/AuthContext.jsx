import { createContext, useState, useEffect } from "react";
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    axios.defaults.withCredentials = true;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const [permissionData, setPermissionData] = useState(null);

    // SET USER SESSION
    const setSession = (permissionData) => {
        const ceb_session = JSON.stringify({
            ceb_user_id: permissionData.id,
            ceb_board_id: permissionData.board,
            ceb_user_name: permissionData.name,
            ceb_user_type: permissionData.type,
            ceb_user_office: permissionData.office,
            ceb_user_role: permissionData.role,
            ceb_user_email: permissionData.email,
            ceb_user_post: permissionData.post,
        });
        window.localStorage.setItem("ceb_session", ceb_session);
    }

    // FECTH PERMISSION DATA FROM BACKEND
    const fetchPermissionData = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/user/permission`);
            if (response.status === 200) {
                setPermissionData(response.data.permissionData);
                setSession(response.data.permissionData);
            } else {
                logOut();
            }
        } catch (error) {
            logOut();
        }
    }

    // EXECUTE FETCH DATA ON MOUNT
    useEffect(() => {
        fetchPermissionData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // LOGIN
    const logIn = () => {
        try {
            fetchPermissionData();
        } catch (error) {
            logOut();
        }
    }

    // LOGOUT
    const logOut = () => {
        setPermissionData(null);
        window.localStorage.removeItem("ceb_session");
    }

    // RETURN
    return (
        <AuthContext.Provider value={{ permissionData, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};
