import React from 'react'
import { Link } from 'react-router-dom'
import * as SettingSelector from "../../../../store/setting/selectors";
import { useSelector } from "react-redux";

import * as InputValidation from '../../../../views/partials/input_validation'

const Footer = () => {
    const appShortName = useSelector(SettingSelector.app_short_name);
    const SOFTWARE_VERSION = import.meta.env.VITE_SOFTWARE_VERSION;

    const curDate = new Date();
    curDate.setHours(curDate.getUTCHours() + 12);

    return (
        // <footer className="footer fixed-bottom bg-white">
        <footer className="footer">
            <div className="footer-body">
                <ul className="left-panel list-inline mb-0 p-0">
                    <li className="list-inline-item"><Link to="/public/privacy-policy">গোপনীয়তা নীতিমালা</Link></li>
                    <li className="list-inline-item"><Link to="/public/terms-of-service">সেবার নির্দেশাবলী</Link></li>
                </ul>
                <div className="right-panel">
                    ©{InputValidation.E2BDigit(curDate.getFullYear())} <span data-setting="app_short_name">{appShortName}</span>, Designed & Implemented by <span className="text-gray"><svg width="15" height="15" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M384 96l0 224L64 320 64 96l320 0zM64 32C28.7 32 0 60.7 0 96L0 320c0 35.3 28.7 64 64 64l117.3 0-10.7 32L96 416c-17.7 0-32 14.3-32 32s14.3 32 32 32l256 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-74.7 0-10.7-32L384 384c35.3 0 64-28.7 64-64l0-224c0-35.3-28.7-64-64-64L64 32zm464 0c-26.5 0-48 21.5-48 48l0 352c0 26.5 21.5 48 48 48l64 0c26.5 0 48-21.5 48-48l0-352c0-26.5-21.5-48-48-48l-64 0zm16 64l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16s7.2-16 16-16zm-16 80c0-8.8 7.2-16 16-16l32 0c8.8 0 16 7.2 16 16s-7.2 16-16 16l-32 0c-8.8 0-16-7.2-16-16zm32 160a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" /></svg></span> <Link to="#"> Computer Section </Link> <Link to="mailto: prionjit.it@gmail.com"> @prionjit </Link> Version: {SOFTWARE_VERSION}
                </div>
            </div>
        </footer>
    )
}

export default Footer
