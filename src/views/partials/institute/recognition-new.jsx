import React, { Fragment, useEffect, useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col, Button } from 'react-bootstrap'
import Card from '../../../components/Card'

import * as ValidationInput from '../input_validation'

import styles from '../../../assets/custom/css/bisec.module.css'

import { DEFAULT_RECOG_DATA, DEFAULT_RECOG_FILES, RECOG_FILE_PAGES } from './data/default_data.jsx';

import { recognitionAppEvalReg, recognitionAppEvalExm } from './validation/recog_validation';

import RecognitionApp from './application/recog_app';
import RecognitionPrint from './print/recog_app_print';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InstRecognitionNew = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

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

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // User Data Variables
    const [userData, setUserData] = useState(DEFAULT_RECOG_DATA);

    // Previous Application Data
    const [recognitionData, setRecognitionData] = useState([]);

    // Bengali Error
    // const [bnError, setBnError] = useState([]);

    // User Data Error Variable
    const [userDataError, setUserDataError] = useState([]);

    // File Attachment
    const [files, setFiles] = useState(DEFAULT_RECOG_FILES);

    // Set Backup Files
    const [recognitionFiles, setRecognitionFiles] = useState([]);

    // Set File Pages
    const [filesPages, setFilesPages] = useState(RECOG_FILE_PAGES);

    // Application Update Status
    const [updateStatus, setUpdateStatus] = useState({ loading: false, success: false, error: false });

    // Application Fetch Status
    const [fetchStatus, setFetchStatus] = useState({ loading: false, success: false, error: false });

    // Navigation to Pages
    const [navigateRecognitionApp, setNavigateRecognitionApp] = useState(false);
    const [navigateRecognitionPrint, setNavigateRecognitionPrint] = useState(false);

    // Define field groups for validation
    const fieldGroups = {
        jsc: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('jsc')),
        ssc: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('ssc')),
        hsc: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('hsc')),
        c06: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('six')),
        c07: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('seven')),
        c08: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('eight')),
        c09: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('nine')),
        c10: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('ten')),
        c11: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('eleven')),
        c12: Object.keys(DEFAULT_RECOG_DATA).filter(key => key.startsWith('twelve')),
    };

    // Total Registration Validation
    const recogRegDataError = useMemo(() => recognitionAppEvalReg(userData), [
        userData.inst_region,
        userData.recog_inst_status,
        userData.id_group,
        ...fieldGroups.c06.map(f => userData[f]),
        ...fieldGroups.c07.map(f => userData[f]),
        ...fieldGroups.c08.map(f => userData[f]),
        ...fieldGroups.c09.map(f => userData[f]),
        ...fieldGroups.c10.map(f => userData[f]),
        ...fieldGroups.c11.map(f => userData[f]),
        ...fieldGroups.c12.map(f => userData[f]),
    ]);

    // Exam Validation
    const recogExmDataError = useMemo(() => recognitionAppEvalExm(userData), [
        userData.inst_region,
        userData.recog_inst_status,
        userData.id_group,
        ...fieldGroups.jsc.map(f => userData[f]),
        ...fieldGroups.ssc.map(f => userData[f]),
        ...fieldGroups.hsc.map(f => userData[f]),
    ]);

    // REG DATA EVAL ERROR UPDATE
    useEffect(() => {
        setUserDataError(prev => ({ ...prev, ...recogRegDataError }));

        const hasError = recogRegDataError ? Object.values(recogRegDataError).some(Boolean) : false;
        setValidated(hasError);
    }, [recogRegDataError]); // eslint-disable-line react-hooks/exhaustive-deps

    // EXAM DATA EVAL ERROR UPDATE
    useEffect(() => {
        setUserDataError(prev => ({ ...prev, ...recogExmDataError }));

        const hasError = recogExmDataError ? Object.values(recogExmDataError).some(Boolean) : false;
        setValidated(hasError);
    }, [recogExmDataError]); // eslint-disable-line react-hooks/exhaustive-deps

    // Fetch Files 
    const fetchFiles = async (appData) => {
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
        setFiles(pdfFiles);
        // console.log(pdfFiles);
    }

    // Fetch Application
    const fetchApplication = async (event) => {
        setFetchStatus({ loading: "প্রতিষ্ঠানের আবেদন খুঁজা হচ্ছে! অপেক্ষা করুন...", success: false, error: false });

        setUpdateStatus({ loading: false, success: false, error: false });

        try {
            const user_data = await axiosApi.post(`/institute/recognition/application_details`);
            if (user_data.status === 200) {
                setFetchStatus({ loading: false, success: user_data.data.message, error: false });
                setUserData({ ...userData, ...user_data.data.recData, ...user_data.data.instData, ...user_data.data.prevRefData, ...user_data.data.lastRefData });
                setRecognitionData({ ...user_data.data.recData, ...user_data.data.instData, ...user_data.data.prevRefData, ...user_data.data.lastRefData });
                fetchFiles({ ...user_data.data.recData, ...user_data.data.lastRefData });
            } else {
                setFetchStatus({ loading: false, success: false, error: user_data.data.message });
                setUserData({ ...userData, ...user_data.data.instData, ...user_data.data.prevRefData, ...user_data.data.lastRefData });
                setRecognitionData({ ...userData, ...user_data.data.instData, ...user_data.data.prevRefData, ...user_data.data.lastRefData });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate('/auth/sign-out');
            } else {
                setFetchStatus({ loading: false, success: false, error: err.user_data.data.message });
            }
        } finally {
            setFetchStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    // Call After Mount
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchApplication();
        }, 100);
        return () => clearTimeout(timer);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle Navigate to Recognition Application
    const handleSetNavigateRecognitionApp = () => {
        setUserData(recognitionData);
        setFiles(recognitionFiles);
        setUpdateStatus({ loading: false, success: false, error: false });
        setNavigateRecognitionApp(true);
    };

    // Handle Navigate to Print Application
    const handleSetNavigateRecognitionPrint = () => {
        setUserData(recognitionData);
        setFiles(recognitionFiles);
        setUpdateStatus({ loading: false, success: false, error: false });
        setNavigateRecognitionPrint(true);
    };

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

    // Handle User Data Change
    const handleDataChange = useCallback((name, value) => {
        const formattedValue = name === 'inst_email' ? String(value).toLowerCase() : String(value).toUpperCase();
        setUserData(prev => ({ ...prev, [name]: formattedValue }));
        setUserDataError(prev => ({ ...prev, [name]: '' }));
    }, []);

    // Hanlde Submit Recognition Application New/Update
    const handleRecognitionSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);
        setUpdateStatus({ loading: "প্রতিষ্ঠানের তথ্য আপলোড করা হচ্ছে! অপেক্ষা করুন...", success: false, error: false });

        const newErrors = {}; // Collect errors in one place

        if (!form.checkValidity()) {
            isValid = false;
            setValidated(false);
            event.stopPropagation();
        } else {
            const bengaliName = {
                prev_order: 'পূর্বের পাঠদান/স্বীকৃতির আদেশ সংযুক্ত করতে হবে',
                general_fund_details: 'সাধারণ তহবিলের প্রমাণক সংযুক্ত করতে হবে',
                reserved_fund_details: 'সংরক্ষিত তহবিলের প্রমাণক সংযুক্ত করতে হবে',
                class_routine: 'ক্লাস রুটিন সংযুক্ত করতে হবে',
                mutation_details: 'জমির দলিল সংযুক্ত করতে হবে',
                dakhila_details: 'নামজারির কপি ও সর্বশেষ খাজনার রশিদ সংযুক্ত করতে হবে',
                committee_order: 'সর্বশেষ পরিচালনা কমিটির অনুমতিপত্র সংযুক্ত করতে হবে',
                student_order: 'শিক্ষার্থী ভর্তির আদেশ সংযুক্ত করতে হবে',
            };

            const requiredFields = [
                'recog_inst_status', 'prev_ref', 'ref_date', 'ref_start', 'ref_end', 'general_fund', 'reserved_fund', 'total_land', 'mutation_land', 'land_tax_year', 'land_tax_number', 'committee_type', 'committee_expiry', 'total_concrete_building', 'total_other_building', 'total_room', 'used_room', 'researved_room', 'area_room', 'total_toilet', 'total_tubewell', 'electricity_connection', 'total_library', 'area_library', 'total_books', 'total_labratory', 'area_labratory', 'total_equipment_price', 'computer_room', 'area_computer_room', 'total_computer', 'total_permitted_student', 'jsc1_exam_year', 'jsc1_science_registered', 'jsc1_science_appeared', 'jsc1_science_passed', 'jsc1_humanities_registered', 'jsc1_humanities_appeared', 'jsc1_humanities_passed', 'jsc1_business_registered', 'jsc1_business_appeared', 'jsc1_business_passed', 'jsc2_exam_year', 'jsc2_science_registered', 'jsc2_science_appeared', 'jsc2_science_passed', 'jsc2_humanities_registered', 'jsc2_humanities_appeared', 'jsc2_humanities_passed', 'jsc2_business_registered', 'jsc2_business_appeared', 'jsc2_business_passed', 'jsc3_exam_year', 'jsc3_science_registered', 'jsc3_science_appeared', 'jsc3_science_passed', 'jsc3_humanities_registered', 'jsc3_humanities_appeared', 'jsc3_humanities_passed', 'jsc3_business_registered', 'jsc3_business_appeared', 'jsc3_business_passed', 'ssc1_exam_year', 'ssc1_science_registered', 'ssc1_science_appeared', 'ssc1_science_passed', 'ssc1_humanities_registered', 'ssc1_humanities_appeared',
                'ssc1_humanities_passed', 'ssc1_business_registered', 'ssc1_business_appeared', 'ssc1_business_passed', 'ssc2_exam_year', 'ssc2_science_registered', 'ssc2_science_appeared', 'ssc2_science_passed', 'ssc2_humanities_registered', 'ssc2_humanities_appeared', 'ssc2_humanities_passed', 'ssc2_business_registered', 'ssc2_business_appeared', 'ssc2_business_passed', 'ssc3_exam_year', 'ssc3_science_registered', 'ssc3_science_appeared', 'ssc3_science_passed', 'ssc3_humanities_registered', 'ssc3_humanities_appeared', 'ssc3_humanities_passed', 'ssc3_business_registered', 'ssc3_business_appeared', 'ssc3_business_passed', 'hsc1_exam_year', 'hsc1_science_registered', 'hsc1_science_appeared', 'hsc1_science_passed', 'hsc1_humanities_registered', 'hsc1_humanities_appeared', 'hsc1_humanities_passed', 'hsc1_business_registered', 'hsc1_business_appeared', 'hsc1_business_passed', 'hsc2_exam_year', 'hsc2_science_registered', 'hsc2_science_appeared', 'hsc2_science_passed', 'hsc2_humanities_registered', 'hsc2_humanities_appeared', 'hsc2_humanities_passed', 'hsc2_business_registered', 'hsc2_business_appeared', 'hsc2_business_passed', 'hsc3_exam_year', 'hsc3_science_registered', 'hsc3_science_appeared', 'hsc3_science_passed', 'hsc3_humanities_registered',
                'hsc3_humanities_appeared', 'hsc3_humanities_passed', 'hsc3_business_registered', 'hsc3_business_appeared', 'hsc3_business_passed', 'six_science_section', 'six_science_total', 'six_humanities_section', 'six_humanities_total', 'six_business_section', 'six_business_total', 'seven_science_section', 'seven_science_total', 'seven_humanities_section', 'seven_humanities_total', 'seven_business_section', 'seven_business_total', 'eight_science_section', 'eight_science_total', 'eight_humanities_section', 'eight_humanities_total', 'eight_business_section', 'eight_business_total', 'nine_science_section', 'nine_science_total', 'nine_humanities_section', 'nine_humanities_total', 'nine_business_section', 'nine_business_total', 'ten_science_section', 'ten_science_total', 'ten_humanities_section', 'ten_humanities_total', 'ten_business_section', 'ten_business_total', 'eleven_science_section', 'eleven_science_total', 'eleven_humanities_section', 'eleven_humanities_total', 'eleven_business_section', 'eleven_business_total', 'twelve_science_section', 'twelve_science_total', 'twelve_humanities_section', 'twelve_humanities_total', 'twelve_business_section', 'twelve_business_total', 'total_teacher', 'total_mpo_teacher', 'total_staff', 'total_mpo_staff', 'prev_order', 'general_fund_details', 'reserved_fund_details', 'class_routine', 'mutation_details', 'dakhila_details', 'committee_order', 'student_order',
            ];

            requiredFields.forEach(field => {
                let dataError = null;

                switch (field) {
                    case 'prev_ref':
                    case 'land_tax_number':
                        dataError = ValidationInput.addressCheck(userData[field]);
                        break;

                    case 'ref_date':
                    case 'committee_expiry':
                        dataError = ValidationInput.dateCheck(userData[field], userData[field], userData[field]);
                        break;

                    case 'ref_start':
                    case 'ref_end':
                        dataError = ValidationInput.dateCheck(userData[field], userData.ref_start, userData.ref_end);
                        break;

                    case 'general_fund':
                    case 'reserved_fund':
                    case 'total_land':
                    case 'mutation_land':
                    case 'area_room':
                    case 'area_library':
                    case 'area_labratory':
                    case 'area_computer_room':
                        dataError = ValidationInput.decimalCheck(userData[field]);
                        break;

                    case 'recog_inst_status':
                    case 'land_tax_year':
                    case 'committee_type':
                    case 'total_concrete_building':
                    case 'total_other_building':
                    case 'total_room':
                    case 'used_room':
                    case 'researved_room':
                    case 'total_toilet':
                    case 'total_tubewell':
                    case 'electricity_connection':
                    case 'total_library':
                    case 'total_books':
                    case 'total_labratory':
                    case 'total_equipment_price':
                    case 'computer_room':
                    case 'total_computer':
                    case 'total_permitted_student':
                    case 'total_teacher':
                    case 'total_mpo_teacher':
                    case 'total_staff':
                    case 'total_mpo_staff':
                        dataError = ValidationInput.numberCheck(userData[field]);
                        break;

                    case 'jsc1_exam_year':
                    case 'jsc2_exam_year':
                    case 'jsc3_exam_year':
                        if (userData.recog_inst_status === '11' || userData.recog_inst_status === '20') {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'jsc1_science_registered':
                    case 'jsc1_science_appeared':
                    case 'jsc1_science_passed':
                    case 'jsc2_science_registered':
                    case 'jsc2_science_appeared':
                    case 'jsc2_science_passed':
                    case 'jsc3_science_registered':
                    case 'jsc3_science_appeared':
                    case 'jsc3_science_passed':
                    case 'six_science_section':
                    case 'six_science_total':
                    case 'seven_science_section':
                    case 'seven_science_total':
                    case 'eight_science_section':
                    case 'eight_science_total':
                        if (userData.recog_inst_status === '11' || userData.recog_inst_status === '20') {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    // case 'jsc1_humanities_registered':
                    // case 'jsc1_humanities_appeared':
                    // case 'jsc1_humanities_passed':
                    // case 'jsc2_humanities_registered':
                    // case 'jsc2_humanities_appeared':
                    // case 'jsc2_humanities_passed':
                    // case 'jsc3_humanities_registered':
                    // case 'jsc3_humanities_appeared':
                    // case 'jsc3_humanities_passed':
                    // case 'six_humanities_section':
                    // case 'six_humanities_total':
                    // case 'seven_humanities_section':
                    // case 'seven_humanities_total':
                    // case 'eight_humanities_section':
                    // case 'eight_humanities_total':
                    // if (userData.recog_inst_status === '11' || userData.recog_inst_status === '20') {
                    //     dataError = ValidationInput.numberCheck(userData[field]);
                    // }
                    // break;

                    // case 'jsc1_business_registered':
                    // case 'jsc1_business_appeared':
                    // case 'jsc1_business_passed':
                    // case 'jsc2_business_registered':
                    // case 'jsc2_business_appeared':
                    // case 'jsc2_business_passed':
                    // case 'jsc3_business_registered':
                    // case 'jsc3_business_appeared':
                    // case 'jsc3_business_passed':
                    // case 'six_business_section':
                    // case 'six_business_total':
                    // case 'seven_business_section':
                    // case 'seven_business_total':
                    // case 'eight_business_section':
                    // case 'eight_business_total':
                    // if (userData.recog_inst_status === '11' || userData.recog_inst_status === '20') {
                    //     dataError = ValidationInput.numberCheck(userData[field]);
                    // }
                    // break;

                    case 'ssc1_exam_year':
                    case 'ssc2_exam_year':
                    case 'ssc3_exam_year':
                        if (userData.recog_inst_status === '12' || userData.recog_inst_status === '20') {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'ssc1_science_registered':
                    case 'ssc1_science_appeared':
                    case 'ssc1_science_passed':
                    case 'ssc2_science_registered':
                    case 'ssc2_science_appeared':
                    case 'ssc2_science_passed':
                    case 'ssc3_science_registered':
                    case 'ssc3_science_appeared':
                    case 'ssc3_science_passed':
                    case 'nine_science_section':
                    case 'nine_science_total':
                    case 'ten_science_section':
                    case 'ten_science_total':
                        if ((userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && (userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'ssc1_humanities_registered':
                    case 'ssc1_humanities_appeared':
                    case 'ssc1_humanities_passed':
                    case 'ssc2_humanities_registered':
                    case 'ssc2_humanities_appeared':
                    case 'ssc2_humanities_passed':
                    case 'ssc3_humanities_registered':
                    case 'ssc3_humanities_appeared':
                    case 'ssc3_humanities_passed':
                    case 'nine_humanities_section':
                    case 'nine_humanities_total':
                    case 'ten_humanities_section':
                    case 'ten_humanities_total':
                        if ((userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && (userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'ssc1_business_registered':
                    case 'ssc1_business_appeared':
                    case 'ssc1_business_passed':
                    case 'ssc2_business_registered':
                    case 'ssc2_business_appeared':
                    case 'ssc2_business_passed':
                    case 'ssc3_business_registered':
                    case 'ssc3_business_appeared':
                    case 'ssc3_business_passed':
                    case 'nine_business_section':
                    case 'nine_business_total':
                    case 'ten_business_section':
                    case 'ten_business_total':
                        if ((userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && (userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'hsc1_exam_year':
                    case 'hsc2_exam_year':
                    case 'hsc3_exam_year':
                        if (userData.recog_inst_status === '13' || userData.recog_inst_status === '26' || userData.recog_inst_status === '20') {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'hsc1_science_registered':
                    case 'hsc1_science_appeared':
                    case 'hsc1_science_passed':
                    case 'hsc2_science_registered':
                    case 'hsc2_science_appeared':
                    case 'hsc2_science_passed':
                    case 'hsc3_science_registered':
                    case 'hsc3_science_appeared':
                    case 'hsc3_science_passed':
                    case 'eleven_science_section':
                    case 'eleven_science_total':
                    case 'twelve_science_section':
                    case 'twelve_science_total':
                        if ((userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && (userData.id_group === '01' || userData.id_group === '04' || userData.id_group === '05' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'hsc1_humanities_registered':
                    case 'hsc1_humanities_appeared':
                    case 'hsc1_humanities_passed':
                    case 'hsc2_humanities_registered':
                    case 'hsc2_humanities_appeared':
                    case 'hsc2_humanities_passed':
                    case 'hsc3_humanities_registered':
                    case 'hsc3_humanities_appeared':
                    case 'hsc3_humanities_passed':
                    case 'eleven_humanities_section':
                    case 'eleven_humanities_total':
                    case 'twelve_humanities_section':
                    case 'twelve_humanities_total':
                        if ((userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && (userData.id_group === '02' || userData.id_group === '04' || userData.id_group === '06' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'hsc1_business_registered':
                    case 'hsc1_business_appeared':
                    case 'hsc1_business_passed':
                    case 'hsc2_business_registered':
                    case 'hsc2_business_appeared':
                    case 'hsc2_business_passed':
                    case 'hsc3_business_registered':
                    case 'hsc3_business_appeared':
                    case 'hsc3_business_passed':
                    case 'eleven_business_section':
                    case 'eleven_business_total':
                    case 'twelve_business_section':
                    case 'twelve_business_total':
                        if ((userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && (userData.id_group === '03' || userData.id_group === '05' || userData.id_group === '06' || userData.id_group === '07' || userData.id_group === '99')) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        }
                        break;

                    case 'prev_order':
                    case 'general_fund_details':
                    case 'reserved_fund_details':
                    case 'class_routine':
                    case 'mutation_details':
                    case 'dakhila_details':
                    case 'committee_order':
                    case 'student_order':
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

            // Call Recognition Vadidation Function for Different Condition
            if (isValid) {
                const recogRegDataError = recognitionAppEvalReg(userData);
                const recogExmDataError = recognitionAppEvalExm(userData);
                Object.entries(recogRegDataError).forEach(([key, value]) => {
                    if (value) {
                        newErrors[key] = value;
                        isValid = false;
                        setValidated(false);
                    }
                });
                Object.entries(recogExmDataError).forEach(([key, value]) => {
                    if (value) {
                        newErrors[key] = value;
                        isValid = false;
                        setValidated(false);
                    }
                });
            }

            // console.log(newErrors);

            // Update once
            setUserDataError(newErrors);

            if (!isValid) {
                setModalError(true);
                setUpdateStatus({ loading: false, success: false, error: "প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!" });
                event.stopPropagation();
            } else {
                const myData = JSON.parse(JSON.stringify(userData));
                Object.entries(myData).map(([field, error]) => {
                    if (!myData[field]) {
                        myData[field] = '0';
                    }
                    return myData;
                });

                // console.log(myData);

                const formData = new FormData();
                formData.append('institute_data', JSON.stringify(myData));

                // console.log(formData);

                Object.entries(files).forEach(([filename, file]) => {
                    if (file) {
                        formData.append('files', file); // Field name should match backend
                        // console.log(file);
                    }
                });

                try {
                    const user_data =
                        userData.id_application ?
                            await axiosApi.post(`/institute/recognition/update_application`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            })
                            :
                            await axiosApi.post(`/institute/recognition/new_application`, formData, {
                                headers: { 'Content-Type': 'multipart/form-data' },
                            });
                    if (user_data.status === 200) {
                        alert(user_data.data.message);
                        setUpdateStatus({ loading: false, success: user_data.data.message, error: false });
                        setNavigateRecognitionApp(false);
                        fetchApplication();
                    } else {
                        setUpdateStatus({ loading: false, success: false, error: user_data.data.message });
                        alert(user_data.data.message);
                    }
                } catch (err) {

                    if (err.status === 401) {
                        navigate('/auth/sign-out');

                    }
                    setUpdateStatus({ loading: false, success: false, error: err?.user_data?.data?.message || 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি!' });
                    alert(err?.user_data?.data?.message || 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি! কিছুক্ষণ পর আবার চেষ্টা করুন।');
                } finally {
                    setUpdateStatus((prev) => ({ ...prev, loading: false }));
                }
            }
        }
        setValidated(true);
    };

    // Handle Reset Recognition Application
    const handleRecognitionReset = () => {
        setUserData({ ...userData, ...DEFAULT_RECOG_DATA });

        setUserDataError([]);

        setFiles(DEFAULT_RECOG_FILES);

        setModalError(false);
    }

    // Handle Recognition Application Payment
    const handleRecognitionPayment = async () => {
        setFetchStatus({ loading: "পেমেন্ট এর জন্য অপেক্ষা করুন...", success: false, error: false });
        // Call Payment API
        try {
            const myData = { id_application: userData.id_application, id_invoice: userData.id_invoice, recog_inst_status: userData.recog_inst_status, count_applicaton: userData.count_applicaton };
            const user_data = await axiosApi.post(`/institute/recognition/payment`, { userData: myData });
            if (user_data.status === 200) {
                setFetchStatus({ loading: false, success: user_data.data.message, error: false });
                window.location.href = user_data.data.data.RedirectToGateway;
            } else {
                setFetchStatus({ loading: false, success: false, error: user_data.data.message });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setFetchStatus({ loading: false, success: false, error: err.message });
        } finally {
            setFetchStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    if (navigateRecognitionApp) return (
        <RecognitionApp
            userData={userData}
            setUserData={setUserData}
            userDataError={userDataError}
            setUserDataError={setUserDataError}
            handleDataChange={handleDataChange}
            files={files}
            handleFileSelect={handleFileSelect}
            filesPages={filesPages}
            setFilesPages={setFilesPages}
            validated={validated}
            updateStatus={updateStatus}
            setNavigateRecognitionApp={setNavigateRecognitionApp}
            handleRecognitionSubmit={handleRecognitionSubmit}
            handleRecognitionReset={handleRecognitionReset}
            modalError={modalError}
            setModalError={setModalError}
        />
    )

    if (navigateRecognitionPrint) return (
        <RecognitionPrint
            userData={userData}
            recognitionFiles={recognitionFiles}
            navigateRecognitionPrint={navigateRecognitionPrint}
            setNavigateRecognitionPrint={setNavigateRecognitionPrint}
        />
    )

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                        <Card.Header className='d-flex flex-column p-0 m-0 py-3 justify-content-center align-items-center'>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>একাডেমিক স্বীকৃতি/স্বীকৃতি নবায়নের আবেদন</h4>
                            {fetchStatus?.success && <h6 className="text-uppercase text-center py-1 text-success">{fetchStatus.success}</h6>}
                            {fetchStatus?.error && <h6 className="text-uppercase text-center py-1 text-danger">{fetchStatus.error}</h6>}
                            {fetchStatus?.loading && <h6 className="text-uppercase text-center py-1 text-primary">{fetchStatus.loading}</h6>}
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            <Row className='d-flex justify-content-center align-items-center m-0 py-0'>
                                <Col md={10}>
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
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_user}</span>
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
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark text-uppercase"}>{userData.en_user}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.inst_mobile}</span>
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
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.inst_email}</span>
                                                            </td>
                                                        </tr>
                                                        {userData.bn_app_status && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনের অবস্থা</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button onClick={() => alert(`আবেদনটি বর্তমানে ${userData.bn_app_status} অবস্থায় আছে`)} className='flex-fill w-50' type="button" variant="btn btn-outline-primary"> {userData.bn_app_status}</Button>
                                                            </td>
                                                        </tr>}
                                                        {fetchStatus?.success && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আবেদনপত্র</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button onClick={() => handleSetNavigateRecognitionPrint()} className='flex-fill w-50' type="button" variant="btn btn-outline-warning"> প্রিন্ট করুন</Button>
                                                            </td>
                                                        </tr>}
                                                        {!fetchStatus?.success && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>নতুন আবেদন</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button type="button" className='flex-fill w-50' variant="btn btn-outline-secondary" onClick={() => handleSetNavigateRecognitionApp()}>আবেদন করুন</Button>
                                                            </td>
                                                        </tr>}
                                                        {(fetchStatus?.success && userData.id_payment !== '03') && <>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>আনপেইড আবেদন</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button type="button" className='flex-fill w-50' variant="btn btn-outline-info" onClick={() => handleSetNavigateRecognitionApp()}>আপডেট করুন</Button>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <th className='text-left align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সেবামূল্য (ফি)</span>
                                                                </th>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                                </td>
                                                                <td className='text-center align-top text-wrap p-2 m-0'>
                                                                    <Button type="button" className='flex-fill w-50' variant="btn btn-outline-success" onClick={() => handleRecognitionPayment()}>পেমেন্ট করুন</Button>
                                                                </td>
                                                            </tr>
                                                        </>}
                                                        {(fetchStatus?.success && userData.id_signed && userData.app_status === '17') && <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অনুমতির আদেশ</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <Button type="button" className='flex-fill w-50' variant="btn btn-outline-success" onClick={() => window.open(`${FRONTEND_URL}/institute/recognition/order?id_order=${userData.id_invoice}`, '_blank', 'noopener,noreferrer')}>প্রিন্ট করুন</Button>
                                                            </td>
                                                        </tr>}
                                                    </tbody>
                                                </table>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment >
    )
}

export default InstRecognitionNew;