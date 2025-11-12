import React, { useEffect, useState, useMemo, Fragment } from 'react'
import { Row, Col, Form, Button, Modal, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import Card from '../../../components/Card'

import axios from "axios";

import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

import error01 from '../../../assets/images/error/01.png'

import ClassStartAppPrint from './print/clst_app_print.jsx'

const InstClassStartTemp = () => {
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
    const [activeAppAuthorize, setActiveAppAuthorize] = useState([]);
    const [activeAppReject, setActiveAppReject] = useState([]);
    const [activeAppSendBack, setActiveAppSendBack] = useState([]);
    const [activeAppInquery, setActiveAppInquery] = useState([]);

    const [detailsShow, setDetailsShow] = useState(false);
    const [authShow, setAuthShow] = useState(false);
    const [rejShow, setRejShow] = useState(false);
    const [sendBackShow, setSendBackShow] = useState(false);
    const [inqueryShow, setInqueryShow] = useState(false);

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

    const [employeeData, setEmployeeData] = useState([]);
    const [upzOfficers, setUpzOfficers] = useState([]);
    const [distOfficers, setDistOfficers] = useState([]);

    const [upzOfficersAll, setUpzOfficersAll] = useState([]);
    const [distOfficersAll, setDistOfficersAll] = useState([]);

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // Data Variables
    const [userData, setUserData] = useState({
        id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '',
    });

    const [userDataError, setUserDataError] = useState({
        id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', inquiry_details: '',
    });

    // File Attachment
    // const [demoPdf, setDemoPdf] = useState(null);

    // File Attachment
    const [buildFiles, setBuildFiles] = useState([]);
    const [classStartFiles, setClassStartFiles] = useState([]);

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
            const st_list = await axios.post(`${BACKEND_URL}/institute/class_start/list`, { app_status: '13' });
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

    // Employee List Fetch
    const fetchEmployeeList = async () => {
        setLoadingProgress("কর্মকর্তাদের তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।");
        try {
            const response = await axios.post(`${BACKEND_URL}/employee/employee_list`, {});
            if (response.status === 200) {
                setEmployeeData(response.data.data);
            }
        } catch (err) {


            if (err.status === 401) {
                navigate("/auth/sign-out");

            }
            // setLoadingError("কর্মকর্তাদের তথ্য পাওয়া যায়নি!");
            // console.log(err);
        } finally {
            setLoadingProgress(false);
        }
    }

    // Fetch Application List
    useEffect(() => {
        fetchEmployeeList();
        setUpzOfficersAll([
            { uid: '4201', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoakhaura4@gmail.com', mobile: '+8801705411237', phone: '+880852256025' },
            { uid: '4202', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoashuganj@mopa.gov.bd', mobile: '+8801705411234', phone: '+8802334431522' },
            { uid: '4203', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobancharampur@mopa.gov.bd', mobile: '+8801705411239', phone: '+880852356002' },
            { uid: '4209', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobijoynagar@mopa.gov.bd', mobile: '+8801705411235', phone: '+8801705411235' },
            { uid: '4204', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobrahmanbaria@mopa.gov.bd', mobile: '+8801782823636', phone: '+88085161366' },
            { uid: '4205', name: 'উপজেলা নির্বাহী অফিসার', email: 'unokasba@mopa.gov.bd', mobile: '+8801705411238', phone: '+8802334432309' },
            { uid: '4206', name: 'উপজেলা নির্বাহী অফিসার', email: 'unonabinagar1@gmail.com', mobile: '+8801705411236', phone: '+880852575220' },
            { uid: '4207', name: 'উপজেলা নির্বাহী অফিসার', email: 'unonasirnagar@gmail.com', mobile: '+8801705411232', phone: '+8801705411232' },
            { uid: '4208', name: 'উপজেলা নির্বাহী অফিসার', email: 'unosarail@mopa.gov.bd', mobile: '+8801705411233', phone: '+8801705411233' },
            { uid: '3501', name: 'উপজেলা নির্বাহী অফিসার', email: 'unochandpursadar@gmail.com', mobile: '+8801730067060', phone: '+880312334486424' },
            { uid: '3502', name: 'উপজেলা নির্বাহী অফিসার', email: 'unofaridgonjchandpur@gmail.com', mobile: '+8801730067062', phone: '+880842264001' },
            { uid: '3503', name: 'উপজেলা নির্বাহী অফিসার', email: 'unohaimcharchandpur@gmail.com', mobile: '+8801730067074', phone: '+88084152001' },
            { uid: '3504', name: 'উপজেলা নির্বাহী অফিসার', email: 'jayedyean@gmil.com', mobile: '+8801730067072', phone: '+8802334448570' },
            { uid: '3505', name: 'উপজেলা নির্বাহী অফিসার', email: 'unokachua@gmail.com', mobile: '+8801730067070', phone: '+8802334489211' },
            { uid: '3506', name: 'উপজেলা নির্বাহী অফিসার', email: 'unomatlabnorthchandpur@gmail.com', mobile: '+8801730067066', phone: '+8801730067066' },
            { uid: '3507', name: 'উপজেলা নির্বাহী অফিসার', email: 'unomatlabsouthchandpur@gmail.com', mobile: '+8801730067064', phone: '+8801730067064' },
            { uid: '3508', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoshahrastichandpur@gmail.com', mobile: '+8801730067068', phone: '+8802334488801' },
            { uid: '3701', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobarura@gmail.com', mobile: '+8801733354946', phone: '+880802752003' },
            { uid: '3702', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobrahmanpara@gmail.com', mobile: '+8801733354945', phone: '+8802334409601' },
            { uid: '3703', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoburichang1@gmail.com', mobile: '+8801733354937', phone: '+880802956100' },
            { uid: '3704', name: 'উপজেলা নির্বাহী অফিসার', email: 'unochandina@gmail.com', mobile: '+8801733354938', phone: '+880802256108' },
            { uid: '3705', name: 'উপজেলা নির্বাহী অফিসার', email: 'unochouddagram1@gmail.com', mobile: '+8801733354948', phone: '+8802334408306' },
            { uid: '3706', name: 'উপজেলা নির্বাহী অফিসার', email: 'unocomillasadar@gmail.com', mobile: '+8801733354935', phone: '+8802334406425' },
            { uid: '3716', name: 'উপজেলা নির্বাহী অফিসার', email: 'unocomillasadarsouth@gmail.com', mobile: '+8801733354936', phone: '+880804257230' },
            { uid: '3707', name: 'উপজেলা নির্বাহী অফিসার', email: 'unodaudkandi@mopa.gov.bd', mobile: '+8801733354939', phone: '+880802355244' },
            { uid: '3708', name: 'উপজেলা নির্বাহী অফিসার', email: 'unodebidwar1@gmail.com', mobile: '+8801733354944', phone: '+8801733354944' },
            { uid: '3709', name: 'উপজেলা নির্বাহী অফিসার', email: 'unohomna@mopa.gov.bd', mobile: '+8801733354942', phone: '+8802334406812' },
            { uid: '3710', name: 'উপজেলা নির্বাহী অফিসার', email: 'unolaksam1@gmail.com', mobile: '+8801733354949', phone: '+8802334407400' },
            { uid: '3717', name: 'উপজেলা নির্বাহী অফিসার', email: 'unolalmai@gmail.com', mobile: '+8801733354921', phone: '+8802334448030' },
            { uid: '3711', name: 'উপজেলা নির্বাহী অফিসার', email: 'unomeghna@mopa.gov.bd,unomeghna@gmail.com', mobile: '+8801733354940', phone: '+880803551008' },
            { uid: '3714', name: 'উপজেলা নির্বাহী অফিসার', email: 'unomonoharganj@gmail.com', mobile: '+8801733354950', phone: '+8801733354950' },
            { uid: '3712', name: 'উপজেলা নির্বাহী অফিসার', email: 'unomuradnagar1@gmail.com', mobile: '+8801733354943', phone: '+880802656120' },
            { uid: '3713', name: 'উপজেলা নির্বাহী অফিসার', email: 'unonangalkot@gmail.com', mobile: '+8801733354947', phone: '+8802334409301' },
            { uid: '3715', name: 'উপজেলা নির্বাহী অফিসার', email: 'unotitas1@gmail.com', mobile: '+8801733354941', phone: '+8802334448120' },
            { uid: '3301', name: 'উপজেলা নির্বাহী অফিসার', email: 'unochagalnaiya@mopa.gov.bd', mobile: '+8801713187317', phone: '+8801713187317' },
            { uid: '3302', name: 'উপজেলা নির্বাহী অফিসার', email: 'unodaganbhuiyan@mopa.gov.bd', mobile: '+8801713187318', phone: '+8802334475609' },
            { uid: '3303', name: 'উপজেলা নির্বাহী অফিসার', email: 'unofenisadar@gmail.com', mobile: '+8801713187314', phone: '+8802337734073' },
            { uid: '3304', name: 'উপজেলা নির্বাহী অফিসার', email: 'unofulgazi@mopa.gov.bd', mobile: '+8801713187315', phone: '+880332677232' },
            { uid: '3305', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoparshuram@mopa.gov.bd', mobile: '+8801713187316', phone: '+8801713187316' },
            { uid: '3306', name: 'উপজেলা নির্বাহী অফিসার', email: 'unosonagazi@mopa.gov.bd', mobile: '+8801713187319', phone: '+8802334476631' },
            { uid: '3405', name: 'উপজেলা নির্বাহী অফিসার', email: 'unokamalnagar@mopa.gov.bd', mobile: '+8801788577714', phone: '+880244381001' },
            { uid: '3401', name: 'উপজেলা নির্বাহী অফিসার', email: 'unosadarlakshmipur@gmail.com', mobile: '+8801786375775', phone: '+8802334441004' },
            { uid: '3404', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoraipurlakshmipur@gmail.com', mobile: '+8801788577711', phone: '+8802334442311' },
            { uid: '3402', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoramganj@gmail.com', mobile: '+8801788577712', phone: '+8801788577712' },
            { uid: '3403', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoramgati@mopa.gov.bd', mobile: '+8801788577713', phone: '+8802334442811' },
            { uid: '3001', name: 'উপজেলা নির্বাহী অফিসার', email: 'unobegumganj@mopa.gov.bd', mobile: '+8801767441101', phone: '+8801767441101' },
            { uid: '3002', name: 'উপজেলা নির্বাহী অফিসার', email: 'unochatkhil@mopa.gov.bd', mobile: '+8801705401104', phone: '+8802334495020' },
            { uid: '3003', name: 'উপজেলা নির্বাহী অফিসার', email: 'unocompaniganjnoakhali@mopa.gov.bd', mobile: '+8801705401106', phone: '+8802334494204' },
            { uid: '3004', name: 'উপজেলা নির্বাহী অফিসার', email: 'unohatiya@mopa.gov.bd', mobile: '+8801705401109', phone: '+8801705401109' },
            { uid: '3009', name: 'উপজেলা নির্বাহী অফিসার', email: 'unokabirhat@mopa.gov.bd', mobile: '+8801705401107', phone: '+8801705401107' },
            { uid: '3005', name: 'উপজেলা নির্বাহী অফিসার', email: 'unonoakhali@mopa.gov.bd', mobile: '+8801705401101', phone: '+8802334433695' },
            { uid: '3006', name: 'উপজেলা নির্বাহী অফিসার', email: 'unosenbug@mopa.gov.bd', mobile: '+8801705401105', phone: '+880322556001' },
            { uid: '3007', name: 'উপজেলা নির্বাহী অফিসার', email: 'unosonaimuri@mopa.gov.bd', mobile: '+8801705405001', phone: '+8801705405001' },
            { uid: '3008', name: 'উপজেলা নির্বাহী অফিসার', email: 'unoshubarnachar@mopa.gov.bd', mobile: '+8801705401108', phone: '+8801705401108' },

            { uid: '3706', name: 'উপজেলা শিক্ষা অফিসার', email: 'ueao@meo.gov.bd', mobile: '+880170000000', phone: '+880170000000' },
        ]);
        setDistOfficersAll([
            { uid: '42', name: 'জেলা প্রশাসক', email: 'dcbrahmanbaria@mopa.gov.bd', mobile: '+8801713044960', phone: '+8802334427712' },
            { uid: '42', name: 'জেলা শিক্ষা অফিসার', email: 'brahmanbariadeo@gmail.com', mobile: '', phone: '+8802334428652' },
            { uid: '35', name: 'জেলা প্রশাসক', email: 'dcchandpur@mopa.gov.bd', mobile: '+8801730067050', phone: '+8802334485611' },
            { uid: '35', name: 'জেলা শিক্ষা অফিসার', email: 'chandpurdeo2008@yahoo.com', mobile: '', phone: '+8802334487314' },
            { uid: '37', name: 'জেলা প্রশাসক', email: 'dccomilla@mopa.gov.bd', mobile: '+8802334400301', phone: '+8802334400301' },
            { uid: '37', name: 'জেলা শিক্ষা অফিসার', email: 'deo_comilla@yahoo.com', mobile: '', phone: '+8802334406310' },
            { uid: '33', name: 'জেলা প্রশাসক', email: 'dcfeni@mopa.gov.bd', mobile: '+8801713187300', phone: '+8802334474000' },
            { uid: '33', name: 'জেলা শিক্ষা অফিসার', email: 'feni.deo.feni@gmail.com', mobile: '', phone: '+8802334473521' },
            { uid: '34', name: 'জেলা প্রশাসক', email: 'dclakshmipur@mopa.gov.bd', mobile: '+8801788577701', phone: '+8802334441410' },
            { uid: '34', name: 'জেলা শিক্ষা অফিসার', email: 'deo_laksmi@yahoo.com', mobile: '', phone: '+8802334441035' },
            { uid: '30', name: 'জেলা প্রশাসক', email: 'dcnoakhali@mopa.gov.bd', mobile: '+8801713121154', phone: '+8802334491021' },
            { uid: '30', name: 'জেলা শিক্ষা অফিসার', email: 'noakhalideo@yahoo.com', mobile: '', phone: '+8802334491346' },
        ]);

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
                const response = await axios.post(`${BACKEND_URL}/institute/class_start/app_forward`, { id_invoice: app_data.id_invoice, institute_message: userData.institute_message });
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

    //Application Reject
    const applicationReject = async (app_data) => {
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
            setRejShow(false);
            setLoadingProgress("সম্পাদনা চলছে...। অপেক্ষা করুন।");
            setModifySuccess(false);
            setLoadingError(false);

            try {
                await axios.post(`${BACKEND_URL}/institute/class_start/app_reject`, { id_invoice: app_data.id_invoice, institute_message: userData.institute_message });
                setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== app_data.id_invoice)));
                setModifySuccess("আবেদন বাতিল সফল হয়েছে!");
            } catch (err) {


                if (err.status === 401) {
                    navigate("/auth/sign-out");

                }
                setLoadingError("আবেদন বাতিল সফল হয়নি!");
                // console.log(err);
            } finally {
                setLoadingProgress(false);
            }
        }
    };

    //Application SendBack
    const applicationSendBack = async (app_data) => {
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
                const response = await axios.post(`${BACKEND_URL}/institute/class_start/app_sendback`, { id_invoice: app_data.id_invoice, institute_message: userData.institute_message });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== app_data.id_invoice)));
                    setModifySuccess(response.data.message);
                    setSendBackShow(false);
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

    const sendEmail = async () => {
        try {
            const response = await axios.post(`${BACKEND_URL}/email/send/inquiry`, { emailData: userData });
            if (response.status === 200) {
                alert(response.data.message);
            }
        } catch (err) {


            if (err.status === 401) {
                navigate("/auth/sign-out");

            }
            alert(err.message);
        }
    }

    //Application SendBack
    const applicationInquiry = async (app_data) => {
        let isValid = true;
        const newErrors = {};

        const requiredFields = ['id_invoice', 'institute_message', 'email_datetime', 'name_recipient', 'email_recipient', 'recipient_upzila', 'recipient_dist', 'name_recipient_cc1', 'email_recipient_cc1', 'name_recipient_cc2', 'email_recipient_cc2', 'name_recipient_cc3', 'email_recipient_cc3', 'email_ref', 'email_subject', 'email_topic', 'topic_uname', 'topic_uaddress', 'topic_uemail', 'topic_umobile', 'email_message'];

        requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
                case 'institute_message':
                    dataError = ValidationInput.bengaliCheck(userData[field]);
                    break;
                case 'email_datetime':
                    dataError = ValidationInput.dateCheck(userData[field], '2025-01-01', new Date());
                    break;
                case 'name_recipient':
                case 'name_recipient_cc1':
                case 'name_recipient_cc2':
                case 'name_recipient_cc3':
                    dataError = userData.inquiry_user === 'উপজেলা শিক্ষা অফিসার' ? ValidationInput.banglaAddressCheck(userData[field]) : ValidationInput.addressCheck(userData[field]);
                    break;
                case 'email_recipient':
                case 'email_recipient_cc1':
                case 'email_recipient_cc2':
                case 'email_recipient_cc3':
                case 'topic_uemail':
                    dataError = ValidationInput.emailCheck(userData[field]);
                    break;
                case 'id_invoice':
                case 'email_ref':
                    dataError = ValidationInput.alphanumCheck(userData[field]);
                    break;
                case 'recipient_upzila':
                case 'recipient_dist':
                case 'email_subject':
                case 'email_topic':
                case 'email_message':
                    dataError = ValidationInput.banglaAddressCheck(userData[field]);
                    break;
                case 'topic_umobile':
                    dataError = ValidationInput.numberCheck(userData[field]);
                    break;
                case 'topic_uaddress':
                    dataError = ValidationInput.addressCheck(userData[field]);
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

        // console.log(newErrors);
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
                const response = await axios.post(`${BACKEND_URL}/institute/class_start/app_inquiry`, { userData: userData });
                if (response.status === 200) {
                    setDataList(((prevData) => prevData.filter((item) => item.id_invoice !== app_data.id_invoice)));
                    setModifySuccess(response.data.message);
                    sendEmail();
                    setInqueryShow(false);
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
        setUserData({ ...userData, id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', });
        setUserDataError({ ...userDataError, id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', });
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
        resetModifyMessages();
        setActiveAppAuthorize(item);
        setAuthShow(true);
    };

    //Handle Authorize Click
    const handleInqueryClick = (item) => {
        var curDateTime = new Date();
        curDateTime.setHours(curDateTime.getUTCHours() + 12);
        const email_datetime = curDateTime.toISOString().split('T')[0] + ' ' + curDateTime.toISOString().split('T')[1].split('.')[0];
        const email_ref = "INQEMAIL" + curDateTime.toISOString().replace(/[-:.TZ\s]/ig, "");

        setUpzOfficers((() => upzOfficersAll.filter((prev) => prev.uid === item.inst_uzps)));
        setDistOfficers((() => distOfficersAll.filter((prev) => prev.uid === String(item.inst_uzps).substring(0, 2))));

        setUserData({
            ...userData,
            id_invoice: item.id_invoice,
            inquiry_user: '',
            institute_message_default: '',
            institute_message: '',
            email_datetime: email_datetime,
            name_recipient: '',
            email_recipient: '',
            recipient_upzila: item.bn_uzps,
            recipient_dist: item.bn_dist,
            name_recipient_cc1: '',
            email_recipient_cc1: '',
            name_recipient_cc2: '',
            email_recipient_cc2: '',
            name_recipient_cc3: '',
            email_recipient_cc3: '',
            email_ref: email_ref,
            email_subject: 'তদন্তকারী কর্মকর্তা নিয়োগ প্রসঙ্গে।',
            email_topic: 'নতুন প্রতিষ্ঠানের পাঠদানের জন্য প্রতিষ্ঠান পরিদর্শন ও তদন্ত প্রতিবেদন জমা প্রদান',
            topic_uname: item.inst_bn_name,
            topic_uid: item.inst_mobile,
            topic_uaddress: item.inst_address + ', ' + item.en_uzps + ', ' + item.en_dist,
            topic_uemail: item.inst_email,
            topic_umobile: item.inst_mobile,
            email_message: 'বেসরকারি শিক্ষা প্রতিষ্ঠান (নিম্ন মাধ্যমিক, মাধ্যমিক ও উচ্চ মাধ্যমিক) স্থাপন, পাঠদান ও একাডেমিক স্বীকৃতি প্রদান নীতিমালা- ২০২২ (সংশোধিত- ২০২৩) এর অনুচ্ছেদ ৭.২ এর উপ-অনুচ্ছেদ (ক) অনুযায়ী আপনাকে নতুন প্রতিষ্ঠানের পাঠদানের আবেদনের প্রেক্ষিতে প্রতিষ্ঠান পরিদর্শন প্রদিবেদন দাখিলের জন্য তদন্তকারী কর্মকর্তা হিসেবে নিয়োগ প্রদান করা হলো। পরিদর্শন শেষে নির্ধারিত ফর্মে পরিদর্শন প্রতিবেদন নিয়োগকারী কর্তৃপক্ষের নিকট উক্ত নিয়োগের তারিখ থেকে ৩০ দিনের [অনুচ্ছেদ ৭.২ (খ)] মধ্যে দাখিল করার জন্য নির্দেশ প্রদান করা হলো।',
        });

        setUserDataError({ ...userDataError, id_invoice: '', inquiry_user: '', institute_message_default: '', institute_message: '', email_datetime: '', name_recipient: '', email_recipient: '', recipient_upzila: '', recipient_dist: '', name_recipient_cc1: '', email_recipient_cc1: '', name_recipient_cc2: '', email_recipient_cc2: '', name_recipient_cc3: '', email_recipient_cc3: '', email_ref: '', email_subject: '', email_topic: '', topic_uname: '', topic_uid: '', topic_uaddress: '', topic_uemail: '', topic_umobile: '', email_message: '', });

        setModifyError(false);
        setModifySuccess(false);
        setModifyProcess(false);
        setActiveAppInquery(item);
        setInqueryShow(true);
    };

    //Handle Reject Click
    const handleRejectClick = (item) => {
        resetModifyMessages();
        setActiveAppReject(item);
        setRejShow(true);
    };

    //Handle SendBack Click
    const handleSendBackClick = (item) => {
        resetModifyMessages();
        setActiveAppSendBack(item);
        setSendBackShow(true);
    };

    // Handle User Data Change
    const handleDataChange = (dataName, dataValue) => {
        setUserData({ ...userData, [dataName]: dataValue.toUpperCase() });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    if (!ceb_session?.ceb_user_id) return (
        <></>
    )

    if ((ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") && loadingSuccess) return (
        <Fragment>
            <Row>
                <Col sm="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title d-flex flex-column justify-content-center align-items-center w-100">
                                <h4 className={styles.SiyamRupaliFont + " card-title text-center text-primary flex-fill"}>প্রতিষ্ঠানের পাঠদানের অপেক্ষমান আবেদনসমূহ</h4>
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
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>প্রতিষ্ঠানের মাধ্যম</p>
                                                <p className={styles.SiyamRupaliFont + " text-wrap text-center"}>পাঠদানের পর্যায়</p>
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
                                                            <Button type="button" variant="btn btn-outline-primary" onClick={() => window.open(`${FRONTEND_URL}/payment/response/success?prev_location=/establishment/pending-list&invoiceNo=${item.id_invoice}`, '_blank', 'noopener,noreferrer')}>প্রিন্ট ভাউচার</Button>
                                                        </td>
                                                        <td className='text-center align-top text-wrap'>
                                                            <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_coed}</p>
                                                            <p className={styles.SiyamRupaliFont + " text-center align-center text-wrap p-1 m-0"}>{item.bn_version}</p>
                                                            <p className={styles.SiyamRupaliFont + " text-center text-primary align-center text-wrap p-1 m-0"}>{item.clst_status}</p>
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
                                                                {item.proc_status === ceb_session.ceb_user_role && <Button className='m-0 p-1' type="button" onClick={() => handleForwardClick(item)} variant="btn btn-success" data-toggle="tooltip" data-placement="top" title="অনুমোদন" data-original-title="অনুমোদন">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-square-check"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="m9 12 2 2 4-4" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                {Number(ceb_session.ceb_user_role) >= 16 && <Button className='m-0 p-1' type="button" onClick={() => handleInqueryClick(item)} variant="btn btn-info" data-toggle="tooltip" data-placement="top" title="তদন্তের জন্য প্রেরণ" data-original-title="তদন্তের জন্য প্রেরণ">
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-search-icon lucide-calendar-search"><path d="M16 2v4" /><path d="M21 11.75V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7.25" /><path d="m22 22-1.875-1.875" /><path d="M3 10h18" /><path d="M8 2v4" /><circle cx="18" cy="18" r="3" /></svg>
                                                                </Button>}
                                                                <Button className='m-0 p-1' type="button" onClick={() => handleDetailsClick(item)} variant="btn btn-secondary" data-toggle="tooltip" data-placement="top" title="বিস্তারিত" data-original-title="বিস্তারিত">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scan-eye"><path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" /><path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" /><circle cx="12" cy="12" r="1" /><path d="M18.944 12.33a1 1 0 0 0 0-.66 7.5 7.5 0 0 0-13.888 0 1 1 0 0 0 0 .66 7.5 7.5 0 0 0 13.888 0" /></svg>
                                                                    </span>
                                                                </Button>
                                                                {item.proc_status === ceb_session.ceb_user_role && <Button className='m-0 p-1' type="button" onClick={() => handleSendBackClick(item)} variant="btn btn-warning" data-toggle="tooltip" data-placement="top" title="ফের‌ৎ পাঠানো" data-original-title="ফেরৎ পাঠানো">
                                                                    <span className="btn-inner">
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeধinecap="round" strokeধinejoin="round" className="lucide lucide-undo2-icon lucide-undo-2"><path d="M9 14 4 9l5-5" /><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" /></svg>
                                                                    </span>
                                                                </Button>}
                                                                {item.proc_status === ceb_session.ceb_user_role && Number(ceb_session.ceb_user_role) >= 16 && <Button className='m-0 p-1' type="button" onClick={() => handleRejectClick(item)} variant="btn btn-danger" data-toggle="tooltip" data-placement="top" title="বাতিল" data-original-title="বাতিল">
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
                                            <ClassStartAppPrint
                                                navigateClassStartPrint={detailsShow}
                                                handleResetNavigateClassStartPrint={setDetailsShow}
                                                buildPrintData={activeAppDetails}
                                                classStartPrintData={activeAppDetails}
                                                estbFiles={buildFiles}
                                                classFiles={classStartFiles}
                                                handleSetNavigateClassStartUpdate={false}
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
                                            <Modal.Title className={styles.SiyamRupaliFont + ' text-center'}>
                                                <h4 className={styles.SiyamRupaliFont + ' text-center'}>আবেদন {ceb_session.ceb_user_role !== '16' ? 'পরবর্তী ব্যবহারকারীর নিকট প্রেরণ' : 'অনুমোদন'} করতে চান?</h4>
                                                {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                                {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                                {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form noValidate>
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
                                                            {(ceb_session.ceb_user_role !== '16' || ceb_session.ceb_user_role === '17') && <>
                                                                <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়েছে। আবেদনটি অনুমোদনের জন্য উত্থাপন করা হলো।</option>
                                                                <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়েছে। আবেদনটি তদন্তের জন্য উত্থাপন করা হলো।</option>
                                                                <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক বলে প্রতিয়মান হয়নি বিধায় আবেদনটি বাতিলের জন্য উত্থাপন করা হলো।</option>
                                                            </>}
                                                            {(ceb_session.ceb_user_role === '16' || ceb_session.ceb_user_role === '16') && <>
                                                                <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে এবং আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর সন্তোষজনক তদন্ত প্রতিবেদনের সাপেক্ষে স্থাপনের আবেদনটি সন্তোষজনক বলে প্রতিয়মান হয়েছে। অনুমোদন কমিটির সভায় সর্বসম্মতিক্রমে আবেদনটি গৃহীত হওয়ায় চূড়ান্ত অনুমোদন প্রদান করা হলো</option>
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
                                {activeAppReject && (
                                    <Modal
                                        show={rejShow}
                                        onHide={() => setRejShow(false)}
                                        backdrop="static"
                                        keyboard={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title className={styles.SiyamRupaliFont + ' text-center'}>
                                                <h4 className={styles.SiyamRupaliFont + ' text-center'}>আবেদন বাতিল করতে চান?</h4>
                                                {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                                {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                                {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p><span className={styles.SiyamRupaliFont}>আবেদনের সকল তথ্য যাচাইয়ের পর সঠিক মন্তব্য লিখে আবেদন বাতিল করুন।</span></p>
                                            <Form noValidate>
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
                                                            <option>আবেদনের প্রাথমিক তথ্য যাচাইয়ের পর তদন্ত প্রতিবেদনের সাপেক্ষে স্থাপনের আবেদনটি সন্তোষজনক বলে প্রতিয়মান হয়নি। অনুমোদন কমিটির সভায় সর্বসম্মতিক্রমে আবেদনটি বাতিল হওয়ায় আবেদনটি বাতিল করা হলো</option>
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
                                            <Button variant="danger" onClick={() => applicationReject(activeAppReject)}>
                                                বাতিল করুন
                                            </Button>
                                            <Button variant="secondary" onClick={() => setRejShow(false)}>
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
                                            <Modal.Title className={styles.SiyamRupaliFont + ' text-center'}>
                                                <h4 className={styles.SiyamRupaliFont + ' text-center'}>আবেদন পূর্ববর্তী ব্যবহারকারীর নিকট হালনাগাদের জন্য ফেরৎ প্রদান?</h4>
                                                {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                                {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                                {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <p><span className={styles.SiyamRupaliFont}>সঠিক মন্তব্য লিখে পূর্ববর্তী ব্যবহারকারীর নিকট ফেরৎ প্রদান করুন।</span></p>
                                            <Form noValidate>
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
                                                            <option>প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করে হালনাগাদ আবেদন উপস্থাপন করুন!</option>
                                                            <option>সংযুক্তিগুলো সঠিকভাবে আবেদনের সাথে সংযুক্ত করে হালনাগাদ আবেদন উপস্থাপন করুন!</option>
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
                                            <Button variant="warning" onClick={() => applicationSendBack(activeAppSendBack)}>
                                                ফেরৎ পাঠান
                                            </Button>
                                            <Button variant="secondary" onClick={() => setSendBackShow(false)}>
                                                ফিরে যান
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                )}
                                {activeAppInquery && (
                                    <Modal
                                        show={inqueryShow}
                                        onHide={() => setInqueryShow(false)}
                                        backdrop="static"
                                        keyboard={false}
                                    >
                                        <Modal.Header closeButton>
                                            <Modal.Title className={styles.SiyamRupaliFont + ' text-center'}>
                                                <h4 className={styles.SiyamRupaliFont + ' text-center'}>আবেদন তদন্তকারী কর্মকর্তার নিকট প্রেরণ?</h4>
                                                {modifyError && <h6 className={styles.SiyamRupaliFont + " text-center text-danger flex-fill py-2"}>{modifyError}</h6>}
                                                {modifySuccess && <h6 className={styles.SiyamRupaliFont + " text-center text-success flex-fill py-2"}>{modifySuccess}</h6>}
                                                {modifyProcess && <h6 className={styles.SiyamRupaliFont + " text-center text-primary flex-fill py-2"}>{modifyProcess}</h6>}
                                            </Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <Form noValidate>
                                                <Col className='my-2' md={12}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inquiry_user'>তদন্তকারী কর্মকর্তা</Form.Label>
                                                        <Form.Select
                                                            id="inquiry_user"
                                                            value={userData.inquiry_user}
                                                            isInvalid={validated && !!userDataError.inquiry_user}
                                                            isValid={validated && userData.inquiry_user && !userDataError.inquiry_user}
                                                            onChange={
                                                                (e) => {
                                                                    if (e.target.value === 'উপজেলা শিক্ষা অফিসার') {
                                                                        // const selectedName = upzOfficers.filter((prev) => String(prev.name).toUpperCase() === e.target.value);
                                                                        // setUserData({
                                                                        //    ...userData,
                                                                        //    inquiry_user: e.target.value,
                                                                        //    name_recipient: selectedName[0].name,
                                                                        //    email_recipient: selectedName[0].email,
                                                                        //    name_recipient_cc1: distOfficers[0].name,
                                                                        //    email_recipient_cc1: distOfficers[0].email,
                                                                        //    name_recipient_cc2: distOfficers[1].name,
                                                                        //    email_recipient_cc2: distOfficers[1].email,
                                                                        //    name_recipient_cc3: upzOfficers[0].name,
                                                                        //    email_recipient_cc3: upzOfficers[0].email,
                                                                        // });
                                                                        setUserData({
                                                                            ...userData,
                                                                            inquiry_user: e.target.value,
                                                                            name_recipient: 'প্রিয়ঞ্জিত সরকার',
                                                                            email_recipient: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc1: 'প্রিয়ঞ্জিত সরকার',
                                                                            email_recipient_cc1: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc2: 'প্রিয়ঞ্জিত সরকার',
                                                                            email_recipient_cc2: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc3: 'প্রিয়ঞ্জিত সরকার',
                                                                            email_recipient_cc3: 'prionjit.it@gmail.com',
                                                                        });
                                                                    } else {
                                                                        // const selectedName = employeeData.filter((prev) => String(prev.name).toUpperCase() === e.target.value);
                                                                        // setUserData({
                                                                        //    ...userData,
                                                                        //    inquiry_user: e.target.value,
                                                                        //    name_recipient: selectedName[0].name,
                                                                        //    email_recipient: selectedName[0].email,
                                                                        //    name_recipient_cc1: "College Inspector",
                                                                        //    email_recipient_cc1: "ic@cumillaboard.gov.bd",
                                                                        //    name_recipient_cc2: "School Inspector",
                                                                        //    email_recipient_cc2: "ic@cumillaboard.gov.bd",
                                                                        //    name_recipient_cc3: "Senior System Analyst",
                                                                        //    email_recipient_cc3: "ssa@cumillaboard.gov.bd",
                                                                        // });
                                                                        setUserData({
                                                                            ...userData,
                                                                            inquiry_user: e.target.value,
                                                                            name_recipient: 'Prionjit Sarker',
                                                                            email_recipient: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc1: 'Prionjit Sarker',
                                                                            email_recipient_cc1: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc2: 'Prionjit Sarker',
                                                                            email_recipient_cc2: 'prionjit.it@gmail.com',
                                                                            name_recipient_cc3: 'Prionjit Sarker',
                                                                            email_recipient_cc3: 'prionjit.it@gmail.com',
                                                                        });
                                                                    }
                                                                }
                                                            }
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value="">-- তদন্তকারী কর্মকর্তা সিলেক্ট করুন --</option>
                                                            {employeeData.map((emp, idx) => (
                                                                <option key={idx} value={String(emp.name).toLocaleUpperCase()}>
                                                                    {String(emp.name).toLocaleUpperCase()}
                                                                </option>
                                                            ))}
                                                            <option value='উপজেলা শিক্ষা অফিসার'>উপজেলা শিক্ষা অফিসার</option>
                                                            {/* {upzOfficers.map((emp, idx) => (
                                                      <option key={idx}>
                                                         {emp.name}
                                                      </option>
                                                   ))}
                                                   {distOfficers.map((emp, idx) => (
                                                      <option key={idx}>
                                                         {emp.name}
                                                      </option>
                                                   ))} */}
                                                        </Form.Select>
                                                        {validated && userDataError.inquiry_user && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inquiry_user}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
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
                                                            <option>প্রতিষ্ঠানের আবেদনের প্রেক্ষিতে তদন্তকারী কর্মকর্তা নিয়োগপূর্বক আবেদনটি  তদন্তের জন্য প্রেরণ করা হলো।</option>
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
                                                        rows={4}
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
                                            <Button variant="warning" onClick={() => applicationInquiry(activeAppInquery)}>
                                                তদন্তকারী কর্মকর্তার নিয়োগ করন
                                            </Button>
                                            <Button variant="secondary" onClick={() => setInqueryShow(false)}>
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
        </Fragment >
    )

    if (ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_role === "16" || ceb_session.ceb_user_role === "17") return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center'>
                <Col md="12">
                    <Card>
                        <Card.Header className="d-flex justify-content-between">
                            <div className="header-title w-100">
                                <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}>প্রতিষ্ঠানের পাঠদানের অপেক্ষমান আবেদনসমূহ</span></h4>
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
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className={styles.SiyamRupaliFont + " text-center text-white mb-2"}>This page is under development</h2>
            <Image src={error01} alt="Under Development" />
        </div>
    )
}

export default InstClassStartTemp;