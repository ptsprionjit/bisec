import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Modal, Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const UserAdd = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(permissionData.role === '17' || permissionData.role === '18')) {
            navigate("/errors/error404", { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData]); // run only once on mount

   // Modal Variales
   const [modalError, setModalError] = useState(false);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Student Data Variables
   const [userData, setUserData] = useState({
      id_user_entity: '', id_user_role: '', en_office: '', en_section: '', id_user_post: '', bn_user: '', en_user: '', user_id_number: '', user_dob: '', user_mobile: '', user_email: ''
   });
   const bn_error = {
      id_user_entity: 'ইউজার টাইপ', id_user_role: 'ইউজার রোল', en_office: 'ইউজার অফিস', en_section: 'ইউজার সেকশন', id_user_post: 'ইউজার পদবী', bn_user: 'নাম (বাংলা)', en_user: 'নাম (English)', user_id_number: 'আইডি নম্বর', user_dob: 'তারিখ', user_mobile: 'মোবাইল', user_email: 'ইমেইল'
   }
   const [userDataError, setUserDataError] = useState([]);

   const [userType, setUserType] = useState([]);
   const [optionUserType, setOptionUserType] = useState([]);
   const [userRole, setUserRole] = useState([]);
   const [optionUserRole, setOptionUserRole] = useState([]);

   const [boardOffices, setBoardOffices] = useState([]);
   const [optionBoardOffices, setOptionBoardOffices] = useState([]);

   const [boardSections, setBoardSections] = useState([]);
   const [optionBoardSections, setOptionBoardSections] = useState([]);

   const [boardDesignations, setBoardDesignations] = useState([]);
   const [optionBoardDesignations, setOptionBoardDesignations] = useState([]);

   // Student Registration Status
   const [loadingSuccess, setLoadingSuccess] = useState(false);
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);

   const sendEmail = async (emailData) => {
      try {
         const response = await axiosApi.post(`/email/send/password`, { emailData });
         if (response.status === 200) {
            alert(response.data.message);
         } else {
            alert(response.data.message);
         }
      } catch (err) {
         if (err.status === 401) {
            navigate("/auth/sign-out");
         }
         alert(err.message);
      }
   }

   const handleSubmit = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;
      let isValid = true;
      setUserDataError([]);
      setLoadingSuccess(false);
      setLoadingError(false);
      setLoadingData("নিবন্ধন করা হচ্ছে! অপেক্ষা করুন...");

      const newErrors = {}; // Collect errors in one place

      if (form.checkValidity() === false) {
         setValidated(false);
      } else {
         const requiredFields = [
            'id_user_entity', 'id_user_role', 'en_office', 'en_section', 'id_user_post', 'bn_user', 'en_user', 'user_id_number', 'user_dob', 'user_mobile', 'user_email'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'id_user_entity':
               case 'id_user_role':
               case 'id_user_post':
                  dataError = ValidationInput.numberCheck(userData[field]);
                  break;

               case 'bn_user':
                  dataError = ValidationInput.banglaAddressCheck(userData[field]);
                  break;

               case 'user_id_number':
                  if (userData.id_user_entity === '13') {
                     dataError = String(userData[field]).length === 6 ? ValidationInput.numberCheck(userData[field]) : 'ইআইআইএন (EIIN) ৬ (ছয়) ডিজিটের হতে হবে';
                  } else {
                     dataError = String(userData[field]).length === 10 || String(userData[field]).length === 13 || String(userData[field]).length === 17 ? ValidationInput.numberCheck(userData[field]) : 'এনআইডি (NID) ১০/১৩/১৭ ডিজিটের হতে হবে';
                  }

                  break;
               case 'user_mobile':
                  dataError = String(userData[field]).length === 11 ? ValidationInput.numberCheck(userData[field]) : 'মোবাইল নম্বর ১১ (এগার) ডিজিটের হতে হবে';
                  break;

               case 'en_office':
               case 'en_section':
               case 'en_user':
                  dataError = ValidationInput.addressCheck(userData[field]);
                  break;

               case 'user_dob':
                  dataError = ValidationInput.dateCheck(
                     userData[field],
                     '1601-01-01',
                     new Date().toISOString().split('T')[0]
                  );
                  break;

               case 'user_email':
                  dataError = ValidationInput.emailCheck(userData[field]);
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
            setModalError(true);
            setLoadingData(false);
            setLoadingError("ব্যবহারকারীর সব তথ্য সঠিকভাবে পূরণ করতে হবে!");
         } else {
            try {
               const user_data = await axiosApi.post(`/user/registration/new`, { userData });
               if (user_data.status === 200) {
                  setLoadingSuccess(user_data.data.message);
                  // sendEmail(user_data.data.newUser);
                  // Reset Form
                  setUserData({
                     id_user_entity: '', id_user_role: '', en_office: '', en_section: '', id_user_post: '', bn_user: '', en_user: '', user_id_number: '', user_dob: '', user_mobile: '', user_email: ''
                  });
               } else {
                  setLoadingError(user_data.data.message);
               }
            } catch (err) {
               setLoadingError('নিবন্ধন করা সম্ভব হয়নি!');
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
               alert('নিবন্ধন করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
            } finally {
               setLoadingData(false);
            }
         }
      }
      setValidated(true);
   };

   // Handle User Data Change
   const handleDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue });
      setUserDataError({ ...userDataError, [dataName]: '' });
   }

   // Handle User Data Change
   const handleOfficeDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, 'en_section': '', 'id_user_post': '', [dataName]: dataValue });
      setUserDataError({ ...userDataError, 'en_section': '', 'id_user_post': '', [dataName]: '' });
      setOptionBoardSections([]);
      setOptionBoardDesignations([]);
   }

   // Handle User Data Change
   const handleSectionDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, 'id_user_post': '', [dataName]: dataValue });
      setUserDataError({ ...userDataError, 'id_user_post': '', [dataName]: '' });
      setOptionBoardDesignations([]);
   }

   const handleReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setUserDataError([]);
      setValidated(false);

      setLoadingSuccess(false);
      setLoadingError(false);
      setLoadingData(false);

      setUserData({
         id_user_entity: '', id_user_role: '', en_office: '', en_section: '', id_user_post: '', bn_user: '', en_user: '', user_id_number: '', user_dob: '', user_mobile: '', user_email: ''
      });
   };

   // Fetch User Type
   useEffect(() => {
      const fetchUserType = async () => {
         setOptionUserType([]);
         setLoadingData("ইউজার টাইপ তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
         try {
            const response = await axiosApi.post(`/user/type-list`);
            setUserType(response.data);
         } catch (err) {
            // console.error(`Error Fetching User Type: ${err}`);
            setLoadingError("ইউজার টাইপ তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!");
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchUserType();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // User Type Option
   useEffect(() => {
      if (userType.length > 0) {
         const newOptions = userType.map(data => ({
            value: data.id_user_entity,
            label: data.bn_user_entity
         }));
         setOptionUserType(newOptions);
      }
   }, [userType]); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch User Role
   useEffect(() => {
      const fetchUserRole = async () => {
         setOptionUserRole([]);
         setLoadingData("ইউজার রোল তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
         try {
            const response = await axiosApi.post(`/user/role-list`);
            setUserRole(response.data);
         } catch (err) {
            // console.error(`Error Fetching User Type: ${err}`);
            setLoadingError("ইউজার রোল তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!");
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchUserRole();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // User Role Option
   useEffect(() => {
      if (userRole.length > 0) {
         const newOptions = userRole.map(data => ({
            value: data.id_user_role,
            label: data.bn_user_role
         }));
         setOptionUserRole(newOptions);
      }
   }, [userRole]); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch Office List
   useEffect(() => {
      const fetchOffice = async () => {
         setOptionBoardOffices([]);
         setOptionBoardSections([]);
         setOptionBoardDesignations([]);
         setLoadingData("বোর্ডের অফিস তথ্য খুঁজা হচ্ছে...");
         try {
            const response = await axiosApi.post(`/user/designation-list`);
            setBoardOffices(response.data);
         } catch (err) {
            setLoadingError("বোর্ডের অফিস তথ্য পাওয়া যায়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।");
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchOffice();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Office List Option
   useEffect(() => {
      if (boardOffices.length > 0) {
         const newOptions = boardOffices.map(data => ({
            value: data.en_office,
            label: data.bn_office
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionBoardOffices(uniqueValues);
      }
   }, [boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch Section List
   useEffect(() => {
      if (userData.en_office) {
         const filteredData = boardOffices.filter(
            item => item.en_office === userData.en_office
         );
         setBoardSections(filteredData);
      }
      // const fetchSections = async () => {
      //    setOptionBoardSections([]);
      //    setOptionBoardDesignations([]);
      //    if (userData.en_office) {
      //       setLoadingData("বোর্ডের শাখা লিস্ট তথ্য খুঁজা হচ্ছে...");
      //       try {
      //          const response = await axiosApi.post(`/department-list/section?`, { en_office: userData.en_office });
      //          setBoardSections(response.data);
      //       } catch (err) {
      //          setLoadingError("বোর্ডের শাখা লিস্ট পাওয়া যায়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।");
      //          if (err.status === 401) {
      //             navigate("/auth/sign-out");
      //          }
      //       } finally {
      //          setLoadingData(false);
      //       }
      //    }
      // };
      // fetchSections();
   }, [userData.en_office]); // eslint-disable-line react-hooks/exhaustive-deps

   // Section List Option
   useEffect(() => {
      if (boardSections.length > 0) {
         const newOptions = boardSections.map(data => ({
            value: data.en_section,
            label: data.bn_section
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionBoardSections(uniqueValues);
      }
   }, [boardSections]); // eslint-disable-line react-hooks/exhaustive-deps

   //Fetch Designation List
   useEffect(() => {
      if (userData.en_section) {
         const filteredData = boardOffices.filter(
            item => item.en_section === userData.en_section
         );
         setBoardDesignations(filteredData);
      }
      // const fetchDesignations = async () => {
      //    setOptionBoardDesignations([]);
      //    if (userData.en_section) {
      //       setLoadingData("বোর্ডের পদবী লিস্ট খুঁজা হচ্ছে...");
      //       try {
      //          const response = await axiosApi.post(`/section-list/designation`, { en_section: userData.en_section });
      //          setBoardDesignations(response.data);
      //       } catch (err) {
      //          setLoadingError("বোর্ডের পদবী লিস্ট পাওয়া যায়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।");
      //          if (err.status === 401) {
      //             navigate("/auth/sign-out");
      //          }
      //       } finally {
      //          setLoadingData(false);
      //       }
      //    }
      // };
      // fetchDesignations();
   }, [userData.en_section]);// eslint-disable-line react-hooks/exhaustive-deps

   // Designation List Option
   useEffect(() => {
      if (boardDesignations.length > 0) {
         const newOptions = boardDesignations.map(data => ({
            value: data.id_post,
            label: data.bn_post
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionBoardDesignations(uniqueValues);
      }
   }, [boardDesignations]); // eslint-disable-line react-hooks/exhaustive-deps

   // Return if Search is Valid
   if (permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-primary w-100 card-title"}>বোর্ডের নতুন ইউজার নিবন্ধন</h4>
                     {loadingSuccess && <h6 className="text-uppercase text-center text-success">{loadingSuccess}</h6>}
                     {loadingError && <h6 className="text-uppercase text-center text-danger">{loadingError}</h6>}
                     {loadingData && <h6 className="text-uppercase text-center text-primary">{loadingData}</h6>}
                  </Card.Body>
               </Card>
            </Col>
            <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
               <Row>
                  <Col md={6}>
                     <Card>
                        <Card.Header>
                           <Col md={12}>
                              <h5 className="text-center card-title">ব্যবহারকারীর তথ্য</h5>
                           </Col>
                        </Card.Header>
                        <Card.Body>
                           <Row>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='id_user_entity'>ইউজার টাইপ</Form.Label>
                                    <Select
                                       inputId="id_user_entity"
                                       placeholder="--টাইপ সিলেক্ট করুন--"
                                       value={
                                          optionUserType.find(opt => opt.value === userData.id_user_entity) || null
                                       }
                                       onChange={(value) =>
                                          value ? handleDataChange('id_user_entity', value.value) : handleDataChange('id_user_entity', '')
                                       }
                                       options={optionUserType}
                                       isClearable={true}
                                       isSearchable={true}
                                    />
                                    {validated && userDataError.id_user_entity && (
                                       <p className='text-danger'>
                                          {userDataError.id_user_entity}
                                       </p>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='id_user_role'>ইউজার রোল</Form.Label>
                                    <Select
                                       inputId="id_user_role"
                                       placeholder="--রোল সিলেক্ট করুন--"
                                       value={
                                          optionUserRole.find(opt => opt.value === userData.id_user_role) || null
                                       }
                                       onChange={(value) =>
                                          value ? handleDataChange('id_user_role', value.value) : handleDataChange('id_user_role', '')
                                       }
                                       options={optionUserRole}
                                       isClearable={true}
                                       isSearchable={true}
                                    />
                                    {validated && userDataError.id_user_role && (
                                       <p className='text-danger'>
                                          {userDataError.id_user_role}
                                       </p>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={12}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='en_office'>ইউজার অফিস</Form.Label>
                                    <Select
                                       inputId="en_office"
                                       placeholder="--অফিস সিলেক্ট করুন--"
                                       value={
                                          optionBoardOffices.find(opt => opt.value === userData.en_office) || null
                                       }
                                       onChange={(value) =>
                                          value ? handleOfficeDataChange('en_office', value.value) : handleOfficeDataChange('en_office', '')
                                       }
                                       options={optionBoardOffices}
                                       isClearable={true}
                                       isSearchable={true}
                                    />
                                    {validated && userDataError.en_office && (
                                       <p className='text-danger'>
                                          {userDataError.en_office}
                                       </p>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={12}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='en_section'>ইউজার শাখা</Form.Label>
                                    <Select
                                       inputId="en_section"
                                       placeholder="--শাখা সিলেক্ট করুন--"
                                       value={
                                          optionBoardSections.find(opt => opt.value === userData.en_section) || null
                                       }
                                       onChange={(value) =>
                                          value ? handleSectionDataChange('en_section', value.value) : handleSectionDataChange('en_section', '')
                                       }
                                       options={optionBoardSections}
                                       isClearable={true}
                                       isSearchable={true}
                                    />
                                    {validated && userDataError.en_section && (
                                       <p className='text-danger'>
                                          {userDataError.en_section}
                                       </p>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={12}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='id_user_post'>ইউজার পদবী</Form.Label>
                                    <Select
                                       inputId="id_user_post"
                                       placeholder="--পদবী সিলেক্ট করুন--"
                                       value={
                                          optionBoardDesignations.find(opt => opt.value === userData.id_user_post) || null
                                       }
                                       onChange={(value) =>
                                          value ? handleDataChange('id_user_post', value.value) : handleDataChange('id_user_post', '')
                                       }
                                       options={optionBoardDesignations}
                                       isClearable={true}
                                       isSearchable={true}
                                    />
                                    {validated && userDataError.id_user_post && (
                                       <p className='text-danger'>
                                          {userDataError.id_user_post}
                                       </p>
                                    )}
                                 </Form.Group>
                              </Col>
                           </Row>
                        </Card.Body>
                     </Card>

                  </Col>
                  <Col md={6}>
                     <Card>
                        <Card.Header>
                           <Col md={12}>
                              <h5 className="text-center card-title">ব্যক্তিগত তথ্য</h5>
                           </Col>
                        </Card.Header>
                        <Card.Body>
                           <Row>
                              <Col className='my-2' md={12}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='bn_user'>নাম (বাংলা)</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       id="bn_user"
                                       value={userData.bn_user}
                                       isInvalid={validated && !!userDataError.bn_user}
                                       isValid={validated && userData.bn_user && !userDataError.bn_user}
                                       onChange={(e) => handleDataChange('bn_user', e.target.value)}
                                    />
                                    {validated && userDataError.bn_user && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.bn_user}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={12}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='en_user'>নাম (English)</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       id="en_user"
                                       value={userData.en_user}
                                       isInvalid={validated && !!userDataError.en_user}
                                       isValid={validated && userData.en_user && !userDataError.en_user}
                                       onChange={(e) => handleDataChange('en_user', e.target.value)}
                                    />
                                    {validated && userDataError.en_user && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.en_user}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='user_id_number'>{userData.id_user_entity === '13' ? 'ইআইআইএন (EIIN) নম্বর' : 'এনআইডি (NID) নম্বর'}</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       id="user_id_number"
                                       maxLength={userData.id_user_entity === '13' ? 6 : 17}
                                       value={userData.user_id_number}
                                       isInvalid={validated && !!userDataError.user_id_number}
                                       isValid={validated && userData.user_id_number && !userDataError.user_id_number}
                                       onChange={(e) => handleDataChange('user_id_number', e.target.value)}
                                    />
                                    {validated && userDataError.user_id_number && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.user_id_number}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='user_dob'>{userData.id_user_entity === '13' ? 'শুরুর তারিখ' : 'জন্ম তারিখ'}</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="date"
                                       id="user_dob"
                                       value={userData.user_dob}
                                       isInvalid={validated && !!userDataError.user_dob}
                                       isValid={validated && userData.user_dob && !userDataError.user_dob}
                                       onChange={(e) => handleDataChange('user_dob', e.target.value)}
                                    />
                                    {validated && userDataError.user_dob && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.user_dob}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='user_mobile'>মোবাইল নম্বর</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       maxLength={11}
                                       id="user_mobile"
                                       value={userData.user_mobile}
                                       isInvalid={validated && !!userDataError.user_mobile}
                                       isValid={validated && userData.user_mobile && !userDataError.user_mobile}
                                       onChange={(e) => handleDataChange('user_mobile', e.target.value)}
                                    />
                                    {validated && userDataError.user_mobile && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.user_mobile}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                              <Col className='my-2' md={6}>
                                 <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='user_email'>ইমেইল</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-lowercase'
                                       type="text"
                                       id="user_email"
                                       value={userData.user_email}
                                       isInvalid={validated && !!userDataError.user_email}
                                       isValid={validated && userData.user_email && !userDataError.user_email}
                                       onChange={(e) => handleDataChange('user_email', e.target.value)}
                                    />
                                    {validated && userDataError.user_email && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.user_email}
                                       </Form.Control.Feedback>
                                    )}
                                 </Form.Group>
                              </Col>
                           </Row>
                        </Card.Body>
                     </Card>
                  </Col>
                  <Col md={12}>
                     <Card>
                        <Card.Body className="d-flex justify-content-center gap-3">
                           <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                           <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </Form>
         </Row>
         <Modal
            show={modalError}
            onHide={() => setModalError(false)}
            backdrop="static"
            keyboard={false}
         >
            <Modal.Header closeButton>
               <Modal.Title><span className={styles.SiyamRupaliFont}>নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {Object.entries(userDataError).map(([field, error]) => (
                  <i className='text-danger' key={field}>{bn_error[field]}, </i>
               ))}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setModalError(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment >
   )

   // Return if User is not Authorized
   return (
      <div className='d-flex flex-column justify-content-center align-items-center'>
         <h2 className='text-center text-white mb-2'>This page is under development</h2>
         <Image src={error01} alt="Under Development" />
      </div>
   )
}

export default UserAdd;