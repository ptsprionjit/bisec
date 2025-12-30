import React, { useMemo, Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';
import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const RegistrationBreg = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(((permissionData?.office === '04' || permissionData?.office === '05') && (permissionData?.role === '13' || permissionData?.role === '14' || permissionData?.role === '15')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18' || permissionData?.type === '13')) {
            navigate('/errors/error404', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   // Profile Image List
   const [profileImageList, setProfileImageList] = useState([]);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState({ user_session: '', user_class: '', user_bregno: '' });
   const [searchDataError, setSearchDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);

   // Search Data Status
   const [searchStatus, setSearchStatus] = useState({ loading: false, success: false, error: false });

   const [stData, setStData] = useState([]);

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState('');

   // Falback SVG for Images
   const fallbackSVG = `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="96px" height="96px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-user-round-icon lucide-square-user-round"><path d="M18 21a6 6 0 0 0-12 0" /><circle cx="12" cy="11" r="4" /><rect width="18" height="18" x="3" y="3" rx="2" /></svg>
   `)}`;

   const handleImageList = (image_blob) => {
      setProfileImageList(image_blob);
      setValidSearch(true);
   }

   // Fetch Images
   const fetchImages = async (st_data) => {
      try {
         const res = await axiosApi.post(`/student/image-fetch`, { st_data: st_data }, { responseType: 'blob', });
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
         [item.st_name, item.st_father, item.st_mother, item.en_gender, item.en_religion, item.st_breg, item.st_reg, item.st_dob, item.en_user].some((field) =>
            field.toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, stData]); // eslint-disable-line react-hooks/exhaustive-deps

   //Handle Page Row Number Change
   const handleRowsPerPageChange = (dataPerPage) => {
      dataPerPage = Number(dataPerPage);
      setRowsPerPage(dataPerPage);
      setTotalPage(Math.ceil(stData.length / dataPerPage));
      setCurrentPage(1);
      setCurrentData(stData.slice(0, dataPerPage > stData.length ? stData.length : dataPerPage));
   };

   //Handle Page Change
   const handleSetCurrentPage = (page_num) => {
      page_num = Number(page_num);
      if (page_num >= 1 && page_num <= totalPage) {
         setCurrentPage(page_num);
         setCurrentData(stData.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > stData.length ? stData.length : page_num * rowsPerPage));
      }
   };

   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   const handleSearchDataChange = (field, value) => {
      setSearchData(prevData => ({ ...prevData, [field]: value }));
   };

   const handleSearch = async (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
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
            'user_session', 'user_class', 'user_bregno'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'user_session':
               case 'user_class':
               case 'user_bregno':
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
            setSearchStatus({ loading: "তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন...", success: false, error: false });
            try {
               const response = await axiosApi.post(`/student/registration/search/bregno`, { user_session: searchData.user_session, user_class: searchData.user_class, user_bregno: searchData.user_bregno });
               // console.log(user_data.data.data);
               if (response.status === 200) {
                  const studentList = response.data.st_list;
                  setSearchStatus({ loading: false, success: response.data.message, error: false });
                  setStData(studentList);
                  //Set Data for Pagination
                  setRowsPerPage(10);
                  setTotalPage(Math.ceil(studentList.length / 10));
                  setCurrentPage(1);
                  setCurrentData(studentList.slice(0, 10));
                  setValidated(false);
               } else {
                  setSearchStatus({ loading: false, success: false, error: response.data.message });
                  setValidSearch(false);
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

   const handleSearchReset = (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
      setSearchDataError([]);
      setValidated(false);

      setSearchStatus({ loading: false, success: false, error: false });

      setValidSearch(false);

      setSearchData({ user_session: '', user_class: '', user_bregno: '' });
   };

   // Return if User is Authorized
   if (permissionData.type === '13' || permissionData.office === '05' || permissionData.role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title"}>নিবন্ধিত শিক্ষার্থী খুঁজুন</h4>
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
                              {searchStatus.loading && <h6 className="text-uppercase text-center py-2 text-info">{searchStatus.loading}</h6>}
                              {searchStatus.error && <h6 className="text-uppercase text-center py-2 text-danger">{searchStatus.error}</h6>}
                              {searchStatus.success && <h6 className="text-uppercase text-center py-2 text-success">{searchStatus.success}</h6>}
                           </Col>
                           <Col md={3} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_session">সেশন/বছর</Form.Label>
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
                           <Col md={3} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>শ্রেণী</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={searchData.user_class}
                                    isInvalid={validated && !!searchDataError.user_class}
                                    isValid={validated && searchData.user_class && !searchDataError.user_class}
                                    onChange={(e) => handleSearchDataChange('user_class', e.target.value)}
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
                           <Col md={6} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_bregno">জন্মনিবন্ধন নম্বর</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_bregno"
                                 maxLength={17} minLength={17}
                                 value={searchData.user_bregno}
                                 isInvalid={validated && !!searchDataError.user_bregno}
                                 isValid={validated && searchData.user_bregno && !searchDataError.user_bregno}
                                 onChange={(e) => handleSearchDataChange('user_bregno', e.target.value)}
                              />
                              {validated && searchDataError.user_bregno && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_bregno}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-success">সাবমিট</Button>
                           </Col>
                        </Row>
                     </Card.Body>
                     {validSearch && <Card.Footer className="px-0">
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
                              <Form.Label className="w-100 text-light text-center" htmlFor="per_page_data">{'.'}</Form.Label>
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
                        <Row className="table-responsive p-4">
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
                                       <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0"}>রেজিস্ট্রেশন নম্বর</p>
                                       <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>পেমেন্ট</p>
                                       <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap m-0 p-0 py-1"}>অবস্থা</p>
                                    </th>
                                    <th className='text-center align-top p-1 m-0'>
                                       <p className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>ছবি</p>
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
                                             <p className='text-center text-wrap m-0 p-0'>{item.st_reg}</p>
                                             <p className={item.id_payment === '03' ? 'text-success' : 'text-danger' + ' text-center text-wrap m-0 p-0'}>{item.bn_payment}</p>
                                             <p className={'text-center text-wrap m-0 p-0'}>
                                                <span className={item.st_status > 9 && item.st_status < 18 ? 'text-success' : 'text-danger'}>
                                                   {item.bn_app_status + " এন্ট্রি "}
                                                </span>
                                                ও
                                                <span className={item.id_entry_type === '01' ? 'text-success' : item.id_entry_type === '02' ? 'text-warning' : 'text-danger'}>
                                                   {" " + item.bn_entry} আবেদন
                                                </span>
                                             </p>
                                          </td>
                                          <td className='text-center align-center'>
                                             <Image className="text-center  m-0 p-0" style={{ minWidth: "96px", minHeight: "96px", maxWidth: "96px", maxHeight: "96px" }} src={profileImageList[item.st_id].url} alt={`Profile Image of ${item.st_name}`} />
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
                              { }
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
                     </Card.Footer>}
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

export default RegistrationBreg;