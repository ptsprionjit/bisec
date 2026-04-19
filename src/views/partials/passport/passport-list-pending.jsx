import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Card, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import styles from '../../../assets/custom/css/bisec.module.css'
import { FadeLoader } from "react-spinners";
import * as InputValidation from '../input_validation'

import PassportAppPrint from './print/app-print.jsx';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const PassportAppPending = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    const [activeAppDetails, setActiveAppDetails] = useState([]);
    const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);
    const [activeAppReject, setActiveAppReject] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);
    const [authShow, setAuthShow] = useState(false);
    const [rejShow, setRejShow] = useState(false);

    //Student Data Fetch Status
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    //Student Fetched Data
    const [dataList, setDataList] = useState([]);

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    //Fetch Leave List Data 
    const fetchDataList = async () => {
        setStatus({ loading: "আবেদনের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });

        try {
            const response = await axiosApi.post(`/passport/application/list`, { app_status: String(Number(permissionData.role) - 1) });

            if (response.status === 200 && response?.data?.passportList?.length) {
                const datalength = response.data.passportList.length;
                setDataList(response.data.passportList);
                //Set Data for Pagination
                setRowsPerPage(10);
                setTotalPage(Math.ceil(datalength / 10));
                setCurrentPage(1);
                setCurrentData(response.data.passportList.slice(0, 10));
                setStatus({ loading: false, success: true, error: false });
            } else {
                setDataList([]);
                //Set Data for Pagination
                setRowsPerPage(false);
                setTotalPage(false);
                setCurrentPage(false);
                setCurrentData([]);
                setStatus({ loading: false, success: false, error: response.data.message });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out", { replace: true });
            }
            setDataList([]);
            setStatus({ loading: false, success: false, error: err.response.data.message });

            //Set Data for Pagination
            setRowsPerPage(false);
            setTotalPage(false);
            setCurrentPage(false);
            setCurrentData([]);
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
    useEffect(() => {
        if (loading) return; // wait till loading is done

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        }

        if (!(((permissionData.role === '14' || permissionData.role === '15') && permissionData.office === '02') || permissionData.role === '16' || permissionData.role === '17')) {
            navigate("/errors/error403", { replace: true });
        }

        fetchDataList();
    }, [permissionData, loading]); // run only once on mount

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    const [userDataError, setUserDataError] = useState([]);

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
            [item.en_user, item.bn_user.toString()].some((field) =>
                field.toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

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
    const applicationAuthorize = async (userData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'id_passport', 'comment'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_passport':
                    dataError = InputValidation.alphanumCheck(userData[field]);
                    break;

                case 'comment':
                    dataError = userData[field] ? InputValidation.banglaAddressCheck(userData[field]) : false;
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
            setStatus({ loading: false, success: false, error: "তথ্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে... অপেক্ষা করুন...", success: false, error: false });

            try {
                const response = await axiosApi.post(`/passport/application/authorize`, { userData: userData });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_passport !== userData.id_passport)));
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setAuthShow(false);
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate("/auth/sign-out");
                }
                setStatus({ loading: false, success: false, error: err.response.data.message });
            } finally {
                setStatus((prev) => ({ ...prev, loading: false }));
            }
        }
    };

    //Application Reject
    const applicationReject = async (userData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'id_passport', 'comment'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_passport':
                    dataError = InputValidation.alphanumCheck(userData[field]);
                    break;

                case 'comment':
                    dataError = InputValidation.banglaAddressCheck(userData[field]);
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
            setStatus({ loading: false, success: false, error: "তথ্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে... অপেক্ষা করুন...", success: false, error: false });

            try {
                const response = await axiosApi.post(`/passport/application/reject`, { userData: userData });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_passport !== userData.id_passport)));
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setRejShow(false);
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate("/auth/sign-out");
                }
                setStatus({ loading: false, success: false, error: err.response.data.message });
            } finally {
                setStatus((prev) => ({ ...prev, loading: false }));
            }
        }
    };

    //Handle Details Click
    const handleDetailsClick = async (item) => {
        setActiveAppDetails(item);
        setDetailsShow(true);
    };

    //Handle Authorize Click
    const handleAuthorizeClick = (item) => {
        setActiveAppAuthorize(item);
        setAuthShow(true);
    };

    //Handle Reject Click
    const handleRejectClick = (item) => {
        setActiveAppReject(item);
        setRejShow(true);
    };

    if (status.loading && !activeAppAuthorize && !activeAppReject) return (
        <Fragment>
            <Row className="bg-transparent m-0 p-0">
                <Col md={12} className="d-flex justify-content-center align-items-center" style={{ height: "95dvh" }} >
                    <FadeLoader
                        color="#000000"
                        loading={true}
                    />
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            <Row className='m-0 p-0'>
                <Col md={12} className='m-0 p-0'>
                    <Card className='m-0 p-3'>
                        <Card.Header className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
                            <h4 className={"card-title text-center text-primary pb-2"}>অনাপত্তিপত্রের (পাসপোর্ট) অপেক্ষমান আবেদনসমূহ</h4>
                            {status.error && <h6 className={"text-center text-danger pb-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success pb-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary pb-2"}>{status.loading}</h6>}
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            {dataList.length > 0 && <>
                                <Row className='d-flex flex-row justify-content-between align-items-center m-0 p-2'>
                                    <Col md={3}>
                                        <Form.Label htmlFor="per_page_data"><span className={"text-center"}>প্রতি পাতায় আবেদন সংখ্যা (সর্বমোট আবেদনঃ {InputValidation.E2BDigit(dataList.length)})</span></Form.Label>
                                        <Form.Select
                                            id="per_page_data"
                                            value={rowsPerPage}
                                            onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                        >
                                            <option disabled value="" className={"text-center"}>-- আবেদন সংখ্যা সিলেক্ট করুন --</option>
                                            <option value="10">১০</option>
                                            <option value="20">২০</option>
                                            <option value="50">৫০</option>
                                            <option value="100">১০০</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={3}>
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
                            <Row className="table-responsive m-0 p-2">
                                <Table id="data-list-table" className="table-bordered border-dark" role="grid" data-toggle="data-table">
                                    <thead>
                                        <tr className='bg-transparent'>
                                            <th className={"text-center align-top text-wrap p-0 m-0"}>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>ক্রমিক</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-0 m-0'>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>নাম</p>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>পদবী</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-0 m-0'>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>দপ্তর</p>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>শাখা</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-0 m-0'>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>আবেদনের অবস্থা</p>
                                            </th>
                                            <th className={"text-center align-top text-wrap p-0 m-0"}>
                                                <p className={"text-nowrap text-center m-0 p-0 py-1"}>সম্পাদনা</p>
                                            </th>
                                        </tr>
                                    </thead>
                                    {dataList.length > 0 && <>
                                        <tbody>
                                            {
                                                filteredData.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{InputValidation.E2BDigit(idx + 1)}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-nowrap m-0 p-0 py-1"}>{item.bn_user}</p>
                                                            <p className={"text-nowrap m-0 p-0 py-1"}>{item.bn_post}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_office}</p>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_section}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_app_status}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <div className='d-flex justify-content-center align-items-center flex-wrap gap-3'>
                                                                {(permissionData.office === '01' || permissionData.office === '02') && <Button className='m-0 p-1' type="button" onClick={() => handleAuthorizeClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="অনুমোদন" data-original-title="অনুমোদন">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                    </span>
                                                                </Button>
                                                                {(permissionData.office === '01' || permissionData.office === '02') && <Button className='m-0 p-1' type="button" onClick={() => handleRejectClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-x"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                                                                    </span>
                                                                </Button>}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </>}
                                </Table>
                            </Row>
                            {dataList.length > 0 &&
                                <Row className='d-flex justify-content-between m-0 p-2'>
                                    <Col md={6}>
                                        <Button disabled variant="btn btn-link"><span className={styles.SiyamRupaliFont}>আবেদন {InputValidation.E2BDigit(((currentPage - 1) * rowsPerPage) + 1)} থেকে {currentPage * rowsPerPage > dataList.length ? InputValidation.E2BDigit(dataList.length) : InputValidation.E2BDigit(currentPage * rowsPerPage)} পর্যন্ত</span></Button>
                                    </Col>
                                    <Col md={6} className='d-flex justify-content-center gap-1'>
                                        <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>
                                        <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>
                                        {currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage - 1}</Button>}
                                        <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{currentPage}</Button>
                                        {totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{currentPage + 1}</Button>}
                                        <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>
                                        <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>
                                    </Col>
                                </Row>
                            }
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
                        <PassportAppPrint
                            navigatePassportAppPrint={detailsShow}
                            setNavigatePassportAppPrint={setDetailsShow}
                            printData={activeAppDetails}
                            axiosApi={axiosApi}
                        />
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
                        <Modal.Title className={'text-center'}>
                            <h4 className={'text-center'}>ছুটি অনুমোদন করতে চান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form noValidate>
                                <Col className='my-2' md={12}>
                                    <Form.Label htmlFor="comment" className='fw-bold'>মন্তব্য লিখুনঃ </Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        className='bg-transparent text-uppercase w-100'
                                        maxLength={240}
                                        id="comment"
                                        placeholder='মন্তব্য উল্লেখ করুন (যদি থাকে)'
                                        value={activeAppAuthorize.comment}
                                        isInvalid={validated && !!activeAppAuthorize.comment}
                                        isValid={validated && activeAppAuthorize.comment && !activeAppAuthorize.comment}
                                        onChange={
                                            (e) => {
                                                setActiveAppAuthorize({ ...activeAppAuthorize, comment: e.target.value });
                                            }
                                        }
                                        rows={5}
                                    />
                                    {validated && userDataError.comment && (
                                        <Form.Control.Feedback type="invalid">
                                            {userDataError.comment}
                                        </Form.Control.Feedback>
                                    )}
                                </Col>
                            </Form>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-around align-items-center gap-2'>
                        <Button className='flex-fill' variant="btn btn-outline-primary" onClick={() => setAuthShow(false)}>
                            ফিরে যান
                        </Button>
                        <Button className='flex-fill' variant="btn btn-outline-success" onClick={() => applicationAuthorize(activeAppAuthorize)}>
                            অনুমোদন করুন
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {activeAppReject && (
                <Modal
                    show={rejShow}
                    onHide={() => setRejShow(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className={'text-center'}>
                            <h4 className={'text-center'}>ছুটি বাতিল করতে চান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate>
                            <Col className='my-2' md={12}>
                                <Form.Label htmlFor="institute_message" className='fw-bold'>বাতিলের কারণ উল্লেখ করুনঃ </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    className='bg-transparent text-uppercase w-100'
                                    maxLength={240}
                                    id="institute_message"
                                    placeholder='বাতিলের কারণ উল্লেখ করুন'
                                    value={activeAppReject.comment}
                                    isInvalid={validated && !!activeAppReject.comment}
                                    isValid={validated && activeAppReject.comment && !activeAppReject.comment}
                                    onChange={
                                        (e) => {
                                            setActiveAppReject({ ...activeAppReject, comment: e.target.value });
                                        }
                                    }
                                    rows={5}
                                />
                                {validated && userDataError.comment && (
                                    <Form.Control.Feedback type="invalid">
                                        {userDataError.comment}
                                    </Form.Control.Feedback>
                                )}
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer className='d-flex justify-content-around align-items-center gap-2'>
                        <Button className='flex-fill' variant="btn btn-outline-primary" onClick={() => setRejShow(false)}>
                            ফিরে যান
                        </Button>
                        <Button className='flex-fill' variant="btn btn-outline-danger" onClick={() => applicationReject(activeAppReject)}>
                            বাতিল করুন
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    )
}

export default PassportAppPending;