import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Document, Page } from 'react-pdf';

import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'
import error403 from '../../../assets/images/error/403.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const NoticeEntryNew = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(((permissionData?.office === '01' || permissionData?.office === '02') && (permissionData?.role === '13' || permissionData?.role === '14')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18')) {
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
      eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', dt_start: '', dt_end: '', en_notice: '', bn_notice: '',
   });
   const [userDataError, setUserDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);

   // Search Data Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [loadingSuccess, setLoadingSuccess] = useState(false);

   // File Attachment
   const [files, setFiles] = useState({
      'file_notice': null,
   });

   // Set File Pages
   const [filesPages, setFilesPages] = useState({
      'file_notice': 0,
   });

   // Hanlde File View
   const handleFileView = (field) => {
      if (files[field] instanceof Blob) {
         const pdfURL = URL.createObjectURL(files[field]);
         window.open(pdfURL, '_blank');
         URL.revokeObjectURL(pdfURL);
      }
   };

   // Fetch Files 
   const fetchFiles = async (appData) => {
      const pdfFiles = {};

      const fields = [
         'file_notice'
      ];

      // console.log(appData);

      const promises = fields.map(async (field) => {
         try {
            const res = await axiosApi.post(
               `/board/notice/fetch_files`,
               { id_notice: userData.online_code, file_notice: appData.file_notice },
               { responseType: 'blob' }
            );

            if (res.status === 200) {
               const file = new File([res.data], `${field}.pdf`, {
                  type: 'application/pdf',
               });
               pdfFiles[field] = file;
            } else {
               pdfFiles[field] = null;
            }
         } catch (err) {


            if (err.status === 401) {
               navigate("/auth/sign-out");

            }
            pdfFiles[field] = null;
         }
      });

      await Promise.all(promises);
      setFiles(pdfFiles);
      // console.log(pdfFiles);
   }

   // Handle File Select
   const handleFileSelect = async (fileName, selectedFile) => {
      if (selectedFile && selectedFile.type === 'application/pdf') {
         if (selectedFile.size > 1024 * 1024 * 5) {
            setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইলের সাইজ 5mb এর কম হতে হবে!` });
            setFiles({ ...files, [fileName]: null });
         } else {
            const temp_file = new File([selectedFile], `${fileName}.pdf`, {
               type: selectedFile.type,
            });
            setFiles({ ...files, [fileName]: temp_file });
            setUserDataError({ ...userDataError, [fileName]: null });
         }
      } else {
         setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইল সিলেক্ট করতে হবে!` });
         setFiles({ ...files, [fileName]: null });
      }
   };

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
               const response = await axiosApi.post(`/entry/notice/search`, { userData });
               if (response.status === 200) {
                  // console.log(userData);
                  setLoadingSuccess(response.data.message);
                  await setUserData({ ...userData, ...response.data.noticeData });
                  await fetchFiles(response.data.noticeData);
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
         const bengaliName = {
            file_notice: 'নোটিশ সংযুক্ত করতে হবে',
         };

         const requiredFields = [
            'dt_start', 'dt_end', 'en_notice', 'bn_notice', 'file_notice',
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'en_notice':
                  dataError = ValidationInput.addressCheck(userData[field]);
                  break;

               case 'bn_notice':
                  dataError = ValidationInput.banglaAddressCheck(userData[field]);
                  break;

               case 'dt_start':
               case 'dt_end':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     userData.dt_start,
                     userData.dt_end
                  );
                  break;

               case 'file_notice':
                  dataError = files[field] ? '' : bengaliName[field];
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
               const formData = new FormData();
               formData.append('userData', JSON.stringify(userData));
               Object.entries(files).forEach(([filename, file]) => {
                  if (file) {
                     formData.append('files', file); // Field name should match backend
                  }
               });

               const response = await axiosApi.post(`/entry/notice/update`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });

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
         eco_code: '', new_code: '', online_code: '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', dt_start: '', dt_end: '', en_notice: '', bn_notice: '',
      });
   };

   const handleUpdateReset = (event) => {
      event.preventDefault();
      setUserDataError([]);
      setLoadingError(false);
      setUserDataError([]);
      setValidated(false);
      setUserData({
         ...userData, dt_start: '', dt_end: '', en_notice: '', bn_notice: '',
      });
      setFiles({ 'file_notice': null });
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

   if (!(permissionData.office === '02' || permissionData.office === '03')) {
      return (
         <div className='d-flex justify-content-center align-items-center'>
            <Image src={error403} style={{ mixBlendMode: "multiply" }} alt="Forbidden" />
         </div>
      )
   }

   // Return if Search is Valid
   if (validSearch && (permissionData.type !== '13' || permissionData.office === '04' || permissionData.office === '05' || permissionData.office === '06' || permissionData.role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>নোটিশ এন্ট্রি ফর্ম</h4>
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
                              </Form.Label>
                           </Col>}
                           {userData.id_status === '17' && <Col md={12} className='mt-4'>
                              <Form.Label className="text-primary text-center w-100">
                                 <h6 className="text-uppercase text-center py-2 text-success">অনুমোদিত নোটিশ</h6>
                              </Form.Label>
                           </Col>}
                           <Row>
                              <Col md={9}>
                                 <Row>
                                    <Col md={12} className='my-2'>
                                       <Form.Label className="text-primary" htmlFor="bn_notice">নোটিশ টাইটেল (বাংলা)</Form.Label>
                                       <Form.Control
                                          className='bg-transparent text-uppercase'
                                          type="text"
                                          id="bn_notice"
                                          value={userData.bn_notice}
                                          isInvalid={validated && !!userDataError.bn_notice}
                                          isValid={validated && userData.bn_notice && !userDataError.bn_notice}
                                          onChange={(e) => handleSearchDataChange('bn_notice', e.target.value)}
                                       />
                                       {validated && userDataError.bn_notice && (
                                          <Form.Control.Feedback type="invalid">
                                             {userDataError.bn_notice}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                    <Col md={12} className='my-2'>
                                       <Form.Label className="text-primary" htmlFor="en_notice">নোটিশ টাইটেল (ইংরেজি)</Form.Label>
                                       <Form.Control
                                          className='bg-transparent text-uppercase'
                                          type="text"
                                          id="en_notice"
                                          value={userData.en_notice}
                                          isInvalid={validated && !!userDataError.en_notice}
                                          isValid={validated && userData.en_notice && !userDataError.en_notice}
                                          onChange={(e) => handleSearchDataChange('en_notice', e.target.value)}
                                       />
                                       {validated && userDataError.en_notice && (
                                          <Form.Control.Feedback type="invalid">
                                             {userDataError.en_notice}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                    <Col md={6} className='my-2'>
                                       <Form.Label className="text-primary" htmlFor="dt_start">নোটিশ শুরুর তারিখ</Form.Label>
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
                                             {userDataError.dt_start}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                    <Col md={6} className='my-2'>
                                       <Form.Label className="text-primary" htmlFor="dt_end">নোটিশ শেষ তারিখ</Form.Label>
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
                                             {userDataError.dt_end}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                 </Row>
                              </Col>
                              <Col md={3}>
                                 <Card className="m-0 p-0">
                                    <Card.Header className="mb-0 p-0 pb-1">
                                       <label className="text-primary w-100 text-center" htmlFor='file_notice'>নোটিশ সংযুক্তি</label>
                                    </Card.Header>
                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                       {files.file_notice && (
                                          <Document
                                             className="border p-2 rounded shadow"
                                             file={files.file_notice}
                                             onLoadSuccess={({ numPages }) => setFilesPages({
                                                ...filesPages, file_notice: numPages
                                             })}
                                             onClick={() => handleFileView('file_notice')}
                                          >
                                             <Page
                                                pageNumber={1}
                                                width={128}
                                                renderTextLayer={false}   // ✅ disable text layer
                                                renderAnnotationLayer={false} // ✅ disable links/annotations
                                             />
                                             <p className='text-center'><i><small>মোট পাতাঃ {filesPages.file_notice}</small></i></p>
                                          </Document>
                                       )}
                                       {!files.file_notice && <svg xmlns="http://www.w3.org/2000/svg" width="128px" height="128px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                       <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                          <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                             <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                          </svg>
                                          <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('file_notice', event.target.files[0])} />
                                       </div>
                                    </Card.Body>
                                    <Card.Footer className="d-flex justify-content-center">
                                       {!files.file_notice && !userDataError.file_notice &&
                                          <p className='my-2 pt-2 text-center'>
                                             <small>
                                                <i>
                                                   শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                </i>
                                                <br />
                                                <i>
                                                   সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                </i>
                                                <br />
                                             </small>
                                          </p>
                                       }
                                       {userDataError.file_notice &&
                                          <p className='text-center'>
                                             <small>
                                                <i className='text-danger'>
                                                   {userDataError.file_notice}
                                                </i>
                                             </small>
                                          </p>
                                       }
                                    </Card.Footer>
                                 </Card>
                              </Col>
                           </Row>

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
   if (permissionData.type !== '13' || permissionData.office === '04' || permissionData.office === '05' || permissionData.office === '06' || permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className="m-1">
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>নোটিশ এন্ট্রি ফর্ম</h4>
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

export default NoticeEntryNew;