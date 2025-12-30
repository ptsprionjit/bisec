import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import Select from 'react-select'


import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

import error01 from '../../../assets/images/error/01.png'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InactiveUserList = () => {
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

   const [activeUserDetails, setActiveUserDetails] = useState([]);
   const [activeUserUpadte, setActiveUserUpadte] = useState([]);
   const [modalError, setModalError] = useState(false);

   const [detailsShow, setDetailsShow] = useState(false);
   const [updateShow, setUpdateShow] = useState(false);

   //Student Data Fetch Status
   const [loadingSuccess, setLoadingSuccess] = useState(false);
   const [loadingProgress, setLoadingProgress] = useState(false);
   const [loadingError, setLoadingError] = useState(false);

   const [modifySuccess, setModifySuccess] = useState(false);
   const [modifyError, setModifyError] = useState(false);
   const [modifyProcess, setModifyProcess] = useState(false);

   const [userType, setUserType] = useState([]);
   const [optionUserType, setOptionUserType] = useState([]);
   const [userRole, setUserRole] = useState([]);
   const [optionUserRole, setOptionUserRole] = useState([]);
   const [userStatus, setUserStatus] = useState([]);
   const [optionUserStatus, setOptionUserStatus] = useState([]);

   const [boardOffices, setBoardOffices] = useState([]);
   const [optionBoardOffices, setOptionBoardOffices] = useState([]);

   const [boardSections, setBoardSections] = useState([]);
   const [optionBoardSections, setOptionBoardSections] = useState([]);

   const [boardDesignations, setBoardDesignations] = useState([]);
   const [optionBoardDesignations, setOptionBoardDesignations] = useState([]);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Student Data Variables
   const [userData, setUserData] = useState({
      id_user: '', id_user_entity: '', id_user_role: '', en_office: '', en_section: '', id_user_post: '', bn_user: '', en_user: '', user_id_number: '', user_dob: '', user_mobile: '', user_email: '', id_user_status: ''
   });

   const bn_error = {
      id_user: '', id_user_entity: 'ইউজার টাইপ', id_user_role: 'ইউজার রোল', en_office: 'ইউজার অফিস', en_section: 'ইউজার সেকশন', id_user_post: 'ইউজার পদবী', bn_user: 'নাম (বাংলা)', en_user: 'নাম (English)', user_id_number: 'আইডি নম্বর', user_dob: 'তারিখ', user_mobile: 'মোবাইল', user_email: 'ইমেইল', id_user_status: 'স্ট্যাটাস'
   }
   const [userDataError, setUserDataError] = useState([]);

   //Student Fetched Data
   const [dataList, setDataList] = useState([]);

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState();

   // Set Current Data
   useEffect(() => {
      if (dataList.length > 0) {
         setCurrentData(dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage));
         setTotalPage(Math.ceil(dataList.length / rowsPerPage));
      }
   }, [dataList]);// eslint-disable-line react-hooks/exhaustive-deps

   // Set Delay for Search
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

   // Call useDebounce after Delay
   const debouncedSearchValue = useDebounce(searchValue, 500);

   // Set Filtered Data
   const filteredData = useMemo(() => {
      if (!debouncedSearchValue) return currentData;      // If no search, show all

      const search = debouncedSearchValue.toUpperCase();

      return dataList.filter((item) =>
         [item.id_user, item.en_user, item.bn_user, item.bn_user_entity, item.bn_user_role, item.user_mobile, item.user_email, item.bn_post, item.bn_section, item.bn_office.toString()].some((field) =>
            field.toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch Data List
   useEffect(() => {
      // Data Fetch 
      const fetchDataList = async () => {
         setLoadingProgress("ব্যবহারকারী (কর্মকর্তা/কর্মচারী) তালিকা খুঁজা হচ্ছে...! অপেক্ষা করুন।");
         try {
            const response = await axiosApi.post(`/user/list/inactive`, {});
            if (response.status === 200) {
               const allUsers = (response.data.userList).filter(item => item.id_user !== permissionData.id) || [];
               if (allUsers?.length) {
                  setDataList(allUsers);
                  setLoadingSuccess(true);
                  //Set Data for Pagination
                  setRowsPerPage(10);
                  setTotalPage(Math.ceil(allUsers.length / 10));
                  setCurrentPage(1);
                  setCurrentData(allUsers.slice(0, 10));
               } else {
                  setLoadingError("কোন নিষ্ক্রিয় (INACTIVE) ব্যবহারকারী (কর্মকর্তা/কর্মচারী) পাওয়া যায়নি!");
               }
            } else {
               setLoadingError("কোন নিষ্ক্রিয় (INACTIVE) ব্যবহারকারী (কর্মকর্তা/কর্মচারী) পাওয়া যায়নি!");
            }
            // console.log(st_list.data.data);
         } catch (err) {
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
            setLoadingError("কোন সচল নিষ্ক্রিয় (INACTIVE) ব্যবহারকারী (কর্মকর্তা/কর্মচারী) পাওয়া যায়নি!");
            // console.log(err);
         } finally {
            setLoadingProgress(false);
         }
      }
      fetchDataList();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   //Handle Page Row Number Change
   const handleRowsPerPageChange = (data_per_page) => {
      data_per_page = Number(data_per_page);
      setRowsPerPage(data_per_page);
      setTotalPage(Math.ceil(dataList.length / data_per_page));
      setCurrentPage(1);
      setCurrentData(dataList.slice(0, data_per_page > dataList.length ? dataList.length : data_per_page));
   };

   //Handle Page Change
   const handleSetCurrentPage = (page_num) => {
      page_num = Number(page_num);
      if (page_num >= 1 && page_num <= totalPage) {
         setCurrentPage(page_num);
         setCurrentData(dataList.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > dataList.length ? dataList.length : page_num * rowsPerPage));
      }
   };

   //Handle Details Click
   const handleDetailsClick = (item) => {
      setActiveUserDetails(item);
      setDetailsShow(true);
   };

   //Handle Update Click
   const handleUpdateClick = (item) => {
      setModifyProcess(false);
      setModifyError(false);
      setModifySuccess(false);
      setValidated(false);
      setUserDataError([]);
      setUserData(item);
      setActiveUserUpadte(item);
      setUpdateShow(true);
   };

   const handleSubmit = async (event) => {
      event.preventDefault();
      event.stopPropagation();

      const form = event.currentTarget;
      let isValid = true;
      setUserDataError([]);
      setModifyProcess(false);
      setModifyError(false);
      setModifyProcess("নিবন্ধন করা হচ্ছে! অপেক্ষা করুন...");

      const newErrors = {}; // Collect errors in one place

      if (form.checkValidity() === false) {
         setValidated(false);
      } else {
         const requiredFields = [
            'id_user_entity', 'id_user_role', 'en_office', 'en_section', 'id_user_post', 'bn_user', 'en_user', 'user_id_number', 'user_dob', 'user_mobile', 'user_email', 'id_user_status'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'id_user_entity':
               case 'id_user_role':
               case 'id_user_post':
               case 'id_user_status':
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
            setModifyProcess(false);
            setModifyError("ব্যবহারকারীর সব তথ্য সঠিকভাবে পূরণ করতে হবে!");
         } else {
            try {
               const user_data = await axiosApi.post(`/user/registration/update`, { userData });
               if (user_data.status === 200) {
                  setModifySuccess(user_data.data.message);
                  setDataList((prev_data) => prev_data.filter((item => item.id_user !== userData.id_user)));
                  setUpdateShow(false);
               } else {
                  setModifyError(user_data.data.message);
               }
            } catch (err) {
               setModifyError('নিবন্ধন করা সম্ভব হয়নি!');
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
               alert('নিবন্ধন করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
            } finally {
               setModifyProcess(false);
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
      setUserData({ ...userData, 'user_section': '', 'user_post': '', [dataName]: dataValue });
      setUserDataError({ ...userDataError, 'user_section': '', 'user_post': '', [dataName]: '' });
      setOptionBoardSections([]);
      setOptionBoardDesignations([]);
   }

   // Handle User Data Change
   const handleSectionDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, 'user_post': '', [dataName]: dataValue });
      setUserDataError({ ...userDataError, 'user_post': '', [dataName]: '' });
      setOptionBoardDesignations([]);
   }

   // Fetch User Type
   useEffect(() => {
      const fetchUserType = async () => {
         setOptionUserType([]);
         setLoadingProgress("ইউজার টাইপ তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
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
            setLoadingProgress(false);
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
         setLoadingProgress("ইউজার রোল তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
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
            setLoadingProgress(false);
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

   // Fetch User Status
   useEffect(() => {
      const fetchUserRole = async () => {
         setOptionUserStatus([]);
         setLoadingProgress("ইউজার স্ট্যাটাস তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
         try {
            const response = await axiosApi.post(`/user/status-list`);
            setUserStatus(response.data);
         } catch (err) {
            // console.error(`Error Fetching User Type: ${err}`);
            setLoadingError("ইউজার স্ট্যাটাস তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!");
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingProgress(false);
         }
      }

      fetchUserRole();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // User Status Option
   useEffect(() => {
      if (userStatus.length > 0) {
         const newOptions = userStatus.map(data => ({
            value: data.id_user_status,
            label: data.bn_user_status
         }));
         setOptionUserStatus(newOptions);
      }
   }, [userStatus]); // eslint-disable-line react-hooks/exhaustive-deps

   // Fetch Office List
   useEffect(() => {
      const fetchOffice = async () => {
         setOptionBoardOffices([]);
         setOptionBoardSections([]);
         setOptionBoardDesignations([]);
         setLoadingProgress("বোর্ডের অফিস তথ্য খুঁজা হচ্ছে...");
         try {
            const response = await axiosApi.post(`/user/designation-list`);
            setBoardOffices(response.data);
         } catch (err) {
            setLoadingError("বোর্ডের অফিস তথ্য পাওয়া যায়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।");
            if (err.status === 401) {
               navigate("/auth/sign-out");
            }
         } finally {
            setLoadingProgress(false);
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

   if ((permissionData.role === "17" || permissionData.role === "18") && loadingSuccess) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Header className="d-flex justify-content-between">
                     <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                        <h4 className={styles.SiyamRupaliFont + " card-title text-center text-primary flex-fill"}>বোর্ডের নিষ্ক্রিয় (INACTIVE) ইউজার আইডিসমূহ</h4>
                     </div>
                  </Card.Header>
                  <Card.Body className="px-0">
                     <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
                        {totalPage > 0 && (
                           <Col md="2">
                              <Form.Label htmlFor="per_page_data"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতি পাতায় ইউজার সংখ্যা (সর্বমোটঃ {dataList.length})</span></Form.Label>
                              <Form.Select
                                 id="per_page_data"
                                 value={rowsPerPage}
                                 onChange={(e) => handleRowsPerPageChange(e.target.value)}
                              // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                              >
                                 <option disabled value="" className={styles.SiyamRupaliFont + " text-center"}>-- ইউজার সংখ্যা সিলেক্ট করুন --</option>
                                 <option value="10">১০</option>
                                 <option value="20">২০</option>
                                 <option value="50">৫০</option>
                                 <option value="100">১০০</option>
                              </Form.Select>
                           </Col>
                        )}
                        {totalPage > 0 && (
                           <Col md="3">
                              <Form.Label className='d-flex justify-content-end' htmlFor="search_info"> <span className={styles.SiyamRupaliFont}>ইউজার খুঁজতে নিচের বক্সে লিখুন</span> </Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="search"
                                 id="search_info"
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 placeholder="তথ্য খুঁজুন..."
                              />
                           </Col>
                        )}
                     </Row>
                     <Row className="table-responsive p-4">
                        <table id="data-list-table" className="table table-bordered border-dark p-0 m-0">
                           <thead>
                              <tr className='table-primary table-bordered border-dark'>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-1 m-0"}>
                                    ক্রমিক
                                 </th>
                                 <th className='text-center align-top text-wrap p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>নাম (বাংলা)</p>
                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>নাম (English)</p>
                                 </th>
                                 <th className='text-center align-top text-wrap p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>মোবাইল</p>
                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>ইমেইল</p>
                                 </th>
                                 <th className='text-center align-top text-wrap p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>ধরণ</p>
                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>রোল</p>
                                 </th>
                                 <th className='text-center align-top text-wrap p-1 m-0'>
                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>ইউজার আইডি</p>
                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>পরিচিতি নম্বর</p>
                                 </th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-0 m-0"}>সম্পাদনা</th>
                              </tr>
                           </thead>
                           <tbody>
                              {
                                 filteredData.map((item, idx) => (
                                    <tr key={idx}>
                                       <td className='text-center align-top text-wrap'>{(currentPage - 1) * rowsPerPage + (idx + 1)}</td>
                                       <td className='text-center align-top text-wrap'>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_user}</p>
                                          <p className={styles.SiyamRupaliFont + " text-uppercase text-center align-center text-wrap p-1 m-0"}>{item.en_user}</p>
                                       </td>
                                       <td className='text-center align-top text-wrap'>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.user_mobile}</p>
                                          <p className={styles.SiyamRupaliFont + " text-lowercase text-center align-center text-wrap p-1 m-0"}>{item.user_email}</p>
                                       </td>
                                       <td className='text-center align-top text-wrap'>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_user_entity}</p>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_user_role}</p>
                                       </td>
                                       <td className='text-center align-top text-wrap'>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.id_user}</p>
                                          <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.user_id_number}</p>
                                       </td>
                                       <td>
                                          <div className="d-flex justify-content-center align-items-center gap-3">
                                             <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                <span className="btn-inner">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                </span>
                                             </Button>
                                             <Button className='m-0 p-1' type="button" onClick={() => handleUpdateClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="আপডেট" data-original-title="আপডেট">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                                             </Button>
                                          </div>
                                          {/* <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                                             <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                <span className="btn-inner">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                </span>
                                             </Button>
                                             <Button className='m-0 p-1' type="button" onClick={() => handleUpdateClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="আপডেট" data-original-title="আপডেট">
                                                <Button className='m-0 p-1' type="button" onClick={() => handleUpdateClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="আপডেট" data-original-title="আপডেট">
                                                   <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen-icon lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                                                </Button>
                                             </Button>
                                          </div> */}
                                       </td>
                                    </tr>
                                 ))
                              }
                           </tbody>
                        </table>
                     </Row>
                     <Row className='d-flex justify-content-between px-5'>
                        <Col md="5">
                           {totalPage > 0 && <Button className='flex-fill' disabled variant="btn btn-light"><span className={styles.SiyamRupaliFont}>ইউজার {((currentPage - 1) * rowsPerPage) + 1} থেকে {currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage} পর্যন্ত</span></Button>}
                        </Col>
                        <Col md="5" className='d-flex justify-content-center gap-1'>
                           {totalPage > 0 && <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>}
                           {totalPage > 0 && <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>}
                           {totalPage > 0 && currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage - 1}</Button>}
                           {totalPage > 0 && <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{currentPage}</Button>}
                           {totalPage > 0 && totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage + 1}</Button>}
                           {totalPage > 0 && <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>}
                           {totalPage > 0 && <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>}
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         {activeUserDetails && (
            <Modal
               show={detailsShow}
               onHide={() => setDetailsShow(false)}
               backdrop="static"
               keyboard={false}
               className='modal-lg m-0 p-0'
            >
               <Modal.Header closeButton>
                  <Modal.Title className={styles.SiyamRupaliFont + ' text-center w-100'}>
                     <h4 className={styles.SiyamRupaliFont + ' text-center'}>ইউজার ডিটেইলস (বিস্তারিত)</h4>
                  </Modal.Title>
               </Modal.Header>
               <Modal.Body className='m-0 p-0'>
                  <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                     <Col md={12}>
                        <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-2 auth-card">
                           <Card.Body className='d-flex flex-column justify-content-center align-items-center table-responsive m-0 p-0'>
                              <table id="user-list-table" className="table table-bordered border-dark table-hover border-2 w-100 m-0 p-0">
                                 <tbody>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নাম (বাংলা)</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_user}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নাম (ইংরেজি)</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.en_user}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.user_mobile}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ইমেইল</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.user_email}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ধরণ</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_user_entity}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>রোল</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_user_role}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{String(activeUserDetails.user_id_number).length === 6 ? 'ইআইআইএন (EIIN) নম্বর' : 'এনআইডি (NID) নম্বর'}</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.user_id_number}</span>
                                       </td>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ইউজার আইডি</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.id_user}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দপ্তর</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_office}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>শাখা</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_section}</span>
                                       </td>
                                    </tr>
                                    <tr>
                                       <th className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পদবী</span>
                                       </th>
                                       <td className='text-center align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                       </td>
                                       <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeUserDetails.bn_post}</span>
                                       </td>
                                    </tr>
                                 </tbody>
                              </table>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Row>
               </Modal.Body>
               <Modal.Footer>
                  <Button variant="secondary" onClick={() => setDetailsShow(false)}>
                     ফিরে যান
                  </Button>
               </Modal.Footer>
            </Modal>
         )}
         {activeUserUpadte && (
            <Modal
               show={updateShow}
               onHide={() => setUpdateShow(false)}
               backdrop="static"
               keyboard={false}
               className='modal-xl m-0 p-0'

            >
               <Modal.Header closeButton>
                  <Modal.Title className={styles.SiyamRupaliFont + ' text-center w-100'}>
                     <h4 className={styles.SiyamRupaliFont + ' text-center'}>ইউজার টাইপ এবং রোল আপডেট</h4>
                     {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                     {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                     {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                  </Modal.Title>
               </Modal.Header>
               <Modal.Body>
                  <Row>
                     <Form noValidate onSubmit={handleSubmit}>
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
                                       <Col className='my-2' md={6}>
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
                                       <Col className='my-2' md={6}>
                                          <Form.Group className="bg-transparent">
                                             <Form.Label className="text-primary" htmlFor='id_user_status'>ইউজার স্ট্যাটাস</Form.Label>
                                             <Select
                                                inputId="id_user_status"
                                                placeholder="--স্ট্যাটাস সিলেক্ট করুন--"
                                                value={
                                                   optionUserStatus.find(opt => opt.value === userData.id_user_status) || null
                                                }
                                                onChange={(value) =>
                                                   value ? handleDataChange('id_user_status', value.value) : handleDataChange('id_user_status', '')
                                                }
                                                options={optionUserStatus}
                                                isClearable={true}
                                                isSearchable={true}
                                             />
                                             {validated && userDataError.id_user_status && (
                                                <p className='text-danger'>
                                                   {userDataError.id_user_status}
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
                                    <Button className='flex-fill' variant="secondary" onClick={() => setUpdateShow(false)}>ফিরে যান</Button>
                                    <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                                 </Card.Body>
                              </Card>
                           </Col>
                        </Row>
                     </Form>
                  </Row>
               </Modal.Body>
               <Modal.Footer></Modal.Footer>
            </Modal>
         )}
         {modalError && <Modal
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
                  <i className='text-danger' key={field}>{bn_error[field]}, </i>
               ))}
            </Modal.Body>
            <Modal.Footer>
               <Button variant="secondary" onClick={() => setModalError(false)}>
                  ফিরে যান
               </Button>
            </Modal.Footer>
         </Modal>}
      </Fragment>
   )

   if (permissionData.role === "17" || permissionData.role === "18") return (
      <Fragment>
         <Row className='d-flex justify-content-center align-items-center'>
            <Col md="12">
               <Card>
                  <Card.Header className="d-flex justify-content-between">
                     <div className="header-title w-100">
                        <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>বোর্ডের নিষ্ক্রিয় (INACTIVE) ইউজার আইডিসমূহ</span></h4>
                     </div>
                  </Card.Header>
                  <Card.Body className="px-0">
                     <Row className='justify-content-center'>
                        <Col md="8">
                           {loadingProgress && <h6 className="text-center rounded-1 text-info p-2 mb-2">{loadingProgress}</h6>}
                           {loadingError && <h6 className="text-center rounded-1 bg-danger text-white p-2 mb-2">{loadingError}</h6>}
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )

   return (
      <Fragment>
         <Row className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className={styles.SiyamRupaliFont + " text-center text-white mb-2"}>This page is under development</h2>
            <Image src={error01} alt="Under Development" />
         </Row>
      </Fragment>
   )
}

export default InactiveUserList;