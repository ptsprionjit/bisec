import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

const DateEntryNew = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   const [accountCodes, setAccountCodes] = useState([]);
   const [uniqueEcoCode, setUniqueEcoCode] = useState([]);
   const [uniqueNewCode, setUniqueNewCode] = useState([]);
   const [uniqueOnlineCode, setUniqueOnlineCode] = useState([]);
   const [optionOnlineCode, setOptionOnlineCode] = useState([]);

   // Search Data Variables
   const [userData, setUserData] = useState({
      eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', dt_start: '', dt_end: '', pay_start: '', pay_end: '', dob_start: '', dob_end: '', print_start: '', print_end: ''
   });
   const [userDataError, setUserDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);

   // Search Data Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [loadingSuccess, setLoadingSuccess] = useState(false);

   const handleSearchSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;

      setUserDataError([]);
      setLoadingSuccess(false);
      setLoadingError(false);

      const newErrors = {}; // Collect errors in one place
      // console.log(userData);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'eco_code', 'new_code', 'online_code', 'user_session', 'user_class', 'user_group', 'user_version', 'user_application'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'eco_code':
               case 'new_code':
               case 'online_code':
               case 'user_session':
               case 'user_class':
               case 'user_group':
               case 'user_version':
               case 'user_application':
                  dataError = ValidationInput.numberCheck(userData[field]);
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

         // console.log(newErrors);

         if (!isValid) {
            event.stopPropagation();
            setValidated(true);
         } else {
            setLoadingData("তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন...");
            try {
               const response = await axios.post(`${BACKEND_URL}/entry/date/search`, { userData });
               if (response.status === 200) {
                  // console.log(userData);
                  setLoadingSuccess(response.data.message);
                  await setUserData({ ...userData, ...response.data.dateData });
                  setValidSearch(true);
                  setValidated(false);
               } else {
                  setLoadingSuccess(`${response.data.message}`);
                  setValidSearch(true);
                  setValidated(true);
               }
            } catch (err) {

               setLoadingError(err.response.data.message);
               setValidSearch(false);
               setValidated(true);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  
               } else if (err.status === 403) {
                  // navigate("/registration/new-app");
                  navigate("/auth/sign-out");
                  return null;
               }
            } finally {
               setLoadingData(false);
            }
         }
      }
   };

   const handleUpdateSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;

      setUserDataError([]);
      setLoadingError(false);

      const newErrors = {}; // Collect errors in one place
      // console.log(userData);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
         setLoadingError('তথ্য সঠিকভাবে পূরণ করতে হবে');
      } else {
         const requiredFields = [
            'dt_start', 'dt_end', 'pay_start', 'pay_end', 'dob_start', 'dob_end', 'print_start', 'print_end'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'dt_start':
               case 'dt_end':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     userData.dt_start,
                     userData.dt_end
                  );
                  break;
               case 'pay_start':
               case 'pay_end':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     userData.pay_start,
                     userData.pay_end
                  );
                  break;
               case 'dob_start':
               case 'dob_end':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     userData.dob_start,
                     userData.dob_end
                  );
                  break;
               case 'print_start':
               case 'print_end':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     userData.print_start,
                     userData.print_end
                  );
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

         // console.log(newErrors);

         if (!isValid) {
            event.stopPropagation();
            setValidated(true);
         } else {
            setLoadingData("তথ্য আপডেট করা হচ্ছে! অপেক্ষা করুন...");
            try {
               const response = await axios.post(`${BACKEND_URL}/entry/date/update`, { userData });
               if (response.status === 200) {
                  setLoadingSuccess(response.data.message);
                  setValidated(false);
               } else {
                  setLoadingError(`${response.data.message}`);
                  setValidated(true);
               }
            } catch (err) {

               setLoadingError(err.response.data.message);
               setValidated(true);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  
               } else if (err.status === 403) {
                  // navigate("/registration/new-app");
                  navigate("/auth/sign-out");
                  return null;
               }
            } finally {
               setLoadingData(false);
            }
         }
      }
   };

   //Handle Search Data Change
   const handleSearchDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue });
      setUserDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   const handleSearchReset = (event) => {
      event.preventDefault();
      setUserDataError([]);
      setValidated(false);

      setLoadingSuccess(false);
      setLoadingError(false);
      setLoadingData(false);

      setValidSearch(false);

      setUniqueNewCode([]);
      setUniqueOnlineCode([]);
      setOptionOnlineCode([]);

      setUserData({
         eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', dt_start: '', dt_end: '', pay_start: '', pay_end: '', dob_start: '', dob_end: '', print_start: '', print_end: '', id_status: '13', id_update_status: '14'
      });
   };

   const handleUpdateReset = (event) => {
      event.preventDefault();
      setUserDataError([]);
      setLoadingError(false);
      setUserDataError([]);
      setValidated(false);
      setUserData({
         ...userData, dt_start: '', dt_end: '', pay_start: '', pay_end: '', dob_start: '', dob_end: '', print_start: '', print_end: ''
      });
   };

   //Fetch Account Code List
   useEffect(() => {
      const fetchAccountCodes = async () => {
         setLoadingData("Loading Account Codes...");
         try {
            const response = await axios.post(`${BACKEND_URL}/account/account-codes`);
            setAccountCodes(response.data);
            setUniqueEcoCode([...new Map(response.data.map(item => [item.income_code_economic, item])).values()]);
         } catch (err) {
            setLoadingError("Loading Account Codes Failed!");
            // console.error(err);
            if (err.status === 401) {
               navigate("/auth/sign-out");
               
            }
         } finally {
            setLoadingData(false);
         }
      }
      const timer = setTimeout(() => {
         fetchAccountCodes();
      }, 10);

      return () => clearTimeout(timer);
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   // Set Options For Online Code
   useEffect(() => {
      if (uniqueOnlineCode.length > 0) {
         const newOptions = uniqueOnlineCode.map(onlineCode => ({
            value: onlineCode.income_code_online,
            // label: `${onlineCode.income_code_online} - ${onlineCode.income_code_details}`
            label: `${onlineCode.income_code_details}`
         }));
         setOptionOnlineCode(newOptions);
      }
   }, [uniqueOnlineCode]);

   //Hancle Change of Economic Code
   const handleEchoCodeChange = async (codeValue) => {
      handleSearchDataChange('eco_code', codeValue);
      setUniqueNewCode([...new Map(accountCodes.filter(item => item.income_code_economic === codeValue).map(item => [item.income_code_new, item])).values()]);
      setUniqueOnlineCode([]);
      setOptionOnlineCode([]);
   }

   //Hancle Change of Economic Code
   const handleNewCodeChange = async (codeValue) => {
      handleSearchDataChange('new_code', codeValue);
      setUniqueOnlineCode([...new Map(accountCodes.filter(item => item.income_code_new === codeValue && item.income_code_economic === userData.eco_code).map(item => [item.income_code_online, item])).values()]);
      setOptionOnlineCode([]);
   }

   //Hancle Change of Economic Code
   const handleOnlineCodeChange = (codeValue) => {
      handleSearchDataChange('online_code', codeValue);
   }

   // Return if no session
   if (!ceb_session) {
      return null;
   }

   // Return if Search is Valid
   if (validSearch && (ceb_session.ceb_user_type !== '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>আবেদনের তারিখ এন্ট্রি ফর্ম</h4>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={12}>
               <Form noValidate onSubmit={handleUpdateSubmit} onReset={handleUpdateReset}>
                  <Card>
                     <Card.Body>
                        <Row>
                           <Col md={4}>
                              <Form.Label htmlFor="eco_code" className="text-primary">অর্থনৈতিক কোড</Form.Label>
                              <Form.Select
                                 id="eco_code"
                                 value={userData.eco_code}
                                 disabled={true}
                              >
                                 {uniqueEcoCode.map((eCode, index) => (
                                    <option key={index} value={eCode.income_code_economic}>
                                       {eCode.income_code_economic}
                                    </option>
                                 ))}
                              </Form.Select>
                           </Col>
                           <Col md={4}>
                              <Form.Label htmlFor="new_code" className="text-primary">নতুন কোড</Form.Label>
                              <Form.Select
                                 id="new_code"
                                 value={userData.new_code}
                                 disabled={true}
                              >
                                 {uniqueNewCode.map((eCode, index) => (
                                    <option key={index} value={eCode.income_code_new}>
                                       {eCode.income_code_new + "-" + eCode.income_code_sector}
                                    </option>
                                 ))}
                              </Form.Select>
                           </Col>
                           <Col md={4}>
                              <Form.Label className="text-primary" htmlFor="online_code">সেবার নাম</Form.Label>
                              <Select
                                 inputId="online_code"
                                 value={
                                    optionOnlineCode.find(opt => opt.value === userData.online_code) || null
                                 }
                                 options={optionOnlineCode}
                                 isClearable={false}
                                 isSearchable={false}
                                 isDisabled={true}
                              />
                           </Col>
                           <Col md={4}>
                              <Form.Label className="text-primary" htmlFor="user_eiin">অনলাইন কোড</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 value={userData.online_code}
                                 disabled={true}
                              />
                           </Col>
                           <Col md={4}>
                              <Form.Label className="text-primary" htmlFor="user_session">সেশন/বছর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_session"
                                 value={userData.user_session}
                                 disabled={true}
                              />
                           </Col>
                           <Col md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>শ্রেণী</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={userData.user_class}
                                    disabled={true}
                                 >
                                    {(ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='06'>ষষ্ট শ্রেণী</option>
                                       <option value='07'>সপ্তম শ্রেণী</option>
                                       <option value='08'>অষ্টম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='09'>নবম শ্রেণী</option>
                                       <option value='10'>দশম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='14'>মাধ্যমিক</option>
                                    </>}
                                    {(ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='11'>একাদশ শ্রেণী</option>
                                       <option value='12'>দ্বাদশ শ্রেণী</option>
                                       <option value='15'>উচ্চ মাধ্যমিক</option>
                                    </>}
                                    <option value='99'>সকল (All) শ্রেণী</option>
                                 </Form.Select>
                              </Form.Group>
                           </Col>
                           <Col md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_group'>বিভাগ</Form.Label>
                                 <Form.Select
                                    id="user_group"
                                    value={userData.user_group}
                                    disabled={true}
                                 >
                                    {(userData.user_class < 13 && userData.user_class > 8) && <>
                                       <option value='01'>বিজ্ঞান বিভাগ</option>
                                       <option value='02'>মানবিক বিভাগ</option>
                                       <option value='03'>ব্যবসায় শিক্ষা বিভাগ</option>
                                    </>}
                                    {(userData.user_class < 9 && userData.user_class > 5) &&
                                       <option value='10'>সাধারণ বিভাগ</option>}
                                    {((userData.user_class < 16 && userData.user_class > 12) || userData.user_class === '99') && <>
                                       <option value='99'>সকল (All) বিভাগ</option>
                                    </>}
                                 </Form.Select>
                              </Form.Group>
                           </Col>
                           <Col md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_version'>মাধ্যম</Form.Label>
                                 <Form.Select
                                    id="user_version"
                                    value={userData.user_version}
                                    disabled={true}
                                 >
                                    <option value='01'>বাংলা মাধ্যম</option>
                                    <option value='02'>ইংরেজি মাধ্যম</option>
                                    <option value='03'>বাংলা ও ইংরেজি (Both) মাধ্যম</option>
                                 </Form.Select>
                              </Form.Group>
                           </Col>
                           <Col md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_application'>আবেদনের ধরণ</Form.Label>
                                 <Form.Select
                                    id="user_application"
                                    value={userData.user_application}
                                    disabled={true}
                                 >
                                    <option value='01'>নিয়মিত (Regular) আবেদন</option>
                                    <option value='02'>বিলম্ব (Late) আবেদন</option>
                                    <option value='03'>বিশেষ (Special) আবেদন</option>
                                 </Form.Select>
                              </Form.Group>
                           </Col>
                           {userData.id_status !== '17' && <Col md={12} className='mt-4'>
                              <Form.Label className="text-primary text-center w-100">
                                 {loadingData && <h6 className="text-uppercase text-center py-2 text-info">{loadingData}</h6>}
                                 {loadingError && <h6 className="text-uppercase text-center py-2 text-danger">{loadingError}</h6>}
                                 {loadingSuccess && <h6 className="text-uppercase text-center py-2 text-success">{loadingSuccess}</h6>}
                                 <h6 className="text-uppercase text-center py-2 text-warning">(কোন তারিখ প্রযোজ্য না হলে সেখানে আজকের তারিখ দিন)</h6>
                              </Form.Label>
                           </Col>}
                           {userData.id_status === '17' && <Col md={12} className='mt-4'>
                              <Form.Label className="text-primary text-center w-100">
                                 <h6 className="text-uppercase text-center py-2 text-success">আবেদনের অনুমোদিত তারিখ</h6>
                              </Form.Label>
                           </Col>}
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="dt_start">আবেদন শুরু</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="dt_start"
                                 value={userData.dt_start}
                                 isInvalid={validated && !!userDataError.dt_start}
                                 isValid={validated && userData.dt_start && !userDataError.dt_start}
                                 onChange={(e) => handleSearchDataChange('dt_start', e.target.value)}
                              />
                              {validated && userDataError.dt_start && (
                                 <Form.Control.Feedback type="invalid">
                                    আবেদন শুরু তারিখ {userDataError.dt_start}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="dt_end">আবেদন শেষ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="dt_end"
                                 value={userData.dt_end}
                                 isInvalid={validated && !!userDataError.dt_end}
                                 isValid={validated && userData.dt_end && !userDataError.dt_end}
                                 onChange={(e) => handleSearchDataChange('dt_end', e.target.value)}
                              />
                              {validated && userDataError.dt_end && (
                                 <Form.Control.Feedback type="invalid">
                                    আবেদন শেষ তারিখ {userDataError.dt_end}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="dob_start">জন্মতারিখ শুরু</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="dob_start"
                                 value={userData.dob_start}
                                 isInvalid={validated && !!userDataError.dob_start}
                                 isValid={validated && userData.dob_start && !userDataError.dob_start}
                                 onChange={(e) => handleSearchDataChange('dob_start', e.target.value)}
                              />
                              {validated && userDataError.dob_start && (
                                 <Form.Control.Feedback type="invalid">
                                    জন্মতারিখ শুরু {userDataError.dob_start}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="dob_end">জন্মতারিখ শেষ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="dob_end"
                                 value={userData.dob_end}
                                 isInvalid={validated && !!userDataError.dob_end}
                                 isValid={validated && userData.dob_end && !userDataError.dob_end}
                                 onChange={(e) => handleSearchDataChange('dob_end', e.target.value)}
                              />
                              {validated && userDataError.dob_end && (
                                 <Form.Control.Feedback type="invalid">
                                    জন্মতারিখ শেষ {userDataError.dob_end}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="pay_start">পেমেন্ট শুরু</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="pay_start"
                                 value={userData.pay_start}
                                 isInvalid={validated && !!userDataError.pay_start}
                                 isValid={validated && userData.pay_start && !userDataError.pay_start}
                                 onChange={(e) => handleSearchDataChange('pay_start', e.target.value)}
                              />
                              {validated && userDataError.pay_start && (
                                 <Form.Control.Feedback type="invalid">
                                    পেমেন্ট শুরু তারিখ {userDataError.pay_start}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="pay_end">পেমেন্ট শেষ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="pay_end"
                                 value={userData.pay_end}
                                 isInvalid={validated && !!userDataError.pay_end}
                                 isValid={validated && userData.pay_end && !userDataError.pay_end}
                                 onChange={(e) => handleSearchDataChange('pay_end', e.target.value)}
                              />
                              {validated && userDataError.pay_end && (
                                 <Form.Control.Feedback type="invalid">
                                    পেমেন্ট শেষ তারিখ {userDataError.pay_end}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="print_start">প্রিন্ট শুরু</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="print_start"
                                 value={userData.print_start}
                                 isInvalid={validated && !!userDataError.print_start}
                                 isValid={validated && userData.print_start && !userDataError.print_start}
                                 onChange={(e) => handleSearchDataChange('print_start', e.target.value)}
                              />
                              {validated && userDataError.print_start && (
                                 <Form.Control.Feedback type="invalid">
                                    প্রিন্ট শুরু তারিখ {userDataError.print_start}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="print_end">প্রিন্ট শেষ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="print_end"
                                 value={userData.print_end}
                                 isInvalid={validated && !!userDataError.print_end}
                                 isValid={validated && userData.print_end && !userDataError.print_end}
                                 onChange={(e) => handleSearchDataChange('print_end', e.target.value)}
                              />
                              {validated && userDataError.print_end && (
                                 <Form.Control.Feedback type="invalid">
                                    প্রিন্ট শেষ তারিখ {userDataError.print_end}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                              {userData.id_status !== '17' && <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>}
                              <Button className='flex-fill' onClick={handleSearchReset} variant="btn btn-outline-primary">ফিরে যান</Button>
                              {userData.id_status !== '17' && <Button className='flex-fill' type="submit" variant="btn btn-success">সাবমিট</Button>}
                              {userData.id_status === '17' && <Button className='flex-fill' onClick={() => alert('আবেদনের তারিখ অনুমোদন করা হয়েছে!')} variant="btn btn-success">অনুমোদিত</Button>}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
               </Form>
            </Col>
         </Row>
      </Fragment>
   )

   // Return if User is Authorized
   if (ceb_session.ceb_user_type !== '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>আবেদনের তারিখ এন্ট্রি ফর্ম</h4>
                     <h6 className={styles.SiyamRupaliFont + " text-center text-warning w-100"}>(কোন ফিল্ড প্রযোজ্য না হলে সব (All) সিলেক্ট করুন)</h6>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={12}>
               <Form noValidate onSubmit={handleSearchSubmit} onReset={handleSearchReset}>
                  <Card>
                     {/* <Card.Header>
                        <h5 className="text-center w-100 card-title">নিবন্ধনের তথ্য</h5>
                     </Card.Header> */}
                     <Card.Body>
                        <Row>
                           <Col md={12}>
                              {loadingData && <h6 className="text-uppercase text-center py-2 text-info">{loadingData}</h6>}
                              {loadingError && <h6 className="text-uppercase text-center py-2 text-danger">{loadingError}</h6>}
                              {loadingSuccess && <h6 className="text-uppercase text-center py-2 text-success">{loadingSuccess}</h6>}
                           </Col>
                           <Col md={4} className='py-2'>
                              <Form.Label htmlFor="eco_code" className="text-primary">অর্থনৈতিক কোড</Form.Label>
                              <Form.Select
                                 id="eco_code"
                                 value={userData.eco_code}
                                 onChange={(e) => handleEchoCodeChange(e.target.value)}
                                 isInvalid={validated && !!userDataError.eco_code}
                                 isValid={validated && userData.eco_code && !userDataError.eco_code}
                                 disabled={!uniqueEcoCode?.length}
                              >
                                 <option value="">-- অর্থনৈতিক কোড সিলেক্ট করুন --</option>
                                 {uniqueEcoCode.map((eCode, index) => (
                                    <option key={index} value={eCode.income_code_economic}>
                                       {eCode.income_code_economic}
                                    </option>

                                 ))}
                              </Form.Select>
                              {validated && userDataError.eco_code && (
                                 <Form.Control.Feedback type="invalid">
                                    অর্থনৈতিক কোড {userDataError.eco_code}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='py-2'>
                              <Form.Label htmlFor="new_code" className="text-primary">নতুন কোড</Form.Label>
                              <Form.Select
                                 id="new_code"
                                 value={userData.new_code}
                                 onChange={(e) => handleNewCodeChange(e.target.value)}
                                 isInvalid={validated && !!userDataError.new_code}
                                 isValid={validated && userData.new_code && !userDataError.new_code}
                                 disabled={!uniqueNewCode?.length}
                              >
                                 <option value="">-- নতুন অর্থনৈতিক কোড সিলেক্ট করুন --</option>
                                 {uniqueNewCode.map((eCode, index) => (
                                    <option key={index} value={eCode.income_code_new}>
                                       {eCode.income_code_new + "-" + eCode.income_code_sector}
                                    </option>
                                 ))}
                              </Form.Select>
                              {validated && userDataError.new_code && (
                                 <Form.Control.Feedback type="invalid">
                                    নতুন কোড {userDataError.new_code}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='py-2'>
                              <Form.Label className="text-primary" htmlFor="online_code">সেবার নাম</Form.Label>
                              <Select
                                 inputId="online_code"
                                 placeholder="-- সেবার নাম সিলেক্ট করুন --"
                                 value={
                                    optionOnlineCode.find(opt => opt.value === userData.online_code) || null
                                 }
                                 onChange={(e) => e ? handleOnlineCodeChange(e.value) : handleOnlineCodeChange('')}
                                 options={optionOnlineCode}
                                 isClearable={true}
                                 isSearchable={true}
                              />
                              {validated && userDataError.online_code && (
                                 <small className='text-danger'>সেবার নাম {userDataError.online_code}</small>
                              )}
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_eiin">অনলাইন কোড</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 value={userData.online_code}

                                 isInvalid={validated && !!userDataError.online_code}
                                 isValid={validated && userData.online_code && !userDataError.online_code}
                                 disabled={true}
                              />
                              {validated && userDataError.online_code && (
                                 <Form.Control.Feedback type="invalid">
                                    অনলাইন কোড {userDataError.online_code}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_session">সেশন/বছর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_session"
                                 maxLength={4} minLength={4}
                                 value={userData.user_session}
                                 isInvalid={validated && !!userDataError.user_session}
                                 isValid={validated && userData.user_session && !userDataError.user_session}
                                 onChange={(e) => handleSearchDataChange('user_session', e.target.value)}
                              />
                              {validated && userDataError.user_session && (
                                 <Form.Control.Feedback type="invalid">
                                    সেশন/বছর {userDataError.user_session}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>শ্রেণী</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={userData.user_class}
                                    isInvalid={validated && !!userDataError.user_class}
                                    isValid={validated && userData.user_class && !userDataError.user_class}
                                    onChange={(e) => handleSearchDataChange('user_class', e.target.value)}
                                 >
                                    <option value="">--শ্রেণী সিলেক্ট করুন--</option>
                                    {(ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='06'>ষষ্ট শ্রেণী</option>
                                       <option value='07'>সপ্তম শ্রেণী</option>
                                       <option value='08'>অষ্টম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='09'>নবম শ্রেণী</option>
                                       <option value='10'>দশম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='14'>মাধ্যমিক</option>
                                    </>}
                                    {(ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='11'>একাদশ শ্রেণী</option>
                                       <option value='12'>দ্বাদশ শ্রেণী</option>
                                       <option value='15'>উচ্চ মাধ্যমিক</option>
                                    </>}
                                    <option value='99'>সকল (All) শ্রেণী</option>
                                 </Form.Select>
                                 {validated && userDataError.user_class && (
                                    <Form.Control.Feedback type="invalid">
                                       শ্রেণী {userDataError.user_class}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_group'>বিভাগ</Form.Label>
                                 <Form.Select
                                    id="user_group"
                                    value={userData.user_group}
                                    isInvalid={validated && !!userDataError.user_group}
                                    isValid={validated && userData.user_group && !userDataError.user_group}
                                    onChange={(e) => handleSearchDataChange('user_group', e.target.value)}
                                 >
                                    <option value="">--বিভাগ সিলেক্ট করুন--</option>
                                    {(userData.user_class < 13 && userData.user_class > 8) && <>
                                       <option value='01'>বিজ্ঞান বিভাগ</option>
                                       <option value='02'>মানবিক বিভাগ</option>
                                       <option value='03'>ব্যবসায় শিক্ষা বিভাগ</option>
                                    </>}
                                    {(userData.user_class < 9 && userData.user_class > 5) &&
                                       <option value='10'>সাধারণ বিভাগ</option>}
                                    {((userData.user_class < 16 && userData.user_class > 12) || userData.user_class === '99') && <>
                                       <option value='99'>সকল (All) বিভাগ</option>
                                    </>}
                                 </Form.Select>
                                 {validated && userDataError.user_group && (
                                    <Form.Control.Feedback type="invalid">
                                       বিভাগ {userDataError.user_group}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_version'>মাধ্যম</Form.Label>
                                 <Form.Select
                                    id="user_version"
                                    value={userData.user_version}
                                    isInvalid={validated && !!userDataError.user_version}
                                    isValid={validated && userData.user_version && !userDataError.user_version}
                                    onChange={(e) => handleSearchDataChange('user_version', e.target.value)}
                                 >
                                    <option value="">--সিলেক্ট মাধ্যম--</option>
                                    <option value='01'>বাংলা মাধ্যম</option>
                                    <option value='02'>ইংরেজি মাধ্যম</option>
                                    <option value='03'>বাংলা ও ইংরেজি (Both) মাধ্যম</option>
                                 </Form.Select>
                                 {validated && userDataError.user_version && (
                                    <Form.Control.Feedback type="invalid">
                                       মাধ্যম {userDataError.user_version}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_application'>আবেদনের ধরণ</Form.Label>
                                 <Form.Select
                                    id="user_application"
                                    value={userData.user_application}
                                    isInvalid={validated && !!userDataError.user_application}
                                    isValid={validated && userData.user_application && !userDataError.user_application}
                                    onChange={(e) => handleSearchDataChange('user_application', e.target.value)}
                                 >
                                    <option value="">--ধরণ সিলেক্ট করুন--</option>
                                    <option value='01'>নিয়মিত (Regular) আবেদন</option>
                                    <option value='02'>বিলম্ব (Late) আবেদন</option>
                                    <option value='03'>বিশেষ (Special) আবেদন</option>
                                 </Form.Select>
                                 {validated && userDataError.user_application && (
                                    <Form.Control.Feedback type="invalid">
                                       আবেদনের ধরণ {userDataError.user_application}
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

export default DateEntryNew;