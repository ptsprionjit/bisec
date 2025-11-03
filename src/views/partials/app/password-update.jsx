import React, { Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';

import { Row, Col, Image, Nav, Tab, Table } from 'react-bootstrap'
import Card from '../../../components/Card'

import { Link, useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import axios from 'axios';

// import Maintenance from '../errors/maintenance';

const PasswordChange = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const [profileImage, setProfileImage] = useState(null);
   // const [profileGallery, setProfileGallery] = useState([]);

   const [userData, setUserData] = useState([]);

   //Data Fetch Status
   const [loadingSuccess, setLoadingSuccess] = useState(false);
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);

   // Fetch User Data
   useEffect(() => {
      const [user_id, user_type] = [
         ceb_session.ceb_user_id,
         ceb_session.ceb_user_type,
      ];

      const fetchProfileImage = async () => {
         await axios.post(`${BACKEND_URL}/user/image?`, { user_id }, { responseType: 'blob' })
            .then(response => {
               const profile_image = URL.createObjectURL(response.data);
               setProfileImage(profile_image);
               if (profileImage) {
                  URL.revokeObjectURL(profile_image); // Free up memory
               }
            })
            .catch((err) => {
               // console.error(err)
            });
      };

      fetchProfileImage();

      const fetchProfileData = async () => {
         setLoadingData("Loading Data...");
         setLoadingSuccess(false);
         try {
            const user_data = await axios.post(`${BACKEND_URL}/user/details?`, { user_id, user_type });
            setUserData(user_data.data[0]);
            // console.log(user_data.data[0]);
            setLoadingSuccess(true);
         } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setLoadingError("Profile Data Loading Problem!");
            // console.log(err);
         } finally {
            setLoadingData(false);
         }
      }

      fetchProfileData();
   }, []); // eslint-disable-line react-hooks/exhaustive-deps

   // const [toggler, setToggler] = useState();

   if (!ceb_session) {
      return null;
   }

   if (ceb_session.ceb_user_type !== '13') return (
      <Fragment>
         {/* <FsLightbox
            toggler={toggler}
            sources={profileGallery}
         /> */}
         <Tab.Container defaultActiveKey="first">
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
                                 <h4 className="text-uppercase me-2 h4">{ceb_session.ceb_user_name}</h4>
                                 <span className="text-uppercase"> - {ceb_session.ceb_user_id}</span>
                              </div>
                           </div>
                           <Nav as="ul" className="d-flex nav-pills mb-0 text-center profile-tab" data-toggle="slider-tab" id="profile-pills-tab" role="tablist">
                              <Nav.Item as="li">
                                 <Nav.Link eventKey="first">Profile</Nav.Link>
                              </Nav.Item>
                              {/* <Nav.Item as="li">
                                 <Nav.Link eventKey="second">Promotion</Nav.Link>
                              </Nav.Item>
                              <Nav.Item as="li">
                                 <Nav.Link eventKey="third">Posting</Nav.Link>
                              </Nav.Item>
                              <Nav.Item as="li">
                                 <Nav.Link eventKey="fourth">Activity</Nav.Link>
                              </Nav.Item> */}
                           </Nav>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>

               <Col lg="4">
                  <Card>
                     <Card.Header>
                        <div className="header-title">
                           <h4 className="card-title">About</h4>
                        </div>
                     </Card.Header>
                     <Card.Body>
                        <div className="mb-1">Email: <Link to="#" className="ms-3">{userData.email}</Link></div>
                        <div className="mb-1">Phone: <Link to="#" className="ms-3">{userData.mobile}</Link></div>
                        <div>Location: <span className="ms-3">Bangladesh</span></div>
                     </Card.Body>
                  </Card>
                  <Card>
                     <Card.Header>
                        <div className="header-title">
                           <h4 className="card-title">Board Notice</h4>
                        </div>
                     </Card.Header>
                     <Card.Body>
                        <ul className="list-inline m-0 p-0">
                           <li className="d-flex mb-2">
                              <div className="news-icon me-3">
                                 <svg width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
                                 </svg>
                              </div>
                              <p className="news-detail mb-0">Class Six Registration of Session 2025 Starts From 01 July 2025 <Link to="#">Details</Link></p>
                           </li>
                           <li className="d-flex mb-2">
                              <div className="news-icon me-3">
                                 <svg width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
                                 </svg>
                              </div>
                              <p className="news-detail mb-0">HSC Form Fillup for Exam 2025 Starts From 01 August 2025 <Link to="#">Details</Link></p>
                           </li>
                           <li className="d-flex mb-2">
                              <div className="news-icon me-3">
                                 <svg width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
                                 </svg>
                              </div>
                              <p className="news-detail mb-0">HSC Form Fillup for Exam 2025 Starts From 01 August 2025 <Link to="#">Details</Link></p>
                           </li>
                           <li className="d-flex mb-2">
                              <div className="news-icon me-3">
                                 <svg width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
                                 </svg>
                              </div>
                              <p className="news-detail mb-0">HSC Form Fillup for Exam 2025 Starts From 01 August 2025 <Link to="#">Details</Link></p>
                           </li>
                           <li className="d-flex mb-2">
                              <div className="news-icon me-3">
                                 <svg width="20" viewBox="0 0 24 24">
                                    <path fill="currentColor" d="M20,2H4A2,2 0 0,0 2,4V22L6,18H20A2,2 0 0,0 22,16V4C22,2.89 21.1,2 20,2Z" />
                                 </svg>
                              </div>
                              <p className="news-detail mb-0">HSC Form Fillup for Exam 2025 Starts From 01 August 2025 <Link to="#">Details</Link></p>
                           </li>
                        </ul>
                     </Card.Body>
                  </Card>
                  {/* <Card>
                     <Card.Header className="d-flex align-items-center justify-content-between">
                        <div className="header-title">
                           <h4 className="card-title">Gallery</h4>
                        </div>
                        <span>Moments</span>
                     </Card.Header>
                     <Card.Body>
                        <div className="d-grid gap-card grid-cols-3">
                           {profileGallery.map((src, index) => (
                              <Link key={index} onClick={() => setToggler(!toggler)} to="#">
                                 <Image src={src} className="img-fluid bg-soft-primary rounded" alt={`image-${index}`} />
                              </Link>
                           ))}
                        </div>
                     </Card.Body>
                  </Card> */}
               </Col>
               <Col lg="8">
                  <Tab.Content className="profile-content">
                     <Tab.Pane eventKey="first" id="profile-profile">
                        <Card>
                           <Card.Header>
                              {loadingData && <h4 className="card-title">{loadingData}</h4>}
                              {loadingError && <h4 className="card-title">{loadingError}</h4>}
                              {loadingSuccess && <h4 className="card-title"> Profile Details </h4>}
                           </Card.Header>
                           <Card.Body>
                              <div className="text-center">
                                 <div className="user-profile">
                                    <Image className="rounded-pill avatar-130 img-fluid" src={profileImage} alt="profile-pic" />
                                 </div>
                                 <div className="mt-3">
                                    <h4 className="text-uppercase d-inline-block">{ceb_session.ceb_user_name}</h4>
                                    <p className="text-uppercase d-inline-block"> - {ceb_session.ceb_user_id}</p>
                                    <p className="mb-0"></p>
                                 </div>
                              </div>
                           </Card.Body>
                        </Card>
                        <Card>
                           <Card.Header>
                              <h5 className="text-center w-100 card-title">Personal Information</h5>
                           </Card.Header>
                           <Card.Body>
                              <div className='table-responsive'>
                                 <Table className='table'>
                                    <thead>
                                       <tr>
                                          <th className='text-wrap p-2 m-0'>Title</th>
                                          <th className='text-wrap p-2 m-0'>:</th>
                                          <th className='text-wrap p-2 m-0'>Details</th>
                                          <th className='text-wrap p-2 m-0'>Title</th>
                                          <th className='text-wrap p-2 m-0'>:</th>
                                          <th className='text-wrap p-2 m-0'>Details</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Name</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{ceb_session.ceb_user_name}</td>
                                          <td className='text-wrap p-2 m-0'>ID</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{ceb_session.ceb_user_id}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Father</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.father}</td>
                                          <td className='text-wrap p-2 m-0'>Mother</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.mother}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Gender</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.gender}</td>
                                          <td className='text-wrap p-2 m-0'>Religion</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.religion}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>NID</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.id_number}</td>
                                          <td className='text-wrap p-2 m-0'>Birth Date</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.dob}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Quota</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.quota}</td>
                                          <td className='text-wrap p-2 m-0'>Disability</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.disability}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Address</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0 text-uppercase'>{userData.address}, {userData.post_office}, {userData.upazila}, {userData.district}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                           </Card.Body>
                        </Card>
                        <Card>
                           <Card.Header>
                              <h5 className="text-center w-100 card-title">Professional Details</h5>
                           </Card.Header>
                           <Card.Body>
                              <div className='table-responsive'>
                                 <Table className='table'>
                                    <thead>
                                       <tr>
                                          <th className='text-wrap p-2 m-0'>Title</th>
                                          <th className='text-wrap p-2 m-0'>:</th>
                                          <th className='text-wrap p-2 m-0'>Details</th>
                                          <th className='text-wrap p-2 m-0'>Title</th>
                                          <th className='text-wrap p-2 m-0'>:</th>
                                          <th className='text-wrap p-2 m-0'>Details</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>First Posting</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.start}</td>
                                          <td className='text-wrap p-2 m-0'>Posting Date</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.start_date}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Current Posting</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.last}</td>
                                          <td className='text-wrap p-2 m-0'>Posting Date</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.last_date}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Board Section</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0 text-uppercase'>{userData.section}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Board Designation</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td className='text-wrap p-2 m-0 text-uppercase'>{userData.last}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                           </Card.Body>
                        </Card>
                        <Card>
                           <Card.Header>
                              <h5 className="text-center w-100 card-title">Account Details</h5>
                           </Card.Header>
                           <Card.Body>
                              <div className='table-responsive'>
                                 <Table className='table'>
                                    <thead>
                                       <tr>
                                          <th className='text-wrap p-2 m-0'>Title</th>
                                          <th className='text-wrap p-2 m-0'>:</th>
                                          <th colSpan={4} className='text-wrap p-2 m-0'>Details</th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Account Number</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0'>{userData.account_no}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Bank Name</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0 text-uppercase'>{userData.bank}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>Branch Name</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0 text-uppercase'>{userData.barnch}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-2 m-0'>NID</td>
                                          <td className='text-wrap p-2 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-2 m-0'>{userData.routing_no}</td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                           </Card.Body>
                        </Card>
                     </Tab.Pane >
                     {/* <Tab.Pane eventKey="fourth" id="profile-feed">
                        <Card>
                           <Card.Header className="d-flex align-items-center justify-content-between pb-4">
                              <div className="header-title">
                                 <div className="d-flex flex-wrap">
                                    <div className="media-support-user-img me-3">
                                       <Image className="rounded-pill img-fluid avatar-60 bg-soft-danger p-1 ps-2" src={profileImage} alt="" />
                                    </div>
                                    <div className="media-support-info mt-2">
                                       <h5 className="mb-0">Anna Sthesia</h5>
                                       <p className="mb-0 text-primary">colleages</p>
                                    </div>
                                 </div>
                              </div>
                              <Dropdown >
                                 <Dropdown.Toggle as="span" id="dropdownMenuButton7" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                    29 mins
                                 </Dropdown.Toggle>
                                 <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton7">
                                    <Dropdown.Item href="#">Action</Dropdown.Item>
                                    <Dropdown.Item href="#">Another action</Dropdown.Item>
                                    <Dropdown.Item href="#">Something else here</Dropdown.Item>
                                 </Dropdown.Menu>
                              </Dropdown>
                           </Card.Header>
                           <Card.Body className="p-0">
                              <div className="user-post">
                                 <Link to="#"><Image src={pages2} alt="post-image" className="img-fluid" /></Link>
                              </div>
                              <div className="comment-area p-3">
                                 <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                       <div className="d-flex align-items-center message-icon me-3">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                          </svg>
                                          <span className="ms-1">140</span>
                                       </div>
                                       <div className="d-flex align-items-center feather-icon">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
                                          </svg>
                                          <span className="ms-1">140</span>
                                       </div>
                                    </div>
                                    <div className="share-block d-flex align-items-center feather-icon">
                                       <ShareOffcanvas />
                                    </div>
                                 </div>
                                 <hr />
                                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus</p>
                                 <hr />
                                 <ul className="list-inline p-0 m-0">
                                    <li className="mb-2">
                                       <div className="d-flex">
                                          <Image src={avatars3} alt="userimg" className="avatar-50 p-1 pt-2 bg-soft-primary rounded-pill img-fluid" />
                                          <div className="ms-3">
                                             <h6 className="mb-1">Monty Carlo</h6>
                                             <p className="mb-1">Lorem ipsum dolor sit amet</p>
                                             <div className="d-flex flex-wrap align-items-center mb-1">
                                                <Link to="#" className="me-3">
                                                   <svg width="20" height="20" className="text-body me-1" viewBox="0 0 24 24">
                                                      <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                                   </svg>
                                                   like
                                                </Link>
                                                <Link to="#" className="me-3">
                                                   <svg width="20" height="20" className="me-1" viewBox="0 0 24 24">
                                                      <path fill="currentColor" d="M8,9.8V10.7L9.7,11C12.3,11.4 14.2,12.4 15.6,13.7C13.9,13.2 12.1,12.9 10,12.9H8V14.2L5.8,12L8,9.8M10,5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9" />
                                                   </svg>
                                                   reply
                                                </Link>
                                                <Link to="#" className="me-3">translate</Link>
                                                <span> 5 min </span>
                                             </div>
                                          </div>
                                       </div>
                                    </li>
                                    <li>
                                       <div className="d-flex">
                                          <Image src={avatars4} alt="userimg" className="avatar-50 p-1 bg-soft-danger rounded-pill img-fluid" />
                                          <div className="ms-3">
                                             <h6 className="mb-1">Paul Molive</h6>
                                             <p className="mb-1">Lorem ipsum dolor sit amet</p>
                                             <div className="d-flex flex-wrap align-items-center">
                                                <Link to="#" className="me-3">
                                                   <svg width="20" height="20" className="text-body me-1" viewBox="0 0 24 24">
                                                      <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                                   </svg>
                                                   like
                                                </Link>
                                                <Link to="#" className="me-3">
                                                   <svg width="20" height="20" className="me-1" viewBox="0 0 24 24">
                                                      <path fill="currentColor" d="M8,9.8V10.7L9.7,11C12.3,11.4 14.2,12.4 15.6,13.7C13.9,13.2 12.1,12.9 10,12.9H8V14.2L5.8,12L8,9.8M10,5L3,12L10,19V14.9C15,14.9 18.5,16.5 21,20C20,15 17,10 10,9" />
                                                   </svg>
                                                   reply
                                                </Link>
                                                <Link to="#" className="me-3">translate</Link>
                                                <span> 5 min </span>
                                             </div>
                                          </div>
                                       </div>
                                    </li>
                                 </ul>
                                 <Form className="comment-text d-flex align-items-center mt-3" action="">
                                    <Form.Control type="text" className="rounded" placeholder="Lovely!" />
                                    <div className="comment-attagement d-flex">
                                       <Link to="#" className="me-2 text-body">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
                                          </svg>
                                       </Link>
                                       <Link to="#" className="text-body">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z" />
                                          </svg>
                                       </Link>
                                    </div>
                                 </Form>
                              </div>
                           </Card.Body>
                        </Card>
                        <Card>
                           <Card.Header className="d-flex align-items-center justify-content-between pb-4">
                              <div className="header-title">
                                 <div className="d-flex flex-wrap">
                                    <div className="media-support-user-img me-3">
                                       <Image className="rounded-pill img-fluid avatar-60 p-1 bg-soft-info" src={avatars5} alt="" />
                                    </div>
                                    <div className="media-support-info mt-2">
                                       <h5 className="mb-0">Wade Warren</h5>
                                       <p className="mb-0 text-primary">colleages</p>
                                    </div>
                                 </div>
                              </div>
                              <Dropdown>
                                 <Dropdown.Toggle as="span" id="dropdownMenuButton07" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                    1 Hr
                                 </Dropdown.Toggle>
                                 <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton07">
                                    <Dropdown.Item href="#">Action</Dropdown.Item >
                                    <Dropdown.Item href="#">Another action</Dropdown.Item >
                                    <Dropdown.Item href="#">Something else here</Dropdown.Item >
                                 </Dropdown.Menu>
                              </Dropdown>
                           </Card.Header>
                           <Card.Body className="p-0">
                              <p className="p-3 mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi nulla dolor, ornare at commodo non, feugiat non nisi. Phasellus faucibus mollis pharetra. Proin blandit ac massa sed rhoncus</p>
                              <div className="comment-area p-3"><hr className="mt-0" />
                                 <div className="d-flex flex-wrap justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                       <div className="d-flex align-items-center message-icon me-3">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M12.1,18.55L12,18.65L11.89,18.55C7.14,14.24 4,11.39 4,8.5C4,6.5 5.5,5 7.5,5C9.04,5 10.54,6 11.07,7.36H12.93C13.46,6 14.96,5 16.5,5C18.5,5 20,6.5 20,8.5C20,11.39 16.86,14.24 12.1,18.55M16.5,3C14.76,3 13.09,3.81 12,5.08C10.91,3.81 9.24,3 7.5,3C4.42,3 2,5.41 2,8.5C2,12.27 5.4,15.36 10.55,20.03L12,21.35L13.45,20.03C18.6,15.36 22,12.27 22,8.5C22,5.41 19.58,3 16.5,3Z" />
                                          </svg>
                                          <span className="ms-1">140</span>
                                       </div>
                                       <div className="d-flex align-items-center feather-icon">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M9,22A1,1 0 0,1 8,21V18H4A2,2 0 0,1 2,16V4C2,2.89 2.9,2 4,2H20A2,2 0 0,1 22,4V16A2,2 0 0,1 20,18H13.9L10.2,21.71C10,21.9 9.75,22 9.5,22V22H9M10,16V19.08L13.08,16H20V4H4V16H10Z" />
                                          </svg>
                                          <span className="ms-1">140</span>
                                       </div>
                                    </div>
                                    <div className="share-block d-flex align-items-center feather-icon">
                                       <ShareOffcanvas />
                                    </div>
                                 </div>
                                 <Form className="comment-text d-flex align-items-center mt-3" action="">
                                    <Form.Control type="text" className="rounded" placeholder="Lovely!" />
                                    <div className="comment-attagement d-flex">
                                       <Link to="#" className="me-2 text-body">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />
                                          </svg>
                                       </Link>
                                       <Link to="#" className="text-body">
                                          <svg width="20" height="20" viewBox="0 0 24 24">
                                             <path fill="currentColor" d="M20,4H16.83L15,2H9L7.17,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M20,18H4V6H8.05L9.88,4H14.12L15.95,6H20V18M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15Z" />
                                          </svg>
                                       </Link>
                                    </div>
                                 </Form>
                              </div>
                           </Card.Body>
                        </Card>
                     </Tab.Pane>
                     <Tab.Pane eventKey="second" id="profile-activity">
                        <Card>
                           <Card.Header className="d-flex justify-content-between">
                              <div className="header-title">
                                 <h4 className="card-title">Activity</h4>
                              </div>
                           </Card.Header>
                           <Card.Body>
                              <div className="iq-timeline0 m-0 d-flex align-items-center justify-content-between position-relative">
                                 <ul className="list-inline p-0 m-0">
                                    <li>
                                       <div className="timeline-dots timeline-dot1 border-primary text-primary"></div>
                                       <h6 className="float-left mb-1">Client Login</h6>
                                       <small className="float-right mt-1">24 November 2019</small>
                                       <div className="d-inline-block w-100">
                                          <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                                       </div>
                                    </li>
                                    <li>
                                       <div className="timeline-dots timeline-dot1 border-success text-success"></div>
                                       <h6 className="float-left mb-1">Scheduled Maintenance</h6>
                                       <small className="float-right mt-1">23 November 2019</small>
                                       <div className="d-inline-block w-100">
                                          <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                                       </div>
                                    </li>
                                    <li>
                                       <div className="timeline-dots timeline-dot1 border-danger text-danger"></div>
                                       <h6 className="float-left mb-1">Dev Meetup</h6>
                                       <small className="float-right mt-1">20 November 2019</small>
                                       <div className="d-inline-block w-100">
                                          <p>Bonbon macaroon jelly beans <Link to="#">gummi bears</Link>gummi bears jelly lollipop apple</p>
                                          <div className="iq-media-group iq-media-group-1">
                                             <Link to="#" className="iq-media-1">
                                                <div className="icon iq-icon-box-3 rounded-pill">SP</div>
                                             </Link>
                                             <Link to="#" className="iq-media-1">
                                                <div className="icon iq-icon-box-3 rounded-pill">PP</div>
                                             </Link>
                                             <Link to="#" className="iq-media-1">
                                                <div className="icon iq-icon-box-3 rounded-pill">MM</div>
                                             </Link>
                                          </div>
                                       </div>
                                    </li>
                                    <li>
                                       <div className="timeline-dots timeline-dot1 border-primary text-primary"></div>
                                       <h6 className="float-left mb-1">Client Call</h6>
                                       <small className="float-right mt-1">19 November 2019</small>
                                       <div className="d-inline-block w-100">
                                          <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                                       </div>
                                    </li>
                                    <li>
                                       <div className="timeline-dots timeline-dot1 border-warning text-warning"></div>
                                       <h6 className="float-left mb-1">Mega event</h6>
                                       <small className="float-right mt-1">15 November 2019</small>
                                       <div className="d-inline-block w-100">
                                          <p>Bonbon macaroon jelly beans gummi bears jelly lollipop apple</p>
                                       </div>
                                    </li>
                                 </ul>
                              </div>
                           </Card.Body>
                        </Card>
                     </Tab.Pane >
                     <Tab.Pane eventKey="third" id="profile-friends">
                        <Card>
                           <Card.Header>
                              <div className="header-title">
                                 <h4 className="card-title">Friends</h4>
                              </div>
                           </Card.Header>
                           <Card.Body>
                              <ul className="list-inline m-0 p-0">
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image className="theme-color-default-img  rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <Image className="theme-color-purple-img rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <Image className="theme-color-blue-img rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <Image className="theme-color-green-img rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <Image className="theme-color-yellow-img rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <Image className="theme-color-pink-img rounded-pill avatar-40" src={profileImage} alt="profile-pic" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Paul Molive</h6>
                                       <p className="mb-0">Web Designer</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={avatars5} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Paul Molive</h6>
                                       <p className="mb-0">trainee</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={profileImage} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Anna Mull</h6>
                                       <p className="mb-0">Web Developer</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={avatars3} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Paige Turner</h6>
                                       <p className="mb-0">trainee</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={avatars4} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Barb Ackue</h6>
                                       <p className="mb-0">Web Designer</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={avatars5} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Greta Life</h6>
                                       <p className="mb-0">Tester</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={avatars3} alt="story-img" className="rounded-pill avatar-40" />                              <div className="ms-3 flex-grow-1">
                                       <h6>Ira Membrit</h6>
                                       <p className="mb-0">Android Developer</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                                 <li className="d-flex mb-4 align-items-center">
                                    <Image src={profileImage} alt="story-img" className="rounded-pill avatar-40" />
                                    <div className="ms-3 flex-grow-1">
                                       <h6>Pete Sariya</h6>
                                       <p className="mb-0">Web Designer</p>
                                    </div>
                                    <Dropdown>
                                       <Dropdown.Toggle as="span" id="dropdownMenuButton9" data-bs-toggle="dropdown" aria-expanded="false" role="button">
                                       </Dropdown.Toggle>
                                       <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="dropdownMenuButton9">
                                          <Dropdown.Item href="#">Unfollow</Dropdown.Item>
                                          <Dropdown.Item href="#">Unfriend</Dropdown.Item>
                                          <Dropdown.Item href="#">block</Dropdown.Item>
                                       </Dropdown.Menu>
                                    </Dropdown>
                                 </li>
                              </ul>
                           </Card.Body>
                        </Card>
                     </Tab.Pane > */}
                  </Tab.Content>
               </Col>
            </Row>
         </Tab.Container>
      </Fragment>
   )

   if (ceb_session.ceb_user_type === '13') return (
      // <Maintenance />
      <div className='d-flex flex-column justify-content-center align-items-center'>
         <h2 className='text-center text-white mb-2'>This page is under development</h2>
         <Image src={error01} alt="Under Development" />
      </div>
   )
}

export default PasswordChange;