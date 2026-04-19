import React, { useState, useContext, memo, Fragment, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Accordion, useAccordionButton, AccordionContext, Row, Col, Button } from 'react-bootstrap'

// React Icons
import { TbLayoutDashboard, TbReportAnalytics, TbUserCancel, TbCalendarPlus, TbCalendarCheck, TbLoader3, TbLockCode, TbUsersGroup, TbPlaylistX } from "react-icons/tb";
import { MdAddCard, MdOutlineReceiptLong, MdOutlineTimeToLeave, MdOutlineNewLabel, MdOutlineHomeRepairService } from "react-icons/md";
import { HiCurrencyBangladeshi, HiOutlineAcademicCap } from "react-icons/hi2";
import { LuListTodo, LuListX, LuSchool, LuMicroscope } from "react-icons/lu";
import { GiTeacher, GiCaravel } from "react-icons/gi";
import { GrCreditCard } from "react-icons/gr";
import { FaUsersGear, FaMoneyCheck, FaUsersRectangle, FaWpforms, FaPersonArrowUpFromLine, FaPersonWalkingLuggage } from "react-icons/fa6";
import { AiOutlineUserSwitch, AiOutlineFileText, AiOutlineFileAdd, AiOutlineFileDone, AiTwotoneIdcard, AiTwotoneSafetyCertificate } from "react-icons/ai";
import { RiCalendar2Line, RiListRadio, RiListCheck2, RiListOrdered2, RiNumbersLine, RiListSettingsLine } from "react-icons/ri";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";
import { VscSignOut } from "react-icons/vsc";
import { PiListMagnifyingGlassDuotone, PiUserFocusDuotone, PiUserCircleGearDuotone, PiUserCircleDuotone, PiUserCirclePlusDuotone, PiUserCircleMinusDuotone, PiUserListDuotone } from "react-icons/pi";
import { BiUserCheck } from "react-icons/bi";
import { BsBuildingAdd, BsBuildingCheck, BsBuildingX, BsBuildingGear, BsBuildingExclamation, BsEnvelopeCheck, BsPrinter, BsPersonVcard, BsEnvelopePaper } from "react-icons/bs";
import { GoNumber } from "react-icons/go";

import { useAuthProvider } from '../../../../context/AuthContext.jsx';

import { GridLoader } from "react-spinners";

const VerticalNav = memo((props) => {
    const { permissionData, loading } = useAuthProvider();

    const navigate = useNavigate();
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

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!permissionData) {
            navigate("/auth/sign-out", { replace: true });
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <Fragment>
                <Row className="m-0 p-0">
                    <Col md={12} className="d-flex justify-content-center align-items-center" style={{ height: "95vh" }}>
                        <GridLoader
                            color="#000000"
                            size={15}
                            loading={true}
                        />
                    </Col>
                </Row>
            </Fragment>
        )
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
                {(permissionData.role === '17' || permissionData.role === '18') && <li className={`${location.pathname === '/dashboard/admin' ? 'active' : ''} nav-item `}>
                    <Link title="Dashboard" className={`${location.pathname === '/dashboard/admin' ? 'active' : ''} nav-link `} aria-current="page" to="/dashboard/admin" onClick={() => { }}>
                        <i className="icon">
                            <TbLayoutDashboard size={"20px"} />
                        </i>
                        <span className="item-name">ড্যাশবোর্ড</span>
                    </Link>
                </li>}
                <li className={`${location.pathname === '/dashboard/home' ? 'active' : ''} nav-item `}>
                    <Link title="Home" className={`${location.pathname === '/dashboard/home' ? 'active' : ''} nav-link `} aria-current="page" to="/dashboard/home" onClick={() => { }}>
                        <i className="icon">
                            <TbLayoutDashboard size={"20px"} />
                        </i>
                        <span className="item-name">হোম</span>
                    </Link>
                </li>

                {/* Profile Menu */}
                <Accordion.Item as="li" eventKey="profile-menu" bsPrefix={`nav-item ${active === 'profile-menu' ? 'active' : ''} `} onClick={() => setActive('profile-menu')}  >
                    <CustomToggle eventKey="profile-menu" onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Profile Menu" className="icon">
                            <PiUserCircleGearDuotone size={"20px"} />
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
                                        <PiUserCircleDuotone size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><PiUserCircleDuotone size={"16px"} /></i>
                                    <span className="item-name">প্রোফাইল সামারি</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Profile Update" className={`${location.pathname === '/admin/user-update' ? 'active' : ''} nav-link`} to="/admin/user-update">
                                    <i className="icon">
                                        <PiUserCirclePlusDuotone size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><PiUserCirclePlusDuotone size={"16px"} /></i>
                                    <span className="item-name">প্রোফাইল আপডেট</span>
                                </Link>
                            </li>
                            {permissionData.type !== '13' && <>
                                <li className="nav-item">
                                    <Link title='Password Change' className={`${location.pathname === '/auth/change-password' ? 'active' : ''} nav-link`} to="/auth/change-password">
                                        <i className="icon">
                                            <TbLockCode size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><TbLockCode size={"16px"} />
                                        </i>
                                        <span className="item-name">পাসওয়ার্ড পরিবর্তন</span>
                                    </Link>
                                </li>
                            </>}
                            <li className="nav-item">
                                <Link title='Sign Out' className={`${location.pathname === '/auth/sign-out' ? 'active' : ''} nav-link`} to="/auth/sign-out">
                                    <i className="icon">
                                        <VscSignOut size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><VscSignOut size={"16px"} /></i>
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
                            <TbUsersGroup size={"20px"} />
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
                                        <PiUserCirclePlusDuotone size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><PiUserCirclePlusDuotone size={"16px"} /></i>
                                    <span className="item-name">নতুন রেজিস্ট্রেশন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="User List" className={`${location.pathname === '/admin/user-list/active' ? 'active' : ''} nav-link`} to="/admin/user-list/active">
                                    <i className="icon">
                                        <BiUserCheck size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><BiUserCheck size={"16px"} /></i>
                                    <span className="item-name">সচল তালিকা</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="User Role Management" className={`${location.pathname === '/admin/user-list/inactive' ? 'active' : ''} nav-link`} to="/admin/user-list/inactive">
                                    <i className="icon">
                                        <TbUserCancel size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><TbUserCancel size={"16px"} /></i>
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

                {/* Internal Applications */}
                {(permissionData.type === '14' || permissionData.type === '15') && <>
                    <li><hr className="hr-horizontal" /></li>
                    <li className="nav-item static-item">
                        <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                            <span className="default-icon">অভ্যন্তরীন আবেদন</span>
                            <span className="mini-icon">-</span>
                        </Link>
                    </li>
                    <Accordion.Item as="li" eventKey="leave-app-menu" bsPrefix={`nav-item ${active === 'leave-app-menu' ? 'active' : ''} `} onClick={() => setActive('leave-app-menu')}  >
                        <CustomToggle eventKey="leave-app-menu" active={activeMenu === 'leave-app-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="ছুটির আবেদন" className="icon">
                                <GiCaravel size={"20px"} />
                            </i>
                            <span className="item-name">ছুটির আবেদন</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="leave-app-menu" >
                            <ul className="sub-nav">
                                <li className="nav-item">
                                    <Link title='ছুটির আবেদন এন্ট্রি' className={`${location.pathname === '/leave/application/new' ? 'active' : ''} nav-link`} to="/leave/application/new">
                                        <i className="icon">
                                            <FaPersonWalkingLuggage size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><FaPersonWalkingLuggage size={"16px"} />
                                        </i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title='ছুটির আবেদনের অবস্থা' className={`${location.pathname === '/leave/application/list/personal' ? 'active' : ''} nav-link`} to="/leave/application/list/personal">
                                        <i className="icon">
                                            <PiUserListDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserListDuotone size={"16px"} />
                                        </i>
                                        <span className="item-name">আবেদনের অবস্থা</span>
                                    </Link>
                                </li>
                                {((permissionData.section !== '129' && Number(permissionData.role) >= 14 && Number(permissionData.role) <= 16) || (permissionData.section === '129' && Number(permissionData.role) >= 15 && Number(permissionData.role) <= 17)) && <>
                                    <li className="nav-item">
                                        <Button title="অপেক্ষমান ছুটির তালিকা" className={`${location.pathname === '/leave/application/list/pending' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/list/pending')}>
                                            <i className="icon">
                                                <RiListRadio size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                            <span className="item-name">অপেক্ষমান তালিকা</span>
                                        </Button>
                                    </li>
                                    {(permissionData.office === '02' || permissionData.role === '17') && <li className="nav-item">
                                        <Button title="ছুটি হিসাবায়ন তালিকা" className={`${location.pathname === '/leave/application/list/report' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/list/report')}>
                                            <i className="icon">
                                                <RiNumbersLine size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><RiNumbersLine size={"16px"} /></i>
                                            <span className="item-name">হিসাবায়ন তালিকা</span>
                                        </Button>
                                    </li>}
                                    {(permissionData.role === '16' || permissionData.role === '17') && <li className="nav-item">
                                        <Button title="ছুটি অনুমোদনের তালিকা" className={`${location.pathname === '/leave/application/list/approve' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/list/approve')}>
                                            <i className="icon">
                                                <IoCheckmarkDoneCircleOutline size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><IoCheckmarkDoneCircleOutline size={"16px"} /></i>
                                            <span className="item-name">চূড়ান্ত অনুমোদন</span>
                                        </Button>
                                    </li>}
                                    {(permissionData.office === '02' || permissionData.role === '17') && <>
                                        <li className="nav-item">
                                            <Button title="অনুমোদিত ছুটির তালিকা" className={`${location.pathname === '/leave/application/list/authorized' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/list/authorized')}>
                                                <i className="icon">
                                                    <LuListTodo size={"20px"} />
                                                </i>
                                                <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                                <span className="item-name">অনুমোদিত তালিকা</span>
                                            </Button>
                                        </li>
                                        <li className="nav-item">
                                            <Button title="বাতিলকৃত ছুটির তালিকা" className={`${location.pathname === '/leave/application/list/rejected' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/list/rejected')}>
                                                <i className="icon">
                                                    <LuListX size={"20px"} />
                                                </i>
                                                <i className="sidenav-mini-icon"><LuListX size={"16px"} /></i>
                                                <span className="item-name">বাতিলকৃত তালিকা</span>
                                            </Button>
                                        </li>
                                        <li className="nav-item">
                                            <Button title="ছুুটির সংক্ষিপ্ত বিবরণী" className={`${location.pathname === '/leave/application/report' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/leave/application/report')}>
                                                <i className="icon">
                                                    <TbReportAnalytics size={"20px"} />
                                                </i>
                                                <i className="sidenav-mini-icon"><TbReportAnalytics size={"16px"} /></i>
                                                <span className="item-name">ছুটির রিপোর্ট</span>
                                            </Button>
                                        </li>
                                    </>}
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>

                    <Accordion.Item as="li" eventKey="noc-app-menu" bsPrefix={`nav-item ${active === 'noc-app-menu' ? 'active' : ''} `} onClick={() => setActive('noc-app-menu')}  >
                        <CustomToggle eventKey="noc-app-menu" active={activeMenu === 'noc-app-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="পাসপোর্ট অনাপত্তিপত্রের আবেদন" className="icon">
                                <AiTwotoneSafetyCertificate size={"20px"} />
                            </i>
                            <span className="item-name">পাসপোর্ট এনওসি</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="noc-app-menu" >
                            <ul className="sub-nav">
                                <li className="nav-item">
                                    <Link title='অনাপত্তিপত্রের আবেদন এন্ট্রি' className={`${location.pathname === '/passport/application/new' ? 'active' : ''} nav-link`} to="/passport/application/new">
                                        <i className="icon">
                                            <MdOutlineNewLabel size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><MdOutlineNewLabel size={"16px"} />
                                        </i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title='অনাপত্তিপত্রের আবেদনের অবস্থা' className={`${location.pathname === '/passport/application/list/personal' ? 'active' : ''} nav-link`} to="/passport/application/list/personal">
                                        <i className="icon">
                                            <PiUserListDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserListDuotone size={"16px"} />
                                        </i>
                                        <span className="item-name">আবেদনের অবস্থা</span>
                                    </Link>
                                </li>
                                {(((permissionData.role === '14' || permissionData.role === '15') && permissionData.office === '02') || permissionData.role === '16' || permissionData.role === '17') && <>
                                    <li className="nav-item">
                                        <Button title="অনাপত্তিপত্রের অপেক্ষমান তালিকা" className={`${location.pathname === '/passport/application/list/pending' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/passport/application/list/pending')}>
                                            <i className="icon">
                                                <RiListRadio size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                            <span className="item-name">অপেক্ষমান তালিকা</span>
                                        </Button>
                                    </li>
                                    <li className="nav-item">
                                        <Button title="অনাপত্তিপত্রের প্রক্রিয়াধীন তালিকা" className={`${location.pathname === '/passport/application/list/processing' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/passport/application/list/processing')}>
                                            <i className="icon">
                                                <RiListSettingsLine size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><RiListSettingsLine size={"16px"} /></i>
                                            <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                        </Button>
                                    </li>
                                    <li className="nav-item">
                                        <Button title="অনাপত্তিপত্রের অনুমোদিত তালিকা" className={`${location.pathname === '/passport/application/list/authorized' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/passport/application/list/authorized')}>
                                            <i className="icon">
                                                <LuListTodo size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                            <span className="item-name">অনুমোদিত তালিকা</span>
                                        </Button>
                                    </li>
                                    <li className="nav-item">
                                        <Button title="বাতিলকৃত অনাপত্তিপত্রের তালিকা" className={`${location.pathname === '/passport/application/list/rejected' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/passport/application/list/rejected')}>
                                            <i className="icon">
                                                <LuListX size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuListX size={"16px"} /></i>
                                            <span className="item-name">বাতিলকৃত তালিকা</span>
                                        </Button>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>

                    <Accordion.Item as="li" eventKey="citizen-charter-menu" bsPrefix={`nav-item ${active === 'citizen-charter-menu' ? 'active' : ''} `} onClick={() => setActive('citizen-charter-menu')}  >
                        <CustomToggle eventKey="citizen-charter-menu" active={activeMenu === 'citizen-charter-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="সিটিজেন চার্টার" className="icon">
                                <MdOutlineHomeRepairService size={"20px"} />
                            </i>
                            <span className="item-name">সিটিজেন চার্টার</span>
                            <i className="right-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </i>
                        </CustomToggle>
                        <Accordion.Collapse eventKey="citizen-charter-menu" >
                            <ul className="sub-nav">
                                <li className="nav-item">
                                    <Link title='নতুন এন্ট্রি' className={`${location.pathname === '/citizen/charter/new' ? 'active' : ''} nav-link`} to="/citizen/charter/new">
                                        <i className="icon">
                                            <MdOutlineNewLabel size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><MdOutlineNewLabel size={"16px"} />
                                        </i>
                                        <span className="item-name">নতুন এন্ট্রি</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Button title="সিটিজেন চার্টারের অপেক্ষমান তালিকা" className={`${location.pathname === '/citizen/charter/list/pending' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/citizen/charter/list/pending')}>
                                        <i className="icon">
                                            <RiListRadio size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Button>
                                </li>
                                <li className="nav-item">
                                    <Button title="সিটিজেন চার্টারের প্রক্রিয়াধীন তালিকা" className={`${location.pathname === '/citizen/charter/list/processing' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/citizen/charter/list/processing')}>
                                        <i className="icon">
                                            <RiListSettingsLine size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListSettingsLine size={"16px"} /></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Button>
                                </li>
                                {(permissionData.role === "16" || permissionData.role === "17") && <li className="nav-item">
                                    <Button title="সিটিজেন চার্টার অনুমোদনের অপেক্ষমান তালিকা" className={`${location.pathname === '/citizen/charter/list/verified' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/citizen/charter/list/verified')}>
                                        <i className="icon">
                                            <IoCheckmarkDoneCircleOutline size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><IoCheckmarkDoneCircleOutline size={"16px"} /></i>
                                        <span className="item-name">চূড়ান্ত অনুমোদন</span>
                                    </Button>
                                </li>}
                                <li className="nav-item">
                                    <Button title="সিটিজেন চার্টারের অনুমোদিত তালিকা" className={`${location.pathname === '/citizen/charter/list/authorized' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/citizen/charter/list/authorized')}>
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Button>
                                </li>
                                <li className="nav-item">
                                    <Button title="সিটিজেন চার্টারের বাতিলকৃত তালিকা" className={`${location.pathname === '/citizen/charter/list/rejected' ? 'active' : ''} nav-link`} variant="link" onClick={() => navigate('/citizen/charter/list/rejected')}>
                                        <i className="icon">
                                            <LuListX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListX size={"16px"} /></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Button>
                                </li>
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>
                </>}

                {/* Entry Section */}
                {(permissionData.office === "02" || permissionData.office === "03" || permissionData.office === "04" || permissionData.office === "05" || permissionData.office === "06") && <li><hr className="hr-horizontal" /></li>}
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        {permissionData.office === "02" && <span className="default-icon">বোর্ড নোটিশ</span>}
                        {permissionData.office === "03" && (permissionData.role === "17" || permissionData.role === "18") && <span className="default-icon">নোটিশ, তারিখ ও ফিস</span>}
                        {(permissionData.office === "03" && !(permissionData.role === "17" || permissionData.role === "18") || permissionData.office === "04" || permissionData.office === "05") && <span className="default-icon">আবেদনের তারিখ</span>}
                        {permissionData.office === "06" && <span className="default-icon">সেবা মূল্য</span>}
                        <span className="mini-icon">-</span>
                    </Link>
                </li>

                {(permissionData.role === "17" || permissionData.role === "18" || ((permissionData.office === "02" || permissionData.office === "03" || permissionData.office === "04" || permissionData.office === "05" || permissionData.office === "06") && (permissionData.role === "13" || permissionData.role === "14" || permissionData.role === "15"))) && <>
                    {(permissionData.role === "17" || permissionData.role === "18" || permissionData.office === "02") && <Accordion.Item as="li" eventKey="notice-menu" bsPrefix={`nav-item ${active === 'notice-menu' ? 'active' : ''} `} onClick={() => setActive('notice-menu')}  >
                        <CustomToggle eventKey="notice-menu" active={activeMenu === 'notice-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Notice Entry Menu" className="icon">
                                <AiOutlineFileText size={"20px"} />
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
                                {permissionData.role !== "15" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/notice/new' ? 'active' : ''} nav-link`} to="/entry/notice/new">
                                            <i className="icon">
                                                <AiOutlineFileAdd size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><AiOutlineFileAdd size={"16px"} /></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {permissionData.role !== "13" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/notice/auth' ? 'active' : ''} nav-link`} to="/entry/notice/auth">
                                            <i className="icon">
                                                <AiOutlineFileDone size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><AiOutlineFileDone size={"16px"} /></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>}

                    {(permissionData.role === "17" || permissionData.role === "18" || permissionData.office === "03" || permissionData.office === "04" || permissionData.office === "05") && <Accordion.Item as="li" eventKey="date-menu" bsPrefix={`nav-item ${active === 'date-menu' ? 'active' : ''} `} onClick={() => setActive('date-menu')}  >
                        <CustomToggle eventKey="date-menu" active={activeMenu === 'date-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Date Entry Menu" className="icon">
                                <RiCalendar2Line size={"20px"} />
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
                                {permissionData.role !== "15" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/date/new' ? 'active' : ''} nav-link`} to="/entry/date/new">
                                            <i className="icon">
                                                <TbCalendarPlus size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><TbCalendarPlus size={"16px"} /></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {permissionData.role !== "13" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/date/auth' ? 'active' : ''} nav-link`} to="/entry/date/auth">
                                            <i className="icon">
                                                <TbCalendarCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><TbCalendarCheck size={"16px"} /></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>}

                    {(permissionData.role === "17" || permissionData.role === "18" || permissionData.office === "06") && <Accordion.Item as="li" eventKey="fee-menu" bsPrefix={`nav-item ${active === 'fee-menu' ? 'active' : ''} `} onClick={() => setActive('fee-menu')}  >
                        <CustomToggle eventKey="fee-menu" active={activeMenu === 'fee-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                            <i title="Fee Entry Menu" className="icon">
                                <GrCreditCard size={"20px"} />
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
                                {permissionData.role !== "15" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry" className={`${location.pathname === '/entry/fee/new' ? 'active' : ''} nav-link`} to="/entry/fee/new">
                                            <i className="icon">
                                                <MdAddCard size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><MdAddCard size={"16px"} /></i>
                                            <span className="item-name"> নতুন এন্ট্রি </span>
                                        </Link>
                                    </li>
                                </>}
                                {permissionData.role !== "13" && permissionData.role !== "16" && <>
                                    <li className="nav-item">
                                        <Link title="New Entry Authorize" className={`${location.pathname === '/entry/fee/auth' ? 'active' : ''} nav-link`} to="/entry/fee/auth">
                                            <i className="icon">
                                                <FaMoneyCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><FaMoneyCheck size={"16px"} /></i>
                                            <span className="item-name">এন্ট্রি অনুমোদন</span>
                                        </Link>
                                    </li>
                                </>}
                            </ul>
                        </Accordion.Collapse>
                    </Accordion.Item>}
                </>}

                <li><hr className="hr-horizontal" /></li>
                <li className="nav-item static-item">
                    <Link className="nav-link static-item disabled" to="#" tabIndex="-1">
                        <span className="default-icon">শিক্ষার্থীর আবেদন</span>
                        <span className="mini-icon">-</span>
                    </Link>
                </li>

                {((permissionData.office === "03" || permissionData.office === "04" || permissionData.office === "05") || ((permissionData.office === "01" || permissionData.office === "02") && (permissionData.role === "15" || permissionData.office === "16"))) && <Accordion.Item as="li" eventKey="subject-menu" bsPrefix={`nav-item ${active === 'subject-menu' ? 'active' : ''} `} onClick={() => setActive('subject-menu')}  >
                    <CustomToggle eventKey="subject-menu" active={activeMenu === 'subject-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Subject Menu" className="icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 17a4 4 0 0 1-8 0V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2Z" /><path d="M16.7 13H19a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H7" /><path d="M 7 17h.01" /><path d="m11 8 2.3-2.3a2.4 2.4 0 0 1 3.404.004L18.6 7.6a2.4 2.4 0 0 1 .026 3.434L9.9 19.8" /></svg>
                        </i>
                        <span className="item-name">বিষয় আপডেট</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="subject-menu" >
                        <ul className="sub-nav">
                            <li className="nav-item">
                                <Link title="New Subject" className={`${location.pathname === '/student/subject/new' ? 'active' : ''} nav-link`} to="/student/subject/new">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 7v6" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M9 10h6" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 7v6" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M9 10h6" /></svg></i>
                                    <span className="item-name">{permissionData.role==='13'? "বিষয় আপডেট":"অপেক্ষমান তালিকা"}</span>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link title="Subject Authorize" className={`${location.pathname === '/student/subject/authorize' ? 'active' : ''} nav-link`} to="/student/subject/authorize">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 7v6" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M9 10h6" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 7v6" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M9 10h6" /></svg></i>
                                    <span className="item-name">বিষয় অনুমোদন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Pending Subject List" className={`${location.pathname === '/student/subject/list/temp' ? 'active' : ''} nav-link`} to="/student/subject/list/temp">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17h1.5" /><path d="M12 22h1.5" /><path d="M12 2h1.5" /><path d="M17.5 22H19a1 1 0 0 0 1-1" /><path d="M17.5 2H19a1 1 0 0 1 1 1v1.5" /><path d="M20 14v3h-2.5" /><path d="M20 8.5V10" /><path d="M4 10V8.5" /><path d="M4 19.5V14" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8" /><path d="M8 22H6.5a1 1 0 0 1 0-5H8" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 17h1.5" /><path d="M12 22h1.5" /><path d="M12 2h1.5" /><path d="M17.5 22H19a1 1 0 0 0 1-1" /><path d="M17.5 2H19a1 1 0 0 1 1 1v1.5" /><path d="M20 14v3h-2.5" /><path d="M20 8.5V10" /><path d="M4 10V8.5" /><path d="M4 19.5V14" /><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H8" /><path d="M8 22H6.5a1 1 0 0 1 0-5H8" /></svg></i>
                                    <span className="item-name">অপেক্ষমান তালিকা</span>
                                </Link>
                            </li> */}
                            <li className="nav-item">
                                <Link title="Procesing Subject List" className={`${location.pathname === '/student/subject/list/processing' ? 'active' : ''} nav-link`} to="/student/subject/list/processing">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6V4a2 2 0 1 0-4 0v2" /><path d="M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" /><rect x="12" y="6" width="8" height="5" rx="1" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6V4a2 2 0 1 0-4 0v2" /><path d="M20 15v6a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H10" /><rect x="12" y="6" width="8" height="5" rx="1" /></svg></i>
                                    <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Final Subject List" className={`${location.pathname === '/student/subject/list/authorized' ? 'active' : ''} nav-link`} to="/student/subject/list/authorized">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="m9 9.5 2 2 4-4" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="m9 9.5 2 2 4-4" /></svg></i>
                                    <span className="item-name">অনুমোদিত তালিকা</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Rejected Subject List" className={`${location.pathname === '/student/subject/list/rejected' ? 'active' : ''} nav-link`} to="/student/subject/list/rejected">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="m14.5 7-5 5" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="m9.5 7 5 5" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="m14.5 7-5 5" /><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" /><path d="m9.5 7 5 5" /></svg></i>
                                    <span className="item-name">বাতিলকৃত তালিকা</span>
                                </Link>
                            </li>
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>}

                {(permissionData.type === "13" || permissionData.role === "17" || permissionData.role === "18" || ((permissionData.office === "01" || permissionData.office === "02") && (permissionData.role === "15" || permissionData.role === "16")) || permissionData.office === "04" || permissionData.office === "05") && <Accordion.Item as="li" eventKey="registration-menu" bsPrefix={`nav-item ${active === 'registration-menu' ? 'active' : ''} `} onClick={() => setActive('registration-menu')}  >
                    <CustomToggle eventKey="registration-menu" active={activeMenu === 'registration-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Registration Menu" className="icon">
                            <FaUsersRectangle size={"20px"} />
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
                            {!(permissionData.office === "01" || permissionData.office === "02") && <>
                                <li className="nav-item">
                                    <Link title="New Registration" className={`${location.pathname === '/student/registration/new' ? 'active' : ''} nav-link`} to="/student/registration/new">
                                        <i className="icon">
                                            <PiUserCirclePlusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserCirclePlusDuotone size={"15px"} /></i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Temporary Registration List" className={`${location.pathname === '/student/registration/list/temp' ? 'active' : ''} nav-link`} to="/student/registration/list/temp">
                                        <i className="icon">
                                            <RiListRadio size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Final Registration List" className={`${location.pathname === '/student/registration/list/final' ? 'active' : ''} nav-link`} to="/student/registration/list/final">
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">চূড়ান্ত তালিকা</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Archive Registration List" className={`${location.pathname === '/student/registration/list/archive' ? 'active' : ''} nav-link`} to="/student/registration/list/archive">
                                        <i className="icon">
                                            <RiListCheck2 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListCheck2 size={"16px"} /></i>
                                        <span className="item-name">আর্কাইভ তালিকা</span>
                                    </Link>
                                </li>

                                {permissionData.type !== "13" && <li className="nav-item">
                                    <Link title="Registration Search" className={`${location.pathname === '/student/registration/search/birthreg' ? 'active' : ''} nav-link`} to="/student/registration/search/birthreg">
                                        <i className="icon">
                                            <PiUserFocusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserFocusDuotone size={"16px"} /></i>
                                        <span className="item-name">রেজিস্ট্রেশন খুঁজুন</span>
                                    </Link>
                                </li>}

                                <li className="nav-item">
                                    <Link title='Cancel Registration' className={`${location.pathname === '/student/registration/cancel' ? 'active' : ''} nav-link`} to="/student/registration/cancel">
                                        <i className="icon">
                                            <PiUserCircleMinusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserCircleMinusDuotone size={"16px"} /></i>
                                        <span className="item-name">রেজিস্ট্রেশন বাতিল</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Registration Payment" className={`${location.pathname === '/student/registration/payment' ? 'active' : ''} nav-link`} to="/student/registration/payment">
                                        <i className="icon">
                                            <HiCurrencyBangladeshi fill='none' stroke='currentColor' strokeWidth='1' size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><HiCurrencyBangladeshi fill='none' stroke='currentColor' strokeWidth='1' size={"16px"} /></i>
                                        <span className="item-name">ফি পরিশোধ</span>
                                    </Link>
                                </li>
                            </>}

                            {(permissionData.office === "01" || permissionData.office === "02") && <>
                                <li className="nav-item">
                                    <Link title="Final Registration List" className={`${location.pathname === '/student/registration/list/final' ? 'active' : ''} nav-link`} to="/student/registration/list/final">
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">চূড়ান্ত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Registration Search" className={`${location.pathname === '/student/registration/search/birthreg' ? 'active' : ''} nav-link`} to="/student/registration/search/birthreg">
                                        <i className="icon">
                                            <PiUserFocusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserFocusDuotone size={"16px"} /></i>
                                        <span className="item-name">রেজিস্ট্রেশন খুঁজুন</span>
                                    </Link>
                                </li>
                            </>}

                            {(permissionData.role === "17" || permissionData.role === "18") && <li className="nav-item">
                                <Link title="Registration Number Generation" className={`${location.pathname === '/student/registration/number/generate' ? 'active' : ''} nav-link`} to="/student/registration/number/generate">
                                    <i className="icon">
                                        <GoNumber size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><GoNumber size={"16px"} /></i>
                                    <span className="item-name">রেজিঃ নম্বর তৈরি</span>
                                </Link>
                            </li>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>}

                {(permissionData.type === "13" || permissionData.role === "17" || permissionData.role === "18" || ((permissionData.office === "01" || permissionData.office === "02") && (permissionData.role === "15" || permissionData.role === "16")) || permissionData.office === "04" || permissionData.office === "05") && <Accordion.Item as="li" eventKey="form-fillup-menu" bsPrefix={`nav-item ${active === 'form-fillup-menu' ? 'active' : ''} `} onClick={() => setActive('form-fillup-menu')}  >
                    <CustomToggle eventKey="form-fillup-menu" active={activeMenu === 'form-fillup-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="Form Fillup Menu" className="icon">
                            <FaWpforms size={"20px"} />
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
                            {!(permissionData.office === "01" || permissionData.office === "02") && <>
                                <li className="nav-item">
                                    <Link title="New Form Fillup" className={`${location.pathname === '/form-fillup/new' ? 'active' : ''} nav-link`} to="/form-fillup/new">
                                        <i className="icon">
                                            <PiUserCirclePlusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserCirclePlusDuotone size={"16px"} /></i>
                                        <span className="item-name"> নতুন আবেদন </span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Temporary Form Fillup List" className={`${location.pathname === '/form-fillup/list/temp' ? 'active' : ''} nav-link`} to="/form-fillup/list/temp">
                                        <i className="icon">
                                            <RiListRadio size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Final Form Fillup List" className={`${location.pathname === '/form-fillup/list/final' ? 'active' : ''} nav-link`} to="/form-fillup/list/final">
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">চূড়ান্ত তালিকা</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Archive Form Fillup List" className={`${location.pathname === '/form-fillup/list/archive' ? 'active' : ''} nav-link`} to="/form-fillup/list/archive">
                                        <i className="icon">
                                            <RiListCheck2 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListCheck2 size={"16px"} /></i>
                                        <span className="item-name">আর্কাইভ তালিকা</span>
                                    </Link>
                                </li>

                                {permissionData.type !== "13" && <li className="nav-item">
                                    <Link title="Form Fillup Search" className={`${location.pathname === '/form-fillup/search/birthreg' ? 'active' : ''} nav-link`} to="/form-fillup/search/birthreg">
                                        <i className="icon">
                                            <PiUserFocusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserFocusDuotone size={"16px"} /></i>
                                        <span className="item-name">ফর্ম পূরণ খুঁজুন</span>
                                    </Link>
                                </li>}

                                <li className="nav-item">
                                    <Link title='Cancel Form Fillup' className={`${location.pathname === '/student/registration/cancel' ? 'active' : ''} nav-link`} to="/student/registration/cancel">
                                        <i className="icon">
                                            <PiUserCircleMinusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserCircleMinusDuotone size={"16px"} /></i>
                                        <span className="item-name">ফর্ম পূরণ বাতিল</span>
                                    </Link>
                                </li>

                                <li className="nav-item">
                                    <Link title="Form Fillup Payment" className={`${location.pathname === '/form-fillup/payment' ? 'active' : ''} nav-link`} to="/form-fillup/payment">
                                        <i className="icon">
                                            <HiCurrencyBangladeshi fill='none' stroke='currentColor' strokeWidth='1' size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><HiCurrencyBangladeshi fill='none' stroke='currentColor' strokeWidth='1' size={"16px"} /></i>
                                        <span className="item-name">ফি পরিশোধ</span>
                                    </Link>
                                </li>
                            </>}

                            {(permissionData.office === "01" || permissionData.office === "02") && <>
                                <li className="nav-item">
                                    <Link title="Final Form Fillup List" className={`${location.pathname === '/form-fillup/list/final' ? 'active' : ''} nav-link`} to="/form-fillup/list/final">
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">চূড়ান্ত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Form Fillup Search" className={`${location.pathname === '/form-fillup/search/birthreg' ? 'active' : ''} nav-link`} to="/form-fillup/search/birthreg">
                                        <i className="icon">
                                            <PiUserFocusDuotone size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><PiUserFocusDuotone size={"16px"} /></i>
                                        <span className="item-name">পরীক্ষার্থী খুঁজুন</span>
                                    </Link>
                                </li>
                            </>}

                            {(permissionData.role === "17" || permissionData.role === "18") && <li className="nav-item">
                                <Link title="Registration Number Generation" className={`${location.pathname === '/form-fillup/number/generate' ? 'active' : ''} nav-link`} to="/form-fillup/number/generate">
                                    <i className="icon">
                                        <GoNumber size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><GoNumber size={"16px"} /></i>
                                    <span className="item-name">রোল নম্বর তৈরি</span>
                                </Link>
                            </li>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>}

                <Accordion.Item as="li" eventKey="tc-menu" bsPrefix={`nav-item ${active === 'tc-menu' ? 'active' : ''} `} onClick={() => setActive('tc-menu')}  >
                    <CustomToggle eventKey="tc-menu" active={activeMenu === 'tc-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="TC Menu" className="icon">
                            <AiOutlineUserSwitch size={"20px"} />
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
                                <Link title="New TC Application" className={`${location.pathname === '/student/tc/new' ? 'active' : ''} nav-link`} to="/student/tc/new">
                                    <i className="icon">
                                        <PiUserCirclePlusDuotone size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><PiUserCirclePlusDuotone size={"16px"} /></i>
                                    <span className="item-name"> নতুন আবেদন </span>
                                </Link>
                            </li>
                            {/* <li className="nav-item">
                                <Link title="TC Cancel" className={`${location.pathname === '/studenttc/cancel' ? 'active' : ''} nav-link`} to="/studenttc/cancel">
                                    <i className="icon">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" /></svg>
                                    </i>
                                    <i className="sidenav-mini-icon"><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-strikethrough"><path d="M16 4H9a3 3 0 0 0-2.83 4" /><path d="M14 12a4 4 0 0 1 0 8H6" /><line x1="4" x2="20" y1="12" y2="12" /></svg></i>
                                    <span className="item-name">ছাড়পত্র (TC) বাতিল</span>
                                </Link>
                            </li> */}
                            {(permissionData.type === "13" || permissionData.role === "17" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Pending TC" className={`${location.pathname === '/student/tc/list/pending' ? 'active' : ''} nav-link`} to="/student/tc/list/pending">
                                        <i className="icon">
                                            <RiListRadio size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><RiListRadio size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Authorized TC" className={`${location.pathname === '/student/tc/list/authorized' ? 'active' : ''} nav-link`} to="/student/tc/list/authorized">
                                        <i className="icon">
                                            <LuListTodo size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListTodo size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected TC" className={`${location.pathname === '/student/tc/list/rejected' ? 'active' : ''} nav-link`} to="/student/tc/list/rejected">
                                        <i className="icon">
                                            <LuListX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><LuListX size={"16px"} /></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                                {/* <li className="nav-item">
                                    <Link title="Archive TC" className={`${location.pathname === '/student/tc/list/archive' ? 'active' : ''} nav-link`} to="/student/tc/list/archive">
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
                            <LuSchool size={"20px"} />
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
                                        <BsBuildingAdd size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><BsBuildingAdd size={"16px"} /></i>
                                    <span className="item-name">নতুন আবেদন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Establishment Payment/Status Check" className={`${location.pathname === '/institute/establishment/payment' ? 'active' : ''} nav-link`} to="/institute/establishment/payment">
                                    <i className="icon">
                                        <BsBuildingExclamation size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><BsBuildingExclamation size={"16px"} /></i>
                                    <span className="item-name">আবেদনের অবস্থা</span>
                                </Link>
                            </li>
                            {(permissionData.role === "16" || permissionData.role === "17" || permissionData.role === "18" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Establishment Pending List" className={`${location.pathname === '/establishment/pending-list' ? 'active' : ''} nav-link`} to="/establishment/pending-list">
                                        <i className="icon">
                                            <BsBuildingGear size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingGear size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Establishment Processing List" className={`${location.pathname === '/establishment/process-list' ? 'active' : ''} nav-link`} to="/establishment/process-list">
                                        <i className="icon">
                                            <TbLoader3 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><TbLoader3 size={"16px"} /></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Establishment Inquiry List" className={`${location.pathname === '/establishment/inquiry-list' ? 'active' : ''} nav-link`} to="/establishment/inquiry-list">
                                            <i className="icon">
                                                <LuMicroscope size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuMicroscope size={"16px"} /></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Establishment Order Generation List" className={`${location.pathname === '/establishment/generate-order' ? 'active' : ''} nav-link`} to="/establishment/generate-order">
                                            <i className="icon">
                                                <BsEnvelopeCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><BsEnvelopeCheck size={"16px"} /></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Establishment List" className={`${location.pathname === '/establishment/authorized-list' ? 'active' : ''} nav-link`} to="/establishment/authorized-list">
                                        <i className="icon">
                                            <BsBuildingCheck size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingCheck size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Establishment List" className={`${location.pathname === '/establishment/rejected-list' ? 'active' : ''} nav-link`} to="/establishment/rejected-list">
                                        <i className="icon">
                                            <BsBuildingX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingX size={"16px"} /></i>
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
                            <GiTeacher size={"20px"} />
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
                                        <BsBuildingAdd size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><BsBuildingAdd size={"16px"} /></i>
                                    <span className="item-name">নতুন আবেদন</span>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link title="Class Start Payment/Status Check" className={`${location.pathname === '/institute/class-start/payment' ? 'active' : ''} nav-link`} to="/institute/class-start/payment">
                                    <i className="icon">
                                        <BsBuildingExclamation size={"20px"} />
                                    </i>
                                    <i className="sidenav-mini-icon"><BsBuildingExclamation size={"16px"} /></i>
                                    <span className="item-name">আবেদনের অবস্থা</span>
                                </Link>
                            </li>
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Class Start Pending List" className={`${location.pathname === '/class-start/pending-list' ? 'active' : ''} nav-link`} to="/class-start/pending-list">
                                        <i className="icon">
                                            <BsBuildingGear size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingGear size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Class Start Processing List" className={`${location.pathname === '/class-start/process-list' ? 'active' : ''} nav-link`} to="/class-start/process-list">
                                        <i className="icon">
                                            <TbLoader3 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><TbLoader3 size={"16px"} /></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Class Start Inquiry List" className={`${location.pathname === '/class-start/inquiry-list' ? 'active' : ''} nav-link`} to="/class-start/inquiry-list">
                                            <i className="icon">
                                                <LuMicroscope size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuMicroscope size={"16px"} /></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Class Start Order Generation List" className={`${location.pathname === '/class-start/generate-order' ? 'active' : ''} nav-link`} to="/class-start/generate-order">
                                            <i className="icon">
                                                <BsEnvelopeCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><BsEnvelopeCheck size={"16px"} /></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Class Start List" className={`${location.pathname === '/class-start/authorized-list' ? 'active' : ''} nav-link`} to="/class-start/authorized-list">
                                        <i className="icon">
                                            <BsBuildingCheck size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingCheck size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Class Start List" className={`${location.pathname === '/class-start/rejected-list' ? 'active' : ''} nav-link`} to="/class-start/rejected-list">
                                        <i className="icon">
                                            <BsBuildingX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingX size={"16px"} /></i>
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
                            <HiOutlineAcademicCap size={"20px"} />
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
                                            <BsBuildingAdd size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingAdd size={"16px"} /></i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Recognition Status Check" className={`${location.pathname === '/institute/recognition/all-list' ? 'active' : ''} nav-link`} to="/institute/recognition/all-list">
                                        <i className="icon">
                                            <BsBuildingExclamation size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingExclamation size={"16px"} /></i>
                                        <span className="item-name">আবেদনের তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Recognition Pending List" className={`${location.pathname === '/recognition/pending-list' ? 'active' : ''} nav-link`} to="/recognition/pending-list">
                                        <i className="icon">
                                            <BsBuildingGear size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingGear size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Recognition Processing List" className={`${location.pathname === '/recognition/process-list' ? 'active' : ''} nav-link`} to="/recognition/process-list">
                                        <i className="icon">
                                            <TbLoader3 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><TbLoader3 size={"16px"} /></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Recognition Inquiry List" className={`${location.pathname === '/recognition/inquiry-list' ? 'active' : ''} nav-link`} to="/recognition/inquiry-list">
                                            <i className="icon">
                                                <LuMicroscope size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuMicroscope size={"16px"} /></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Recognition Order Generation List" className={`${location.pathname === '/recognition/generate-order' ? 'active' : ''} nav-link`} to="/recognition/generate-order">
                                            <i className="icon">
                                                <BsEnvelopeCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><BsEnvelopeCheck size={"16px"} /></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Recognition List" className={`${location.pathname === '/recognition/authorized-list' ? 'active' : ''} nav-link`} to="/recognition/authorized-list">
                                        <i className="icon">
                                            <BsBuildingCheck size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingCheck size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Recognition List" className={`${location.pathname === '/recognition/rejected-list' ? 'active' : ''} nav-link`} to="/recognition/rejected-list">
                                        <i className="icon">
                                            <BsBuildingX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingX size={"16px"} /></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                <Accordion.Item as="li" eventKey="institute-data-update-menu" bsPrefix={`nav-item ${active === 'institute-data-update-menu' ? 'active' : ''} `} onClick={() => setActive('institute-data-update-menu')} >
                    <CustomToggle eventKey="institute-data-update-menu" active={activeMenu === 'institute-data-update-menu' ? true : false} onClick={(activeKey) => setActiveMenu(activeKey)}>
                        <i title="প্রতিষ্ঠানের তথ্য পরিবর্তনের আবেদন" className="icon">
                            <HiOutlineAcademicCap size={"20px"} />
                        </i>
                        <span className="item-name">প্রতিষ্ঠান হালনাগাদ</span>
                        <i className="right-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                            </svg>
                        </i>
                    </CustomToggle>
                    <Accordion.Collapse eventKey="institute-data-update-menu">
                        <ul className="sub-nav">
                            {(permissionData.role === "17" || permissionData.type === "13") && <>
                                <li className="nav-item">
                                    <Link title="New Application" className={`${location.pathname === '/institute/data/update/new' ? 'active' : ''} nav-link`} to="/institute/data/update/new">
                                        <i className="icon">
                                            <BsBuildingAdd size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingAdd size={"16px"} /></i>
                                        <span className="item-name">নতুন আবেদন</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Group Subject Status Check" className={`${location.pathname === '/institute/update/app/list' ? 'active' : ''} nav-link`} to="/institute/update/app/list">
                                        <i className="icon">
                                            <BsBuildingExclamation size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingExclamation size={"16px"} /></i>
                                        <span className="item-name">আবেদনের তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                            {(permissionData.role === "17" || permissionData.role === "16" || permissionData.office === "04" || permissionData.office === "05") && <>
                                <li className="nav-item">
                                    <Link title="Group Subject Pending List" className={`${location.pathname === '/institute/update/list/pending' ? 'active' : ''} nav-link`} to="/institute/update/list/pending">
                                        <i className="icon">
                                            <BsBuildingGear size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingGear size={"16px"} /></i>
                                        <span className="item-name">অপেক্ষমান তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Group Subject Processing List" className={`${location.pathname === '/institute/update/list/process' ? 'active' : ''} nav-link`} to="/institute/update/list/process">
                                        <i className="icon">
                                            <TbLoader3 size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><TbLoader3 size={"16px"} /></i>
                                        <span className="item-name">প্রক্রিয়াধীন তালিকা</span>
                                    </Link>
                                </li>
                                {permissionData.role === "15" && <>
                                    <li className="nav-item">
                                        <Link title="Group Subject Inquiry List" className={`${location.pathname === '/institute/update/list/inquiry' ? 'active' : ''} nav-link`} to="/institute/update/list/inquiry">
                                            <i className="icon">
                                                <LuMicroscope size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><LuMicroscope size={"16px"} /></i>
                                            <span className="item-name">তদন্তাধীন তালিকা</span>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link title="Group Subject Order Generation List" className={`${location.pathname === '/institute/update/shift/generate-order' ? 'active' : ''} nav-link`} to="/institute/update/shift/generate-order">
                                            <i className="icon">
                                                <BsEnvelopeCheck size={"20px"} />
                                            </i>
                                            <i className="sidenav-mini-icon"><BsEnvelopeCheck size={"16px"} /></i>
                                            <span className="item-name">আদেশ প্রেরণের তালিকা</span>
                                        </Link>
                                    </li>
                                </>}
                                <li className="nav-item">
                                    <Link title="Final Group Subject List" className={`${location.pathname === '/institute/update/list/authorized' ? 'active' : ''} nav-link`} to="/institute/update/list/authorized">
                                        <i className="icon">
                                            <BsBuildingCheck size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingCheck size={"16px"} /></i>
                                        <span className="item-name">অনুমোদিত তালিকা</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Rejected Group Subject List" className={`${location.pathname === '/institute/update/list/rejected' ? 'active' : ''} nav-link`} to="/institute/update/list/rejected">
                                        <i className="icon">
                                            <BsBuildingX size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsBuildingX size={"16px"} /></i>
                                        <span className="item-name">বাতিলকৃত তালিকা</span>
                                    </Link>
                                </li>
                            </>}
                        </ul>
                    </Accordion.Collapse>
                </Accordion.Item>

                {(((permissionData.office === "01" || permissionData.office === "02" || permissionData.office === "06") && (permissionData.role === "14" || permissionData.role === "15" || permissionData.role === "16")) || permissionData.role === "17") && <>
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

                {(permissionData.type === "13" || permissionData.role === "17" || ((permissionData.office === "04" || permissionData.office === "05") && permissionData.role === "15")) && <>
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
                                <BsPrinter size={"20px"} />
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
                                            <BsPersonVcard size={"19px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsPersonVcard size={"15px"} /></i>
                                        <span className="item-name">রেজিস্ট্রেশন কার্ড</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Admit Card" className={`${location.pathname === '/print/admit-card' ? 'active' : ''} nav-link`} to="/print/admit-card">
                                        <i className="icon">
                                            <AiTwotoneIdcard size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><AiTwotoneIdcard size={"16px"} /></i>
                                        <span className="item-name">প্রবেশপত্র</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title="Transfer Order" className={`${location.pathname === '/print/tc-order' ? 'active' : ''} nav-link`} to="/print/tc-order">
                                        <i className="icon">
                                            <BsEnvelopePaper size={"16px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><BsEnvelopePaper size={"12px"} /></i>
                                        <span className="item-name">ছাড়পত্র (TC)</span>
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link title='Payment Slip' className={`${location.pathname === '/print/pay-slip' ? 'active' : ''} nav-link`} to="/print/pay-slip">
                                        <i className="icon">
                                            <MdOutlineReceiptLong size={"20px"} />
                                        </i>
                                        <i className="sidenav-mini-icon"><MdOutlineReceiptLong size={"16px"} /></i>
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
