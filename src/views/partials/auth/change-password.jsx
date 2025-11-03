import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

import axios from "axios";

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
// import LoginLogo from '../../../components/partials/components/login-logo'
import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

// img
// import facebook from '../../../assets/images/brands/fb.svg'
// import google from '../../../assets/images/brands/gm.svg'
// import instagram from '../../../assets/images/brands/im.svg'
// import linkedin from '../../../assets/images/brands/li.svg'

const ChangePassword = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   //Session Variable to Check if User is Logged  
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const appShortName = useSelector(SettingSelector.app_short_name);

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

   const [validated, setValidated] = useState(false);
   const [userData, setUserData] = useState({
      prev_pass: '', new_pass: '', retype_pass: ''
   });

   //Data Fetch Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [updateMessage, setUpdateMessage] = useState(false);
   const [redirectMessage, setRedirectMessage] = useState(false);
   const [userDataError, setUserDataError] = useState([]);

   const updatePassword = (async () => {
      setLoadingData("পাসওয়ার্ড পরিবর্তন করা হচ্ছে... অপেক্ষা করুন...");
      try {
         const response = await axios.post(`${BACKEND_URL}/user/password_change?`, { userData });
         if (response.status === 200) {
            setUpdateMessage(response.data.message);
            let count_down = 5000;
            let counter = count_down / 1000;
            setTimeout(() => {
               navigate("/auth/sign-out");
               return null;
            }, count_down);

            setInterval(() => {
               setRedirectMessage(`পুনরায় লগইন করুন। লগইন পেজে নিয়ে যাওয়া হচ্ছে...(${counter})`);
               counter--;
            }, count_down / 5);
         } else {
            setLoadingError(response.data.message);
         }
      } catch (err) {

         setValidated(false);
         setLoadingError("পাসওয়ার্ড পরিবর্তন সফল হয়নি।");
         if (err.status === 401) {
            navigate("/auth/sign-out");
            
         }
      } finally {
         setLoadingData(false);
      }
   });

   //Handle Data Change
   const handleDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue });
      setUserDataError(prev => ({
         ...prev,
         [dataName]: ''
      }));
   }

   const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;
      const newErrors = {};

      //Reset Messages
      setLoadingData(false);
      setLoadingError(false);
      setUpdateMessage(false);
      setRedirectMessage(false);
      setUserDataError([]);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'prev_pass', 'new_pass', 'retype_pass'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'prev_pass':
                  if (userData[field].length === 0) {
                     dataError = "পাসওয়ার্ড পূরণ করতে হবে";
                  }
                  break;

               case 'new_pass':
               case 'retype_pass':
                  dataError = ValidationInput.passwordCheck(userData[field]);
                  break;

               default:
                  break;
            }

            if (dataError) {
               newErrors[field] = dataError;
               isValid = false;
               setValidated(false);
            }
         });

         if (userData.new_pass !== userData.retype_pass) {
            let field = 'retype_pass';
            newErrors[field] = "নতুন পাসওয়ার্ড একই হবে হবে";
            isValid = false;
            setValidated(false);
         }

         // Update once
         setUserDataError(newErrors);

         if (!isValid) {
            event.stopPropagation();
         } else {
            updatePassword();
         }
      }
      setValidated(true);
   };

   const handleReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setUserDataError([]);
      setUserData({
         prev_pass: '', new_pass: '', retype_pass: ''
      });
      setValidated(false);
      setLoadingData(false);
      setLoadingError(false);
      setUpdateMessage(false);
      setRedirectMessage(false);
   };

   if (!ceb_session) {
      return null;
   }

   return (
      <>
         <section className={styles.bgImageLogin + " login-content"}>
            <Row className="m-0 d-flex justify-content-center align-items-center">
               <Col md="6">
                  <Card className={styles.opacityCard + " mb-0 auth-card"}>
                     <Card.Header className="bg-transparent d-flex flex-column justify-content-center align-items-center">
                        <Link to="/dashboard" className="d-flex justify-content-center align-items-center mb-3">
                           <Logo color={true} />
                           <h1 className="logo-title ms-3">{appShortName}</h1>
                        </Link>
                        <h4 className="my-2 text-center text-primary">পাসওয়ার্ড পরিবর্তন</h4>
                     </Card.Header>
                     <Card.Body>
                        {loadingData && <h6 className="text-center bg-warning card-title w-100 py-1 ">{loadingData}</h6>}
                        {loadingError && <h6 className="text-center bg-danger text-white card-title w-100 py-1">{loadingError}</h6>}
                        {updateMessage && <h6 className="text-center bg-success text-white card-title w-100 py-1">{updateMessage}</h6>}
                        {redirectMessage && <h6 className="text-center text-success card-title w-100 py-1">{redirectMessage}</h6>}
                        <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                           <Row>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="user_name">নাম</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text"
                                    id="user_name"
                                    defaultValue={ceb_session.ceb_user_name}
                                    disabled
                                 />
                              </Col>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="user_id">ইউজার আইডি</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text" id="user_id"
                                    defaultValue={ceb_session.ceb_user_id}
                                    disabled
                                 />
                              </Col>
                              <Col md={12} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="prev_pass">পূর্বের পাসওয়ার্ড</Form.Label>
                                 <Form.Control
                                    type="password"
                                    id="prev_pass"
                                    value={userData.prev_pass}
                                    isInvalid={validated && !!userDataError.prev_pass}
                                    isValid={validated && userData.prev_pass && !userDataError.prev_pass}
                                    onChange={(e) => handleDataChange('prev_pass', e.target.value)}
                                 />
                                 {validated && userDataError.prev_pass && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.prev_pass}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="new_pass">নতুন পাসওয়ার্ড</Form.Label>
                                 <Form.Control
                                    type="password"
                                    id="new_pass"
                                    value={userData.new_pass}
                                    isInvalid={validated && !!userDataError.new_pass}
                                    isValid={validated && userData.new_pass && !userDataError.new_pass}
                                    onChange={(e) => handleDataChange('new_pass', e.target.value)}
                                 />
                                 {validated && userDataError.new_pass && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.new_pass}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="retype_pass">পুনরায় পাসওয়ার্ড প্রদান করুন</Form.Label>
                                 <Form.Control
                                    type="password"
                                    id="retype_pass"
                                    value={userData.retype_pass}
                                    isInvalid={validated && !!userDataError.retype_pass}
                                    isValid={validated && userData.retype_pass && !userDataError.retype_pass}
                                    onChange={(e) => handleDataChange('retype_pass', e.target.value)}
                                 />
                                 {validated && userDataError.retype_pass && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.retype_pass}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={12} className='mb-3'>
                                 <div className="d-flex justify-content-center gap-3">
                                    <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                    <Button className='flex-fill' type="submit" variant="btn btn-primary">আপডেট</Button>
                                 </div>
                              </Col>
                           </Row>
                        </Form>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </section>
      </>
   )
}

export default ChangePassword;
