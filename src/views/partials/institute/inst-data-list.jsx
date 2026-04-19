import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as InputValidation from '../input_validation'

import InstituteUpdatePrint from './print/inst-update-print'
// import InstShiftsApp from './application/shifts-app'
import { HiOutlineCurrencyBangladeshi } from "react-icons/hi";
import { BiReceipt } from "react-icons/bi";

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InstituteData = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    // Check Permission data
    useEffect(() => {
        if (loading) return;

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        } else {
            if (!(permissionData.type === '13' || permissionData.role === '17')) {
                navigate("errors/error403", { replace: true });
            } else {
                fetchDataList();
            }
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    const [activeAppDetails, setActiveAppDetails] = useState([]);
    // const [activeAppUpdate, setActiveAppUpdate] = useState([]);
    const [activeAppPay, setActiveAppPay] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);
    // const [updateShow, setUpdateShow] = useState(false);
    const [payShow, setPayShow] = useState(false);

    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    //Student Fetched Data
    const [dataList, setDataList] = useState([]);

    const [listGroupSubject, setListGroupSubject] = useState(false);

    const [groupList, setGroupList] = useState(false);
    const [subjectList, setSubjectList] = useState(false);
    const [listShift, setListShift] = useState(false);
    const [feeData, setFeeData] = useState(false);
    const [feeDataMap, setFeeDataMap] = useState(false);

    const [totalFee, setTotalFee] = useState({ shifts: 0, sections: 0, groups: 0, subjects: 0 });

    //Pagination
    const [totalPage, setTotalPage] = useState();
    const [currentPage, setCurrentPage] = useState();
    const [rowsPerPage, setRowsPerPage] = useState();
    const [currentData, setCurrentData] = useState([]);
    const [searchValue, setSearchValue] = useState();

    useEffect(() => {
        if (dataList.length > 0) {
            setCurrentData(dataList.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > dataList.length ? dataList.length : currentPage * rowsPerPage));
            setTotalPage(Math.ceil(dataList.length / rowsPerPage));
        }
    }, [dataList]);// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (feeData.length) {
            const feeDataMap = feeData.reduce((acc, fee) => {
                acc[fee.id_fee] = fee;
                return acc;
            }, {});
            setFeeDataMap(feeDataMap);
        }
    }, [feeData]);// eslint-disable-line react-hooks/exhaustive-deps

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

    //Data Fetch 
    const fetchDataList = async () => {
        setStatus({ loading: "তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });
        try {
            const response = await axiosApi.post(`/institute/update/list/eiin`);
            if (response.status === 200) {
                setStatus({ loading: false, success: response.data.message, error: false });
                setListGroupSubject(response.data.listGroupSubject);
                setDataList(response.data.listApplication);
                setGroupList(response.data.listGroup);
                setSubjectList(response.data.listSubject);
                setListShift(response.data.listShift);
                setFeeData(response.data.feeData);

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

    // Application Fee Payment
    const appFeePayment = async (appData) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = [
            'id_application', 'id_invoice',
        ];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'id_application':
                    dataError = InputValidation.numberCheck(appData[field]);
                    break;

                case 'id_invoice':
                    dataError = appData[field] ? InputValidation.alphanumCheck(appData[field]) : false;
                    break;

                default:
                    break;
            }

            if (dataError) {
                newErrors[field] = dataError;
                isValid = false;
            }
        });

        if (!isValid) {
            setStatus({ loading: false, success: false, error: "তথ্য সঠিকভাবে পূরণ করতে হবে!" });
        } else {
            setStatus({ loading: "সম্পাদনা চলছে...। অপেক্ষা করুন।", success: false, error: false });

            try {
                const response = await axiosApi.post(`/institute/update/payment/`, {
                    userData: { id_application: appData.id_application, id_invoice: appData.id_invoice || false }
                });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    window.location.href = response.data.apiData.RedirectToGateway;
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

    // Handle Update Click
    // const handleUpdateClick = (item) => {
    //     const examMap = {
    //         '06': '09',
    //         '08': '03',
    //         '09': '05',
    //         '11': '07',
    //     };

    //     const newItem = { ...item };

    //     Object.keys(newItem).forEach(field => {

    //         if (/(shift|section|group|sub)/.test(field)) {

    //             const exam = field.slice(-2);

    //             if (newItem[field]) {
    //                 newItem[field] = newItem[field].toLocaleUpperCase().split(',');
    //                 if (!newItem.id_exam) {
    //                     newItem.id_exam = examMap[exam];
    //                 }
    //             } else {
    //                 newItem[field] = [];
    //             }
    //         }

    //     });

    //     setUserData(newItem);
    //     setActiveAppUpdate(true);
    //     setUpdateShow(true);
    // };

    // Handle Payment Click
    const handlePaymentClick = (item) => {
        const feeMap = {
            '06': { groups: '200020711422330083', subjects: '200020711422330086', sections: '200020711422330089', shifts: '200020711422330092' },
            '08': { groups: '200020711422330083', subjects: '200020711422330086', sections: '200020711422330089', shifts: '200020711422330092' },
            '09': { groups: '200020711422330084', subjects: '200020711422330087', sections: '200020711422330090', shifts: '200020711422330093' },
            '11': { groups: '200020711422330085', subjects: '200020711422330088', sections: '200020711422330091', shifts: '200020711422330094' }
        };

        const typeMap = { group: "groups", sub: "subjects", section: "sections", shift: "shifts" };

        const feeTotal = Object.values(typeMap).reduce((acc, t) => {
            acc[t] = 0;
            return acc;
        }, {});

        const newFeeMap = {};

        Object.entries(item).forEach(([field, value]) => {

            const typeKey = Object.keys(typeMap).find(k => field.includes(`_${k}_`));
            if (!typeKey) return;

            const exam = field.slice(-2);
            const feeType = typeMap[typeKey];

            const feeCode = feeMap?.[exam]?.[feeType];
            const feeInfo = feeDataMap?.[feeCode];
            if (!feeInfo) return;

            const totalItems = value ? value.split(',').map(v => v.trim()).filter(Boolean).length : 0;

            const total = totalItems * Number(feeInfo.fee_reg);

            feeTotal[feeType] += total;
            newFeeMap[feeCode] = (newFeeMap[feeCode] || 0) + total;
        });

        setTotalFee(feeTotal);
        setActiveAppPay(item);
        setPayShow(true);
    };

    return (
        <Fragment>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                <h4 className={" card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের প্রতিষ্ঠানের নতুন শিফট/শাখা/বিভাগ/বিষয় খোলার আবেদনসমূহ</h4>
                                {status.error && <h6 className={" text-center text-danger flex-fill py-2"}>{status.error}</h6>}
                                {status.success && <h6 className={" text-center text-success flex-fill py-2"}>{status.success}</h6>}
                                {status.loading && <h6 className={" text-center text-primary flex-fill py-2"}>{status.loading}</h6>}
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
                                            <option disabled value="" className={" text-center"}>--আবেদন সংখ্যা সিলেক্ট করুন--</option>
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
                                                            {/* <Button type="button" className='w-100 text-nowrap p-2 m-0' variant="btn btn-outline-info" onClick={() => alert(item.message)}>মন্তব্য</Button> */}
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center flex-wrap gap-3">
                                                                <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                    </span>
                                                                </Button>
                                                                {item.id_payment !== '03' && <>
                                                                    {/* <Button className='m-0 p-1' type="button" onClick={() => handleUpdateClick(item)} variant="btn btn-primary" data-toggle="tooltip" data-placement="top" title="আপডেট" data-original-title="আপডেট">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" /></svg>
                                                                    </Button> */}
                                                                    <Button className='m-0 p-1' type="button" onClick={() => handlePaymentClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="পেমেন্ট করুন" data-original-title="পেমেন্ট করুন">
                                                                        <HiOutlineCurrencyBangladeshi color='true' size={'24px'} />
                                                                    </Button>
                                                                </>}
                                                                {item.id_payment === '03' && <Button className='m-0 p-1' type="button" onClick={() => window.open(`${FRONTEND_URL}/payment/response/success?prev_location=/institute/update/app/list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="পেমেন্ট ভাউচার" data-original-title="পেমেন্ট ভাউচার">
                                                                    <BiReceipt color='true' size={'24px'} />
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
            {activeAppPay && (
                <Modal
                    show={payShow}
                    onHide={() => setPayShow(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-lg m-0 p-0'
                >
                    <Modal.Header closeButton>
                        <h4 className='text-center w-100'>শিফট, শাখা, বিষয় ও বিভাগের আবেদন ফি</h4>
                    </Modal.Header>
                    <Modal.Body className='m-0 p-2'>
                        {status.success && <h6 className='text-center text-success w-100 py-2'>{status.success}</h6>}
                        {status.error && <h6 className='text-center text-danger w-100 py-2'>{status.error}</h6>}
                        {/* {status.loading && <p className='text-center text-primary w-100 py-2'>{status.loading}</p>} */}
                        <Table className='m-0 p-2 table-bordered'>
                            <tbody>
                                <tr>
                                    <th className='m-0 p-2 text-center align-top text-primary'>ক্রমিক নম্বর</th>
                                    <th className='m-0 p-2 text-center align-top text-primary'>বিস্তারিত</th>
                                    <th className='m-0 p-2 text-center align-top text-primary'>আবেদন ফি</th>
                                </tr>
                                <tr>
                                    <td className='m-0 p-2 text-center align-top'>০১</td>
                                    <td className='m-0 p-2 text-center align-top'>নতুন বিভাগ</td>
                                    <td className='m-0 p-2 text-center align-top'>{InputValidation.E2BDigit(totalFee.groups)}</td>
                                </tr>
                                <tr>
                                    <td className='m-0 p-2 text-center align-top'>০২</td>
                                    <td className='m-0 p-2 text-center align-top'>নতুন বিষয়</td>
                                    <td className='m-0 p-2 text-center align-top'>{InputValidation.E2BDigit(totalFee.subjects)}</td>
                                </tr>
                                <tr>
                                    <td className='m-0 p-2 text-center align-top'>০৩</td>
                                    <td className='m-0 p-2 text-center align-top'>নতুন শিফট</td>
                                    <td className='m-0 p-2 text-center align-top'>{InputValidation.E2BDigit(totalFee.shifts)}</td>
                                </tr>
                                <tr>
                                    <td className='m-0 p-2 text-center align-top'>০৪</td>
                                    <td className='m-0 p-2 text-center align-top'>নতুন শাখা</td>
                                    <td className='m-0 p-2 text-center align-top'>{InputValidation.E2BDigit(totalFee.sections)}</td>
                                </tr>
                                <tr>
                                    <td colSpan={2} className='m-0 p-2 text-end align-top'><strong>সর্বমোট ফিঃ</strong></td>
                                    <td className='m-0 p-2 text-center align-top'><strong>{InputValidation.E2BDigit(totalFee.groups + totalFee.subjects + totalFee.shifts + totalFee.sections)}</strong></td>
                                </tr>
                            </tbody>
                        </Table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant='btn btn-outline-success' onClick={() => appFeePayment(activeAppPay)}>
                            ফি পরিশোধ করুন
                        </Button>
                        <Button variant='btn btn-outline-warning' onClick={() => setPayShow(false)}>
                            ফিরে যান
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
            {/* {activeAppUpdate && (
                <Modal
                    show={updateShow}
                    onHide={() => setUpdateShow(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <InstShiftsApp
                            userData={userData}
                            setUserData={setUserData}
                            groupList={groupList}
                            subjectList={subjectList}
                            listGroupSubject={listGroupSubject}
                            listShift={listShift}
                            status={status}
                            setStatus={setStatus}
                            setShow={setUpdateShow}
                        />
                    </Modal.Body>
                    <Modal.Footer></Modal.Footer>
                </Modal>
            )} */}
        </Fragment >
    )
}

export default InstituteData;