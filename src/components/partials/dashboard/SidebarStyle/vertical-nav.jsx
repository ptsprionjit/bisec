import React, { useState, useContext, memo, Fragment, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Accordion, useAccordionButton, AccordionContext } from 'react-bootstrap'

import axios from 'axios';

const VerticalNav = memo((props) => {
    axios.defaults.withCredentials = true;
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const [permissionData, setPermissionData] = useState([]);

    const [activeMenu, setActiveMenu] = useState(false);
    const [active, setActive] = useState('');
    //location
    let location = useLocation();

    function CustomToggle({ children, eventKey, onClick }) {

        const { activeEventKey } = useContext(AccordionContext);

        const decoratedOnClick = useAccordionButton(eventKey, (active) => onClick({ state: !active, eventKey: eventKey }));

        const isCurrentEventKey = activeEventKey === eventKey;

        return (
            <Link to="#" aria-expanded={isCurrentEventKey ? 'true' : 'false'} className="nav-link" role="button" onClick={(e) => {
                decoratedOnClick(isCurrentEventKey)
            }}>
                {children}
            </Link>
        );
    }

    const setSession = (permissionData) => {
        const ceb_session = JSON.stringify({
            ceb_user_id: permissionData.id,
            ceb_board_id: permissionData.board,
            ceb_user_name: permissionData.name,
            ceb_user_type: permissionData.type,
            ceb_user_office: permissionData.office,
            ceb_user_role: permissionData.role,
            ceb_user_email: permissionData.email,
            ceb_user_post: permissionData.post,
        });
        window.localStorage.setItem("ceb_session", ceb_session);
    }

    const setPermission = (ceb_session) => {
        const myData = JSON.stringify({
            id: ceb_session.ceb_user_id,
            board: ceb_session.ceb_board_id,
            name: ceb_session.ceb_user_name,
            type: ceb_session.ceb_user_type,
            office: ceb_session.ceb_user_office,
            role: ceb_session.ceb_user_role,
            email: ceb_session.ceb_user_email,
            post: ceb_session.ceb_user_post,
        });
        setPermissionData(myData);
    }

    useEffect(() => {
        const fetchPermissionData = async () => {
            try {
                const response = await axios.post(`${BACKEND_URL}/user/permission`);
                if (response.status === 200) {
                    setPermissionData(response.data.permissionData);
                    setSession(response.data.permissionData);
                } else {
                    setPermissionData([]);
                    setSession([]);
                }
            } catch (error) {
                setPermissionData([]);
                setSession([]);
            }
        }
        setPermission(ceb_session);
        // fetchPermissionData();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    if (!permissionData?.id) {
        return null;
    };

    return (
        <Fragment>
            <Accordion as="ul" className="navbar-nav iq-main-menu">
                {/* Admin Pannel */}
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">এডমিন প্যানেল</span>
                        <span className="mini-icon">-</span>
                    </Link>
                </li>
                {permissionData.type !== '13' && <li className={`${location.pathname === '/dashboard' ? 'active' : ''} nav-item `}>
                    <Link title="Dashboard" className={`${location.pathname === '/dashboard' ? 'active' : ''} nav-link `} aria-current="page" to="/dashboard" onClick={() => { }}>
                        <i className="icon">
                            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z" fill="currentColor"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">ড্যাশবোর্ড</span>
                    </Link>
                </li>}
                {(permissionData.type === '13' || permissionData.role === '17') && <li className={`${location.pathname === '/home' ? 'active' : ''} nav-item `}>
                    <Link title="Home" className={`${location.pathname === '/home' ? 'active' : ''} nav-link `} aria-current="page" to="/home" onClick={() => { }}>
                        <i className="icon">
                            <svg width="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path opacity="0.4" d="M16.0756 2H19.4616C20.8639 2 22.0001 3.14585 22.0001 4.55996V7.97452C22.0001 9.38864 20.8639 10.5345 19.4616 10.5345H16.0756C14.6734 10.5345 13.5371 9.38864 13.5371 7.97452V4.55996C13.5371 3.14585 14.6734 2 16.0756 2Z" fill="currentColor"></path>
                                <path fillRule="evenodd" clipRule="evenodd" d="M4.53852 2H7.92449C9.32676 2 10.463 3.14585 10.463 4.55996V7.97452C10.463 9.38864 9.32676 10.5345 7.92449 10.5345H4.53852C3.13626 10.5345 2 9.38864 2 7.97452V4.55996C2 3.14585 3.13626 2 4.53852 2ZM4.53852 13.4655H7.92449C9.32676 13.4655 10.463 14.6114 10.463 16.0255V19.44C10.463 20.8532 9.32676 22 7.92449 22H4.53852C3.13626 22 2 20.8532 2 19.44V16.0255C2 14.6114 3.13626 13.4655 4.53852 13.4655ZM19.4615 13.4655H16.0755C14.6732 13.4655 13.537 14.6114 13.537 16.0255V19.44C13.537 20.8532 14.6732 22 16.0755 22H19.4615C20.8637 22 22 20.8532 22 19.44V16.0255C22 14.6114 20.8637 13.4655 19.4615 13.4655Z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">হোম</span>
                    </Link>
                </li>}

                {/* Profile Menu */}
                <Accordion.Item as="li" eventKey="profile-menu" bsPrefix={`nav-item ${active === 'profile-menu' ? 'active' : ''} `} onClick={() => setActive('profile-menu')}  >
                    <CustomToggle eventKey="profile-menu" onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Profile Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-round-cog-icon lucide-user-round-cog"><path d="m14.305 19.53.923-.382" /><path d="m15.228 16.852-.923-.383" /><path d="m16.852 15.228-.383-.923" /><path d="m16.852 20.772-.383.924" /><path d="m19.148 15.228.383-.923" /><path d="m19.53 21.696-.382-.924" /><path d="M2 21a8 8 0 0 1 10.434-7.62" /><path d="m20.772 16.852.924-.383" /><path d="m20.772 19.148.924.383" /><circle cx="10" cy="8" r="5" /><circle cx="18" cy="18" r="3" /></svg>
                        </i>
                        <span className="item-name">প্রোফাইল</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="profile-menu" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="Profile" className={`${location.pathname === '/admin/user-profile' ? 'active' : ''} nav-link`} to="/admin/user-profile">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg></i>
                                    <span className="item-name">প্রোফাইল সামারি</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Profile Update" className={`${location.pathname === '/admin/user-update' ? 'active' : ''} nav-link`} to="/admin/user-update">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-pen"><path d="M11.5 15H7a4 4 0 0 0-4 4v2" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="7" r="4" /></svg></i>
                                    <span className="item-name">প্রোফাইল আপডেট</span>
                                </Link>
                            </li>
                            {permissionData.type !== '13' && <li className="nav-item">
                                <Link title='Password Change' className={`${location.pathname === '/auth/change-password' ? 'active' : ''} nav-link`} to="/auth/change-password">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round"><path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" /><circle cx="16.5" cy="7.5" r=".5" fill="currentColor" /></svg></i>
                                    <span className="item-name">পাসওয়ার্ড পরিবর্তন</span>
                                </Link>
                            </li>}
                            <li className="nav-item">
                                <Link title='Sign Out' className={`${location.pathname === '/auth/sign-out' ? 'active' : ''} nav-link`} to="/auth/sign-out">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" x2="9" y1="12" y2="12" /></svg></i>
                                    <span className="item-name">সাইন আউট</span>
                                </Link>
                            </li>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                {/* Profile Management */}
                {(permissionData.role === "17" || permissionData.role === "18") && <Accordion.Item as="li" eventKey="profile-management" bsPrefix={`nav-item ${active === 'profile-management' ? 'active' : ''} `} onClick={() => setActive('profile-management')}  >
                    <CustomToggle eventKey="profile-management" active={activeMenu === 'profile-management' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="User Management Menu" className="icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.9488 14.54C8.49884 14.54 5.58789 15.1038 5.58789 17.2795C5.58789 19.4562 8.51765 20.0001 11.9488 20.0001C15.3988 20.0001 18.3098 19.4364 18.3098 17.2606C18.3098 15.084 15.38 14.54 11.9488 14.54Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M11.949 12.467C14.2851 12.467 16.1583 10.5831 16.1583 8.23351C16.1583 5.88306 14.2851 4 11.949 4C9.61293 4 7.73975 5.88306 7.73975 8.23351C7.73975 10.5831 9.61293 12.467 11.949 12.467Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M21.0881 9.21923C21.6925 6.84176 19.9205 4.70654 17.664 4.70654C17.4187 4.70654 17.1841 4.73356 16.9549 4.77949C16.9244 4.78669 16.8904 4.802 16.8725 4.82902C16.8519 4.86324 16.8671 4.90917 16.8895 4.93889C17.5673 5.89528 17.9568 7.0597 17.9568 8.30967C17.9568 9.50741 17.5996 10.6241 16.9728 11.5508C16.9083 11.6462 16.9656 11.775 17.0793 11.7948C17.2369 11.8227 17.3981 11.8371 17.5629 11.8416C19.2059 11.8849 20.6807 10.8213 21.0881 9.21923Z" fill="currentColor"></path>
                                <path d="M22.8094 14.817C22.5086 14.1722 21.7824 13.73 20.6783 13.513C20.1572 13.3851 18.747 13.205 17.4352 13.2293C17.4155 13.232 17.4048 13.2455 17.403 13.2545C17.4003 13.2671 17.4057 13.2887 17.4316 13.3022C18.0378 13.6039 20.3811 14.916 20.0865 17.6834C20.074 17.8032 20.1698 17.9068 20.2888 17.8888C20.8655 17.8059 22.3492 17.4853 22.8094 16.4866C23.0637 15.9589 23.0637 15.3456 22.8094 14.817Z" fill="currentColor"></path>
                                <path opacity="0.4" d="M7.04459 4.77973C6.81626 4.7329 6.58077 4.70679 6.33543 4.70679C4.07901 4.70679 2.30701 6.84201 2.9123 9.21947C3.31882 10.8216 4.79355 11.8851 6.43661 11.8419C6.60136 11.8374 6.76343 11.8221 6.92013 11.7951C7.03384 11.7753 7.09115 11.6465 7.02668 11.551C6.3999 10.6234 6.04263 9.50765 6.04263 8.30991C6.04263 7.05904 6.43303 5.89462 7.11085 4.93913C7.13234 4.90941 7.14845 4.86348 7.12696 4.82926C7.10906 4.80135 7.07593 4.78694 7.04459 4.77973Z" fill="currentColor"></path>
                                <path d="M3.32156 13.5127C2.21752 13.7297 1.49225 14.1719 1.19139 14.8167C0.936203 15.3453 0.936203 15.9586 1.19139 16.4872C1.65163 17.4851 3.13531 17.8066 3.71195 17.8885C3.83104 17.9065 3.92595 17.8038 3.91342 17.6832C3.61883 14.9167 5.9621 13.6046 6.56918 13.3029C6.59425 13.2885 6.59962 13.2677 6.59694 13.2542C6.59515 13.2452 6.5853 13.2317 6.5656 13.2299C5.25294 13.2047 3.84358 13.3848 3.32156 13.5127Z" fill="currentColor"></path>
                            </svg>
                        </i>
                        <span className="item-name">প্রোফাইল ব্যবস্থাপনা</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="profile-management" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="New User" className={`${location.pathname === '/admin/user-add' ? 'active' : ''} nav-link`} to="/admin/user-add">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                    <span className="item-name">প্রোফাইল রেজিস্ট্রেশন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="User List" className={`${location.pathname === '/admin/user-list/active' ? 'active' : ''} nav-link`} to="/admin/user-list/active">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M19.5001 14.562h1.5l0.45 -2.7h1.8l-1.35 -4.04999c-0.45 -1.35 -1.007 -2.25 -2.25 -2.25s-1.8 0.9 -2.25 2.25l-0.267 0.8" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.85 2.86201c0 0.23638 0.0465 0.47045 0.137 0.68883 0.0905 0.21839 0.223 0.41682 0.3902 0.58396 0.1671 0.16715 0.3656 0.29974 0.5839 0.3902 0.2184 0.09045 0.4525 0.13701 0.6889 0.13701 0.2364 0 0.4704 -0.04656 0.6888 -0.13701 0.2184 -0.09046 0.4168 -0.22305 0.584 -0.3902 0.1671 -0.16714 0.2997 -0.36557 0.3902 -0.58396 0.0904 -0.21838 0.137 -0.45245 0.137 -0.68883 0 -0.23638 -0.0466 -0.47044 -0.137 -0.68883 -0.0905 -0.21838 -0.2231 -0.41681 -0.3902 -0.58396 -0.1672 -0.16715 -0.3656 -0.29973 -0.584 -0.39019 -0.2184 -0.09046 -0.4524 -0.13702 -0.6888 -0.13702 -0.2364 0 -0.4705 0.04656 -0.6889 0.13702 -0.2183 0.09046 -0.4168 0.22304 -0.5839 0.39019 -0.1672 0.16715 -0.2997 0.36558 -0.3902 0.58396 -0.0905 0.21839 -0.137 0.45245 -0.137 0.68883Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.562H3l-0.45 -2.7H0.75L2.1 7.81201c0.45 -1.35 1.007 -2.25 2.25 -2.25s1.8 0.9 2.25 2.25l0.267 0.8" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.55005 2.86201c0 0.23638 0.04656 0.47045 0.13702 0.68883 0.09045 0.21839 0.22304 0.41682 0.39019 0.58396 0.16714 0.16715 0.36557 0.29974 0.58396 0.3902 0.21838 0.09045 0.45245 0.13701 0.68883 0.13701 0.23638 0 0.47044 -0.04656 0.68883 -0.13701 0.21839 -0.09046 0.41682 -0.22305 0.58396 -0.3902 0.16715 -0.16714 0.29973 -0.36557 0.39019 -0.58396 0.09046 -0.21838 0.13702 -0.45245 0.13702 -0.68883 0 -0.47739 -0.18964 -0.93523 -0.52721 -1.27279 -0.33756 -0.33757 -0.7954 -0.52721 -1.27279 -0.52721 -0.47739 0 -0.93523 0.18964 -1.27279 0.52721 -0.33757 0.33756 -0.52721 0.7954 -0.52721 1.27279Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.36304 5.7952c0 0.69938 0.27782 1.37011 0.77236 1.86464 0.4945 0.49454 1.1653 0.77236 1.8646 0.77236 0.6994 0 1.3701 -0.27782 1.8647 -0.77236 0.4945 -0.49453 0.7723 -1.16526 0.7723 -1.86464 0 -0.69937 -0.2778 -1.3701 -0.7723 -1.86464 -0.4946 -0.49453 -1.1653 -0.77236 -1.8647 -0.77236 -0.6993 0 -1.3701 0.27783 -1.8646 0.77236 -0.49454 0.49454 -0.77236 1.16527 -0.77236 1.86464Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.615 14.367c0 -1.224 -0.4862 -2.3979 -1.3517 -3.2633 -0.8655 -0.8655 -2.0393 -1.35175 -3.2633 -1.35175 -1.224 0 -2.39781 0.48625 -3.26329 1.35175 -0.86548 0.8654 -1.3517 2.0393 -1.3517 3.2633v1.978h1.978l0.65899 6.593h3.956l0.659 -6.593h1.978v-1.978Z" strokeWidth="1.5"></path></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M19.5001 14.562h1.5l0.45 -2.7h1.8l-1.35 -4.04999c-0.45 -1.35 -1.007 -2.25 -2.25 -2.25s-1.8 0.9 -2.25 2.25l-0.267 0.8" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.85 2.86201c0 0.23638 0.0465 0.47045 0.137 0.68883 0.0905 0.21839 0.223 0.41682 0.3902 0.58396 0.1671 0.16715 0.3656 0.29974 0.5839 0.3902 0.2184 0.09045 0.4525 0.13701 0.6889 0.13701 0.2364 0 0.4704 -0.04656 0.6888 -0.13701 0.2184 -0.09046 0.4168 -0.22305 0.584 -0.3902 0.1671 -0.16714 0.2997 -0.36557 0.3902 -0.58396 0.0904 -0.21838 0.137 -0.45245 0.137 -0.68883 0 -0.23638 -0.0466 -0.47044 -0.137 -0.68883 -0.0905 -0.21838 -0.2231 -0.41681 -0.3902 -0.58396 -0.1672 -0.16715 -0.3656 -0.29973 -0.584 -0.39019 -0.2184 -0.09046 -0.4524 -0.13702 -0.6888 -0.13702 -0.2364 0 -0.4705 0.04656 -0.6889 0.13702 -0.2183 0.09046 -0.4168 0.22304 -0.5839 0.39019 -0.1672 0.16715 -0.2997 0.36558 -0.3902 0.58396 -0.0905 0.21839 -0.137 0.45245 -0.137 0.68883Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.5 14.562H3l-0.45 -2.7H0.75L2.1 7.81201c0.45 -1.35 1.007 -2.25 2.25 -2.25s1.8 0.9 2.25 2.25l0.267 0.8" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.55005 2.86201c0 0.23638 0.04656 0.47045 0.13702 0.68883 0.09045 0.21839 0.22304 0.41682 0.39019 0.58396 0.16714 0.16715 0.36557 0.29974 0.58396 0.3902 0.21838 0.09045 0.45245 0.13701 0.68883 0.13701 0.23638 0 0.47044 -0.04656 0.68883 -0.13701 0.21839 -0.09046 0.41682 -0.22305 0.58396 -0.3902 0.16715 -0.16714 0.29973 -0.36557 0.39019 -0.58396 0.09046 -0.21838 0.13702 -0.45245 0.13702 -0.68883 0 -0.47739 -0.18964 -0.93523 -0.52721 -1.27279 -0.33756 -0.33757 -0.7954 -0.52721 -1.27279 -0.52721 -0.47739 0 -0.93523 0.18964 -1.27279 0.52721 -0.33757 0.33756 -0.52721 0.7954 -0.52721 1.27279Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.36304 5.7952c0 0.69938 0.27782 1.37011 0.77236 1.86464 0.4945 0.49454 1.1653 0.77236 1.8646 0.77236 0.6994 0 1.3701 -0.27782 1.8647 -0.77236 0.4945 -0.49453 0.7723 -1.16526 0.7723 -1.86464 0 -0.69937 -0.2778 -1.3701 -0.7723 -1.86464 -0.4946 -0.49453 -1.1653 -0.77236 -1.8647 -0.77236 -0.6993 0 -1.3701 0.27783 -1.8646 0.77236 -0.49454 0.49454 -0.77236 1.16527 -0.77236 1.86464Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.615 14.367c0 -1.224 -0.4862 -2.3979 -1.3517 -3.2633 -0.8655 -0.8655 -2.0393 -1.35175 -3.2633 -1.35175 -1.224 0 -2.39781 0.48625 -3.26329 1.35175 -0.86548 0.8654 -1.3517 2.0393 -1.3517 3.2633v1.978h1.978l0.65899 6.593h3.956l0.659 -6.593h1.978v-1.978Z" strokeWidth="1.5"></path></svg></i>
                                    <span className="item-name">সচল তালিকা</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="User Role Management" className={`${location.pathname === '/admin/user-list/inactive' ? 'active' : ''} nav-link`} to="/admin/user-list/inactive">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.01001 5.10203c0 0.57923 0.2301 1.13474 0.63968 1.54432 0.40958 0.40958 0.96509 0.63968 1.54432 0.63968 0.57923 0 1.13474 -0.2301 1.54432 -0.63968 0.40958 -0.40958 0.63968 -0.96509 0.63968 -1.54432 0 -0.57923 -0.2301 -1.13474 -0.63968 -1.54432 -0.40958 -0.40958 -0.96509 -0.63968 -1.54432 -0.63968 -0.57923 0 -1.13474 0.2301 -1.54432 0.63968 -0.40958 0.40958 -0.63968 0.96509 -0.63968 1.54432Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.63801 10.184c-0.22014 -0.51599 -0.55345 -0.97588 -0.97527 -1.34569 -0.42182 -0.3698 -0.92138 -0.64007 -1.46172 -0.7908 -0.54034 -0.15074 -1.10766 -0.17809 -1.65999 -0.08004 -0.55234 0.09805 -1.07558 0.31901 -1.53102 0.64652" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.6219 5.10203c0 0.57923 0.2301 1.13474 0.6397 1.54432 0.4096 0.40958 0.9651 0.63968 1.5443 0.63968 0.5793 0 1.1348 -0.2301 1.5444 -0.63968 0.4095 -0.40958 0.6396 -0.96509 0.6396 -1.54432 0 -0.57923 -0.2301 -1.13474 -0.6396 -1.54432 -0.4096 -0.40958 -0.9651 -0.63968 -1.5444 -0.63968 -0.5792 0 -1.1347 0.2301 -1.5443 0.63968 -0.4096 0.40958 -0.6397 0.96509 -0.6397 1.54432Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.3621 10.184c0.2201 -0.51599 0.5534 -0.97588 0.9752 -1.34569 0.4219 -0.3698 0.9214 -0.64007 1.4617 -0.7908 0.5404 -0.15074 1.1077 -0.17809 1.66 -0.08004 0.5524 0.09805 1.0756 0.31901 1.5311 0.64652" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8.66296 4.087c0 0.43822 0.08632 0.87215 0.25402 1.27701 0.1677 0.40487 0.4135 0.77274 0.72337 1.08261 0.30987 0.30986 0.67775 0.55567 1.08255 0.72337 0.4049 0.1677 0.8388 0.25401 1.2771 0.25401 0.4382 0 0.8721 -0.08631 1.277 -0.25401 0.4048 -0.1677 0.7727 -0.41351 1.0826 -0.72337 0.3098 -0.30987 0.5556 -0.67774 0.7233 -1.08261 0.1677 -0.40486 0.2541 -0.83879 0.2541 -1.27701 0 -0.43822 -0.0864 -0.87215 -0.2541 -1.27701 -0.1677 -0.40487 -0.4135 -0.77274 -0.7233 -1.08261 -0.3099 -0.30986 -0.6778 -0.55567 -1.0826 -0.72337C12.8721 0.836314 12.4382 0.75 12 0.75c-0.4383 0 -0.8722 0.086314 -1.2771 0.25401 -0.4048 0.1677 -0.77268 0.41351 -1.08255 0.72337 -0.30987 0.30987 -0.55567 0.67774 -0.72337 1.08261 -0.1677 0.40486 -0.25402 0.83879 -0.25402 1.27701Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.7731 11.46c-0.7316 -0.8038 -1.623 -1.446 -2.6171 -1.88545 -0.9941 -0.43943 -2.0691 -0.66641 -3.1559 -0.66641 -1.0869 0 -2.16187 0.22698 -3.15598 0.66641 -0.9941 0.43945 -1.88549 1.08165 -2.61707 1.88545" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.9549 13.856c-0.0165 1.0382 -0.4405 2.0283 -1.1805 2.7566 -0.74 0.7283 -1.7367 1.1365 -2.775 1.1365s-2.03494 -0.4082 -2.77494 -1.1365c-0.74001 -0.7283 -1.16401 -1.7184 -1.18051 -2.7566" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21.394 13.852v1.487l-1.7 0.34c-0.1962 0.8242 -0.5248 1.6111 -0.973 2.33l0.969 1.444 -2.1 2.1 -1.443 -0.969c-0.7191 0.4521 -1.5076 0.7829 -2.334 0.979l-0.336 1.691h-2.96l-0.337 -1.691c-0.82609 -0.1963 -1.61427 -0.527 -2.33303 -0.979l-1.447 0.965 -2.1 -2.1 0.969 -1.444c-0.44855 -0.7189 -0.77749 -1.5058 -0.974 -2.33l-1.7 -0.34v-1.483" strokeWidth="1.5"></path></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.01001 5.10203c0 0.57923 0.2301 1.13474 0.63968 1.54432 0.40958 0.40958 0.96509 0.63968 1.54432 0.63968 0.57923 0 1.13474 -0.2301 1.54432 -0.63968 0.40958 -0.40958 0.63968 -0.96509 0.63968 -1.54432 0 -0.57923 -0.2301 -1.13474 -0.63968 -1.54432 -0.40958 -0.40958 -0.96509 -0.63968 -1.54432 -0.63968 -0.57923 0 -1.13474 0.2301 -1.54432 0.63968 -0.40958 0.40958 -0.63968 0.96509 -0.63968 1.54432Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M7.63801 10.184c-0.22014 -0.51599 -0.55345 -0.97588 -0.97527 -1.34569 -0.42182 -0.3698 -0.92138 -0.64007 -1.46172 -0.7908 -0.54034 -0.15074 -1.10766 -0.17809 -1.65999 -0.08004 -0.55234 0.09805 -1.07558 0.31901 -1.53102 0.64652" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.6219 5.10203c0 0.57923 0.2301 1.13474 0.6397 1.54432 0.4096 0.40958 0.9651 0.63968 1.5443 0.63968 0.5793 0 1.1348 -0.2301 1.5444 -0.63968 0.4095 -0.40958 0.6396 -0.96509 0.6396 -1.54432 0 -0.57923 -0.2301 -1.13474 -0.6396 -1.54432 -0.4096 -0.40958 -0.9651 -0.63968 -1.5444 -0.63968 -0.5792 0 -1.1347 0.2301 -1.5443 0.63968 -0.4096 0.40958 -0.6397 0.96509 -0.6397 1.54432Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.3621 10.184c0.2201 -0.51599 0.5534 -0.97588 0.9752 -1.34569 0.4219 -0.3698 0.9214 -0.64007 1.4617 -0.7908 0.5404 -0.15074 1.1077 -0.17809 1.66 -0.08004 0.5524 0.09805 1.0756 0.31901 1.5311 0.64652" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8.66296 4.087c0 0.43822 0.08632 0.87215 0.25402 1.27701 0.1677 0.40487 0.4135 0.77274 0.72337 1.08261 0.30987 0.30986 0.67775 0.55567 1.08255 0.72337 0.4049 0.1677 0.8388 0.25401 1.2771 0.25401 0.4382 0 0.8721 -0.08631 1.277 -0.25401 0.4048 -0.1677 0.7727 -0.41351 1.0826 -0.72337 0.3098 -0.30987 0.5556 -0.67774 0.7233 -1.08261 0.1677 -0.40486 0.2541 -0.83879 0.2541 -1.27701 0 -0.43822 -0.0864 -0.87215 -0.2541 -1.27701 -0.1677 -0.40487 -0.4135 -0.77274 -0.7233 -1.08261 -0.3099 -0.30986 -0.6778 -0.55567 -1.0826 -0.72337C12.8721 0.836314 12.4382 0.75 12 0.75c-0.4383 0 -0.8722 0.086314 -1.2771 0.25401 -0.4048 0.1677 -0.77268 0.41351 -1.08255 0.72337 -0.30987 0.30987 -0.55567 0.67774 -0.72337 1.08261 -0.1677 0.40486 -0.25402 0.83879 -0.25402 1.27701Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.7731 11.46c-0.7316 -0.8038 -1.623 -1.446 -2.6171 -1.88545 -0.9941 -0.43943 -2.0691 -0.66641 -3.1559 -0.66641 -1.0869 0 -2.16187 0.22698 -3.15598 0.66641 -0.9941 0.43945 -1.88549 1.08165 -2.61707 1.88545" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.9549 13.856c-0.0165 1.0382 -0.4405 2.0283 -1.1805 2.7566 -0.74 0.7283 -1.7367 1.1365 -2.775 1.1365s-2.03494 -0.4082 -2.77494 -1.1365c-0.74001 -0.7283 -1.16401 -1.7184 -1.18051 -2.7566" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21.394 13.852v1.487l-1.7 0.34c-0.1962 0.8242 -0.5248 1.6111 -0.973 2.33l0.969 1.444 -2.1 2.1 -1.443 -0.969c-0.7191 0.4521 -1.5076 0.7829 -2.334 0.979l-0.336 1.691h-2.96l-0.337 -1.691c-0.82609 -0.1963 -1.61427 -0.527 -2.33303 -0.979l-1.447 0.965 -2.1 -2.1 0.969 -1.444c-0.44855 -0.7189 -0.77749 -1.5058 -0.974 -2.33l-1.7 -0.34v-1.483" strokeWidth="1.5"></path></svg></i>
                                    <span className="item-name">আর্কাইভ তালিকা</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title='Reset Password' className={`${location.pathname === '/auth/reset-password' ? 'active' : ''} nav-link`} to="/auth/reset-password">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-key-icon lucide-rotate-ccw-key"><path d="m14.5 9.5 1 1" /><path d="m15.5 8.5-4 4" /><path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><circle cx="10" cy="14" r="2" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-rotate-ccw-key-icon lucide-rotate-ccw-key"><path d="m14.5 9.5 1 1" /><path d="m15.5 8.5-4 4" /><path d="M3 12a9 9 0 1 0 9-9 9.74 9.74 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><circle cx="10" cy="14" r="2" /></svg></i>
                                    <span className="item-name">পাসওয়ার্ড রিসেট</span>
                                </Link>
                            </li>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>}

                {/* Entry Section */}

                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "13" || permissionData.role === "14" || permissionData.role === "15"))) && <>
                    <li><hr className="hr-horizontal" /></li>
                    <li className="nav-item static-item">
                        <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                            <span className="default-icon">নোটিশ, তারিখ ও ফিস</span>
                            <span className="mini-icon">-</span>
                        </Link>
                    </li>

                    <Accordion.Item as="li" eventKey="notice-menu" bsPrefix={`nav-item ${active === 'notice-menu' ? 'active' : ''} `} onClick={() => setActive('notice-menu')}  >
                        <CustomToggle eventKey="notice-menu" active={activeMenu === 'notice-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Notice Entry Menu" className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                            </i>
                            <span className="item-name">নোটিশ এন্ট্রি</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="notice-menu" >
                            <ul className="sub-nav">
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "13" || permissionData.role === "14"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/notice/new' ? 'active' : ''} nav-link`} to="/entry/notice/new">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-plus2-icon lucide-calendar-plus-2"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 16h4" /><path d="M12 14v4" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-plus2-icon lucide-calendar-plus-2"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 16h4" /><path d="M12 14v4" /></svg></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "14" || permissionData.role === "15"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/notice/auth' ? 'active' : ''} nav-link`} to="/entry/notice/auth">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>

                    <Accordion.Item as="li" eventKey="date-menu" bsPrefix={`nav-item ${active === 'date-menu' ? 'active' : ''} `} onClick={() => setActive('date-menu')}  >
                        <CustomToggle eventKey="date-menu" active={activeMenu === 'date-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Date Entry Menu" className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days-icon lucide-calendar-days"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" /></svg>
                            </i>
                            <span className="item-name">তারিখ এন্ট্রি</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="date-menu" >
                            <ul className="sub-nav">
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "13" || permissionData.role === "14"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/date/new' ? 'active' : ''} nav-link`} to="/entry/date/new">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-plus2-icon lucide-calendar-plus-2"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 16h4" /><path d="M12 14v4" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-plus2-icon lucide-calendar-plus-2"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M10 16h4" /><path d="M12 14v4" /></svg></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "14" || permissionData.role === "15"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/date/auth' ? 'active' : ''} nav-link`} to="/entry/date/auth">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-check-icon lucide-calendar-check"><path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="m9 16 2 2 4-4" /></svg></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>

                    <Accordion.Item as="li" eventKey="fee-menu" bsPrefix={`nav-item ${active === 'fee-menu' ? 'active' : ''} `} onClick={() => setActive('fee-menu')}  >
                        <CustomToggle eventKey="fee-menu" active={activeMenu === 'fee-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Fee Entry Menu" className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                            </i>
                            <span className="item-name">ফি এন্ট্রি</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="fee-menu" >
                            <ul className="sub-nav">
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "13" || permissionData.role === "14"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/fee/new' ? 'active' : ''} nav-link`} to="/entry/fee/new">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-plus-icon lucide-ticket-plus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M9 12h6" /><path d="M12 9v6" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-plus-icon lucide-ticket-plus"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M9 12h6" /><path d="M12 9v6" /></svg></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {(permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && (permissionData.role === "14" || permissionData.role === "15"))) && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/fee/auth' ? 'active' : ''} nav-link`} to="/entry/fee/auth">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-check-icon lucide-ticket-check"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="m9 12 2 2 4-4" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-ticket-check-icon lucide-ticket-check"><path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="m9 12 2 2 4-4" /></svg></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>
                </>}

                <li><hr className="hr-horizontal" /></li>
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">শিক্ষার্থীর আবেদন</span>
                        <span className="mini-icon">-</span>
                    </Link>
                </li>

                <Accordion.Item as="li" eventKey="registration-menu" bsPrefix={`nav-item ${active === 'registration-menu' ? 'active' : ''} `} onClick={() => setActive('registration-menu')}  >
                    <CustomToggle eventKey="registration-menu" active={activeMenu === 'registration-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Registration Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6.74432 6.01065V1.74823c0 -0.26475 0.10517 -0.51865 0.29238 -0.70586C7.2239 0.85517 7.4778 0.75 7.74255 0.75h9.69275l5.8097 5.85958V22.2518c0 0.2647 -0.1052 0.5186 -0.2924 0.7058 -0.1872 0.1872 -0.4411 0.2924 -0.7058 0.2924h-6.5184" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M17.2257 0.77002v4.99113c0 0.26474 0.1052 0.51864 0.2924 0.70585 0.1872 0.1872 0.4411 0.29237 0.7058 0.29237h4.9912" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M19.7712 10.5029h-7.0375" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M19.7712 18.4883h-2.7951" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M19.7712 14.4956H14.231" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M0.755005 20.2354 1.50367 23.23H11.985l0.7487 -2.9946" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.73903 17.2407H8.24169v-2.6653c0.57091 -0.3296 1.01711 -0.8384 1.26939 -1.4474 0.25227 -0.6091 0.29653 -1.2843 0.12591 -1.9211 -0.17062 -0.6368 -0.54659 -1.1994 -1.06959 -1.60076 -0.523 -0.40131 -1.16381 -0.61884 -1.82304 -0.61884s-1.30004 0.21753 -1.82305 0.61884c-0.523 0.40136 -0.89897 0.96396 -1.06959 1.60076 -0.17062 0.6368 -0.12636 1.312 0.12592 1.9211 0.25227 0.609 0.69847 1.1178 1.26938 1.4474v2.6653H3.74968c-0.79424 0 -1.55594 0.3155 -2.11755 0.8771 -0.56162 0.5616 -0.877125 1.3233 -0.877125 2.1176H12.7337c0 -0.7943 -0.3155 -1.556 -0.8771 -2.1176 -0.5616 -0.5616 -1.3233 -0.8771 -2.11757 -0.8771Z" strokeWidth="1.5"></path></svg>
                        </i>
                        <span className="item-name">রেজিস্ট্রেশন</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="registration-menu" >
                        <ul className="sub-nav">
                            {(permissionData.type === "13" || permissionData.role === "17" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="New Registration" className={`${location.pathname === '/registration/new-app' ? 'active' : ''} nav-link`} to="/registration/new-app">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                        <span className="item-name"> নতুন এন্ট্রি </span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title='Cancel Registration' className={`${location.pathname === '/registration/cancel-app' ? 'active' : ''} nav-link`} to="/registration/cancel-app">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg></i>
                                        <span className="item-name">রেজিস্ট্রেশন বাতিল</span>
                                    </Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link title="Temporary Registration List" className={`${location.pathname === '/registration/temp-list' ? 'active' : ''} nav-link`} to="/registration/temp-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Registration Payment" className={`${location.pathname === '/registration/payment' ? 'active' : ''} nav-link`} to="/registration/payment">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></i>
                                        <span className="item-name">পেমেন্ট করুন</span>
                                    </Link>
                                </li>
                            </>}
                            {(permissionData.type === "13" || permissionData.role === "17" || ((permissionData.office === "01" || permissionData.office === "02" || permissionData.office === "03") && (permissionData.role === "15" || permissionData.role === "16")) || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Final Registration List" className={`${location.pathname === '/registration/final-list' ? 'active' : ''} nav-link`} to="/registration/final-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg></i>
                                        <span className="item-name">চুড়ান্ত তালিকা</span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title="Archive Registration List" className={`${location.pathname === '/registration/archive-list' ? 'active' : ''} nav-link`} to="/registration/archive-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg></i>
                                        <span className="item-name">আর্কাইভ তালিকা</span>
                                    </Link>
                                </li> */}
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>
                <Accordion.Item as="li" eventKey="form-fillup-menu" bsPrefix={`nav-item ${active === 'form-fillup-menu' ? 'active' : ''} `} onClick={() => setActive('form-fillup-menu')}  >
                    <CustomToggle eventKey="form-fillup-menu" active={activeMenu === 'form-fillup-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Form Fillup Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 2.24902h-3c-0.39782 0 -0.77936 0.15804 -1.06066 0.43934C0.908035 2.96967 0.75 3.3512 0.75 3.74902V21.749c0 0.3978 0.158035 0.7794 0.43934 1.0607 0.2813 0.2813 0.66284 0.4393 1.06066 0.4393h19.5c0.3978 0 0.7794 -0.158 1.0607 -0.4393s0.4393 -0.6629 0.4393 -1.0607V3.74902c0 -0.39782 -0.158 -0.77935 -0.4393 -1.06066 -0.2813 -0.2813 -0.6629 -0.43934 -1.0607 -0.43934h-10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.249 -3 -2.24898 -3 2.24998V1.50002c-0.00013 -0.09857 0.01917 -0.19621 0.0568 -0.28732 0.03764 -0.09111 0.09286 -0.1739 0.16252 -0.243653 0.06965 -0.06975 0.15238 -0.125084 0.24344 -0.162838C5.80382 0.768456 5.90143 0.749023 6 0.749023h4.5c0.1989 0 0.3897 0.079018 0.5303 0.21967 0.1407 0.140657 0.2197 0.331417 0.2197 0.530327V11.249Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 18.749h10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.249h13.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.75 9.74902h-4.5" strokeWidth="1.5"></path></svg>
                        </i>
                        <span className="item-name">ফর্ম পূরণ</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="form-fillup-menu" >
                        <ul className="sub-nav">
                            {(permissionData.type === "13" || permissionData.role === "17" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="New Form Fillup" className={`${location.pathname === '/form-fillup/new-app' ? 'active' : ''} nav-link`} to="/form-fillup/new-app">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                        <span className="item-name"> নতুন আবেদন </span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title="Cancel Form Fillup" className={`${location.pathname === '/form-fillup/cancel-app' ? 'active' : ''} nav-link`} to="/form-fillup/cancel-app">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-x"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="17" x2="22" y1="8" y2="13" /><line x1="22" x2="17" y1="8" y2="13" /></svg></i>
                                        <span className="item-name">ফর্ম ফিলাপ বাতিল</span>
                                    </Link>
                                </li> */}
                                <li className="nav-item">
                                    <Link title="Temporary Form Fillup List" className={`${location.pathname === '/form-fillup/temp-list' ? 'active' : ''} nav-link`} to="/form-fillup/temp-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Form Fillup Payment" className={`${location.pathname === '/form-fillup/payment' ? 'active' : ''} nav-link`} to="/form-fillup/payment">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></i>
                                        <span className="item-name">পেমেন্ট করুন</span>
                                    </Link>
                                </li>
                            </>}
                            {(permissionData.type === "13" || permissionData.role === "17" || ((permissionData.office === "01" || permissionData.office === "02" || permissionData.office === "03") && (permissionData.role === "15" || permissionData.role === "16")) || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Final Form Fillup List" className={`${location.pathname === '/form-fillup/final-list' ? 'active' : ''} nav-link`} to="/form-fillup/final-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg></i>
                                        <span className="item-name">চুড়ান্ত তালিকা</span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title="Archive Form Fillup List" className={`${location.pathname === '/form-fillup/archive-list' ? 'active' : ''} nav-link`} to="/form-fillup/archive-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg></i>
                                        <span className="item-name"> আর্কাইভ তালিকা </span>
                                    </Link>
                                </li> */}
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>
                <Accordion.Item as="li" eventKey="tc-menu" bsPrefix={`nav-item ${active === 'tc-menu' ? 'active' : ''} `} onClick={() => setActive('tc-menu')}  >
                    <CustomToggle eventKey="tc-menu" active={activeMenu === 'tc-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="TC Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M11.1013 1.48779H4.8291c-0.55228 0 -1 0.44771 -1 1v6.61374" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M12.8987 22.5122h6.2722c0.5523 0 1 -0.4477 1 -1v-6.6138" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m1.22949 6.5 2.6008 2.6008L6.43109 6.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m22.7705 17.5002 -2.6008 -2.6008 -2.6008 2.6008" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M5.50474 18.5461c1.40908 0 2.55137 -1.1423 2.55137 -2.5514s-1.14229 -2.5513 -2.55137 -2.5513c-1.40908 0 -2.55137 1.1422 -2.55137 2.5513 0 1.4091 1.14229 2.5514 2.55137 2.5514Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M9.78157 22.5111c-0.55862 -1.8303 -2.28869 -3.2025 -4.27604 -3.2025 -1.98735 0 -3.71742 1.3722 -4.27604 3.2025" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M18.493 6.59102c1.4091 0 2.5514 -1.14228 2.5514 -2.55137 0 -1.40908 -1.1423 -2.55137 -2.5514 -2.55137s-2.5513 1.14229 -2.5513 2.55137c0 1.40909 1.1422 2.55137 2.5513 2.55137Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" d="M22.7698 10.556c-0.5586 -1.83027 -2.2886 -3.20248 -4.276 -3.20248 -1.9873 0 -3.7174 1.37221 -4.276 3.20248" strokeWidth="1.5"></path></svg>
                        </i>
                        <span className="item-name">ছাড়পত্র (TC)</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="tc-menu" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="New TC Application" className={`${location.pathname === '/tc/new-app' ? 'active' : ''} nav-link`} to="/tc/new-app">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                    <span className="item-name"> নতুন আবেদন </span>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link title="TC Cancel" className={`${location.pathname === 'tc/cancel-app' ? 'active' : ''} nav-link`} to="tc/cancel-app">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" /></svg></i>
                                    <span className="item-name">ছাড়পত্র (TC) বাতিল</span>
                                </Link>
                            </li> */}
                            {(permissionData.type === "13" || permissionData.role === "17" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Pending TC" className={`${location.pathname === '/tc/pending-list' ? 'active' : ''} nav-link`} to="/tc/pending-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg> </i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Authorized TC" className={`${location.pathname === '/tc/authorized-list' ? 'active' : ''} nav-link`} to="/tc/authorized-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg> </i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected TC" className={`${location.pathname === '/tc/rejected-list' ? 'active' : ''} nav-link`} to="/tc/rejected-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg> </i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title="Archive TC" className={`${location.pathname === '/tc/archive-list' ? 'active' : ''} nav-link`} to="/tc/archive-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive"><rect width="20" height="5" x="2" y="3" rx="1" /><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" /><path d="M10 12h4" /></svg> </i>
                                        <span className="item-name"> আর্কাইভ তালিকা </span>
                                    </Link>
                                </li> */}
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">প্রতিষ্ঠানের আবেদন</span>
                        <span className="mini-icon">-</span>
                    </Link>
                </li>
                <Accordion.Item as="li" eventKey="establishment-menu" bsPrefix={`nav-item ${active === 'establishment-menu' ? 'active' : ''} `} onClick={() => setActive('establishment-menu')}  >
                    <CustomToggle eventKey="establishment-menu" active={activeMenu === 'establishment-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Establishment Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school-icon lucide-school"><path d="M14 21v-3a2 2 0 0 0-4 0v3" /><path d="M18 5v16" /><path d="m4 6 7.106-3.79a2 2 0 0 1 1.788 0L20 6" /><path d="m6 11-3.52 2.147a1 1 0 0 0-.48.854V19a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5a1 1 0 0 0-.48-.853L18 11" /><path d="M6 5v16" /><circle cx="12" cy="9" r="2" /></svg>
                        </i>
                        <span className="item-name">প্রতিষ্ঠান স্থাপন</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="establishment-menu" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="New Application" className={`${location.pathname === '/institute/establishment/application' ? 'active' : ''} nav-link`} to="/institute/establishment/application">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                    <span className="item-name">নতুন আবেদন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Establishment Payment/Status Check" className={`${location.pathname === '/institute/establishment/payment' ? 'active' : ''} nav-link`} to="/institute/establishment/payment">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></i>
                                    <span className="item-name">আবেদনের অবস্থা</span>
                                </Link>
                            </li>
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Establishment Pending List" className={`${location.pathname === '/establishment/pending-list' ? 'active' : ''} nav-link`} to="/establishment/pending-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Establishment Processing List" className={`${location.pathname === '/establishment/process-list' ? 'active' : ''} nav-link`} to="/establishment/process-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Establishment Inquiry List" className={`${location.pathname === '/establishment/inquiry-list' ? 'active' : ''} nav-link`} to="/establishment/inquiry-list">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Establishment Order Generation List" className={`${location.pathname === '/establishment/generate-order' ? 'active' : ''} nav-link`} to="/establishment/generate-order">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Establishment List" className={`${location.pathname === '/establishment/authorized-list' ? 'active' : ''} nav-link`} to="/establishment/authorized-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Establishment List" className={`${location.pathname === '/establishment/rejected-list' ? 'active' : ''} nav-link`} to="/establishment/rejected-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                <Accordion.Item as="li" eventKey="class-start-menu" bsPrefix={`nav-item ${active === 'class-start-menu' ? 'active' : ''} `} onClick={() => setActive('class-start-menu')} >
                    <CustomToggle eventKey="class-start-menu" active={activeMenu === 'class-start-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Class Start Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open-check-icon lucide-book-open-check"><path d="M12 21V7" /><path d="m16 12 2 2 4-4" /><path d="M22 6V4a1 1 0 0 0-1-1h-5a4 4 0 0 0-4 4 4 4 0 0 0-4-4H3a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h6a3 3 0 0 1 3 3 3 3 0 0 1 3-3h6a1 1 0 0 0 1-1v-1.3" /></svg>
                        </i>
                        <span className="item-name">প্রতিষ্ঠানের পাঠদান</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="class-start-menu" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="New Application" className={`${location.pathname === '/institute/class-start/application' ? 'active' : ''} nav-link`} to="/institute/class-start/application">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                    <span className="item-name">নতুন আবেদন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Class Start Payment/Status Check" className={`${location.pathname === '/institute/class-start/payment' ? 'active' : ''} nav-link`} to="/institute/class-start/payment">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></i>
                                    <span className="item-name">আবেদনের অবস্থা</span>
                                </Link>
                            </li>
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Class Start Pending List" className={`${location.pathname === '/class-start/pending-list' ? 'active' : ''} nav-link`} to="/class-start/pending-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Class Start Processing List" className={`${location.pathname === '/class-start/process-list' ? 'active' : ''} nav-link`} to="/class-start/process-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Class Start Inquiry List" className={`${location.pathname === '/class-start/inquiry-list' ? 'active' : ''} nav-link`} to="/class-start/inquiry-list">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Class Start Order Generation List" className={`${location.pathname === '/class-start/generate-order' ? 'active' : ''} nav-link`} to="/class-start/generate-order">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Class Start List" className={`${location.pathname === '/class-start/authorized-list' ? 'active' : ''} nav-link`} to="/class-start/authorized-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Class Start List" className={`${location.pathname === '/class-start/rejected-list' ? 'active' : ''} nav-link`} to="/class-start/rejected-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                <Accordion.Item as="li" eventKey="recognition-menu" bsPrefix={`nav-item ${active === 'recognition-menu' ? 'active' : ''} `} onClick={() => setActive('recognition-menu')} >
                    <CustomToggle eventKey="recognition-menu" active={activeMenu === 'recognition-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Recognition Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-bell-electric-icon lucide-bell-electric"><path d="M18.518 17.347A7 7 0 0 1 14 19" /><path d="M18.8 4A11 11 0 0 1 20 9" /><path d="M9 9h.01" /><circle cx="20" cy="16" r="2" /><circle cx="9" cy="9" r="7" /><rect x="4" y="16" width="10" height="6" rx="2" /></svg>
                        </i>
                        <span className="item-name">একাডেমিক স্বীকৃতি</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="recognition-menu">
                        <ul className="sub-nav">
                            {(permissionData.role === "17" || permissionData.type === "13") && <>
                                <li className="nav-item">
                                    <Link title="New Application" className={`${location.pathname === '/institute/recognition/application' ? 'active' : ''} nav-link`} to="/institute/recognition/application">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" x2="19" y1="8" y2="14" /><line x1="22" x2="16" y1="11" y2="11" /></svg></i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Recognition Status Check" className={`${location.pathname === '/institute/recognition/all-list' ? 'active' : ''} nav-link`} to="/institute/recognition/all-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg></i>
                                        <span className="item-name">আবেদনের তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Recognition Pending List" className={`${location.pathname === '/recognition/pending-list' ? 'active' : ''} nav-link`} to="/recognition/pending-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-restart"><path d="M21 6H3" /><path d="M7 12H3" /><path d="M7 18H3" /><path d="M12 18a5 5 0 0 0 9-3 4.5 4.5 0 0 0-4.5-4.5c-1.33 0-2.54.54-3.41 1.41L11 14" /><path d="M11 10v4h4" /></svg></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Recognition Processing List" className={`${location.pathname === '/recognition/process-list' ? 'active' : ''} nav-link`} to="/recognition/process-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-loader-pinwheel-icon lucide-loader-pinwheel"><path d="M22 12a1 1 0 0 1-10 0 1 1 0 0 0-10 0" /><path d="M7 20.7a1 1 0 1 1 5-8.7 1 1 0 1 0 5-8.6" /><path d="M7 3.3a1 1 0 1 1 5 8.6 1 1 0 1 0 5 8.6" /><circle cx="12" cy="12" r="10" /></svg></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Recognition Inquiry List" className={`${location.pathname === '/recognition/inquiry-list' ? 'active' : ''} nav-link`} to="/recognition/inquiry-list">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-microscope-icon lucide-microscope"><path d="M6 18h8" /><path d="M3 22h18" /><path d="M14 22a7 7 0 1 0 0-14h-1" /><path d="M9 14h2" /><path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" /><path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" /></svg></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Recognition Order Generation List" className={`${location.pathname === '/recognition/generate-order' ? 'active' : ''} nav-link`} to="/recognition/generate-order">
                                            <i className="icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg>
                                            </i>
                                            <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send-icon lucide-send"><path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z" /><path d="m21.854 2.147-10.94 10.939" /></svg></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Recognition List" className={`${location.pathname === '/recognition/authorized-list' ? 'active' : ''} nav-link`} to="/recognition/authorized-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-checks"><path d="m3 17 2 2 4-4" /><path d="m3 7 2 2 4-4" /><path d="M13 6h8" /><path d="M13 12h8" /><path d="M13 18h8" /></svg></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Recognition List" className={`${location.pathname === '/recognition/rejected-list' ? 'active' : ''} nav-link`} to="/recognition/rejected-list">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-x-icon lucide-list-x"><path d="M11 12H3" /><path d="M16 6H3" /><path d="M16 18H3" /><path d="m19 10-4 4" /><path d="m15 10 4 4" /></svg></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                {(permissionData.office === "06" || permissionData.role === "17") && <>
                    <li><hr className="hr-horizontal" /></li><li className="nav-item static-item">
                        <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                            <span className="default-icon">আর্থিক হিসাব</span>
                            <span className="mini-icon">-</span>
                        </Link>
                    </li>
                    <Accordion.Item as="li" eventKey="accounts-menu" bsPrefix={`nav-item ${active === 'accounts-menu' ? 'active' : ''} `} onClick={() => setActive('accounts-menu')}  >
                        <CustomToggle eventKey="accounts-menu" active={activeMenu === 'accounts-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Accounts Menu" className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-badge-cent"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" /><path d="M12 7v10" /><path d="M15.4 10a4 4 0 1 0 0 4" /></svg>
                            </i>
                            <span className="item-name">রিপোর্ট</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="accounts-menu" >
                            <ul className="sub-nav">
                                <li className="nav-item">
                                    <Link title="Registration Card" className={`${location.pathname === '/accounts/report/summery' ? 'active' : ''} nav-link`} to="/accounts/report/summery">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-tree"><path d="M21 12h-8" /><path d="M21 6H8" /><path d="M21 18h-8" /><path d="M3 6v4c0 1.1.9 2 2 2h3" /><path d="M3 10v6c0 1.1.9 2 2 2h3" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-list-tree"><path d="M21 12h-8" /><path d="M21 6H8" /><path d="M21 18h-8" /><path d="M3 6v4c0 1.1.9 2 2 2h3" /><path d="M3 10v6c0 1.1.9 2 2 2h3" /></svg> </i>
                                        <span className="item-name"> সামারি রিপোর্ট </span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Admit Card" className={`${location.pathname === '/accounts/report/details' ? 'active' : ''} nav-link`} to="/accounts/report/details">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text"><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text"><path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" /></svg> </i>
                                        <span className="item-name"> বিস্তারিত রিপোর্ট </span>
                                    </Link>
                                </li>
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>
                </>}

                {(permissionData.type === "13" || permissionData.role === "17" || permissionData.office === "05" || permissionData.office === "05") && <>
                    <li><hr className="hr-horizontal" /></li>
                    <li className="nav-item static-item">
                        <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                            <span className="default-icon">প্রিন্ট ডকুমেন্ট</span>
                            <span className="mini-icon">-</span>
                        </Link>
                    </li>
                    <Accordion.Item as="li" eventKey="print-menu" bsPrefix={`nav-item ${active === 'print-menu' ? 'active' : ''} `} onClick={() => setActive('print-menu')}  >
                        <CustomToggle eventKey="print-menu" active={activeMenu === 'print-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Print Menu" className="icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 17.249h-3c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C0.908035 16.5284 0.75 16.1468 0.75 15.749V8.24902c0 -0.39782 0.158035 -0.77935 0.43934 -1.06066 0.2813 -0.2813 0.66284 -0.43934 1.06066 -0.43934h19.5c0.3978 0 0.7794 0.15804 1.0607 0.43934 0.2813 0.28131 0.4393 0.66284 0.4393 1.06066V15.749c0 0.3978 -0.158 0.7794 -0.4393 1.0607s-0.6629 0.4393 -1.0607 0.4393h-3" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.74902h1.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 12.749h13.5v10.5H5.25v-10.5Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.75 6.74902H5.25v-4.5c0 -0.39782 0.15804 -0.77935 0.43934 -1.06066C5.97064 0.907059 6.35218 0.749023 6.75 0.749023h10.5c0.3978 0 0.7794 0.158036 1.0607 0.439337 0.2813 0.28131 0.4393 0.66284 0.4393 1.06066v4.5Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8.25 15.749h7.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.749h5.25" strokeWidth="1.5"></path></svg>
                            </i>
                            <span className="item-name">প্রিন্ট</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="print-menu" >
                            <ul className="sub-nav">
                                <li className="nav-item">
                                    <Link title="Registration Card" className={`${location.pathname === '/print/registration-card' ? 'active' : ''} nav-link`} to="/print/registration-card">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 2.24902h-3c-0.39782 0 -0.77936 0.15804 -1.06066 0.43934C0.908035 2.96967 0.75 3.3512 0.75 3.74902V21.749c0 0.3978 0.158035 0.7794 0.43934 1.0607 0.2813 0.2813 0.66284 0.4393 1.06066 0.4393h19.5c0.3978 0 0.7794 -0.158 1.0607 -0.4393s0.4393 -0.6629 0.4393 -1.0607V3.74902c0 -0.39782 -0.158 -0.77935 -0.4393 -1.06066 -0.2813 -0.2813 -0.6629 -0.43934 -1.0607 -0.43934h-10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.249 -3 -2.24898 -3 2.24998V1.50002c-0.00013 -0.09857 0.01917 -0.19621 0.0568 -0.28732 0.03764 -0.09111 0.09286 -0.1739 0.16252 -0.243653 0.06965 -0.06975 0.15238 -0.125084 0.24344 -0.162838C5.80382 0.768456 5.90143 0.749023 6 0.749023h4.5c0.1989 0 0.3897 0.079018 0.5303 0.21967 0.1407 0.140657 0.2197 0.331417 0.2197 0.530327V11.249Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 18.749h10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.249h13.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.75 9.74902h-4.5" strokeWidth="1.5"></path></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 2.24902h-3c-0.39782 0 -0.77936 0.15804 -1.06066 0.43934C0.908035 2.96967 0.75 3.3512 0.75 3.74902V21.749c0 0.3978 0.158035 0.7794 0.43934 1.0607 0.2813 0.2813 0.66284 0.4393 1.06066 0.4393h19.5c0.3978 0 0.7794 -0.158 1.0607 -0.4393s0.4393 -0.6629 0.4393 -1.0607V3.74902c0 -0.39782 -0.158 -0.77935 -0.4393 -1.06066 -0.2813 -0.2813 -0.6629 -0.43934 -1.0607 -0.43934h-10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.249 -3 -2.24898 -3 2.24998V1.50002c-0.00013 -0.09857 0.01917 -0.19621 0.0568 -0.28732 0.03764 -0.09111 0.09286 -0.1739 0.16252 -0.243653 0.06965 -0.06975 0.15238 -0.125084 0.24344 -0.162838C5.80382 0.768456 5.90143 0.749023 6 0.749023h4.5c0.1989 0 0.3897 0.079018 0.5303 0.21967 0.1407 0.140657 0.2197 0.331417 0.2197 0.530327V11.249Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 18.749h10.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.249h13.5" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M18.75 9.74902h-4.5" strokeWidth="1.5"></path></svg> </i>
                                        <span className="item-name">রেজিস্ট্রেশন কার্ড</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Admit Card" className={`${location.pathname === '/print/admit-card' ? 'active' : ''} nav-link`} to="/print/admit-card">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18s2 0 2 2v10.5s0 2 -2 2H3s-2 0 -2 -2V6.75s0 -2 2 -2Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.56396 7.75h5v5h-5v-5Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.56396 15.75h4.436" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 8.25h4.238" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 15.75h4.238" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.291 12h5.947" strokeWidth="1.5"></path></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3 4.75h18s2 0 2 2v10.5s0 2 -2 2H3s-2 0 -2 -2V6.75s0 -2 2 -2Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.56396 7.75h5v5h-5v-5Z" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M4.56396 15.75h4.436" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 8.25h4.238" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15 15.75h4.238" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.291 12h5.947" strokeWidth="1.5"></path></svg> </i>
                                        <span className="item-name">প্রবেশপত্র</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Transfer Order" className={`${location.pathname === '/print/tc-order' ? 'active' : ''} nav-link`} to="/print/tc-order">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m7.69501 12.606 7.70499 0.501 4.496 -6.27704" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m15.75 18.75 6.642 -3.144c0.1783 -0.0843 0.3383 -0.2029 0.4708 -0.3491 0.1324 -0.1462 0.2347 -0.317 0.301 -0.5028 0.0664 -0.1858 0.0954 -0.3828 0.0855 -0.5798 -0.01 -0.197 -0.0587 -0.3901 -0.1433 -0.5683L19.9 6.83c-0.0843 -0.17835 -0.2029 -0.33833 -0.3491 -0.47077 -0.1462 -0.13245 -0.317 -0.23476 -0.5028 -0.30108 -0.1858 -0.06632 -0.3828 -0.09535 -0.5798 -0.08542 -0.197 0.00992 -0.3901 0.05861 -0.5683 0.14327l-9.49001 4.492c-0.17835 0.0843 -0.33833 0.2029 -0.47078 0.3491 -0.13244 0.1462 -0.23475 0.317 -0.30107 0.5028 -0.06633 0.1858 -0.09535 0.3828 -0.08543 0.5798 0.00993 0.197 0.05862 0.3901 0.14328 0.5683L10.6 18.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25c0 0.79565 0.31607 1.55871 0.87868 2.12132C3.69129 4.93393 4.45435 5.25 5.25 5.25h9c0.7956 0 1.5587 -0.31607 2.1213 -0.87868 0.5626 -0.56261 0.8787 -1.32567 0.8787 -2.12132" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75V2.25c0 -0.39782 0.15804 -0.77936 0.43934 -1.06066C2.97064 0.908035 3.35218 0.75 3.75 0.75h12c0.3978 0 0.7794 0.158035 1.0607 0.43934 0.2813 0.2813 0.4393 0.66284 0.4393 1.06066v4.173" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.75 5.25v4.723" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21.75 23.25H2.25c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C0.908035 22.5294 0.75 22.1478 0.75 21.75v-3h22.5v3c0 0.3978 -0.158 0.7794 -0.4393 1.0607s-0.6629 0.4393 -1.0607 0.4393Z" strokeWidth="1.5"></path></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m7.69501 12.606 7.70499 0.501 4.496 -6.27704" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m15.75 18.75 6.642 -3.144c0.1783 -0.0843 0.3383 -0.2029 0.4708 -0.3491 0.1324 -0.1462 0.2347 -0.317 0.301 -0.5028 0.0664 -0.1858 0.0954 -0.3828 0.0855 -0.5798 -0.01 -0.197 -0.0587 -0.3901 -0.1433 -0.5683L19.9 6.83c-0.0843 -0.17835 -0.2029 -0.33833 -0.3491 -0.47077 -0.1462 -0.13245 -0.317 -0.23476 -0.5028 -0.30108 -0.1858 -0.06632 -0.3828 -0.09535 -0.5798 -0.08542 -0.197 0.00992 -0.3901 0.05861 -0.5683 0.14327l-9.49001 4.492c-0.17835 0.0843 -0.33833 0.2029 -0.47078 0.3491 -0.13244 0.1462 -0.23475 0.317 -0.30107 0.5028 -0.06633 0.1858 -0.09535 0.3828 -0.08543 0.5798 0.00993 0.197 0.05862 0.3901 0.14328 0.5683L10.6 18.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.25 2.25c0 0.79565 0.31607 1.55871 0.87868 2.12132C3.69129 4.93393 4.45435 5.25 5.25 5.25h9c0.7956 0 1.5587 -0.31607 2.1213 -0.87868 0.5626 -0.56261 0.8787 -1.32567 0.8787 -2.12132" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75V2.25c0 -0.39782 0.15804 -0.77936 0.43934 -1.06066C2.97064 0.908035 3.35218 0.75 3.75 0.75h12c0.3978 0 0.7794 0.158035 1.0607 0.43934 0.2813 0.2813 0.4393 0.66284 0.4393 1.06066v4.173" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M9.75 5.25v4.723" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M21.75 23.25H2.25c-0.39782 0 -0.77936 -0.158 -1.06066 -0.4393C0.908035 22.5294 0.75 22.1478 0.75 21.75v-3h22.5v3c0 0.3978 -0.158 0.7794 -0.4393 1.0607s-0.6629 0.4393 -1.0607 0.4393Z" strokeWidth="1.5"></path></svg></i>
                                        <span className="item-name">ছাড়পত্র (TC)</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title='Payment Slip' className={`${location.pathname === '/print/pay-slip' ? 'active' : ''} nav-link`} to="/print/pay-slip">
                                        <i className="icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="20" width="20"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 6.75h6" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 11.25h3.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 15.75h3.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75H18" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.8899 16.5602c0.216 0.2859 0.498 0.5153 0.8219 0.6685 0.3239 0.1533 0.6801 0.2258 1.0381 0.2115 1.14 0 2.06 -0.7 2.06 -1.55 0 -0.85 -0.92 -1.55 -2.06 -1.55 -1.14 0 -2.06 -0.69 -2.06 -1.55 0 -0.86 0.92 -1.54 2.06 -1.54 0.357 -0.0138 0.712 0.058 1.0356 0.2093 0.3236 0.1514 0.6062 0.3779 0.8244 0.6607" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.4404v1.03" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.2202v1.03" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m21 0.75 -3 3 -3 -3 -3 3 -3 -3 -3 3 -3 -3v22.5l3 -3 3 3 3 -3 3 3 3 -3 3 3V0.75Z" strokeWidth="1.5"></path></svg>
                                        </i>
                                        <i className="sidenav-mini-icon"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="15" width="15"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 6.75h6" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 11.25h3.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M6 15.75h3.75" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75H18" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M13.8899 16.5602c0.216 0.2859 0.498 0.5153 0.8219 0.6685 0.3239 0.1533 0.6801 0.2258 1.0381 0.2115 1.14 0 2.06 -0.7 2.06 -1.55 0 -0.85 -0.92 -1.55 -2.06 -1.55 -1.14 0 -2.06 -0.69 -2.06 -1.55 0 -0.86 0.92 -1.54 2.06 -1.54 0.357 -0.0138 0.712 0.058 1.0356 0.2093 0.3236 0.1514 0.6062 0.3779 0.8244 0.6607" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.4404v1.03" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.2202v1.03" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="m21 0.75 -3 3 -3 -3 -3 3 -3 -3 -3 3 -3 -3v22.5l3 -3 3 3 3 -3 3 3 3 -3 3 3V0.75Z" strokeWidth="1.5"></path></svg> </i>
                                        <span className="item-name">পেমেন্ট স্লিপ</span>
                                    </Link>
                                </li>
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>
                </>}
                <li><hr className="my-5 hr-horizontal" /></li>
            </Accordion>
        </Fragment >
    )
})

export default VerticalNav
