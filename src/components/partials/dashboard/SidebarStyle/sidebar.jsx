import React, { useEffect, memo, Fragment } from 'react'
import { Link } from 'react-router-dom'
import VerticalNav from '../SidebarStyle/vertical-nav'

//scrollbar
import Scrollbar from "smooth-scrollbar";

// Import selectors & action from setting store
import * as SettingSelector from "../../../../store/setting/selectors";

// Redux Selector / Action
import { useSelector } from "react-redux";
import Logo from '../../components/logo';

const Sidebar = memo((props) => {
  const sidebarColor = useSelector(SettingSelector.sidebar_color);
  const sidebarHide = useSelector(SettingSelector.sidebar_show); // array
  const sidebarType = useSelector(SettingSelector.sidebar_type); // array
  const sidebarMenuStyle = useSelector(SettingSelector.sidebar_menu_style);
  const appShortName = useSelector(SettingSelector.app_short_name);

  const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

  const minisidebar = () => {
    document.getElementsByTagName("ASIDE")[0].classList.toggle("sidebar-mini");
  };

  useEffect(() => {
    Scrollbar.init(document.querySelector("#my-scrollbar"));

    window.addEventListener("resize", () => {
      const tabs = document.querySelectorAll(".nav");
      const sidebarResponsive = document.querySelector(
        '[data-sidebar="responsive"]'
      );
      if (window.innerWidth < 1025) {
        Array.from(tabs, (elem) => {
          if (
            !elem.classList.contains("flex-column") &&
            elem.classList.contains("nav-tabs") &&
            elem.classList.contains("nav-pills")
          ) {
            elem.classList.add("flex-column", "on-resize");
          }
          return elem.classList.add("flex-column", "on-resize");
        });
        if (sidebarResponsive !== null) {
          if (!sidebarResponsive.classList.contains("sidebar-mini")) {
            sidebarResponsive.classList.add("sidebar-mini", "on-resize");
          }
        }
      } else {
        Array.from(tabs, (elem) => {
          if (elem.classList.contains("on-resize")) {
            elem.classList.remove("flex-column", "on-resize");
          }
          return elem.classList.remove("flex-column", "on-resize");
        });
        if (sidebarResponsive !== null) {
          if (
            sidebarResponsive.classList.contains("sidebar-mini") &&
            sidebarResponsive.classList.contains("on-resize")
          ) {
            sidebarResponsive.classList.remove("sidebar-mini", "on-resize");
          }
        }
      }
    });
  });

  return (
    <Fragment>
      <aside className={` ${sidebarColor} ${sidebarType.join(" ")} ${sidebarMenuStyle} ${sidebarHide.join(" ") ? 'sidebar-none' : 'sidebar'} sidebar-base  `} data-sidebar="responsive">
        <div className="sidebar-header d-flex align-items-center justify-content-start">
          <Link to={ceb_session?.ceb_user_id ? "/dashboard" : "/"} className="navbar-brand">
            <Logo />
            <h4 className="logo-title text-sm"><span data-setting="app_short_name">{appShortName}</span></h4>
          </Link>
          <div className="sidebar-toggle" data-toggle="sidebar" data-active="true" onClick={minisidebar}>
            <i className="icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-arrow-left-icon lucide-arrow-left"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
            </i>
          </div>
        </div>
        <div className="pt-0 sidebar-body data-scrollbar" data-scroll="1" id="my-scrollbar">
          {/* sidebar-list class to be added after replace css */}
          <div className="sidebar-list navbar-collapse" id="sidebar">
            <VerticalNav />
          </div>
        </div>
        <div className="sidebar-footer"></div>
      </aside>
    </Fragment>
  )
})

export default Sidebar

