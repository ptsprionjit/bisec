import React, { useEffect, useState, useMemo, useRef, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'
import { useSelector } from "react-redux"

import { Document, Page } from 'react-pdf';

import axios from "axios";

import styles from '../../../assets/custom/css/bisec.module.css'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors.ts'
import * as ValidationInput from '../input_validation'

import error01 from '../../../assets/images/error/01.png'

const InstClassStartInquiry = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    // pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
    const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);
    const [authShow, setAuthShow] = useState(false);

    //Student Data Fetch Status
    const [loadingSuccess, setLoadingSuccess] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(false);
    const [loadingError, setLoadingError] = useState(false);

    const [modifySuccess, setModifySuccess] = useState(false);
    const [modifyError, setModifyError] = useState(false);
    const [modifyProcess, setModifyProcess] = useState(false);

    //Student Fetched Data
    const [dataList, setDataList] = useState([]);

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // Student Data Variables
    const [userData, setUserData] = useState({
        id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '',
    });

    const [userDataError, setUserDataError] = useState({
        id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '',
    });


    // File Attachment
    const [buildFiles, setBuildFiles] = useState({
        'applicant_details': null, 'application_form': null, 'founder_details': null, 'land_details': null, 'ltax_details': null, 'distance_cert': null, 'population_cert': null, 'declare_form': null, 'feasibility_details': null
    });
    const [classStartFiles, setClassStartFiles] = useState([]);

    const [buildFilesPages, setFilesPages] = useState({
        'applicant_details': 0, 'application_form': 0, 'founder_details': 0, 'land_details': 0, 'ltax_details': 0, 'distance_cert': 0, 'population_cert': 0, 'declare_form': 0, 'feasibility_details': 0
    });

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
                           color: #000000 !important;
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
        if (buildFiles[field] instanceof Blob) {
            let pdfURL = URL.createObjectURL(buildFiles[field]);
            window.open(pdfURL, '_blank');
            URL.revokeObjectURL(pdfURL);
            return;
        }
        if (classStartFiles[field] instanceof Blob) {
            let pdfURL = URL.createObjectURL(classStartFiles[field]);
            window.open(pdfURL, '_blank');
            URL.revokeObjectURL(pdfURL);
            return;
        }
    };

    // Handle File Select
    const handleFileSelect = async (fileName, selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            if (selectedFile.size > 2 * 1024 * 1024) {
                setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইলের সাইজ 2mb এর কম হতে হবে!` });
                setBuildFiles({ ...buildFiles, [fileName]: null });
            } else {
                const temp_file = new File([selectedFile], `${fileName}.pdf`, {
                    type: selectedFile.type,
                });
                setBuildFiles({ ...buildFiles, [fileName]: temp_file });
                setUserDataError({ ...userDataError, [fileName]: null });
            }
        } else {
            setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইল সিলেক্ট করতে হবে!` });
            setBuildFiles({ ...buildFiles, [fileName]: null });
        }
    }

    // Fetch Class Start Files 
    const fetchClassStartFiles = async (classData) => {
        const pdfFiles = {};

        const fields = [
            'mutation_details', 'dakhila_details', 'named_fund_details', 'general_fund_details', 'reserved_fund_details', 'order_build_js', 'order_build_ss', 'order_build_hs', 'order_class_js', 'order_class_ss', 'order_class_hs', 'order_recognition_js', 'order_recognition_ss', 'order_recognition_hs', 'inquiry_details',
        ];

        // console.log(classData.inst_mobile, classData.inst_stage);

        const promises = fields.map(async (field) => {
            try {
                const res = await axios.post(
                    `${BACKEND_URL}/institute/class_start/fetch_files`,
                    { inst_mobile: classData.inst_mobile, inst_stage: classData.inst_stage, file_name: field },
                    { responseType: 'blob' }
                );

                if (res.status === 200) {
                    const file = new File([res.data], `${field}.pdf`, {
                        type: 'application/pdf',
                    });
                    pdfFiles[field] = file;
                } else {
                    // pdfFiles[field] = demoPdf;
                    pdfFiles[field] = null;
                }
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error(`Failed to fetch ${field}:`, err);
                // pdfFiles[field] = demoPdf;
                pdfFiles[field] = null;
            }
        });

        await Promise.all(promises);
        // console.log(pdfFiles);
        setClassStartFiles(pdfFiles);
    }

    // Fetch Establishment Files 
    const fetchBuildFiles = async (item) => {
        const pdfFiles = {};

        const fields = [
            'applicant_details',
            'application_form',
            'founder_details',
            'land_details',
            'ltax_details',
            'distance_cert',
            'population_cert',
            'declare_form',
            'feasibility_details',
        ];

        // console.log(item.inst_mobile, item.inst_status);

        const promises = fields.map(async (field) => {
            try {
                const res = await axios.post(
                    `${BACKEND_URL}/institute/establishment/fetch_files`,
                    { inst_mobile: item.inst_mobile, inst_status: item.inst_status, file_name: field },
                    { responseType: 'blob' }
                );

                if (res.status === 200) {
                    const file = new File([res.data], `${field}.pdf`, {
                        type: 'application/pdf',
                    });
                    pdfFiles[field] = file;
                } else {
                    // pdfFiles[field] = demoPdf;
                    pdfFiles[field] = null;
                }
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error(`Failed to fetch ${field}:`, err);
                // pdfFiles[field] = demoPdf;
                pdfFiles[field] = null;
            }
        });

        await Promise.all(promises);
        // console.log(pdfFiles);
        setBuildFiles(pdfFiles);
    }

    useEffect(() => {
        if (dataList.length > 0) {
            setCurrentData(dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage));
            setTotalPage(Math.ceil(dataList.length / rowsPerPage));
        }
    }, [dataList]);// eslint-disable-line react-hooks/exhaustive-deps

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

    const debouncedSearchValue = useDebounce(searchValue, 500);

    const filteredData = useMemo(() => {
        if (!debouncedSearchValue) return currentData;      // If no search, show all

        const search = debouncedSearchValue.toUpperCase();

        return dataList.filter((item) =>
            [item.inst_bn_name, item.inst_en_name, item.inst_mobile, item.inst_email, item.clst_status, item.bn_version, item.bn_coed.toString()].some((field) =>
                field.toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

    //Student Data Fetch 
    const fetchDataList = async () => {
        setLoadingProgress("আবেদনের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।");
        try {
            const st_list = await axios.post(`${BACKEND_URL}/institute/class_start/inquiry_list`, {});
            if (st_list.data.data.length !== 0) {
                setDataList(st_list.data.data);
                setLoadingSuccess(true);
                //Set Data for Pagination
                setRowsPerPage(10);
                setTotalPage(Math.ceil(st_list.data.data.length / 10));
                setCurrentPage(1);
                setCurrentData(st_list.data.data.slice(0, 10));
            }
        } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setLoadingError("কোন অপেক্ষমান আবেদন পাওয়া যায়নি!");
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

        return () => clearTimeout(timer); // Cleanup on unmount
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

    //Application Authorize
    const applicationForward = async (app_data) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'institute_message'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'institute_message':
                    dataError = ValidationInput.bengaliCheck(userData[field]);
                    break;

                default:
                    break;
            }

            if (dataError) {
                newErrors[field] = dataError;
                isValid = false;
                setValidated(true);
            }
        });

        // Update once
        setUserDataError(newErrors);

        if (!isValid) {
            setModifyProcess(false);
            setModifySuccess(false);
            setModifyError("মন্তব্য সঠিকভাবে পূরণ করতে হবে!");
        } else {
            setModifyProcess("সম্পাদনা চলছে...। অপেক্ষা করুন।");
            setModifySuccess(false);
            setModifyError(false);

            try {
                const myData = {
                    inst_mobile: app_data.inst_mobile, inst_status: app_data.inst_stage, id_invoice: app_data.id_invoice, institute_message: userData.institute_message
                };
                const formData = new FormData();
                formData.append('userData', JSON.stringify(myData));
                formData.append('files', buildFiles.inquiry_details);

                const response = await axios.post(`${BACKEND_URL}/institute/class_start/inquiry_forward`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });

                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== app_data.id_invoice)));
                    setModifySuccess(response.data.message);
                    setAuthShow(false);
                } else {
                    setModifyError(response.data.message);
                }
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setModifyError(err.message);
                // console.log(err);
            } finally {
                setModifyProcess(false);
            }
        }
    };

    //Reset Modify Messages
    const resetModifyMessages = () => {
        setUserData({ ...userData, id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '', });
        setUserDataError({ ...userDataError, id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '', });
        setModifyError(false);
        setModifySuccess(false);
        setModifyProcess(false);
    }

    //Handle Details Click
    const handleDetailsClick = async (item) => {
        await Promise.all([
            fetchBuildFiles(item),
            fetchClassStartFiles(item)
        ]);
        resetModifyMessages();
        setActiveAppDetails(item);
        setDetailsShow(true);
    };

    //Handle Authorize Click
    const handleForwardClick = (item) => {
        setBuildFiles({ ...buildFiles, 'inquiry_details': null });
        resetModifyMessages();
        setActiveAppAuthorize(item);
        setAuthShow(true);
    };

    // Handle User Data Change
    const handleDataChange = (dataName, dataValue) => {
        setUserData({ ...userData, [dataName]: dataValue.toUpperCase() });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    if (!ceb_session) {
        return null;
    }

    if ((ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") && loadingSuccess) return (
        <>
            <div>
                <Row>
                    <Col sm="12">
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                    <h4 className={styles.SiyamRupaliFont + " card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের পাঠদানের তদন্তাধীন আবেদনসমূহ</h4>
                                    {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                    {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                    {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                </div>
                            </Card.Header>
                            <Card.Body className="px-0">
                                {dataList.length > 0 && <>
                                    <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
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
                                    </Row>
                                </>}

                                <Row className="table-responsive p-4">
                                    <table id="data-list-table" className="table table-bordered border-dark" role="grid" data-toggle="data-table">
                                        <thead>
                                            <tr className='table-primary table-bordered border-dark'>
                                                <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-0 m-0"}>
                                                    ক্রমিক
                                                </th>
                                                <th className='text-center align-top text-wrap p-1 m-0'>
                                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের নাম (বাংলা)</p>
                                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের নাম (English)</p>
                                                    <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>অফিস আদেশ</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-1 m-0'>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের মোবাইল</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের ইমেইল</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পেমেন্ট ভাউচার</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-1 m-0'>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের ধরণ</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>মাধ্যম</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পর্যায়</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-1 m-0'>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>ব্যক্তির নাম</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>মোবাইল</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>এনআইডি</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-1 m-0'>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>আবেদনের অবস্থা</p>
                                                    <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>মন্তব্য</p>
                                                </th>
                                                <th className={styles.SiyamRupaliFont + " text-center align-top text-wrap p-0 m-0"}>সম্পাদনা</th>
                                            </tr>
                                        </thead>
                                        {dataList.length > 0 && <>
                                            <tbody>
                                                {
                                                    filteredData.map((item, idx) => (
                                                        <tr key={idx}>
                                                            <td className='text-center align-top text-wrap'>{idx + 1}</td>
                                                            <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-nowrap p-1 m-0"}>{item.inst_bn_name}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-uppercase text-center align-center text-nowrap p-1 m-0"}>{item.inst_en_name}</p>
                                                                {item.email_ref && <Button type="button" variant="btn btn-outline-secondary" onClick={() => window.open(`${FRONTEND_URL}/order-emails?id_email=${item.email_ref}`, '_blank', 'noopener,noreferrer')}>তদন্তের আদেশ প্রিন্ট</Button>}
                                                            </td>
                                                            <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.inst_mobile}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-lowercase text-center align-center text-wrap p-1 m-0"}>{item.inst_email}</p>
                                                                <Button type="button" variant="btn btn-outline-primary" onClick={() => window.open(`${FRONTEND_URL}/payment-response?prev_location=/establishment/pending-list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>প্রিন্ট ভাউচার</Button>
                                                            </td>
                                                            <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_coed}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_version}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_status}</p>
                                                            </td>
                                                            {item.institute_named === '01' ? <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.inst_founder_name}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.inst_founder_mobile}</p>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.inst_founder_nid}</p>
                                                            </td> : <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>ব্যাক্তি নামীয় প্রতিষ্ঠান নয়</p>
                                                            </td>}
                                                            <td className='text-center align-top text-wrap'>
                                                                <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_app_status}</p>
                                                                {(item.email_ref && item.proc_status === '16') && <Button type="button" className='w-100 text-nowrap p-2 my-1' variant="btn btn-outline-success" onClick={() => alert('তদন্ত প্রতিবেদন জমা হয়েছে। প্রতিবেদন দেখতে বিস্তারিত আবেদনে প্রবেশ করুন।')}>তদন্ত প্রতিবেদন</Button>}
                                                                <Button type="button" className='w-100 text-nowrap p-2 m-0' variant="btn btn-outline-primary" onClick={() => alert(item.message)}>সর্বশেষ মন্তব্য</Button>
                                                            </td>
                                                            <td>
                                                                <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                                                                    <Button className='m-0 p-1' type="button" onClick={() => handleForwardClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="তদন্ত প্রতিবেদন দাখিল" data-original-title="তদন্ত প্রতিবেদন দাখিল">
                                                                        <span className="btn-inner">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                                        </span>
                                                                    </Button>
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
                                        </>}
                                    </table>
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
                                                                        <thead className={styles.print_show + 'border-0'}>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.clst_status}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_payment}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.bn_app_status}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_bn_name}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_en_name}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.institute_named === '01' ? 'হ্যাঁ' : 'না'}</span>
                                                                                </td>
                                                                            </tr>
                                                                            {activeAppDetails.institute_named === '01' && <>
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
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_founder_name}</span>
                                                                                    </td>
                                                                                    <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                                                                    </th>
                                                                                    <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                    </td>
                                                                                    <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_founder_mobile}</span>
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
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_founder_nid}</span>
                                                                                    </td>
                                                                                    <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জন্মতারিখ</span>
                                                                                    </th>
                                                                                    <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                    </td>
                                                                                    <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_founder_dob}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_email}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_mobile}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.build_status}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিকটবর্তী প্রতিষ্ঠানের দূরত্ব</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_distance} কিঃমিঃ</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠান এলাকার জনসংখ্যা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_population} জন</span>
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
                                                                                <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_address}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.inst_mouza_name} ({activeAppDetails.inst_mouza_number})</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খতিয়ান (নাম ও নম্বর)</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.en_khatiyan} ({activeAppDetails.inst_khatiyan_number})</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.khatiyan_mouja}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নামজারি খতিয়ান</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.khatiyan_mutation} ({activeAppDetails.inst_khatiyan_number})</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.khatiyan_total}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>হাল দাখিলা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.tax_receipt}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.class_room}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অফিস কক্ষের সংখ্যা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.office_room}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.toilet_room}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কমনরুমের সংখ্যা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.common_room}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.library_room}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কম্পিউটার ল্যাব সংখ্যা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.computer_room}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.total_books}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}> কম্পিউটারের সংখ্যা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.total_computer}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.khatiyan_mutation}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}> ব্যক্তি তহবিলের পরিমাণ</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.founder_amount}</span>
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
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.general_fund}</span>
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}> সংরক্ষিত তহবিলের পরিমাণ</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{activeAppDetails.reserved_fund}</span>
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
                                                                                    {activeAppDetails.ref_build_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {activeAppDetails.ref_build_js} ({activeAppDetails.date_build_js}), </span>}
                                                                                    {activeAppDetails.ref_build_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {activeAppDetails.ref_build_ss} ({activeAppDetails.date_build_ss}), </span>}
                                                                                    {activeAppDetails.ref_build_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিক{activeAppDetails.ref_build_hs} ({activeAppDetails.date_build_hs})</span>}
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
                                                                                    {activeAppDetails.ref_commence_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {activeAppDetails.ref_commence_js} ({activeAppDetails.date_commence_js}), </span>}
                                                                                    {activeAppDetails.ref_commence_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {activeAppDetails.ref_commence_ss} ({activeAppDetails.date_commence_ss}), </span>}
                                                                                    {activeAppDetails.ref_commence_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিকঃ{activeAppDetails.ref_commence_hs} ({activeAppDetails.date_commence_hs})</span>}
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
                                                                                    {activeAppDetails.ref_recognition_js && <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নিম্ন মাধ্যমিকঃ {activeAppDetails.ref_recognition_js} ({activeAppDetails.date_recognition_js}), </span>}
                                                                                    {activeAppDetails.ref_recognition_ss && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> মাধ্যমিকঃ {activeAppDetails.ref_recognition_ss} ({activeAppDetails.date_recognition_ss}), </span>}
                                                                                    {activeAppDetails.ref_recognition_hs && <span className={styles.SiyamRupaliFont + " text-center text-dark"}> উচ্চ মাধ্যমিকঃ {activeAppDetails.ref_recognition_hs} ({activeAppDetails.date_recognition_hs})</span>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr className='print-hide'>
                                                                                <th colSpan={6} className='text-center align-top text-wrap p-0 py-2'>
                                                                                    <h6 className={styles.SiyamRupaliFont + " text-center text-secondary fs-6"}>ডকুমেন্ট সংযুক্তি</h6>
                                                                                </th>
                                                                            </tr>
                                                                            {activeAppDetails.institute_named === '01' && <tr className='print-hide'>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তির বিবরণী</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {buildFiles.founder_details && String(buildFiles.founder_details.name).toLocaleLowerCase() === 'founder_details.pdf' && <Button onClick={() => handleFileView('founder_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ব্যক্তির বিবরণী (নামীয় প্রতিষ্ঠান)</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তি কর্তৃক জমাকৃত তহবিল</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td colSpan={1} className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {classStartFiles.named_fund_details && String(classStartFiles.named_fund_details.name).toLocaleLowerCase() === 'named_fund_details.pdf' && <Button onClick={() => handleFileView('named_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ব্যক্তি কর্তৃক জমাকৃত তহবিল</span></Button>}
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
                                                                                    {buildFiles.applicant_details && String(buildFiles.applicant_details.name).toLocaleLowerCase() === 'applicant_details.pdf' && <Button onClick={() => handleFileView('applicant_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>আবেদনকারীগণের সংক্ষিপ্ত বিবরণ</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদন ফর্ম</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {buildFiles.application_form && String(buildFiles.application_form.name).toLocaleLowerCase() === 'application_form.pdf' && <Button onClick={() => handleFileView('application_form')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>ফর্ম (ক-১/ক-২)</span></Button>}
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
                                                                                    {buildFiles.land_details && String(buildFiles.land_details.name).toLocaleLowerCase() === 'land_details.pdf' && <Button onClick={() => handleFileView('land_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জমির দলিল</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>খাজনার দাখিলা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {buildFiles.ltax_details && String(buildFiles.ltax_details.name).toLocaleLowerCase() === 'ltax_details.pdf' && <Button onClick={() => handleFileView('ltax_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>খাজনার দাখিলা</span></Button>}
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
                                                                                    {buildFiles.distance_cert && String(buildFiles.distance_cert.name).toLocaleLowerCase() === 'distance_cert.pdf' && <Button onClick={() => handleFileView('distance_cert')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>দূরত্বের সনদ</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>জনসংখ্যার সনদ</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {buildFiles.population_cert && String(buildFiles.population_cert.name).toLocaleLowerCase() === 'population_cert.pdf' && <Button onClick={() => handleFileView('population_cert')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>জনসংখ্যার সনদ</span></Button>}
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
                                                                                    {buildFiles.declare_form && String(buildFiles.declare_form.name).toLocaleLowerCase() === 'declare_form.pdf' && <Button onClick={() => handleFileView('declare_form')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>অঙ্গীকারনামা</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>স্থাপনের যৌক্তিকতার বিবরণী</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {buildFiles.feasibility_details && String(buildFiles.feasibility_details.name).toLocaleLowerCase() === 'feasibility_details.pdf' && <Button onClick={() => handleFileView('feasibility_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>স্থাপনের যৌক্তিকতা</span></Button>}
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
                                                                                    {classStartFiles.mutation_details && String(classStartFiles.mutation_details.name).toLocaleLowerCase() === 'mutation_details.pdf' && <Button onClick={() => handleFileView('mutation_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নামজারি খতিয়ান</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>হাল দাখিলা</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {classStartFiles.dakhila_details && String(classStartFiles.dakhila_details.name).toLocaleLowerCase() === 'dakhila_details.pdf' && <Button onClick={() => handleFileView('dakhila_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>হাল দাখিলা</span></Button>}
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
                                                                                    {classStartFiles.general_fund_details && String(classStartFiles.general_fund_details.name).toLocaleLowerCase() === 'general_fund_details.pdf' && <Button onClick={() => handleFileView('general_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সাধারণ তহবিলের প্রমাণক</span></Button>}
                                                                                </td>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সংরক্ষিত তহবিল</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {classStartFiles.reserved_fund_details && String(classStartFiles.reserved_fund_details.name).toLocaleLowerCase() === 'reserved_fund_details.pdf' && <Button onClick={() => handleFileView('reserved_fund_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>সংরক্ষিত তহবিলের প্রমাণক</span></Button>}
                                                                                </td>
                                                                            </tr>
                                                                            <tr className='print-hide'>
                                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>তদন্ত প্রতিবেদন</span>
                                                                                </th>
                                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                                </td>
                                                                                <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                                    {classStartFiles.inquiry_details && String(classStartFiles.inquiry_details.name).toLocaleLowerCase() === 'inquiry_details.pdf' && <Button onClick={() => handleFileView('inquiry_details')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>পরিদর্শন প্রতিবেদন</span></Button>}
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
                                                                                    {classStartFiles.order_build_js && String(classStartFiles.order_build_js.name).toLocaleLowerCase() === 'order_build_js.pdf' && <Button onClick={() => handleFileView('order_build_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক স্থাপন</span></Button>}
                                                                                    {classStartFiles.order_build_ss && String(classStartFiles.order_build_ss.name).toLocaleLowerCase() === 'order_build_ss.pdf' && <Button onClick={() => handleFileView('order_build_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক স্থাপন</span></Button>}
                                                                                    {classStartFiles.order_build_hs && String(classStartFiles.order_build_hs.name).toLocaleLowerCase() === 'order_build_hs.pdf' && <Button onClick={() => handleFileView('order_build_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক স্থাপন</span></Button>}
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
                                                                                    {classStartFiles.order_class_js && String(classStartFiles.order_class_js.name).toLocaleLowerCase() === 'order_class_js.pdf' && <Button onClick={() => handleFileView('order_class_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক পাঠদান</span></Button>}
                                                                                    {classStartFiles.order_class_ss && String(classStartFiles.order_class_ss.name).toLocaleLowerCase() === 'order_class_ss.pdf' && <Button onClick={() => handleFileView('order_class_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক পাঠদান</span></Button>}
                                                                                    {classStartFiles.order_class_hs && String(classStartFiles.order_class_hs.name).toLocaleLowerCase() === 'order_class_hs.pdf' && <Button onClick={() => handleFileView('order_class_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক পাঠদান</span></Button>}
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
                                                                                    {classStartFiles.order_recognition_js && String(classStartFiles.order_recognition_js.name).toLocaleLowerCase() === 'order_recognition_js.pdf' && <Button onClick={() => handleFileView('order_recognition_js')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>নিম্ন মাধ্যমিক স্বীকৃতি</span></Button>}
                                                                                    {classStartFiles.order_recognition_ss && String(classStartFiles.order_recognition_ss.name).toLocaleLowerCase() === 'order_recognition_ss.pdf' && <Button onClick={() => handleFileView('order_recognition_ss')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>মাধ্যমিক স্বীকৃতি</span></Button>}
                                                                                    {classStartFiles.order_recognition_hs && String(classStartFiles.order_recognition_hs.name).toLocaleLowerCase() === 'order_recognition_hs.pdf' && <Button onClick={() => handleFileView('order_recognition_hs')} type='button' variant='btn btn-link' className='w-100 m-0 p-0'><span className={styles.SiyamRupaliFont + " text-center text-primary"}>উচ্চ মাধ্যমিক স্বীকৃতি</span></Button>}
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
                                                        <Col md={12}>
                                                            <Card className="card-transparent shadow-none d-flex justify-content-center m-0 py-5 auth-card">
                                                                <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                                                                    <Col md={12} className='d-flex justify-content-around align-items-center gap-5'>
                                                                        <Button onClick={handlePrint} className='flex-fill' type="button" variant="btn btn-primary">প্রিন্ট করুন</Button>
                                                                        <Button onClick={() => setDetailsShow(false)} className='flex-fill' type="button" variant="btn btn-secondary">
                                                                            ফিরে যান
                                                                        </Button>
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
                                    {activeAppAuthorize && (
                                        <Modal
                                            show={authShow}
                                            onHide={() => setAuthShow(false)}
                                            backdrop="static"
                                            keyboard={false}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title className={styles.SiyamRupaliFont + ' text-center'}>
                                                    <h4 className={styles.SiyamRupaliFont + ' text-center'}>তদন্ত প্রতিবেদন দাখিল?</h4>
                                                    {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                                    {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                                    {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                                </Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <Form noValidate>
                                                    <Col md={12}>
                                                        <Card>
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='profile_image'>তদন্ত প্রতিবেদন সংযুক্তি</label>
                                                            </Card.Header>

                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {buildFiles.inquiry_details && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={buildFiles.inquiry_details}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...buildFilesPages, inquiry_details: numPages
                                                                        })}
                                                                        onClick={() => handleFileView('inquiry_details')}
                                                                    >
                                                                        <Page
                                                                            pageNumber={1}
                                                                            width={75}
                                                                            renderTextLayer={false}   // ✅ disable text layer
                                                                            renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                        />
                                                                        <p className='text-center'><i><small>মোট পাতাঃ {buildFilesPages.inquiry_details}</small></i></p>
                                                                    </Document>
                                                                )}
                                                                {!buildFiles.inquiry_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('inquiry_details', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {!buildFiles.inquiry_details && !userDataError.inquiry_details &&
                                                                    <p className='my-2 pt-2 text-center'>
                                                                        <small>
                                                                            <i>
                                                                                শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                            </i>
                                                                            <br />
                                                                            <i>
                                                                                সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                            </i>
                                                                            <br />
                                                                        </small>
                                                                    </p>
                                                                }
                                                                {userDataError.inquiry_details &&
                                                                    <p className='text-center'>
                                                                        <small>
                                                                            <i className='text-danger'>
                                                                                {userDataError.inquiry_details}
                                                                            </i>
                                                                        </small>
                                                                    </p>
                                                                }
                                                            </Card.Footer>
                                                        </Card>
                                                    </Col>
                                                    <Col className='my-2' md={12}>
                                                        <Form.Group className="bg-transparent">
                                                            <Form.Label className="text-primary" htmlFor='institute_message_default'>মন্তব্য</Form.Label>
                                                            <Form.Select
                                                                id="institute_message_default"
                                                                value={userData.institute_message_default}
                                                                isInvalid={validated && !!userDataError.institute_message_default}
                                                                isValid={validated && userData.institute_message_default && !userDataError.institute_message_default}
                                                                onChange={
                                                                    (e) => {
                                                                        setUserData({ ...userData, institute_message_default: e.target.value, institute_message: e.target.value });
                                                                    }
                                                                }
                                                                className="selectpicker form-control"
                                                                data-style="py-0"
                                                            >
                                                                <option value='' disabled>-- মন্তব্য সিলেক্ট করুন --</option>
                                                                <option>আবেদনের প্রাথমিক তথ্য যাচাই ও প্রেরিত তদন্ত প্রতিবেদনের প্রেক্ষিতেে আবেদনটি সন্তোষজনক প্রতিয়মান হয়েছে। আবেদনটি অনুমোদন প্রদান করা যেতে পারে বিধায় অনুমোদনের জন্য প্রস্তাব পেশ করা হলো।</option>
                                                                <option>আবেদনের প্রাথমিক তথ্য যাচাই ও প্রেরিত তদন্ত প্রতিবেদনের প্রেক্ষিতেে আবেদনটি সন্তোষজনক প্রতিয়মান হয়েছে। আবেদনটি বাতিলের জন্য প্রস্তাব পেশ করা হলো।</option>
                                                                <option>আবেদনের প্রাথমিক তথ্য যাচাই ও প্রেরিত তদন্ত প্রতিবেদনের প্রেক্ষিতেে আবেদনটি সন্তোষজনক প্রতিয়মান হয়েছে। আবেদনটি অধিকতর তদন্তের জন্য প্রস্তাব পেশ করা হলো।</option>
                                                                <option value='_'>অন্যান্য (বক্সে লিখুন)!</option>
                                                            </Form.Select>
                                                        </Form.Group>
                                                    </Col>
                                                    <Col className='my-2' md={12}>
                                                        <Form.Control
                                                            as="textarea"
                                                            className='bg-transparent text-uppercase w-100'
                                                            maxLength={240}
                                                            id="institute_message"
                                                            value={userData.institute_message}
                                                            isInvalid={validated && !!userDataError.institute_message}
                                                            isValid={validated && userData.institute_message && !userDataError.institute_message}
                                                            onChange={(e) => handleDataChange('institute_message', e.target.value)}
                                                            rows={5}
                                                        />
                                                        {validated && userDataError.institute_message && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.institute_message}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                </Form>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="success" onClick={() => applicationForward(activeAppAuthorize)}>
                                                    অনুমোদন করুন
                                                </Button>
                                                <Button variant="secondary" onClick={() => setAuthShow(false)}>
                                                    ফিরে যান
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                </Row>
                                {dataList.length > 0 && <>
                                    <Row className='d-flex justify-content-between px-5'>
                                        <Col md="5">
                                            <Button className='flex-fill' disabled variant="btn btn-light"><span className={styles.SiyamRupaliFont}>আবেদন {((currentPage - 1) * rowsPerPage) + 1} থেকে {currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage} পর্যন্ত</span></Button>
                                        </Col>
                                        <Col md="5" className='d-flex justify-content-center gap-1'>
                                            <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>
                                            <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>
                                            {currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage - 1}</Button>}
                                            <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{currentPage}</Button>
                                            {totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage + 1}</Button>}
                                            <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>
                                            <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>
                                        </Col>
                                    </Row>
                                </>}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div >
        </>
    )

    if (ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") return (
        <>
            <div>
                <Row className='d-flex justify-content-center align-items-center'>
                    <Col md="12">
                        <Card>
                            <Card.Header className="d-flex justify-content-between">
                                <div className="header-title w-100">
                                    <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতিষ্ঠানের পাঠদানের তদন্তাধীন আবেদনসমূহ</span></h4>
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
            </div>
        </>
    )

    return (
        <>
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className={styles.SiyamRupaliFont + " text-center text-white mb-2"}>This page is under development</h2>
                <Image src={error01} alt="Under Development" />
            </div>
        </>
    )
}

export default InstClassStartInquiry;