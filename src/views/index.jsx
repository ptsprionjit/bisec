import React, { useEffect, Fragment } from 'react'
// import React, { useState, useEffect, Fragment } from 'react'
// import { useNavigate } from 'react-router-dom';
// import { Button, Nav, Collapse, Navbar, Container, Dropdown } from 'react-bootstrap'
import { Button, Nav, Navbar, Container, Dropdown } from 'react-bootstrap'
// import Card from '../../src/components/Card'
import Logo from '../components/partials/components/logo'
import { Link } from 'react-router-dom'

import Footer from '../components/partials/dashboard/FooterStyle/footer'

import CustomToggle from '../components/dropdowns'

// //uiKit
// import Accordions from './uikit/accordion'
// import Alerts from './uikit/alert'
// import Badges from './uikit/badge'
// import Breadcrumbs from './uikit/breadcrumb'
// import Buttons from './uikit/button'
// import ButtonGroups from './uikit/buttons-group'
// import Calenders from './uikit/calender'
// import Cards from './uikit/card'
// import Carousels from './uikit/carousel'
// import DropDowns from './uikit/dropdowns'
// import ListGroups from './uikit/list-group'
// import Modals from './uikit/modal'
// import Navbars from './uikit/navbar'
// import Navs from './uikit/nav'
// import OffCanvass from './uikit/off-canvas'
// import Paginations from './uikit/pagination'
// import Popovers from './uikit/popovers'
// import Scrollspys from './uikit/scrollspy'
// import Spinnerss from './uikit/spinner'
// import Toasts from './uikit/toast'
// import Tooltips from './uikit/tooltip'
// import Progresss from './uikit/progress'
// //form
// import DisabledForms from './uikit/disabled-form'
// import AFormControls from './uikit/alternate-form-control'
// import Sizings from './uikit/sizing'
// import InputGroups from './uikit/input-group'
// import FloatingLables from './uikit/floating-lable'
// import AFloatingLables from './uikit/alternate-floating-lable'
// import ToggleBtns from './uikit/toggle-btn'
// import Validations from './uikit/validation'
// import Overview from './uikit/form-overview'

// // content
// import Typographys from './uikit/typography'
// import Images from './uikit/image'
// import Figures from './uikit/figure'
// import Tables from './uikit/table'

//img
import topImage from '../assets/images/dashboard/top-image.jpg'

// import biseMainImage from '../assets/images/brands/bisec_main.jpg'

//prism
import '../../node_modules/prismjs/prism';
import '../../node_modules/prismjs/themes/prism-okaidia.css'

// SliderTab
import SliderTab from '../plugins/slider-tabs'

// Import selectors & action from setting store
import * as SettingSelector from "../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";

const Index = () => {
  const appName = useSelector(SettingSelector.app_bn_name);
  // const appShortName = useSelector(SettingSelector.app_short_name);

  // collapse
  // const [open, setOpen] = useState(false);
  // const [open1, setOpen1] = useState(false);
  // const [open2, setOpen2] = useState(false);
  // const [open3, setOpen3] = useState(false);

  useEffect(() => {
    return () => {
      setTimeout(() => {
        Array.from(
          document.querySelectorAll('[data-toggle="slider-tab"]'),
          (elem) => {
            return new SliderTab(elem);
          }
        );
      }, 100);
    };
  });

  // useEffect(()=>{
  //   return ()=>{
  //     setTimeout(()=>{
  //       if(window.sessionStorage.getItem("ceb_user_id")){
  //         navigate("/Dashboard");
  //       }else{
  //         navigate("/auth/sign-in");
  //       }
  //     },1);
  //   };
  // },[navigate]);

  return (
    <Fragment>
      <span className="uisheet screen-darken"></span>
      <div
        className="header"
        style={{
          background: `url(${topImage})`,
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "95vh",
          position: "relative",
        }}
      >
        <div className="main-img">
          <div className="container">
            <h2 className="my-4">
              <span data-setting="app_name" className='text-white'>{appName}</span>
            </h2>
            <h4 className="text-white mb-5">
              Designed & Implemented by <b>Computer Section</b>
            </h4>
            <div className="d-flex justify-content-center align-items-center">
              <div>
                <Link
                  className="btn btn-light bg-white d-flex"
                  to="/auth/sign-in"
                >
                  <svg
                    width="22"
                    height="22"
                    className="me-1"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                  বোর্ড ড্যাশবোর্ড
                </Link>
              </div>
              <div className="ms-3">
                <Button target='_blank' bsPrefix="btn btn-light bg-white d-flex" href="https://web.comillaboard.gov.bd/">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" height="22" width="22"><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M3.75299 13.944v8.25h6v-6c0 -0.3979 0.15804 -0.7794 0.43931 -1.0607 0.2813 -0.2813 0.6629 -0.4393 1.0607 -0.4393h1.5c0.3978 0 0.7793 0.158 1.0607 0.4393 0.2813 0.2813 0.4393 0.6628 0.4393 1.0607v6h6v-8.25" strokeWidth="1.5"></path><path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" d="M0.752991 12.444 10.942 2.25499c0.1393 -0.13939 0.3047 -0.24997 0.4867 -0.32541 0.1821 -0.07544 0.3772 -0.11427 0.5743 -0.11427 0.1971 0 0.3922 0.03883 0.5742 0.11427 0.1821 0.07544 0.3475 0.18602 0.4868 0.32541L23.253 12.444" strokeWidth="1.5"></path></svg>
                  <span className="text-danger mx-2 fw-bold">ওয়েব</span>
                  <span>পোর্টাল</span>
                </Button>
              </div>

            </div>
          </div>
        </div>
        <Container>
          <Navbar expand="lg" variant="light" className={`nav iq-navbar top-1 rounded`}>
            <Container fluid className="navbar-inner">
              <div className="sidebar-toggle" data-toggle="sidebar" data-active="true">
                <i className="icon">
                  <svg width="20px" height="20px" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z" />
                  </svg>
                </i>
              </div>
              <Navbar.Brand href="/" className="mx-2 d-flex align-items-center">
                <Logo color={true} />
              </Navbar.Brand>
              <div className="search-input">
                <h4 className='text-primary'>
                  {appName}
                </h4>
              </div>
              <Navbar.Collapse id="navbarSupportedContent">
                <Nav as="ul" className="mb-2 ms-auto navbar-list mb-lg-0 align-items-center">
                  <Dropdown as="li" className="nav-item">
                    <Dropdown.Toggle as={CustomToggle} variant=" nav-link py-0 d-flex align-items-center gap-2" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-graduation-cap-icon lucide-graduation-cap"><path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z" /><path d="M22 10v6" /><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5" /></svg>
                      <span>শিক্ষার্থী</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <Dropdown.Item> <Link to="/tc/new-app">ছাড়পত্রের (TC) আবেদন</Link></Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item> <Link to="/">ফলাফল যাচাই</Link></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Dropdown as="li" className="nav-item">
                    <Dropdown.Toggle as={CustomToggle} variant=" nav-link py-0 d-flex align-items-center gap-2" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-school-icon lucide-school"><path d="M14 22v-4a2 2 0 1 0-4 0v4" /><path d="m18 10 3.447 1.724a1 1 0 0 1 .553.894V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7.382a1 1 0 0 1 .553-.894L6 10" /><path d="M18 5v17" /><path d="m4 6 7.106-3.553a2 2 0 0 1 1.788 0L20 6" /><path d="M6 5v17" /><circle cx="12" cy="9" r="2" /></svg>
                      <span>প্রতিষ্ঠান</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <Dropdown.Item> <Link to="/institute/establishment/application">স্থাপনের আবেদন</Link></Dropdown.Item>
                      <Dropdown.Item> <Link to="/institute/establishment/payment">আবেদন ফি প্রদান</Link></Dropdown.Item>
                      <Dropdown.Item> <Link to="/institute/establishment/payment">আবেদনের স্ট্যাটাস</Link></Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item> <Link to="/institute/class-start/application">পাঠদানের আবেদন</Link></Dropdown.Item>
                      <Dropdown.Item> <Link to="/institute/class-start/payment">আবেদন ফি প্রদান</Link></Dropdown.Item>
                      <Dropdown.Item> <Link to="/institute/class-start/payment">আবেদনের স্ট্যাটাস</Link></Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item> <Link to="/">ফলাফল যাচাই</Link></Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Container>
      </div>
      {/* <div className=" body-class-1 container">
        <aside
          className="mobile-offcanvas bd-aside card iq-document-card sticky-xl-top text-muted align-self-start mb-5 mt-n5"
          id="left-side-bar"
        >
          <div className="offcanvas-header p-0">
            <button className="btn-close float-end"></button>
          </div>
          <h2 className="h6 pb-2 border-bottom">Navigate Page</h2>
          <div className="small" id="elements-section">
            <ul className="list-unstyled mb-0">
              <li className="mt-2">
                <Button
                  variant=" d-inline-flex align-items-center "
                  onClick={() => setOpen(!open)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open}
                >
                  <i className="right-icon me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-18"
                      width="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </i>
                  Components
                </Button>
                <Collapse in={open}>
                  <ul
                    className="list-unstyled ps-3 elem-list"
                    id="components-collapse"
                    to="#components"
                  >
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#accordion"
                      >
                        Accordion
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#alerts"
                      >
                        Alerts
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#badge"
                      >
                        Badge
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#breadcrumb"
                      >
                        Breadcrumb
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#buttons"
                      >
                        Buttons
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#button-group"
                      >
                        Button Group
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#calendar"
                      >
                        Calendar
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#card"
                      >
                        Card
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#carousel"
                      >
                        Carousel
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#dropdowns"
                      >
                        Dropdowns
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#list-group"
                      >
                        List Group
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#modal"
                      >
                        Modal
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#navs"
                      >
                        Navs
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#navbar"
                      >
                        Navbar
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#off-canvas"
                      >
                        Off Canvas
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#pagination"
                      >
                        Pagination
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#popovers"
                      >
                        Popovers
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-item-center rounded"
                        href="#ribbon"
                      >
                        Ribbon
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#progress"
                      >
                        Progress
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#scrollspy"
                      >
                        Scrollspy
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#spinners"
                      >
                        Spinners
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#toasts"
                      >
                        Toasts
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#tooltips"
                      >
                        Tooltips
                      </Nav.Link>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li className="my-2">
                <Button
                  variant=" d-inline-flex align-items-center "
                  onClick={() => setOpen1(!open1)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open1}
                >
                  <i className="right-icon me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-18"
                      width="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </i>
                  Forms
                </Button>
                <Collapse in={open1}>
                  <ul
                    className="list-unstyled ps-3 "
                    id="forms-collapse"
                    to="#forms"
                  >
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#overview"
                      >
                        Overview
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#disabled-forms"
                      >
                        Disabled Forms
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#sizing"
                      >
                        Sizing
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#input-group"
                      >
                        Input Group
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#a-form-control"
                      >
                        Alertnate Input
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#floating-labels"
                      >
                        Floating Labels
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#a-floating-labels"
                      >
                        Alertnate Float Labels
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#toggle-btn"
                      >
                        Toggle Button
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#validation"
                      >
                        Validation
                      </Nav.Link>
                    </li>
                  </ul>
                </Collapse>
              </li>
              <li className="mb-2">
                <Button
                  variant=" d-inline-flex align-items-center "
                  onClick={() => setOpen2(!open2)}
                  aria-controls="example-collapse-text"
                  aria-expanded={open2}
                >
                  <i className="right-icon me-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="icon-18"
                      width="18"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      ></path>
                    </svg>
                  </i>
                  Contents
                </Button>
                <Collapse in={open2}>
                  <ul
                    className="list-unstyled ps-3 "
                    id="contents-collapse"
                    to="#content"
                  >
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#typography"
                      >
                        Typography
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#images"
                      >
                        Images
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#tables"
                      >
                        Tables
                      </Nav.Link>
                    </li>
                    <li>
                      <Nav.Link
                        className="d-inline-flex align-items-center rounded"
                        href="#figures"
                      >
                        Figures
                      </Nav.Link>
                    </li>
                  </ul>
                </Collapse>
              </li>
            </ul>
          </div>
        </aside>
        <div className="bd-cheatsheet container-fluid bg-trasprent mt-n5">
          <section id="components">
            <div className="iq-side-content sticky-xl-top">
              <Card className="">
                <Card.Body className="">
                  <h4 className="fw-bold">Components</h4>
                </Card.Body>
              </Card>
            </div>
            <Accordions />
            <Alerts />
            <Badges />
            <Breadcrumbs />
            <Buttons />
            <ButtonGroups />
            <Calenders />
            <Cards />
            <Carousels />
            <DropDowns />
            <ListGroups />
            <Modals />
            <Navs />
            <Navbars />
            <OffCanvass />
            <Paginations />
            <Popovers />
            <Progresss />
            <Scrollspys />
            <Spinnerss />
            <Toasts />
            <Tooltips />
          </section>
          <section id="forms">
            <div className="iq-side-content sticky-xl-top">
              <Card className="">
                <Card.Body className="">
                  <h4 className="fw-bold">Forms</h4>
                </Card.Body>
              </Card>
            </div>
            <Overview />
            <DisabledForms />
            <Sizings />
            <InputGroups />
            <AFormControls />
            <FloatingLables />
            <AFloatingLables />
            <ToggleBtns />
            <Validations />
          </section>
          <section id="content">
            <div className="iq-side-content sticky-xl-top">
              <Card className="">
                <Card.Body className="">
                  <h4 className="fw-bold">Contents</h4>
                </Card.Body>
              </Card>
            </div>
            <Typographys />
            <Images />
            <Tables />
            <Figures />
          </section>
        </div>
      </div>
      */}
      <div id="back-to-top" style={{ display: "none" }}>
        <Button size="xs" variant="primary  p-0 position-fixed top" href="#top">
          <svg
            width="30"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 15.5L12 8.5L19 15.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
        </Button>
      </div>
      <div className="footer fixed-bottom bg-primary">
        <Footer/>
      </div>
    </Fragment>
  )
}

export default Index;
