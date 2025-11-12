import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import axios from "axios";

import styles from '../../../assets/custom/css/bisec.module.css'

import error01 from '../../../assets/images/error/01.png'

import RecognitionPrint from './print/recog_app_print'

const InstRecognitionFinal = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

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

    // Fetch Files 
    const fetchRecognitionFiles = async (appData) => {
        const pdfFiles = {};

        const fields = [
            'prev_order', 'general_fund_details', 'reserved_fund_details', 'class_routine', 'mutation_details', 'dakhila_details', 'committee_order', 'student_order', 'inquiry_details'
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
            [item.bn_user, item.en_user, item.inst_mobile, item.inst_email, item.clst_status, item.bn_version, item.bn_coed.toString()].some((field) =>
                field.toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

    //Student Data Fetch 
    const fetchDataList = async () => {
        setLoadingProgress("আবেদনের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।");
        try {
            const response = await axios.post(`${BACKEND_URL}/institute/recognition/final_list`);
            if (response.data.data.length !== 0) {
                setDataList(response.data.data);
                setLoadingSuccess(true);
                //Set Data for Pagination
                setRowsPerPage(10);
                setTotalPage(Math.ceil(response.data.data.length / 10));
                setCurrentPage(1);
                setCurrentData(response.data.data.slice(0, 10));
            }
            // console.log(response.data.data);
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setLoadingError("কোন অনুমোদিত আবেদন পাওয়া যায়নি!");
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

    //Handle Details Click
    async function handleDetailsClick(item) {
        await Promise.all([
            fetchRecognitionFiles(item)
        ]);
        setActiveAppDetails(item);
        setDetailsShow(true);
    };

    if (!ceb_session?.ceb_user_id) return (
        <></>
    )

    if ((ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") && loadingSuccess) return (
        <Fragment>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                <h4 className={styles.SiyamRupaliFont + " card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের স্বীকৃতি/স্বীকৃতি নবায়নের অনুমোদিত আবেদনসমূহ</h4>
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
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের নাম (বাংলা)</p>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>প্রতিষ্ঠানের নাম (English)</p>
                                                <p className={styles.SiyamRupaliFont + " text-nowrap text-center"}>অফিস আদেশ (তদন্ত)</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের মোবাইল</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের ইমেইল</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পেমেন্ট ভাউচার</p>
                                            </th>
                                            {/* <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের ধরণ</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের মাধ্যম</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের পর্যায়</p>
                                            </th> */}
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>স্বীকৃতির পর্যায়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>আবেদনের অবস্থা</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>অনুমোদন আদেশ</p>
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
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-nowrap p-1 m-0"}>{item.bn_user}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-uppercase text-center align-center text-nowrap p-1 m-0"}>{item.en_user}</p>
                                                        {item.email_ref && <Button type="button" variant="btn btn-outline-secondary" onClick={() => window.open(`${FRONTEND_URL}/order-emails?id_email=${item.email_ref}`, '_blank', 'noopener,noreferrer')}>তদন্তের আদেশ প্রিন্ট</Button>}
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.inst_mobile}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-lowercase text-center align-center text-wrap p-1 m-0"}>{item.inst_email}</p>
                                                        <Button type="button" variant="btn btn-outline-primary" onClick={() => window.open(`${FRONTEND_URL}/payment/response/success?prev_location=/establishment/pending-list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>প্রিন্ট ভাউচার</Button>
                                                    </td>
                                                    {/* <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_coed}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_version}</p>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_status}</p>
                                                    </td> */}
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_recog_status}</p>
                                                    </td>
                                                    <td className='text-center align-top text-wrap'>
                                                        <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_app_status}</p>
                                                        {(item.email_ref && item.proc_status === '16') && <Button type="button" className='w-100 text-nowrap p-2 my-1' variant="btn btn-outline-success" onClick={() => alert('তদন্ত প্রতিবেদন জমা হয়েছে। প্রতিবেদন দেখতে বিস্তারিত আবেদনে প্রবেশ করুন।')}>তদন্ত প্রতিবেদন</Button>}
                                                        <Button type="button" className='w-100' variant="btn btn-success" onClick={() => window.open(`${FRONTEND_URL}/institute/classs-start/order?id_order=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>অনুমতিপত্র</Button>
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
                            <RecognitionPrint
                                userData={activeAppDetails}
                                recognitionFiles={recognitionFiles}
                                navigateRecognitionPrint={detailsShow}
                                setNavigateRecognitionPrint={setDetailsShow}
                            />
                        </Modal.Body>
                        <Modal.Footer></Modal.Footer>
                    </Modal>
                )}
            </Row>
        </Fragment>
    )

    if (ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center'>
                <Col md="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title w-100">
                                <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতিষ্ঠানের স্বীকৃতি/স্বীকৃতি নবায়নের অনুমোদিত আবেদনসমূহ</span></h4>
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
            <div className='d-flex flex-column justify-content-center align-items-center'>
                <h2 className={styles.SiyamRupaliFont + " text-center text-white mb-2"}>This page is under development</h2>
                <Image src={error01} alt="Under Development" />
            </div>
        </Fragment>
    )
}

export default InstRecognitionFinal;