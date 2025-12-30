import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import RecognitionPrint from './print/recog_app_print'

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InstRecognitionListAll = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
    useEffect(() => {
        let mounted = true;
        (async () => {
            if (!(permissionData?.type === '13' || permissionData?.role === '17' || permissionData?.role === '18')) {
                navigate('/errors/error404', { replace: true });
            }
        })();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [permissionData, loading]); // run only once on mount

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
            'prev_order', 'general_fund_details', 'reserved_fund_details', 'class_routine', 'mutation_details', 'dakhila_details', 'committee_order', 'student_order'
        ];

        // console.log(appData);

        const promises = fields.map(async (field) => {
            try {
                const res = await axiosApi.post(
                    `/institute/recognition/fetch_files`,
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
            const response = await axiosApi.post(`/institute/recognition/all_list`);
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

        if (permissionData.id) return () => clearTimeout(timer); // Cleanup on unmount
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

    if ((permissionData.type === "13" || permissionData.role === "17") && loadingSuccess) return (
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
        </Fragment>
    )

    if (permissionData.type === "13" || permissionData.role === "17") return (
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