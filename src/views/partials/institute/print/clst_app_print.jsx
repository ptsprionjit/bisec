import React, { useRef, Fragment } from 'react'

import { Row, Col, Button, Card } from 'react-bootstrap'

const ClassStartAppPrint = ({
    navigateClassStartPrint, handleResetNavigateClassStartPrint, appName, Logo, buildPrintData, classStartPrintData, handleFileView, styles, estbFiles, classFiles, handleSetNavigateClassStartUpdate
}) => {
    if (!navigateClassStartPrint) return null;

    // useref Defination for Printing
    const printRef = useRef();

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
                <Col ref={printRef} md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center m-0 auth-card">
                        {/* <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            <Link to="/institute/establishment/payment" onClick={() => handleResetNavigateClassStartPrint()} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠানের পাঠদানের আবেদনপত্র</h4>
                        </Card.Header> */}
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
                                            <h5 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠানের পাঠদানের আবেদনপত্র</h5>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap pb-2 m-0'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>আবেদনের তথ্য</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাঠদানের পর্যায়</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.bn_status}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পেমেন্টের বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.bn_payment}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.bn_app_status}</span>
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
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_bn_name}</span>
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
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_en_name}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তি নামের প্রতিষ্ঠান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.institute_named === '01' ? 'হ্যাঁ' : 'না'}</span>
                                        </td>
                                    </tr>
                                    {buildPrintData.institute_named === '01' && <>
                                        <tr>
                                            <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>ব্যক্তির তথ্য (নামীয় প্রতিষ্ঠানের ক্ষেত্রে)</h6>
                                            </th>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নাম</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_founder_name}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_founder_mobile}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এনআইডি নম্বর</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_founder_nid}</span>
                                            </td>
                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জন্মতারিখ</span>
                                            </th>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                            </td>
                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_founder_dob}</span>
                                            </td>
                                        </tr>
                                    </>}
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>প্রতিষ্ঠানের বিস্তারিত বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ইমেইল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_email}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_mobile}</span>
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
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_coed}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মাধ্যম</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
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
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_status}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের অবস্থান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        {buildPrintData.inst_region === '01' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সিটি কর্পোরেশন এলাকা</span>
                                        </td>}
                                        {buildPrintData.inst_region === '02' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পৌরসভা এলাকা</span>
                                        </td>}
                                        {buildPrintData.inst_region === '03' && <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মফস্বল এলাকা</span>
                                        </td>}
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিকটবর্তী প্রতিষ্ঠানের দূরত্ব</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_distance} কিঃমিঃ</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠান এলাকার জনসংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_population} জন</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেলা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_dist}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>উপজেলা/থানা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
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
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_address}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>জমির বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মৌজা (নাম ও নম্বর)</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_mouza_name} ({buildPrintData.inst_mouza_number})</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খতিয়ান (নাম ও নম্বর)</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.en_khatiyan} ({buildPrintData.inst_khatiyan_number})</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি মৌজা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.khatiyan_mouja}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি খতিয়ান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.khatiyan_mutation} ({buildPrintData.inst_khatiyan_number})</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জমির পরিমাণ (শতক)</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.khatiyan_total}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>হাল দাখিলা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.tax_receipt}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>অবকাঠামোগত বিবরণী</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>শ্রেণীকক্ষের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.class_room}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অফিস কক্ষের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.office_room}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ওয়াশরুমের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.toilet_room}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কমনরুমের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.common_room}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>গ্রন্থাগার সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.library_room}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কম্পিউটার ল্যাব সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.computer_room}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>বই এর সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.total_books}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কম্পিউটারের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.total_computer}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>বিজ্ঞানাগারের সংখ্যা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.khatiyan_mutation}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}> ব্যক্তি তহবিলের পরিমাণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.founder_amount}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সাধারণ তহবিলের পরিমাণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.general_fund}</span>
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}> সংরক্ষিত তহবিলের পরিমাণ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classStartPrintData.reserved_fund}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>প্রতিষ্ঠানের আদেশ</h6>
                                        </th>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্থাপন</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classStartPrintData.ref_build_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {classStartPrintData.ref_build_js} ({classStartPrintData.date_build_js}), </span>}
                                            {classStartPrintData.ref_build_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {classStartPrintData.ref_build_ss} ({classStartPrintData.date_build_ss}), </span>}
                                            {classStartPrintData.ref_build_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিক{classStartPrintData.ref_build_hs} ({classStartPrintData.date_build_hs})</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাঠদান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classStartPrintData.ref_commence_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {classStartPrintData.ref_commence_js} ({classStartPrintData.date_commence_js}), </span>}
                                            {classStartPrintData.ref_commence_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {classStartPrintData.ref_commence_ss} ({classStartPrintData.date_commence_ss}), </span>}
                                            {classStartPrintData.ref_commence_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিকঃ{classStartPrintData.ref_commence_hs} ({classStartPrintData.date_commence_hs})</span>}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্বীকৃতি</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classStartPrintData.ref_recognition_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {classStartPrintData.ref_recognition_js} ({classStartPrintData.date_recognition_js}), </span>}
                                            {classStartPrintData.ref_recognition_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {classStartPrintData.ref_recognition_ss} ({classStartPrintData.date_recognition_ss}), </span>}
                                            {classStartPrintData.ref_recognition_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিকঃ {classStartPrintData.ref_recognition_hs} ({classStartPrintData.date_recognition_hs})</span>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>ডকুমেন্ট সংযুক্তি</h6>
                                        </th>
                                    </tr>
                                    {buildPrintData.institute_named === '01' && <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তির বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.founder_details && String(estbFiles.founder_details.name).toLocaleLowerCase() === 'founder_details.pdf' && <Button onClick={() => handleFileView('founder_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ব্যক্তির বিবরণী (নামীয় প্রতিষ্ঠান)</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তি কর্তৃক জমাকৃত তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.named_fund_details && String(classFiles.named_fund_details.name).toLocaleLowerCase() === 'named_fund_details.pdf' && <Button onClick={() => handleFileView('named_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ব্যক্তি কর্তৃক জমাকৃত তহবিল</span></Button>}
                                        </td>
                                    </tr>}
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারী/গণের বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.applicant_details && String(estbFiles.applicant_details.name).toLocaleLowerCase() === 'applicant_details.pdf' && <Button onClick={() => handleFileView('applicant_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>আবেদনকারীগণের সংক্ষিপ্ত বিবরণ</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদন ফর্ম</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.application_form && String(estbFiles.application_form.name).toLocaleLowerCase() === 'application_form.pdf' && <Button onClick={() => handleFileView('application_form')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ফর্ম (ক-১/ক-২)</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জমির বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.land_details && String(estbFiles.land_details.name).toLocaleLowerCase() === 'land_details.pdf' && <Button onClick={() => handleFileView('land_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জমির দলিল</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খাজনার দাখিলা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.ltax_details && String(estbFiles.ltax_details.name).toLocaleLowerCase() === 'ltax_details.pdf' && <Button onClick={() => handleFileView('ltax_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>খাজনার দাখিলা</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দূরত্বের সনদ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.distance_cert && String(estbFiles.distance_cert.name).toLocaleLowerCase() === 'distance_cert.pdf' && <Button onClick={() => handleFileView('distance_cert')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>দূরত্বের সনদ</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জনসংখ্যার সনদ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.population_cert && String(estbFiles.population_cert.name).toLocaleLowerCase() === 'population_cert.pdf' && <Button onClick={() => handleFileView('population_cert')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জনসংখ্যার সনদ</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অঙ্গীকারনামা ফর্ম</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.declare_form && String(estbFiles.declare_form.name).toLocaleLowerCase() === 'declare_form.pdf' && <Button onClick={() => handleFileView('declare_form')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>অঙ্গীকারনামা</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্থাপনের যৌক্তিকতার বিবরণী</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {estbFiles.feasibility_details && String(estbFiles.feasibility_details.name).toLocaleLowerCase() === 'feasibility_details.pdf' && <Button onClick={() => handleFileView('feasibility_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>স্থাপনের যৌক্তিকতা</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি খতিয়ান</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.mutation_details && String(classFiles.mutation_details.name).toLocaleLowerCase() === 'mutation_details.pdf' && <Button onClick={() => handleFileView('mutation_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নামজারি খতিয়ান</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>হাল দাখিলা</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.dakhila_details && String(classFiles.dakhila_details.name).toLocaleLowerCase() === 'dakhila_details.pdf' && <Button onClick={() => handleFileView('dakhila_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>হাল দাখিলা</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সাধারণ তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.general_fund_details && String(classFiles.general_fund_details.name).toLocaleLowerCase() === 'general_fund_details.pdf' && <Button onClick={() => handleFileView('general_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সাধারণ তহবিলের প্রমাণক</span></Button>}
                                        </td>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সংরক্ষিত তহবিল</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.reserved_fund_details && String(classFiles.reserved_fund_details.name).toLocaleLowerCase() === 'reserved_fund_details.pdf' && <Button onClick={() => handleFileView('reserved_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সংরক্ষিত তহবিলের প্রমাণক</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্থাপনের আদেশ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.order_build_js && String(classFiles.order_build_js.name).toLocaleLowerCase() === 'order_build_js.pdf' && <Button onClick={() => handleFileView('order_build_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক স্থাপন</span></Button>}
                                            {classFiles.order_build_ss && String(classFiles.order_build_ss.name).toLocaleLowerCase() === 'order_build_ss.pdf' && <Button onClick={() => handleFileView('order_build_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক স্থাপন</span></Button>}
                                            {classFiles.order_build_hs && String(classFiles.order_build_hs.name).toLocaleLowerCase() === 'order_build_hs.pdf' && <Button onClick={() => handleFileView('order_build_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক স্থাপন</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাঠদানের আদেশ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.order_class_js && String(classFiles.order_class_js.name).toLocaleLowerCase() === 'order_class_js.pdf' && <Button onClick={() => handleFileView('order_class_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক পাঠদান</span></Button>}
                                            {classFiles.order_class_ss && String(classFiles.order_class_ss.name).toLocaleLowerCase() === 'order_class_ss.pdf' && <Button onClick={() => handleFileView('order_class_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক পাঠদান</span></Button>}
                                            {classFiles.order_class_hs && String(classFiles.order_class_hs.name).toLocaleLowerCase() === 'order_class_hs.pdf' && <Button onClick={() => handleFileView('order_class_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক পাঠদান</span></Button>}
                                        </td>
                                    </tr>
                                    <tr className='print-hide'>
                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্বীকৃতির আদেশ</span>
                                        </th>
                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                        </td>
                                        <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                            {classFiles.order_recognition_js && String(classFiles.order_recognition_js.name).toLocaleLowerCase() === 'order_recognition_js.pdf' && <Button onClick={() => handleFileView('order_recognition_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক স্বীকৃতি</span></Button>}
                                            {classFiles.order_recognition_ss && String(classFiles.order_recognition_ss.name).toLocaleLowerCase() === 'order_recognition_ss.pdf' && <Button onClick={() => handleFileView('order_recognition_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক স্বীকৃতি</span></Button>}
                                            {classFiles.order_recognition_hs && String(classFiles.order_recognition_hs.name).toLocaleLowerCase() === 'order_recognition_hs.pdf' && <Button onClick={() => handleFileView('order_recognition_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক স্বীকৃতি</span></Button>}
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
                                <Button onClick={() => handleResetNavigateClassStartPrint()} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>
                                <Button onClick={handlePrint} className='flex-fill' type="button" variant="btn btn-primary">প্রিন্ট করুন</Button>
                                {(classStartPrintData.id_payment !== '03' || classStartPrintData.proc_status === '12') && <Button onClick={() => handleSetNavigateClassStartUpdate()} className='flex-fill' type="button" variant="btn btn-success">আপডেট করুন</Button>}
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default ClassStartAppPrint;