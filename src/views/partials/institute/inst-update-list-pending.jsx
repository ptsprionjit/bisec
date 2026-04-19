import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as InputValidation from '../input_validation'

import InstituteUpdatePrint from './print/inst-update-print'
import { BiReceipt } from "react-icons/bi";

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InstituteUpdatePending = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    // Check Permission data
    useEffect(() => {
        if (loading) return;

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        } else {
            if (!(((permissionData?.office === '04' || permissionData?.office === '05') && (permissionData?.role === '13' || permissionData?.role === '14' || permissionData?.role === '15')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18')) {
                navigate("errors/error403", { replace: true });
            } else {
                fetchDataList();
            }
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    const [activeAppDetails, setActiveAppDetails] = useState([]);
    const [activeAppMessage, setActiveAppMessage] = useState([]);
    const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);
    const [activeAppReject, setActiveAppReject] = useState([]);
    const [activeAppSendBack, setActiveAppSendBack] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);
    const [messageShow, setMessageShow] = useState(false);
    const [authShow, setAuthShow] = useState(false);
    const [rejShow, setRejShow] = useState(false);
    const [sendBackShow, setSendBackShow] = useState(false);

    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    //Fetched Data
    const [dataList, setDataList] = useState([]);
    const [dataMsg, setDataMsg] = useState([]);

    const [listGroupSubject, setListGroupSubject] = useState(false);

    const [groupList, setGroupList] = useState(false);
    const [subjectList, setSubjectList] = useState(false);
    const [listShift, setListShift] = useState(false);

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // Data Variables
    const [userData, setUserData] = useState({
        id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', message: '', bn_message: ''
    });

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
            [item.id_institute, item.en_institute, item.bn_institute, item.id_group_06, item.id_sub_06, item.id_group_08, item.id_sub_08, item.id_group_09, item.id_sub_09, item.id_group_11, item.id_sub_11, item.bn_app_status, item.en_app_status, item.bn_payment, item.en_payment.toString()].some((field) =>
                String(field).toUpperCase().includes(search)
            )
        );
    }, [debouncedSearchValue, currentData, dataList]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Message Data
    const fetchMsgData = async (item) => {
        // setStatus({ loading: "তথ্য সংগ্রহ করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/messages/list`, { userData: { id_invoice: item.id_invoice } });
            if (response.status === 200) {
                // setStatus({ loading: false, success: true, error: false });
                setDataMsg(response.data.msgList);
            } else {
                setStatus({ loading: false, success: false, error: response.data.message });
                setDataMsg([]);
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setDataMsg([]);
            setStatus({ loading: false, success: false, error: err.response.data.message });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    }

    // Fetch EIIN Data
    const fetchEiinData = async (item) => {
        // setStatus({ loading: "তথ্য সংগ্রহ করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/institute/data/list`, { userData: { id_institute: item.id_institute } });
            if (response.status === 200) {
                setStatus({ loading: false, success: true, error: false });
                setListGroupSubject(response.data.listGroupSubject);
            } else {
                setStatus({ loading: false, success: false, error: response.data.message });
                setListGroupSubject([]);
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

    //Data Fetch 
    const fetchDataList = async () => {
        setStatus({ loading: "তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });
        try {
            const response = await axiosApi.post(`/institute/update/list`);
            if (response.status === 200) {
                setStatus({ loading: false, success: response.data.message, error: false });
                setDataList(response.data.listApplication);
                setGroupList(response.data.listGroup);
                setSubjectList(response.data.listSubject);
                setListShift(response.data.listShift);

                //Set Data for Pagination
                setRowsPerPage(10);
                setTotalPage(Math.ceil(response.data.listApplication.length / 10));
                setCurrentPage(1);
                setCurrentData(response.data.datlistApplicationa.slice(0, 10));
            } else {
                setStatus({ loading: false, success: false, error: response.data.message });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setStatus({ loading: "কোন তথ্য পাওয়া যায়নি!", success: false, error: false });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    }

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
    const applicationForward = async (appData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'bn_message'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'bn_message':
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
            setStatus({ loading: false, success: false, error: "মন্তব্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে...। অপেক্ষা করুন।", success: false, error: false });

            try {
                const response = await axiosApi.post(`/institute/update/authorize`, { userData: { id_invoice: appData.id_invoice, bn_message: userData.bn_message } });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== appData.id_invoice)));
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
    const applicationReject = async (appData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'bn_message'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'bn_message':
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
            setStatus({ loading: false, success: false, error: "মন্তব্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে...। অপেক্ষা করুন।", success: false, error: false });
            try {
                const response = await axiosApi.post(`/institute/update/reject`, { userData: { id_invoice: appData.id_invoice, bn_message: userData.bn_message } });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== appData.id_invoice)));
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

    //Application SendBack
    const applicationSendBack = async (appData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'bn_message'
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'bn_message':
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

        console.log(newErrors);

        // Update once
        setUserDataError(newErrors);

        if (!isValid) {
            setStatus({ loading: false, success: false, error: "মন্তব্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে...। অপেক্ষা করুন।", success: false, error: false });

            try {
                const response = await axiosApi.post(`/institute/update/sendback`, { userData: { id_invoice: appData.id_invoice, bn_message: userData.bn_message } });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== appData.id_invoice)));
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

    //Handle Details Click
    const handleDetailsClick = async (item) => {
        await fetchEiinData(item);
        setActiveAppDetails(item);
        setDetailsShow(true);
    };

    //Handle Message Click
    const handleMessageClick = async (item) => {
        await fetchMsgData(item);
        setActiveAppMessage(item);
        setMessageShow(true);
    };

    //Handle Authorize Click
    const handleForwardClick = (item) => {
        setUserData((prev) => ({ ...prev, bn_message_default: '', bn_message: '' }));
        setActiveAppAuthorize(item);
        setAuthShow(true);
    };

    //Handle Reject Click
    const handleRejectClick = (item) => {
        setUserData((prev) => ({ ...prev, bn_message_default: '', bn_message: '' }));
        setActiveAppReject(item);
        setRejShow(true);
    };

    //Handle SendBack Click
    const handleSendBackClick = (item) => {
        setUserData((prev) => ({ ...prev, bn_message_default: '', bn_message: '' }));
        setActiveAppSendBack(item);
        setSendBackShow(true);
    };

    // Handle User Data Change
    const handleDataChange = (dataName, dataValue) => {
        setUserData({ ...userData, [dataName]: dataValue.toUpperCase() });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    return (
        <Fragment>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                <h4 className={"card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের প্রতিষ্ঠানের নতুন শিফট/শাখা/বিভাগ/বিষয় খোলার অপেক্ষমান আবেদনসমূহ</h4>
                                {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                                {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                                {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                            </div>
                        </Card.Header>
                        <Card.Body className="m-0 p-2">
                            {dataList.length > 0 && <>
                                <Row className='justify-content-between align-items-center px-4'>
                                    <Col md="3">
                                        <Form.Label className="text-start w-100" htmlFor="per_page_data">প্রতি পাতায় আবেদন সংখ্যা (সর্বমোট আবেদনঃ {InputValidation.E2BDigit(dataList.length)})</Form.Label>
                                        <Form.Select
                                            id="per_page_data"
                                            value={rowsPerPage}
                                            onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                        >
                                            <option disabled value="" className={"text-center"}>--আবেদন সংখ্যা সিলেক্ট করুন--</option>
                                            <option value="10">১০</option>
                                            <option value="20">২০</option>
                                            <option value="50">৫০</option>
                                            <option value="100">১০০</option>
                                        </Form.Select>
                                    </Col>
                                    <Col md="3">
                                        <Form.Label className='text-end w-100' htmlFor="search_info">আবেদন খুঁজতে নিচের বক্সে লিখুন</Form.Label>
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
                            <Row className="d-flex flex-row justify-content-between align-items-center m-4">
                                <Table className="table table-bordered border-dark">
                                    <thead>
                                        <tr className='table-primary table-bordered border-dark'>
                                            <th className='text-center align-top text-wrap p-0 m-0'>
                                                ক্রমিক
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                প্রতিষ্ঠানের নাম
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p>ষষ্ট শ্রেণী</p>
                                                <p>শিফট, শাখা, বিভাগ ও বিষয়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p>জেএসসি</p>
                                                <p>শিফট, শাখা, বিভাগ ও বিষয়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p>এসএসসি</p>
                                                <p>শিফট, শাখা, বিভাগ ও বিষয়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                <p>এইচএসসি</p>
                                                <p>শিফট, শাখা, বিভাগ ও বিষয়</p>
                                            </th>
                                            <th className='text-center align-top text-wrap p-1 m-0'>
                                                সর্বশেষ অবস্থা
                                            </th>
                                            <th className='text-center align-top text-wrap p-0 m-0'>
                                                সম্পাদনা
                                            </th>
                                        </tr>
                                    </thead>
                                    {dataList.length > 0 && <>
                                        <tbody>
                                            {
                                                filteredData.map((item, idx) => (
                                                    <tr key={idx}>
                                                        <td className='text-center align-top text-wrap'>{InputValidation.E2BDigit(idx + 1)}</td>
                                                        <td className='text-center align-top text-wrap'>
                                                            <p className={"text-wrap p-1 m-0"}>{item.bn_isntitute ? item.bn_isntitute : item.en_isntitute}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            {item.id_shift_06 ? item.id_shift_06.split(',').map((id_shift) => {
                                                                const match = listShift.find(item => item.id_shift === id_shift);
                                                                return match?.bn_shift + ", " || '';
                                                            }) : ''}<br />

                                                            {item.id_section_06 ? String(item.id_section_06).toLocaleUpperCase() : ''}<br />

                                                            {item?.id_group_06 && item.id_group_06.split(',').map((id_group) => {
                                                                const match = groupList.find(item => item.id_group === id_group);
                                                                return match?.bn_group + ", " || '';
                                                            })}
                                                            <p className={"text-wrap p-1 m-0"}>{InputValidation.E2BDigit(item.id_sub_06 ? item.id_sub_06 : '')}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            {item.id_shift_08 ? item.id_shift_08.split(',').map((id_shift) => {
                                                                const match = listShift.find(item => item.id_shift === id_shift);
                                                                return match?.bn_shift + ", " || '';
                                                            }) : ''}<br />

                                                            {item.id_section_08 ? String(item.id_section_08).toLocaleUpperCase() : ''}<br />

                                                            {item?.id_group_08 && item.id_group_08.split(',').map((id_group) => {
                                                                const match = groupList.find(item => item.id_group === id_group);
                                                                return match?.bn_group + ", " || '';
                                                            })}
                                                            <p className={"text-wrap p-1 m-0"}>{InputValidation.E2BDigit(item.id_sub_08 ? item.id_sub_08 : '')}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            {item.id_shift_09 ? item.id_shift_09.split(',').map((id_shift) => {
                                                                const match = listShift.find(item => item.id_shift === id_shift);
                                                                return match?.bn_shift + ", " || '';
                                                            }) : ''}<br />

                                                            {item.id_section_09 ? String(item.id_section_09).toLocaleUpperCase() : ''}<br />

                                                            {item?.id_group_09 && item.id_group_09.split(',').map((id_group) => {
                                                                const match = groupList.find(item => item.id_group === id_group);
                                                                return match?.bn_group + ", " || '';
                                                            })}
                                                            <p className={"text-wrap p-1 m-0"}>{InputValidation.E2BDigit(item.id_sub_09 ? item.id_sub_09 : '')}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            {item.id_shift_11 ? item.id_shift_11.split(',').map((id_shift) => {
                                                                const match = listShift.find(item => item.id_shift === id_shift);
                                                                return match?.bn_shift + ", " || '';
                                                            }) : ''}<br />

                                                            {item.id_section_11 ? String(item.id_section_11).toLocaleUpperCase() : ''}<br />

                                                            {item?.id_group_11 && item.id_group_11.split(',').map((id_group) => {
                                                                const match = groupList.find(item => item.id_group === id_group);
                                                                return match?.bn_group + ", " || '';
                                                            })}
                                                            <p className={"text-wrap p-1 m-0"}>{InputValidation.E2BDigit(item.id_sub_11 ? item.id_sub_11 : '')}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            <p className={"text-wrap p-1 m-0"}>{item.id_payment === '03' ? item.bn_app_status : item.bn_payment}</p>
                                                            <Button type="button" className='w-100 text-nowrap p-2 m-0' variant="btn btn-outline-info" onClick={() => handleMessageClick(item)}>মন্তব্য</Button>
                                                        </td>
                                                        <td className='text-center text-wrap'>
                                                            <div className="d-flex justify-content-evenly align-items-center flex-wrap gap-3">
                                                                {item.id_status === permissionData.role && <Button className='m-0 p-1' type="button" onClick={() => handleForwardClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="অনুমোদন" data-original-title="অনুমোদন">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                {/* {Number(permissionData.role) >= 16 && <Button className='m-0 p-1' type="button" onClick={() => handleInqueryClick(item)} variant="btn btn-info" data-toggle="tooltip" data-placement="top" title="তদন্তের জন্য প্রেরণ" data-original-title="তদন্তের জন্য প্রেরণ">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-search-icon lucide-calendar-search"><path d="M16 2v4" /><path d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25" /><path d="m22 22-1.875-1.875" /><path d="M3 10h18" /><path d="M8 2v4" /><circle cx="18" cy="18" r="3" /></svg>
                                                                </Button>} */}
                                                                <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                    </span>
                                                                </Button>
                                                                {item.id_payment === '03' && <>
                                                                    <Button className='m-0 p-1' type="button" onClick={() => window.open(`${FRONTEND_URL}/payment/response/success?prev_location=/institute/update/app/list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')} variant="btn btn-info" data-toggle="tooltip" data-placement="top" title="পেমেন্ট ভাউচার" data-original-title="পেমেন্ট ভাউচার">
                                                                        <BiReceipt color='true' size={'24px'} />
                                                                    </Button>
                                                                </>}
                                                                {item.id_status === permissionData.role && Number(item.id_status) > 13 && Number(item.id_status) < 17 && <Button className='m-0 p-1' type="button" onClick={() => handleSendBackClick(item)} variant="btn btn-warning" data-toggle="tooltip" data-placement="top" title="ফের‌ৎ পাঠানো" data-original-title="ফেরৎ পাঠানো">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeধinecap="round" strokeধinejoin="round" className="lucide lucide-undo2-icon lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                {Number(permissionData.role) >= 16 && <Button className='m-0 p-1' type="button" onClick={() => handleRejectClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
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
                            {dataList.length > 0 && <>
                                <Row className='d-flex justify-content-between align-items-center px-4'>
                                    <Col md="8">
                                        <Button className='flex-fill text-start' disabled variant="btn btn-link"><span className={styles.SiyamRupaliFont}>আবেদন {InputValidation.E2BDigit(((currentPage - 1) * rowsPerPage) + 1)} থেকে {InputValidation.E2BDigit(currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage)} পর্যন্ত</span></Button>
                                    </Col>
                                    <Col md="4" className='d-flex justify-content-center gap-1'>
                                        <Button className='flex-fill' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>
                                        <Button className='flex-fill' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>
                                        {currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{InputValidation.E2BDigit(currentPage - 1)}</Button>}
                                        <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-primary">{InputValidation.E2BDigit(currentPage)}</Button>
                                        {totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{InputValidation.E2BDigit(currentPage + 1)}</Button>}
                                        <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">"}</Button>
                                        <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill' variant="btn btn-light">{">>"}</Button>
                                    </Col>
                                </Row>
                            </>}
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
                        <InstituteUpdatePrint
                            listGroupSubject={listGroupSubject}
                            applicationData={activeAppDetails}
                            groupList={groupList}
                            subjectList={subjectList}
                            listShift={listShift}
                            setShow={setDetailsShow}
                        />
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )}
            {activeAppMessage && (
                <Modal
                    show={messageShow}
                    onHide={() => setMessageShow(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton>
                        <Modal.Title className={'text-center w-100'}>
                            <h4 className={'text-center text-primary'}>আবেদন হালনাগাদের বিস্তারিত তথ্য</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {dataMsg.length > 0 && <Table className='table table-bordered border-dark'>
                            <tbody>
                                <tr>
                                    <td className='align-top text-center p-2 m-0 text-secondary'>ক্রমিক</td>
                                    <td className='align-top text-center p-2 m-0 text-secondary'>ইউজার</td>
                                    <td className='align-top text-center p-2 m-0 text-secondary'>মন্তব্য</td>
                                    <td className='align-top text-center p-2 m-0 text-secondary'>সময়</td>
                                </tr>
                                {dataMsg.map((msg, idx) => (
                                    <tr key={idx}>
                                        <td className='align-top text-center p-2 m-0'>{InputValidation.E2BDigit(idx + 1)}</td>
                                        <td className='align-top text-left p-2 m-0'>{msg.id_user}</td>
                                        <td className='align-top text-center p-2 m-0 text-wrap'>{msg.bn_message ? msg.bn_message : msg.en_message}</td>
                                        <td className='align-top text-center p-2 m-0 text-wrap'>{InputValidation.E2BDigit(msg.dt_message)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="btn btn-outline-secondary" onClick={() => setMessageShow(false)}>
                            ফিরে যান
                        </Button>
                    </Modal.Footer>
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
                        <Modal.Title className={' text-center'}>
                            <h4 className={' text-center'}>আবেদন অনুমোদন করতে চান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form noValidate>
                            <Col className='my-2' md={12}>
                                <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='bn_message_default'>মন্তব্য</Form.Label>
                                    <Form.Select
                                        id="bn_message_default"
                                        value={userData.bn_message_default}
                                        isInvalid={validated && !!userDataError.bn_message_default}
                                        isValid={validated && userData.bn_message_default && !userDataError.bn_message_default}
                                        onChange={
                                            (e) => {
                                                setUserData((prev) => ({ ...prev, 'bn_message_default': e.target.value, 'bn_message': e.target.value }));
                                            }
                                        }
                                        className="selectpicker form-control"
                                        data-style="py-0"
                                    >
                                        <option value=''>-- মন্তব্য সিলেক্ট করুন --</option>
                                        {(permissionData.role !== '16' || permissionData.role === '17') && <>
                                            <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়েছে। আবেদনটি অনুমোদনের জন্য উত্থাপন করা হলো।</option>
                                            {/* <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়েছে। আবেদনটি তদন্তের জন্য উত্থাপন করা হলো।</option> */}
                                            <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়নি বিধায় আবেদনটি বাতিলের জন্য উত্থাপন করা হলো।</option>
                                        </>}
                                        {(permissionData.role === '16' || permissionData.role === '17') && <>
                                            <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক তদন্ত প্রতিবেদনের সাপেক্ষে আবেদনটি সন্তোষজনক বলে প্রতিয়মান হয়েছে। অনুমোদন কমিটির সভায় সর্বসম্মতিক্রমে আবেদনটি গৃহীত হওয়ায় চূড়ান্ত অনুমোদন প্রদান করা হলো</option>
                                        </>}
                                        <option value='_'>অন্যান্য (বক্সে লিখুন)!</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='my-2' md={12}>
                                <Form.Control
                                    as="textarea"
                                    className='bg-transparent text-uppercase w-100'
                                    maxLength={240}
                                    id="bn_message"
                                    value={userData.bn_message}
                                    isInvalid={validated && !!userDataError.bn_message}
                                    isValid={validated && userData.bn_message && !userDataError.bn_message}
                                    onChange={(e) => handleDataChange('bn_message', e.target.value)}
                                    rows={5}
                                />
                                {validated && userDataError.bn_message && (
                                    <Form.Control.Feedback type="invalid">
                                        {userDataError.bn_message}
                                    </Form.Control.Feedback>
                                )}
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="btn btn-outline-success" onClick={() => applicationForward(activeAppAuthorize)}>
                            অনুমোদন করুন
                        </Button>
                        <Button variant="btn btn-outline-secondary" onClick={() => setAuthShow(false)}>
                            ফিরে যান
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
                        <Modal.Title className={' text-center'}>
                            <h4 className={' text-center'}>আবেদন বাতিল করতে চান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><span className={styles.SiyamRupaliFont}>আবেদনের সকল তথ্য যাচাইয়ের পর সঠিক মন্তব্য লিখে আবেদন বাতিল করুন।</span></p>
                        <Form noValidate>
                            <Col className='my-2' md={12}>
                                <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='bn_message_default'>মন্তব্য</Form.Label>
                                    <Form.Select
                                        id="bn_message_default"
                                        value={userData.bn_message_default}
                                        isInvalid={validated && !!userDataError.bn_message_default}
                                        isValid={validated && userData.bn_message_default && !userDataError.bn_message_default}
                                        onChange={
                                            (e) => {
                                                setUserData((prev) => ({ ...prev, 'bn_message_default': e.target.value, 'bn_message': e.target.value }));
                                            }
                                        }
                                        className="selectpicker form-control"
                                        data-style="py-0"
                                    >
                                        <option value=''>-- মন্তব্য সিলেক্ট করুন --</option>
                                        <option>প্রাথমিক তথ্য যাচাইয়ের পর আবেদনটি সন্তোষজনক বলে প্রতিয়মান হয়নি এবং অনুমোদন কমিটির সভায় বাতিল হওয়ায় আবেদনটি বাতিল করা হলো</option>
                                        <option value='_'>অন্যান্য (বক্সে লিখুন)!</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='my-2' md={12}>
                                <Form.Control
                                    as="textarea"
                                    className='bg-transparent text-uppercase w-100'
                                    maxLength={240}
                                    id="bn_message"
                                    value={userData.bn_message}
                                    isInvalid={validated && !!userDataError.bn_message}
                                    isValid={validated && userData.bn_message && !userDataError.bn_message}
                                    onChange={(e) => handleDataChange('bn_message', e.target.value)}
                                    rows={5}
                                />
                                {validated && userDataError.bn_message && (
                                    <Form.Control.Feedback type="invalid">
                                        {userDataError.bn_message}
                                    </Form.Control.Feedback>
                                )}
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="btn btn-outline-danger" onClick={() => applicationReject(activeAppReject)}>
                            বাতিল করুন
                        </Button>
                        <Button variant="btn btn-outline-secondary" onClick={() => setRejShow(false)}>
                            ফিরে যান
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
                        <Modal.Title className={' text-center'}>
                            <h4 className={' text-center'}>আবেদন হালনাগাদের জন্য ফেরৎ প্রদান?</h4>
                            {status.error && <h6 className={"text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success flex-fill py-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p><span className={styles.SiyamRupaliFont}>সঠিক মন্তব্য লিখে ফেরৎ প্রদান করুন।</span></p>
                        <Form noValidate>
                            <Col className='my-2' md={12}>
                                <Form.Group className="bg-transparent">
                                    <Form.Label className="text-primary" htmlFor='bn_message_default'>মন্তব্য</Form.Label>
                                    <Form.Select
                                        id="bn_message_default"
                                        value={userData.bn_message_default}
                                        isInvalid={validated && !!userDataError.bn_message_default}
                                        isValid={validated && userData.bn_message_default && !userDataError.bn_message_default}
                                        onChange={
                                            (e) => {
                                                setUserData((prev) => ({ ...prev, 'bn_message_default': e.target.value, 'bn_message': e.target.value }));
                                            }
                                        }
                                        className="selectpicker form-control"
                                        data-style="py-0"
                                    >
                                        <option value=''>-- মন্তব্য সিলেক্ট করুন --</option>
                                        <option>প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করে হালনাগাদ আবেদন উপস্থাপন করুন!</option>
                                        {/* <option>সংযুক্তিগুলো সঠিকভাবে আবেদনের সাথে সংযুক্ত করে হালনাগাদ আবেদন উপস্থাপন করুন!</option> */}
                                        <option>বোর্ড নির্ধারিত আবেদন ফি প্রদানের পর হালনাগাদ আবেদন উপস্থাপন করুন!</option>
                                        <option value='_'>অন্যান্য (বক্সে লিখুন)!</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                            <Col className='my-2' md={12}>
                                <Form.Control
                                    as="textarea"
                                    className='bg-transparent text-uppercase w-100'
                                    maxLength={240}
                                    id="bn_message"
                                    value={userData.bn_message}
                                    isInvalid={validated && !!userDataError.bn_message}
                                    isValid={validated && userData.bn_message && !userDataError.bn_message}
                                    onChange={(e) => handleDataChange('bn_message', e.target.value)}
                                    rows={5}
                                />
                                {validated && userDataError.bn_message && (
                                    <Form.Control.Feedback type="invalid">
                                        {userDataError.bn_message}
                                    </Form.Control.Feedback>
                                )}
                            </Col>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="btn btn-outline-warning" onClick={() => applicationSendBack(activeAppSendBack)}>
                            ফেরৎ পাঠান
                        </Button>
                        <Button variant="btn btn-outline-secondary" onClick={() => setSendBackShow(false)}>
                            ফিরে যান
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Fragment >
    )
}

export default InstituteUpdatePending;