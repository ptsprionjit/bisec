import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';

import { Row, Col, Image, Table } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

// import error01 from '../../../assets/images/error/01.png'

import * as InputValidation from '../input_validation'

// import Maintenance from '../errors/maintenance';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const UserProfile = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   const dash_data = JSON.parse(window.localStorage.getItem("dash_data"));
   const [dateData, setDateData] = useState([]);

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

   useEffect(() => {
      if (dash_data?.dateData) {
         setDateData(dash_data.dateData);
      }
   }, [dash_data]);// eslint-disable-line react-hooks/exhaustive-deps

   const [profileImage, setProfileImage] = useState(null);
   // const [profileGallery, setProfileGallery] = useState([]);

   const [userData, setUserData] = useState([]);

   //Data Fetch Status
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);

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
               // console.error(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  return null;
               }
            });
      };

      fetchProfileImage();

      const fetchProfileData = async () => {
         setLoadingData("প্রোফাইল ডাটা লোড হচ্ছে...অপেক্ষা করুন...");
         try {
            const response = await axiosApi.post(`/user/details`);
            if (response.status === 200) {
               setUserData(response.data.data);
               // console.log(response.data.data);
            } else {
               setLoadingError(response.data.message);
            }
            // console.log(response);
         } catch (err) {

            setLoadingError(err.response.data.message);
            // console.log(err.response);
            if (err.status === 401) {
               navigate("/auth/sign-out");

            }
         } finally {
            setLoadingData(false);
         }
      }

      fetchProfileData();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

            <Col lg="4">
               <Card>
                  <Card.Header>
                     <h4 className="card-title">যোগাযোগ</h4>
                  </Card.Header>
                  <Card.Body>
                     <table>
                        <tbody>
                           <tr>
                              <td className='align-top text-wrap'>ইমেইল</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.inst_email}</td>
                           </tr>
                           <tr>
                              <td className='align-top text-wrap'>মোবাইল</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.inst_mobile}</td>
                           </tr>
                           <tr>
                              <td className='align-top text-wrap'>ঠিকানা</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.inst_address}, {userData.inst_post}, {userData.bn_uzps}, {userData.bn_dist}</td>
                           </tr>
                        </tbody>
                     </table>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <div className="header-title">
                        <h4 className="card-title">পদোন্নতি/পদায়ন তথ্য</h4>
                     </div>
                  </Card.Header>
                  <Card.Body>
                     {dateData.map((data, idx) => (
                        <div key={idx} className="mb-2 d-flex profile-media align-items-top">
                           <div className="mt-1 profile-dots-pills border-primary"></div>
                           <div className="ms-4 flex-fill">
                              <h6 className="mb-1 ">{String(data.income_code_details).split("ফিস")[0]} ({data.bn_entry})</h6>
                              <small className="mb-0 text-end d-block"><i>{InputValidation.E2BDigit(data.id_authorize_date)}</i></small>
                              <small className="mb-0 d-block">সময়ঃ {InputValidation.E2BDigit(data.dt_start)} থেকে {InputValidation.E2BDigit(data.dt_end)}</small>
                              <small className="mb-0 d-block">সেশনঃ {InputValidation.E2BDigit(data.st_session)}, বিভাগঃ {data.bn_group}</small>
                           </div>
                        </div>
                     ))}
                  </Card.Body>
               </Card>
            </Col>
            <Col lg="8">
               <Card>
                  <Card.Header className='d-flex flex-column justify-content-center align-items-center'>
                     {loadingData && <h6 className="text-center card-title w-100 pb-2 text-info">{loadingData}</h6>}
                     {loadingError && <h6 className="text-center card-title w-100 pb-2 text-danger">{loadingError}</h6>}
                     <h5 className="text-center w-100 card-title">সাধারণ তথ্য</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ইংরেজি নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.en_user}</td>
                                 <td className='text-wrap align-top p-2 m-0'>বাংলা নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_user}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>পর্যায়</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_status}</td>
                                 <td className='text-wrap align-top p-2 m-0'>মাধ্যম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_version}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>সহশিক্ষা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_coed}</td>
                                 <td className='text-wrap align-top p-2 m-0'>গ্রুপ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_group}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ইআইআইএন</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.user_id_number}</td>
                                 <td className='text-wrap align-top p-2 m-0'>শুরুর তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.first_post_date}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>জেলা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_dist}</td>
                                 <td className='text-wrap align-top p-2 m-0'>উপজেলা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_uzps}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ঠিকানা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.inst_address}, {userData.inst_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>এলাকা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 {userData.inst_region === '01' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>সিটি কর্পোরেশন</td>}
                                 {userData.inst_region === '02' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>পৌরসভা (প্রথম শ্রেণী)</td>}
                                 {userData.inst_region === '03' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>মফস্বল</td>}
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <h5 className="text-center w-100 card-title">অন্যান্য তথ্য</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>শুরুর পর্যায়</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_first_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.first_post_date}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>বর্তমান পর্যায়</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_last_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.last_post_date}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <h5 className="text-center w-100 card-title">বিস্তারিত ব্যাংক হিসাব (English)</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>হিসাব নম্বর</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0'>{userData.inst_account}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ব্যাংকের নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_bank}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>শাখার নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.inst_branch}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>রাউটিং নম্বর</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0'>{userData.inst_routing}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )

   return (
      <Fragment>
         {/* <FsLightbox
            toggler={toggler}
            sources={profileGallery}
         /> */}
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

            <Col lg="4">
               <Card>
                  <Card.Header>
                     <h4 className="card-title">যোগাযোগ</h4>
                  </Card.Header>
                  <Card.Body>
                     <table>
                        <tbody>
                           <tr>
                              <td className='align-top text-wrap'>ইমেইল</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.profile_email}</td>
                           </tr>
                           <tr>
                              <td className='align-top text-wrap'>মোবাইল</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.profile_mobile}</td>
                           </tr>
                           <tr>
                              <td className='align-top text-wrap'>ঠিকানা</td>
                              <td className='align-top text-wrap'>:</td>
                              <td className='align-top text-wrap'>{userData.profile_address}, {userData.profile_post}, {userData.bn_uzps}, {userData.bn_dist}</td>
                           </tr>
                        </tbody>
                     </table>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <div className="header-title">
                        <h4 className="card-title">বোর্ড নোটিশ</h4>
                     </div>
                  </Card.Header>
                  <Card.Body>
                     {dateData.map((data, idx) => (
                        <div key={idx} className="mb-2 d-flex profile-media align-items-top">
                           <div className="mt-1 profile-dots-pills border-primary"></div>
                           <div className="ms-4 flex-fill">
                              <h6 className="mb-1 ">{String(data.income_code_details).split("ফিস")[0]} ({data.bn_entry})</h6>
                              <small className="mb-0 text-end d-block"><i>{InputValidation.E2BDigit(data.id_authorize_date)}</i></small>
                              <small className="mb-0 d-block">সময়ঃ {InputValidation.E2BDigit(data.dt_start)} থেকে {InputValidation.E2BDigit(data.dt_end)}</small>
                              <small className="mb-0 d-block">সেশনঃ {InputValidation.E2BDigit(data.st_session)}, বিভাগঃ {data.bn_group}</small>
                           </div>
                        </div>
                     ))}
                  </Card.Body>
               </Card>
            </Col>
            <Col lg="8">
               <Card>
                  {loadingData && <h6 className="text-center card-title w-100 text-info">{loadingData}</h6>}
                  {loadingError && <h6 className="text-center card-title w-100 text-danger">{loadingError}</h6>}
                  <Card.Header>
                     <h5 className="text-center w-100 card-title">ব্যক্তিগত তথ্য</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ইংরেজি নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.en_user}</td>
                                 <td className='text-wrap align-top p-2 m-0'>বাংলা নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_user}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>পিতার নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.en_father}</td>
                                 <td className='text-wrap align-top p-2 m-0'>মাতার নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.en_mother}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>লিঙ্গ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_gender}</td>
                                 <td className='text-wrap align-top p-2 m-0'>ধর্ম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_religion}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>এনআইডি (NID)</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.user_id_number}</td>
                                 <td className='text-wrap align-top p-2 m-0'>জন্ম তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.user_dob}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>কোটা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_quota}</td>
                                 <td className='text-wrap align-top p-2 m-0'>ডিজেবিলিটি</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_disability}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>জেলা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_dist}</td>
                                 <td className='text-wrap align-top p-2 m-0'>থানা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_uzps}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ডাকঘর</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.profile_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>ঠিকানা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.profile_address}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <h5 className="text-center w-100 card-title">পেশাগত তথ্য</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>প্রথম যোগদান</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_first_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>যোগদানের তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.first_post_date}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>বর্তমান পদবী</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_last_post}</td>
                                 <td className='text-wrap align-top p-2 m-0'>যোগদানের তারিখ</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.last_post_date}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>বর্তমান অফিস</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_last_office}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>বর্তমান শাখা</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_last_section}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
               <Card>
                  <Card.Header>
                     <h5 className="text-center w-100 card-title">বিস্তারিত হিসাব</h5>
                  </Card.Header>
                  <Card.Body>
                     <div className='table-responsive'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>হিসাব নম্বর</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0'>{userData.profile_account}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>ব্যাংকের নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.bn_bank}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>শাখার নাম</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0 text-uppercase'>{userData.profile_branch}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap align-top p-2 m-0'>রাউটিং নম্বর</td>
                                 <td className='text-wrap align-top p-2 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap align-top p-2 m-0'>{userData.profile_routing}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </div>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )
}

export default UserProfile;