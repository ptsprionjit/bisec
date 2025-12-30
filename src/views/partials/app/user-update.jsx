import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';

import Select from 'react-select'

import { Row, Col, Image, Button, Form, Modal } from 'react-bootstrap'
import Card from '../../../components/Card'

import { Link, useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const UserProfile = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (loading) {
            return;
         } else if (!permissionData) {
            navigate("/auth/sign-out", { replace: true });
         } else {

         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   const [profileImage, setProfileImage] = useState(null);
   const [profileImagePreview, setProfileImagePreview] = useState(null);
   const [profileImageFile, setProfileImageFile] = useState(null);
   const [profileImageError, setProfileImageError] = useState(null);

   const [profileSign, setProfileSign] = useState(null);
   const [profileSignPreview, setProfileSignPreview] = useState(null);
   const [profileSignFile, setProfileSignFile] = useState(null);
   const [profileSignError, setProfileSignError] = useState(null);

   const [fetchedData, setFetchedData] = useState([]);

   const [validated, setValidated] = useState(false);
   const [userData, setUserData] = useState({
      inst_post: '', inst_address: '', inst_email: '', inst_mobile: '', inst_region: '', id_status: '', id_version: '', id_coed: '', id_group: '', id_bank: '', inst_branch: '', inst_routing: '', inst_account: '', en_father: '', en_mother: '', id_gender: '', id_religion: '', user_id_number: '', user_dob: '', id_quota: '', id_disability: '', en_dist: '', id_uzps: '', profile_post: '', profile_address: '', profile_email: '', profile_mobile: '', en_first_office: '', en_first_section: '', id_first_post: '', first_post_date: '', en_last_office: '', en_last_section: '', id_last_post: '', last_post_date: '', profile_branch: '', profile_routing: '', profile_account: ''
   });
   const [userDataError, setUserDataError] = useState([]);
   const [userBnError, setUserBnError] = useState({
      en_father: 'পিতার নাম', en_mother: 'মাতার নাম', id_gender: 'লিঙ্গ', id_religion: 'ধর্ম', user_id_number: 'এনআইডি নম্বর', user_dob: 'জন্ম তারিখ', id_quota: 'কোটা', id_disability: 'অক্ষমতা', en_dist: 'জেলা', id_uzps: 'উপজেলা', profile_post: 'ডাকঘর', profile_address: 'ঠিকানা', profile_email: 'ইমেইল', profile_mobile: 'মোবাইল', en_first_office: 'প্রথম অফিস', en_first_section: 'প্রথম শাখা', id_first_post: 'প্রথম পদবী', first_post_date: 'প্রথম যোগদান', en_last_office: 'বর্তমান অফিস', en_last_section: 'বর্তমান শাখা', id_last_post: 'বর্তমান পদবী', last_post_date: 'বর্তমান যোগদান', id_bank: 'ব্যাংকের নাম', profile_branch: 'ব্যাংকের শাখা', profile_routing: 'রাউটিং নম্বর', profile_account: 'একাউন্ট নম্বর', inst_post: 'ডাকঘর', inst_address: 'ঠিকানা', inst_email: 'ইমেইল', inst_mobile: 'মোবাইল', inst_region: 'এলাকা', id_status: 'প্রতিষ্ঠানের পর্যায়', id_version: 'প্রতিষ্ঠানের মাধ্যম', id_coed: 'প্রতিষ্ঠানের ধরণ', id_group: 'প্রতিষ্ঠানের বিভাগ', inst_branch: 'শাখার নাম', inst_routing: 'রাউটিং নম্বর', inst_account: 'একাউন্ট নম্বর'
   });

   // Modal Variales
   const [modalError, setModalError] = useState(false);

   const [addressList, setAddressList] = useState([]);

   const [optionDistList, setOptionDistList] = useState([]);
   const [optionUpazilaList, setOptionUpazilaList] = useState([]);

   const [bankList, setBankList] = useState([]);
   const [optionBankList, setOptionBankList] = useState([]);

   const [boardOffices, setBoardOffices] = useState([]);
   const [optionBoardOffices, setOptionBoardOffices] = useState([]);

   const [optionStartSections, setOptionStartSections] = useState([]);
   const [optionStartDesignations, setOptionStartDesignations] = useState([]);

   const [optionLastSections, setOptionLastSections] = useState([]);
   const [optionLastDesignations, setOptionLastDesignations] = useState([]);


   //Data Fetch Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [updateMessage, setUpdateMessage] = useState(false);

   const handleProfileImageSelect = (e) => {
      const file = e.target.files[0];

      if (profileImagePreview) {
         URL.revokeObjectURL(profileImagePreview); // Free up memory
      }

      if (!(file?.type === 'image/jpg' || file?.type === 'image/jpeg')) {
         setProfileImageError('JPG/JPEG ফাইল সিলেক্ট করতে হবে');
         return;
      }

      if (file?.size > 1024 * 1024 || file?.size < 1 * 1024) {
         setProfileImageError('ফাইল ১ কিলোবাইট থেকে ১ এমবি হতে হবে');
         return;
      }

      setProfileImageError(file.name);
      setProfileImageFile(file);
      setProfileImagePreview(URL.createObjectURL(file));
   };

   const handleProfileImageSave = async (e) => {
      e.preventDefault();

      if (!profileImageFile) {
         setProfileImageError("ছবি সিলেক্ট করতে হবে!");
         return;
      }

      const formData = new FormData();
      formData.append('image', profileImageFile);

      try {
         const response = await axiosApi.post(`/user/image-update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });
         if (response.status === 200) {
            setProfileImageError("ছবি আপ্লোড করা হয়েছে");
            setProfileImagePreview(null);
            setProfileImageFile(null);
            setProfileImage(URL.createObjectURL(profileImageFile)); // Update the profile image preview
         }
      } catch (err) {

         // console.error('Error uploading image:', err);
         if (err.status === 401) {
            navigate("/auth/sign-out");

         }
      }
   };

   const handleProfileSignSelect = (e) => {
      const file = e.target.files[0];

      if (profileSignPreview) {
         URL.revokeObjectURL(profileSignPreview); // Free up memory
      }

      if (!(file?.type === 'image/jpg' || file?.type === 'image/jpeg')) {
         setProfileSignError('JPG/JPEG ফাইল সিলেক্ট করতে হবে');
         return;
      }

      if (file?.size > 1024 * 1024 || file?.size < 1 * 1024) {
         setProfileSignError('ফাইল ১ কিলোবাইট থেকে ১ এমবি হতে হবে');
         return;
      }

      setProfileSignError(file.name);
      setProfileSignFile(file);
      setProfileSignPreview(URL.createObjectURL(file));
   };

   const handleProfileSignSave = async (e) => {
      e.preventDefault();

      if (!profileSignFile) {
         setProfileSignError("স্বাক্ষর সিলেক্ট করুন");
         return;
      }

      const formData = new FormData();
      formData.append('image', profileSignFile);

      try {
         const response = await axiosApi.post(`/user/sign-update`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
         });
         if (response.status === 200) {
            setProfileSignError("স্বাক্ষর আপ্লোড করা হয়েছে");
            setProfileSignPreview(null);
            setProfileSignFile(null);
            setProfileSign(URL.createObjectURL(profileSignFile)); // Update the profile image preview
         }
      } catch (err) {

         // console.error('Error uploading signature:', err);
         if (err.status === 401) {
            navigate("/auth/sign-out");

         }
      }
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      const form = event.currentTarget;
      let isValid = true;
      setUserDataError([]);
      setUpdateMessage(false);
      setLoadingError(false);
      const newErrors = {}; // Collect errors in one place
      var myData = {};

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         if (permissionData.type === '13') {
            myData = {
               en_dist: userData.en_dist, id_uzps: userData.id_uzps, inst_post: userData.inst_post, inst_address: userData.inst_address, inst_email: userData.inst_email, inst_mobile: userData.inst_mobile, inst_region: userData.inst_region, id_status: userData.id_status, id_version: userData.id_version, id_coed: userData.id_coed, id_group: userData.id_group, first_post_date: userData.first_post_date, last_post_date: userData.last_post_date, id_bank: userData.id_bank, inst_branch: userData.inst_branch, inst_routing: userData.inst_routing, inst_account: userData.inst_account
            }

            const requiredFields = [
               'en_dist', 'id_uzps', 'inst_post', 'inst_address', 'inst_email', 'inst_mobile', 'inst_region', 'id_status', 'id_version', 'id_coed', 'id_group', 'first_post_date', 'last_post_date', 'id_bank', 'inst_branch', 'inst_routing', 'inst_account'
            ];

            requiredFields.forEach(field => {
               let dataError = null;

               switch (field) {
                  case 'first_post_date':
                  case 'last_post_date':
                     dataError = ValidationInput.dateCheck(
                        userData[field],
                        '1901-01-01',
                        new Date().toISOString().split('T')[0]
                     );
                     break;

                  case 'id_uzps':
                  case 'inst_region':
                  case 'id_status':
                  case 'id_version':
                  case 'id_coed':
                  case 'id_group':
                  case 'inst_mobile':
                  case 'id_bank':
                  case 'inst_routing':
                  case 'inst_account':
                     dataError = ValidationInput.numberCheck(userData[field]);
                     break;

                  case 'en_dist':
                  case 'inst_post':
                  case 'inst_address':
                  case 'inst_branch':
                     dataError = ValidationInput.addressCheck(userData[field]);
                     break;

                  case 'inst_email':
                     dataError = ValidationInput.emailCheck(userData[field]);
                     break;

                  default:
                     break;
               }

               if (dataError) {
                  newErrors[field] = dataError;
                  isValid = false;
                  setValidated(false);
                  // console.log(`${field}: ${dataError}, ${userData[field]}`);
               }
            });
         } else {
            myData = {
               en_father: userData.en_father, en_mother: userData.en_mother, id_gender: userData.id_gender, id_religion: userData.id_religion, user_id_number: userData.user_id_number, user_dob: userData.user_dob, id_quota: userData.id_quota, id_disability: userData.id_disability, en_dist: userData.en_dist, id_uzps: userData.id_uzps, profile_post: userData.profile_post, profile_address: userData.profile_address, profile_email: userData.profile_email, profile_mobile: userData.profile_mobile, en_first_office: userData.en_first_office, en_first_section: userData.en_first_section, id_first_post: userData.id_first_post, first_post_date: userData.first_post_date, en_last_office: userData.en_last_office, en_last_section: userData.en_last_section, id_last_post: userData.id_last_post, last_post_date: userData.last_post_date, id_bank: userData.id_bank, profile_branch: userData.profile_branch, profile_routing: userData.profile_routing, profile_account: userData.profile_account
            }

            const requiredFields = [
               'en_father', 'en_mother', 'id_gender', 'id_religion', 'user_id_number', 'user_dob', 'id_quota', 'id_disability', 'en_dist', 'id_uzps', 'profile_post', 'profile_address', 'profile_email', 'profile_mobile', 'en_first_office', 'en_first_section', 'id_first_post', 'first_post_date', 'en_last_office', 'en_last_section', 'id_last_post', 'last_post_date', 'id_bank', 'profile_branch', 'profile_routing', 'profile_account'
            ];

            requiredFields.forEach(field => {
               let dataError = null;

               switch (field) {
                  case 'en_father':
                  case 'en_mother':
                     dataError = ValidationInput.alphaCheck(userData[field]);
                     break;

                  case 'user_dob':
                  case 'first_post_date':
                  case 'last_post_date':
                     dataError = ValidationInput.dateCheck(
                        userData[field],
                        '1901-01-01',
                        new Date().toISOString().split('T')[0]
                     );
                     break;

                  case 'id_gender':
                  case 'id_religion':
                  case 'user_id_number':
                  case 'id_quota':
                  case 'id_disability':
                  case 'id_uzps':
                  case 'profile_mobile':
                  case 'id_first_post':
                  case 'id_last_post':
                  case 'id_bank':
                  case 'profile_routing':
                  case 'profile_account':
                     dataError = ValidationInput.numberCheck(userData[field]);
                     break;

                  case 'en_dist':
                  case 'profile_post':
                  case 'profile_address':
                  case 'en_first_office':
                  case 'en_first_section':
                  case 'en_last_office':
                  case 'en_last_section':
                  case 'profile_branch':
                     dataError = ValidationInput.addressCheck(userData[field]);
                     break;

                  case 'profile_email':
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
         }

         // Update once
         setUserDataError(newErrors);

         // console.log(newErrors);

         if (!isValid) {
            setModalError(true);
            event.stopPropagation();
         } else {
            setLoadingData("আপডেট করা হচ্ছে... অপেক্ষা করুন...");
            try {
               const response = await axiosApi.post(`/user/update`, { userData: myData });
               if (response.status === 200) {
                  setUpdateMessage(response.data.message);
               } else {
                  setLoadingError(response.data.message);
               }
            } catch (err) {
               setLoadingError(err.response.data.message);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
            } finally {
               setLoadingData(false);
            }
         }
      }
      setValidated(true);
   };

   //Handle Data Change
   const handleDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue });
      setUserDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   const handleReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setUserDataError([]);
      setUserData(fetchedData);
      setValidated(false);
      setUpdateMessage(false);
   };

   //Handle Office Change
   // const handleStartOfficeChange = (e) => {
   //    setUserData({ ...userData, en_first_office: e.target.value, en_first_section: '', id_first_post: '' });
   //    setOptionStartSections([]);
   //    setOptionStartDesignations([]);
   // };

   //Handle Office Change
   // const handleStartSectionChange = (e) => {
   //    setUserData({ ...userData, en_first_section: e.target.value, id_first_post: '' });
   //    setOptionStartDesignations([]);
   // };

   //Handle Office Change
   // const handleLastOfficeChange = (e) => {
   //    setUserData({ ...userData, en_last_office: e.target.value, en_last_section: '', id_last_post: '' });
   //    setOptionLastSections([]);
   //    setOptionLastDesignations([]);
   // };

   //Handle Office Change
   // const handleLastSectionChange = (e) => {
   //    setUserData({ ...userData, en_last_section: e.target.value, id_last_post: '' });
   //    setOptionLastDesignations([]);
   // };

   // Cleanup old Blob URL
   useEffect(() => {
      return () => {
         if (profileImage) {
            URL.revokeObjectURL(profileImage);
         }
         if (profileImagePreview) {
            URL.revokeObjectURL(profileImagePreview);
         }
         if (profileSign) {
            URL.revokeObjectURL(profileSign);
         }
         if (profileSignPreview) {
            URL.revokeObjectURL(profileSignPreview);
         }
      };
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch User Data
   useEffect(() => {
      const fetchProfileImage = async () => {
         await axiosApi.post(`/user/image-fetch`, {}, { responseType: 'blob' })
            .then(response => {
               const profile_image = URL.createObjectURL(response.data);
               setProfileImage(profile_image);
               if (profileImage) {
                  URL.revokeObjectURL(profile_image); // Free up memory
               }
            })
            .catch(err => {
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
            });
      };

      fetchProfileImage();

      const fetchProfileSign = async () => {
         await axiosApi.post(`/user/sign-fetch?`, {}, { responseType: 'blob' })
            .then(response => {
               const profile_sign = URL.createObjectURL(response.data);
               setProfileSign(profile_sign);
               if (profileSign) {
                  URL.revokeObjectURL(profile_sign); // Free up memory
               }
            })
            .catch(err => {
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
            });
      };

      fetchProfileSign();

      const fetchAddress = async () => {
         setLoadingData("জেলা/উপজেলার তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...");
         try {
            const response = await axiosApi.post(`/address/address-list`);
            // setDistricts(response.data);
            await setAddressList(response.data);
            // console.log(response.data);
         } catch (err) {
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchAddress();

      const fetchOffice = async () => {
         setLoadingData("বোর্ডের অফিস/পদবী খুঁজা হচ্ছে... অপেক্ষা করুন...");
         try {
            const response = await axiosApi.post(`/user/designation-list`);
            // setStartOffices(response.data);
            // setLastOffices(response.data);
            await setBoardOffices(response.data);
         } catch (err) {
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchOffice();

      const fetchBank = async () => {
         setLoadingData("ব্যাংকের তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...");
         try {
            const response = await axiosApi.post(`/bank-list`);
            // setBanks(response.data);
            await setBankList(response.data);
         } catch (err) {
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchBank();

      const fetchProfileData = async () => {
         setLoadingData("প্রোফাইল ডাটা লোড করা হচ্ছে... অপেক্ষা করুন...");
         try {
            const response = await axiosApi.post(`/user/details`);
            setFetchedData(response.data.data);
            setUserData(response.data.data);
         } catch (err) {
            setLoadingError(err.message);
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchProfileData();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Office List
   useEffect(() => {
      if (boardOffices.length > 0) {
         if (permissionData.type !== '13') {
            const newOptions = boardOffices.map(data => ({
               value: data.en_office,
               label: data.bn_office
            }));
            const uniqueValues = Array.from(
               new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionBoardOffices(uniqueValues);
         } else {
            const filteredData = boardOffices.filter(
               item => item.id_post === '244' || item.id_post === '245' || item.id_post === '246' || item.id_post === '247' || item.id_post === '248'
            );
            const newOptions = filteredData.map(data => ({
               value: data.en_office,
               label: data.bn_office
            }));
            const uniqueValues = Array.from(
               new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionBoardOffices(uniqueValues);
         }
      }
   }, [userData.en_user, boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Start Section
   useEffect(() => {
      if (boardOffices.length > 0) {
         const filteredData = boardOffices.filter(
            item => item.en_office === userData.en_first_office
         );
         const newOptions = filteredData.map(data => ({
            value: data.en_section,
            label: data.bn_section
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionStartSections(uniqueValues);
      }
   }, [userData.en_first_office, boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Last Section
   useEffect(() => {
      if (boardOffices.length > 0) {
         const filteredData = boardOffices.filter(
            item => item.en_office === userData.en_last_office
         );
         const newOptions = filteredData.map(data => ({
            value: data.en_section,
            label: data.bn_section
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionLastSections(uniqueValues);
      }
   }, [userData.en_last_office, boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Start Designation
   useEffect(() => {
      if (boardOffices.length > 0) {
         const filteredData = boardOffices.filter(
            item => item.en_section === userData.en_first_section
         );
         const newOptions = filteredData.map(data => ({
            value: data.id_post,
            label: data.bn_post
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionStartDesignations(uniqueValues);
      }
   }, [userData.en_first_section, boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Last Designation
   useEffect(() => {
      if (boardOffices.length > 0) {
         const filteredData = boardOffices.filter(
            item => item.en_section === userData.en_last_section
         );
         const newOptions = filteredData.map(data => ({
            value: data.id_post,
            label: data.bn_post
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionLastDesignations(uniqueValues);
      }
   }, [userData.en_last_section, boardOffices]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option District List
   useEffect(() => {
      if (addressList.length > 0) {
         const newOptions = addressList.map(data => ({
            value: data.en_dist,
            label: data.bn_dist
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionDistList(uniqueValues);
      }
   }, [userData.en_user, addressList]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Upazila List
   useEffect(() => {
      if (addressList.length > 0) {
         const filteredData = addressList.filter(
            item => item.en_dist === userData.en_dist
         );
         const newOptions = filteredData.map(data => ({
            value: data.id_uzps,
            label: data.bn_uzps
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionUpazilaList(uniqueValues);
      }
   }, [userData.en_dist, addressList]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Bank List
   useEffect(() => {
      if (bankList.length > 0) {
         const newOptions = bankList.map(data => ({
            value: data.id_bank,
            label: data.bn_bank
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionBankList(uniqueValues);
      }
   }, [userData.en_user, addressList]); // eslint-disable-line react-hooks/exhaustive-deps

   // const [toggler, setToggler] = useState();

   if (permissionData.type === '13') return (
      <Fragment>
         <Row>
            <Col lg="12">
               <Card>
                  <Card.Body>
                     <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <div className="d-flex flex-wrap align-items-center">
                           <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                              <Image className="img-fluid rounded-pill avatar-100" src={profileImage} alt="profile-pic" />
                           </div>
                           <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                              <h4 className="text-uppercase me-2 h4">{permissionData.name}</h4>
                              <span className="text-capitalize"> - {permissionData.post}</span>
                           </div>
                        </div>
                     </div>
                  </Card.Body>
               </Card>
            </Col>

            <Col lg='3'>
               <Card>
                  <Card.Body>
                     <h5 className='text-center my-2'>প্রতিষ্ঠানের ছবি/লগো</h5>
                     <div className="form-group d-flex flex-column align-items-center align-content-center justify-content-center">
                        <div className="profile-img-edit position-relative d-flex justify-content-center">
                           {profileImagePreview && <Image className="avatar-120 img-thumbnail" src={profileImagePreview} alt="Profile Picture" />}
                           {!profileImagePreview && <Image className="avatar-120 img-thumbnail" src={profileImage} alt="Profile Picture" />}
                           <div className="upload-icone bg-primary">
                              <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                 <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                              </svg>
                              <input className="form-control-file position-absolute top-50 start-50 translate-middle opacity-0" type="file" accept=".jpg,.jpeg" onChange={handleProfileImageSelect} />
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="d-inline-block my-2">
                              <span>Only</span>{' '}
                              <Link to="#">.jpg</Link>{' '}
                              <Link to="#">.jpeg</Link>{' '}
                              <span>image allowed</span>{' of Size '}
                              <Link to="#">{"<100kb"}</Link>{' & Dimentions ='}
                              <Link to="#">{'300x300'}</Link>{'px'}
                           </div>
                        </div>
                     </div>
                     <div className='d-flex justify-content-center'>
                        <Button onClick={handleProfileImageSave} variant="btn btn-primary">আপলোড</Button>
                     </div>
                     <h6 className='text-center text-warning py-2'>{profileImageError}</h6>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Body>
                     <h5 className='text-center my-2'>প্রতিষ্ঠান প্রধানের স্বাক্ষর</h5>
                     <div className="form-group d-flex flex-column align-items-center align-content-center justify-content-center">
                        <div className="profile-img-edit position-relative d-flex justify-content-center">
                           {profileSignPreview && <Image className="p-2 w-75 img-thumbnail" src={profileSignPreview} alt="Profile Signature" />}
                           {!profileSignPreview && <Image className="p-2 w-75 img-thumbnail" src={profileSign} alt="Profile Signature" />}
                           <div className="upload-icone bg-primary">
                              <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                 <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                              </svg>
                              <input className="form-control-file position-absolute top-50 start-50 translate-middle opacity-0" type="file" accept=".jpg,.jpeg" onChange={handleProfileSignSelect} />
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="d-inline-block my-2">
                              <span>Only</span>{' '}
                              <Link to="#">.jpg</Link>{' '}
                              <Link to="#">.jpeg</Link>{' '}
                              <span>image allowed</span>{' of Size '}
                              <Link to="#">{"<100kb"}</Link>{' & Dimentions ='}
                              <Link to="#">{'300x80'}</Link>{'px'}
                           </div>
                        </div>
                     </div>
                     <div className='d-flex justify-content-center'>
                        <Button onClick={handleProfileSignSave} variant="btn btn-primary">আপলোড</Button>
                     </div>
                     <h6 className='text-center text-warning py-2'>{profileSignError}</h6>
                  </Card.Body>
               </Card>
            </Col>

            <Col lg='9'>
               <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                  <Card>
                     <Card.Body>
                        <Row>
                           <Col className="my-2" md={12}>
                              {loadingData && <h6 className="text-center card-title w-100 text-info">{loadingData}</h6>}
                              {loadingError && <h6 className="text-center card-title w-100 text-danger">{loadingError}</h6>}
                              {updateMessage && <h6 className="text-center card-title w-100 text-success">{updateMessage}</h6>}
                           </Col>
                           <Col className='m-0 p-0' md={12}>
                              <h5 className="text-center w-100 card-title">সাধারণ তথ্য</h5>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_name">নাম (ইংরেজি)</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_name"
                                 defaultValue={userData.en_user}
                                 disabled
                              />
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_id">নাম (বাংলা)</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text" id="user_id"
                                 defaultValue={userData.bn_user}
                                 disabled
                              />
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_dist'>জেলা</Form.Label>
                                 <Select
                                    inputId="en_dist"
                                    placeholder="--জেলা সিলেক্ট করুন--"
                                    value={
                                       optionDistList.find(opt => opt.value === userData.en_dist) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_dist', value.value) : handleDataChange('en_dist', '')
                                    }
                                    options={optionDistList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_dist && (
                                    <p className='text-danger'>
                                       {userDataError.en_dist}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_uzps'>উপজেলা</Form.Label>
                                 <Select
                                    inputId="id_uzps"
                                    placeholder="--উপজেলা সিলেক্ট করুন--"
                                    value={
                                       optionUpazilaList.find(opt => opt.value === userData.id_uzps) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_uzps', value.value) : handleDataChange('id_uzps', '')
                                    }
                                    options={optionUpazilaList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_uzps && (
                                    <p className='text-danger'>
                                       {userDataError.id_uzps}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_post">ডাকঘর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="inst_post"
                                 value={userData.inst_post}
                                 isInvalid={validated && !!userDataError.inst_post}
                                 isValid={validated && userData.inst_post && !userDataError.inst_post}
                                 onChange={(e) => handleDataChange('inst_post', e.target.value)}
                              />
                              {validated && userDataError.inst_post && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_post}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_address">ঠিকানা</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="inst_address"
                                 value={userData.inst_address}
                                 isInvalid={validated && !!userDataError.inst_address}
                                 isValid={validated && userData.inst_address && !userDataError.inst_address}
                                 onChange={(e) => handleDataChange('inst_address', e.target.value)}
                              />
                              {validated && userDataError.inst_address && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_address}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_email">ইমেইল</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="email"
                                 id="inst_email"
                                 value={userData.inst_email}
                                 isInvalid={validated && !!userDataError.inst_email}
                                 isValid={validated && userData.inst_email && !userDataError.inst_email}
                                 onChange={(e) => handleDataChange('inst_email', e.target.value)}
                              />
                              {validated && userDataError.inst_email && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_email}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_mobile">মোবাইল</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="text"
                                 // minLength={11}
                                 maxLength={11}
                                 id="inst_mobile"
                                 value={userData.inst_mobile}
                                 isInvalid={validated && !!userDataError.inst_mobile}
                                 isValid={validated && userData.inst_mobile && !userDataError.inst_mobile}
                                 onChange={(e) => handleDataChange('inst_mobile', e.target.value)}
                              />
                              {validated && userDataError.inst_mobile && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_mobile}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='m-0 p-0 pt-3' md={12}>
                              <h5 className="text-center w-100 card-title">অন্যান্য তথ্য</h5>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='inst_region'>প্রতিষ্ঠানের এলাকা</Form.Label>
                                 <Form.Select
                                    id="inst_region"
                                    value={userData.inst_region}
                                    isInvalid={validated && !!userDataError.inst_region}
                                    isValid={validated && userData.inst_region && !userDataError.inst_region}
                                    onChange={(e) => handleDataChange('inst_region', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>-- প্রতিষ্ঠানের এলাকা সিলেক্ট করুন --</option>
                                    <option value='01'>সিটি কর্পোরেশন এলাকা</option>
                                    <option value='02'>পৌরসভা এলাকা (প্রথম শ্রেণী)</option>
                                    <option value='03'>মফস্বল এলাকা</option>
                                 </Form.Select>
                                 {validated && userDataError.inst_region && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.inst_region}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_status'>প্রতিষ্ঠানের পর্যায়</Form.Label>
                                 <Form.Select
                                    id="id_status"
                                    value={userData.id_status}
                                    isInvalid={validated && !!userDataError.id_status}
                                    isValid={validated && userData.id_status && !userDataError.id_status}
                                    onChange={(e) => handleDataChange('id_status', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>-- প্রতিষ্ঠানের পর্যায় সিলেক্ট করুন --</option>
                                    <option value='11'>নিম্ন মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ৮ম শ্রেণী)</option>
                                    <option value='12'>মাধ্যমিক বিদ্যালয় (৯ম থেকে ১০ম শ্রেণী)</option>
                                    <option value='13'>উচ্চমাধ্যমিক মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>
                                    <option value='17'>নিম্ন মাধ্যমিক এবং মাধ্যমিক (৬ষ্ঠ থেকে ১০ম শ্রেণী)</option>
                                    <option value='19'>মাধ্যমিক এবং উচ্চমাধ্যমিক (৯ম থেকে ১২শ শ্রেণী)</option>
                                    <option value='20'>উচ্চমাধ্যমিক বিদ্যালয় ও মহাবিদ্যালয় (৬ষ্ঠ থেকে ১২শ শ্রেণী)</option>
                                 </Form.Select>
                                 {validated && userDataError.id_status && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_status}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={4}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_coed'>প্রতিষ্ঠানের ধরণ</Form.Label>
                                 <Form.Select
                                    id="id_coed"
                                    value={userData.id_coed}
                                    isInvalid={validated && !!userDataError.id_coed}
                                    isValid={validated && userData.id_coed && !userDataError.id_coed}
                                    onChange={(e) => handleDataChange('id_coed', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>-- প্রতিষ্ঠানের ধরণ সিলেক্ট করুন --</option>
                                    {userData.inst_status !== '13' && <>
                                       <option value='01'>বালক</option>
                                       <option value='02'>বালিকা</option>
                                    </>}
                                    <option value='03'>সহশিক্ষা</option>
                                    {userData.inst_status === '13' && <option value='04'>মহিলা কলেজ</option>}
                                 </Form.Select>
                                 {validated && userDataError.id_coed && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_coed}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_version'>প্রতিষ্ঠানের মাধ্যম</Form.Label>
                                 <Form.Select
                                    id="id_version"
                                    value={userData.id_version}
                                    isInvalid={validated && !!userDataError.id_version}
                                    isValid={validated && userData.id_version && !userDataError.id_version}
                                    onChange={(e) => handleDataChange('id_version', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>-- প্রতিষ্ঠানের মাধ্যম সিলেক্ট করুন --</option>
                                    <option value='01'>বাংলা</option>
                                    <option value='02'>ইংরেজি</option>
                                    <option value='03'>যৌথ (বাংলা ও ইংরেজি)</option>
                                 </Form.Select>
                                 {validated && userDataError.id_version && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_version}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_group'>প্রতিষ্ঠানের বিভাগ</Form.Label>
                                 <Form.Select
                                    id="id_group"
                                    value={userData.id_group}
                                    isInvalid={validated && !!userDataError.id_group}
                                    isValid={validated && userData.id_group && !userDataError.id_group}
                                    onChange={(e) => handleDataChange('id_group', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value=''>-- প্রতিষ্ঠানের বিভাগ সিলেক্ট করুন --</option>
                                    <option value='01'>বিজ্ঞান</option>
                                    <option value='02'>মানবিক</option>
                                    <option value='03'>ব্যবসায় শিক্ষা</option>
                                    <option value='04'>বিজ্ঞান ও মানবিক</option>
                                    <option value='05'>বিজ্ঞান ও ব্যবসায় শিক্ষা</option>
                                    <option value='06'>মানবিক ও ব্যবসায় শিক্ষা</option>
                                    <option value='07'>বিজ্ঞান, মানবিক ও ব্যবসায় শিক্ষা</option>
                                    <option value='10'>সাধারণ</option>
                                 </Form.Select>
                                 {validated && userDataError.id_group && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_group}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="first_post_date">স্থাপনের তারিখ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="date"
                                 id="first_post_date"
                                 value={userData.first_post_date}
                                 isInvalid={validated && !!userDataError.first_post_date}
                                 isValid={validated && userData.first_post_date && !userDataError.first_post_date}
                                 onChange={(e) => handleDataChange('first_post_date', e.target.value)}
                              />
                              {validated && userDataError.first_post_date && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.first_post_date}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="last_post_date">সর্বশেষ পর্যায়/মাধ্যম/বিভাগ পরবির্তন</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="date"
                                 id="last_post_date"
                                 value={userData.last_post_date}
                                 isInvalid={validated && !!userDataError.last_post_date}
                                 isValid={validated && userData.last_post_date && !userDataError.last_post_date}
                                 onChange={(e) => handleDataChange('last_post_date', e.target.value)}
                              />
                              {validated && userDataError.last_post_date && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.last_post_date}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='m-0 p-0 pt-3' md={12}>
                              <h5 className="text-center w-100 card-title">ব্যাংক তথ্য</h5>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_bank'>ব্যাংকের নাম</Form.Label>
                                 <Select
                                    inputId="id_bank"
                                    placeholder="--ব্যাংক সিলেক্ট করুন--"
                                    value={
                                       optionBankList.find(opt => opt.value === userData.id_bank) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_bank', value.value) : handleDataChange('id_bank', '')
                                    }
                                    options={optionBankList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_bank && (
                                    <p className='text-danger'>
                                       {userDataError.id_bank}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_branch">শাখার নাম</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="inst_branch"
                                 value={userData.inst_branch}
                                 isInvalid={validated && !!userDataError.inst_branch}
                                 isValid={validated && userData.inst_branch && !userDataError.inst_branch}
                                 onChange={(e) => handleDataChange('inst_branch', e.target.value)}
                              />
                              {validated && userDataError.inst_branch && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_branch}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_routing">রাউটিং নম্বর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 // minLength={9}
                                 maxLength={9}
                                 type="text"
                                 id="inst_routing"
                                 value={userData.inst_routing}
                                 isInvalid={validated && !!userDataError.inst_routing}
                                 isValid={validated && userData.inst_routing && !userDataError.inst_routing}
                                 onChange={(e) => handleDataChange('inst_routing', e.target.value)}
                              />
                              {validated && userDataError.inst_routing && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_routing}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="inst_account">হিসাব নম্বর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 // minLength={13}
                                 maxLength={17}
                                 type="text"
                                 id="inst_account"
                                 value={userData.inst_account}
                                 isInvalid={validated && !!userDataError.inst_account}
                                 isValid={validated && userData.inst_account && !userDataError.inst_account}
                                 onChange={(e) => handleDataChange('inst_account', e.target.value)}
                              />
                              {validated && userDataError.inst_account && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.inst_account}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Body className="d-flex justify-content-center gap-3">
                        <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                        <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
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
               <Modal.Title><span className={styles.SiyamRupaliFont}>নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {Object.entries(userDataError).map(([field, error]) => (
                  <i className='text-danger' key={field}>{userBnError[field]}, </i>
               ))}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setModalError(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   )

   if (permissionData.type !== '13') return (
      <Fragment>
         <Row>
            <Col lg="12">
               <Card>
                  <Card.Body>
                     <div className="d-flex flex-wrap align-items-center justify-content-between">
                        <div className="d-flex flex-wrap align-items-center">
                           <div className="profile-img position-relative me-3 mb-3 mb-lg-0 profile-logo profile-logo1">
                              <Image className="img-fluid rounded-pill avatar-100" src={profileImage} alt="profile-pic" />
                           </div>
                           <div className="d-flex flex-wrap align-items-center mb-3 mb-sm-0">
                              <h4 className="text-uppercase me-2 h4">{permissionData.name}</h4>
                              <span className="text-capitalize"> - {permissionData.post}</span>
                           </div>
                        </div>
                     </div>
                  </Card.Body>
               </Card>
            </Col>

            <Col lg='3'>
               <Card>
                  <Card.Body>
                     <h5 className='text-center my-2'>প্রোফাইল ছবি</h5>
                     <div className="form-group d-flex flex-column align-items-center align-content-center justify-content-center">
                        <div className="profile-img-edit position-relative d-flex justify-content-center">
                           {profileImagePreview && <Image className="avatar-120 img-thumbnail" src={profileImagePreview} alt="Profile Picture" />}
                           {!profileImagePreview && <Image className="avatar-120 img-thumbnail" src={profileImage} alt="Profile Picture" />}
                           <div className="upload-icone bg-primary">
                              <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                 <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                              </svg>
                              <input className="form-control-file position-absolute top-50 start-50 translate-middle opacity-0" type="file" accept=".jpg,.jpeg" onChange={handleProfileImageSelect} />
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="d-inline-block my-2">
                              <span>Only</span>{' '}
                              <Link to="#">.jpg</Link>{' '}
                              <Link to="#">.jpeg</Link>{' '}
                              <span>image allowed</span>{' of Size '}
                              <Link to="#">{"<100kb"}</Link>{' & Dimentions ='}
                              <Link to="#">{'300x300'}</Link>{'px'}
                           </div>
                        </div>
                     </div>
                     <div className='d-flex justify-content-center'>
                        <Button onClick={handleProfileImageSave} variant="btn btn-primary">আপলোড</Button>
                     </div>
                     <h6 className='text-center text-warning py-2'>{profileImageError}</h6>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Body>
                     <h5 className='text-center my-2'>প্রোফাইল স্বাক্ষর</h5>
                     <div className="form-group d-flex flex-column align-items-center align-content-center justify-content-center">
                        <div className="profile-img-edit position-relative d-flex justify-content-center">
                           {profileSignPreview && <Image className="p-2 w-75 img-thumbnail" src={profileSignPreview} alt="Profile Signature" />}
                           {!profileSignPreview && <Image className="p-2 w-75 img-thumbnail" src={profileSign} alt="Profile Signature" />}
                           <div className="upload-icone bg-primary">
                              <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                 <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                              </svg>
                              <input className="form-control-file position-absolute top-50 start-50 translate-middle opacity-0" type="file" accept=".jpg,.jpeg" onChange={handleProfileSignSelect} />
                           </div>
                        </div>
                        <div className="text-center">
                           <div className="d-inline-block my-2">
                              <span>Only</span>{' '}
                              <Link to="#">.jpg</Link>{' '}
                              <Link to="#">.jpeg</Link>{' '}
                              <span>image allowed</span>{' of Size '}
                              <Link to="#">{"<100kb"}</Link>{' & Dimentions ='}
                              <Link to="#">{'300x80'}</Link>{'px'}
                           </div>
                        </div>
                     </div>
                     <div className='d-flex justify-content-center'>
                        <Button onClick={handleProfileSignSave} variant="btn btn-primary">Upload</Button>
                     </div>
                     <h6 className='text-center text-warning py-2'>{profileSignError}</h6>
                  </Card.Body>
               </Card>
            </Col>

            <Col lg='9'>
               <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                  <Card>
                     <Card.Body>
                        <Row>
                           <Col className="my-2" md={12}>
                              {loadingData && <h6 className="text-center card-title w-100 text-info">{loadingData}</h6>}
                              {loadingError && <h6 className="text-center card-title w-100 text-danger">{loadingError}</h6>}
                              {updateMessage && <h6 className="text-center card-title w-100 text-success">{updateMessage}</h6>}
                           </Col>
                           {/* <Col className='m-0 p-0' md={12}>
                              <h5 className="text-center w-100 card-title">ব্যক্তিগত তথ্য</h5>
                           </Col> */}
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="en_user">নাম (ইংরেজি)</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="en_user"
                                 defaultValue={userData.en_user}
                                 disabled
                              />
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_id">নাম (বাংলা)</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text" id="user_id"
                                 defaultValue={userData.bn_user}
                                 disabled
                              />
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="en_father">পিতার নাম</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="en_father"
                                 value={userData.en_father}
                                 isInvalid={validated && !!userDataError.en_father}
                                 isValid={validated && userData.en_father && !userDataError.en_father}
                                 onChange={(e) => handleDataChange('en_father', e.target.value)}
                              />
                              {validated && userDataError.en_father && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.en_father}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="en_mother">মাতার নাম</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="en_mother"
                                 value={userData.en_mother}
                                 isInvalid={validated && !!userDataError.en_mother}
                                 isValid={validated && userData.en_mother && !userDataError.en_mother}
                                 onChange={(e) => handleDataChange('en_mother', e.target.value)}
                              />
                              {validated && userDataError.en_mother && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.en_mother}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_gender'>লিঙ্গ</Form.Label>
                                 <Form.Select
                                    id="id_gender"
                                    value={userData.id_gender}
                                    isInvalid={validated && !!userDataError.id_gender}
                                    isValid={validated && userData.id_gender && !userDataError.id_gender}
                                    onChange={(e) => handleDataChange('id_gender', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option disabled>লিঙ্গ সিলেক্ট করুন--</option>
                                    <option value='01'>পুরুষ</option>
                                    <option value='02'>মহিলা</option>
                                    <option value='03'>অন্যান্য</option>
                                 </Form.Select>
                                 {validated && userDataError.id_gender && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_gender}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_religion'>ধর্ম</Form.Label>
                                 <Form.Select
                                    id="id_religion"
                                    value={userData.id_religion}
                                    isInvalid={validated && !!userDataError.id_religion}
                                    isValid={validated && userData.id_religion && !userDataError.id_religion}
                                    onChange={(e) => handleDataChange('id_religion', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option disabled>ধর্ম সিলেক্ট করুন--</option>
                                    <option value='01'>ইসলাম</option>
                                    <option value='02'>সনাতন</option>
                                    <option value='03'>বুদ্ধ</option>
                                    <option value='04'>খ্রিস্টান</option>
                                    <option value='99'>অন্যান্য</option>
                                 </Form.Select>
                                 {validated && userDataError.id_religion && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_religion}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_id_number">এনআইডি (NID)</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 // minLength={10}
                                 maxLength={17}
                                 id="user_id_number"
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
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="user_dob">জন্ম তারিখ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date" id="user_dob"
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
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_quota'>কোটা</Form.Label>
                                 <Form.Select
                                    id="id_quota"
                                    value={userData.id_quota}
                                    isInvalid={validated && !!userDataError.id_quota}
                                    isValid={validated && userData.id_quota && !userDataError.id_quota}
                                    onChange={(e) => handleDataChange('id_quota', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option disabled>কোটা সিলেক্ট করুন--</option>
                                    <option value='01'>সাধারণ/কোটা নেই</option>
                                    <option value='02'>মুক্তিযোদ্ধা</option>
                                    <option value='03'>ক্ষুদ্র নৃগোষ্ঠী</option>
                                    <option value='04'>প্রতিবন্ধী</option>
                                    <option value='99'>অন্যান্য</option>
                                 </Form.Select>
                                 {validated && userDataError.id_quota && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_quota}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_disability'>অক্ষমতা</Form.Label>
                                 <Form.Select
                                    id="id_disability"
                                    value={userData.id_disability}
                                    isInvalid={validated && !!userDataError.id_disability}
                                    isValid={validated && userData.id_disability && !userDataError.id_disability}
                                    onChange={(e) => handleDataChange('id_disability', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option disabled>অক্ষমতা সিলেক্ট করুন--</option>
                                    <option value='01'>নেই</option>
                                    <option value='02'>শ্রবণ</option>
                                    <option value='03'>দৃষ্টি</option>
                                    <option value='04'>বুদ্ধি</option>
                                    <option value='05'>বাক</option>
                                    <option value='99'>একাধিক</option>
                                 </Form.Select>
                                 {validated && userDataError.id_disability && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.id_disability}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_dist'>জেলা</Form.Label>
                                 <Select
                                    inputId="en_dist"
                                    placeholder="--জেলা সিলেক্ট করুন--"
                                    value={
                                       optionDistList.find(opt => opt.value === userData.en_dist) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_dist', value.value) : handleDataChange('en_dist', '')
                                    }
                                    options={optionDistList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_dist && (
                                    <p className='text-danger'>
                                       {userDataError.en_dist}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_uzps'>উপজেলা</Form.Label>
                                 <Select
                                    inputId="id_uzps"
                                    placeholder="--উপজেলা সিলেক্ট করুন--"
                                    value={
                                       optionUpazilaList.find(opt => opt.value === userData.id_uzps) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_uzps', value.value) : handleDataChange('id_uzps', '')
                                    }
                                    options={optionUpazilaList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_uzps && (
                                    <p className='text-danger'>
                                       {userDataError.id_uzps}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_post">ডাকঘর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="profile_post"
                                 value={userData.profile_post}
                                 isInvalid={validated && !!userDataError.profile_post}
                                 isValid={validated && userData.profile_post && !userDataError.profile_post}
                                 onChange={(e) => handleDataChange('profile_post', e.target.value)}
                              />
                              {validated && userDataError.profile_post && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_post}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_address">ঠিকানা</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="profile_address"
                                 value={userData.profile_address}
                                 isInvalid={validated && !!userDataError.profile_address}
                                 isValid={validated && userData.profile_address && !userDataError.profile_address}
                                 onChange={(e) => handleDataChange('profile_address', e.target.value)}
                              />
                              {validated && userDataError.profile_address && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_address}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_email">ইমেইল</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="email"
                                 id="profile_email"
                                 value={userData.profile_email}
                                 isInvalid={validated && !!userDataError.profile_email}
                                 isValid={validated && userData.profile_email && !userDataError.profile_email}
                                 onChange={(e) => handleDataChange('profile_email', e.target.value)}
                              />
                              {validated && userDataError.profile_email && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_email}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_mobile">মোবাইল</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-lowercase'
                                 type="text"
                                 // minLength={11}
                                 maxLength={11}
                                 id="profile_mobile"
                                 value={userData.profile_mobile}
                                 isInvalid={validated && !!userDataError.profile_mobile}
                                 isValid={validated && userData.profile_mobile && !userDataError.profile_mobile}
                                 onChange={(e) => handleDataChange('profile_mobile', e.target.value)}
                              />
                              {validated && userDataError.profile_mobile && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_mobile}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Header>
                        <h5 className="text-center w-100 card-title">পেশাগত তথ্য</h5>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col className='m-0 p-0' md={12}>
                              <h6 className="text-center w-100">প্রথম পদায়ন</h6>
                           </Col>
                           <Col className='my-2' md={12}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_first_office'>অফিস</Form.Label>
                                 <Select
                                    inputId="en_first_office"
                                    placeholder="--অফিস সিলেক্ট করুন--"
                                    value={
                                       optionBoardOffices.find(opt => opt.value === userData.en_first_office) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_first_office', value.value) : handleDataChange('en_first_office', '')
                                    }
                                    options={optionBoardOffices}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_first_office && (
                                    <p className='text-danger'>
                                       {userDataError.en_first_office}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={12}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_first_section'>শাখা</Form.Label>
                                 <Select
                                    inputId="en_first_section"
                                    placeholder="--শাখা সিলেক্ট করুন--"
                                    value={
                                       optionStartSections.find(opt => opt.value === userData.en_first_section) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_first_section', value.value) : handleDataChange('en_first_section', '')
                                    }
                                    options={optionStartSections}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_first_section && (
                                    <p className='text-danger'>
                                       {userDataError.en_first_section}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_first_post'>পদবী</Form.Label>
                                 <Select
                                    inputId="id_first_post"
                                    placeholder="--পদবী সিলেক্ট করুন--"
                                    value={
                                       optionStartDesignations.find(opt => opt.value === userData.id_first_post) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_first_post', value.value) : handleDataChange('id_first_post', '')
                                    }
                                    options={optionStartDesignations}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_first_post && (
                                    <p className='text-danger'>
                                       {userDataError.id_first_post}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="first_post_date">যোগদানের তারিখ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date" id="first_post_date"
                                 value={userData.first_post_date}
                                 isInvalid={validated && !!userDataError.first_post_date}
                                 isValid={validated && userData.first_post_date && !userDataError.first_post_date}
                                 onChange={(e) => handleDataChange('first_post_date', e.target.value)}
                              />
                              {validated && userDataError.first_post_date && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.first_post_date}
                                 </Form.Control.Feedback>
                              )}
                           </Col>

                           <Col className='m-0 p-0 pt-3' md={12}>
                              <h6 className="text-center w-100">বর্তমান পদায়ন</h6>
                           </Col>
                           <Col className='my-2' md={12}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_last_office'>অফিস</Form.Label>
                                 <Select
                                    inputId="en_last_office"
                                    placeholder="--অফিস সিলেক্ট করুন--"
                                    value={
                                       optionBoardOffices.find(opt => opt.value === userData.en_last_office) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_last_office', value.value) : handleDataChange('en_last_office', '')
                                    }
                                    options={optionBoardOffices}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_last_office && (
                                    <p className='text-danger'>
                                       {userDataError.en_last_office}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={12}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='en_last_section'>শাখা</Form.Label>
                                 <Select
                                    inputId="en_last_section"
                                    placeholder="--শাখা সিলেক্ট করুন--"
                                    value={
                                       optionLastSections.find(opt => opt.value === userData.en_last_section) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('en_last_section', value.value) : handleDataChange('en_last_section', '')
                                    }
                                    options={optionLastSections}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.en_last_section && (
                                    <p className='text-danger'>
                                       {userDataError.en_last_section}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_last_post'>পদবী</Form.Label>
                                 <Select
                                    inputId="id_last_post"
                                    placeholder="--পদবী সিলেক্ট করুন--"
                                    value={
                                       optionLastDesignations.find(opt => opt.value === userData.id_last_post) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_last_post', value.value) : handleDataChange('id_last_post', '')
                                    }
                                    options={optionLastDesignations}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_last_post && (
                                    <p className='text-danger'>
                                       {userDataError.id_last_post}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="last_post_date">যোগদানের তারিখ</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="date" id="last_post_date"
                                 value={userData.last_post_date}
                                 isInvalid={validated && !!userDataError.last_post_date}
                                 isValid={validated && userData.last_post_date && !userDataError.last_post_date}
                                 onChange={(e) => handleDataChange('last_post_date', e.target.value)}
                              />
                              {validated && userDataError.last_post_date && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.last_post_date}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Header>
                        <h5 className="text-center w-100 card-title">ব্যাংকের তথ্য</h5>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col className='my-2' md={6}>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='id_bank'>ব্যাংকের নাম</Form.Label>
                                 <Select
                                    inputId="id_bank"
                                    placeholder="--ব্যাংক সিলেক্ট করুন--"
                                    value={
                                       optionBankList.find(opt => opt.value === userData.id_bank) || null
                                    }
                                    onChange={(value) =>
                                       value ? handleDataChange('id_bank', value.value) : handleDataChange('id_bank', '')
                                    }
                                    options={optionBankList}
                                    isClearable={true}
                                    isSearchable={true}
                                 />
                                 {validated && userDataError.id_bank && (
                                    <p className='text-danger'>
                                       {userDataError.id_bank}
                                    </p>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_branch">শাখার নাম</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="profile_branch"
                                 value={userData.profile_branch}
                                 isInvalid={validated && !!userDataError.profile_branch}
                                 isValid={validated && userData.profile_branch && !userDataError.profile_branch}
                                 onChange={(e) => handleDataChange('profile_branch', e.target.value)}
                              />
                              {validated && userDataError.profile_branch && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_branch}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_routing">রাউটিং নম্বর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 // minLength={9}
                                 maxLength={9}
                                 type="text"
                                 id="profile_routing"
                                 value={userData.profile_routing}
                                 isInvalid={validated && !!userDataError.profile_routing}
                                 isValid={validated && userData.profile_routing && !userDataError.profile_routing}
                                 onChange={(e) => handleDataChange('profile_routing', e.target.value)}
                              />
                              {validated && userDataError.profile_routing && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_routing}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col className='my-2' md={6}>
                              <Form.Label className="text-primary" htmlFor="profile_account">হিসাব নম্বর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 // minLength={13}
                                 maxLength={17}
                                 type="text"
                                 id="profile_account"
                                 value={userData.profile_account}
                                 isInvalid={validated && !!userDataError.profile_account}
                                 isValid={validated && userData.profile_account && !userDataError.profile_account}
                                 onChange={(e) => handleDataChange('profile_account', e.target.value)}
                              />
                              {validated && userDataError.profile_account && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.profile_account}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Body className="d-flex justify-content-center gap-3">
                        <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                        <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
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
               <Modal.Title><span className={styles.SiyamRupaliFont}>নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</span></Modal.Title>
            </Modal.Header>
            <Modal.Body>
               {Object.entries(userDataError).map(([field, error]) => (
                  <i className='text-danger' key={field}>{userBnError[field]}, </i>
               ))}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setModalError(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>
      </Fragment>
   )

   return (
      // <Maintenance />
      <div className='d-flex flex-column justify-content-center align-items-center'>
         <h2 className='text-center text-white mb-2'>This page is under development</h2>
         <Image src={error01} alt="Under Development" />
      </div>
   )
}

export default UserProfile;