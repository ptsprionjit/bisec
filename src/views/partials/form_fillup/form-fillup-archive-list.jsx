import React, { useRef, useMemo, Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Modal, Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

const FormFillupArchiveList = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   // Set Time for Update
   // var date = new Date();
   // date.setHours(date.getUTCHours() + 12);
   // date = date.toISOString().split('T')[0];

   // const curDateTime = date;

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   // Set EIIN Value
   let eiin = '';
   if (ceb_session) {
      eiin = ceb_session.ceb_user_type === "13" ? ceb_session.ceb_user_id : '';
   }

   // Profile Image Variables
   const [profileImagePreview, setProfileImagePreview] = useState(null);
   const [profileImageFile, setProfileImageFile] = useState(null);
   const [profileImageError, setProfileImageError] = useState(false);

   // Profile Image List
   const [profileImageList, setProfileImageList] = useState([]);

   // Modal Variales
   const [modalError, setModalError] = useState(false);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState(
      {
         user_form: '200020711422330002', user_eiin: eiin, user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', user_paid: '01'
      }
   );
   const [searchDataError, setSearchDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);
   const [insName, setInsName] = useState(false);

   // Dates Data
   const [datesData, setDatesData] = useState([]);

   // Student Update Data Variables
   const [userData, setUserData] = useState(
      {
         id: '', name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', en_dist: '', upazila: '', address: '', mobile: '', class_shift: '', class_section: '', class_roll: ''
      }
   );
   const [userDataError, setUserDataError] = useState([]);
   const [dateDisability, setDateDisability] = useState(false);

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

   // #########################################################################################################
   // Student List Data
   const [stData, setStData] = useState([]);

   const [studentUpdate, setStudentUpdate] = useState([]);
   const [studentDelete, setStudentDelete] = useState([]);

   const [updateShow, setUpdateShow] = useState(false);

   const [deleteShow, setDeleteShow] = useState(false);

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState('');

   const printRef = useRef();

   const handlePrint = async () => {
      if (searchValue.length > 0) {
         setSearchValue('');
      } else {
         let current_page = currentPage;
         let current_data = currentData;
         let rows_per_page = rowsPerPage;

         await setCurrentData(stData);
         await setRowsPerPage(stData.length);
         await setCurrentPage(1);

         const printContent = printRef.current.innerHTML;
         const printWindow = window.open('', '', 'fullscreen=yes');

         printWindow.document.write(`
            <html>
               <head>
                  <title>Print</title>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                  <link href="https://fonts.maateen.me/siyam-rupali/font.css" rel="stylesheet">
                  <style>
                     @page {
                        size: A4 portrait !important;
                        margin: 0 !important;
                        padding: 0.5in !important;
                        div, table, tr, th, td, p, span {
                           page-break-inside: avoid !important;
                        }
                        section {
                           page-break-after: always !important;
                        }
                     }
                     *{
                        font-family: 'Siyam Rupali', sans-serif !important;
                        /* font-size: 15px !important; */
                        color: #000000 !important;
                     }
                     .print-nowrap{
                        white-space: nowrap !important;
                     }
                     .no-print {
                        display: none !important;
                     }
                     .print-hide {
                        display: none !important;
                     }
                     .print-show {
                        display: block !important;
                     }
                  </style>
               </head>
               <body>
                  <div class="d-flex flex-column justify-content-center align-items-center">${printContent}</div>
                  <script>
                     window.onload = function() {
                        window.print();
                        window.onafterprint = function() { 
                           window.close();
                        };
                     };
                  </script>
               </body>
            </html>
         `);
         printWindow.document.close();
         window.close();

         // Restore Data
         setRowsPerPage(rows_per_page);
         setCurrentPage(current_page);
         setCurrentData(current_data);
      }
   };

   const fallbackSVG = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="96px" height="96px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-user-round-icon lucide-square-user-round"><path d="M18 21a6 6 0 0 0-12 0" /><circle cx="12" cy="11" r="4" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
   `)}`;

   const handleImageList = async (image_blob) => {
      await setProfileImageList(image_blob);
      setValidSearch(true);
   }

   // Fetch Images
   const fetchImages = async (st_data) => {
      try {
         const res = await axios.post(`${BACKEND_URL}/student/image-fetch?`,
            { st_data: st_data },
            { responseType: 'blob', });

         if (res.status === 204) {
            return { url: fallbackSVG }
         }
         const url = URL.createObjectURL(res.data);
         return { url: url };
      } catch (error) {


    if (error.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error('Error loading images:', error);
         return { url: fallbackSVG }
      }
   };

   const loadAllImages = async () => {
      const image_blob = {};

      const fetchPromises = stData.map(async (st_data) => {
         const blobUrl = await fetchImages(st_data); // fetch blob & convert to URL
         image_blob[st_data.st_id] = blobUrl;
      });

      await Promise.all(fetchPromises); // wait for all to finish
      // console.log(image_blob);
      handleImageList(image_blob);
   };

   useEffect(() => {
      if (stData.length > 0) {
         setCurrentData(stData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > stData.length ? stData.length : currentPage * rowsPerPage));
         setTotalPage(Math.ceil(stData.length / rowsPerPage));

         loadAllImages();
      }
   }, [stData]);// eslint-disable-line react-hooks/exhaustive-deps

   const useDebounce = (value, delay = 500) => {
      const [debouncedValue, setDebouncedValue] = useState(value);
      useEffect(() => {
         const timer = setTimeout(() => {
            setDebouncedValue(value);
         }, delay);

         return () => clearTimeout(timer); // Cleanup if value changes before delay
      }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

      return debouncedValue;
   }

   const debouncedSearchValue = useDebounce(searchValue, 500);

   const filteredData = useMemo(() => {
      if (!debouncedSearchValue) return currentData;      // If no search, show all

      const search = debouncedSearchValue.toUpperCase();

      return stData.filter((item) =>
         [item.st_name, item.st_father, item.st_mother, item.en_gender, item.en_religion, item.st_breg, item.st_dob, item.en_user].some((field) =>
            field.toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, stData]); // eslint-disable-line react-hooks/exhaustive-deps

   //Handle Page Row Number Change
   const handleRowsPerPageChange = (data_per_page) => {
      data_per_page = Number(data_per_page);
      setRowsPerPage(data_per_page);
      setTotalPage(Math.ceil(stData.length / data_per_page));
      setCurrentPage(1);
      setCurrentData(stData.slice(0, data_per_page > stData.length ? stData.length : data_per_page));
   };

   //Handle Page Change
   const handleSetCurrentPage = (page_num) => {
      page_num = Number(page_num);
      if (page_num >= 1 && page_num <= totalPage) {
         setCurrentPage(page_num);
         setCurrentData(stData.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > stData.length ? stData.length : page_num * rowsPerPage));
      }
   };

   //TC Reject
   async function handleStudentDelete(id_invoice) {
      setDeleteShow(false);
      setSearchLoading("সম্পাদনা চলছে...। অপেক্ষা করুন।");
      setSearchSuccess(false);
      setSearchError(false);

      try {
         await axios.post(`${BACKEND_URL}/tc/app-reject?`, { id_invoice });
         setStData(((prevData) => prevData.filter((item) => item.id_invoice !== id_invoice)));
         setSearchSuccess("আবেদন বাতিল সফল হয়েছে!");
      } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setSearchError("আবেদন বাতিল সফল হয়নি!");
         // console.log(err);
      } finally {
         setSearchLoading(false);
      }
   };

   //Handle Details Click
   function handleEditClick(item) {
      setStudentUpdate(item);
      setUserData({
         id: item.st_id, name: item.st_name, father: item.st_father, mother: item.st_mother, gender: item.id_gender, religion: item.id_religion, birth_reg: item.st_breg, dob: item.st_dob, quota: item.id_quota, disability: item.id_disability, upazila: item.id_uzps, address: item.st_address, mobile: item.st_mobile, class_shift: item.id_shift, class_section: item.st_section, class_roll: item.st_ins_roll, en_dist: item.en_dist
      });
      setUpdateShow(true);
   };
   //Handle Details Click
   function handleDeleteClick(item) {
      setStudentDelete(item);
      setDeleteShow(true);
   };
   // #########################################################################################################

   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   const handleProfileImageSelect = (e) => {
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
      const form = event.currentTarget;
      let isValid = true;

      setDatesData([]);
      setSearchDataError([]);
      setSearchSuccess(false);
      setSearchError(false);

      const newErrors = {}; // Collect errors in one place

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'user_form', 'user_eiin', 'user_session', 'user_class', 'user_group', 'user_version', 'user_application', 'user_paid'
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
               case 'user_paid':
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
               const user_data = await axios.post(`${BACKEND_URL}/registration/list?`, { user_form: searchData.user_form, user_eiin: searchData.user_eiin, user_session: searchData.user_session, user_class: searchData.user_class, user_group: searchData.user_group, user_version: searchData.user_version, user_application: searchData.user_application, user_paid: searchData.user_paid });
               // console.log(user_data.data.data);
               if (user_data.status === 200) {
                  setSearchSuccess(`সেশনঃ ${searchData.user_session}, শ্রেণীঃ ${searchData.user_class}, বিভাগঃ ${user_data.data.dates_data.en_group} / ${user_data.data.dates_data.bn_group}`);
                  setInsName(user_data.data.ins_name);
                  // setSearchData(user_data.data.dates_data);
                  setDatesData(user_data.data.dates_data);
                  setStData(user_data.data.st_list);
                  //Set Data for Pagination
                  setRowsPerPage(10);
                  setTotalPage(Math.ceil(user_data.data.st_list.length / 10));
                  setCurrentPage(1);
                  setCurrentData(user_data.data.st_list.slice(0, 10));
                  setValidated(false);
               } else {
                  setSearchError(`${user_data.data.message}`);
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
                  navigate("/registration/temp-list");
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
      setUserDataError([]);
      setInsertSuccess(false);
      setInsertError(false);
      setInsertLoading("শিক্ষার্থী নিবন্ধন আপডেট করা হচ্ছে! অপেক্ষা করুন...");

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
                  break;

               case 'dob':
                  dataError = userData.disability === "01" ? ValidationInput.dateCheck(userData[field], datesData.birth_start, datesData.birth_end) : ValidationInput.dateCheck(userData[field], dateDisability, datesData.birth_end);
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
               const user_data = await axios.post(`${BACKEND_URL}/student/new-registration?`, formData, {
                  headers: { 'Content-Type': 'multipart/form-data' },
               });
               if (user_data.status === 200) {
                  setInsertSuccess(user_data.data.message);
                  // Reset Form
                  setUserData({
                     ...userData, name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', en_dist: '', upazila: '', address: '', mobile: '', class_roll: ''
                  });
                  setUpdateShow(false);
                  setProfileImageError(false);
                  setProfileImageFile(null);
                  setProfileImagePreview(null);
               } else {
                  setInsertError(user_data.data.message);
               }
            } catch (err) {

               setInsertError('শিক্ষার্থীর নিবন্ধন আপডেট করা সম্ভব হয়নি!');
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  
               }
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
   }

   const handleStudentReset = (event) => {
      event.preventDefault();
      event.stopPropagation();
      setUserDataError([]);
      setUpazilas([]);
      setValidated(false);

      setInsertSuccess(false);
      setInsertError(false);
      setInsertLoading(false);

      setUserData({
         ...userData, name: '', father: '', mother: '', gender: '', religion: '', birth_reg: '', dob: '', quota: '', disability: '', upazila: '', address: '', mobile: '', class_shift: '', class_section: '', class_roll: ''
      });
      setProfileImageError(false);
      setProfileImageFile(null);
      setProfileImagePreview(null);
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
         user_form: '200020711422330002', user_eiin: eiin, user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', user_paid: '01'
      });
      setDatesData([]);
   };

   //Handle District Change
   const handleDistrictChange = (value) => {
      setUserData({ ...userData, en_dist: value });
      setUpazilas([]);
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
         let startDob = new Date(datesData.birth_start);
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
            const response = await axios.post(`${BACKEND_URL}/district-list`);
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
               const response = await axios.post(`${BACKEND_URL}/district-list/upzila?`, { selectedDistrict });
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

   // Return if no session
   if (!ceb_session) {
      return null;
   }

   // Return if Search is Valid
   if (validSearch && profileImageList && (ceb_session.ceb_user_type === '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className='p-0 mb-2'>
                  <Card.Body className='py-1 m-0 d-flex flex-column justify-content-center align-items-center'>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title pt-2"}>নিবন্ধিত শিক্ষার্থীদের আর্কাইভ তালিকা</h4>
                     {insName && <h5 className="text-uppercase text-center py-1 text-primary">{insName}</h5>}
                     {searchLoading && <h6 className="text-uppercase text-center py-1 text-info">{searchLoading}</h6>}
                     {searchError && <h6 className="text-uppercase text-center py-1 text-danger">{searchError}</h6>}
                     {searchSuccess && <p className="text-uppercase text-center py-1 text-success"><small><i>{searchSuccess}</i></small></p>}
                     <Button type="button" onClick={() => setValidSearch(false)} variant="btn btn-primary"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                  </Card.Body>
               </Card>
            </Col>
            <Col sm="12">
               <Card>
                  <Card.Header>
                     {insertSuccess && <h6 className="text-uppercase text-center py-1 text-success">{insertSuccess}</h6>}
                     {insertError && <h6 className="text-uppercase text-center py-1 text-danger">{insertError}</h6>}
                     {insertLoading && <h6 className="text-uppercase text-center py-1 text-primary">{insertLoading}</h6>}
                  </Card.Header>
                  <Card.Body className="px-0">
                     <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
                        <Col md="5">
                           <Row>
                              <Form.Label className="text-primary" htmlFor="per_page_data"><small className={styles.SiyamRupaliFont + " text-wrap text-center text-primary"}>প্রতি পাতায় শিক্ষার্থীর সংখ্যা (সর্বমোট শিক্ষার্থীঃ {stData.length})</small></Form.Label>
                              <Col md={6}>
                                 <Form.Select
                                    id="per_page_data"
                                    value={rowsPerPage || 10}
                                    onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                 // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                                 >
                                    <option disabled value="" className={styles.SiyamRupaliFont + " text-wrap text-center"}>-- শিক্ষার্থীর সংখ্যা সিলেক্ট করুন --</option>
                                    <option value="10">১০</option>
                                    <option value="20">২০</option>
                                    <option value="50">৫০</option>
                                    <option value="100">১০০</option>
                                 </Form.Select>
                              </Col>
                           </Row>
                        </Col>
                        <Col md="2">
                           { }
                        </Col>
                        <Col md="5">
                           <Row>
                              <Form.Label className='d-flex justify-content-end text-primary' htmlFor="search_info"> <small className={styles.SiyamRupaliFont + ' text-end text-primary'}>শিক্ষার্থী খুঁজতে নিচের বক্সে লিখুন</small> </Form.Label>
                              <Col md={4}>
                                 { }
                              </Col>
                              <Col md={8}>
                                 <Form.Control
                                    className='bg-transparent text-uppercase form-control-sm'
                                    type="search"
                                    id="search_info"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="তথ্য খুঁজুন..."
                                 />
                              </Col>
                           </Row>
                        </Col>
                     </Row>
                     <Row ref={printRef} className="table-responsive p-4">
                        <div className={styles.print_show + ' mb-1'}>
                           <h4 className={styles.SiyamRupaliFont + " w-100 text-center text-primary text-uppercase py-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড কুমিল্লা</h4>
                           {insName && <h6 className="text-uppercase card-title text-center py-1">{insName}</h6>}
                           <h6 className={styles.SiyamRupaliFont + " text-center text-uppercase py-1"}>নিবন্ধিত শিক্ষার্থীদের আর্কাইভ তালিকা</h6>
                           <p className='text-center'>
                              <small className={styles.SiyamRupaliFont + " w-100 text-center text-uppercase py-1"}>
                                 সর্বমোট ‍শিক্ষার্থীঃ {stData.length} আবেদনের ধরণঃ
                                 {searchData.user_application === '01' && <span> রেগুলার আবেদন</span>}
                                 {searchData.user_application === '02' && <span> লেট আবেদন</span>}
                                 {searchData.user_application === '03' && <span> স্পেশাল আবেদন</span>}
                              </small>
                           </p>
                        </div>
                        <table id="user-list-table" className="table table-bordered">
                           <thead>
                              <tr className='border border-secondary'>
                                 <th className='text-center align-top p-1 m-0'>
                                    <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>ক্রমিক</span>
                                 </th>
                                 <th className='text-center align-top p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>নাম</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>পিতার নাম</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>মাতার নাম</p>
                                 </th>
                                 <th className='text-center align-top p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>জেন্ডার/লিঙ্গ</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>ধর্ম</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>ভার্সন/মাধ্যম</p>
                                 </th>
                                 <th className='text-center align-top p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>জন্মনিবন্ধন নম্বর</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>জন্ম তারিখ</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>প্রতিষ্ঠান</p>
                                 </th>
                                 <th className='text-center align-top p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>শিফট</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>শাখা</p>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>রোল নম্বর</p>
                                 </th>
                                 <th className='text-center align-top p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>ছবি</p>
                                 </th>
                                 <th className='text-center align-top p-1 m-0 print-hide'>
                                    <span className={styles.SiyamRupaliFont + " text-center text-primary"}>সম্পাদনা</span>
                                 </th>
                              </tr>
                           </thead>
                           <tbody>
                              {
                                 filteredData.map((item, idx) => (
                                    <tr key={idx} className='border border-secondary'>
                                       <td className='text-center align-top text-wrap'>
                                          {(currentPage - 1) * rowsPerPage + idx + 1}
                                       </td>
                                       <td className='text-center align-top'>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_name}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_father}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_mother}</p>
                                       </td>
                                       <td className='text-center align-top'>
                                          <p className='text-center text-wrap m-0 p-0'>{item.en_gender}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.en_religion}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.en_version}</p>
                                       </td>
                                       <td className='text-center align-top'>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_breg}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_dob}</p>
                                          <p className='text-uppercase text-center text-wrap m-0 p-0'>{item.st_eiin}</p>
                                       </td>
                                       <td className='text-center align-top'>
                                          <p className='text-center text-wrap m-0 p-0'>{item.en_shift}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_section}</p>
                                          <p className='text-center text-wrap m-0 p-0'>{item.st_ins_roll}</p>
                                       </td>
                                       <td className='text-center align-center'>
                                          <Image className="text-center  m-0 p-0" style={{ minWidth: "96px", minHeight: "96px", maxWidth: "96px", maxHeight: "96px" }} src={profileImageList[item.st_id].url} alt={`Profile Image of ${item.st_name}`} />
                                       </td>
                                       <td className="text-center align-center print-hide">
                                          <div className='d-flex justify-content-center align-items-center gap-3'>
                                             <Button className='m-0 p-1' type="button" onClick={() => handleEditClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="সম্পাদনা" data-original-title="সম্পাদনা">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                                             </Button>
                                             <Button className='m-0 p-1' type="button" onClick={() => handleDeleteClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
                                                <span className="btn-inner">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                                </span>
                                             </Button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))
                              }
                           </tbody>
                        </table>
                     </Row>
                     {totalPage > 0 && <Row className='d-flex justify-content-center align-items-center px-4'>
                        <Col md={5}>
                           <Button className='m-0 p-0 py-1 bg-transparent' variant="btn btn-link"><span className={styles.SiyamRupaliFont}>শিক্ষার্থী {((currentPage - 1) * rowsPerPage) + 1} থেকে {currentPage * rowsPerPage > stData.length ? stData.length : currentPage * rowsPerPage} পর্যন্ত</span></Button>
                        </Col>
                        <Col md={2} className='d-flex justify-content-center align-items-center'>
                           <Button onClick={() => handlePrint()} className='flex-fill' variant="btn btn-success">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer-check-icon lucide-printer-check"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" /><path d="m16 19 2 2 4-4" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /></svg> প্রিন্ট
                           </Button>
                        </Col>
                        <Col md={5} className='d-flex justify-content-end align-items-end gap-1'>
                           <Button className='flex-fill m-0 p-0 py-1' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>
                           <Button className='flex-fill m-0 p-0 py-1' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>
                           {currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0  py-1' variant="btn btn-light">{currentPage - 1}</Button>}
                           <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-primary">{currentPage}</Button>
                           {totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{currentPage + 1}</Button>}
                           <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{">"}</Button>
                           <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{">>"}</Button>
                        </Col>
                     </Row>}
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         {studentUpdate && (
            <Modal
               show={updateShow}
               onHide={() => setUpdateShow(false)}
               backdrop="static"
               keyboard={false}
               fullscreen={false}
               className='modal-xl'
            >
               <Modal.Header closeButton>
                  <Modal.Title className='text-center w-100'><span className={styles.SiyamRupaliFont + ' text-center'}>শিক্ষার্থীর তথ্য সংশোধন ফর্ম</span></Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Row className='d-flex justify-content-center align-items-center'>
                     <Col md={12}>
                        <Card className='p-0 mb-2'>
                           <Card.Body className='py-1 m-0'>
                              {insName && <h6 className="text-uppercase text-center py-1 text-primary">{insName}</h6>}
                              {searchLoading && <h6 className="text-uppercase text-center py-1 text-info">{searchLoading}</h6>}
                              {searchError && <h6 className="text-uppercase text-center py-1 text-danger">{searchError}</h6>}
                              {searchSuccess && <p className="text-uppercase text-center py-1 text-success"><small><i>{searchSuccess}</i></small></p>}
                           </Card.Body>
                        </Card>
                     </Col>
                     <Col md={12}>
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
                                          min={dateDisability || datesData.birth_start}
                                          max={datesData.birth_end}
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
                                 <h5 className="text-center w-100 card-title">প্রাতিষ্ঠানিক তথ্য</h5>
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
                              <Card.Footer>
                                 {searchError && <Col md={12} className='py-1'>
                                    <i className='w-100 text-center text-danger pt-1'>Student Data Insert Failed!</i>
                                 </Col>}
                                 <Col md={12} className='d-flex justify-content-center gap-3 py-1 mt-4'>
                                    <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset Form</Button>
                                    <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit Form</Button>
                                 </Col>
                              </Card.Footer>
                           </Card>
                        </Form>
                     </Col>
                  </Row>
               </Modal.Body>
               <Modal.Footer>
                  {/* <Button variant="success" onClick={() => handleStudentUpdate(studentUpdate.id_invoice)}>
                                    সম্মত
                                 </Button> */}
                  <Button variant="secondary" onClick={() => setUpdateShow(false)}>
                     ফিরে যান
                  </Button>
               </Modal.Footer>
            </Modal>
         )}
         {studentDelete && (
            <Modal
               show={deleteShow}
               onHide={() => setDeleteShow(false)}
               backdrop="static"
               keyboard={false}
            >
               <Modal.Header closeButton>
                  <Modal.Title><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর নিবন্ধন বাতিল করতে চান?</span></Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>নামঃ {studentDelete.st_name}</p>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>পিতাঃ {studentDelete.st_father}</p>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>মাতাঃ {studentDelete.st_mother}</p>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>শিফটঃ {studentDelete.en_shift}</p>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>শাখাঃ {studentDelete.st_section}</p>
                  <p className={styles.SiyamRupaliFont + " text-wrap "}>রোলঃ {studentDelete.st_ins_roll}</p>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="danger" onClick={() => handleStudentDelete(studentDelete.id_invoice)}>
                     সম্মত
                  </Button>
                  <Button variant="secondary" onClick={() => setDeleteShow(false)}>
                     ফিরে যান
                  </Button>
               </Modal.Footer>
            </Modal>
         )}
         {modalError && (
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
         )}
      </Fragment>
   )

   // Return if User is Authorized
   if (ceb_session.ceb_user_type === '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title"}>নিবন্ধিত শিক্ষার্থীদের আর্কাইভ তালিকা</h4>
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
                           {ceb_session.ceb_user_type !== '13' && <Col md={4} className='my-2'>
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
                           {ceb_session.ceb_user_type === '13' && <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_eiin">EIIN</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 maxLength={6} minLength={6}
                                 value={searchData.user_eiin}
                                 isInvalid={validated && !!searchDataError.user_eiin}
                                 isValid={validated && searchData.user_eiin && !searchDataError.user_eiin}
                                 disabled={ceb_session.ceb_user_type === '13'}
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
                                    {(ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_office === "80" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='06'>Six</option>
                                       <option value='07'>Seven</option>
                                       <option value='08'>Eight</option>
                                       <option value='09'>Nine</option>
                                       <option value='10'>Ten</option>
                                    </>}
                                    {(ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_type === "90" || ceb_session.ceb_user_role === "17") && <>
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

export default FormFillupArchiveList;