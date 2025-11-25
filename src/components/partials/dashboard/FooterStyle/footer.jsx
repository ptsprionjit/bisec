import React from 'react'
import { Link } from 'react-router-dom'
import * as SettingSelector from "../../../../store/setting/selectors";
import { useSelector } from "react-redux";

import * as InputValidation from '../../../../views/partials/input_validation'

import { FaComputer } from "react-icons/fa6";

const Footer = () => {
    const appShortName = useSelector(SettingSelector.app_short_bn_name);
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
                <div className="right-panel text-primary px-5">
                    ©{InputValidation.E2BDigit(curDate.getFullYear())}@<span data-setting="app_short_name">{appShortName + " -- "} </span> পরিকল্পনা ও বাস্তবায়নেঃ <FaComputer color="blue" /> <Link to="#"> {"কম্পিউটার শাখা -- "} </Link> <Link to="mailto: prionjit.it@gmail.com"> {"@প্রিয়ঞ্জিত -- "} </Link> সংস্করণ (Version): {InputValidation.E2BDigit(SOFTWARE_VERSION)}
                </div>
            </div>
        </footer>
    )
}

export default Footer
