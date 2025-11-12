import React, { useEffect, useState, Fragment, memo } from 'react'
import { Navbar, Container, Nav, Dropdown, Card } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import CustomToggle from '../../../dropdowns'

// import { differenceInDays } from "date-fns";

// logo
import Logo from '../../components/logo'

// Redux Selector / Action
import { useSelector } from 'react-redux';

import axios from 'axios';

// Import selectors & action from setting store
import * as SettingSelector from '../../../../store/setting/selectors'

import * as InputValidation from '../../../../views/partials/input_validation'

const Header = memo((props) => {
    axios.defaults.withCredentials = true;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const navigate = useNavigate();

    const dash_data = JSON.parse(window.localStorage.getItem("dash_data"));

    const navbarHide = useSelector(SettingSelector.navbar_show); // array
    const headerNavbar = useSelector(SettingSelector.header_navbar);
    const appShortName = useSelector(SettingSelector.app_short_name);
    const appName = useSelector(SettingSelector.app_bn_name);

    const [noticeData, setNoticeData] = useState([]);
    const [dateData, setDateData] = useState([]);

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const [profileImage, setProfileImage] = useState(null);

    const minisidebar = () => {
        document.getElementsByTagName('ASIDE')[0].classList.toggle('sidebar-mini')
    }

    useEffect(() => {
        if (dash_data?.noticeData) {
            setNoticeData(dash_data.noticeData);
        }
        if (dash_data?.dateData) {
            setDateData(dash_data.dateData);
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        // navbarstylemode
        if (headerNavbar === 'navs-sticky' || headerNavbar === 'nav-glass') {
            window.onscroll = () => {
                if (document.documentElement.scrollTop > 50) {
                    document.getElementsByTagName('nav')[0].classList.add('menu-sticky')
                } else {
                    document.getElementsByTagName('nav')[0].classList.remove('menu-sticky')
                }
            }
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch User Data
    useEffect(() => {
        if (profileImage) {
            URL.revokeObjectURL(profileImage); // Free up memory
        }

        const fetchProfileImage = async () => {
            await axios.post(`${BACKEND_URL}/user/image-fetch?`, {}, { responseType: 'blob' })
                .then(response => {
                    const profile_image = URL.createObjectURL(response.data);
                    setProfileImage(profile_image);
                })
                .catch(err => {
                    // console.error(err);
                    if (err.status === 401) {
                        navigate("/auth/sign-out");
                        return null;
                    }
                });
        };

        if (ceb_session?.ceb_user_id) {
            fetchProfileImage();
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!ceb_session?.ceb_user_id) {
        return null;
    }

    return (
        <Fragment>
            <Navbar expand="lg" variant="light" className={`nav iq-navbar ${headerNavbar} ${navbarHide.join(" ")}`}>
                <Container fluid className="navbar-inner">
                    <Link to="/dashboard" className="navbar-brand">
                        <Logo color={true} />
                        <h4 className="logo-title"><span data-setting="app_short_name">{appShortName}</span></h4>
                    </Link>
                    <div className="sidebar-toggle" data-toggle="sidebar" data-active="true" onClick={minisidebar}>
                        <i className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
                        </i>
                    </div>
                    <div className="search-input">
                        <h4 className='text-primary'>
                            {appName}
                        </h4>
                        {/* <input type="search" className="form-control" placeholder="Search..." /> */}
                    </div>
                    <Navbar.Toggle aria-controls="navbarSupportedContent">
                        <span className="navbar-toggler-icon">
                            <span className="mt-2 navbar-toggler-bar bar1"></span>
                            <span className="navbar-toggler-bar bar2"></span>
                            <span className="navbar-toggler-bar bar3"></span>
                        </span>
                    </Navbar.Toggle>
                    <Navbar.Collapse id="navbarSupportedContent">
                        <Nav as="ul" className="mb-2 ms-auto navbar-list mb-lg-0 align-items-center">
                            <Dropdown as="li" className="nav-item">
                                <Dropdown.Toggle as={CustomToggle} href="#" variant=" nav-link" id="notification-drop" data-bs-toggle="dropdown" >
                                    <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M19.7695 11.6453C19.039 10.7923 18.7071 10.0531 18.7071 8.79716V8.37013C18.7071 6.73354 18.3304 5.67907 17.5115 4.62459C16.2493 2.98699 14.1244 2 12.0442 2H11.9558C9.91935 2 7.86106 2.94167 6.577 4.5128C5.71333 5.58842 5.29293 6.68822 5.29293 8.37013V8.79716C5.29293 10.0531 4.98284 10.7923 4.23049 11.6453C3.67691 12.2738 3.5 13.0815 3.5 13.9557C3.5 14.8309 3.78723 15.6598 4.36367 16.3336C5.11602 17.1413 6.17846 17.6569 7.26375 17.7466C8.83505 17.9258 10.4063 17.9933 12.0005 17.9933C13.5937 17.9933 15.165 17.8805 16.7372 17.7466C17.8215 17.6569 18.884 17.1413 19.6363 16.3336C20.2118 15.6598 20.5 14.8309 20.5 13.9557C20.5 13.0815 20.3231 12.2738 19.7695 11.6453Z" fill="currentColor"></path>
                                        <path opacity="0.4" d="M14.0088 19.2283C13.5088 19.1215 10.4627 19.1215 9.96275 19.2283C9.53539 19.327 9.07324 19.5566 9.07324 20.0602C9.09809 20.5406 9.37935 20.9646 9.76895 21.2335L9.76795 21.2345C10.2718 21.6273 10.8632 21.877 11.4824 21.9667C11.8123 22.012 12.1482 22.01 12.4901 21.9667C13.1083 21.877 13.6997 21.6273 14.2036 21.2345L14.2026 21.2335C14.5922 20.9646 14.8734 20.5406 14.8983 20.0602C14.8983 19.5566 14.4361 19.327 14.0088 19.2283Z" fill="currentColor"></path>
                                    </svg>
                                    <span className="bg-danger dots"></span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-0 sub-drop dropdown-menu-end" aria-labelledby="notification-drop">
                                    <Card className="m-0 shadow-none">
                                        <Card.Header className="py-3 bg-primary">
                                            <h5 className="mb-0 text-white">বোর্ড নোটিশ</h5>
                                        </Card.Header>
                                        <Card.Body className="m-0 p-0 bg-transparent">
                                            {noticeData.map((noticeItem, idx) => (
                                                <Link key={idx} to="#" className="iq-sub-card">
                                                    <div className="d-flex align-items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-package-open-icon lucide-package-open"><path d="M12 22v-9" /><path d="M15.17 2.21a1.67 1.67 0 0 1 1.63 0L21 4.57a1.93 1.93 0 0 1 0 3.36L8.82 14.79a1.655 1.655 0 0 1-1.64 0L3 12.43a1.93 1.93 0 0 1 0-3.36z" /><path d="M20 13v3.87a2.06 2.06 0 0 1-1.11 1.83l-6 3.08a1.93 1.93 0 0 1-1.78 0l-6-3.08A2.06 2.06 0 0 1 4 16.87V13" /><path d="M21 12.43a1.93 1.93 0 0 0 0-3.36L8.83 2.2a1.64 1.64 0 0 0-1.63 0L3 4.57a1.93 1.93 0 0 0 0 3.36l12.18 6.86a1.636 1.636 0 0 0 1.63 0z" /></svg>
                                                        <div className="ms-3 w-100" style={{ textAlign: 'justify' }}>
                                                            <h6 className="mb-1">{noticeItem.bn_notice}</h6>
                                                            <small>শ্রেণীঃ {noticeItem.bn_class}, বিভাগঃ {noticeItem.bn_group}</small>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <small className="float-right font-size-12">{InputValidation.E2BDigit(noticeItem.dt_start)} থেকে {InputValidation.E2BDigit(noticeItem.dt_end)}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as="li" className="nav-item">
                                <Dropdown.Toggle as={CustomToggle} href="#" variant="nav-link" id="mail-drop" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    <svg width="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path opacity="0.4" d="M22 15.94C22 18.73 19.76 20.99 16.97 21H16.96H7.05C4.27 21 2 18.75 2 15.96V15.95C2 15.95 2.006 11.524 2.014 9.298C2.015 8.88 2.495 8.646 2.822 8.906C5.198 10.791 9.447 14.228 9.5 14.273C10.21 14.842 11.11 15.163 12.03 15.163C12.95 15.163 13.85 14.842 14.56 14.262C14.613 14.227 18.767 10.893 21.179 8.977C21.507 8.716 21.989 8.95 21.99 9.367C22 11.576 22 15.94 22 15.94Z" fill="currentColor"></path>
                                        <path d="M21.4759 5.67351C20.6099 4.04151 18.9059 2.99951 17.0299 2.99951H7.04988C5.17388 2.99951 3.46988 4.04151 2.60388 5.67351C2.40988 6.03851 2.50188 6.49351 2.82488 6.75151L10.2499 12.6905C10.7699 13.1105 11.3999 13.3195 12.0299 13.3195C12.0339 13.3195 12.0369 13.3195 12.0399 13.3195C12.0429 13.3195 12.0469 13.3195 12.0499 13.3195C12.6799 13.3195 13.3099 13.1105 13.8299 12.6905L21.2549 6.75151C21.5779 6.49351 21.6699 6.03851 21.4759 5.67351Z" fill="currentColor"></path>
                                    </svg>
                                    <span className="bg-primary count-mail"></span>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="p-0 sub-drop dropdown-menu-end" aria-labelledby="mail-drop">
                                    <Card className="m-0 p-0 shadow-none">
                                        <Card.Header className="py-3 bg-primary">
                                            <h5 className="mb-0 text-white">আবেদনের সময়সীমা</h5>
                                        </Card.Header>
                                        <Card.Body className="bg-transparent m-0 p-0">
                                            {dateData.map((dateItem, idx) => (
                                                <Link key={idx} to="#" className="iq-sub-card">
                                                    <div className="d-flex align-items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                                                        <div className="ms-3 w-100">
                                                            <h6 className="mb-0" style={{ textAlign: 'justify' }}>
                                                                {dateItem.income_code_details}
                                                                {/* <small className="float-right font-size-12">-{InputValidation.E2BDigit(differenceInDays(new Date(dateItem.dt_end), new Date()) + 1)} দিন</small> */}
                                                            </h6>
                                                            <div className="d-flex justify-content-between align-items-center">
                                                                <small>{InputValidation.E2BDigit(dateItem.dt_start)}</small>
                                                                <small>থেকে</small>
                                                                <small>{InputValidation.E2BDigit(dateItem.dt_end)}</small>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </Card.Body>
                                    </Card>
                                </Dropdown.Menu>
                            </Dropdown>
                            <Dropdown as="li" className="nav-item">
                                <Dropdown.Toggle as={CustomToggle} variant=" nav-link py-0 d-flex align-items-center" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                    <img src={profileImage} alt="User-Profile" className="img-fluid avatar avatar-50 avatar-rounded" />
                                    <div className="caption ms-3 d-none d-md-block ">
                                        <h6 className="mb-0 text-wrap text-uppercase text-end caption-title">{ceb_session.ceb_user_name}</h6>
                                        <p className="mb-0 text-end text-capitalize text-end caption-sub-title">{ceb_session.ceb_user_post}</p>
                                    </div>
                                </Dropdown.Toggle>
                                <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="navbarDropdown">
                                    <Dropdown.Item> <Link to="/admin/user-profile">প্রোফাইল বিস্তারিত</Link></Dropdown.Item>
                                    <Dropdown.Item> <Link to="/admin/user-update">প্রোফাইল আপডেট</Link></Dropdown.Item>
                                    <Dropdown.Divider />
                                    <Dropdown.Item> <Link to="/auth/sign-out">লগআউট</Link></Dropdown.Item>
                                    <Dropdown.Divider />
                                </Dropdown.Menu>
                            </Dropdown>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </Fragment>
    )
})

export default Header
