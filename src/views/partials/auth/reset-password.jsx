import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col, Form, Button, Modal } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

import Error404 from '../errors/error403'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const ResetPassword = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      if (loading) return null;

      if (!permissionData?.id) {
         navigate('/auth/sign-out', { replace: true });
      } else {
         if (!(permissionData.role === '17' || permissionData.role === '18')) {
            navigate('/errors/error403', { replace: true });
         }
      }
   }, [permissionData, loading]); // eslint-disable-next-line react-hooks/exhaustive-deps

   const appShortName = useSelector(SettingSelector.app_short_name);

   const [validated, setValidated] = useState(false);
   const [userData, setUserData] = useState({
      id_user: '', en_user: ''
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
            const response = await axiosApi.post(`/user/id/fetch`, { id_user: userData.id_user });
            if (response.status === 200) {
               setUserData((prev) => ({ ...prev, en_user: response.data.data[0].en_user }));
               setUserDataError((prev) => ({ ...prev, en_user: '' }));
               setUpdateMessage(response.data.message);
            } else {
               setUserData((prev) => ({ ...prev, en_user: '' }));
               setUserDataError((prev) => ({ ...prev, en_user: '' }));
               setLoadingError(response.data.message);
            }
         } catch (err) {
            setLoadingError(err.message);
            setUserData((prev) => ({ ...prev, en_user: '' }));
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         }
      }
      if (userData.id_user) {
         const timer = setTimeout(() => {
            fetchUserName();
         }, 1000);

         return () => clearTimeout(timer);
      }

   }, [userData.id_user]); // eslint-disable-line react-hooks/exhaustive-deps

   const resetPassword = (async () => {
      setLoadingData("ডাটা প্রসেস হচ্ছে... অপেক্ষা করুন...");
      setModalShow(false);
      try {
         const response = await axiosApi.post(`/user/password/reset`, { id_user: userData.id_user });
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
            'id_user', 'en_user'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'id_user':
                  dataError = ValidationInput.alphanumCheck(userData[field]);
                  break;

               case 'en_user':
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
         id_user: '',
         en_user: ''
      });
      setValidated(false);
      setLoadingData(false);
      setLoadingError(false);
      setUpdateMessage(false);
   };

   if (permissionData.role === "17" || permissionData.role === "18") return (
      <Fragment>
         <section className={styles.bgImageLogin + " login-content"}>
            <Row className="m-0 d-flex justify-content-center align-items-center">
               <Col md="12">
                  <Card className={styles.opacityCard + " mb-0 auth-card"}>
                     <Card.Header className="bg-transparent d-flex flex-column justify-content-center align-items-center">
                        <Link to={(permissionData.role === '17' || permissionData.role === '18') ? "/dashboard/admin" : "/dashboard/home"} className="d-flex justify-content-center align-items-center mb-3">
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
                                 <Form.Label className='text-dark text-uppercase' htmlFor="id_user">ইউজার আইডি</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text" id="id_user"
                                    value={userData.id_user}
                                    isInvalid={validated && !!userDataError.id_user}
                                    isValid={validated && userData.id_user && !userDataError.id_user}
                                    onChange={(e) => handleDataChange('id_user', e.target.value)}
                                 />
                                 {validated && userDataError.id_user && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_user}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={6} className='mb-3'>
                                 <Form.Label className='text-dark text-uppercase' htmlFor="en_user">নাম</Form.Label>
                                 <Form.Control
                                    className='text-uppercase'
                                    type="text"
                                    id="en_user"
                                    defaultValue={userData.en_user}
                                    disabled
                                    isInvalid={validated && !!userDataError.en_user}
                                    isValid={validated && userData.en_user && !userDataError.en_user}
                                 />
                                 {validated && userDataError.en_user && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.en_user}
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
               <h6 className={styles.SiyamRupaliFont + ' text-center text-uppercase py-2'}>নামঃ {userData.en_user}</h6>
               <h6 className={styles.SiyamRupaliFont + ' text-center text-uppercase py-2'}>আইডিঃ {userData.id_user}</h6>
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
      </Fragment>
   )

   return (
      <Error404 />
   )
}

export default ResetPassword;
