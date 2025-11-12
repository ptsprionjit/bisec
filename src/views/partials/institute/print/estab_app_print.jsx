import React, { useRef, Fragment } from 'react'
import { useSelector } from "react-redux"

import { Row, Col, Button, Card } from 'react-bootstrap'

import styles from '../../../../assets/custom/css/bisec.module.css'

import Logo from '../../../../components/partials/components/logo'
import * as SettingSelector from '../../../../store/setting/selectors.ts'

import { HandleFileView } from '../handlers/files'

import * as ValidationInput from '../../input_validation'

const EstbAppPrint = ({
    navigateBuildPrint, setNavigateBuildPrint, handleSetNavigateBuildUpdate, buildPrintData, estbFiles
}) => {
    if (!navigateBuildPrint) return null;

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
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className="table-responsive">
                                <table id="user-list-table" className="table table-bordered">
                                    <thead className='border-0'>
                                        <tr className='border-0 bg-transparent'>
                                            <th colSpan={6} className='border-0 text-center align-top text-wrap m-0 p-0 pt-4 pb-2'>
                                                <div className="d-flex border-bottom border-4 justify-content-center align-items-start w-100 gap-3">
                                                    <Logo color={true} />
                                                    <div className='d-flex flex-column justify-content-center align-items-center'>
                                                        <h2 className="logo-title text-wrap text-center p-0 m-0 pb-2">{appName}</h2>
                                                        <h5 className="text-wrap text-center py-1">লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</h5>
                                                        <h6 className="text-lowercase text-wrap text-center py-1">web.comillaboard.gov.bd</h6>
                                                    </div>
                                                </div>
                                            </th>
                                        </tr>
                                        <tr className='border-0 bg-transparent'>
                                            <th colSpan={6} className='border-0 text-center align-top text-wrap m-0 p-0 py-2'>
                                                <p className={styles.SiyamRupaliFont + " fs-5 text-center text-uppercase text-decoration-underline text-dark"}>নতুন প্রতিষ্ঠান স্থাপনের আবেদনপত্র</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap py-2 m-0'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>আবেদনের তথ্য</h6>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারীর নাম</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.applicant_name}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারীর মোবাইল</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.applicant_mobile)}</span>
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
                                                <span className={styles.SiyamRupaliFont + ` text-center ${buildPrintData.id_payment === '03' ? 'text-success' : 'text-danger'}`}>{buildPrintData.bn_payment}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + ` text-center ${buildPrintData.app_status === '17' ? 'text-success' : 'text-primary'}`}>{buildPrintData.bn_app_status}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>প্রতিষ্ঠানের তথ্য</h6>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                            </th>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_bn_name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (ইংরেজি)</span>
                                            </th>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_en_name}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তি নামের প্রতিষ্ঠান</span>
                                            </th>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.institute_named === '01' ? 'হ্যাঁ' : 'না'}</span>
                                            </td>
                                        </tr>
                                        {buildPrintData.institute_named === '01' && <>
                                            <tr>
                                                <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                    <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>ব্যক্তির তথ্য (নামীয় প্রতিষ্ঠানের ক্ষেত্রে)</h6>
                                                </th>
                                            </tr>
                                            <tr>
                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নাম</span>
                                                </th>
                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                </td>
                                                <td className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_founder_name}</span>
                                                </td>
                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                                </th>
                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                </td>
                                                <td className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_founder_mobile)}</span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এনআইডি নম্বর</span>
                                                </th>
                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                </td>
                                                <td className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_founder_nid)}</span>
                                                </td>
                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জন্মতারিখ</span>
                                                </th>
                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                </td>
                                                <td className='text-left align-top text-wrap p-2 m-0'>
                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_founder_dob)}</span>
                                                </td>
                                            </tr>
                                        </>}
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>প্রতিষ্ঠানের বিস্তারিত বিবরণী</h6>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ইমেইল</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_email}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_mobile)}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের ধরণ</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_coed}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মাধ্যম</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_version} মাধ্যম</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের পর্যায়</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_status}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের অবস্থান</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_region === '01' ? 'সিটি কর্পোরেশন এলাকা' : buildPrintData.inst_region === '02' ? 'পৌরসভা এলাকা' : 'মফস্বল এলাকা'}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিকটবর্তী প্রতিষ্ঠানের দূরত্ব</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_distance)} কিঃমিঃ</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠান এলাকার জনসংখ্যা</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_population)} জন</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেলা</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_dist}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>উপজেলা/থানা</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_uzps}</span>
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
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_address}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>জমির বিবরণী</h6>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মৌজার নাম ও নম্বর</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_mouza_name}-{ValidationInput.E2BDigit(buildPrintData.inst_mouza_number)}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খতিয়ানের নাম ও নম্বর</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.en_khatiyan}-{ValidationInput.E2BDigit(buildPrintData.inst_khatiyan_number)}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জমির পরিমাণ (শতক)</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_land)}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খাজনার দাখিলা ও সন</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(buildPrintData.inst_ltax_num)} ({ValidationInput.E2BDigit(buildPrintData.inst_ltax_year)})</span>
                                            </td>
                                        </tr>
                                        <tr className='print-hide'>
                                            <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary"}>ডকুমেন্ট সংযুক্তি</h6>
                                            </th>
                                        </tr>
                                        {buildPrintData.institute_named === '01' && <tr className='print-hide'>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তির বিবরণী</span>
                                            </th>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                {estbFiles.founder_details && String(estbFiles.founder_details.name).toLocaleLowerCase() === 'founder_details.pdf' && <Button onClick={() => HandleFileView(estbFiles.founder_details)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ব্যক্তির বিবরণী (নামীয় প্রতিষ্ঠান)</span></Button>}
                                            </td>
                                        </tr>}
                                        <tr className='print-hide'>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারী/গণের বিবরণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.applicant_details && String(estbFiles.applicant_details.name).toLocaleLowerCase() === 'applicant_details.pdf' && <Button onClick={() => HandleFileView(estbFiles.applicant_details)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>আবেদনকারীগণের বিবরণী</span></Button>}
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদন ফর্ম</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.application_form && String(estbFiles.application_form.name).toLocaleLowerCase() === 'application_form.pdf' && <Button onClick={() => HandleFileView(estbFiles.application_form)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ফর্ম (ক-১/ক-২)</span></Button>}
                                            </td>
                                        </tr>
                                        <tr className='print-hide'>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জমির বিবরণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.land_details && String(estbFiles.land_details.name).toLocaleLowerCase() === 'land_details.pdf' && <Button onClick={() => HandleFileView(estbFiles.land_details)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জমির বিবরণী</span></Button>}
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খাজনার দাখিলা</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.ltax_details && String(estbFiles.ltax_details.name).toLocaleLowerCase() === 'ltax_details.pdf' && <Button onClick={() => HandleFileView(estbFiles.ltax_details)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>খাজনার বিবরণী</span></Button>}
                                            </td>
                                        </tr>
                                        <tr className='print-hide'>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দূরত্বের সনদ</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.distance_cert && String(estbFiles.distance_cert.name).toLocaleLowerCase() === 'distance_cert.pdf' && <Button onClick={() => HandleFileView(estbFiles.distance_cert)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>দূরত্বের সনদ</span></Button>}
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জনসংখ্যার সনদ</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.population_cert && String(estbFiles.population_cert.name).toLocaleLowerCase() === 'population_cert.pdf' && <Button onClick={() => HandleFileView(estbFiles.population_cert)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জনসংখ্যার সনদ</span></Button>}
                                            </td>
                                        </tr>
                                        <tr className='print-hide'>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অঙ্গীকারনামা ফর্ম</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.declare_form && String(estbFiles.declare_form.name).toLocaleLowerCase() === 'declare_form.pdf' && <Button onClick={() => HandleFileView(estbFiles.declare_form)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>অঙ্গীকারনামা ফর্ম</span></Button>}
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্থাপনের যৌক্তিকতার বিবরণী</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                {estbFiles.feasibility_details && String(estbFiles.feasibility_details.name).toLocaleLowerCase() === 'feasibility_details.pdf' && <Button onClick={() => HandleFileView(estbFiles.feasibility_details)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>স্থাপনের যৌক্তিকতার বিবরণী</span></Button>}
                                            </td>
                                        </tr>
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap py-2 m-0'>
                                                <i><small className={styles.SiyamRupaliFont + " text-center text-dark"}>কম্পিউটার সিস্টেমে তৈরিকৃত আবেদনে কোন স্বাক্ষরের প্রয়োজন নাই!</small></i>
                                            </th>
                                        </tr>
                                    </tfoot>
                                </table>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigateBuildPrint && <Button onClick={() => setNavigateBuildPrint(false)} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>}
                                <Button onClick={handlePrint} className='flex-fill' type="button" variant="btn btn-primary">প্রিন্ট করুন</Button>
                                {(buildPrintData.id_payment !== '03' || buildPrintData.proc_status === '12') && <Button onClick={handleSetNavigateBuildUpdate} className='flex-fill' type="button" variant="btn btn-success">আপডেট করুন</Button>}
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>)
}

export default EstbAppPrint;