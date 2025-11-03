import React, { useRef, Fragment, useEffect, useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

import { Row, Col, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

// import cb_logo from '../../../assets/images/board/cb_logo.jpg'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors.ts'

import { DEFAULT_ESTB_DATA, DEFAULT_CLS_DATA, DEFAULT_FILES_DATA, DEFAULT_FILES_PAGE } from './data/default_data.jsx';
import { estbDataEvaluate } from './evaluation/estb_eval.jsx';
import { classStartDataEvaluate } from './evaluation/class_eval.jsx';
import EstbAppForm from './application/estb_app.jsx';
import ClassStartAppForm from './application/clst_app.jsx';
import EstbAppPrint from './print/estab_app_print.jsx';
import ClassStartAppPrint from './print/clst_app_print.jsx';

const InstEstablishmentPayment = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const appName = useSelector(SettingSelector.app_bn_name);

    // const navigate = useNavigate();

    // Set Dates
    const toDay = new Date();
    toDay.setHours(toDay.getUTCHours() + 6);
    var start_year = toDay.getFullYear() - 120;
    var end_year = toDay.getFullYear() - 18;
    toDay.setFullYear(start_year);
    var start_dob = toDay.toISOString().split('T')[0];
    toDay.setFullYear(end_year);
    var end_dob = toDay.toISOString().split('T')[0];

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // useref Defination for Printing
    const printRef = useRef();

    // User Data Variables
    const [userData, setUserData] = useState({ ...DEFAULT_ESTB_DATA, ...DEFAULT_CLS_DATA });

    // User Data Error Variable
    const [userDataError, setUserDataError] = useState([]);

    // Class Start Application Data [Array of Arrays]
    const [classStartData, setClassStartData] = useState([]);

    // Fetched Application Type
    const [applicationType, setApplicationType] = useState(0);

    // Data Set for Printing Build Application
    const [buildPrintData, setBuildPrintData] = useState([]);

    // Data Set for Printing Class Start Application
    const [classStartPrintData, setClassStartPrintData] = useState([]);

    // Districts and Upazilas
    const [districts, setDistricts] = useState([]);

    // File Attachment
    const [files, setFiles] = useState(DEFAULT_FILES_DATA);

    // Set Backup Files
    const [estbFiles, setEstbFiles] = useState([]);
    const [classFiles, setClassFiles] = useState([]);
    const [classStartFilesJS, setClassStartFilesJS] = useState([]);
    const [classStartFilesSS, setClassStartFilesSS] = useState([]);
    const [classStartFilesHS, setClassStartFilesHS] = useState([]);
    const [classStartFilesSC, setClassStartFilesSC] = useState([]);

    // Set File Pages
    const [filesPages, setFilesPages] = useState(DEFAULT_FILES_PAGE);

    // Application Update Status
    const [updateStatus, setUpdateStatus] = useState({ 'success': false, 'loading': false, 'error': false });

    // Application Fetch Status
    const [fetchStatus, setFetchStatus] = useState({ 'success': false, 'loading': false, 'error': false });

    // Navigation to Pages
    const [navigateBuildUpdate, setNavigateBuildUpdate] = useState(false);
    const [navigateBuildPrint, setNavigateBuildPrint] = useState(false);
    const [navigateClassStartApplication, setNavigateClassStartApplication] = useState(false);
    const [navigateClassStartUpdate, setNavigateClassStartUpdate] = useState(false);
    const [navigateClassStartPrint, setNavigateClassStartPrint] = useState(false);

    // computed validations (memoized)
    const establishmentDataError = useMemo(() => estbDataEvaluate(userData), [userData.inst_region, userData.inst_status, userData.inst_distance, userData.inst_population]);

    // Establishment Data Evaluation
    useEffect(() => {
        // sync into userDataError
        setUserDataError(prev => ({ ...prev, inst_distance: establishmentDataError.inst_distance, inst_population: establishmentDataError.inst_population }));
        // set validated
        (establishmentDataError.inst_distance || establishmentDataError.inst_population) ? setValidated(true) : setValidated(false);
    }, [establishmentDataError]);// eslint-disable-line react-hooks/exhaustive-deps

    // computed validations (memoized)
    const classStartDataError = useMemo(() => classStartDataEvaluate(userData, buildPrintData), [buildPrintData.inst_region, userData.inst_stage, userData.khatiyan_total, userData.class_room, userData.office_room, userData.library_room, userData.toilet_room, userData.common_room, userData.total_books, userData.total_computer, userData.general_fund, userData.reserved_fund, userData.founder_amount, userData.computer_room]);

    // Class Start Data Evaluation
    useEffect(() => {
        // sync into userDataError
        setUserDataError(prev => ({ ...prev, khatiyan_total: classStartDataError.khatiyan_total, class_room: classStartDataError.class_room, office_room: classStartDataError.office_room, library_room: classStartDataError.library_room, toilet_room: classStartDataError.toilet_room, common_room: classStartDataError.common_room, total_books: classStartDataError.total_books, total_computer: classStartDataError.total_computer, general_fund: classStartDataError.general_fund, reserved_fund: classStartDataError.reserved_fund, founder_amount: classStartDataError.founder_amount, computer_room: classStartDataError.computer_room }));
        // set validated
        (classStartDataError.khatiyan_total || classStartDataError.class_room || classStartDataError.office_room || classStartDataError.library_room || classStartDataError.toilet_room || classStartDataError.common_room || classStartDataError.total_books || classStartDataError.total_computer || classStartDataError.general_fund || classStartDataError.reserved_fund || classStartDataError.founder_amount || classStartDataError.computer_room) ? setValidated(true) : setValidated(false);
    }, [classStartDataError]);// eslint-disable-line react-hooks/exhaustive-deps

    // Reset Founder Details on Named Institute Change
    useEffect(() => {
        if (userData.institute_named !== '01') {
            setFiles(prev => ({ ...prev, founder_details: null }));
            setFilesPages(prev => ({ ...prev, founder_details: null }));
            setUserDataError(prev => ({ ...prev, founder_details: null }));
            setUserData(prev => ({ ...prev, inst_founder_dob: '', inst_founder_name: '', inst_founder_nid: '' }));
        }
    }, [userData.institute_named]);

    // Memoized Fetch District
    const fetchDistrictPromise = useMemo(() => {
        return axios.get(`${BACKEND_URL}/district-list`);
    }, []);

    // Fetch District
    useEffect(() => {
        const fetchDistrict = async () => {
            setUpdateStatus({ 'success': false, 'loading': "জেলার তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!", 'error': false });
            try {
                const response = await fetchDistrictPromise;
                setDistricts(response.data);
            } catch (err) {
                setUpdateStatus({ 'success': false, 'loading': false, 'error': "জেলার তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!" });
            } finally {
                setUpdateStatus((prev) => ({ ...prev, loading: false }));
            }
        }
        fetchDistrict();
    }, [fetchDistrictPromise]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Files 
    const fetchClassStartFiles = async (classData) => {
        const pdfFiles = {};

        const fields = [
            'mutation_details', 'dakhila_details', 'named_fund_details', 'general_fund_details', 'reserved_fund_details', 'order_build_js', 'order_build_ss', 'order_build_hs', 'order_class_js', 'order_class_ss', 'order_class_hs', 'order_recognition_js', 'order_recognition_ss', 'order_recognition_hs',
        ];

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
                    pdfFiles[field] = null;
                }
            } catch (err) {
                pdfFiles[field] = null;
            }
        });

        await Promise.all(promises);
        switch (classData.inst_stage) {
            case '11':
                setClassStartFilesJS(pdfFiles);
                break;
            case '12':
                setClassStartFilesSS(pdfFiles);
                break;
            case '13':
                setClassStartFilesHS(pdfFiles);
                break;
            case '17':
                setClassStartFilesSC(pdfFiles);
                break;
            case '19':
                setClassStartFilesSC(pdfFiles);
                break;
            case '20':
                setClassStartFilesSC(pdfFiles);
                break;
            default:
                break;
        }
    }

    // Fetch Files 
    const fetchFiles = async (buildData) => {
        const pdfFiles = {};

        const fields = [
            'applicant_details', 'application_form', 'founder_details', 'land_details', 'ltax_details', 'distance_cert', 'population_cert', 'declare_form', 'feasibility_details',
        ];

        const promises = fields.map(async (field) => {
            try {
                const res = await axios.post(
                    `${BACKEND_URL}/institute/establishment/fetch_files`,
                    { inst_mobile: buildData.inst_mobile, inst_status: buildData.inst_status, file_name: field },
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
                pdfFiles[field] = null;
            }
        });

        await Promise.all(promises);
        // setFiles(pdfFiles);
        setEstbFiles(pdfFiles);
    }

    // Handle File View
    const handleFileView = (field) => {
        const file = estbFiles?.[field] || classFiles?.[field];

        if (!(file instanceof Blob)) return;

        try {
            const pdfURL = URL.createObjectURL(file);
            window.open(pdfURL, '_blank');
            // Revoke URL after 10 seconds to free memory
            setTimeout(() => URL.revokeObjectURL(pdfURL), 10000);
        } catch (error) {
            setTimeout(() => URL.revokeObjectURL(pdfURL), 10000);
        }
    };

    // Handle Set Navigate to Update Build Application
    const handleSetNavigateBuildUpdate = () => {
        setUserData({ ...userData, ...buildPrintData });
        setFiles(estbFiles);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateBuildUpdate(true);
    };

    // Handle Set Navigate to Upate Class Start Application
    const handleSetNavigateClassStartUpdate = () => {
        setUserData({ ...buildPrintData, ...classStartPrintData });
        setFiles(classFiles);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateClassStartUpdate(true);
    };

    // Handle Reset Navigate to Upate Class Start Application
    const handleResetNavigateClassStartUpdate = () => {
        setUserData({ ...userData, ...classStartPrintData });
        setFiles(estbFiles);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateClassStartUpdate(false);
    };

    // Handle Set Navigate to New Class Start Application
    const handleSetNavigateClassStartApp = () => {
        setUserData({ ...buildPrintData, inst_stage: '', founder_amount: '', khatiyan_mutation: '', khatiyan_mouja: '', khatiyan_total: '', tax_receipt: '', class_room: '', office_room: '', toilet_room: '', common_room: '', library_room: '', total_books: '', computer_room: '', total_computer: '', labratory_room: '', general_fund: '', reserved_fund: '', ref_build_js: '', ref_build_ss: '', ref_build_hs: '', ref_build_sc: '', ref_commence_js: '', ref_commence_ss: '', ref_commence_hs: '', ref_commence_sc: '', ref_recognition_js: '', ref_recognition_ss: '', ref_recognition_hs: '', ref_recognition_sc: '', date_build_js: '', date_build_ss: '', date_build_hs: '', date_build_sc: '', date_commence_js: '', date_commence_ss: '', date_commence_hs: '', date_commence_sc: '', date_recognition_ss: '', date_recognition_js: '', date_recognition_hs: '', date_recognition_sc: '' });
        setFiles(DEFAULT_FILES_DATA);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateClassStartApplication(true);
    }

    // Handle Set Navigate to Print Class Start Application
    const handleSetNavigateClassStartPrint = async (classData) => {
        switch (classData.inst_stage) {
            case '11':
                setClassFiles(classStartFilesJS);
                break;
            case '12':
                setClassFiles(classStartFilesSS);
                break;
            case '13':
                setClassFiles(classStartFilesHS);
                break;
            case '17':
                setClassFiles(classStartFilesSC);
                break;
            case '19':
                setClassFiles(classStartFilesSC);
                break;
            case '20':
                setClassFiles(classStartFilesSC);
                break;
            default:
                break;
        }
        setClassStartPrintData(classData);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateClassStartPrint(true);
    };

    // Handle Set Navigate to Print Class Start Application
    const handleResetNavigateClassStartPrint = () => {
        setClassFiles([]);
        setUserData({ ...userData, ...DEFAULT_CLS_DATA });
        setClassStartPrintData([]);
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setNavigateClassStartPrint(false);
    };

    // Handle File Select
    const handleFileSelect = useCallback(
        (fileName, selectedFile, maxSize = 1024 * 1024, allowedType = 'application/pdf') => {
            let errorMessage = null;

            if (!selectedFile) {
                errorMessage = `${allowedType.split('/')[1].toUpperCase()} ফাইল সিলেক্ট করতে হবে!`;
            } else if (selectedFile.type !== allowedType) {
                errorMessage = `শুধুমাত্র ${allowedType.split('/')[1].toUpperCase()} ফাইল গ্রহণযোগ্য!`;
            } else if (selectedFile.size > maxSize) {
                errorMessage = `ফাইলের সাইজ ${(maxSize / 1024 / 1024).toFixed(0)}MB এর কম হতে হবে!`;
            }

            if (errorMessage) {
                setUserDataError(prev => ({ ...prev, [fileName]: errorMessage }));
                setFiles(prev => ({ ...prev, [fileName]: null }));
                return;
            }

            const validFile = new File([selectedFile], `${fileName}.${allowedType.split('/')[1]}`, {
                type: allowedType,
            });

            setFiles(prev => ({ ...prev, [fileName]: validFile }));
            setUserDataError(prev => ({ ...prev, [fileName]: null }));
        }, [setFiles, setUserDataError]
    );

    // Handle Fetch Application
    const handleFetchSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);
        setFetchStatus({ 'success': false, 'loading': "প্রতিষ্ঠানের আবেদন খুঁজা হচ্ছে! অপেক্ষা করুন...", 'error': false });

        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });

        setBuildPrintData([]);

        const newErrors = {}; // Collect errors in one place

        if (!form.checkValidity()) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'user_id', 'user_pass'
            ];

            requiredFields.forEach(field => {
                let dataError = null;

                switch (field) {
                    case 'user_id':
                        dataError = ValidationInput.numberCheck(userData[field]);
                        break;

                    case 'user_pass':
                        dataError = userData[field].length ? '' : 'পাসওয়ার্ড পূরণ করতে হবে!';
                        break;

                    default:
                        break;
                }

                if (dataError) {
                    newErrors[field] = dataError;
                    isValid = false;
                    setValidated(false);
                }
            });

            // Update once
            setUserDataError(newErrors);

            if (!isValid) {
                setFetchStatus({ 'success': false, 'loading': false, 'error': "প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!" });
                event.stopPropagation();
            } else {
                try {
                    const user_data = await axios.post(`${BACKEND_URL}/institute/establishment/application_details`, { userData: userData });
                    if (user_data.status === 200) {
                        setFetchStatus({ 'success': true, 'loading': false, 'error': false });
                        setUserData(user_data.data.estbData);
                        setBuildPrintData(user_data.data.estbData);
                        setClassStartData(user_data.data.classStart);
                        fetchFiles(user_data.data.estbData);
                        for (let i = 0; i < user_data.data.classStart.length; i++) {
                            fetchClassStartFiles(user_data.data.classStart[i]);
                        }
                        setValidated(false);
                    } else {
                        setFetchStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
                    }
                } catch (err) {
                    setFetchStatus({ 'success': false, 'loading': false, 'error': 'ইউজার আইডি বা পাসওয়ার্ড সঠিক নয়!' });
                } finally {
                    setFetchStatus(prev => ({ ...prev, loading: false }));
                }
            }
        }
        setValidated(true);
    };

    // Hanlde Reset Application
    const handleFetchReset = (event) => {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }

        setUserDataError([]);
        setValidated(false);

        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });

        setNavigateBuildPrint(false);
        setNavigateBuildUpdate(false);

        setFetchStatus({ 'success': false, 'loading': false, 'error': false });

        setApplicationType(0);

        setBuildPrintData([]);

        setUserData({ ...DEFAULT_ESTB_DATA, ...DEFAULT_CLS_DATA });

        setClassStartData([]);

        // File Attachment
        setFiles(DEFAULT_FILES_DATA);

        setEstbFiles(DEFAULT_FILES_DATA);

        setFilesPages(DEFAULT_FILES_PAGE);
    };

    // Handle User Data Change
    const handleDataChange = useCallback((name, value) => {
        const formattedValue = name === 'inst_email' ? String(value).toLowerCase() : String(value).toUpperCase();
        setUserData(prev => ({ ...prev, [name]: formattedValue }));
        setUserDataError(prev => ({ ...prev, [name]: '' }));
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
    }, []);

    // Hanlde Submit Build Application Update
    const handleBuildUpdateSubmit = async (event) => {
        event.preventDefault();

        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);
        setUpdateStatus({ 'success': false, 'loading': 'প্রতিষ্ঠানের তথ্য আপলোড করা হচ্ছে! অপেক্ষা করুন...', 'error': false });

        const newErrors = {}; // Collect errors in one place

        if (!form.checkValidity()) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const bengaliName = {
                applicant_details: 'আবেদনকারী/আবেদনকারীগণের পরিচয়পত্র সংযুক্ত করতে হবে',
                application_form: 'আবেদন ফর্ম [ক(১)/ক(২)] সংযুক্ত করতে হবে',
                founder_details: 'প্রতিষ্ঠাতার পরিচিতি সংযুক্ত করতে হবে',
                land_details: 'প্রতিষ্ঠানের ভূমির খতিয়ান ও দলিল সংযুক্ত করতে হবে',
                ltax_details: 'প্রতিষ্ঠানের ভূমির খাজনার দাখিলা সংযুক্ত করতে হবে',
                distance_cert: 'নিকটবর্তী প্রতিষ্ঠানের দূরত্বের সনদ সংযুক্ত করতে হবে',
                population_cert: 'জনসংখ্যার সনদ সংযুক্ত করতে হবে',
                declare_form: '৩০০ টাকার ননজুডিশিয়াল স্ট্যাম্পে অঙ্গীকারনামা (নোটারি) (ফর্ম ক(৩)) সংযুক্ত করতে হবে',
                feasibility_details: 'প্রতিষ্ঠান স্থাপনের যৌক্তিকতার সংক্ষিপ্ত বিবরণী সংযুক্ত করতে হবে'
            };

            const requiredFields = [
                'applicant_name', 'applicant_mobile', 'institute_named', 'inst_founder_name', 'inst_founder_nid', 'inst_founder_dob', 'inst_founder_mobile', 'inst_en_name', 'inst_bn_name', 'inst_email', 'inst_mobile', 'inst_coed', 'inst_status', 'inst_version', 'inst_region', 'inst_dist', 'inst_uzps', 'inst_address', 'inst_mouza_name', 'inst_mouza_number', 'inst_khatiyan_name', 'inst_khatiyan_number', 'inst_land', 'inst_ltax_num', 'inst_ltax_year', 'inst_population', 'inst_distance', 'applicant_details', 'application_form', 'founder_details', 'land_details', 'ltax_details', 'distance_cert', 'population_cert', 'declare_form', 'feasibility_details'
            ];

            requiredFields.forEach(field => {
                let dataError = null;

                switch (field) {
                    case 'applicant_name':
                    case 'inst_en_name':
                        dataError = ValidationInput.alphaCheck(userData[field]);
                        break;

                    case 'inst_bn_name':
                        dataError = ValidationInput.bengaliCheck(userData[field]);
                        break;

                    case 'inst_founder_name':
                        if (userData.institute_named === '01') {
                            dataError = ValidationInput.alphaCheck(userData[field]);
                        }
                        break;

                    case 'inst_founder_nid':
                        if (userData.institute_named === '01') {
                            if (userData[field].length === 10 || userData[field].length === 13 || userData[field].length === 17) {
                                dataError = ValidationInput.numberCheck(userData[field]);
                            } else {
                                dataError = 'এনআইডি নম্বর সঠিক নয়!';
                            }
                        }
                        break;

                    case 'inst_founder_dob':
                        if (userData.institute_named === '01') {
                            dataError = ValidationInput.dateCheck(userData[field], start_dob, end_dob);
                        }
                        break;

                    case 'inst_ltax_year':
                        if (userData[field].length === 4) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        } else {
                            dataError = 'খাজনার সন সঠিক নয়!';
                        }
                        break;
                    case 'applicant_mobile':
                    case 'inst_mobile':
                        if (userData[field].length === 11) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        } else {
                            dataError = 'মোবাইল নম্বর সঠিক নয়!';
                        }
                        break;
                    case 'inst_founder_mobile':
                        if (userData.institute_named === '01') {
                            if (userData[field].length === 11) {
                                dataError = ValidationInput.numberCheck(userData[field]);
                            } else {
                                dataError = 'মোবাইল নম্বর সঠিক নয়!';
                            }
                        }
                        break;
                    case 'institute_named':
                    case 'inst_coed':
                    case 'inst_status':
                    case 'inst_version':
                    case 'inst_region':
                    case 'inst_uzps':
                    case 'inst_population':
                    case 'inst_distance':
                    case 'inst_mouza_number':
                    case 'inst_khatiyan_number':
                    case 'inst_land':
                    case 'inst_ltax_num':
                        dataError = ValidationInput.numberCheck(userData[field]);
                        break;

                    case 'inst_address':
                    case 'inst_mouza_name':
                    case 'inst_khatiyan_name':
                        dataError = ValidationInput.addressCheck(userData[field]);
                        break;

                    case 'inst_email':
                        dataError = ValidationInput.emailCheck(userData[field]);
                        break;

                    case 'founder_details':
                        if (userData.institute_named === '01') {
                            dataError = files[field] ? '' : bengaliName[field];
                        }
                        break;
                    case 'applicant_details':
                    case 'application_form':
                    case 'land_details':
                    case 'ltax_details':
                    case 'distance_cert':
                    case 'population_cert':
                    case 'declare_form':
                    case 'feasibility_details':
                        dataError = files[field] ? '' : bengaliName[field];
                        break;

                    default:
                        break;
                }

                if (dataError) {
                    newErrors[field] = dataError;
                    isValid = false;
                    setValidated(false);
                }
            });

            if (isValid) {
                const estbError = estbDataEvaluate(userData);
                Object.entries(estbError).forEach(([key, value]) => {
                    if (value) {
                        newErrors[key] = value;
                        isValid = false;
                        setValidated(false);
                    }
                });
            }

            // Update once
            setUserDataError(newErrors);

            // console.log(newErrors);

            if (!isValid) {
                setModalError(true);
                setUpdateStatus({ 'success': false, 'loading': false, 'error': 'প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!' });
                event.stopPropagation();
            } else {
                const formData = new FormData();
                formData.append('institute_data', JSON.stringify(userData));

                // console.log(userData);

                Object.entries(files).forEach(([filename, file]) => {
                    formData.append('files', file); // Field name should match backend
                    // console.log(file);
                });

                try {
                    const user_data = await axios.post(`${BACKEND_URL}/institute/establishment/update_application?`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (user_data.status === 200) {
                        alert(user_data.data.message);
                        setNavigateBuildUpdate(false);
                        setNavigateBuildPrint(false);
                        setFetchStatus(prev => ({ ...prev, 'success': false }));
                        handleFetchReset(event);
                        setUpdateStatus({ 'success': user_data.data.message, 'loading': false, 'error': false });
                    } else {
                        setUpdateStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
                        alert(user_data.data.message);
                    }
                } catch (err) {
                    setUpdateStatus({ 'success': false, 'loading': false, 'error': 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি!' });
                    alert('প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
                } finally {
                    setUpdateStatus((prev) => ({ ...prev, 'loading': false }));
                }
            }
        }
        setValidated(true);
    };

    // Handle Reset Build Application Update Data
    const handleBuildUpdateReset = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setUserDataError([]);
        setValidated(false);

        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });

        setUserData({ ...userData, ...buildPrintData });
    };

    // Hanlde Submit Class Start Application New/Update
    const handleClassStartSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);
        setUpdateStatus({ 'success': false, 'loading': 'প্রতিষ্ঠানের তথ্য আপলোড করা হচ্ছে! অপেক্ষা করুন...', 'error': false });

        const newErrors = {}; // Collect errors in one place

        if (!form.checkValidity()) {
            isValid = false;
            setValidated(false);
            event.stopPropagation();
        } else {
            const bengaliName = {
                mutation_details: 'জমির নামজারির কপি সংযুক্ত করতে হবে',
                dakhila_details: 'হালনাগাদ খাজনার দাখিলা সংযুক্ত করতে হবে',
                named_fund_details: 'ব্যক্তি কর্তৃক জমাকৃত তহবিলের প্রমাণক সংযুক্ত করতে হবে',
                general_fund_details: 'সাধারণ তহবিলের প্রমাণক সংযুক্ত করতে হবে',
                reserved_fund_details: 'রিজার্ভ তহবিলের প্রমাণক সংযুক্ত করতে হবে',
                order_build_js: 'স্থাপনের (নিম্ন মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_build_ss: 'স্থাপনের (মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_build_hs: 'স্থাপনের (উচ্চ মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_class_js: 'পাঠদানের (নিম্ন মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_class_ss: 'পাঠদানের (মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_class_hs: 'পাঠদানের (উচ্চ মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_recognition_js: 'স্বীকৃতির (নিম্ন মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_recognition_ss: 'স্বীকৃতির (মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
                order_recognition_hs: 'স্বীকৃতির (উচ্চ মাধ্যমিক) আদেশ সংযুক্ত করতে হবে',
            };

            const requiredFields = [
                'inst_stage', 'founder_amount', 'khatiyan_mutation', 'khatiyan_mouja', 'khatiyan_total', 'tax_receipt', 'class_room', 'office_room', 'toilet_room', 'common_room', 'library_room', 'total_books', 'computer_room', 'total_computer', 'labratory_room', 'general_fund', 'reserved_fund', 'ref_build_js', 'ref_build_ss', 'ref_build_hs', 'ref_build_sc', 'ref_commence_js', 'ref_commence_ss', 'ref_commence_hs', 'ref_commence_sc', 'ref_recognition_js', 'ref_recognition_ss', 'ref_recognition_hs', 'ref_recognition_sc', 'date_build_js', 'date_build_ss', 'date_build_hs', 'date_build_sc', 'date_commence_js', 'date_commence_ss', 'date_commence_hs', 'date_commence_sc', 'date_recognition_ss', 'date_recognition_js', 'date_recognition_hs', 'date_recognition_sc', 'order_build_js', 'order_build_ss', 'order_build_hs', 'order_class_js', 'order_class_ss', 'order_class_hs', 'order_recognition_js', 'order_recognition_ss', 'order_recognition_hs', 'named_fund_details', 'mutation_details', 'dakhila_details', 'general_fund_details', 'reserved_fund_details'
            ];

            requiredFields.forEach(field => {
                let dataError = null;
                let fileError = null;

                switch (field) {
                    case 'inst_stage':
                    case 'khatiyan_mutation':
                    case 'khatiyan_total':
                    case 'tax_receipt':
                    case 'class_room':
                    case 'office_room':
                    case 'toilet_room':
                    case 'common_room':
                    case 'library_room':
                    case 'total_books':
                    case 'computer_room':
                    case 'total_computer':
                    case 'labratory_room':
                    case 'general_fund':
                    case 'reserved_fund':
                        dataError = ValidationInput.numberCheck(userData[field] || ' ');
                        break;

                    case 'founder_amount':
                        if (userData.institute_named === '01') {
                            dataError = ValidationInput.numberCheck(userData[field] || ' ');
                        }
                        break;

                    case 'khatiyan_mouja':
                        dataError = ValidationInput.addressCheck(userData[field] || ' ');
                        break;

                    case 'ref_build_js':
                    case 'ref_build_ss':
                    case 'ref_build_hs':
                    case 'ref_build_sc':
                    case 'ref_commence_js':
                    case 'ref_commence_ss':
                    case 'ref_commence_hs':
                    case 'ref_commence_sc':
                    case 'ref_recognition_js':
                    case 'ref_recognition_ss':
                    case 'ref_recognition_hs':
                    case 'ref_recognition_sc':
                        if (userData[field] && String(userData[field]).length > 1) {
                            dataError = ValidationInput.alphanumCheck(userData[field] || ' ');
                            // const dateField = field.replace('ref', 'date');
                            // dataError = ValidationInput.dateCheck(userData[dateField], '2024-01-01', new Date().toISOString().split('T')[0]);
                            const fileFiled = field.replace('ref', 'order');
                            fileError = files[fileFiled] ? '' : bengaliName[fileFiled];
                            newErrors[fileFiled] = fileError;
                        }
                        break;

                    // case 'order_build_js':
                    // case 'order_build_ss':
                    // case 'order_build_hs':
                    // case 'order_class_js':
                    // case 'order_class_ss':
                    // case 'order_class_hs':
                    // case 'order_recognition_js':
                    // case 'order_recognition_ss':
                    // case 'order_recognition_hs':

                    case 'named_fund_details':
                        if (userData.institute_named === '01') {
                            dataError = files[field] ? '' : bengaliName[field];
                        }
                        break;

                    case 'mutation_details':
                    case 'dakhila_details':
                    case 'general_fund_details':
                    case 'reserved_fund_details':
                        dataError = files[field] ? '' : bengaliName[field];
                        break;

                    default:
                        break;
                }

                if (dataError || fileError) {
                    newErrors[field] = dataError;
                    isValid = false;
                    setValidated(false);
                }
            });

            if (isValid) {
                // Call Class Start Vadidation Function for Different Condition
                const classStartError = classStartDataEvaluate(userData, buildPrintData);
                Object.entries(classStartError).forEach(([key, value]) => {
                    if (value) {
                        newErrors[key] = value;
                        isValid = false;
                        setValidated(false);
                    }
                });
            }

            // Update once
            setUserDataError(newErrors);

            if (!isValid) {
                setModalError(true);
                setUpdateStatus({ 'success': false, 'loading': false, 'error': 'প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!' });
                event.stopPropagation();
            } else {
                const formData = new FormData();
                const myData = {
                    id_application: userData.id_application, inst_mobile: userData.inst_mobile, inst_stage: userData.inst_stage, founder_amount: userData.founder_amount, khatiyan_mutation: userData.khatiyan_mutation, khatiyan_mouja: userData.khatiyan_mouja, khatiyan_total: userData.khatiyan_total, tax_receipt: userData.tax_receipt, class_room: userData.class_room, office_room: userData.office_room, toilet_room: userData.toilet_room, common_room: userData.common_room, library_room: userData.library_room, total_books: userData.total_books, computer_room: userData.computer_room, total_computer: userData.total_computer, labratory_room: userData.labratory_room, general_fund: userData.general_fund, reserved_fund: userData.reserved_fund, ref_build_js: userData.ref_build_js, ref_build_ss: userData.ref_build_ss, ref_build_hs: userData.ref_build_hs, ref_build_sc: userData.ref_build_sc, ref_commence_js: userData.ref_commence_js, ref_commence_ss: userData.ref_commence_ss, ref_commence_hs: userData.ref_commence_hs, ref_commence_sc: userData.ref_commence_sc, ref_recognition_js: userData.ref_recognition_js, ref_recognition_ss: userData.ref_recognition_ss, ref_recognition_hs: userData.ref_recognition_hs, ref_recognition_sc: userData.ref_recognition_sc, date_build_js: userData.date_build_js, date_build_ss: userData.date_build_ss, date_build_hs: userData.date_build_hs, date_build_sc: userData.date_build_sc, date_commence_js: userData.date_commence_js, date_commence_ss: userData.date_commence_ss, date_commence_hs: userData.date_commence_hs, date_commence_sc: userData.date_commence_sc, date_recognition_ss: userData.date_recognition_ss, date_recognition_js: userData.date_recognition_js, date_recognition_hs: userData.date_recognition_hs, date_recognition_sc: userData.date_recognition_sc
                }
                formData.append('institute_data', JSON.stringify(myData));

                Object.entries(files).forEach(([filename, file]) => {
                    if (file) {
                        formData.append('files', file); // Field name should match backend
                    }
                });

                try {
                    const user_data =
                        navigateClassStartUpdate ?
                            await axios.post(`${BACKEND_URL}/institute/class_start/update_application`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            })
                            :
                            await axios.post(`${BACKEND_URL}/institute/class_start/new_application`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                    if (user_data.status === 200) {
                        alert(user_data.data.message);
                        setUpdateStatus({ 'success': user_data.data.message, 'loading': false, 'error': false });
                        setNavigateBuildUpdate(false);
                        setNavigateBuildPrint(false);
                        setFetchSuccess(false);
                        setNavigateClassStartApplication(false);
                        setNavigateClassStartUpdate(false);
                        handleFetchReset(event);
                        handleResetNavigateClassStartUpdate();
                        handleResetNavigateClassStartPrint();
                    } else {
                        setUpdateStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
                        alert(user_data.data.message);
                        if (user_data.status === 201) {
                            setNavigateClassStartApplication(false);
                            setApplicationType(1);
                        }
                    }
                } catch (err) {
                    setUpdateStatus({ 'success': false, 'loading': false, 'error': err.message || 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি!' });
                    alert(err.message || 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।');
                } finally {
                    setUpdateStatus((prev) => ({ ...prev, 'loading': false }));
                }
            }
        }
        setValidated(true);
    };

    // Handle Reset Class Start Application
    const handleClassStartReset = () => {
        setUserData({ ...userData, ...DEFAULT_CLS_DATA });

        setUserDataError([]);

        setFiles(DEFAULT_FILES_DATA);

        setModalError(false);
    }

    // Hanlde Build Application Payment
    const handleBuildPayment = async () => {
        setFetchStatus({ 'success': false, 'loading': "পেমেন্ট এর জন্য অপেক্ষা করুন...", 'error': false });
        const userData = { id_application: buildPrintData.id_application, inst_en_name: buildPrintData.inst_en_name, inst_email: buildPrintData.inst_email, inst_mobile: buildPrintData.inst_mobile, inst_status: buildPrintData.inst_status, id_invoice: buildPrintData.id_invoice };
        // Call Payment API
        try {
            const user_data = await axios.post(`${BACKEND_URL}/institute/establishment/payment`, { userData: userData });
            if (user_data.status === 200) {
                setFetchStatus({ 'success': user_data.data.message, 'loading': false, 'error': false });
                window.location.href = user_data.data.data.RedirectToGateway;
            } else {
                setFetchStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
            }
        } catch (err) {
            setFetchStatus({ 'success': false, 'loading': false, 'error': err.message });
        } finally {
            setFetchStatus(prev => ({ ...prev, loading: false }));
        }
    };

    // Handle Class Start Application Payment
    const handleClassStartPayment = async (classData) => {
        setFetchStatus({ 'success': false, 'loading': "পেমেন্ট এর জন্য অপেক্ষা করুন...", 'error': false });
        const userData = { id_application: classData.id_application, inst_en_name: buildPrintData.inst_en_name, inst_email: buildPrintData.inst_email, inst_mobile: classData.inst_mobile, inst_stage: classData.inst_stage, id_invoice: classData.id_invoice };
        // Call Payment API
        try {
            const user_data = await axios.post(`${BACKEND_URL}/institute/class_start/payment?`, { userData: userData });
            if (user_data.status === 200) {
                setFetchStatus({ 'success': user_data.data.message, 'loading': false, 'error': false });
                window.location.href = user_data.data.data.RedirectToGateway;
            } else {
                setFetchStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
            }
        } catch (err) {
            setFetchStatus({ 'success': false, 'loading': false, 'error': err.message });
        } finally {
            setFetchStatus(prev => ({ ...prev, loading: false }));
        }
    };

    if (navigateClassStartApplication) return (
        <ClassStartAppForm
            navigateClassStartApplication={navigateClassStartApplication}
            printRef={printRef}
            setNavigateClassStartApplication={setNavigateClassStartApplication}
            appName={appName}
            Logo={Logo}
            updateStatus={updateStatus}
            buildPrintData={buildPrintData}
            handleClassStartSubmit={handleClassStartSubmit}
            handleClassStartReset={handleClassStartReset}
            userData={userData}
            userDataError={userDataError}
            validated={validated}
            handleDataChange={handleDataChange}
            files={files}
            filesPages={filesPages}
            setFilesPages={setFilesPages}
            handleFileSelect={handleFileSelect}
            handleFileView={handleFileView}
            styles={styles}
        />
    )

    if (navigateClassStartUpdate) return (
        <ClassStartAppForm
            navigateClassStartApplication={navigateClassStartUpdate}
            printRef={printRef}
            setNavigateClassStartApplication={handleResetNavigateClassStartUpdate}
            appName={appName}
            Logo={Logo}
            updateStatus={updateStatus}
            buildPrintData={buildPrintData}
            handleClassStartSubmit={handleClassStartSubmit}
            handleClassStartReset={handleClassStartReset}
            userData={userData}
            userDataError={userDataError}
            validated={validated}
            handleDataChange={handleDataChange}
            files={files}
            filesPages={filesPages}
            setFilesPages={setFilesPages}
            handleFileSelect={handleFileSelect}
            handleFileView={handleFileView}
            styles={styles}
            modalError={modalError}
            setModalError={setModalError}
        />
    )

    if (navigateBuildUpdate) return (
        <EstbAppForm
            navigateBuildUpdate={navigateBuildUpdate}
            setNavigateBuildUpdate={setNavigateBuildUpdate}
            start_dob={start_dob}
            end_dob={end_dob}
            handleBuildUpdateSubmit={handleBuildUpdateSubmit}
            handleBuildUpdateReset={handleBuildUpdateReset}
            userData={userData}
            setUserData={setUserData}
            userDataError={userDataError}
            validated={validated}
            handleDataChange={handleDataChange}
            districts={districts}
            files={files}
            filesPages={filesPages}
            setFilesPages={setFilesPages}
            handleFileSelect={handleFileSelect}
            handleFileView={handleFileView}
            modalError={modalError}
            setModalError={setModalError}
            updateStatus={updateStatus}
        />
    )

    if (navigateBuildPrint) return (
        <EstbAppPrint
            navigateBuildPrint={navigateBuildPrint}
            setNavigateBuildPrint={setNavigateBuildPrint}
            appName={appName}
            Logo={Logo}
            buildPrintData={buildPrintData}
            styles={styles}
            handleFileView={handleFileView}
            estbFiles={estbFiles}
            handleSetNavigateBuildUpdate={handleSetNavigateBuildUpdate}
        />
    )

    if (navigateClassStartPrint) return (
        <ClassStartAppPrint
            navigateClassStartPrint={navigateClassStartPrint}
            handleResetNavigateClassStartPrint={handleResetNavigateClassStartPrint}
            appName={appName}
            Logo={Logo}
            buildPrintData={buildPrintData}
            classStartPrintData={classStartPrintData}
            handleFileView={handleFileView}
            styles={styles}
            estbFiles={estbFiles}
            classFiles={classFiles}
            handleSetNavigateClassStartUpdate={handleSetNavigateClassStartUpdate}
        />
    )

    if (fetchStatus?.success) return (
        <Fragment>
            <Row ref={printRef} className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                        <Card.Header className='d-flex flex-column p-0 m-0 py-3 justify-content-center align-items-center'>
                            <Link to="/institute/establishment/payment" onClick={handleFetchReset} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3 m-0 p-0">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠান স্থাপন/পাঠদানের আবেদন</h4>
                            {fetchStatus?.success && <h6 className="text-uppercase text-center py-1 text-success">{fetchStatus.success}</h6>}
                            {fetchStatus?.error && <h6 className="text-uppercase text-center py-1 text-danger">{fetchStatus.error}</h6>}
                            {fetchStatus?.loading && <h6 className="text-uppercase text-center py-1 text-primary">{fetchStatus.loading}</h6>}
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            <Row className='d-flex justify-content-center align-items-center m-0 py-0'>
                                {classStartData.length > 0 && <Col md={10} className='d-flex justify-content-center align-items-center gap-5 py-3'>
                                    <Button onClick={() => setApplicationType(0)} className='flex-fill' type="button" variant="btn  btn-info"> স্থাপনের আবেদন </Button>
                                    <Button onClick={() => setApplicationType(1)} className='flex-fill' type="button" variant="btn btn-light"> পাঠদানের আবেদন </Button>
                                </Col>}
                                {applicationType === 0 && <Col md={10}>
                                    <Card className="m-0 p-0">
                                        <Card.Body className='m-0 p-0'>
                                            <Row className="table-responsive p-3">
                                                <table id="user-list-table" className="table table-bordered">
                                                    <tbody>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0 w-25'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                            </th>
                                                            <td style={{ width: "10px" }} className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
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
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_en_name}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারীর নাম</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.applicant_name}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনকারীর মোবাইল</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.applicant_mobile}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সেবামূল্য জমাদান</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_payment}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button onClick={() => alert(`আবেদন ${buildPrintData.bn_app_status} অবস্থায় আছে`)} className='flex-fill w-50' type="button" variant='btn btn-outline-info'>{buildPrintData.bn_app_status}</Button>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনপত্র</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button onClick={() => setNavigateBuildPrint(true)} className='flex-fill w-50' type="button" variant="btn btn-outline-primary"> আবেদনপত্র প্রিন্ট</Button>
                                                            </td>
                                                        </tr>
                                                        {Number(buildPrintData.app_status) === 17 && buildPrintData.id_signed && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অনুমতিপত্র</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button type="button" className='flex-fill w-50' variant="btn btn-outline-success" onClick={() => window.open(`${FRONTEND_URL}/institute/establishment/order?id_order=${buildPrintData.id_invoice}`, '_blank', 'noopener,noreferrer')}>অনুমতিপত্র প্রিন্ট</Button>
                                                            </td>
                                                        </tr>}
                                                        {Number(buildPrintData.app_status) === 17 && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পাঠদানের আবেদন</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button type="button" className='flex-fill w-50' variant="btn btn-outline-secondary" onClick={() => handleSetNavigateClassStartApp()}>পাঠদান অনুমতির আবেদন</Button>
                                                            </td>
                                                        </tr>}
                                                        {buildPrintData.id_payment !== '03' && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পেমেন্ট</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button onClick={handleBuildPayment} className='flex-fill w-50' type="button" variant='btn btn-outline-success'> পেমেন্ট করুন </Button>
                                                            </td>
                                                        </tr>}
                                                        {(buildPrintData.proc_status === '12' || buildPrintData.proc_status === '18' || buildPrintData.proc_status === '19' || buildPrintData.proc_status === '20') &&
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-left text-danger"}>নির্দেশনা/মন্তব্য</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='align-top text-wrap p-2 m-0 text-danger w-50 text-center'>
                                                                    <span className={styles.SiyamRupaliFont}>{buildPrintData.message}</span>
                                                                </td>
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>}
                                {applicationType === 1 && classStartData.length > 0 && <Col md={10}>
                                    <Card className="m-0 p-0">
                                        <Card.Body className='m-0 p-0'>
                                            <Row className="table-responsive p-3">
                                                {classStartData.map((classData, idx) => (
                                                    <table key={idx} id="user-list-table" className="table table-bordered">
                                                        <tbody>
                                                            <tr>
                                                                <th colSpan={3} className='text-center align-top text-wrap p-2 m-0 w-25'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-primary"}>পাঠদানের পর্যায়ঃ {classData.bn_status}</span>
                                                                </th>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0 w-25'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                                </th>
                                                                <td style={{ width: "10px" }} className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
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
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_en_name}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের ইমেইল</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_email}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মোবাইল</span>
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
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সেবামূল্য জমাদান</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{classData.bn_payment}</span>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button onClick={() => alert(`আবেদন ${classData.bn_app_status} অবস্থায় আছে`)} className='flex-fill w-50' type="button" variant='btn btn-outline-info'>{classData.bn_app_status}</Button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনপত্র</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button
                                                                        onClick={() => { handleSetNavigateClassStartPrint(classData) }}
                                                                        className='flex-fill w-50'
                                                                        type="button" variant="btn btn-outline-primary">
                                                                        আবেদনপত্র প্রিন্ট
                                                                    </Button>
                                                                </td>
                                                            </tr>
                                                            {Number(classData.app_status) === 17 && classData.id_signed && <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অনুমতিপত্র</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button type="button" className='flex-fill w-50' variant="btn btn-outline-success" onClick={() => window.open(`${FRONTEND_URL}/institute/classs-start/order?id_order=${classData.id_invoice}`, '_blank', 'noopener,noreferrer')}>অনুমতিপত্র প্রিন্ট</Button>
                                                                </td>
                                                            </tr>}
                                                            {classData.id_payment !== '03' && <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পেমেন্ট</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button onClick={() => handleClassStartPayment(classData)} className='flex-fill w-50' type="button" variant='btn btn-outline-success'> পেমেন্ট করুন </Button>
                                                                </td>
                                                            </tr>}
                                                            {(classData.proc_status === '12' || classData.proc_status === '18' || classData.proc_status === '19' || classData.proc_status === '20') &&
                                                                <tr>
                                                                    <th className='text-left align-top text-wrap p-2 m-0'>
                                                                        <span className={styles.SiyamRupaliFont + " text-left text-danger"}>নির্দেশনা/মন্তব্য</span>
                                                                    </th>
                                                                    <td className='text-center align-top text-wrap p-2 m-0'>
                                                                        <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                    </td>
                                                                    <td className='align-top text-wrap p-2 m-0 text-danger w-50 text-center'>
                                                                        <span className={styles.SiyamRupaliFont}>{classData.message}</span>
                                                                    </td>
                                                                </tr>
                                                            }
                                                        </tbody>
                                                    </table>
                                                ))}
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>}
                                <Col md={10} className='d-flex mb-5'>
                                    <Button onClick={() => handleFetchReset()} className='flex-fill w-50' type="button" variant="btn btn-warning">ফিরে যান</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    )

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            {!ceb_session && <Link to="/institute/establishment/payment" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>}
                            {ceb_session && <Link to="/Dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>}
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠান স্থাপন/পাঠদানের আবেদন</h4>
                            {fetchStatus?.success && <h6 className="text-uppercase text-center py-1 text-success">{fetchStatus.success}</h6>}
                            {fetchStatus?.error && <h6 className="text-uppercase text-center py-1 text-danger">{fetchStatus.error}</h6>}
                            {fetchStatus?.loading && <h6 className="text-uppercase text-center py-1 text-primary">{fetchStatus.loading}</h6>}
                        </Card.Header>
                        <hr />
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={8}>
                                <Form noValidate onSubmit={handleFetchSubmit} onReset={handleFetchReset} className='m-0 p-0'>
                                    <Card className="m-0 p-0">
                                        <Card.Header className='pb-5'>
                                            <Row>
                                                <h5 className="text-center card-title py-2">আপনার আইডিতে লগইন করুন</h5>
                                                <p className="text-center card-title"><small><i>(আবেদনের সময় প্রাপ্ত ইউজার আইডি ও পাসওয়ার্ড প্রদান করুন)</i></small></p>
                                                {updateStatus.success && <h6 className="text-uppercase text-center py-1 text-success">{updateStatus.success}</h6>}
                                            </Row>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="user_id">ইউজার আইডি</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="user_id"
                                                        placeholder='প্রতিষ্ঠানের মোবাইল নম্বর'
                                                        value={userData.user_id}
                                                        isInvalid={validated && !!userDataError.user_id}
                                                        isValid={validated && userData.user_id && !userDataError.user_id}
                                                        onChange={(e) => handleDataChange('user_id', e.target.value)}
                                                    />
                                                    {validated && userDataError.user_id && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.user_id}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="user_pass">ইউজার পাসওয়ার্ড</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="password"
                                                        id="user_pass"
                                                        placeholder='আবেদনের সময় প্রাপ্ত পাসওয়ার্ড'
                                                        value={userData.user_pass}
                                                        isInvalid={validated && !!userDataError.user_pass}
                                                        isValid={validated && userData.user_pass && !userDataError.user_pass}
                                                        onChange={(e) => handleDataChange('user_pass', e.target.value)}
                                                    />
                                                    {validated && userDataError.user_pass && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.user_pass}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12} className='my-4 d-flex justify-content-center gap-3'>
                                                    {/* <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button> */}
                                                    <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Form>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default InstEstablishmentPayment;