import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Modal } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

import axios from "axios";

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

import Error404 from '../errors/error404'

// import error01 from '../../../assets/images/error/01.png'

const ResetPassword = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   //Session Variable to Check if User is Logged  
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
      } else {
         if (!(ceb_session.ceb_user_role === '17' || ceb_session.ceb_user_role === '18')) {
            navigate("/auth/sign-out");
         }
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const appShortName = useSelector(SettingSelector.app_short_name);

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

   const [validated, setValidated] = useState(false);
   const [userData, setUserData] = useState({
      user_id: '', user_name: ''
   });

   //Data Fetch Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [updateMessage, setUpdateMessage] = useState(false);
   const [userDataError, setUserDataError] = useState([]);

   // Variables for Modal
   const [modalShow, setModalShow] = useState(false);

   useEffect(() => {
      const fetchUserName = async () => {
         setLoadingError(false);
         setUpdateMessage(false);
         setLoadingData(false);
         try {
            const response = await axios.post(`${BACKEND_URL}/auth/user-fetch`, { user_id: userData.user_id });
            if (response.status === 200) {
               setUserData({ ...userData, user_name: response.data.data[0].en_user });
               setUserDataError({ ...userDataError, user_name: '' });
               setUpdateMessage(response.data.message);
            } else {
               setUserData({ ...userData, user_name: '' });
               setUserDataError({ ...userDataError, user_name: '' });
               setLoadingError(response.data.message);
            }
         } catch (err) {
            setLoadingError(err.message);
            setUserData({ ...userData, user_name: '' });
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         }
      }
      if (userData.user_id) {
         const timer = setTimeout(() => {
            fetchUserName();
         }, 1000);

         return () => clearTimeout(timer);
      }

   }, [userData.user_id]); // eslint-disable-line react-hooks/exhaustive-deps

   const resetPassword = (async () => {
      setLoadingData("ডাটা প্রসেস হচ্ছে... অপেক্ষা করুন...");
      setModalShow(false);
      try {
         const response = await axios.post(`${BACKEND_URL}/user/password/reset`, { user_id: userData.user_id });
         if (response.status === 200) {
            setUpdateMessage(response.data.message);
         } else {
            setLoadingError(response.data.message);
            setValidated(false);
         }
      } catch (err) {
         setValidated(false);
         setLoadingError(err.message);
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
      setUserDataError([]);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'user_id', 'user_name'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'user_id':
                  dataError = ValidationInput.alphanumCheck(userData[field]);
                  break;

               case 'user_name':
                  dataError = ValidationInput.alphaCheck(userData[field]);
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

         // Update once
         setUserDataError(newErrors);

         if (!isValid) {
            event.stopPropagation();
         } else {
            // resetPassword();
            setModalShow(true);
            // event.stopPropagation();
         }
      }
      setValidated(true);
   };

   const handleReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setUserDataError([]);
      setUserData({
         user_id: '',
         user_name: ''
      });
      setValidated(false);
      setLoadingData(false);
      setLoadingError(false);
      setUpdateMessage(false);
   };

   if (!ceb_session?.ceb_user_id) {
      return null;
   }

   if (ceb_session.ceb_user_role === "17" || ceb_session.ceb_user_role === "18") return (
      <>
         <section className={styles.bgImageLogin + " login-content"}>
            <Row className="m-0 d-flex justify-content-center align-items-center">
               <Col md="12">
                  <Card className={styles.opacityCard + " mb-0 auth-card"}>
                     <Card.Header className="bg-transparent d-flex flex-column justify-content-center align-items-center">
                        <Link to="/dashboard" className="d-flex justify-content-center align-items-center mb-3">
                           <Logo color={true} />
                           <h1 className="logo-title ms-3">{appShortName}</h1>
                        </Link>
                        <h4 className="my-2 text-center text-primary">পাসওয়ার্ড রিসেট করুন</h4>
                     </Card.Header>
                     <Card.Body>
                        {loadingData && <h6 className="text-center bg-warning card-title w-100 py-1 ">{loadingData}</h6>}
                        {loadingError && <h6 className="text-center bg-danger text-white card-title w-100 py-1">{loadingError}</h6>}
                        {updateMessage && <h6 className="text-center bg-success text-white card-title w-100 py-1">{updateMessage}</h6>}
                        <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                           <Row>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="user_id">ইউজার আইডি</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text" id="user_id"
                                    value={userData.user_id}
                                    isInvalid={validated && !!userDataError.user_id}
                                    isValid={validated && userData.user_id && !userDataError.user_id}
                                    onChange={(e) => handleDataChange('user_id', e.target.value)}
                                 />
                                 {validated && userDataError.user_id && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.user_id}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="user_name">নাম</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text"
                                    id="user_name"
                                    defaultValue={userData.user_name}
                                    disabled
                                    isInvalid={validated && !!userDataError.user_name}
                                    isValid={validated && userData.user_name && !userDataError.user_name}
                                 />
                                 {validated && userDataError.user_name && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.user_name}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={12} className='d-flex justify-content-center'>
                                 <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                              </Col>
                           </Row>
                        </Form>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </section>
         <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            backdrop="static"
            keyboard={false}
         >
            <Modal.Header closeButton>
               <Modal.Title><span className={styles.SiyamRupaliFont}>আপনি কি পাসওয়ার্ড পরিবর্তন করতে চান?</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               <h6 className={styles.SiyamRupaliFont + ' text-center text-uppercase py-2'}>নামঃ {userData.user_name}</h6>
               <h6 className={styles.SiyamRupaliFont + ' text-center text-uppercase py-2'}>আইডিঃ {userData.user_id}</h6>
            </Modal.Body>
            <Modal.Footer>
               <Button className={styles.SiyamRupaliFont} variant="success" onClick={() => resetPassword()}>
                  সম্মত
               </Button>
               <Button className={styles.SiyamRupaliFont} variant="secondary" onClick={() => setModalShow(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>
      </>
   )

   return (
      <Error404 />
   )
}

export default ResetPassword;
