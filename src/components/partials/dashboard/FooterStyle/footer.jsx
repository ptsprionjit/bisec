import React from 'react'
import { Link } from 'react-router-dom'
import * as SettingSelector from "../../../../store/setting/selectors";
import { useSelector } from "react-redux";

import * as InputValidation from '../../../../views/partials/input_validation'

import { FaComputer } from "react-icons/fa6";

const Footer = () => {
    const appShortName = useSelector(SettingSelector.app_short_bn_name);
    const SOFTWARE_VERSION = import.meta.env.VITE_SOFTWARE_VERSION;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const curDate = new Date();
    curDate.setHours(curDate.getUTCHours() + 12);

    return (
        // <footer className="footer fixed-bottom bg-white">
        <footer className="footer m-0 p-0">
            <div className="footer-body">
                <ul className="left-panel list-inline m-0 p-0">
                    <li className="list-inline-item"><Link to={ceb_session?.ceb_user_id ? "/user/privacy-policy" : "/privacy-policy"}>গোপনীয়তা নীতিমালা</Link></li>
                    <li className="list-inline-item"><Link to={ceb_session?.ceb_user_id ? "/user/terms-of-service" : "/terms-of-service"}>সেবার নির্দেশাবলী</Link></li>
                </ul>
                <ul className="right-panel list-inline m-0 p-0 px-5">
                    <li className="list-inline-item">©{InputValidation.E2BDigit(curDate.getFullYear())}@</li>
                    <li className="list-inline-item">{appShortName + " -- "}</li>
                    <li className="list-inline-item">পরিকল্পনা ও বাস্তবায়নেঃ <FaComputer color="blue" /></li>
                    <li className="list-inline-item"><Link to="/"> {"কম্পিউটার শাখা -- "} </Link></li>
                    <li className="list-inline-item"><Link to="mailto: prionjit.it@gmail.com"> {"@প্রিয়ঞ্জিত -- "} </Link></li>
                    <li className="list-inline-item">সংস্করণ (Version): {InputValidation.E2BDigit(SOFTWARE_VERSION)}</li>
                </ul>
            </div>
        </footer>
    )
}

export default Footer
