import SignOut from '../views/partials/auth/sign-out.jsx';

let logoutHandler = null;
let isLoggingOut = false;

export const registerLogout = (fn) => {
    logoutHandler = fn;
};

export const authLogout = () => {
    if (isLoggingOut) return;
    isLoggingOut = true;
    logoutHandler?.();
    console.log("Auth logout triggered.");
    return <SignOut />;
};
