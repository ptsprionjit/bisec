import React, { Fragment, useRef } from 'react';
import { useSelector } from "react-redux"

import { Row, Col, Button } from 'react-bootstrap';
import Card from '../../../../components/Card';

import styles from '../../../../assets/custom/css/bisec.module.css';
import Logo from '../../../../components/partials/components/logo';
import * as SettingSelector from '../../../../store/setting/selectors.ts';
import * as ValidationInput from '../../input_validation';

import { HandleFileView } from '../handlers/files';

const RecognitionPrint = ({ userData, recognitionFiles, setNavigateRecognitionPrint }) => {
    // useref Defination for Printing
    const printRef = useRef();
    const appName = useSelector(SettingSelector.app_bn_name);

    // Handle Print
    const handlePrint = async () => {
        const printContent = printRef.current.innerHTML;
        const printWindow = window.open('', '', 'fullscreen=yes');

        printWindow.document.write(`
        <html>
            <head>
                <title>Print</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
                <link href="https://fonts.maateen.me/siyam-rupali/font.css" rel="stylesheet">
                <style>
                    @page {
                        size: legal portrait !important;
                        margin: 0 !important;
                        padding: 0.25in 0.25in !important;
                        div, table, tr, th, td, p, span {
                            page-break-inside: avoid !important;
                        }
                        section {
                            page-break-after: always !important;
                        }
                    }
                    *{
                        font-family: 'Siyam Rupali', sans-serif !important;
                        color: #000000 !important;
                        font-weight: normal;
                    }
                    .print-wrap{
                        white-space: nowrap !important;
                    }
                    .no-print {
                        display: none !important;
                    }
                    .print-hide {
                        display: none !important;
                    }
                    .print-show {
                        display: block !important;
                    }
                </style>
            </head>
            <body>
                <div class="d-flex justify-content-center align-items-center">${printContent}</div>
                <script>
                    window.onload = function() {
                        window.print();
                        window.onafterprint = function() { 
                            window.close();
                        };
                    };
                </script>
            </body>
        </html>
        `);
        printWindow.document.close();
    };

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col ref={printRef} md={12}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center m-0 auth-card">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center table-responsive m-0 p-0'>
                            <table id="user-list-table" className="table table-bordered border-dark border-2 w-100 m-0 p-0">
                                <thead className='border-0'>
                                    <tr className='border-0 bg-transparent'>
                                        <th colSpan={6} className='border-0 text-center align-top text-wrap m-0 p-0 pt-4 pb-2'>
                                            <div className="d-flex border-bottom border-dark justify-content-center align-items-start w-100 gap-3">
                                                <Logo color={true} />
                                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                                    <h2 className="logo-title text-wrap text-center p-0 m-0 pb-2">{appName}</h2>
                                                    <h5 className="text-wrap text-center py-1">লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</h5>
                                                    <h6 className="text-lowercase text-wrap text-center py-1">web.comillaboard.gov.bd</h6>
                                                </div>
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className='border-0'>
                                        <th colSpan={6} className='border-0 text-center align-top text-wrap m-0 p-0 py-1'>
                                            <h5 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>একাডেমিক স্বীকৃতি/স্বীকৃতি নবায়নের আবেদনপত্র</h5>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>আবেদনের তথ্য</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্বীকৃতির পর্যায়</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-success"}>{userData.bn_recog_status}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পেমেন্টের বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-danger"}>{userData.bn_payment}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-danger"}>{userData.bn_app_status}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>পূর্ববর্তী স্বীকৃতি/পাঠদান অনুমতির তথ্য</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্মারক নম্বর</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.prev_ref)}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্মারকের তারিখ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.ref_date)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অনুমতির শুরুর তারিখ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.ref_start)}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মেয়াদোত্তীর্ণের তারিখ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.ref_end)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>প্রতিষ্ঠানের তথ্য</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_user}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (ইংরেজি)</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-uppercase text-center text-dark"}>{userData.en_user}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ইমেইল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.inst_email}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.inst_mobile)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের ধরণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_coed}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মাধ্যম</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_version} মাধ্যম</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের পর্যায়</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_status}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের অবস্থান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        {userData.inst_region === '01' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সিটি কর্পোরেশন এলাকা</span>
                                        </td>}
                                        {userData.inst_region === '02' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পৌরসভা এলাকা</span>
                                        </td>}
                                        {userData.inst_region === '03' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মফস্বল এলাকা</span>
                                        </td>}
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেলা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_dist}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>উপজেলা/থানা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_uzps}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ঠিকানা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-uppercase text-left text-dark"}>{userData.inst_address}, {userData.en_uzps}, {userData.en_dist}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>জমির বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট জমি</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_land)} শতাংশ</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারিকৃত জমি</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.mutation_land)} শতাংশ</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সর্বশেষ খাজনার বছর</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.land_tax_year)}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দাখিলা নম্বর</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.land_tax_number)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>তহবিলের বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সাধারণ তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.general_fund)} টাকা</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সংরক্ষিত তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.reserved_fund)} টাকা</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>কমিটির বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কমিটির ধরণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {userData.committee_type === '01' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নির্বাহী কমিটি</span>}
                                            {userData.committee_type === '02' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>গর্ভর্নিং বডি</span>}
                                            {userData.committee_type === '03' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ম্যানেজিং কমিটি</span>}
                                            {userData.committee_type === '04' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এডহক কমিটি</span>}
                                            {userData.committee_type === '05' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সরকারি বা সংস্থা পরিচালিত প্রতিষ্ঠানের গর্ভর্নিং বডি/ম্যানেজিং কমিটি</span>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কমিটির মেয়াদ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.committee_expiry)}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>অবকাঠামোগত বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ভবন সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাকাঃ {ValidationInput.E2BDigit(userData.total_concrete_building)} টি, অন্যান্যঃ {ValidationInput.E2BDigit(userData.total_other_building)} টি</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কক্ষের বিবরণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <p className={styles.SiyamRupaliFont + " text-center text-dark p-0 m-0"}>মোটঃ {ValidationInput.E2BDigit(userData.total_room)} টি, ব্যবহৃতঃ {ValidationInput.E2BDigit(userData.used_room)} টি, উদ্বৃত্তঃ {ValidationInput.E2BDigit(userData.researved_room)} টি, বিদ্যুৎ সংযোগকৃতঃ {ValidationInput.E2BDigit(userData.electricity_connection)} টি</p>
                                            <p className={styles.SiyamRupaliFont + " text-center text-dark p-0 m-0"}>মোট আয়তনঃ {ValidationInput.E2BDigit(userData.area_room)} বর্গফুট</p>

                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>টয়লেট সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_toilet)} টি</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>টিউবওয়েলের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_tubewell)} টি</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>গ্রন্থাগারের সংখ্যা ও আয়তন</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_library)} টি, {ValidationInput.E2BDigit(userData.area_library)} বর্গফুট</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট বই</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_books)} টি</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>বিজ্ঞানাগারের সংখ্যা ও আয়তন</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_labratory)} টি, {ValidationInput.E2BDigit(userData.area_labratory)} বর্গফুট</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>বিজ্ঞানাগারের দ্রব্যাদির মূল্য</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_equipment_price)} টাকা</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কম্পিউটার ল্যাবের সংখ্যা ও আয়তন</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.computer_room)} টি, {ValidationInput.E2BDigit(userData.area_computer_room)} বর্গফুট</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট কম্পিউটার</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(userData.total_computer)} টি</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>শিক্ষার্থীদের তথ্য</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট অনুমোদিত শিক্ষার্থী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                            {ValidationInput.E2BDigit(userData.total_permitted_student)} জন
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট নিবন্ধিত শিক্ষার্থী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                            {ValidationInput.E2BDigit(Number(userData.six_science_total) + Number(userData.six_humanities_total) + Number(userData.six_business_total) + Number(userData.seven_science_total) + Number(userData.seven_humanities_total) + Number(userData.seven_business_total) + Number(userData.eight_science_total) + Number(userData.eight_humanities_total) + Number(userData.eight_business_total) + Number(userData.nine_science_total) + Number(userData.nine_humanities_total) + Number(userData.nine_business_total) + Number(userData.ten_science_total) + Number(userData.ten_humanities_total) + Number(userData.ten_business_total) + Number(userData.eleven_science_total) + Number(userData.eleven_humanities_total) + Number(userData.eleven_business_total) + Number(userData.twelve_science_total) + Number(userData.twelve_humanities_total) + Number(userData.twelve_business_total))} জন
                                        </td>
                                    </tr>
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '11' || userData.recog_inst_status === '20') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ষষ্ট শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                শাখাঃ {ValidationInput.E2BDigit(userData.six_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.six_science_total)} জন
                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.six_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.six_humanities_total)} জন; */}
                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.six_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.six_business_total)} জন */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সপ্তম শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                শাখাঃ {ValidationInput.E2BDigit(userData.seven_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.seven_science_total)} জন
                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.seven_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.seven_humanities_total)} জন; */}
                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.seven_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.seven_business_total)} জন */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অষ্টম শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                শাখাঃ {ValidationInput.E2BDigit(userData.eight_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.eight_science_total)} জন
                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.eight_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.eight_humanities_total)} জন; */}
                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.eight_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.eight_business_total)} জন */}
                                            </td>
                                        </tr>
                                    </>}
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নবম শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(userData.nine_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.nine_science_total)} জন
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.nine_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.nine_humanities_total)} জন
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.nine_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.nine_business_total)} জন
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দশম শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(userData.ten_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.ten_science_total)} জন
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.ten_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.ten_humanities_total)} জন
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.ten_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.ten_business_total)} জন
                                                </>}
                                            </td>
                                        </tr>
                                    </>}
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>একাদশ শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(userData.eleven_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.eleven_science_total)} জন
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.eleven_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.eleven_humanities_total)} জন
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.eleven_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.eleven_business_total)} জন
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দ্বাদশ শ্রেণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(userData.six_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(userData.twelve_science_total)} জন
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(userData.twelve_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.twelve_humanities_total)} জন
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(userData.twelve_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(userData.six_business_total)} জন
                                                </>}
                                            </td>
                                        </tr>
                                    </>}
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>পরীক্ষার তথ্য</h6>
                                        </th>
                                    </tr>
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '11' || userData.recog_inst_status === '20') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(userData.jsc1_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc1_science_passed) / Number(userData.jsc1_science_appeared) * 100).toFixed(2))}%</p>
                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc1_humanities_passed) / Number(userData.jsc1_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc1_business_passed) / Number(userData.jsc1_business_appeared) * 100).toFixed(2))}%</p> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(userData.jsc2_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc2_science_passed) / Number(userData.jsc2_science_appeared) * 100).toFixed(2))}%</p>
                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc2_humanities_passed) / Number(userData.jsc2_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc2_business_passed) / Number(userData.jsc2_business_appeared) * 100).toFixed(2))}%</p> */}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(userData.jsc3_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc3_science_passed) / Number(userData.jsc3_science_appeared) * 100).toFixed(2))}%</p>
                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc3_humanities_passed) / Number(userData.jsc3_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.jsc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.jsc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.jsc3_business_passed) / Number(userData.jsc3_business_appeared) * 100).toFixed(2))}%</p> */}
                                            </td>
                                        </tr>
                                    </>}
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(userData.ssc1_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc1_science_passed) / Number(userData.ssc1_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc1_humanities_passed) / Number(userData.ssc1_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc1_business_passed) / Number(userData.ssc1_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(userData.ssc2_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc2_science_passed) / Number(userData.ssc2_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc2_humanities_passed) / Number(userData.ssc2_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc2_business_passed) / Number(userData.ssc2_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(userData.ssc3_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc3_science_passed) / Number(userData.ssc3_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc3_humanities_passed) / Number(userData.ssc3_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.ssc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.ssc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.ssc3_business_passed) / Number(userData.ssc3_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                    </>}
                                    {(!userData?.recog_inst_status || userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && <>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(userData.hsc1_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc1_science_passed) / Number(userData.hsc1_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc1_humanities_passed) / Number(userData.hsc1_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc1_business_passed) / Number(userData.hsc1_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(userData.hsc2_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc2_science_passed) / Number(userData.hsc2_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc2_humanities_passed) / Number(userData.hsc2_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc2_business_passed) / Number(userData.hsc2_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(userData.hsc3_exam_year)}</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {(userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc3_science_passed) / Number(userData.hsc3_science_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc3_humanities_passed) / Number(userData.hsc3_humanities_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                                {(userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07') && <>
                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(userData.hsc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(userData.hsc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(userData.hsc3_business_passed) / Number(userData.hsc3_business_appeared) * 100).toFixed(2))}%</p>
                                                </>}
                                            </td>
                                        </tr>
                                    </>}

                                    <tr className='print-hide'>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>ডকুমেন্ট সংযুক্তি</h6>
                                        </th>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্বীকৃতি/পাঠদানের আদেশ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.prev_order && String(recognitionFiles.prev_order.name).toLocaleLowerCase() === 'prev_order.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.prev_order, recognitionFiles.prev_order.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>পূর্ববর্তী স্বীকৃতি/পাঠদানের আদেশ</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সাধারণ তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.general_fund_details && String(recognitionFiles.general_fund_details.name).toLocaleLowerCase() === 'general_fund_details.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.general_fund_details, recognitionFiles.general_fund_details.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সাধারণ তহবিলের বিবরণী</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সংরক্ষিত তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.reserved_fund_details && String(recognitionFiles.reserved_fund_details.name).toLocaleLowerCase() === 'reserved_fund_details.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.reserved_fund_details, recognitionFiles.reserved_fund_details.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সংরক্ষিত তহবিলের বিবরণী</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ক্লাস রুটিন</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.class_routine && String(recognitionFiles.class_routine.name).toLocaleLowerCase() === 'class_routine.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.class_routine, recognitionFiles.class_routine.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ক্লাস রুটিন (সর্বশেষ)</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জমির দলিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.mutation_details && String(recognitionFiles.mutation_details.name).toLocaleLowerCase() === 'mutation_details.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.mutation_details, recognitionFiles.mutation_details.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জমির দলিল</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি ও খাজনা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.dakhila_details && String(recognitionFiles.dakhila_details.name).toLocaleLowerCase() === 'dakhila_details.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.dakhila_details, recognitionFiles.dakhila_details.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নামজারি খতিয়ান ও খাজনার দাখিলা</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কমিটির স্মারক</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.committee_order && String(recognitionFiles.committee_order.name).toLocaleLowerCase() === 'committee_order.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.committee_order, recognitionFiles.committee_order.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সর্বশেষ কমিটির স্মারক</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>শিক্ষার্থী ভর্তির অনুমতি</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {recognitionFiles.student_order && String(recognitionFiles.student_order.name).toLocaleLowerCase() === 'student_order.pdf' && <Button onClick={() => HandleFileView(recognitionFiles.student_order, recognitionFiles.student_order.name).toLocaleLowerCase()} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ভর্তির অনুমতির স্মারক</span></Button>}
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap py-1 m-0'>
                                            <i><small className={styles.SiyamRupaliFont + " text-center text-primary"}>কম্পিউটার সিস্টেমে তৈরিকৃত আবেদনে কোন স্বাক্ষরের প্রয়োজন নাই!</small></i>
                                        </th>
                                    </tr>
                                </tfoot>
                            </table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center m-0 py-5 auth-card">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-5'>
                                <Button onClick={() => setNavigateRecognitionPrint(false)} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>
                                <Button onClick={handlePrint} className='flex-fill' type="button" variant="btn btn-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    );
};

export default RecognitionPrint;