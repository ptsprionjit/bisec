import React, { useEffect } from 'react'

import { useNavigate } from 'react-router-dom';

import axios from "axios";

const SignOut = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   //Session Variable to Check if User is Logged  
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const URL = import.meta.env.VITE_BACKEND_URL;

   const navigate = useNavigate();

   // Reset Cookie
   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   //Reset Session Variables
   const removeSession = () => {
      window.localStorage.removeItem("ceb_session");
      window.localStorage.removeItem("dash_data");
      window.sessionStorage.removeItem("ceb_session");
      window.sessionStorage.removeItem("dash_data");
   };

   useEffect(() => {
      removeCookie("jwToken");
      removeCookie("jwEntry");
      removeCookie("jwPublic");
      removeSession();

      // Function to handle user logout
      const userLogOut = () => {
         try {
            // Call the logout endpoint
            axios.post(`${URL}/ceb/logout`, { ceb_user_id: ceb_session?.ceb_user_id });
         } catch (err) {
            // Navigate to the sign-in page after the logout process
            navigate("/auth/sign-in");
         } finally {
            // Navigate to the sign-in page after the logout process
            navigate("/auth/sign-in");
         }
      };

      // Call the logout function once when the component mounts
      userLogOut();

   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   return (
      <>

      </>
   )
}

export default SignOut
