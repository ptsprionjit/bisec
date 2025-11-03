import React, { Fragment, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from "react-redux"
import Select from 'react-select'

import { Document, Page } from 'react-pdf';

import { Row, Col, Button, Form, Card } from 'react-bootstrap';

import ModalView from '../modal_error/modal_error.jsx';

import styles from '../../../../assets/custom/css/bisec.module.css'

import Logo from '../../../../components/partials/components/logo'
import * as SettingSelector from '../../../../store/setting/selectors.ts'

const EstbAppForm = ({
    navigateBuildUpdate, setNavigateBuildUpdate, start_dob, end_dob, handleBuildUpdateSubmit, handleBuildUpdateReset, userData, setUserData, userDataError, validated, handleDataChange, districts, files, filesPages, setFilesPages, handleFileSelect, handleFileView, modalError, setModalError, updateStatus
}) => {
    if (!navigateBuildUpdate) return null;

    const appName = useSelector(SettingSelector.app_bn_name);

    const [optionDistricts, setOptionDistricts] = useState([]);
    const [optionUpazilas, setOptionUpazilas] = useState([]);

    // District options derived via useEffect
    useEffect(() => {
        if (!districts?.length) setOptionDistricts([]);

        const newOptions = districts.map(data => ({
            value: data.en_dist,
            label: data.en_dist
        }));

        if (!newOptions?.length) setOptionDistricts([]);

        const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
        );

        setOptionDistricts(uniqueValues);
    }, [districts]); // eslint-disable-line react-hooks/exhaustive-deps

    // Upazila options derived via useEffect
    useEffect(() => {
        if (userData?.inst_dist) {
            const filteredData = districts.filter(
                item => item.en_dist === userData.inst_dist
            );

            const newOptions = filteredData.map(data => ({
                value: data.id_uzps,
                label: data.en_uzps
            }));

            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );

            setOptionUpazilas(uniqueValues);
        } else {
            setOptionUpazilas([]);
        }
    }, [userData.inst_dist]);

    // Handle District Change
    const handleDistrictChange = (value) => {
        setUserData((prev) => ({ ...prev, inst_dist: value, inst_uzps: '' }));
    };

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            <Link to="/institute/establishment/payment" onClick={() => setNavigateBuildUpdate(false)} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>নতুন প্রতিষ্ঠান স্থাপন/পাঠদানের আবেদন আপডেট</h4>
                            {updateStatus.success && <h6 className="text-uppercase text-center pt-4 text-success">{updateStatus.success}</h6>}
                            {updateStatus.error && <h6 className="text-uppercase text-center pt-4 text-danger">{updateStatus.error}</h6>}
                            {updateStatus.loading && <h6 className="text-uppercase text-center pt-4 text-primary">{updateStatus.loading}</h6>}
                        </Card.Header>
                        <hr />
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={12}>
                                <Form noValidate onSubmit={handleBuildUpdateSubmit} onReset={handleBuildUpdateReset}>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদনকারীর তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={6}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="applicant_name">আবেদনকারীর নাম</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={60}
                                                                id="applicant_name"
                                                                value={userData.applicant_name}
                                                                isInvalid={validated && !!userDataError.applicant_name}
                                                                isValid={validated && userData.applicant_name && !userDataError.applicant_name}
                                                                onChange={(e) => handleDataChange('applicant_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.applicant_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.applicant_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="applicant_mobile">আবেদনকারীর মোবাইল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                minLength={11}
                                                                maxLength={11}
                                                                id="applicant_mobile"
                                                                value={userData.applicant_mobile}
                                                                isInvalid={validated && !!userDataError.applicant_mobile}
                                                                isValid={validated && userData.applicant_mobile && !userDataError.applicant_mobile}
                                                                onChange={(e) => handleDataChange('applicant_mobile', e.target.value)}
                                                            />
                                                            {validated && userDataError.applicant_mobile && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.applicant_mobile}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Group className="bg-transparent">
                                                                <Form.Label className="text-primary" htmlFor='institute_named'>ব্যাক্তি নামের প্রতিষ্ঠান</Form.Label>
                                                                <Form.Select
                                                                    id="institute_named"
                                                                    value={userData.institute_named}
                                                                    isInvalid={validated && !!userDataError.institute_named}
                                                                    isValid={validated && userData.institute_named && !userDataError.institute_named}
                                                                    onChange={(e) => handleDataChange('institute_named', e.target.value)}
                                                                    className="selectpicker form-control"
                                                                    data-style="py-0"
                                                                >
                                                                    <option value=''>-- ব্যাক্তি নামের প্রতিষ্ঠান? --</option>
                                                                    <option value='01'>হ্যাঁ</option>
                                                                    <option value='02'>না</option>
                                                                </Form.Select>
                                                                {validated && userDataError.institute_named && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.institute_named}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>আবেদনকারী/গণের পরিচয়পত্র</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.applicant_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.applicant_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, applicant_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('applicant_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.applicant_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.applicant_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('applicant_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.applicant_details && !userDataError.applicant_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.applicant_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.applicant_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>আবেদন ফর্ম(ক(১)/ক(২))</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.application_form && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.application_form}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, application_form: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('application_form')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.application_form}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.application_form && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('application_form', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.application_form && !userDataError.application_form &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.application_form &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.application_form}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    {userData.institute_named && userData.institute_named === '01' && <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">ব্যক্তির তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={9}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_name">নাম</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={60}
                                                                id="inst_founder_name"
                                                                value={userData.inst_founder_name}
                                                                isInvalid={validated && !!userDataError.inst_founder_name}
                                                                isValid={validated && userData.inst_founder_name && !userDataError.inst_founder_name}
                                                                onChange={(e) => handleDataChange('inst_founder_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_nid">জাতীয় পরিচয়পত্র নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                minLength={10}
                                                                maxLength={17}
                                                                id="inst_founder_nid"
                                                                value={userData.inst_founder_nid}
                                                                isInvalid={validated && !!userDataError.inst_founder_nid}
                                                                isValid={validated && userData.inst_founder_nid && !userDataError.inst_founder_nid}
                                                                onChange={(e) => handleDataChange('inst_founder_nid', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_nid && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_nid}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_dob">জন্ম তারিখ</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="date"
                                                                id="inst_founder_dob"
                                                                min={start_dob}
                                                                max={end_dob}
                                                                value={userData.inst_founder_dob}
                                                                isInvalid={validated && !!userDataError.inst_founder_dob}
                                                                isValid={validated && userData.inst_founder_dob && !userDataError.inst_founder_dob}
                                                                onChange={(e) => handleDataChange('inst_founder_dob', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_dob && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_dob}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_mobile">মোবাইল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_founder_mobile"
                                                                minLength={11}
                                                                maxLength={11}
                                                                value={userData.inst_founder_mobile}
                                                                isInvalid={validated && !!userDataError.inst_founder_mobile}
                                                                isValid={validated && userData.inst_founder_mobile && !userDataError.inst_founder_mobile}
                                                                onChange={(e) => handleDataChange('inst_founder_mobile', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_mobile && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_mobile}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>ব্যক্তির পরিচিতি সংযুক্তি</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.founder_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.founder_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, founder_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('founder_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.founder_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.founder_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('founder_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.founder_details && !userDataError.founder_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.founder_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.founder_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>}
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদিত প্রতিষ্ঠানের তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_bn_name">প্রতিষ্ঠানের নাম (বাংলা)</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={120}
                                                        id="inst_bn_name"
                                                        value={userData.inst_bn_name}
                                                        isInvalid={validated && !!userDataError.inst_bn_name}
                                                        isValid={validated && userData.inst_bn_name && !userDataError.inst_bn_name}
                                                        onChange={(e) => handleDataChange('inst_bn_name', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_bn_name && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_bn_name}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_en_name">প্রতিষ্ঠানের নাম (ইংরেজি)</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={120}
                                                        id="inst_en_name"
                                                        value={userData.inst_en_name}
                                                        isInvalid={validated && !!userDataError.inst_en_name}
                                                        isValid={validated && userData.inst_en_name && !userDataError.inst_en_name}
                                                        onChange={(e) => handleDataChange('inst_en_name', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_en_name && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_en_name}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={6}>
                                                    <Form.Label className="text-primary" htmlFor="inst_email">প্রতিষ্ঠানের ইমেইল</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-lowecase'
                                                        type="text"
                                                        maxLength={80}
                                                        id="inst_email"
                                                        value={userData.inst_email}
                                                        isInvalid={validated && !!userDataError.inst_email}
                                                        isValid={validated && userData.inst_email && !userDataError.inst_email}
                                                        onChange={(e) => handleDataChange('inst_email', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_email && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_email}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={6}>
                                                    <Form.Label className="text-primary" htmlFor="inst_mobile">প্রতিষ্ঠানের মোবাইল</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={11}
                                                        minLength={11}
                                                        id="inst_mobile"
                                                        value={userData.inst_mobile}
                                                        isInvalid={validated && !!userDataError.inst_mobile}
                                                        isValid={validated && userData.inst_mobile && !userDataError.inst_mobile}
                                                        onChange={(e) => handleDataChange('inst_mobile', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_mobile && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_mobile}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_status'>প্রতিষ্ঠানের পর্যায়</Form.Label>
                                                        <Form.Select
                                                            id="inst_status"
                                                            value={userData.inst_status}
                                                            isInvalid={validated && !!userDataError.inst_status}
                                                            isValid={validated && userData.inst_status && !userDataError.inst_status}
                                                            onChange={(e) => handleDataChange('inst_status', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের পর্যায় সিলেক্ট করুন --</option>
                                                            <option value='11'>নিম্ন মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ৮ম শ্রেণী)</option>
                                                            <option value='12'>মাধ্যমিক বিদ্যালয় (৯ম থেকে ১০ম শ্রেণী)</option>
                                                            <option value='13'>উচ্চমাধ্যমিক মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>
                                                            {/* <option value='17'>নিম্ন মাধ্যমিক এবং মাধ্যমিক (৬ষ্ঠ থেকে ১০ম শ্রেণী)</option> */}
                                                            {/* <option value='19'>মাধ্যমিক এবং উচ্চমাধ্যমিক (৯ম থেকে ১২শ শ্রেণী)</option> */}
                                                            <option value='20'>উচ্চমাধ্যমিক বিদ্যালয় ও মহাবিদ্যালয় (৬ষ্ঠ থেকে ১২শ শ্রেণী)</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_status && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_status}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_coed'>প্রতিষ্ঠানের ধরণ</Form.Label>
                                                        <Form.Select
                                                            id="inst_coed"
                                                            value={userData.inst_coed}
                                                            isInvalid={validated && !!userDataError.inst_coed}
                                                            isValid={validated && userData.inst_coed && !userDataError.inst_coed}
                                                            onChange={(e) => handleDataChange('inst_coed', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের ধরণ সিলেক্ট করুন --</option>
                                                            {userData.inst_status !== '13' && <>
                                                                <option value='01'>বালক</option>
                                                                <option value='02'>বালিকা</option>
                                                            </>}
                                                            <option value='03'>সহশিক্ষা</option>
                                                            {userData.inst_status === '13' && <option value='04'>মহিলা কলেজ</option>}
                                                        </Form.Select>
                                                        {validated && userDataError.inst_coed && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_coed}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_version'>প্রতিষ্ঠানের মাধ্যম</Form.Label>
                                                        <Form.Select
                                                            id="inst_version"
                                                            value={userData.inst_version}
                                                            isInvalid={validated && !!userDataError.inst_version}
                                                            isValid={validated && userData.inst_version && !userDataError.inst_version}
                                                            onChange={(e) => handleDataChange('inst_version', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের মাধ্যম সিলেক্ট করুন --</option>
                                                            <option value='01'>বাংলা</option>
                                                            <option value='02'>ইংরেজি</option>
                                                            <option value='03'>যৌথ (বাংলা ও ইংরেজি)</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_version && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_version}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদিত প্রতিষ্ঠানের ঠিকানা</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_region'>প্রতিষ্ঠানের অবস্থান</Form.Label>
                                                        <Form.Select
                                                            id="inst_region"
                                                            value={userData.inst_region}
                                                            isInvalid={validated && !!userDataError.inst_region}
                                                            isValid={validated && userData.inst_region && !userDataError.inst_region}
                                                            onChange={(e) => handleDataChange('inst_region', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- অবস্থান সিলেক্ট করুন --</option>
                                                            <option value='01'>সিটি কর্পোরেশন এলাকা</option>
                                                            <option value='02'>পৌরসভা এলাকা (প্রথম শ্রেণী)</option>
                                                            <option value='03'>মফস্বল এলাকা</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_region && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_region}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group>
                                                        <label className="text-primary mb-2" htmlFor='inst_dist'>জেলা</label>
                                                        <Select
                                                            inputId="inst_dist"
                                                            placeholder="--জেলা সিলেক্ট করুন--"
                                                            value={
                                                                optionDistricts.find(opt => opt.value === userData.inst_dist) || null
                                                            }
                                                            onChange={(value) =>
                                                                value ? handleDistrictChange(value.value) : handleDistrictChange('')
                                                            }
                                                            options={optionDistricts}
                                                            isClearable={true}
                                                            isSearchable={true}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col className="my-2" md={4}>
                                                    <Form.Group>
                                                        <label className="text-primary mb-2" htmlFor="inst_uzps">
                                                            উপজেলা
                                                        </label>

                                                        <Select
                                                            inputId="inst_uzps"
                                                            placeholder="--উপজেলা সিলেক্ট করুন--"
                                                            value={optionUpazilas.find(opt => opt.value === userData.inst_uzps) || null}
                                                            onChange={(value) => value ? handleDataChange('inst_uzps', value.value) : handleDataChange('inst_uzps', '')}
                                                            options={optionUpazilas}
                                                            isClearable
                                                            isSearchable
                                                            // Show red border if invalid
                                                            classNamePrefix={validated && userDataError.inst_uzps ? 'is-invalid' : ''}
                                                        />

                                                        {/* Validation message */}
                                                        {validated && userDataError.inst_uzps && (
                                                            <div className="invalid-feedback d-block">
                                                                {userDataError.inst_uzps}
                                                            </div>
                                                        )}
                                                    </Form.Group>
                                                </Col>

                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_address">প্রতিষ্ঠানের পূর্ণ ঠিকানা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={80}
                                                        placeholder='হোল্ডিং/বাড়ি নম্বর, রাস্তা, ওয়ার্ড, গ্রাম, ইউনিয়ন, ডাকঘর'
                                                        id="inst_address"
                                                        value={userData.inst_address}
                                                        isInvalid={validated && !!userDataError.inst_address}
                                                        isValid={validated && userData.inst_address && !userDataError.inst_address}
                                                        onChange={(e) => handleDataChange('inst_address', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_address && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_address}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের জমির বিবরণ</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={6}>
                                                    <Row>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_mouza_name">মৌজার নাম </Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_mouza_name"
                                                                value={userData.inst_mouza_name}
                                                                isInvalid={validated && !!userDataError.inst_mouza_name}
                                                                isValid={validated && userData.inst_mouza_name && !userDataError.inst_mouza_name}
                                                                onChange={(e) => handleDataChange('inst_mouza_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_mouza_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_mouza_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Group className="bg-transparent">
                                                                <Form.Label className="text-primary" htmlFor='inst_khatiyan_name'>খতিয়ানের নাম</Form.Label>
                                                                <Form.Select
                                                                    id="inst_khatiyan_name"
                                                                    value={userData.inst_khatiyan_name}
                                                                    isInvalid={validated && !!userDataError.inst_khatiyan_name}
                                                                    isValid={validated && userData.inst_khatiyan_name && !userDataError.inst_khatiyan_name}
                                                                    onChange={(e) => handleDataChange('inst_khatiyan_name', e.target.value)}
                                                                    className="selectpicker form-control"
                                                                    data-style="py-0"
                                                                >
                                                                    <option value=''>-- খতিয়ানের নাম সিলেক্ট করুন --</option>
                                                                    <option value='01'>সিএস খতিয়ান</option>
                                                                    <option value='02'>এসএ খতিয়ান</option>
                                                                    <option value='03'>আরএস খতিয়ান</option>
                                                                    <option value='04'>বিআরএস খতিয়ান</option>
                                                                    <option value='05'>বিডিএস খতিয়ান</option>
                                                                    <option value='06'>দিয়ারা খতিয়ান</option>
                                                                    <option value='07'>পেটি খতিয়ান</option>
                                                                    <option value='08'>নামজারি খতিয়ান</option>
                                                                </Form.Select>
                                                                {validated && userDataError.inst_khatiyan_name && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.inst_khatiyan_name}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_mouza_number">মৌজার নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_mouza_number"
                                                                value={userData.inst_mouza_number}
                                                                isInvalid={validated && !!userDataError.inst_mouza_number}
                                                                isValid={validated && userData.inst_mouza_number && !userDataError.inst_mouza_number}
                                                                onChange={(e) => handleDataChange('inst_mouza_number', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_mouza_number && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_mouza_number}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_khatiyan_number">খতিয়ানের নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_khatiyan_number"
                                                                value={userData.inst_khatiyan_number}
                                                                isInvalid={validated && !!userDataError.inst_khatiyan_number}
                                                                isValid={validated && userData.inst_khatiyan_number && !userDataError.inst_khatiyan_number}
                                                                onChange={(e) => handleDataChange('inst_khatiyan_number', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_khatiyan_number && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_khatiyan_number}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_land">জমির পরিমাণ (শতক)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_land"
                                                                value={userData.inst_land}
                                                                isInvalid={validated && !!userDataError.inst_land}
                                                                isValid={validated && userData.inst_land && !userDataError.inst_land}
                                                                onChange={(e) => handleDataChange('inst_land', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_land && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_land}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_ltax_year">পরিশোধিত খাজনার সন (সর্বশেষ)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={4}
                                                                minLength={4}
                                                                id="inst_ltax_year"
                                                                value={userData.inst_ltax_year}
                                                                isInvalid={validated && !!userDataError.inst_ltax_year}
                                                                isValid={validated && userData.inst_ltax_year && !userDataError.inst_ltax_year}
                                                                onChange={(e) => handleDataChange('inst_ltax_year', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_ltax_year && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_ltax_year}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_ltax_num">খাজনার দাখিলা নম্বর (সর্বশেষ)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_ltax_num"
                                                                value={userData.inst_ltax_num}
                                                                isInvalid={validated && !!userDataError.inst_ltax_num}
                                                                isValid={validated && userData.inst_ltax_num && !userDataError.inst_ltax_num}
                                                                onChange={(e) => handleDataChange('inst_ltax_num', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_ltax_num && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_ltax_num}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>খতিয়ান ও দলিল সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.land_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.land_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, land_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('land_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.land_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.land_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('land_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.land_details && !userDataError.land_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.land_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.land_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>দাখিলা ও ভূমির প্রত্যয়ন সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.ltax_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.ltax_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, ltax_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('ltax_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.ltax_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.ltax_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('ltax_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.ltax_details && !userDataError.ltax_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.ltax_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.ltax_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">অন্যান্য তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_distance">বিদ্যমান প্রতিষ্ঠানসূহের নিকটতম দূরত্ব (কিলোমিটার) (উপজেলা নির্বাহী কর্মকর্তা কর্তৃক প্রদত্ত প্রত্যয়ন অনুযায়ী)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_distance"
                                                                value={userData.inst_distance}
                                                                isInvalid={validated && !!userDataError.inst_distance}
                                                                isValid={validated && userData.inst_distance && !userDataError.inst_distance}
                                                                onChange={(e) => handleDataChange('inst_distance', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_distance && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_distance}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_population">প্রতিষ্ঠান এলাকার জনসংখ্যা (জেলা/উপজেলা পরিসংখ্যান কর্মকর্তা কর্তৃক প্রদত্ত প্রত্যয়ন অনুযায়ী)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_population"
                                                                value={userData.inst_population}
                                                                isInvalid={validated && !!userDataError.inst_population}
                                                                isValid={validated && userData.inst_population && !userDataError.inst_population}
                                                                onChange={(e) => handleDataChange('inst_population', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_population && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_population}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>দূরত্বের সনদ সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.distance_cert && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.distance_cert}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, distance_cert: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('distance_cert')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.distance_cert}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.distance_cert && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('distance_cert', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.distance_cert && !userDataError.distance_cert &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.distance_cert &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.distance_cert}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>জনসংখ্যার সনদ সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.population_cert && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.population_cert}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, population_cert: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('population_cert')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.population_cert}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.population_cert && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('population_cert', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.population_cert && !userDataError.population_cert &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.population_cert &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.population_cert}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>অঙ্গীকারনামা (ফর্ম ক(৩))</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.declare_form && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.declare_form}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, declare_form: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('declare_form')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.declare_form}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.declare_form && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('declare_form', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.declare_form && !userDataError.declare_form &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.declare_form &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.declare_form}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>স্থাপনের যৌক্তিকতার বিবরণ</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.feasibility_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.feasibility_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, feasibility_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('feasibility_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.feasibility_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.feasibility_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('feasibility_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.feasibility_details && !userDataError.feasibility_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.feasibility_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.feasibility_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0">
                                        {updateStatus.success && <i className="text-uppercase text-center pt-4 text-success">{updateStatus.success}</i>}
                                        {updateStatus.error && <i className="text-uppercase text-center pt-4 text-danger">{updateStatus.error}</i>}
                                        {updateStatus.loading && <i className="text-uppercase text-center pt-4 text-primary">{updateStatus.loading}</i>}
                                        <Card.Body className="d-flex justify-content-center gap-3">
                                            <Button className='flex-fill' type="button" onClick={() => setNavigateBuildUpdate(false)} variant="btn btn-warning">ফিরে যান</Button>
                                            <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                            <Button className='flex-fill' type="submit" variant="btn btn-success">আপডেট</Button>
                                        </Card.Body>
                                    </Card>
                                </Form>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <ModalView
                modalError={modalError}
                setModalError={setModalError}
                userDataError={userDataError}
            />
        </Fragment>
    )
}

export default EstbAppForm;