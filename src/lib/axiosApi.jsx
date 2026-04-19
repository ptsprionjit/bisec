import axios from "axios";

/**
 * --------------------------------------------
 * Device Helpers and Client Information
 * --------------------------------------------
 */
import { getClientInfo, getDeviceId } from "../handlers/clientInformation";
/**
 * --------------------------------------------
 * Axios Instance
 * --------------------------------------------
 */
const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
    // timeout: 60000, // 60 seconds timeout
});

/**
 * --------------------------------------------
 * Request ID Generator
 * --------------------------------------------
 */
const generateRequestId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

/**
 * --------------------------------------------
 * Request Interceptor
 * --------------------------------------------
 */
axiosApi.interceptors.request.use((config) => {
    config.headers = config.headers || {};

    config.headers["x-request-id"] = generateRequestId();
    config.headers["x-device-id"] = getDeviceId();
    config.headers["x-client-info"] = JSON.stringify(getClientInfo());

    return config;
});

/**
 * --------------------------------------------
 * Response Interceptor
 * --------------------------------------------
 */
axiosApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const { status } = error.response;

        // 🔴 Unauthorized Access Attempt → // Just Tag the Error
        if (status === 401) {
            error.isAuthError = true;
            return Promise.reject(error);
        }

        // 📡 Network Error → No Response Object
        if (!error.response) {
            if (!originalRequest?.__retryNetwork) {
                originalRequest.__retryNetwork = true;
                return axiosApi(originalRequest);
            }
            return Promise.reject(error);
        }

        // 🟡 Other Errors → Retry Once
        if (status >= 500 && status < 600 && !originalRequest?._retryServer) {
            originalRequest._retryServer = true;
            return axiosApi(originalRequest);
        }

        // 🔴 All Other Errors → Reject
        return Promise.reject(error);
    }
);

export default axiosApi;
