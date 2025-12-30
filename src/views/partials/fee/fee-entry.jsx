import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'
import error403 from '../../../assets/images/error/403.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const FeeEntryNew = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!((permissionData?.office === '06' && (permissionData?.role === '13' || permissionData?.role === '14')) || permissionData?.role === '17' || permissionData?.role === '18')) {
            navigate('/errors/error404', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   const [accountCodes, setAccountCodes] = useState([]);
   const [uniqueEcoCode, setUniqueEcoCode] = useState([]);
   const [uniqueNewCode, setUniqueNewCode] = useState([]);
   const [uniqueOnlineCode, setUniqueOnlineCode] = useState([]);
   const [optionOnlineCode, setOptionOnlineCode] = useState([]);

   // Search Data Variables
   const [userData, setUserData] = useState({
      eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', fee_reg: '', fee_exam: '', fee_prac: '', fee_cert: '', fee_trns: '', fee_cent: '', fee_irre: '', fee_impv: '', fee_renw: '', fee_educ: '', fee_bncc: '', fee_rdcr: '', fee_scut: '', fee_grlg: '', fee_sprt: '', fee_pval: '', fee_pvcq: '', fee_late: '', fee_spcl: '', fee_othr: ''
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
               const response = await axiosApi.post(`/entry/fee/search`, { userData });
               if (response.status === 200) {
                  // console.log(response.data.feeData);
                  setLoadingSuccess(response.data.message);
                  setUserData({ ...userData, ...response.data.feeData });
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
      } else {
         const requiredFields = [
            'fee_reg', 'fee_exam', 'fee_prac', 'fee_cert', 'fee_trns', 'fee_cent', 'fee_irre', 'fee_impv', 'fee_renw', 'fee_educ', 'fee_bncc', 'fee_rdcr', 'fee_scut', 'fee_grlg', 'fee_sprt', 'fee_pval', 'fee_pvcq', 'fee_late', 'fee_spcl', 'fee_othr'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'fee_reg':
               case 'fee_exam':
               case 'fee_prac':
               case 'fee_cert':
               case 'fee_trns':
               case 'fee_cent':
               case 'fee_irre':
               case 'fee_impv':
               case 'fee_renw':
               case 'fee_educ':
               case 'fee_bncc':
               case 'fee_rdcr':
               case 'fee_scut':
               case 'fee_grlg':
               case 'fee_sprt':
               case 'fee_pval':
               case 'fee_pvcq':
               case 'fee_late':
               case 'fee_spcl':
               case 'fee_othr':
                  dataError = ValidationInput.decimalCheck(userData[field]);
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
               const response = await axiosApi.post(`/entry/fee/update`, { userData });
               if (response.status === 200) {
                  setLoadingSuccess(response.data.message);
                  alert(response.data.message);
                  setValidated(false);
               } else {
                  setLoadingError(`${response.data.message}`);
                  alert(response.data.message);
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
         eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', fee_reg: '', fee_exam: '', fee_prac: '', fee_cert: '', fee_trns: '', fee_cent: '', fee_irre: '', fee_impv: '', fee_renw: '', fee_educ: '', fee_bncc: '', fee_rdcr: '', fee_scut: '', fee_grlg: '', fee_sprt: '', fee_pval: '', fee_pvcq: '', fee_late: '', fee_spcl: '', fee_othr: ''
      });
   };

   const handleUpdateReset = (event) => {
      event.preventDefault();
      setUserDataError([]);
      setLoadingError(false);
      setUserDataError([]);
      setValidated(false);
      setUserData({
         ...userData, fee_reg: '', fee_exam: '', fee_prac: '', fee_cert: '', fee_trns: '', fee_cent: '', fee_irre: '', fee_impv: '', fee_renw: '', fee_educ: '', fee_bncc: '', fee_rdcr: '', fee_scut: '', fee_grlg: '', fee_sprt: '', fee_pval: '', fee_pvcq: '', fee_late: '', fee_spcl: '', fee_othr: ''
      });
   };

   //Fetch Account Code List
   useEffect(() => {
      const fetchAccountCodes = async () => {
         setLoadingData("Loading Account Codes...");
         try {
            const response = await axiosApi.post(`/account/account-codes`);
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

   if (!(permissionData.office === '03' || permissionData.office === '06')) {
      return (
         <div className='d-flex justify-content-center align-items-center'>
            <Image src={error403} style={{ mixBlendMode: "multiply" }} alt="Forbidden" />
         </div>
      )
   }

   // Return if Search is Valid
   if (validSearch && (permissionData.type !== '13' || permissionData.office === '05' || permissionData.role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>আবেদনের ফি এন্ট্রি ফর্ম</h4>
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
                                    {(permissionData.office === "05" || permissionData.role === "17") && <>
                                       <option value='06'>ষষ্ট শ্রেণী</option>
                                       <option value='07'>সপ্তম শ্রেণী</option>
                                       <option value='08'>অষ্টম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='09'>নবম শ্রেণী</option>
                                       <option value='10'>দশম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='14'>মাধ্যমিক</option>
                                    </>}
                                    {(permissionData.office === "04" || permissionData.role === "17") && <>
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
                                 <h6 className="text-uppercase text-center py-2 text-warning">(কোন ফি প্রযোজ্য না হলে সেখানে ০ (শূণ্য) দিন)</h6>
                              </Form.Label>
                           </Col>}
                           {userData.id_status === '17' && <Col md={12} className='mt-4'>
                              <Form.Label className="text-primary text-center w-100">
                                 <h6 className="text-uppercase text-center py-2 text-success">আবেদনের অনুমোদিত ফি</h6>
                              </Form.Label>
                           </Col>}
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_reg">নিবন্ধন/আবেদন ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_reg"
                                 value={userData.fee_reg}
                                 isInvalid={validated && !!userDataError.fee_reg}
                                 isValid={validated && userData.fee_reg && !userDataError.fee_reg}
                                 onChange={(e) => handleSearchDataChange('fee_reg', e.target.value)}
                              />
                              {validated && userDataError.fee_reg && (
                                 <Form.Control.Feedback type="invalid">
                                    নিবন্ধন ফি {userDataError.fee_reg}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_exam">পরীক্ষা ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_exam"
                                 value={userData.fee_exam}
                                 isInvalid={validated && !!userDataError.fee_exam}
                                 isValid={validated && userData.fee_exam && !userDataError.fee_exam}
                                 onChange={(e) => handleSearchDataChange('fee_exam', e.target.value)}
                              />
                              {validated && userDataError.fee_exam && (
                                 <Form.Control.Feedback type="invalid">
                                    পরীক্ষা ফি {userDataError.fee_exam}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_prac">ব্যবহারিক ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_prac"
                                 value={userData.fee_prac}
                                 isInvalid={validated && !!userDataError.fee_prac}
                                 isValid={validated && userData.fee_prac && !userDataError.fee_prac}
                                 onChange={(e) => handleSearchDataChange('fee_prac', e.target.value)}
                              />
                              {validated && userDataError.fee_prac && (
                                 <Form.Control.Feedback type="invalid">
                                    যবহারিক ফি {userDataError.fee_prac}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_cert">সনদ (CERTIFICATE) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_cert"
                                 value={userData.fee_cert}
                                 isInvalid={validated && !!userDataError.fee_cert}
                                 isValid={validated && userData.fee_cert && !userDataError.fee_cert}
                                 onChange={(e) => handleSearchDataChange('fee_cert', e.target.value)}
                              />
                              {validated && userDataError.fee_cert && (
                                 <Form.Control.Feedback type="invalid">
                                    সনদ (CERTIFICATE) ফি {userDataError.fee_cert}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_trns">নম্বরপত্র (TRANSCRIPT) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_trns"
                                 value={userData.fee_trns}
                                 isInvalid={validated && !!userDataError.fee_trns}
                                 isValid={validated && userData.fee_trns && !userDataError.fee_trns}
                                 onChange={(e) => handleSearchDataChange('fee_trns', e.target.value)}
                              />
                              {validated && userDataError.fee_trns && (
                                 <Form.Control.Feedback type="invalid">
                                    নম্বরপত্র (TRANSCRIPT) ফি {userDataError.fee_trns}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_irre">অনিয়মিত ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_irre"
                                 value={userData.fee_irre}
                                 isInvalid={validated && !!userDataError.fee_irre}
                                 isValid={validated && userData.fee_irre && !userDataError.fee_irre}
                                 onChange={(e) => handleSearchDataChange('fee_irre', e.target.value)}
                              />
                              {validated && userDataError.fee_irre && (
                                 <Form.Control.Feedback type="invalid">
                                    অনিয়মিত ফি {userDataError.fee_irre}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_impv">জিপিএ উন্নয়ন ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_impv"
                                 value={userData.fee_impv}
                                 isInvalid={validated && !!userDataError.fee_impv}
                                 isValid={validated && userData.fee_impv && !userDataError.fee_impv}
                                 onChange={(e) => handleSearchDataChange('fee_impv', e.target.value)}
                              />
                              {validated && userDataError.fee_impv && (
                                 <Form.Control.Feedback type="invalid">
                                    জিপিএ উন্নয়ন ফি {userDataError.fee_impv}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_renw">নিবন্ধন নবায়ন ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_renw"
                                 value={userData.fee_renw}
                                 isInvalid={validated && !!userDataError.fee_renw}
                                 isValid={validated && userData.fee_renw && !userDataError.fee_renw}
                                 onChange={(e) => handleSearchDataChange('fee_renw', e.target.value)}
                              />
                              {validated && userDataError.fee_renw && (
                                 <Form.Control.Feedback type="invalid">
                                    নিবন্ধন নবায়ন ফি {userDataError.fee_renw}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_educ">শিক্ষা সপ্তাহ ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_educ"
                                 value={userData.fee_educ}
                                 isInvalid={validated && !!userDataError.fee_educ}
                                 isValid={validated && userData.fee_educ && !userDataError.fee_educ}
                                 onChange={(e) => handleSearchDataChange('fee_educ', e.target.value)}
                              />
                              {validated && userDataError.fee_educ && (
                                 <Form.Control.Feedback type="invalid">
                                    শিক্ষা সপ্তাহ ফি {userDataError.fee_educ}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_bncc">বিএনসিসি ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_bncc"
                                 value={userData.fee_bncc}
                                 isInvalid={validated && !!userDataError.fee_bncc}
                                 isValid={validated && userData.fee_bncc && !userDataError.fee_bncc}
                                 onChange={(e) => handleSearchDataChange('fee_bncc', e.target.value)}
                              />
                              {validated && userDataError.fee_bncc && (
                                 <Form.Control.Feedback type="invalid">
                                    বিএনসিসি ফি {userDataError.fee_bncc}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_rdcr">রেডক্রিসেন্ট ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_rdcr"
                                 value={userData.fee_rdcr}
                                 isInvalid={validated && !!userDataError.fee_rdcr}
                                 isValid={validated && userData.fee_rdcr && !userDataError.fee_rdcr}
                                 onChange={(e) => handleSearchDataChange('fee_rdcr', e.target.value)}
                              />
                              {validated && userDataError.fee_rdcr && (
                                 <Form.Control.Feedback type="invalid">
                                    রেডক্রিসেন্ট ফি {userDataError.fee_rdcr}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_scut">স্কাউটস ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_scut"
                                 value={userData.fee_scut}
                                 isInvalid={validated && !!userDataError.fee_scut}
                                 isValid={validated && userData.fee_scut && !userDataError.fee_scut}
                                 onChange={(e) => handleSearchDataChange('fee_scut', e.target.value)}
                              />
                              {validated && userDataError.fee_scut && (
                                 <Form.Control.Feedback type="invalid">
                                    স্কাউটস ফি {userDataError.fee_scut}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_grlg">গার্লগাইড ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_grlg"
                                 value={userData.fee_grlg}
                                 isInvalid={validated && !!userDataError.fee_grlg}
                                 isValid={validated && userData.fee_grlg && !userDataError.fee_grlg}
                                 onChange={(e) => handleSearchDataChange('fee_grlg', e.target.value)}
                              />
                              {validated && userDataError.fee_grlg && (
                                 <Form.Control.Feedback type="invalid">
                                    গার্লগাইড ফি {userDataError.fee_grlg}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_sprt">ক্রীড়া ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_sprt"
                                 value={userData.fee_sprt}
                                 isInvalid={validated && !!userDataError.fee_sprt}
                                 isValid={validated && userData.fee_sprt && !userDataError.fee_sprt}
                                 onChange={(e) => handleSearchDataChange('fee_sprt', e.target.value)}
                              />
                              {validated && userDataError.fee_sprt && (
                                 <Form.Control.Feedback type="invalid">
                                    ক্রীড়া ফি {userDataError.fee_sprt}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_pval">প্রাইভেট (ALL) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_pval"
                                 value={userData.fee_pval}
                                 isInvalid={validated && !!userDataError.fee_pval}
                                 isValid={validated && userData.fee_pval && !userDataError.fee_pval}
                                 onChange={(e) => handleSearchDataChange('fee_pval', e.target.value)}
                              />
                              {validated && userDataError.fee_pval && (
                                 <Form.Control.Feedback type="invalid">
                                    প্রাইভেট (All) ফি {userDataError.fee_pval}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_pvcq">প্রাইভেট (CQ) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_pvcq"
                                 value={userData.fee_pvcq}
                                 isInvalid={validated && !!userDataError.fee_pvcq}
                                 isValid={validated && userData.fee_pvcq && !userDataError.fee_pvcq}
                                 onChange={(e) => handleSearchDataChange('fee_pvcq', e.target.value)}
                              />
                              {validated && userDataError.fee_pvcq && (
                                 <Form.Control.Feedback type="invalid">
                                    প্রাইভেট (CQ) ফি {userDataError.fee_pvcq}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_late">বিলম্ব (LATE) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_late"
                                 value={userData.fee_late}
                                 isInvalid={validated && !!userDataError.fee_late}
                                 isValid={validated && userData.fee_late && !userDataError.fee_late}
                                 onChange={(e) => handleSearchDataChange('fee_late', e.target.value)}
                              />
                              {validated && userDataError.fee_late && (
                                 <Form.Control.Feedback type="invalid">
                                    বিলম্ব (LATE) ফি {userDataError.fee_late}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_spcl">বিশেষ ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_spcl"
                                 value={userData.fee_spcl}
                                 isInvalid={validated && !!userDataError.fee_spcl}
                                 isValid={validated && userData.fee_spcl && !userDataError.fee_spcl}
                                 onChange={(e) => handleSearchDataChange('fee_spcl', e.target.value)}
                              />
                              {validated && userDataError.fee_spcl && (
                                 <Form.Control.Feedback type="invalid">
                                    বিশেষ ফি {userDataError.fee_spcl}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_othr">অন্যান্য ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_othr"
                                 value={userData.fee_othr}
                                 isInvalid={validated && !!userDataError.fee_othr}
                                 isValid={validated && userData.fee_othr && !userDataError.fee_othr}
                                 onChange={(e) => handleSearchDataChange('fee_othr', e.target.value)}
                              />
                              {validated && userDataError.fee_othr && (
                                 <Form.Control.Feedback type="invalid">
                                    অন্যান্য ফি {userDataError.fee_othr}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="fee_cent">কেন্দ্র (প্রতি কেন্দ্র) ফি</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="fee_cent"
                                 value={userData.fee_cent}
                                 isInvalid={validated && !!userDataError.fee_cent}
                                 isValid={validated && userData.fee_cent && !userDataError.fee_cent}
                                 onChange={(e) => handleSearchDataChange('fee_cent', e.target.value)}
                              />
                              {validated && userDataError.fee_cent && (
                                 <Form.Control.Feedback type="invalid">
                                    কেন্দ্র ফি {userDataError.fee_cent}
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
   if (permissionData.type !== '13' || permissionData.office === '05' || permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>আবেদনের ফি এন্ট্রি ফর্ম</h4>
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
                                    {(permissionData.office === "05" || permissionData.role === "17") && <>
                                       <option value='06'>ষষ্ট শ্রেণী</option>
                                       <option value='07'>সপ্তম শ্রেণী</option>
                                       <option value='08'>অষ্টম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='09'>নবম শ্রেণী</option>
                                       <option value='10'>দশম শ্রেণী</option>
                                       <option value='13'>নিম্ন মাধ্যমিক</option>
                                       <option value='14'>মাধ্যমিক</option>
                                    </>}
                                    {(permissionData.office === "04" || permissionData.role === "17") && <>
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

export default FeeEntryNew;