import axios from "axios";
// import { authLogout } from "../auth/AuthEvents.jsx";

const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

//Session Data
// const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Network error → no response object
        if (!error.response) {
            // retry ONCE
            if (!error.config._retry) {
                error.config._retry = true;
                return axiosApi(error.config);
            }
            return Promise.reject(error);
        }

        const { status } = error.response;
        const originalRequest = error.config;

        // 🔴 AUTH FAILURE → LOGOUT, NO RETRY
        // if (status === 401) {
        //     axiosApi.post("/ceb/logout", { ceb_user_id: ceb_session ? ceb_session?.ceb_user_id : null }).finally(() => {
        //         authLogout(); // clear store, cookies, localStorage, redirect
        //         return Promise.reject(error);
        //     });
        // }

        // 🟠 SERVER ERROR → // Just tag the error
        if (status === 401) {
            error.isAuthError = true;
            return Promise.reject(error);
        }

        // 🟡 Other errors → retry once
        if (!originalRequest._retry) {
            originalRequest._retry = true;
            return axiosApi(originalRequest);
        }

        return Promise.reject(error);
    });

export default axiosApi;
