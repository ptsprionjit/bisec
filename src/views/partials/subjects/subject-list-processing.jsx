import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Card, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import Select from 'react-select';

import styles from '../../../assets/custom/css/bisec.module.css'
import { FadeLoader } from "react-spinners";
import * as InputValidation from '../input_validation'

import SubjectAppForm from './application/subject-entry.jsx';
import SubjectListPrint from './print/subject-list-print.jsx';
import SubjectDetails from './print/subject-details.jsx';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const SubjectAppProcess = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    const [examList, setExamList] = useState([]);
    const [optionExamList, setOptionExamList] = useState([]);

    const [subjectList, setSubjectList] = useState();

    const [listDetails, setListDetails] = useState([]);
    const [activeAppDetails, setActiveAppDetails] = useState([]);
    const [activeAppUpdate, setActiveAppUpdate] = useState([]);
    const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);
    const [activeAppReject, setActiveAppReject] = useState([]);
    const [activeAppSendBack, setActiveAppSendBack] = useState([]);

    const [listShow, setListShow] = useState(false);
    const [detailsShow, setDetailsShow] = useState(false);
    const [updateShow, setUpdateShow] = useState(false);
    const [authShow, setAuthShow] = useState(false);
    const [rejShow, setRejShow] = useState(false);
    const [sendBackShow, setSendBackShow] = useState(false);

    //Student Data Fetch Status
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    const [userData, setUserData] = useState({
        id_exam: '', ex_year: '', sub_code: '', en_full_sub: '', bn_full_sub: '', en_reg_sub: '', bn_reg_sub: '', id_group: '', is_reg_compulsory: '', is_grp_compulsory: '', is_rel_compulsory: '', message: ''
    });

    const [exmData, setExmData] = useState(null);

    const [userDataError, setUserDataError] = useState([]);

    // Fetch Exam List
    const fetchExamList = async () => {
        setStatus({ loading: "তথ্য সংগ্রহ করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/exam/list`);
            if (response.status === 200) {
                setStatus({ loading: false, success: true, error: false });
                setExamList(response.data.examList);
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

    // Check Permission data
    useEffect(() => {
        if (loading) return;

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        } else {
            if (!(permissionData.office === '03' || permissionData.office === '04' || permissionData.office === '05')) {
                navigate("errors/error403", { replace: true });
            } else {
                fetchExamList();
            }
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    // Set Option Exam List
    useEffect(() => {
        if (examList.length) {
            const examMap = {
                '03': ['03', '04', '05', '06', '07', '08', '09', '10'],
                '05': ['03', '04', '05', '06', '09', '10'],
                '04': ['07', '08'],
            };

            const myExmList = examMap[permissionData.office] ?? [];
            const examSet = new Set(myExmList);

            const filteredData = examList.filter(item =>
                examSet.has(String(item.id_exam))
            );

            const newOptions = filteredData.map(data => ({
                value: data.id_exam,
                label: String(data.en_exam).toLocaleUpperCase() + " (" + String(data.bn_exam).toLocaleUpperCase() + ")"
            }));

            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );

            setOptionExamList(uniqueValues);
            // setUserData((prev) => ({ ...prev, id_status: permissionData.role }));
            setUserData((prev) => ({ ...prev, id_status: '14' }));
        }
    }, [examList]);

    //Handle Data Change
    const handleDataChange = (dataName, dataValue) => {
        setUserData({ ...userData, [dataName]: dataValue });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    // Handle Submit Search
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'id_exam', 'ex_year'
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                switch (field) {
                    case 'id_exam':
                    case 'ex_year':
                        dataError = InputValidation.numberCheck(userData[field]);
                        break;

                    default:
                        break;
                }

                if (dataError) {
                    newErrors[field] = dataError;
                    isValidData = false;
                    setValidated(false);
                }
            });
        }

        // Update once
        setUserDataError(newErrors);

        if (!isValidData) {
            event.stopPropagation();
        } else {
            setStatus({ loading: "তথ্য সংগ্রহ করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
            try {
                const response = await axiosApi.post(`/subject/entry/list`, { userData: userData });
                setExmData(userData);
                if (response.status === 200) {
                    const dataList = response.data.subjectList;
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setValidated(false);
                    setSubjectList(dataList);
                    // Set Data for Pagination
                    setRowsPerPage(10);
                    setTotalPage(Math.ceil(dataList.length / 10));
                    setCurrentPage(1);
                    setCurrentData(dataList.slice(0, 10));
                    setStatus({ loading: false, success: true, error: false });
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                    setSubjectList(true);
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
        setValidated(true);
    };

    const handleReset = () => {
        setUserData(((prev) => ({ ...prev, id_exam: '', ex_year: '', sub_code: '', en_full_sub: '', bn_full_sub: '', en_reg_sub: '', bn_reg_sub: '', id_group: '', is_reg_compulsory: '', is_grp_compulsory: '', is_rel_compulsory: '', message: '' })));
        setStatus({ loading: false, success: false, error: false });
        setUserDataError([]);
        setSubjectList(false);
        setValidated(false);
        setExmData(null);
    }

    useEffect(() => {
        if (subjectList?.length) {
            setCurrentData(subjectList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > subjectList.length ? subjectList.length : currentPage * rowsPerPage));
            setTotalPage(Math.ceil(subjectList.length / rowsPerPage));
        }
    }, [subjectList]);// eslint-disable-line react-hooks/exhaustive-deps

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

        return subjectList.filter((item) =>
            [item.en_exam, item.bn_exam, item.ex_year, item.sub_code, item.en_full_sub, item.bn_full_sub, item.en_reg_sub, item.bn_reg_sub.toString()].some((field) =>
                field.toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, subjectList]); // eslint-disable-line react-hooks/exhaustive-deps

    //Handle Page Row Number Change
    const handleRowsPerPageChange = (data_per_page) => {
        data_per_page = Number(data_per_page);
        setRowsPerPage(data_per_page);
        setTotalPage(Math.ceil(subjectList.length / data_per_page));
        setCurrentPage(1);
        setCurrentData(subjectList.slice(0, data_per_page > subjectList.length ? subjectList.length : data_per_page));
    };

    //Handle Page Change
    const handleSetCurrentPage = (page_num) => {
        page_num = Number(page_num);
        if (page_num >= 1 && page_num <= totalPage) {
            setCurrentPage(page_num);
            setCurrentData(subjectList.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > subjectList.length ? subjectList.length : page_num * rowsPerPage));
        }
    };

    //Application Authorize
    const applicationAuthorize = async (userData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'id_exam', 'ex_year', 'sub_code', 'comment',
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_exam':
                case 'ex_year':
                    dataError = InputValidation.numberCheck(userData[field]);
                    break;

                case 'sub_code':
                    dataError = userData[field] ? InputValidation.numberCheck(userData[field]) : false;
                    break;

                case 'comment':
                    dataError = userData[field] ? InputValidation.addressCheck(userData[field]) : false;
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
                const response = await axiosApi.post(`/subject/entry/authorize`, { userData: userData });
                if (response.status === 200) {
                    // setSubjectList(((prevData) => prevData.filter((item) => item.sub_code !== userData.sub_code)));
                    setSubjectList([]);
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

    //Application SendBack
    const applicationSendBack = async (userData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'id_exam', 'ex_year', 'sub_code', 'comment',
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_exam':
                case 'ex_year':
                    dataError = InputValidation.numberCheck(userData[field]);
                    break;

                case 'sub_code':
                    dataError = userData[field] ? InputValidation.numberCheck(userData[field]) : false;
                    break;

                case 'comment':
                    dataError = userData[field] ? InputValidation.addressCheck(userData[field]) : false;
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
                const response = await axiosApi.post(`/subject/entry/sendback`, { userData: userData });
                if (response.status === 200) {
                    // setSubjectList(((prevData) => prevData.filter((item) => item.sub_code !== userData.sub_code)));
                    setSubjectList([]);
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setSendBackShow(false);
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
            'id_exam', 'ex_year', 'sub_code', 'comment',
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_exam':
                case 'ex_year':
                    dataError = InputValidation.numberCheck(userData[field]);
                    break;

                case 'sub_code':
                    dataError = userData[field] ? InputValidation.numberCheck(userData[field]) : false;
                    break;

                case 'comment':
                    dataError = userData[field] ? InputValidation.addressCheck(userData[field]) : false;
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
                const response = await axiosApi.post(`/subject/entry/reject`, { userData: userData });
                if (response.status === 200) {
                    // setSubjectList(((prevData) => prevData.filter((item) => item.sub_code !== userData.sub_code)));
                    setSubjectList([]);
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

    //Handle List Details Click
    const handleListClick = async (item) => {
        setListDetails(item);
        setStatus({ loading: false, success: false, error: false });
        setListShow(true);
    };

    //Handle Details Click
    const handleDetailsClick = async (item) => {
        setActiveAppDetails(item);
        setStatus({ loading: false, success: false, error: false });
        setDetailsShow(true);
    };

    //Handle Update Click
    const handleUpdateClick = async (item) => {
        setUserData(item);
        setActiveAppUpdate(item);
        setStatus({ loading: false, success: false, error: false });
        setUpdateShow(true);
    };

    //Handle Authorize Click
    const handleAuthorizeClick = (item) => {
        setActiveAppAuthorize(item);
        setStatus({ loading: false, success: false, error: false });
        setAuthShow(true);
    };

    //Handle Reject Click
    const handleRejectClick = (item) => {
        setActiveAppReject(item);
        setStatus({ loading: false, success: false, error: false });
        setRejShow(true);
    };

    //Handle Reject Click
    const handleSendBackClick = (item) => {
        setActiveAppSendBack(item);
        setStatus({ loading: false, success: false, error: false });
        setSendBackShow(true);
    };

    if (status.loading && !activeAppAuthorize && !activeAppReject && !activeAppUpdate) return (
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

    if (subjectList && (permissionData.office === '03' || permissionData.office === '04' || permissionData.office === '05')) return (
        <Fragment>
            <Row className='m-0 p-0'>
                <Col md={12} className='m-0 p-0'>
                    <Card className='m-0 p-3'>
                        <Card.Header className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
                            <h4 className={"card-title text-center text-primary pb-2"}>রেজিস্ট্রেশন/পরীক্ষার বিষয়সমূহ</h4>
                            {status.error && <h6 className={"text-center text-danger pb-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success pb-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary pb-2"}>{status.loading}</h6>}
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            {subjectList?.length && <>
                                <Row className='d-flex flex-row justify-content-between align-items-end m-0 p-2'>
                                    <Col md={4}>
                                        <Form.Label htmlFor="per_page_data"><span className={"text-center"}>প্রতি পাতায় বিষয় সংখ্যা (সর্বমোট বিষয়ঃ {InputValidation.E2BDigit(subjectList.length)})</span></Form.Label>
                                        <Form.Select
                                            id="per_page_data"
                                            value={rowsPerPage}
                                            onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                        >
                                            <option disabled value="" className={"text-center"}>-- বিষয় সংখ্যা সিলেক্ট করুন --</option>
                                            <option value="10">১০</option>
                                            <option value="20">২০</option>
                                            <option value="50">৫০</option>
                                            <option value="100">১০০</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md={4} className='text-center'>
                                        <Button className='m-0 p-2' type="button" onClick={() => setSubjectList(false)} variant="btn btn-outline-warning" data-toggle="tooltip" data-placement="top" title="ফিরে যান" data-original-title="ফিরে যান">
                                            ফিরে যান
                                        </Button>
                                    </Col>
                                    {/* <Col md={4} className='text-center'>
                                        <Button className='m-0 p-2 w-100' type="button" onClick={() => handleUpdateClick(true)} variant="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="নতুন এন্ট্রি" data-original-title="নতুন এন্ট্রি">
                                            নতুন এন্ট্রি
                                        </Button>
                                    </Col> */}
                                    <Col md={4}>
                                        <Form.Label className='d-flex justify-content-end' htmlFor="search_info"> <span className={styles.SiyamRupaliFont}>বিষয় খুঁজতে নিচের বক্সে লিখুন</span> </Form.Label>
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
                                <Row className="table-responsive m-0 p-2">
                                    <Table id="data-list-table" className="table-bordered border-dark" role="grid" data-toggle="data-table">
                                        <thead>
                                            <tr className='bg-transparent'>
                                                <th className={"text-center align-top text-wrap p-0 m-0"}>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>ক্রমিক</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-0 m-0'>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>বিষয় কোড</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-0 m-0'>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>বিষয়ের নাম</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-0 m-0'>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>বিষয়ের বিভাগ</p>
                                                </th>
                                                <th className='text-center align-top text-wrap p-0 m-0'>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>সর্বশেষ অবস্থা</p>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>মন্তব্য</p>
                                                </th>
                                                <th className={"text-center align-top text-wrap p-0 m-0"}>
                                                    <p className={"text-nowrap text-center m-0 p-0 py-1"}>সম্পাদনা</p>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                filteredData.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{InputValidation.E2BDigit(idx + 1).padStart(2, '০০')}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{InputValidation.E2BDigit(item.sub_code)}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_full_sub}</p>
                                                            <p className={"text-uppercase text-wrap m-0 p-0 py-1"}>({item.en_full_sub})</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_group}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.bn_app_status}</p>
                                                            <p className={"text-wrap m-0 p-0 py-1"}>{item.message}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <div className='d-flex justify-content-center align-items-center flex-wrap gap-3'>
                                                                {/* <Button className='m-0 p-1' type="button" onClick={() => handleAuthorizeClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title={item.id_status !== '13' ? "অনুমোদন" : "অনুমোদনের জন্য প্রেরণ"} data-original-title={item.id_status !== '13' ? "অনুমোদন" : "অনুমোদনের জন্য প্রেরণ"}>
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                                    </span>
                                                                </Button> */}
                                                                <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                    </span>
                                                                </Button>
                                                                {permissionData.role === '13' && <Button className='m-0 p-1' type="button" onClick={() => handleUpdateClick(item)} variant="btn btn-primary" data-toggle="tooltip" data-placement="top" title="আপডেট" data-original-title="আপডেট">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                {/* {permissionData.role !== '13' && <Button className='m-0 p-1' type="button" onClick={() => handleSendBackClick(item)} variant="btn btn-warning" data-toggle="tooltip" data-placement="top" title="ফেরৎ প্রদান" data-original-title="ফেরৎ প্রদান">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                                    </span>
                                                                </Button>} */}
                                                                {permissionData.role === '16' && <Button className='m-0 p-1' type="button" onClick={() => handleRejectClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
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
                                    </Table>
                                </Row>
                                <Row className='d-flex justify-content-center m-0 p-2'>
                                    <Col md={5}>
                                        <Button disabled variant="btn btn-link"><span className={styles.SiyamRupaliFont}>{InputValidation.E2BDigit(((currentPage - 1) * rowsPerPage) + 1)} থেকে {currentPage * rowsPerPage > subjectList.length ? InputValidation.E2BDigit(subjectList.length) : InputValidation.E2BDigit(currentPage * rowsPerPage)} পর্যন্ত</span></Button>
                                    </Col>
                                    <Col md={2} className='text-center'>
                                        <Button className='m-0 p-2' type="button" onClick={() => setSubjectList(false)} variant="btn btn-outline-warning" data-toggle="tooltip" data-placement="top" title="ফিরে যান" data-original-title="ফিরে যান">
                                            ফিরে যান
                                        </Button>
                                    </Col>
                                    {/* <Col md={2} className='text-center'>
                                        <Button className='m-0 p-2' type="button" onClick={() => handleUpdateClick(true)} variant="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="নতুন এন্ট্রি" data-original-title="নতুন এন্ট্রি">
                                            নতুন এন্ট্রি
                                        </Button>
                                    </Col> */}
                                    <Col md={5} className='d-flex justify-content-center gap-1'>
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
                            <Row className='m-0 p-2 justify-content-center'>
                                {!subjectList?.length && <>
                                    <Col md={8} className='py-3 text-center'>
                                        <span className="text-center text-secondary fs-6">পরীক্ষার নামঃ
                                            {userData.id_exam === '03' && " নিম্নমাধ্যমিক স্কুল সার্টিফিকেট (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '04' && " নিম্নমাধ্যমিক বৃত্তি পরীক্ষা (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '05' && " মাধ্যমিক স্কুল সার্টিফিকেট (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '06' && " মাধ্যমিক বৃত্তি পরীক্ষা (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '07' && " উচ্চমাধ্যমিক স্কুল সার্টিফিকেট (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '08' && " উচ্চমাধ্যমিক বৃত্তি  পরীক্ষা (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '09' && " ষষ্ট শ্রেণীর সমাপনী পরীক্ষা (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                            {userData.id_exam === '10' && " সপ্তম শ্রেণীর সমাপনী পরীক্ষা (" + InputValidation.E2BDigit(userData.ex_year) + ")"}
                                        </span>
                                    </Col>
                                    <Col md={8} className='text-center d-flex justify-content-center align-items-center gap-3'>
                                        <Button className='m-0 p-2 flex-fill' type="button" onClick={() => setSubjectList(false)} variant="btn btn-outline-warning" data-toggle="tooltip" data-placement="top" title="ফিরে যান" data-original-title="ফিরে যান">
                                            ফিরে যান
                                        </Button>
                                        {permissionData.role === '13' && <Button className='m-0 p-2 flex-fill' type="button" onClick={() => handleUpdateClick(exmData)} variant="btn btn-outline-primary" data-toggle="tooltip" data-placement="top" title="নতুন এন্ট্রি" data-original-title="নতুন এন্ট্রি">
                                        নতুন এন্ট্রি
                                    </Button>}
                                    </Col>
                                </>}
                                <Col md={12} className='d-flex justify-content-around align-item-center gap-3 py-3'>
                                    {subjectList?.length && <>
                                        {permissionData.role === '16' && <Button className='m-0 p-2 flex-fill' type="button" onClick={() => handleRejectClick(exmData)} variant="btn btn-outline-danger" data-toggle="tooltip" data-placement="top" title="বাতিল করুন" data-original-title="বাতিল করুন">
                                            বাতিল করুন
                                        </Button>}
                                        {permissionData.role !== '13' && <Button className='m-0 p-2 flex-fill' type="button" onClick={() => handleSendBackClick(exmData)} variant="btn btn-outline-warning" data-toggle="tooltip" data-placement="top" title="ফেরৎ প্রদান" data-original-title="ফেরৎ প্রদান">
                                            ফেরৎ প্রদান
                                        </Button>}
                                        <Button className='m-0 p-2 flex-fill' type="button" onClick={() => handleListClick(subjectList)} variant="btn btn-outline-secondary" data-toggle="tooltip" data-placement="top" title="প্রিন্ট করুন" data-original-title="প্রিন্ট করুন">
                                            প্রিন্ট করুন
                                        </Button>
                                        <Button className='m-0 p-2 flex-fill' type="button" onClick={() => handleAuthorizeClick(exmData)} variant="btn btn-outline-success" data-toggle="tooltip" data-placement="top">
                                            {permissionData.role === '13' ? "প্রেরণ করুন" : "অনুমোদন করুন"}
                                        </Button>
                                    </>}
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {listDetails && (
                <Modal
                    show={listShow}
                    onHide={() => setListShow(false)}
                    backdrop="static"
                    keyboard={false}
                    fullscreen={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <SubjectListPrint
                            navigateSubjectListPrint={listShow}
                            setNavigateSubjectListPrint={setListShow}
                            printData={listDetails}
                        />
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )}
            {activeAppDetails && (
                <Modal
                    show={detailsShow}
                    onHide={() => setDetailsShow(false)}
                    backdrop="static"
                    keyboard={false}
                    fullscreen={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <SubjectDetails
                            navigateSubjectDetails={detailsShow}
                            setNavigateSubjectDetails={setDetailsShow}
                            printData={activeAppDetails}
                        />
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )}
            {activeAppUpdate && (
                <Modal
                    show={updateShow}
                    onHide={() => setUpdateShow(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <SubjectAppForm
                            userData={userData}
                            setUserData={setUserData}
                            status={status}
                            setStatus={setStatus}
                            setHide={setUpdateShow}
                            subjectList={subjectList}
                            setSubjectList={setSubjectList}
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
                            <h4 className={'text-center'}>বিষয়/বিষয়গুলো অনুমোদন করতে চান?</h4>
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
                                        isInvalid={validated && !!userDataError.comment}
                                        isValid={validated && activeAppAuthorize.comment && !userDataError.comment}
                                        onChange={
                                            (e) => {
                                                setActiveAppAuthorize((prev) => ({ ...prev, comment: e.target.value }));
                                                setUserDataError((prev) => ({ ...prev, comment: '' }));
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
                            {permissionData.role === '13' ? 'প্রেরণ করুন' : 'অনুমোদন করুন'}
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
                            <h4 className={'text-center'}>বিষয়/বিষয়গুলো বাতিল করতে চান?</h4>
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
                                    isValid={validated && activeAppReject.comment && !userDataError.comment}
                                    onChange={
                                        (e) => {
                                            setActiveAppReject((prev) => ({ ...prev, comment: e.target.value }));
                                            setUserDataError((prev) => ({ ...prev, comment: '' }));
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
            {activeAppSendBack && (
                <Modal
                    show={sendBackShow}
                    onHide={() => setSendBackShow(false)}
                    backdrop="static"
                    keyboard={false}
                >
                    <Modal.Header closeButton>
                        <Modal.Title className={'text-center'}>
                            <h4 className={'text-center'}>বিষয়/বিষয়গুলো হালনাগাদের জন্য ফেরৎ পাঠাতে চান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate>
                            <Col className='my-2' md={12}>
                                <Form.Label htmlFor="institute_message" className='fw-bold'>ফেরৎ পাঠানোর কারণ উল্লেখ করুনঃ </Form.Label>
                                <Form.Control
                                    as="textarea"
                                    className='bg-transparent text-uppercase w-100'
                                    maxLength={240}
                                    id="institute_message"
                                    placeholder='ফেরৎ পাঠানোর কারণ উল্লেখ করুন'
                                    value={activeAppSendBack.comment}
                                    isInvalid={validated && !!userDataError.comment}
                                    isValid={validated && activeAppSendBack.comment && !userDataError.comment}
                                    onChange={
                                        (e) => {
                                            setActiveAppSendBack((prev) => ({ ...prev, comment: e.target.value }));
                                            setUserDataError((prev) => ({ ...prev, comment: '' }));
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
                        <Button className='flex-fill' variant="btn btn-outline-primary" onClick={() => setSendBackShow(false)}>
                            ফিরে যান
                        </Button>
                        <Button className='flex-fill' variant="btn btn-outline-danger" onClick={() => applicationSendBack(activeAppSendBack)}>
                            ফেরৎ পাঠান
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment>
    )

    if (optionExamList && (permissionData.office === '03' || permissionData.office === '04' || permissionData.office === '05')) return (
        <Fragment>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <h4 className={"text-center text-uppercase w-100 card-title"}>রেজিস্ট্রেশন/পরীক্ষার বিষয়সমূহ</h4>
                        </Card.Body>
                        <Card.Footer>
                            <Row className='justify-content-center'>
                                <Col md={8}>
                                    <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                                        <Row>
                                            <Col md={12}>
                                                <h5 className="text-center w-100 card-title">রেজিস্ট্রেশন/পরীক্ষার তথ্য</h5>
                                            </Col>
                                            <Col md={12}>
                                                {status.loading && <h6 className="text-center card-title w-100 text-info">{status.loading}</h6>}
                                                {status.error && <h6 className="text-center card-title w-100 text-danger">{status.error}</h6>}
                                                {status.success && <h6 className="text-center card-title w-100 text-success">{status.success}</h6>}
                                            </Col>
                                            <Col md={4} className='my-2'>
                                                <Form.Label className="text-primary" htmlFor="ex_year">সেশন/বছর</Form.Label>
                                                <Form.Control
                                                    className='bg-transparent text-uppercase'
                                                    type="text"
                                                    id="ex_year"
                                                    maxLength={4} minLength={4}
                                                    value={userData.ex_year}
                                                    isInvalid={validated && !!userDataError.ex_year}
                                                    isValid={validated && userData.ex_year && !userDataError.ex_year}
                                                    onChange={(e) => handleDataChange('ex_year', e.target.value)}
                                                />
                                                {validated && userDataError.ex_year && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {userDataError.ex_year}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Col>
                                            <Col md={8} className='my-2'>
                                                <Form.Group className="bg-transparent">
                                                    <Form.Label className="text-primary" htmlFor='id_exam'>পরীক্ষার নাম</Form.Label>
                                                    <Select
                                                        inputId="id_exam"
                                                        placeholder="--পরীক্ষার নাম সিলেক্ট করুন--"
                                                        value={
                                                            optionExamList.find(opt => opt.value === userData.id_exam) || null
                                                        }
                                                        onChange={(value) =>
                                                            value ? handleDataChange('id_exam', value.value) : handleDataChange('id_exam', '')
                                                        }
                                                        options={optionExamList}
                                                        isClearable={true}
                                                        isSearchable={true}
                                                    />
                                                    {validated && userDataError.id_exam && (
                                                        <p className='text-danger'>
                                                            {userDataError.id_exam}
                                                        </p>
                                                    )}
                                                </Form.Group>
                                            </Col>
                                            <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                                                <Button className='flex-fill' type="reset" variant="btn btn-outline-danger">রিসেট</Button>
                                                <Button className='flex-fill' type="submit" variant="btn btn-outline-success">সাবমিট</Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>
                            </Row>
                        </Card.Footer>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default SubjectAppProcess;