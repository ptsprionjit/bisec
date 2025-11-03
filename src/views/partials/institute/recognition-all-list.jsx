import React, { useEffect, useState, useMemo, useRef, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'
import { useSelector } from "react-redux"

import axios from "axios";

import styles from '../../../assets/custom/css/bisec.module.css'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors.ts'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

const InstRecognitionListAll = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const appName = useSelector(SettingSelector.app_bn_name);

    const printRef = useRef();

    const navigate = useNavigate();

    useEffect(() => {
        if (!ceb_session?.ceb_user_id) {
            navigate("/auth/sign-out");
        }
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    const [activeAppDetails, setActiveAppDetails] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);

    //Student Data Fetch Status
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [loadingError, setLoadingError] = useState(false);

    //Student Fetched Data
    const [dataList, setDataList] = useState([]);

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    // File Attachment
    const [recognitionFiles, setRecognitionFiles] = useState([]);

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
                        padding: 0.25in !important;
                        div, table, tr, th, td, p, span {
                            page-break-inside: avoid !important;
                        }
                        section {
                            page-break-after: always !important;
                        }
                        *{
                           font-family: 'Siyam Rupali', sans-serif !important;
                           /* font-size: 15px !important; */
                           /* color: #000000 !important; */
                           margin: 0 !important;
                           padding: 0.25in !important;
                        }
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
        window.close();
    };

    // Hanlde File View
    const handleFileView = (field) => {
        if (recognitionFiles[field] instanceof Blob) {
            let pdfURL = URL.createObjectURL(recognitionFiles[field]);
            window.open(pdfURL, '_blank');
            URL.revokeObjectURL(pdfURL);
            return;
        }
    };

    // Fetch Files 
    const fetchRecognitionFiles = async (appData) => {
        const pdfFiles = {};

        const fields = [
            'prev_order', 'general_fund_details', 'reserved_fund_details', 'class_routine', 'mutation_details', 'dakhila_details', 'committee_order', 'student_order'
        ];

        // console.log(appData);

        const promises = fields.map(async (field) => {
            try {
                const res = await axios.post(
                    `${BACKEND_URL}/institute/recognition/fetch_files`,
                    { inst_eiin: appData.inst_eiin, recog_inst_status: appData.recog_inst_status, count_applicaton: appData.count_applicaton, file_name: field },
                    { responseType: 'blob' }
                );

                if (res.status === 200) {
                    const file = new File([res.data], `${field}.pdf`, {
                        type: 'application/pdf',
                    });
                    pdfFiles[field] = file;
                } else {
                    pdfFiles[field] = null;
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate("/auth/sign-out");
                }
                pdfFiles[field] = null;
            }
        });

        await Promise.all(promises);
        setRecognitionFiles(pdfFiles);
    }

    // Set Page for Data List
    useEffect(() => {
        if (dataList.length > 0) {
            setCurrentData(dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage));
            setTotalPage(Math.ceil(dataList.length / rowsPerPage));
        }
    }, [dataList]);// eslint-disable-line react-hooks/exhaustive-deps

    // Debounce for Data Search
    const useDebounce = (value, delay = 500) => {
        const [debouncedValue, setDebouncedValue] = useState(value);
        useEffect(() => {
            const timer = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            return () => clearTimeout(timer); // Cleanup if value changes before delay
        }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

        return debouncedValue;
    }

    // Delay for Search Data
    const debouncedSearchValue = useDebounce(searchValue, 500);

    // Filter Data Based on Search Input
    const filteredData = useMemo(() => {
        if (!debouncedSearchValue) return currentData;      // If no search, show all

        const search = debouncedSearchValue.toUpperCase();

        return dataList.filter((item) =>
            [item.bn_status, item.entry_date, item.bn_payment, item.prev_ref, item.ref_end, item.expiry_date, item.bn_app_status, item.signed_date.toString()].some((field) =>
                field.toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

    //Student Data Fetch 
    const fetchDataList = async () => {
        setLoadingProgress("আবেদনের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।");
        try {
            const response = await axios.post(`${BACKEND_URL}/institute/recognition/all_list`);
            // console.log(response.data.recData);
            if (response.status === 200 && response?.data?.recData && response.data.recData.length) {
                setDataList(response.data.recData);
                setLoadingSuccess(true);
                //Set Data for Pagination
                setRowsPerPage(10);
                setTotalPage(Math.ceil(response.data.recData.length / 10));
                setCurrentPage(1);
                setCurrentData(response.data.recData.slice(0, 10));
            } else {
                setDataList([]);
                setLoadingSuccess(false);
                setLoadingError("কোন আবেদন পাওয়া যায়নি!");
            }
            // console.log(response.data.data);
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setLoadingError("কোন আবেদন পাওয়া যায়নি!");
            // console.log(err);
        } finally {
            setLoadingProgress(false);
        }
    }

    // Fetch Application List
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchDataList();
        }, 1000); // Simulate loading delay

        if (ceb_session?.ceb_user_id) return () => clearTimeout(timer); // Cleanup on unmount
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    //Handle Page Row Number Change
    const handleRowsPerPageChange = (data_per_page) => {
        data_per_page = Number(data_per_page);
        setRowsPerPage(data_per_page);
        setTotalPage(Math.ceil(dataList.length / data_per_page));
        setCurrentPage(1);
        setCurrentData(dataList.slice(0, data_per_page > dataList.length ? dataList.length : data_per_page));
    };

    //Handle Page Change
    const handleSetCurrentPage = (page_num) => {
        page_num = Number(page_num);
        if (page_num >= 1 && page_num <= totalPage) {
            setCurrentPage(page_num);
            setCurrentData(dataList.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > dataList.length ? dataList.length : page_num * rowsPerPage));
        }
    };

    //Handle Details Click
    async function handleDetailsClick(item) {
        await Promise.all([
            fetchRecognitionFiles(item)
        ]);
        setActiveAppDetails(item);
        setDetailsShow(true);
    };

    if (!ceb_session?.ceb_user_id) {
        return (
            <></>
        )
    }

    if ((ceb_session.ceb_user_type === "13" || ceb_session.ceb_user_role === "17") && loadingSuccess) return (
        <Fragment>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                <h4 className={styles.SiyamRupaliFont + " card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের স্বীকৃতি/স্বীকৃতি নবায়নের আবেদনসমূহ</h4>
                            </div>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
                                {totalPage > 0 && (
                                    <Col md="2">
                                        <Form.Label htmlFor="per_page_data"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতি পাতায় আবেদন সংখ্যা (সর্বমোট আবেদনঃ {dataList.length})</span></Form.Label>
                                        <Form.Select
                                            id="per_page_data"
                                            value={rowsPerPage}
                                            onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                        // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                                        >
                                            <option disabled value="" className={styles.SiyamRupaliFont + " text-center"}>-- আবেদন সংখ্যা সিলেক্ট করুন --</option>
                                            <option value="10">১০</option>
                                            <option value="20">২০</option>
                                            <option value="50">৫০</option>
                                            <option value="100">১০০</option>
                                        </Form.Select>
                                    </Col>
                                )}
                                {totalPage > 0 && (
                                    <Col md="3">
                                        <Form.Label className='d-flex justify-content-end' htmlFor="search_info"> <span className={styles.SiyamRupaliFont}>আবেদন খুঁজতে নিচের বক্সে লিখুন</span> </Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="search"
                                            id="search_info"
                                            value={searchValue}
                                            onChange={(e) => setSearchValue(e.target.value)}
                                            placeholder="তথ্য খুঁজুন..."
                                        />
                                    </Col>
                                )}
                            </Row>
                            <Row className="table-responsive p-4">
                                <table id="data-list-table" className="table table-bordered border-dark" role="grid" data-toggle="data-table">
                                    <thead>
                                        <tr className='table-primary table-bordered border-dark'>
                                            <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-0 m-0"}>
                                                ক্রমিক
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>আবেদনের পর্যায়</p>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের বিভাগ</p>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের পর্যায়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>আবেদনের ক্রম</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পেমেন্ট স্ট্যটাস</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পূর্ববর্তী স্বীকৃতির তারিখ</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পূর্ববর্তী স্বীকৃতির মেয়াদ</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>অনুমোদনের তারিখ</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>স্বীকৃতির মেয়াদ</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>আবেদনের অবস্থা</p>
                                            </th>
                                            <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-0 m-0"}>সম্পাদনা</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            filteredData.map((item, idx) => (
                                                <tr key={idx}>
                                                    <td className='text-center align-top text-wrap'>{idx + 1}</td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_recog_status}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_group}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_status}</p>
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>ক্রমঃ {String(ValidationInput.E2BDigit(item.count_applicaton)).padStart(4, '0')}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-lowercase text-center align-center text-wrap p-1 m-0"}>{item.bn_payment}</p>
                                                        {item.id_payment === '03' && <Button type="button" variant="btn btn-outline-primary" onClick={() => window.open(`${FRONTEND_URL}/payment/response/success?prev_location=/institute/recognition/all-list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>প্রিন্ট ভাউচার</Button>}
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.ref_date}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.ref_end}</p>
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.signed_date}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.expiry_date}</p>
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_app_status}</p>
                                                        {item?.id_signed && <Button type="button" className='w-100' variant="btn btn-success" onClick={() => window.open(`${FRONTEND_URL}/institute/recognition/order?id_order=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>অনুমতিপত্র</Button>}
                                                    </td>
                                                    <td>
                                                        <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                                                            <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                <span className="btn-inner">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                </span>
                                                            </Button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </Row>
                            <Row className='d-flex justify-content-between px-5'>
                                <Col md="5">
                                    {totalPage > 0 && <Button className='flex-fill' disabled variant="btn btn-light"><span className={styles.SiyamRupaliFont}>আবেদন {((currentPage - 1) * rowsPerPage) + 1} থেকে {currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage} পর্যন্ত</span></Button>}
                                </Col>
                                <Col md="5" className='d-flex justify-content-center gap-1'>
                                    {totalPage > 0 && <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>}
                                    {totalPage > 0 && <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>}
                                    {totalPage > 0 && currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage - 1}</Button>}
                                    {totalPage > 0 && <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{currentPage}</Button>}
                                    {totalPage > 0 && totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage + 1}</Button>}
                                    {totalPage > 0 && <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>}
                                    {totalPage > 0 && <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {activeAppDetails && (
                <Modal
                    show={detailsShow}
                    onHide={() => setDetailsShow(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-success"}>{activeAppDetails.bn_recog_status}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-danger"}>{activeAppDetails.bn_payment}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-danger"}>{activeAppDetails.bn_app_status}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.prev_ref)}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্মারকের তারিখ</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.ref_date)}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.ref_start)}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মেয়াদোত্তীর্ণের তারিখ</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.ref_end)}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_user}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-uppercase text-center text-dark"}>{activeAppDetails.en_user}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_email}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.inst_mobile)}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_coed}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মাধ্যম</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_version} মাধ্যম</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_status}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের অবস্থান</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        {activeAppDetails.inst_region === '01' && <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সিটি কর্পোরেশন এলাকা</span>
                                                        </td>}
                                                        {activeAppDetails.inst_region === '02' && <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পৌরসভা এলাকা</span>
                                                        </td>}
                                                        {activeAppDetails.inst_region === '03' && <td className='text-center align-top text-wrap p-2 m-0'>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_dist}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>উপজেলা/থানা</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_uzps}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-uppercase text-left text-dark"}>{activeAppDetails.inst_address}, {activeAppDetails.en_uzps}, {activeAppDetails.en_dist}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_land)} শতাংশ</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারিকৃত জমি</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.mutation_land)} শতাংশ</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.land_tax_year)}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>দাখিলা নম্বর</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.land_tax_number)}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.general_fund)} টাকা</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সংরক্ষিত তহবিল</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.reserved_fund)} টাকা</span>
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
                                                            {activeAppDetails.committee_type === '01' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নির্বাহী কমিটি</span>}
                                                            {activeAppDetails.committee_type === '02' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>গর্ভর্নিং বডি</span>}
                                                            {activeAppDetails.committee_type === '03' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ম্যানেজিং কমিটি</span>}
                                                            {activeAppDetails.committee_type === '04' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এডহক কমিটি</span>}
                                                            {activeAppDetails.committee_type === '05' && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সরকারি বা সংস্থা পরিচালিত প্রতিষ্ঠানের গর্ভর্নিং বডি/ম্যানেজিং কমিটি</span>}
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কমিটির মেয়াদ</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.committee_expiry)}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাকাঃ {ValidationInput.E2BDigit(activeAppDetails.total_concrete_building)} টি, অন্যান্যঃ {ValidationInput.E2BDigit(activeAppDetails.total_other_building)} টি</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>কক্ষের বিবরণ</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={styles.SiyamRupaliFont + " text-center text-dark p-0 m-0"}>মোটঃ {ValidationInput.E2BDigit(activeAppDetails.total_room)} টি, ব্যবহৃতঃ {ValidationInput.E2BDigit(activeAppDetails.used_room)} টি, উদ্বৃত্তঃ {ValidationInput.E2BDigit(activeAppDetails.researved_room)} টি, বিদ্যুৎ সংযোগকৃতঃ {ValidationInput.E2BDigit(activeAppDetails.electricity_connection)} টি</p>
                                                            <p className={styles.SiyamRupaliFont + " text-center text-dark p-0 m-0"}>মোট আয়তনঃ {ValidationInput.E2BDigit(activeAppDetails.area_room)} বর্গফুট</p>

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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_toilet)} টি</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>টিউবওয়েলের সংখ্যা</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_tubewell)} টি</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_library)} টি, {ValidationInput.E2BDigit(activeAppDetails.area_library)} বর্গফুট</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট বই</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_books)} টি</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_labratory)} টি, {ValidationInput.E2BDigit(activeAppDetails.area_labratory)} বর্গফুট</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>বিজ্ঞানাগারের দ্রব্যাদির মূল্য</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_equipment_price)} টাকা</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.computer_room)} টি, {ValidationInput.E2BDigit(activeAppDetails.area_computer_room)} বর্গফুট</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট কম্পিউটার</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{ValidationInput.E2BDigit(activeAppDetails.total_computer)} টি</span>
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
                                                            {ValidationInput.E2BDigit(activeAppDetails.total_permitted_student)} জন
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোট নিবন্ধিত শিক্ষার্থী</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                                            {ValidationInput.E2BDigit(Number(activeAppDetails.six_science_total) + Number(activeAppDetails.six_humanities_total) + Number(activeAppDetails.six_business_total) + Number(activeAppDetails.seven_science_total) + Number(activeAppDetails.seven_humanities_total) + Number(activeAppDetails.seven_business_total) + Number(activeAppDetails.eight_science_total) + Number(activeAppDetails.eight_humanities_total) + Number(activeAppDetails.eight_business_total) + Number(activeAppDetails.nine_science_total) + Number(activeAppDetails.nine_humanities_total) + Number(activeAppDetails.nine_business_total) + Number(activeAppDetails.ten_science_total) + Number(activeAppDetails.ten_humanities_total) + Number(activeAppDetails.ten_business_total) + Number(activeAppDetails.eleven_science_total) + Number(activeAppDetails.eleven_humanities_total) + Number(activeAppDetails.eleven_business_total) + Number(activeAppDetails.twelve_science_total) + Number(activeAppDetails.twelve_humanities_total) + Number(activeAppDetails.twelve_business_total))} জন
                                                        </td>
                                                    </tr>
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '11' || activeAppDetails.recog_inst_status === '20') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ষষ্ট শ্রেণী</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.six_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.six_science_total)} জন
                                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.six_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.six_humanities_total)} জন; */}
                                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.six_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.six_business_total)} জন */}
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
                                                                শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.seven_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.seven_science_total)} জন
                                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.seven_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.seven_humanities_total)} জন; */}
                                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.seven_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.seven_business_total)} জন */}
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
                                                                শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eight_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eight_science_total)} জন
                                                                {/* মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eight_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eight_humanities_total)} জন; */}
                                                                {/* ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eight_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eight_business_total)} জন */}
                                                            </td>
                                                        </tr>
                                                    </>}
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '12' || activeAppDetails.recog_inst_status === '20') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নবম শ্রেণী</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.nine_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.nine_science_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.nine_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.nine_humanities_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.nine_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.nine_business_total)} জন
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
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.ten_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.ten_science_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.ten_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.ten_humanities_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.ten_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.ten_business_total)} জন
                                                                </>}
                                                            </td>
                                                        </tr>
                                                    </>}
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '13' || activeAppDetails.recog_inst_status === '20' || activeAppDetails.recog_inst_status === '26') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>একাদশ শ্রেণী</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_science_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_humanities_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.eleven_business_total)} জন
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
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    বিজ্ঞানঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.six_science_section)} টি,  মোটঃ {ValidationInput.E2BDigit(activeAppDetails.twelve_science_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; মানবিকঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.twelve_humanities_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.twelve_humanities_total)} জন
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    ; ব্যবসায় শিক্ষাঃ শাখাঃ {ValidationInput.E2BDigit(activeAppDetails.twelve_business_section)} টি, মোটঃ {ValidationInput.E2BDigit(activeAppDetails.six_business_total)} জন
                                                                </>}
                                                            </td>
                                                        </tr>
                                                    </>}
                                                    <tr>
                                                        <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                            <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>পরীক্ষার তথ্য</h6>
                                                        </th>
                                                    </tr>
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '11' || activeAppDetails.recog_inst_status === '20') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(activeAppDetails.jsc1_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc1_science_passed) / Number(activeAppDetails.jsc1_science_appeared) * 100).toFixed(2))}%</p>
                                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc1_humanities_passed) / Number(activeAppDetails.jsc1_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc1_business_passed) / Number(activeAppDetails.jsc1_business_appeared) * 100).toFixed(2))}%</p> */}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(activeAppDetails.jsc2_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc2_science_passed) / Number(activeAppDetails.jsc2_science_appeared) * 100).toFixed(2))}%</p>
                                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc2_humanities_passed) / Number(activeAppDetails.jsc2_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc2_business_passed) / Number(activeAppDetails.jsc2_business_appeared) * 100).toFixed(2))}%</p> */}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জেএসসি-{ValidationInput.E2BDigit(activeAppDetails.jsc3_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                <p className='m-0 p-0'>নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc3_science_passed) / Number(activeAppDetails.jsc3_science_appeared) * 100).toFixed(2))}%</p>
                                                                {/* <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc3_humanities_passed) / Number(activeAppDetails.jsc3_humanities_appeared) * 100).toFixed(2))}%</p> */}
                                                                {/* <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.jsc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.jsc3_business_passed) / Number(activeAppDetails.jsc3_business_appeared) * 100).toFixed(2))}%</p> */}
                                                            </td>
                                                        </tr>
                                                    </>}
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '12' || activeAppDetails.recog_inst_status === '20') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(activeAppDetails.ssc1_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc1_science_passed) / Number(activeAppDetails.ssc1_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc1_humanities_passed) / Number(activeAppDetails.ssc1_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc1_business_passed) / Number(activeAppDetails.ssc1_business_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(activeAppDetails.ssc2_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc2_science_passed) / Number(activeAppDetails.ssc2_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc2_humanities_passed) / Number(activeAppDetails.ssc2_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc2_business_passed) / Number(activeAppDetails.ssc2_business_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এসএসসি-{ValidationInput.E2BDigit(activeAppDetails.ssc3_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc3_science_passed) / Number(activeAppDetails.ssc3_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc3_humanities_passed) / Number(activeAppDetails.ssc3_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.ssc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.ssc3_business_passed) / Number(activeAppDetails.ssc3_business_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                    </>}
                                                    {(!activeAppDetails?.recog_inst_status || activeAppDetails.recog_inst_status === '13' || activeAppDetails.recog_inst_status === '20' || activeAppDetails.recog_inst_status === '26') && <>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(activeAppDetails.hsc1_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc1_science_passed) / Number(activeAppDetails.hsc1_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc1_humanities_passed) / Number(activeAppDetails.hsc1_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc1_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc1_business_passed) / Number(activeAppDetails.hsc1_business_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(activeAppDetails.hsc2_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc2_science_passed) / Number(activeAppDetails.hsc2_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc2_humanities_passed) / Number(activeAppDetails.hsc2_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc2_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc2_business_passed) / Number(activeAppDetails.hsc2_business_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>এইচএসসি-{ValidationInput.E2BDigit(activeAppDetails.hsc3_exam_year)}</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                {(activeAppDetails.id_group === '01' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>বিজ্ঞানঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_science_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_science_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc3_science_passed) / Number(activeAppDetails.hsc3_science_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '02' || activeAppDetails.id_group === '04' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>মানবিকঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_humanities_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_humanities_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc3_humanities_passed) / Number(activeAppDetails.hsc3_humanities_appeared) * 100).toFixed(2))}%</p>
                                                                </>}
                                                                {(activeAppDetails.id_group === '03' || activeAppDetails.id_group === '05' || activeAppDetails.id_group === '06' || activeAppDetails.id_group === '07') && <>
                                                                    <p className='m-0 p-0'>ব্যবসায় শিক্ষাঃ নিবন্ধিতঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_business_registered)} জন, অংশগ্রহণকারীঃ {ValidationInput.E2BDigit(activeAppDetails.hsc3_business_appeared)} জন, পাশের হারঃ {ValidationInput.E2BDigit((Number(activeAppDetails.hsc3_business_passed) / Number(activeAppDetails.hsc3_business_appeared) * 100).toFixed(2))}%</p>
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
                                                            {recognitionFiles.prev_order && String(recognitionFiles.prev_order.name).toLocaleLowerCase() === 'prev_order.pdf' && <Button onClick={() => handleFileView('prev_order')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>পূর্ববর্তী স্বীকৃতি/পাঠদানের আদেশ</span></Button>}
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সাধারণ তহবিল</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            {recognitionFiles.general_fund_details && String(recognitionFiles.general_fund_details.name).toLocaleLowerCase() === 'general_fund_details.pdf' && <Button onClick={() => handleFileView('general_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সাধারণ তহবিলের বিবরণী</span></Button>}
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
                                                            {recognitionFiles.reserved_fund_details && String(recognitionFiles.reserved_fund_details.name).toLocaleLowerCase() === 'reserved_fund_details.pdf' && <Button onClick={() => handleFileView('reserved_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সংরক্ষিত তহবিলের বিবরণী</span></Button>}
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ক্লাস রুটিন</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            {recognitionFiles.class_routine && String(recognitionFiles.class_routine.name).toLocaleLowerCase() === 'class_routine.pdf' && <Button onClick={() => handleFileView('class_routine')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ক্লাস রুটিন (সর্বশেষ)</span></Button>}
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
                                                            {recognitionFiles.mutation_details && String(recognitionFiles.mutation_details.name).toLocaleLowerCase() === 'mutation_details.pdf' && <Button onClick={() => handleFileView('mutation_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জমির দলিল</span></Button>}
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি ও খাজনা</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            {recognitionFiles.dakhila_details && String(recognitionFiles.dakhila_details.name).toLocaleLowerCase() === 'dakhila_details.pdf' && <Button onClick={() => handleFileView('dakhila_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নামজারি খতিয়ান ও খাজনার দাখিলা</span></Button>}
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
                                                            {recognitionFiles.committee_order && String(recognitionFiles.committee_order.name).toLocaleLowerCase() === 'committee_order.pdf' && <Button onClick={() => handleFileView('committee_order')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সর্বশেষ কমিটির স্মারক</span></Button>}
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>শিক্ষার্থী ভর্তির অনুমতি</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            {recognitionFiles.student_order && String(recognitionFiles.student_order.name).toLocaleLowerCase() === 'student_order.pdf' && <Button onClick={() => handleFileView('student_order')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ভর্তির অনুমতির স্মারক</span></Button>}
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
                                                <Button onClick={() => setDetailsShow(false)} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>
                                                <Button onClick={() => handlePrint()} className='flex-fill' type="button" variant="btn btn-primary">প্রিন্ট করুন</Button>
                                            </Col>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Fragment>
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )}
        </Fragment>
    )

    if (ceb_session.ceb_user_type === "13" || ceb_session.ceb_user_role === "17") return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center'>
                <Col md="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title w-100">
                                <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতিষ্ঠানের স্বীকৃতি/স্বীকৃতি নবায়নের আবেদনসমূহ</span></h4>
                            </div>
                        </Card.Header>
                        <Card.Body className="px-0">
                            <Row className='justify-content-center'>
                                <Col md="8">
                                    {loadingProgress && <h6 className="text-center rounded-1 text-info p-2 mb-2">{loadingProgress}</h6>}
                                    {loadingError && <h6 className="text-center rounded-1 bg-danger text-white p-2 mb-2">{loadingError}</h6>}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className={styles.SiyamRupaliFont + " text-center text-white mb-2"}>This page is under development</h2>
                <Image src={error01} alt="Under Development" />
            </Row>
        </Fragment>
    )
}

export default InstRecognitionListAll;