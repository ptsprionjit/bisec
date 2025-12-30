import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

// import axios from "axios";
// import axios from '../../../lib/axiosApi'

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'

import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";
import { FadeLoader } from "react-spinners";

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from '../../../lib/axiosApi'

const SignIn = () => {
   const { permissionData, setPermissionData, loading } = useAuthProvider();

   // const loading = true;

   //Password Show Hide Toggle
   const [passwordShow, setPasswordShow] = useState(false);

   const navigate = useNavigate();

   const appShortName = useSelector(SettingSelector.app_short_name);

   // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const [validated, setValidated] = useState(false);

   //Status
   const [loginStatus, setLoginStatus] = useState({ loading: false, success: false, error: false });

   //User Values
   const [userData, setUserData] = useState({ userName: "", userPassward: "" });

   useEffect(() => {
      if (loading) {
         return;
      }

      if (permissionData) {
         permissionData?.type === '13' ? navigate("/home", { replace: true }) : navigate("/dashboard", { replace: true });
      }
   }, [permissionData, loading]);// eslint-disable-line react-hooks/exhaustive-deps

   // Set Session and Redirect on Login Success
   const setSession = async (myData) => {
      const ceb_session = JSON.stringify({
         ceb_user_id: myData.id,
         ceb_board_id: myData.board,
         ceb_user_name: myData.name,
         ceb_user_type: myData.type,
         ceb_user_office: myData.office,
         ceb_user_role: myData.role,
         ceb_user_email: myData.email,
         ceb_user_post: myData.post,
      });

      window.localStorage.setItem("ceb_session", ceb_session);
      // await setPermissionData(myData);
   }

   // User Login API Call
   const userLogin = (async () => {
      setLoginStatus({ loading: "লগইন হচ্ছে...অপেক্ষা করুন...", success: false, error: false });
      try {
         const response = await axiosApi.post(`/ceb/login`, { userData });
         if (response.status === 200) {
            // await setSession(response.data.userData);
            await setPermissionData(response.data.userData);
         } else {
            response?.data?.message ? setLoginStatus({ loading: false, success: false, error: response.data.message }) : "আইডি/পাসওয়ার্ড সঠিক নয় অথবা আইডি সচল নয়!";
         }
      } catch (error) {
         setValidated(false);
         error?.response?.data?.message ? setLoginStatus({ loading: false, success: false, error: error.response.data.message }) : "আইডি/পাসওয়ার্ড সঠিক নয় অথবা আইডি সচল নয়!";
      } finally {
         setLoginStatus((prev) => ({ ...prev, loading: false }));
      }
   });

   // Form Submit Handler
   const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      setLoginStatus({ loading: false, success: false, error: false });

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         userLogin();
      }
      setValidated(true);
   };

   // Reset Warnings
   const handleReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
      setLoginStatus({ loading: false, success: false, error: false });
   };

   //Password Show Hide Toggle Handler
   const handlePasswordToggle = (e) => {
      e.preventDefault();

      const passwordField = document.getElementById("user_pass");

      if (passwordShow) {
         passwordField.type = "password";
      } else {
         passwordField.type = "text";
      }

      setPasswordShow(!passwordShow);
   }

   if (loading) {
      return (
         <Fragment>
            <Row data-aos="fade-up" data-aos-delay="100" className='m-0 p-0'>
               <Col md={12} style={{ width: '95vw', height: '95vh' }} className="d-flex justify-content-center align-items-center">
                  <FadeLoader
                     color="#000000"
                     loading={true}
                     radius={15}
                     width={5}
                     height={20}
                  />
               </Col>
            </Row>
         </Fragment>
      );
   }

   return (
      <Fragment>
         <Row className={styles.bgImageLogin + " m-0 p-0 d-flex justify-content-center align-items-center"}>
            <Col md={5}>
               <Card className={styles.opacityCard}>
                  <Card.Header className="bg-transparent d-flex flex-column justify-content-center align-items-center">
                     <Link className="d-flex justify-content-center align-items-center mb-3 p-0" to="/">
                        <Logo color={true} className="bg-transparent" />
                        <h1 className="logo-title ms-3 text-secondary">{appShortName}</h1>
                     </Link>
                  </Card.Header>
                  <Card.Body>
                     <h4 className="mt-2 py-2 text-center">লগইন করতে ইউজার আইডি/পাসওয়ার্ড প্রদান করুন</h4>
                     <p className="mb-2 py-2 rounded bg-danger text-white text-center"><i><small>তিন (০৩) বার ভুল পাসওয়ার্ড প্রদান করলে আইডি লক হয়ে যাবে</small></i></p>
                     {loginStatus?.error && <h6 className="py-2 text-center text-danger">{loginStatus.error}</h6>}
                     {loginStatus?.loading && <h6 className="py-2 text-center text-primary">{loginStatus.loading}</h6>}
                     {loginStatus?.success && <h6 className="py-2 text-center text-success">{loginStatus.success}</h6>}
                     <Form noValidate validated={validated} onSubmit={handleSubmit} onReset={handleReset}>
                        <Row>
                           <Col md="12" className='my-2'>
                              <Form.Label htmlFor="user_id">ইউজার আইডি</Form.Label>
                              <Form.Control className='bg-transparent text-dark' type="text" id="user_id" value={userData.userName} required onChange={(e) => setUserData({ ...userData, userName: e.target.value })} />
                              {/* <Form.Control.Feedback>
                                    Looks Good!
                                 </Form.Control.Feedback> */}
                              <Form.Control.Feedback type="invalid">
                                 ইউজার আইডি প্রদান করুন
                              </Form.Control.Feedback>
                           </Col>
                           <Col md="12" className='my-2 position-relative'>
                              <Form.Label htmlFor="user_pass">পাসওয়ার্ড</Form.Label>
                              <Form.Control className='bg-transparent text-dark' type="password" id="user_pass" value={userData.userPassward} required onChange={(e) => setUserData({ ...userData, userPassward: e.target.value })} />
                              {/* <Form.Control.Feedback>
                                          Looks Good!
                                       </Form.Control.Feedback> */}
                              <Form.Control.Feedback type="invalid">
                                 পাসওয়ার্ড প্রদান করুন
                              </Form.Control.Feedback>
                              {passwordShow && <Button variant="link" title='Hide Password' className='position-absolute top-50 end-0 m-0 p-0 pe-4 text-dark' onClick={(e) => handlePasswordToggle(e)}>
                                 <FaRegEyeSlash size={"24px"} />
                              </Button>}
                              {!passwordShow && <Button variant="link" title='Show Password' className='position-absolute top-50 end-0 m-0 p-0 pe-4 text-dark' onClick={(e) => handlePasswordToggle(e)}>
                                 <FaRegEye size={"24px"} />
                              </Button>}
                           </Col>
                           {/* <Col lg="12" className="d-flex justify-content-between py-4">
                                 <Form.Check className="form-check">
                                    <Form.Check.Input type="checkbox" id="user_cookie" value={userRemember} onChange={(e) => setUserRemember(e.target.value)} />
                                    <Form.Check.Label htmlFor="user_cookie">Remember Me</Form.Check.Label>
                                 </Form.Check>
                                 <Link to="/auth/recoverpw">Forgot Password?</Link>
                              </Col> */}
                        </Row>
                        <Row>
                           <Col md={12} className="d-flex justify-content-center my-3 gap-3">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">লগইন</Button>
                           </Col>
                        </Row>
                        {/* <Row>
                              <Col md={12} className="my-4 text-center">
                                 কোন একাইন্ট নেই? <Link to="/auth/sign-up" className="text-underline">রেজিস্ট্রেশন করতে এখানে ক্লিক করুন</Link>
                              </Col>
                           </Row> */}
                     </Form>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )
}

export default SignIn
