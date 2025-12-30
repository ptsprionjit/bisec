import React, { useMemo, Fragment, useEffect, useState } from 'react'

import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const RegistrationGeneration = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(permissionData?.role === '17' || permissionData?.role === '18')) {
            navigate('/errors/error404', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState({ user_session: '', user_class: '', });
   const [searchDataError, setSearchDataError] = useState([]);

   // Search Data Status
   const [searchStatus, setSearchStatus] = useState({ loading: false, success: false, error: false });

   const handleDataChange = (field, value) => {
      setSearchData(prevData => ({ ...prevData, [field]: value }));
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;

      setSearchDataError([]);
      setSearchStatus({ loading: false, success: false, error: false })

      const newErrors = {}; // Collect errors in one place

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'user_session', 'user_class'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'user_session':
               case 'user_class':
                  dataError = ValidationInput.numberCheck(searchData[field]);
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
         setSearchDataError(newErrors);

         if (!isValid) {
            event.stopPropagation();
            setValidated(true);
         } else {
            setSearchStatus({ loading: "তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন...", success: false, error: false });
            try {
               const response = await axiosApi.post(`/student/registration/number/generate`, { user_session: searchData.user_session, user_class: searchData.user_class });
               // console.log(user_data.data.data);
               if (response.status === 200) {
                  setSearchStatus({ loading: false, success: response.data.message, error: false });
               } else {
                  setSearchStatus({ loading: false, success: false, error: response.data.message });
                  setValidated(true);
               }
            } catch (err) {
               setSearchStatus({ loading: false, success: false, error: "নিবন্ধন তথ্য পাওয়া যায়নি!" });
               setValidated(true);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
            } finally {
               setSearchStatus((prevStatus) => ({ ...prevStatus, loading: false }));
            }
         }
      }
   };

   const handleSubmitReset = (event) => {
      event.preventDefault();
      setSearchDataError([]);
      setValidated(false);
      setSearchStatus({ loading: false, success: false, error: false });
      setSearchData({ user_session: '', user_class: '', });
   };

   // Return if User is Authorized
   if (permissionData.type === '13' || permissionData.office === '05' || permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title"}>শিক্ষার্থীদের রেজিস্ট্রেশন নম্বর তৈরি</h4>
                  </Card.Body>
               </Card>
            </Col>

            <Col md={12}>
               <Form noValidate onSubmit={handleSubmit} onReset={handleSubmitReset}>
                  <Card>
                     <Card.Body>
                        <Row>
                           <Col md={12}>
                              {searchStatus.loading && <h6 className="text-uppercase text-center py-2 text-info">{searchStatus.loading}</h6>}
                              {searchStatus.error && <h6 className="text-uppercase text-center py-2 text-danger">{searchStatus.error}</h6>}
                              {searchStatus.success && <h6 className="text-uppercase text-center py-2 text-success">{searchStatus.success}</h6>}
                           </Col>
                           <Col md={6} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_session">সেশন/বছর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_session"
                                 maxLength={4} minLength={4}
                                 value={searchData.user_session}
                                 isInvalid={validated && !!searchDataError.user_session}
                                 isValid={validated && searchData.user_session && !searchDataError.user_session}
                                 onChange={(e) => handleDataChange('user_session', e.target.value)}
                              />
                              {validated && searchDataError.user_session && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_session}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={6} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>শ্রেণী</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={searchData.user_class}
                                    isInvalid={validated && !!searchDataError.user_class}
                                    isValid={validated && searchData.user_class && !searchDataError.user_class}
                                    onChange={(e) => handleDataChange('user_class', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--শ্রেণী সিলেক্ট করুন--</option>
                                    {(permissionData.office === "05" || permissionData.office === "81" || permissionData.office === "82" || permissionData.office === "83" || permissionData.office === "85" || permissionData.role === "17") && <>
                                       <option value='06'>ষষ্ট শ্রেণী</option>
                                       <option value='07'>সপ্তম শ্রেণী</option>
                                       <option value='08'>অষ্টম শ্রেণী</option>
                                    </>}
                                    {(permissionData.office === "05" || permissionData.office === "82" || permissionData.office === "83" || permissionData.office === "85" || permissionData.role === "17") && <>
                                       <option value='09'>নবম শ্রেণী</option>
                                       <option value='10'>দশম শ্রেণী</option>
                                    </>}
                                    {(permissionData.office === "04" || permissionData.type === "90" || permissionData.role === "17") && <>
                                       <option value='11'>একাদশ শ্রেণী</option>
                                       <option value='12'>দ্বাদশ শ্রেণী</option>
                                    </>}
                                 </Form.Select>
                                 {validated && searchDataError.user_class && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_class}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-success">সাবমিট</Button>
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
               </Form>
            </Col>
         </Row>
      </Fragment>
   )

   // Return if User is not Authorized
   return (
      // <Maintenance />
      <div className='d-flex flex-column justify-content-center align-items-center'>
         <h2 className='text-center text-white mb-2'>This page is under development</h2>
         <Image src={error01} alt="Under Development" />
      </div>
   )
}

export default RegistrationGeneration;