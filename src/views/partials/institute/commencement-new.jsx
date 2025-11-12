import React, { useRef, Fragment, useEffect, useState, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

import { Row, Col, Button } from 'react-bootstrap'
import Card from '../../../components/Card'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors.ts'

import { DEFAULT_ESTB_DATA, DEFAULT_FILES_DATA, DEFAULT_FILES_PAGE } from './data/default_data.jsx';
import { estbDataEvaluate } from './evaluation/estb_eval.jsx';
import EstbAppForm from './application/estb_app.jsx';

const InstClassStartNew = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const appName = useSelector(SettingSelector.app_bn_name);

    // Set Dates
    const toDay = new Date();
    toDay.setHours(toDay.getUTCHours() + 6);
    var start_year = toDay.getFullYear() - 120;
    var end_year = toDay.getFullYear() - 18;
    toDay.setFullYear(start_year);
    var start_dob = toDay.toISOString().split('T')[0];
    toDay.setFullYear(end_year);
    var end_dob = toDay.toISOString().split('T')[0];

    const curUrl = '/institute/class-start/application';

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // Student Data Variables
    const [userData, setUserData] = useState({ ...DEFAULT_ESTB_DATA });

    const [userDataError, setUserDataError] = useState([]);

    // Districts and Upazilas
    const [districts, setDistricts] = useState([]);

    // File Attachment
    const [files, setFiles] = useState({ ...DEFAULT_FILES_DATA });

    const [filesPages, setFilesPages] = useState({ ...DEFAULT_FILES_PAGE });

    // Data Status
    const [updateStatus, setUpdateStatus] = useState({ 'success': false, 'loading': false, 'error': false });

    // const [printApplication, serPrintApplication] = useState(false);

    const printRef = useRef();

    const navigate = useNavigate();

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
                        size: A4 portrait !important;
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
                           color: #000000 !important;
                           margin: 0 !important;
                           padding: 0.25in !important;
                        }
                    }
                    .print-nowrap{
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

    // computed validations (memoized)
    const establishmentDataError = useMemo(() => estbDataEvaluate(userData), [userData.inst_region, userData.inst_status, userData.inst_distance, userData.inst_population]);

    // Establishment Data Evaluation
    useEffect(() => {
        // sync into userDataError
        setUserDataError(prev => ({ ...prev, inst_distance: establishmentDataError.inst_distance, inst_population: establishmentDataError.inst_population }));
        // set validated
        (establishmentDataError.inst_distance || establishmentDataError.inst_population) ? setValidated(true) : setValidated(false);
    }, [establishmentDataError]);// eslint-disable-line react-hooks/exhaustive-deps

    // Reset named institute founder details
    useEffect(() => {
        if (userData.institute_named !== '01') {
            setFiles((prev) => ({ ...prev, founder_details: null }));
            setFilesPages((prev) => ({ ...prev, founder_details: null }));
            setUserDataError((prev) => ({ ...prev, founder_details: null }));
            setUserData((prev) => ({ ...prev, inst_founder_dob: '', inst_founder_name: '', inst_founder_nid: '', inst_founder_mobile: '' }));
        }
    }, [userData.institute_named]);// eslint-disable-line react-hooks/exhaustive-deps

    // Handle File View
    const handleFileView = (field) => {
        const file = files?.[field];

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

    // Handle File Select
    const handleFileSelect = useCallback((fileName, selectedFile, maxSize = 1024 * 1024, allowedType = 'application/pdf') => {
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

    // Handle Submit Application
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);

        setUpdateStatus({ 'success': false, 'loading': "প্রতিষ্ঠানের তথ্য আপলোড করা হচ্ছে! অপেক্ষা করুন...", 'error': false });

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
                        dataError = ValidationInput.numberCheck(userData[field]);
                        break;

                    case 'inst_address':
                    case 'inst_mouza_name':
                    case 'inst_khatiyan_name':
                    case 'inst_land':
                    case 'inst_ltax_num':
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
                setUpdateStatus({ 'success': false, 'loading': false, 'error': "প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!" });
                event.stopPropagation();
            } else {
                const formData = new FormData();
                formData.append('institute_data', JSON.stringify(userData));

                Object.entries(files).forEach(([filename, file]) => {
                    formData.append('files', file); // Field name should match backend
                });

                try {
                    const user_data = await axios.post(`${BACKEND_URL}/institute/class_start/build_new`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (user_data.status === 200) {
                        setUpdateStatus({ 'success': user_data.data.message, 'loading': false, 'error': false });
                        setUserData((prev) => ({ ...prev, user_pass: user_data.data.institute_pass }));
                        setFiles({ ...DEFAULT_FILES_DATA });
                    } else if (user_data.status === 201) {
                        setUpdateStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
                    } else {
                        setUpdateStatus({ 'success': false, 'loading': false, 'error': user_data.data.message });
                    }
                    alert(user_data.data.message);
                } catch (err) {
                    if (err.status === 401) {
                        navigate("/auth/sign-out");
                    }
                    setUpdateStatus({ 'success': false, 'loading': false, 'error': 'প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি!' });
                    alert('প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
                } finally {
                    setUpdateStatus((prev) => ({ ...prev, 'loading': false }))
                }
            }
        }
        setValidated(true);
    };

    // Handle User Data Change
    const handleDataChange = useCallback((name, value) => {
        const formattedValue = name === 'inst_email' ? String(value).toLowerCase() : String(value).toUpperCase();
        setUserData(prev => ({ ...prev, [name]: formattedValue }));
        setUserDataError(prev => ({ ...prev, [name]: '' }));
        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
    }, []);

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setUserDataError([]);
        setValidated(false);

        setUpdateStatus({ 'success': false, 'loading': false, 'error': false });
        setFiles({ ...DEFAULT_FILES_DATA });
        setFilesPages({ ...DEFAULT_FILES_PAGE });
        setUserData({ ...DEFAULT_ESTB_DATA });
    };

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

    if (updateStatus?.success) return (
        <Fragment>
            <Row ref={printRef} className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            <Link to="/institute/establishment/application" onClick={handleReset} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠান স্থাপনের আবেদন</h4>
                        </Card.Header>
                        <hr />
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={8}>
                                <Card className="m-0 p-0">
                                    <Card.Header>
                                        {updateStatus.success && <h5 className={styles.SiyamRupaliFont + " text-success text-center w-100 card-title"}>{updateStatus.success}</h5>}
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <h5 className={styles.SiyamRupaliFont + " text-center py-3"}>আবেদনের সারসংক্ষেপ</h5>
                                            <p className={styles.SiyamRupaliFont + " text-danger text-center m-0 p-0 pt-2"}><small><i>পেমেন্ট ও আবেদনের সকল প্রক্রিয়ায় ইউজার আইডি ও পাসওয়ার্ড ব্যবহার করতে হবে</i></small></p>
                                            <p className={styles.SiyamRupaliFont + " text-danger text-center m-0 pb-4"}><small><i>(প্রিন্ট করে যথাযথভাবে সংরক্ষণ করুন)</i></small></p>
                                        </Row>
                                        <Row className="table-responsive">
                                            <table id="user-list-table" className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>ইউজার আইডি</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_mobile}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>ইউজার পাসওয়ার্ড</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.user_pass}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_bn_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>প্রতিষ্ঠানের নাম (ইংরেজি)</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_en_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>আবেদনকারীর নাম</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.applicant_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>আবেদনকারীর মোবাইল</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.applicant_mobile}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={8} className='d-flex justify-content-center align-items-center gap-3'>
                                <Button onClick={handlePrint} className='flex-fill' type="reset" variant="btn btn-danger">আবেদন প্রিন্ট</Button>
                                <Button onClick={() => navigate('/institute/establishment/payment')} className='flex-fill' type="submit" variant="btn btn-primary">পেমেন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <EstbAppForm
            navigateBuildUpdate={true}
            setNavigateBuildUpdate={null}
            start_dob={start_dob}
            end_dob={end_dob}
            handleBuildUpdateSubmit={handleSubmit}
            handleBuildUpdateReset={handleReset}
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
            curUrl={curUrl}
        />
    )
}

export default InstClassStartNew;