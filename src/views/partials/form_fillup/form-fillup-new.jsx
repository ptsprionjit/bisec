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

const FormFillupNew = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!((permissionData?.office === '03' && (permissionData?.role === '13' || permissionData?.role === '14' || permissionData?.role === '15')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18' || permissionData?.type === '13')) {
            navigate('/errors/error404', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   // Profile Image Variables
   const [profileImagePreview, setProfileImagePreview] = useState(null);
   const [profileImageFile, setProfileImageFile] = useState(null);
   const [profileImageError, setProfileImageError] = useState(false);

   // Modal Variales
   const [modalError, setModalError] = useState(false);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState(
      {
         user_form: '200020711422330002', user_eiin: permissionData.type === "13" ? permissionData.id : '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: ''
      }
   );
   const [searchDataError, setSearchDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);
   const [insName, setInsName] = useState(false);

   // Student Data Variables
   const [userData, setUserData] = useState(
      {
         name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', en_dist: '', upazila: '', address: '', mobile: '', class_shift: '', class_section: '', class_roll: ''
      }
   );
   const [userDataError, setUserDataError] = useState([]);
   const [dateDisability, setDateDisability] = useState(false);

   // Reset Counter
   const [counReset, setCountReset] = useState(0);

   // Districts and Upazilas
   const [districts, setDistricts] = useState([]);
   const [optionDistricts, setOptionDistricts] = useState([]);
   const [upazilas, setUpazilas] = useState([]);
   const [optionSections, setOptionSections] = useState([]);

   // Search Data Status
   const [searchLoading, setSearchLoading] = useState(false);
   const [searchError, setSearchError] = useState(false);
   const [searchSuccess, setSearchSuccess] = useState(false);

   // Student Registration Status
   const [insertSuccess, setInsertSuccess] = useState(false);
   const [insertLoading, setInsertLoading] = useState(false);
   const [insertError, setInsertError] = useState(false);

   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   const handleProfileImageSelect = (e) => {
      setCountReset(0);
      const file = e.target.files[0];
      if (profileImagePreview) URL.revokeObjectURL(profileImagePreview); // Free up memory
      if (file) {
         setProfileImageError(false);
         setProfileImageFile(file);
         setProfileImagePreview(URL.createObjectURL(file));
      } else {
         setProfileImageError("ছবি নির্বাচন সফল হয়নি!");
      }
   };

   const handleSearch = async (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
      setCountReset(0);
      const form = event.currentTarget;
      let isValid = true;

      setSearchDataError([]);
      setSearchSuccess(false);
      setSearchError(false);

      const newErrors = {}; // Collect errors in one place
      // console.log(searchData);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'user_form', 'user_eiin', 'user_session', 'user_class', 'user_group', 'user_version', 'user_application'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'user_form':
               case 'user_eiin':
               case 'user_session':
               case 'user_class':
               case 'user_group':
               case 'user_version':
               case 'user_application':
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

         // console.log(newErrors);

         if (!isValid) {
            event.stopPropagation();
            setValidated(true);
         } else {
            setSearchLoading("তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন...");
            try {
               const user_data = await axiosApi.post(`/user/search-date?`, { user_form: searchData.user_form, user_eiin: searchData.user_eiin, user_session: searchData.user_session, user_class: searchData.user_class, user_group: searchData.user_group, user_version: searchData.user_version, user_application: searchData.user_application });
               // console.log(user_data.data.data);
               if (user_data.status === 200) {
                  setSearchSuccess(`সেশনঃ ${searchData.user_session}, শ্রেণীঃ ${searchData.user_class}, বিভাগঃ ${user_data.data.data.name_group}`);
                  setInsName(user_data.data.ins_name);
                  setSearchData(user_data.data.data);
                  setValidSearch(true);
                  setValidated(false);
               } else {
                  setSearchError(`নিবন্ধন ${user_data.data.message}`);
                  setValidSearch(false);
                  setValidated(true);
               }
            } catch (err) {

               setSearchError("নিবন্ধন তথ্য পাওয়া যায়নি!");
               setValidSearch(false);
               setValidated(true);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");

               } else if (err.status === 403) {
                  navigate("/registration/new-app");
                  return null;
               }
            } finally {
               setSearchLoading(false);
            }
         }
      }
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;
      setCountReset(0);
      setUserDataError([]);
      setInsertSuccess(false);
      setInsertError(false);
      setInsertLoading("শিক্ষার্থী নিবন্ধন করা হচ্ছে! অপেক্ষা করুন...");

      const newErrors = {}; // Collect errors in one place

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'name', 'father', 'mother', 'gender', 'religion', 'birth_reg', 'dob', 'quota', 'disability', 'upazila', 'address', 'mobile', 'class_shift', 'class_section', 'class_roll'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'name':
               case 'father':
               case 'mother':
               case 'class_section':
                  dataError = ValidationInput.alphaCheck(userData[field]);
                  dataError = !dataError ? ValidationInput.namePartCheck(userData[field]) : dataError;
                  break;

               case 'dob':
                  dataError = userData.disability === "01" ? ValidationInput.dateCheck(userData[field], searchData.birth_start, searchData.birth_end) : ValidationInput.dateCheck(userData[field], dateDisability, searchData.birth_end);
                  break;

               case 'gender':
               case 'religion':
               case 'birth_reg':
               case 'quota':
               case 'disability':
               case 'upazila':
               case 'mobile':
               case 'class_shift':
               case 'class_roll':
                  dataError = ValidationInput.numberCheck(userData[field]);
                  break;

               case 'address':
                  dataError = ValidationInput.addressCheck(userData[field]);
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

         if (!isValid || !profileImageFile) {
            setProfileImageError("ছবি নির্বাচন করুন");
            setModalError(true);
            setInsertLoading(false);
            setInsertError("শিক্ষার্থীর তথ্য সঠিকভাবে পূরণ করতে হবে!");
            event.stopPropagation();
         } else {
            const formData = new FormData();
            formData.append('student_data', JSON.stringify(userData));
            formData.append('image', profileImageFile);
            try {
               const user_data = await axiosApi.post(`/student/new-registration?`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });
               if (user_data.status === 200) {
                  setInsertSuccess(user_data.data.message);
                  // Reset Form
                  setUserData({
                     ...userData, name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', en_dist: '', upazila: '', address: '', mobile: '', class_roll: ''
                  });
                  setProfileImageError(false);
                  setProfileImageFile(null);
                  setProfileImagePreview(null);
                  alert(user_data.data.message);
               } else {
                  setInsertError(user_data.data.message);
                  alert(user_data.data.message);
               }
            } catch (err) {

               setInsertError('শিক্ষার্থী নিবন্ধন করা সম্ভব হয়নি!');
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");

               }
               alert('শিক্ষার্থী নিবন্ধন করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
            } finally {
               setInsertLoading(false);
            }
         }
      }
      setValidated(true);
   };

   //Handle Search Data Change
   const handleSearchDataChange = (dataName, dataValue) => {
      setSearchData({ ...searchData, [dataName]: dataValue.toUpperCase() });
      setSearchDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   // Handle User Data Change
   const handleStudentDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue.toUpperCase() });
      setUserDataError(prev => ({ ...prev, [dataName]: '' }));
      setCountReset(0);
   }

   const handleStudentReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      if (counReset > 0) {
         setValidSearch(false);
         setSearchSuccess(false);
         setSearchError(false);
         setSearchLoading(false);
         setCountReset(0);
         return;
      }
      setUserDataError([]);
      setUpazilas([]);
      setValidated(false);

      setInsertSuccess(false);
      setInsertError(false);
      setInsertLoading(false);

      setUserData({
         name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', upazila: '', address: '', mobile: '', class_shift: '', class_section: '', class_roll: ''
      });
      setProfileImageError(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
      setCountReset(1);
   };

   const handleSearchReset = (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
      setSearchDataError([]);
      setValidated(false);

      setSearchSuccess(false);
      setSearchError(false);
      setSearchLoading(false);

      setInsertSuccess(false);
      setInsertError(false);
      setInsertLoading(false);

      setValidSearch(false);

      setSearchData({
         user_form: '200020711422330002', user_eiin: permissionData.type === "13" ? permissionData.id : '', user_session: '', user_class: '', user_group: '', user_version: '', user_application: ''
      });
      setCountReset(0);
   };

   //Handle District Change
   const handleDistrictChange = (value) => {
      setUserData({ ...userData, en_dist: value });
      setUpazilas([]);
      setCountReset(0);
   };

   // List of Sections
   useEffect(() => {
      const sections = [];
      for (let i = 0; i < 26; i++) {
         sections.push({ value: String.fromCharCode(65 + i), label: String.fromCharCode(65 + i) });
      }
      setOptionSections(sections);
      if (!validSearch) removeCookie('jwEntry');
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   // Cleanup Old Blob URL
   useEffect(() => {
      return () => {
         if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
         }
      };
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Date Set for Disability
   useEffect(() => {
      if (userData.disability) {
         let startDob = new Date(searchData.birth_start);
         startDob.setFullYear(startDob.getFullYear() - 5);
         startDob = startDob.toISOString().split('T')[0];
         userData.disability === "01" ? setDateDisability(false) : setDateDisability(startDob);
      }
   }, [userData.disability]);// eslint-disable-line react-hooks/exhaustive-deps

   // Fetch District
   useEffect(() => {
      const fetchDistrict = async () => {
         setOptionDistricts([]);
         setInsertLoading("জেলার তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
         try {
            const response = await axiosApi.post(`/district-list`);
            setDistricts(response.data);
         } catch (err) {


            if (err.status === 401) {
               navigate("/auth/sign-out");

            }
            // console.error(`Error Fetching Districts: ${err}`);
            setInsertError("জেলার তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!");
            if (err.status === 401) {
               navigate("/auth/sign-out");

            }
         } finally {
            setInsertLoading(false);
         }
      }

      fetchDistrict();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Districts Option
   useEffect(() => {
      if (districts.length > 0) {
         const newOptions = districts.map(district => ({
            value: district.en_dist,
            label: district.en_dist
         }));
         setOptionDistricts(newOptions);
      }
   }, [districts]); // eslint-disable-line react-hooks/exhaustive-deps

   //Fetch Upazila List
   useEffect(() => {
      const fetchUpazila = async () => {
         if (userData.en_dist) {
            var selectedDistrict = userData.en_dist;
            setInsertLoading("উপজেলার তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
            try {
               const response = await axiosApi.post(`/district-list/upzila?`, { selectedDistrict });
               setUpazilas(response.data);
            } catch (err) {


               if (err.status === 401) {
                  navigate("/auth/sign-out");

               }
               // console.error(`Error Fetching Upazilas: ${err}`);
               setInsertError("উপজেলার তথ্য খুঁজে পাওয়া যায়নি! আবার জেলা নির্বাচন করুন!");
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  return null;
               }
            } finally {
               setInsertLoading(false);
            }
         }
      };
      fetchUpazila();
   }, [userData.en_dist]);// eslint-disable-line react-hooks/exhaustive-deps

   // Return if Search is Valid
   if (validSearch && (permissionData.type === '13' || permissionData.office === '05' || permissionData.role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className='p-0 mb-2'>
                  <Card.Body className='py-1 m-0 d-flex flex-column justify-content-center align-items-center'>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 pt-2 card-title"}>শিক্ষার্থী নিবন্ধন ফর্ম</h4>
                     {insName && <h5 className={styles.SiyamRupaliFont + " text-uppercase text-center py-1 text-primary"}>{insName}</h5>}
                     {searchLoading && <h6 className={styles.SiyamRupaliFont + " text-uppercase text-center py-1 text-info"}>{searchLoading}</h6>}
                     {searchError && <h6 className={styles.SiyamRupaliFont + " text-uppercase text-center py-1 text-danger"}>{searchError}</h6>}
                     {searchSuccess && <p className={styles.SiyamRupaliFont + " text-uppercase text-center py-1 text-success"}><small><i>{searchSuccess}</i></small></p>}
                     <Button type="button" onClick={(e) => handleSearchReset(e)} variant="btn btn-primary"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                  </Card.Body>
               </Card>
            </Col>
            <Col lg='12'>
               <Form noValidate onSubmit={handleSubmit} onReset={handleStudentReset}>
                  <Card>
                     <Card.Header>
                        <Col md={12}>
                           {insertSuccess && <h6 className="text-uppercase text-center py-1 text-success">{insertSuccess}</h6>}
                           {insertError && <h6 className="text-uppercase text-center py-1 text-danger">{insertError}</h6>}
                           {insertLoading && <h6 className="text-uppercase text-center py-1 text-primary">{insertLoading}</h6>}
                           <h5 className="text-center card-title">ব্যক্তিগত তথ্য</h5>
                        </Col>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col className='my-2' md={9}>
                              <Row>
                                 <Col className='my-2' md={12}>
                                    <Form.Label className="text-primary" htmlFor="user_name">Name</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       maxLength={40}
                                       id="user_name"
                                       value={userData.name}
                                       isInvalid={validated && !!userDataError.name}
                                       isValid={validated && userData.name && !userDataError.name}
                                       onChange={(e) => handleStudentDataChange('name', e.target.value)}
                                    />
                                    {validated && userDataError.name && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.name}
                                       </Form.Control.Feedback>
                                    )}
                                 </Col>
                                 <Col className='my-2' md={12}>
                                    <Form.Label className="text-primary" htmlFor="user_father">Father's Name</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       maxLength={40}
                                       id="user_father"
                                       value={userData.father}
                                       isInvalid={validated && !!userDataError.father}
                                       isValid={validated && userData.father && !userDataError.father}
                                       onChange={(e) => handleStudentDataChange('father', e.target.value)}
                                    />
                                    {validated && userDataError.father && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.father}
                                       </Form.Control.Feedback>
                                    )}
                                 </Col>
                                 <Col className='my-2' md={12}>
                                    <Form.Label className="text-primary" htmlFor="user_mother">Mother's Name</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       maxLength={40}
                                       id="user_mother"
                                       value={userData.mother}
                                       isInvalid={validated && !!userDataError.mother}
                                       isValid={validated && userData.mother && !userDataError.mother}
                                       onChange={(e) => handleStudentDataChange('mother', e.target.value)}
                                    />
                                    {validated && userDataError.mother && (
                                       <Form.Control.Feedback type="invalid">
                                          {userDataError.mother}
                                       </Form.Control.Feedback>
                                    )}
                                 </Col>
                              </Row>
                           </Col>
                           <Col md={3}>
                              <Card>
                                 <Card.Header className="mb-0 pb-0">
                                    <label className="text-primary w-100 text-center" htmlFor='profile_image'>Student's Image</label>
                                 </Card.Header>
                                 <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                    {profileImagePreview && <Image className="w-50 h-50 img-thumbnail text-center" src={profileImagePreview} alt="Student's Image" />}
                                    {!profileImagePreview && <svg xmlns="http://www.w3.org/2000/svg" width="50%" height="50%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-user-round-icon lucide-square-user-round"><path d="M18 21a6 6 0 0 0-12 0" /><circle cx="12" cy="11" r="4" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>}
                                    <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                       <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                          <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                       </svg>
                                       <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept=".jpg,.jpeg" onChange={handleProfileImageSelect} />
                                    </div>
                                 </Card.Body>
                                 <small className='my-2 pt-2 text-center'>
                                    <i>
                                       Only <span className='text-primary'>.jpeg & .jpg</span> allowed
                                    </i>
                                    <br />
                                    <i>
                                       Max Size <span className='text-primary'>100kb</span>
                                    </i>
                                    <br />
                                    <i>
                                       Dimension <span className='text-primary'>300x300</span>
                                    </i>
                                 </small>
                                 {profileImageError && <small className='text-center'>
                                    <i className='text-danger'>
                                       {profileImageError}
                                    </i>
                                 </small>}
                              </Card>
                           </Col>
                        </Row>
                        <Row>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_gender'>Gender</Form.Label>
                                 <Form.Select
                                    id="user_gender"
                                    value={userData.gender}
                                    isInvalid={validated && !!userDataError.gender}
                                    isValid={validated && userData.gender && !userDataError.gender}
                                    onChange={(e) => handleStudentDataChange('gender', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>--Select Gender--</option>
                                    <option value='01'>Male</option>
                                    <option value='02'>Female</option>
                                    <option value='03'>Other</option>
                                 </Form.Select>
                                 {validated && userDataError.gender && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.gender}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_religion'>Religion</Form.Label>
                                 <Form.Select
                                    id="user_religion"
                                    value={userData.religion}
                                    isInvalid={validated && !!userDataError.religion}
                                    isValid={validated && userData.religion && !userDataError.religion}
                                    onChange={(e) => handleStudentDataChange('religion', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>--Select Religion--</option>
                                    <option value='01'>Islam</option>
                                    <option value='02'>Sanatan</option>
                                    <option value='03'>Buddhist</option>
                                    <option value='04'>Christian</option>
                                 </Form.Select>
                                 {validated && userDataError.religion && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.religion}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_disability'>Disability</Form.Label>
                                 <Form.Select
                                    id="user_disability"
                                    value={userData.disability}
                                    isInvalid={validated && !!userDataError.disability}
                                    isValid={validated && userData.disability && !userDataError.disability}
                                    onChange={(e) => handleStudentDataChange('disability', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>--Select Disability--</option>
                                    <option value='01'>None</option>
                                    <option value='02'>Hearing</option>
                                    <option value='03'>Vission</option>
                                    <option value='04'>Intellectual</option>
                                    <option value='05'>Speaking</option>
                                    <option value='99'>Multiple</option>
                                 </Form.Select>
                                 {validated && userDataError.disability && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.disability}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_quota'>Quota</Form.Label>
                                 <Form.Select
                                    id="user_quota"
                                    value={userData.quota}
                                    isInvalid={validated && !!userDataError.quota}
                                    isValid={validated && userData.quota && !userDataError.quota}
                                    onChange={(e) => handleStudentDataChange('quota', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>--Select Quota--</option>
                                    <option value='01'>General</option>
                                    <option value='02'>Freedom Fighter</option>
                                    <option value='03'>Ethnic Minority</option>
                                    <option value='04'>Disability</option>
                                    <option value='99'>Others</option>
                                 </Form.Select>
                                 {validated && userDataError.quota && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.quota}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Label className="text-primary" htmlFor="birth_reg">Birth Registration Number</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 minLength={17}
                                 maxLength={17}
                                 id="birth_reg"
                                 value={userData.birth_reg}
                                 isInvalid={validated && !!userDataError.birth_reg}
                                 isValid={validated && userData.birth_reg && !userDataError.birth_reg}
                                 onChange={(e) => handleStudentDataChange('birth_reg', e.target.value)}
                              />
                              {validated && userDataError.birth_reg && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.birth_reg}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Label className="text-primary" htmlFor="user_dob">Birth Date</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date"
                                 id="user_dob"
                                 value={userData.dob}
                                 min={dateDisability || searchData.birth_start}
                                 max={searchData.birth_end}
                                 isInvalid={validated && !!userDataError.dob}
                                 isValid={validated && userData.dob && !userDataError.dob}
                                 onChange={(e) => handleStudentDataChange('dob', e.target.value)}
                              />
                              {validated && userDataError.dob && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.dob}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group>
                                 <label className="text-primary mb-2" htmlFor='user_dist'>District</label>
                                 <Select
                                    inputId="user_dist"
                                    placeholder="--Select District--"
                                    value={
                                       optionDistricts.find(opt => opt.value === userData.en_dist) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDistrictChange(value.value) : handleDistrictChange('')
                                    }
                                    options={optionDistricts}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_upz">Upazila</Form.Label>
                              <Form.Select
                                 id="user_upz"
                                 value={userData.upazila}
                                 onChange={(e) => handleStudentDataChange('upazila', e.target.value)}
                                 isInvalid={validated && !!userDataError.upazila}
                                 isValid={validated && userData.upazila && !userDataError.upazila}
                                 disabled={upazilas.length === 0}
                              >
                                 <option value="">-- Select Upazila --</option>
                                 {upazilas.map((upazila, index) => (
                                    <option key={index} value={upazila.id_uzps}>
                                       {upazila.en_uzps}
                                    </option>
                                 ))}
                              </Form.Select>
                              {validated && userDataError.upazila && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.upazila}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_address">Address</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_address"
                                 value={userData.address}
                                 isInvalid={validated && !!userDataError.address}
                                 isValid={validated && userData.address && !userDataError.address}
                                 onChange={(e) => handleStudentDataChange('address', e.target.value)}
                              />
                              {validated && userDataError.address && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.address}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_mobile">Guardian's Mobile</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="text"
                                 minLength={11}
                                 maxLength={11}
                                 id="user_mobile"
                                 value={userData.mobile}
                                 isInvalid={validated && !!userDataError.mobile}
                                 isValid={validated && userData.mobile && !userDataError.mobile}
                                 onChange={(e) => handleStudentDataChange('mobile', e.target.value)}
                              />
                              {validated && userDataError.mobile && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.mobile}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Header>
                        <h5 className="text-center w-100 card-title">Institutional Details</h5>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='class_shift'>Shift</Form.Label>
                                 <Form.Select
                                    id="class_shift"
                                    value={userData.class_shift}
                                    isInvalid={validated && !!userDataError.class_shift}
                                    isValid={validated && userData.class_shift && !userDataError.class_shift}
                                    onChange={(e) => handleStudentDataChange('class_shift', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>--Select Shift--</option>
                                    <option value='01'>Morning</option>
                                    <option value='02'>Day</option>
                                    <option value='03'>Noon</option>
                                 </Form.Select>
                                 {validated && userDataError.class_shift && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.class_shift}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group>
                                 <label className="text-primary mb-2" htmlFor='class_section'>Section</label>
                                 <Select
                                    inputId="class_section"
                                    placeholder="--Select Section--"
                                    value={
                                       optionSections.find(opt => opt.value === userData.class_section) || null
                                    }
                                    onChange={(e) => e ? handleStudentDataChange('class_section', e.value) : handleStudentDataChange('class_section', '')}
                                    options={optionSections}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                              </Form.Group>
                              {validated && userDataError.class_section && (
                                 <small className='text-danger'>{userDataError.class_section}</small>
                              )}
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Label className="text-primary" htmlFor="class_roll">Class Roll</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="text"
                                 minLength={1}
                                 maxLength={5}
                                 id="class_roll"
                                 value={userData.class_roll}
                                 isInvalid={validated && !!userDataError.class_roll}
                                 isValid={validated && userData.class_roll && !userDataError.class_roll}
                                 onChange={(e) => handleStudentDataChange('class_roll', e.target.value)}
                              />
                              {validated && userDataError.class_roll && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.class_roll}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     {searchError && <i className='w-100 text-center text-danger pt-1'>শিক্ষার্থী নিবন্ধন ‍সফল হয়নি! তথ্যগুলি সঠিকভাবে পূরণ করে পুনরায় চেষ্টা করুন।</i>}
                     <Card.Body className="d-flex justify-content-center gap-3">
                        {counReset === 0 && <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset Form</Button>}
                        {counReset >= 1 && <Button className='flex-fill' type="reset" variant="btn btn-danger">Return Search</Button>}
                        <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit Form</Button>
                     </Card.Body>
                  </Card>
               </Form>
            </Col>
         </Row>
         <Modal
            show={modalError}
            onHide={() => setModalError(false)}
            backdrop="static"
            keyboard={false}
         >
            <Modal.Header closeButton>
               <Modal.Title><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {Object.entries(userDataError).map(([field, error]) => (
                  <i className='text-danger' key={field}>{field}, </i>
               ))}
               {profileImageError && <i className='text-danger'>student's image</i>}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setModalError(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   )

   // Return if User is Authorized
   if (permissionData.type === '13' || permissionData.office === '05' || permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase w-100 card-title"}>শিক্ষার্থী নিবন্ধন ফর্ম</h4>
                  </Card.Body>
               </Card>
            </Col>

            <Col md={12}>
               <Form noValidate onSubmit={handleSearch} onReset={handleSearchReset}>
                  <Card>
                     <Card.Header>
                        <h5 className="text-center w-100 card-title">নিবন্ধনের তথ্য</h5>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col md={12}>
                              {searchLoading && <h6 className="text-uppercase text-center py-2 text-info">{searchLoading}</h6>}
                              {searchError && <h6 className="text-uppercase text-center py-2 text-danger">{searchError}</h6>}
                              {searchSuccess && <h6 className="text-uppercase text-center py-2 text-success">{searchSuccess}</h6>}
                           </Col>
                           {permissionData.type !== '13' && <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_eiin">EIIN</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 maxLength={6} minLength={6}
                                 value={searchData.user_eiin}
                                 isInvalid={validated && !!searchDataError.user_eiin}
                                 isValid={validated && searchData.user_eiin && !searchDataError.user_eiin}
                                 onChange={(e) => handleSearchDataChange('user_eiin', e.target.value)}
                              />
                              {validated && searchDataError.user_eiin && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_eiin}
                                 </Form.Control.Feedback>
                              )}
                           </Col>}
                           <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_session">Session/Year</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_session"
                                 maxLength={4} minLength={4}
                                 value={searchData.user_session}
                                 isInvalid={validated && !!searchDataError.user_session}
                                 isValid={validated && searchData.user_session && !searchDataError.user_session}
                                 onChange={(e) => handleSearchDataChange('user_session', e.target.value)}
                              />
                              {validated && searchDataError.user_session && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_session}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>Class</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={searchData.user_class}
                                    isInvalid={validated && !!searchDataError.user_class}
                                    isValid={validated && searchData.user_class && !searchDataError.user_class}
                                    onChange={(e) => handleSearchDataChange('user_class', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Class--</option>
                                    {(permissionData.office === "05" || permissionData.office === "80" || permissionData.role === "17") && <>
                                       <option value='06'>Six</option>
                                       <option value='07'>Seven</option>
                                       <option value='08'>Eight</option>
                                       <option value='09'>Nine</option>
                                       <option value='10'>Ten</option>
                                    </>}
                                    {(permissionData.office === "04" || permissionData.type === "90" || permissionData.role === "17") && <>
                                       <option value='11'>Eleven</option>
                                       <option value='12'>Twelve</option>
                                    </>}
                                 </Form.Select>
                                 {validated && searchDataError.user_class && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_class}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_group'>Group</Form.Label>
                                 <Form.Select
                                    id="user_group"
                                    value={searchData.user_group}
                                    isInvalid={validated && !!searchDataError.user_group}
                                    isValid={validated && searchData.user_group && !searchDataError.user_group}
                                    onChange={(e) => handleSearchDataChange('user_group', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Group--</option>
                                    {(searchData.user_class < 13 && searchData.user_class > 8) && <>
                                       <option value='01'>Science</option>
                                       <option value='02'>Huminities</option>
                                       <option value='03'>Business Studies</option>
                                    </>}
                                    {(searchData.user_class < 9 && searchData.user_class > 5) &&
                                       <option value='10'>General</option>}
                                 </Form.Select>
                                 {validated && searchDataError.user_group && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_group}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_version'>Version</Form.Label>
                                 <Form.Select
                                    id="user_version"
                                    value={searchData.user_version}
                                    isInvalid={validated && !!searchDataError.user_version}
                                    isValid={validated && searchData.user_version && !searchDataError.user_version}
                                    onChange={(e) => handleSearchDataChange('user_version', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Version--</option>
                                    <option value='01'>Bangla</option>
                                    <option value='02'>English</option>
                                 </Form.Select>
                                 {validated && searchDataError.user_version && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_version}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_application'>Application Type</Form.Label>
                                 <Form.Select
                                    id="user_application"
                                    value={searchData.user_application}
                                    isInvalid={validated && !!searchDataError.user_application}
                                    isValid={validated && searchData.user_application && !searchDataError.user_application}
                                    onChange={(e) => handleSearchDataChange('user_application', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Application Type--</option>
                                    <option value='01'>Regular</option>
                                    <option value='02'>Late</option>
                                    <option value='03'>Special</option>
                                 </Form.Select>
                                 {validated && searchDataError.user_application && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_application}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit</Button>
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

export default FormFillupNew;