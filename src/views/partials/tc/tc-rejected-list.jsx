import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Table, Row, Col, Form, Button, Modal, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import styles from '../../../assets/custom/css/bisec.module.css'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

import * as InputValidation from '../input_validation'

const TcRejectedList = () => {
   const { permissionData } = useAuthProvider();
   const navigate = useNavigate();

   const [isBoard, setIsBoard] = useState(false);

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(((permissionData?.office === '04' || permissionData?.office === '05') && (permissionData?.role === '14' || permissionData?.role === '15')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18' || permissionData?.type === '13')) {
            navigate('/errors/error403', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData]); // run only once on mount

   const [activeAppDetails, setActiveAppDetails] = useState([]);
   const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);
   // const [activeAppReject, setActiveAppReject] = useState([]);

   const [detailsShow, setDetailsShow] = useState(false);
   const [authorizeShow, setAuthorizeShow] = useState(false);
   // const [rejectShow, setRejectShow] = useState(false);

   //Form Validation and Error
   const [validated, setValidated] = useState(false);

   //Student Search Form Data
   const [userData, setUserData] = useState({ st_class: '', st_year: '', list_type: '18' });
   const [userDataError, setUserDataError] = useState([]);
   const [validList, setValidList] = useState(false);

   //Student Data Fetch Status
   const [status, setStatus] = useState({ loading: false, success: false, error: false });

   //Student Fetched Data
   const [applicationList, setApplicationList] = useState(false);

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState();

   useEffect(() => {
      if (applicationList?.length > 0) {
         setCurrentData(applicationList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > applicationList.length ? applicationList.length : currentPage * rowsPerPage));
         setTotalPage(Math.ceil(applicationList.length / rowsPerPage));
      } else {
         setCurrentData([]);
         setTotalPage(0);
      }
   }, [applicationList]);// eslint-disable-line react-hooks/exhaustive-deps

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

      return applicationList.filter((item) =>
         [item.st_reg, item.st_name, item.st_father, item.dst_eiin, item.src_eiin].some(
            (field) =>
               field != null &&
               String(field).toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, applicationList]); // eslint-disable-line react-hooks/exhaustive-deps

   //Student Data Fetch 
   const fetchApplicationList = async () => {
      setStatus({ loading: "আবেদনের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });
      try {
         const response = await axiosApi.post(`/student/tc/active/list`, { userData: userData });
         if (response.status === 200) {
            setApplicationList(response.data.listData);
            setStatus({ loading: false, success: true, error: false });
            //Set Board Status 
            permissionData.type === "13" ? setIsBoard(false) : setIsBoard(true);
            //Set Data for Pagination
            setRowsPerPage(10);
            setTotalPage(Math.ceil(response.data.listData.length / 10));
            setCurrentPage(1);
            setCurrentData(response.data.listData.slice(0, 10));
            setValidList(true);
         } else {
            setValidated(false);
            setValidList(false);
            setStatus({ loading: false, success: false, error: "কোন বাতিলকৃত আবেদন পাওয়া যায়নি!" });
         }
      } catch (err) {
         if (err.status === 401) {
            navigate("/auth/sign-out");
         }
         setValidated(false);
         setValidList(false);
         setStatus({ loading: false, success: false, error: "কোন বাতিলকৃত আবেদন পাওয়া যায়নি!" });
      } finally {
         setStatus((prev) => ({ ...prev, loading: false }));
      }
   }

   //Submit Student Form Data
   const searchSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      setStatus({ loading: false, success: false, error: false });
      setIsBoard(false);
      setApplicationList([]);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         var isValidData = true;
         const newErrors = {};

         const requiredFields = ["st_class", "st_year", "list_type"];

         requiredFields.forEach((field) => {
            var dataError = null;

            switch (field) {
               case "st_class":
               case "st_year":
               case "list_type":
                  dataError = InputValidation.numberCheck(userData[field]);
                  break;

               default:
                  break;
            }

            if (dataError) {
               newErrors[field] = dataError;
               isValidData = false;
               setValidated(false);
            }
         });

         setUserDataError(newErrors);

         if (isValidData) {
            fetchApplicationList();
         } else {
            setStatus({ loading: false, success: false, error: "সঠিকভাবে তথ্য পূরণ করতে হবে!" });
         }
         setValidated(true);
      }
   };

   //Reset form
   const searchReset = () => {
      setValidated(false);
      setUserData({ st_class: '', st_year: '', list_type: '18' });
      setUserDataError([]);
      setValidList(false);

      setStatus({ loading: false, success: false, error: false });
      setIsBoard(false);
      setApplicationList([]);
   };

   //Handle Page Row Number Change
   const handleRowsPerPageChange = (data_per_page) => {
      data_per_page = Number(data_per_page);
      setRowsPerPage(data_per_page);
      setTotalPage(Math.ceil(applicationList.length / data_per_page));
      setCurrentPage(1);
      setCurrentData(applicationList.slice(0, data_per_page > applicationList.length ? applicationList.length : data_per_page));
   };

   //Handle Page Change
   const handleSetCurrentPage = (page_num) => {
      page_num = Number(page_num);
      if (page_num >= 1 && page_num <= totalPage) {
         setCurrentPage(page_num);
         setCurrentData(applicationList.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > applicationList.length ? applicationList.length : page_num * rowsPerPage));
      }
   };

   //TC Authorize
   const applicatioAuthorize = async (id_invoice) => {
      setAuthorizeShow(false);
      setStatus({ loading: "টিসি আবেদন আপডেট হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });

      try {
         await axiosApi.post(`/student/tc/application/authorize`, { userData: { ...userData, id_invoice: id_invoice } });
         setApplicationList(((prevData) => prevData.filter((item) => item.id_invoice !== id_invoice)));
         setStatus({ loading: false, success: "টিসি অনুমোদন সফল হয়েছে!", error: false });
      } catch (err) {
         if (err.status === 401) {
            navigate("/auth/sign-out");
         }
         setStatus({ loading: false, success: false, error: "টিসি অনুমোদন সফল হয়নি!" });
      } finally {
         setStatus((prev) => ({ ...prev, loading: false }));
      }
   };

   //TC Reject
   // const applicatioReject = async (id_invoice) => {
   //    setRejectShow(false);
   //    setStatus({ loading: "টিসি আবেদন আপডেট হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });

   //    try {
   //       await axiosApi.post(`/student/tc/application/reject`, { userData: { ...userData, id_invoice: id_invoice } });
   //       setApplicationList(((prevData) => prevData.filter((item) => item.id_invoice !== id_invoice)));
   //       setStatus({ loading: false, success: "টিসি আবেদন বাতিল সফল হয়েছে!", error: false });
   //    } catch (err) {
   //       if (err.status === 401) {
   //          navigate("/auth/sign-out");
   //       }
   //       setStatus({ loading: false, success: false, error: "টিসি আবেদন বাতিল সফল হয়নি!" });
   //    } finally {
   //       setStatus((prev) => ({ ...prev, loading: false }));
   //    }
   // };

   //Handle Details Click
   const handleDetailsClick = (item) => {
      setActiveAppDetails(item);
      setDetailsShow(true);
   };

   //Handle Details Click
   const handleAuthrizeClick = (item) => {
      setActiveAppAuthorize(item);
      setAuthorizeShow(true);
   };

   //Handle Details Click
   // const handleRejectClick = (item) => {
   //    setActiveAppReject(item);
   //    setRejectShow(true);
   // };

   if (validList) {
      return (
         <Fragment>
            <Row>
               <Col md="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <Row>
                           <Col md={12}>
                              <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>ছাড়পত্রের (TC) বাতিলকৃত আবেদনসমূহ</span></h4>
                           </Col>
                           <Col md={12}>
                              <h5 className="card-title text-center text-uppercase py-2 text-primary flex-fill">শ্রেণী: {InputValidation.E2BDigit(userData.st_class)} || সেশন: {InputValidation.E2BDigit(userData.st_year)}</h5>
                           </Col>
                           <Col md={12} className='d-flex justify-content-center align-items-center'>
                              <span className='p-2 rounded-3'>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                 <span className={styles.SiyamRupaliFont + " text-center text-danger"}> : বহির্গামী (Outgoing) আবেদন</span>
                              </span>
                              <span className='p-2 rounded-3'>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                                 <span className={styles.SiyamRupaliFont + " text-center text-success"}> : আগত (Incoming) আবেদন</span>
                              </span>
                              {isBoard && <span className='p-2 rounded-3'>
                                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0000ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-sync"><path d="M11 10v4h4" /><path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" /><path d="M16 2v4" /><path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" /><path d="M21 17v-4h-4" /><path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" /><path d="M3 10h4" /><path d="M8 2v4" /></svg>
                                 <span className={styles.SiyamRupaliFont + " text-center text-primary"}> : অন্তঃবোর্ড (Intra-Board) আবেদন</span>
                              </span>}
                           </Col>
                        </Row>
                     </Card.Header>
                     <Card.Body className="px-0">
                        <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
                           <Col md={4}>
                              <Form.Label htmlFor="per_page_data"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতি পাতায় আবেদন সংখ্যা (সর্বমোট আবেদনঃ {InputValidation.E2BDigit(applicationList.length)})</span></Form.Label>
                              <Form.Select
                                 id="per_page_data"
                                 value={rowsPerPage}
                                 onChange={(e) => handleRowsPerPageChange(e.target.value)}
                              // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                              >
                                 <option disabled value=""><span className={styles.SiyamRupaliFont + " text-center"}>-- আবেদন সংখ্যা সিলেক্ট করুন --</span></option>
                                 <option selected value="10">১০</option>
                                 <option value="20">২০</option>
                                 <option value="50">৫০</option>
                                 <option value="100">১০০</option>
                              </Form.Select>
                           </Col>
                           <Col md={4} className='d-flex justify-content-center align-items-center'>
                              <Button type="button" onClick={() => setValidList(false)} variant="btn btn-outline-warning"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                           </Col>
                           <Col md={4}>
                              <Form.Label className='d-flex justify-content-end' htmlFor="search_info"> <span className={styles.SiyamRupaliFont}>আবেদন খুঁজতে নিচের বক্সে লিখুন</span> </Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="search"
                                 id="search_info"
                                 value={searchValue}
                                 onChange={(e) => setSearchValue(e.target.value)}
                                 placeholder="তথ্য খুঁজুন..."
                              />
                           </Col>
                        </Row>
                        <Row className="table-responsive p-4">
                           {status.loading && <h6 className="text-center text-info p-2 mb-2">{status.loading}</h6>}
                           {status.success && <h6 className="text-center text-success p-2 mb-2">{status.success}</h6>}
                           {status.error && <h6 className="text-center text-danger p-2 mb-2">{status.error}</h6>}
                           <table id="user-list-table" className="table" role="grid" data-toggle="data-table">
                              <thead>
                                 <tr className="ligth">
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>ধরণ</span></th>
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>রেজিঃ নং</span></th>
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>রোল নং</span></th>
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>নাম</span></th>
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>পিতা</span></th>
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>জন্ম তারিখ</span></th>
                                    {isBoard && <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>বর্তমান প্রতিষ্ঠান</span></th>}
                                    {isBoard && <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>গন্তব্য প্রতিষ্ঠান</span></th>}
                                    {isBoard && <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>বোর্ড</span></th>}
                                    <th className='text-center align-top text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>সম্পাদনা</span></th>
                                 </tr>
                              </thead>
                              {applicationList.length > 0 && <>
                                 <tbody>
                                    {
                                       filteredData.map((item, idx) => (
                                          <tr key={idx}>
                                             <td className='text-center align-center text-wrap'>
                                                {!isBoard && item.src_eiin === permissionData.id &&
                                                   <span className='p-2 rounded-3 align-top' title='বহির্গামী (Outgoing) আবেদন'>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                                   </span>
                                                }
                                                {!isBoard && item.dst_eiin === permissionData.id &&
                                                   <span className='p-2 rounded-3 align-top' title='আগত (Incoming) আবেদন'>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                                                   </span>
                                                }

                                                {isBoard && item.src_bid === permissionData.board && item.src_bid !== item.dst_bid &&
                                                   <span className='p-2 rounded-3 align-top' title='বহির্গামী (Outgoing) আবেদন'>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#991b1b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                                   </span>
                                                }
                                                {isBoard && item.dst_bid === permissionData.board && item.src_bid !== item.dst_bid &&
                                                   <span className='p-2 rounded-3 align-top' title='আগত (Incoming) আবেদন'>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-in"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" x2="3" y1="12" y2="12" /></svg>
                                                   </span>
                                                }
                                                {isBoard && item.src_bid === item.dst_bid &&
                                                   <span className='p-2 rounded-3 align-top' title='অন্তঃবোর্ড (Intra-Board) আবেদন'>
                                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0000ff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-sync"><path d="M11 10v4h4" /><path d="m11 14 1.535-1.605a5 5 0 0 1 8 1.5" /><path d="M16 2v4" /><path d="m21 18-1.535 1.605a5 5 0 0 1-8-1.5" /><path d="M21 17v-4h-4" /><path d="M21 8.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h4.3" /><path d="M3 10h4" /><path d="M8 2v4" /></svg>
                                                   </span>
                                                }
                                             </td>
                                             <td className='text-center align-top text-wrap'>{item.st_reg}</td>
                                             <td className='text-center align-top text-wrap'>{item.st_roll}</td>
                                             <td className='text-center align-top text-wrap'>{item.st_name}</td>
                                             <td className='text-center align-top text-wrap'>{item.st_father}</td>
                                             <td className='text-center align-top text-wrap'>{item.st_dob}</td>
                                             {isBoard && <td className='text-center align-top text-wrap'>
                                                {item.src_eiin_auth === "17" && <span className={styles.SiyamRupaliFont + " text-success text-center"}>অনুমোদিত</span>}
                                                {item.src_eiin_auth === "13" && <span className={styles.SiyamRupaliFont + " text-primary text-center"}>অপেক্ষমান</span>}
                                                {item.src_eiin_auth === "18" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}
                                             </td>}
                                             {isBoard && <td className='text-center align-top text-wrap'>
                                                {item.dst_eiin_auth === "17" && <span className={styles.SiyamRupaliFont + " text-success text-center"}>অনুমোদিত</span>}
                                                {item.dst_eiin_auth === "13" && <span className={styles.SiyamRupaliFont + " text-primary text-center"}>অপেক্ষমান</span>}
                                                {item.dst_eiin_auth === "18" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}
                                             </td>}
                                             {isBoard && <td className='text-center align-top text-wrap'>
                                                {item.src_board_auth === "17" && item.dst_board_auth === "17" && <span className={styles.SiyamRupaliFont + " text-success text-center"}>অনুমোদিত</span>}
                                                {item.src_board_auth === "17" && item.dst_board_auth === "13" && <span className={styles.SiyamRupaliFont + " text-info text-center"}>প্রক্রিয়াধীন</span>}
                                                {item.src_board_auth === "17" && item.dst_board_auth === "18" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}

                                                {item.src_board_auth === "13" && item.dst_board_auth === "17" && <span className={styles.SiyamRupaliFont + " text-info text-center"}>প্রক্রিয়াধীন</span>}
                                                {item.src_board_auth === "13" && item.dst_board_auth === "13" && <span className={styles.SiyamRupaliFont + " text-primary text-center"}>অপেক্ষমান</span>}
                                                {item.src_board_auth === "13" && item.dst_board_auth === "18" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}

                                                {item.src_board_auth === "18" && item.dst_board_auth === "17" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}
                                                {item.src_board_auth === "18" && item.dst_board_auth === "13" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}
                                                {item.src_board_auth === "18" && item.dst_board_auth === "18" && <span className={styles.SiyamRupaliFont + " text-danger text-center"}>বাতিল</span>}
                                             </td>}
                                             <td>
                                                <div className="d-flex justify-content-center align-items-center gap-3 list-user-action">
                                                   <Button className='m-0 p-1' type="button" onClick={() => handleAuthrizeClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="অনুমোদন" data-original-title="অনুমোদন">
                                                      <span className="btn-inner">
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                      </span>
                                                   </Button>
                                                   <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                      <span className="btn-inner">
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                      </span>
                                                   </Button>
                                                   {/* {!isBoard && item.src_board_auth === '13' && item.dst_board_auth === '13' && <Button className='m-0 p-1' type="button" onClick={() => handleRejectClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
                                                      <span className="btn-inner">
                                                         <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                                      </span>
                                                   </Button>} */}
                                                </div>
                                             </td>
                                          </tr>
                                       ))
                                    }
                                 </tbody>
                              </>}
                           </table>
                        </Row>
                        {applicationList.length > 0 && <>
                           <Row className='d-flex justify-content-between px-5'>
                              <Col md={5}>
                                 <Button className='flex-fill' disabled variant="btn btn-light"><span className={styles.SiyamRupaliFont}>আবেদন {InputValidation.E2BDigit(((currentPage - 1) * rowsPerPage) + 1)} থেকে {InputValidation.E2BDigit(currentPage * rowsPerPage > applicationList.length ? applicationList.length : currentPage * rowsPerPage)} পর্যন্ত</span></Button>
                              </Col>
                              <Col md={2} className='d-flex justify-content-center align-items-center'>
                                 <Button type="button" onClick={() => setValidList(false)} variant="btn btn-outline-warning"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                              </Col>
                              <Col md={5} className='d-flex justify-content-center gap-1'>
                                 <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>
                                 <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>
                                 {currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage - 1}</Button>}
                                 <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{currentPage}</Button>
                                 {totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage + 1}</Button>}
                                 <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>
                                 <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>
                              </Col>
                           </Row>
                        </>}
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            {activeAppDetails && (
               <Modal
                  show={detailsShow}
                  onHide={() => setDetailsShow(false)}
                  backdrop="static"
                  keyboard={false}
                  className='modal-lg'
               >
                  <Modal.Header closeButton>
                     <Modal.Title className={styles.SiyamRupaliFont + " w-100 text-center"}>ট্রান্সফার সার্টিফিকেট (TC) বিস্তারিত</Modal.Title>
                  </Modal.Header>
                  <Modal.Body className='table-responsive'>
                     <Table className='table table-bordered'>
                        <tbody>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রেজিস্ট্রেশন নম্বর</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'>{activeAppDetails.st_reg}</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রোল নম্বর</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'>{activeAppDetails.st_roll}</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'>{activeAppDetails.st_name}</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>পিতার নাম</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'>{activeAppDetails.st_father}</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>মাতার নাম</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'>{activeAppDetails.st_mother}</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>জন্ম তারিখ</span></td>
                              <td colSpan={3} className='text-wrap p-2 m-0'> {activeAppDetails.st_dob} </td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠান</span></td>
                              <td colSpan={3} className='text-wrap text-uppercase p-2 m-0'>{activeAppDetails.src_institute} - [{activeAppDetails.src_eiin}]</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠান</span></td>
                              <td colSpan={3} className='text-wrap text-uppercase p-2 m-0'>{activeAppDetails.btc_institute} - [{activeAppDetails.dst_eiin}]</td>
                           </tr>
                           <tr>
                              <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}>পঠিত বিষয়</span></td>
                              {activeAppDetails.id_religion === '01' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                              {activeAppDetails.id_religion === '02' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                              {activeAppDetails.id_religion === '03' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                              {activeAppDetails.id_religion === '04' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont + " text-center"}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                           </tr>
                           {isBoard && <tr>
                              <td colSpan={4} className='p-2 text-center m-0 bg-primary text-white fs-6'> <span className={styles.SiyamRupaliFont}> কার্যক্রম </span></td>
                           </tr>}
                           {isBoard && <tr>
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>ধরণ</span></td>
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>অবস্থা</span></td>
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>আইডি</span></td>
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>তারিখ</span></td>
                           </tr>}
                           {isBoard && <tr>
                              <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}> বর্তমান প্রতিষ্ঠান </span></td>
                              {activeAppDetails.src_eiin_auth === "17" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-success"}>অনুমোদিত</span></td>}
                              {activeAppDetails.src_eiin_auth === "13" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-secondary"}>অপেক্ষমান</span></td>}
                              {activeAppDetails.src_eiin_auth === "18" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-danger"}>বাতিল</span></td>}
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>{activeAppDetails.src_eiin}</span></td>
                              <td className='p-2 text-center m-0'>{activeAppDetails.src_eiin_date}</td>
                           </tr>}
                           {isBoard && <tr>
                              <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}> গন্তব্য প্রতিষ্ঠান </span></td>
                              {activeAppDetails.dst_eiin_auth === "17" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-success"}>অনুমোদিত</span></td>}
                              {activeAppDetails.dst_eiin_auth === "13" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-secondary"}>অপেক্ষমান</span></td>}
                              {activeAppDetails.dst_eiin_auth === "18" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-danger"}>বাতিল</span></td>}
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>{activeAppDetails.dst_eiin}</span></td>
                              <td className='p-2 text-center m-0'>{activeAppDetails.dst_eiin_date}</td>
                           </tr>}
                           {isBoard && <tr>
                              <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}> বর্তমান বোর্ড </span></td>
                              {activeAppDetails.src_board_auth === "17" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-success"}>অনুমোদিত</span></td>}
                              {activeAppDetails.src_board_auth === "13" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-secondary"}>অপেক্ষমান</span></td>}
                              {activeAppDetails.src_board_auth === "18" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-danger"}>বাতিল</span></td>}
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>{activeAppDetails.sboard_auth_id}</span></td>
                              <td className='p-2 text-center m-0'>{activeAppDetails.src_board_date}</td>
                           </tr>}
                           {isBoard && <tr>
                              <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}> গন্তব্য বোর্ড </span></td>
                              {activeAppDetails.dst_board_auth === "17" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-success"}>অনুমোদিত</span></td>}
                              {activeAppDetails.dst_board_auth === "13" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-secondary"}>অপেক্ষমান</span></td>}
                              {activeAppDetails.dst_board_auth === "18" && <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont + " text-danger"}>বাতিল</span></td>}
                              <td className='p-2 text-center m-0'> <span className={styles.SiyamRupaliFont}>{activeAppDetails.dboard_auth_id}</span></td>
                              <td className='p-2 text-center m-0'>{activeAppDetails.dst_board_date}</td>
                           </tr>}
                        </tbody>
                     </Table>
                  </Modal.Body>
                  <Modal.Footer>
                     <Button variant="secondary" onClick={() => setDetailsShow(false)}>
                        ফিরে যান
                     </Button>
                  </Modal.Footer>
               </Modal>
            )}
            {activeAppAuthorize && (
               <Modal
                  show={authorizeShow}
                  onHide={() => setAuthorizeShow(false)}
                  backdrop="static"
                  keyboard={false}
               >
                  <Modal.Header closeButton>
                     <Modal.Title><span className={styles.SiyamRupaliFont}>আবেদন অনুমোদন করতে চান?</span></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     {!isBoard && activeAppAuthorize.src_eiin === permissionData.id && <p><span className={styles.SiyamRupaliFont}>আবেদনের তথ্য নিশ্চিত হয়ে অনুমোদন করুন। ব্যত্যয়ে প্রতিষ্ঠান প্রধান ব্যক্তিগতভাবে দায়ী থাকবেন।</span></p>}

                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth !== "17" && <p><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠান থেকে অনুমোদন দেয়া হয়নি! বর্তমান প্রতিষ্ঠানের অনুমোদনের পর আপনার প্রতিষ্ঠান থেকে অনুমোদন দেয়া যাবে।</span></p>}

                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && <p><span className={styles.SiyamRupaliFont}>আপনার প্রতিষ্ঠানের নিবন্ধিত বিষয়ের সাথে শিক্ষার্থীর পঠিত বিষয় নিশ্চিত হয়েই অনুমোদন করুন। ব্যত্যয়ে প্রতিষ্ঠান প্রধান ব্যক্তিগতভাবে দায়ী থাকবেন।</span></p>}

                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && activeAppAuthorize.id_religion === '01' && <p><span className={styles.SiyamRupaliFont}>পঠিত বিষয়ঃ ১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></p>}
                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && activeAppAuthorize.id_religion === '02' && <p><span className={styles.SiyamRupaliFont}>পঠিত বিষয়ঃ ১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></p>}
                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && activeAppAuthorize.id_religion === '03' && <p><span className={styles.SiyamRupaliFont}>পঠিত বিষয়ঃ ১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></p>}
                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && activeAppAuthorize.id_religion === '04' && <p><span className={styles.SiyamRupaliFont}>পঠিত বিষয়ঃ ১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></p>}

                     {isBoard && <p><span className={styles.SiyamRupaliFont}>উভয় প্রতিষ্ঠান থেকে অনুমোদনের পর বোর্ড থেকে অনুমোদন দেয়া যাবে। আবেদনের তথ্য নিশ্চিত হয়ে অনুমোদন করুন।</span></p>}
                  </Modal.Body>
                  <Modal.Footer>
                     {!isBoard && activeAppAuthorize.src_eiin === permissionData.id && <Button variant="success" onClick={() => applicatioAuthorize(activeAppAuthorize.id_invoice)}>
                        সম্মত
                     </Button>}

                     {!isBoard && activeAppAuthorize.src_eiin !== permissionData.id && activeAppAuthorize.src_eiin_auth === "17" && <Button variant="success" onClick={() => applicatioAuthorize(activeAppAuthorize.id_invoice)}>
                        সম্মত
                     </Button>}

                     {isBoard && ((activeAppAuthorize.dst_board === '11' && activeAppAuthorize.src_eiin_auth === '17' && activeAppAuthorize.dst_eiin_auth === '17') || (activeAppAuthorize.dst_board !== '11' && activeAppAuthorize.src_eiin_auth === '17')) && <Button variant="success" onClick={() => applicatioAuthorize(activeAppAuthorize.id_invoice)}>
                        সম্মত
                     </Button>}
                     <Button variant="secondary" onClick={() => setAuthorizeShow(false)}>
                        ফিরে যান
                     </Button>
                  </Modal.Footer>
               </Modal>
            )}
            {/* {activeAppReject && (
               <Modal
                  show={rejectShow}
                  onHide={() => setRejectShow(false)}
                  backdrop="static"
                  keyboard={false}
               >
                  <Modal.Header closeButton>
                     <Modal.Title><span className={styles.SiyamRupaliFont}>আবেদন বাতিল করতে চান?</span></Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                     {!isBoard && (activeAppReject.src_board_auth === '17' || activeAppReject.src_board_auth === '17') && <p><span className={styles.SiyamRupaliFont + " text-center"}>প্রতিষ্ঠানের অনুমোদনের প্রেক্ষিতে বোর্ডে আবেদনটি অনুমোদিত হয়েছে। প্রতিষ্ঠান থেকে অনুমোদন/বাতিল করা সম্ভব নয়।</span></p>}

                     {!isBoard && (activeAppReject.src_board_auth === '18' || activeAppReject.src_board_auth === '18') && <p><span className={styles.SiyamRupaliFont + " text-center"}>বোর্ডে আবেদনটি বাতিল হয়েছে। প্রতিষ্ঠান থেকে অনুমোদন/বাতিল করা সম্ভব নয়।</span></p>}

                     {!isBoard && activeAppReject.src_eiin !== permissionData.id && activeAppReject.src_eiin_auth !== "17" && <p><span className={styles.SiyamRupaliFont + " text-center"}>বর্তমান প্রতিষ্ঠান থেকে অনুমোদন দেয়া হয়নি! বর্তমান প্রতিষ্ঠানের অনুমোদনের জন্য অপেক্ষা করুন।</span></p>}

                     {!isBoard && activeAppReject.src_eiin === permissionData.id && activeAppReject.src_board_auth !== '18' && activeAppReject.src_board_auth === '13' && activeAppReject.src_board_auth === '13' && <p><span className={styles.SiyamRupaliFont + " text-center"}>যথাযথ কারণ নিশ্চিত হয়ে বাতিল করুন। ব্যত্যয়ে প্রতিষ্ঠান প্রধান ব্যক্তিগতভাবে দায়ী থাকবেন।</span></p>}

                     {!isBoard && activeAppReject.src_eiin !== permissionData.id && activeAppReject.src_eiin_auth === "17" && activeAppReject.src_board_auth === '13' && activeAppReject.src_board_auth === '13' && <p><span className={styles.SiyamRupaliFont + " text-center"}>যথাযথ কারণ নিশ্চিত হয়ে বাতিল করুন। ব্যত্যয়ে প্রতিষ্ঠান প্রধান ব্যক্তিগতভাবে দায়ী থাকবেন।</span></p>}

                     {isBoard && <p><span className={styles.SiyamRupaliFont + " text-center"}>যথাযথ কারণ নিশ্চিত হয়ে বাতিল করুন।</span></p>}
                  </Modal.Body>
                  <Modal.Footer>
                     {!isBoard && activeAppReject.src_eiin === permissionData.id && activeAppReject.src_board_auth === '13' && activeAppReject.dst_board_auth === '13' && <Button variant="danger" onClick={() => applicatioReject(activeAppReject.id_invoice)}>
                        সম্মত
                     </Button>}

                     {!isBoard && activeAppReject.src_eiin !== permissionData.id && activeAppReject.src_board_auth === '13' && activeAppReject.dst_board_auth === '13' && activeAppReject.src_eiin_auth === '17' && <Button variant="danger" onClick={() => applicatioReject(activeAppReject.id_invoice)}>
                        সম্মত
                     </Button>}

                     {isBoard && <Button variant="danger" onClick={() => applicatioReject(activeAppReject.id_invoice)}>
                        সম্মত
                     </Button>}
                     <Button variant="secondary" onClick={() => setRejectShow(false)}>
                        ফিরে যান
                     </Button>
                  </Modal.Footer>
               </Modal>
            )} */}
         </Fragment>
      )
   }

   return (
      <Fragment>
         <Row className='d-flex justify-content-center align-items-center'>
            <Col md="12">
               <Card>
                  <Card.Header className="d-flex justify-content-between">
                     <div className="header-title w-100">
                        <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>ছাড়পত্রের (TC) বাতিলকৃত আবেদনসমূহ</span></h4>
                     </div>
                  </Card.Header>
                  <Card.Body className="px-0">
                     <Row className='justify-content-center'>
                        <Col md="8">
                           {status.loading && <h6 className="text-center rounded-1 text-info p-2 mb-2">{status.loading}</h6>}
                           {status.error && <h6 className="text-center rounded-1 bg-danger text-white p-2 mb-2">{status.error}</h6>}
                           <Form noValidate onSubmit={searchSubmit} onReset={searchReset}>
                              <Row>
                                 <Col className='my-2' md={6}>
                                    <Form.Group className="bg-transparent">
                                       <Form.Label className="text-primary" htmlFor='st_class'>শিক্ষার্থীর শ্রেণী</Form.Label>
                                       <Form.Select
                                          id="st_class"
                                          value={userData.st_class}
                                          isInvalid={validated && !!userDataError.st_class}
                                          isValid={validated && userData.st_class && !userDataError.st_class}
                                          onChange={(e) => setUserData((prev) => ({ ...prev, st_class: e.target.value }))}
                                          className="selectpicker form-control"
                                          data-style="py-0"
                                       >
                                          <option value="">শ্রেণী সিলেক্ট করুন</option>
                                          {(permissionData.office === "81" || permissionData.office === "83" || permissionData.office === "85" || permissionData.office === "05" || permissionData.role === "17") && <>
                                             <option value="06">ষষ্ট</option>
                                             <option value="07">সপ্তম</option>
                                             <option value="08">অষ্টম</option>
                                          </>}
                                          {(permissionData.office === "82" || permissionData.office === "83" || permissionData.office === "85" || permissionData.office === "05" || permissionData.role === "17") && <>
                                             <option value="09">নবম</option>
                                             <option value="10">দশম</option>
                                          </>}
                                          {(permissionData.office === "84" || permissionData.office === "85" || permissionData.office === "04" || permissionData.role === "17") && <>
                                             <option value="11">একাদশ</option>
                                             <option value="12">দ্বাদশ</option>
                                          </>}
                                       </Form.Select>
                                       {validated && userDataError.st_class && (
                                          <Form.Control.Feedback type="invalid">
                                             শ্রেণী {userDataError.st_class}
                                          </Form.Control.Feedback>
                                       )}
                                    </Form.Group>
                                 </Col>
                                 <Col className='my-2' md={6}>
                                    <Form.Label className="text-primary" htmlFor="st_year">সেশন/বছর</Form.Label>
                                    <Form.Control
                                       className='bg-transparent text-uppercase'
                                       type="text"
                                       id="st_year"
                                       value={userData.st_year}
                                       isInvalid={validated && !!userDataError.st_year}
                                       isValid={validated && userData.st_year && !userDataError.st_year}
                                       onChange={(e) => setUserData((prev) => ({ ...prev, st_year: e.target.value }))}
                                    />
                                    {validated && userDataError.st_year && (
                                       <Form.Control.Feedback type="invalid">
                                          সেশন/বছর {userDataError.st_year}
                                       </Form.Control.Feedback>
                                    )}
                                 </Col>
                              </Row>
                              <div className="d-flex justify-content-center mt-4 pt-4 gap-3">
                                 <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                              </div>
                           </Form>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )
}

export default TcRejectedList;