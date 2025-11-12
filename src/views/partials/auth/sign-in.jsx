import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

import axios from "axios";

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'

import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

const SignIn = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   //Session Variable to Check if User is Logged  
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (ceb_session?.ceb_user_id) {
         if (ceb_session?.ceb_user_type !== '13') {
            navigate("/dashboard");
         } else {
            navigate("/home");
         }
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const appShortName = useSelector(SettingSelector.app_short_name);

   const URL = import.meta.env.VITE_BACKEND_URL;
   const [validated, setValidated] = useState(false);

   const [userName, setUserName] = useState("");
   const [userPassward, setUserPassword] = useState("");
   // const [userRemember, setUserRemember] = useState(false);

   //Status
   const [loginSuccess, setLoginSuccess] = useState(false);
   const [loginLoading, setLoginLoading] = useState(false);
   const [loginError, setLoginError] = useState(false);

   //User Values
   const [userData, setUserData] = useState([]);

   useEffect(() => {
      const setSession = () => {
         if (loginSuccess) {
            const ceb_session = JSON.stringify({
               ceb_user_id: userName,
               ceb_board_id: userData.id_board,
               ceb_user_name: userData.name,
               ceb_user_type: userData.type,
               ceb_user_office: userData.office,
               ceb_user_role: userData.role,
               ceb_user_email: userData.email,
               ceb_user_post: userData.post,
            });

            window.localStorage.setItem("ceb_session", ceb_session);

            if (window.localStorage.getItem("ceb_session")) {
               userData?.type === '13' ? navigate("/home") : navigate("/dashboard");
            }
         }
      }
      setSession();
   }, [loginSuccess]);// eslint-disable-line react-hooks/exhaustive-deps

   const userLogin = (async () => {
      setLoginLoading("লোডিং...অপেক্ষা করুন...");
      try {
         const response = await axios.post(`${URL}/ceb/login`, { userName, userPassward });
         if (response.status === 200) {
            setUserData(response.data.userData);
            setLoginSuccess(true);
         } else {
            setLoginError(response.data.message);
            alert(`আইডি/পাসওয়ার্ড সঠিক নয় অথবা আইডি সচল নয়!`);
         }
      } catch (err) {
         if (err.status === 401) {
            navigate("/auth/sign-out");
         }
         setValidated(false);
         setLoginError(err.message);
      } finally {
         setLoginLoading(false);
      }
   });

   const handleSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();

      setLoginSuccess(false);
      setLoginError(false);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         userLogin();
      }
      setValidated(true);
   };

   const resetWarnings = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setValidated(false);
      setLoginLoading(false);
      setLoginError(false);
      setLoginSuccess(false);
   };

   if (!ceb_session?.ceb_user_id) return (
      <Fragment>
         <section className={styles.bgImageLogin + " login-content"}>
            <Row className="m-0 d-flex justify-content-center align-items-center">
               <Col md="12">
                  <Card className={styles.opacityCard + " mb-0 auth-card"}>
                     <Card.Header className="bg-transparent d-flex flex-column justify-content-center align-items-center">
                        <div className="d-flex justify-content-center align-items-center mb-3">
                           <Logo color={true} />
                           <h1 className="logo-title ms-3">{appShortName}</h1>
                        </div>
                     </Card.Header>
                     <Card.Body>
                        <h4 className="mt-2 py-2 text-center">লগইন করতে ইউজার আইডি/পাসওয়ার্ড প্রদান করুন</h4>
                        <p className="mb-2 py-2 rounded bg-danger text-white text-center"><i><small>তিন (০৩) বার ভুল পাসওয়ার্ড প্রদান করলে আইডি লক হয়ে যাবে</small></i></p>
                        {loginError && <h6 className="py-2 text-center text-danger">{loginError}</h6>}
                        {loginLoading && <h6 className="py-2 text-center text-success">{loginLoading}</h6>}
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onReset={resetWarnings}>
                           <Row>
                              <Col md="12" className='my-2'>
                                 <Form.Label htmlFor="user_id">ইউজার আইডি</Form.Label>
                                 <Form.Control className='bg-transparent' type="text" id="user_id" value={userName} required onChange={(e) => setUserName(e.target.value)} />
                                 {/* <Form.Control.Feedback>
                                    Looks Good!
                                 </Form.Control.Feedback> */}
                                 <Form.Control.Feedback type="invalid">
                                    ইউজার আইডি প্রদান করুন
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="12" className='my-2'>
                                 <Form.Label htmlFor="user_pass">পাসওয়ার্ড</Form.Label>
                                 <Form.Control className='bg-transparent' type="password" id="user_pass" value={userPassward} required onChange={(e) => setUserPassword(e.target.value)} />
                                 {/* <Form.Control.Feedback>
                                          Looks Good!
                                       </Form.Control.Feedback> */}
                                 <Form.Control.Feedback type="invalid">
                                    পাসওয়ার্ড প্রদান করুন
                                 </Form.Control.Feedback>
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
                           <Row>
                              <Col md={12} className="my-4 text-center">
                                 কোন একাইন্ট নেই? <Link to="/auth/sign-up" className="text-underline">রেজিস্ট্রেশন করতে এখানে ক্লিক করুন</Link>
                              </Col>
                           </Row>
                        </Form>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </section>
      </Fragment>
   )

   return (
      <>
      </>
   )
}

export default SignIn
