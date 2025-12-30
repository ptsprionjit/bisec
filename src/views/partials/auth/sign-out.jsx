import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import { useAuthProvider } from "../../../context/AuthContext.jsx";

import axiosApi from '../../../lib/axiosApi';

const SignOut = () => {
   //Session Variable to Check if User is Logged  
   const { permissionData, loading, setPermissionData } = useAuthProvider();

   const navigate = useNavigate();

   // Function to handle user logout
   const userLogOut = async () => {
      try {
         await axiosApi.post(`/ceb/logout`, { ceb_user_id: permissionData ? permissionData?.id : null });
      } catch (error) {
         console.error("Logout failed:", error);
      } finally {
         ["jwToken", "jwEntry", "jwPublic"].forEach((name) => {
            removeCookie(name);
         });
         removeSession();
         setPermissionData(null);
      }
   };

   useEffect(() => {
      if (loading) return;

      // Call the logout function once when the component mounts
      userLogOut();

      if (!permissionData) {
         navigate("/auth/sign-in", { replace: true });
      }
   }, [permissionData, loading]);// eslint-disable-line react-hooks/exhaustive-deps

   // Reset Cookie
   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   //Reset Session Variables
   const removeSession = () => {
      window.localStorage.removeItem("ceb_session");
      window.localStorage.removeItem("dashBoardData");
      window.sessionStorage.removeItem("ceb_session");
      window.sessionStorage.removeItem("dashBoardData");
   };

   return (
      <></>
   )
}

export default SignOut
