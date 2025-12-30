import { createContext, useContext, useEffect, useState, useRef } from "react";
import axiosApi from "../lib/axiosApi.jsx";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const initializedRef = useRef(false);
    const [permissionData, setPermissionData] = useState(null);
    const [loading, setLoading] = useState(true);

    // const setSession = (data) => {
    //     if (!data?.id) return;
    //     localStorage.setItem(
    //         "ceb_session",
    //         JSON.stringify({
    //             ceb_user_id: data.id,
    //             ceb_board_id: data.board,
    //             ceb_user_name: data.name,
    //             ceb_user_type: data.type,
    //             ceb_user_office: data.office,
    //             ceb_user_role: data.role,
    //             ceb_user_email: data.email,
    //             ceb_user_post: data.post,
    //         })
    //     );
    // };

    const removeCookie = (name) => {
        document.cookie =
            name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    };

    const removeSession = () => {
        localStorage.removeItem("ceb_session");
        localStorage.removeItem("dashBoardData");
        sessionStorage.removeItem("ceb_session");
        sessionStorage.removeItem("dashBoardData");
    };

    const fetchPermissionData = async () => {
        try {
            const res = await axiosApi.post("/user/permission");
            if (res.status === 200) {
                setPermissionData(res.data.permissionData);
                // setSession(res.data.permissionData);
                return true;
            } else {
                return false;
            }
        } catch {
            return false;
        }
    };

    const logOut = async () => {
        try {
            await axiosApi.post(`/ceb/logout`, { ceb_user_id: permissionData ? permissionData?.id : null });
        } catch {
            // ignore network errors on logout
        } finally {
            setPermissionData(null);
            ["jwToken", "jwEntry", "jwPublic"].forEach(removeCookie);
            removeSession();
        }
    };

    const logIn = async () => {
        const isOk = await fetchPermissionData();
        if (!isOk) {
            await logOut();
        }
    };

    useEffect(() => {
        if (initializedRef.current) return;
        initializedRef.current = true;

        const initialize = async () => {
            try {
                await fetchPermissionData();
                // if (localStorage.getItem("ceb_session")) {
                //     await fetchPermissionData();
                // }
            } catch (error) {
                if (error?.isAuthError) {
                    await logOut();
                }
            } finally {
                setLoading(false);
            }
        };

        initialize();
    }, []);

    return (
        <AuthContext.Provider value={{ permissionData, setPermissionData, loading, logIn, logOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthProvider = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuthProvider must be used within an AuthProvider");
    }
    return ctx;
};
