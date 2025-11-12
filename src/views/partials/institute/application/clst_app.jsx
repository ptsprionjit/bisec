import React, { Fragment } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from "react-redux"

import { Document, Page } from 'react-pdf';

import { Row, Col, Button, Form, Card } from 'react-bootstrap';

import ModalView from '../modal_error/modal_error.jsx';

import styles from '../../../../assets/custom/css/bisec.module.css'

import Logo from '../../../../components/partials/components/logo'
import * as SettingSelector from '../../../../store/setting/selectors.ts'

const ClassStartAppForm = ({
    navigateClassStartApplication, setNavigateClassStartApplication, updateStatus, buildPrintData, handleClassStartSubmit, handleClassStartReset, userData, userDataError, validated, handleDataChange, files, filesPages, setFilesPages, handleFileSelect, handleFileView, modalError, setModalError
}) => {
    if (!navigateClassStartApplication) return null;
    const appName = useSelector(SettingSelector.app_bn_name);
    const navigate = useNavigate();

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Header className='d-flex flex-column justify-content-center align-items-center'>
                            <Link to="/institute/class-start/application" onClick={() => setNavigateClassStartApplication(false)} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>পাঠদান অনুমতির আবেদনপত্র</h4>
                            {updateStatus.success && <h6 className="text-uppercase text-center pt-4 text-success">{updateStatus.success}</h6>}
                            {updateStatus.error && <h6 className="text-uppercase text-center pt-4 text-danger">{updateStatus.error}</h6>}
                            {updateStatus.loading && <h6 className="text-uppercase text-center pt-4 text-primary">{updateStatus.loading}</h6>}
                        </Card.Header>
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12}>
                                <Card className="m-0 p-0 mb-3">
                                    <Card.Body className="mb-0 pb-0">
                                        <Row className="table-responsive m-0 p-0">
                                            <table id="user-list-table" className="table">
                                                <tbody>
                                                    <tr>
                                                        <th colSpan={6} className='text-center align-top text-wrap m-0 py-2'>
                                                            <h5 className={styles.SiyamRupaliFont + " text-center text-secondary"}>প্রতিষ্ঠানের তথ্য</h5>
                                                        </th>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
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
                                                        <td colSpan={4} className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_en_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ব্যক্তি নামের প্রতিষ্ঠান</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.institute_named === '01' ? 'হ্যাঁ' : 'না'}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>অনুমতির স্বারক</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.id_invoice}</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_email}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মোবাইল</span>
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
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের ধরণ</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_coed}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের মাধ্যম</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_version} মাধ্যম</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের পর্যায়</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.bn_status}</span>
                                                        </td>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>প্রতিষ্ঠানের অবস্থান</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        {buildPrintData.inst_region === '01' && <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>সিটি কর্পোরেশন এলাকা</span>
                                                        </td>}
                                                        {buildPrintData.inst_region === '02' && <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>পৌরসভা এলাকা</span>
                                                        </td>}
                                                        {buildPrintData.inst_region === '03' && <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>মফস্বল এলাকা</span>
                                                        </td>}
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>ঠিকানা</span>
                                                        </th>
                                                        <td className='text-center align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                        </td>
                                                        <td colSpan={4} className='text-left text-uppercase align-top text-wrap p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{buildPrintData.inst_address}, {buildPrintData.en_uzps} ,{buildPrintData.inst_dist}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={12}>
                                <Form noValidate onSubmit={handleClassStartSubmit} onReset={handleClassStartReset}>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Body>
                                            <Row>
                                                <Col md={6}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Group className="bg-transparent">
                                                                <Form.Label className="text-primary" htmlFor='inst_stage'>পাঠদানের পর্যায়</Form.Label>
                                                                <Form.Select
                                                                    id="inst_stage"
                                                                    value={userData.inst_stage}
                                                                    isInvalid={validated && !!userDataError.inst_stage}
                                                                    isValid={validated && userData.inst_stage && !userDataError.inst_stage}
                                                                    onChange={(e) => handleDataChange('inst_stage', e.target.value)}
                                                                    className="selectpicker form-control"
                                                                    data-style="py-0"
                                                                >
                                                                    <option value=''>-- প্রতিষ্ঠানের পর্যায় সিলেক্ট করুন --</option>
                                                                    {(userData.inst_status === '11' || userData.inst_status === '20') && <option value='11'>নিম্ন মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ৮ম শ্রেণী)</option>}
                                                                    {(userData.inst_status === '12' || userData.inst_status === '20') && <option value='12'>মাধ্যমিক বিদ্যালয় (৯ম থেকে ১০ম শ্রেণী)</option>}
                                                                    {(userData.inst_status === '13' || userData.inst_status === '20') && <option value='13'>উচ্চমাধ্যমিক মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>}
                                                                    {/* <option value='17'>নিম্ন মাধ্যমিক এবং মাধ্যমিক (৬ষ্ঠ থেকে ১০ম শ্রেণী)</option> */}
                                                                    {/* <option value='19'>মাধ্যমিক এবং উচ্চমাধ্যমিক (৯ম থেকে ১২শ শ্রেণী)</option> */}
                                                                    {(userData.inst_status === '20') && <option value='20'>উচ্চমাধ্যমিক বিদ্যালয় ও মহাবিদ্যালয় (৬ষ্ঠ থেকে ১২শ শ্রেণী)</option>}
                                                                </Form.Select>
                                                                {validated && userDataError.inst_stage && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.inst_stage}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="khatiyan_mutation">নামজারি খতিয়ান নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="khatiyan_mutation"
                                                                value={userData.khatiyan_mutation}
                                                                isInvalid={validated && !!userDataError.khatiyan_mutation}
                                                                isValid={validated && userData.khatiyan_mutation && !userDataError.khatiyan_mutation}
                                                                onChange={(e) => handleDataChange('khatiyan_mutation', e.target.value)}
                                                            />
                                                            {validated && userDataError.khatiyan_mutation && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.khatiyan_mutation}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="khatiyan_mouja">মৌজার নাম ও নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="khatiyan_mouja"
                                                                value={userData.khatiyan_mouja}
                                                                isInvalid={validated && !!userDataError.khatiyan_mouja}
                                                                isValid={validated && userData.khatiyan_mouja && !userDataError.khatiyan_mouja}
                                                                onChange={(e) => handleDataChange('khatiyan_mouja', e.target.value)}
                                                            />
                                                            {validated && userDataError.khatiyan_mouja && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.khatiyan_mouja}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="khatiyan_total">জমির পরিমাণ</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="khatiyan_total"
                                                                value={userData.khatiyan_total}
                                                                isInvalid={validated && !!userDataError.khatiyan_total}
                                                                isValid={validated && userData.khatiyan_total && !userDataError.khatiyan_total}
                                                                onChange={(e) => handleDataChange('khatiyan_total', e.target.value)}
                                                            />
                                                            {validated && userDataError.khatiyan_total && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.khatiyan_total}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="tax_receipt">হাল দাখিলা নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="tax_receipt"
                                                                value={userData.tax_receipt}
                                                                isInvalid={validated && !!userDataError.tax_receipt}
                                                                isValid={validated && userData.tax_receipt && !userDataError.tax_receipt}
                                                                onChange={(e) => handleDataChange('tax_receipt', e.target.value)}
                                                            />
                                                            {validated && userDataError.tax_receipt && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.tax_receipt}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>নামজারি খতিয়ান সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.mutation_details && files.mutation_details.name.toLowerCase() === 'mutation_details.pdf' && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.mutation_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, mutation_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('mutation_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.mutation_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {(!files.mutation_details || files.mutation_details.name.toLowerCase() !== 'mutation_details.pdf') && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('mutation_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {(!files.mutation_details || files.mutation_details.name.toLowerCase() !== 'mutation_details.pdf') && !userDataError.mutation_details &&
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
                                                            {userDataError.mutation_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.mutation_details}
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
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>হাল দাখিলা সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.dakhila_details && files.dakhila_details.name.toLowerCase() === "dakhila_details.pdf" && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.dakhila_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, dakhila_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('dakhila_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.dakhila_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {(!files.dakhila_details || files.dakhila_details.name.toLowerCase() !== "dakhila_details.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('dakhila_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {(!files.dakhila_details || files.dakhila_details.name.toLowerCase() !== "dakhila_details.pdf") && !userDataError.dakhila_details &&
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
                                                            {userDataError.dakhila_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.dakhila_details}
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
                                            <h5 className="text-center w-100 card-title">অবকাঠামোগত তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="class_room">শ্রেণীকক্ষের সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="class_room"
                                                        value={userData.class_room}
                                                        isInvalid={validated && !!userDataError.class_room}
                                                        isValid={validated && userData.class_room && !userDataError.class_room}
                                                        onChange={(e) => handleDataChange('class_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.class_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.class_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="office_room">অফিস কক্ষের সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="office_room"
                                                        value={userData.office_room}
                                                        isInvalid={validated && !!userDataError.office_room}
                                                        isValid={validated && userData.office_room && !userDataError.office_room}
                                                        onChange={(e) => handleDataChange('office_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.office_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.office_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="toilet_room">ওয়াশরুম সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-lowecase'
                                                        type="text"
                                                        id="toilet_room"
                                                        value={userData.toilet_room}
                                                        isInvalid={validated && !!userDataError.toilet_room}
                                                        isValid={validated && userData.toilet_room && !userDataError.toilet_room}
                                                        onChange={(e) => handleDataChange('toilet_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.toilet_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.toilet_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="common_room">কমনরুম সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="common_room"
                                                        value={userData.common_room}
                                                        isInvalid={validated && !!userDataError.common_room}
                                                        isValid={validated && userData.common_room && !userDataError.common_room}
                                                        onChange={(e) => handleDataChange('common_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.common_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.common_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="library_room">গ্রন্থাগার সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="library_room"
                                                        value={userData.library_room}
                                                        isInvalid={validated && !!userDataError.library_room}
                                                        isValid={validated && userData.library_room && !userDataError.library_room}
                                                        onChange={(e) => handleDataChange('library_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.library_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.library_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="computer_room">কম্পিউটার ল্যাব সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="computer_room"
                                                        value={userData.computer_room}
                                                        isInvalid={validated && !!userDataError.computer_room}
                                                        isValid={validated && userData.computer_room && !userDataError.computer_room}
                                                        onChange={(e) => handleDataChange('computer_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.computer_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.computer_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="labratory_room">বিজ্ঞানাগার সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="labratory_room"
                                                        value={userData.labratory_room}
                                                        isInvalid={validated && !!userDataError.labratory_room}
                                                        isValid={validated && userData.labratory_room && !userDataError.labratory_room}
                                                        onChange={(e) => handleDataChange('labratory_room', e.target.value)}
                                                    />
                                                    {validated && userDataError.labratory_room && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.labratory_room}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="total_books">বই এর সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="total_books"
                                                        value={userData.total_books}
                                                        isInvalid={validated && !!userDataError.total_books}
                                                        isValid={validated && userData.total_books && !userDataError.total_books}
                                                        onChange={(e) => handleDataChange('total_books', e.target.value)}
                                                    />
                                                    {validated && userDataError.total_books && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.total_books}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="total_computer">কম্পিউটারের সংখ্যা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        id="total_computer"
                                                        value={userData.total_computer}
                                                        isInvalid={validated && !!userDataError.total_computer}
                                                        isValid={validated && userData.total_computer && !userDataError.total_computer}
                                                        onChange={(e) => handleDataChange('total_computer', e.target.value)}
                                                    />
                                                    {validated && userDataError.total_computer && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.total_computer}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের তহবিল</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={userData.institute_named === '01' ? '3' : '6'}>
                                                    <Row>
                                                        {userData.institute_named === '01' && <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="founder_amount">ব্যক্তির তহবিল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="founder_amount"
                                                                value={userData.founder_amount}
                                                                isInvalid={validated && !!userDataError.founder_amount}
                                                                isValid={validated && userData.founder_amount && !userDataError.founder_amount}
                                                                onChange={(e) => handleDataChange('founder_amount', e.target.value)}
                                                            />
                                                            {validated && userDataError.founder_amount && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.founder_amount}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>}
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="general_fund">সাধারণ তহবিল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="general_fund"
                                                                value={userData.general_fund}
                                                                isInvalid={validated && !!userDataError.general_fund}
                                                                isValid={validated && userData.general_fund && !userDataError.general_fund}
                                                                onChange={(e) => handleDataChange('general_fund', e.target.value)}
                                                            />
                                                            {validated && userDataError.general_fund && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.general_fund}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="reserved_fund">সংরক্ষিত তহবিল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="reserved_fund"
                                                                value={userData.reserved_fund}
                                                                isInvalid={validated && !!userDataError.reserved_fund}
                                                                isValid={validated && userData.reserved_fund && !userDataError.reserved_fund}
                                                                onChange={(e) => handleDataChange('reserved_fund', e.target.value)}
                                                            />
                                                            {validated && userDataError.reserved_fund && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.reserved_fund}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                {userData.institute_named === '01' && <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>ব্যক্তি তহবিলের প্রমাণক</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.named_fund_details && files.named_fund_details.name.toLowerCase() === "named_fund_details.pdf" && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.named_fund_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, named_fund_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('named_fund_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.named_fund_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {(!files.named_fund_details || files.named_fund_details.name.toLowerCase() !== "named_fund_details.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('named_fund_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {(!files.named_fund_details || files.named_fund_details.name.toLowerCase() !== "named_fund_details.pdf") && !userDataError.named_fund_details &&
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
                                                            {userDataError.named_fund_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.named_fund_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>}
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>সাধারণ তহবিলের প্রমাণক</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.general_fund_details && files.general_fund_details.name.toLowerCase() === "general_fund_details.pdf" && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.general_fund_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, general_fund_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('general_fund_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.general_fund_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {(!files.general_fund_details || files.general_fund_details.name.toLowerCase() !== "general_fund_details.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('general_fund_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {(!files.general_fund_details || files.general_fund_details.name.toLowerCase() !== "general_fund_details.pdf") && !userDataError.general_fund_details &&
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
                                                            {userDataError.general_fund_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.general_fund_details}
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
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>সংরক্ষিত তহবিলের প্রমাণক</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.reserved_fund_details && files.reserved_fund_details.name.toLowerCase() === "reserved_fund_details.pdf" && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.reserved_fund_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, reserved_fund_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('reserved_fund_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.reserved_fund_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {(!files.reserved_fund_details || files.reserved_fund_details.name.toLowerCase() !== "reserved_fund_details.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('reserved_fund_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {(!files.reserved_fund_details || files.reserved_fund_details.name.toLowerCase() !== "reserved_fund_details.pdf") && !userDataError.reserved_fund_details &&
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
                                                            {userDataError.reserved_fund_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.reserved_fund_details}
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
                                                        <Col className='p-0 m-0 mb-3' md={12}>
                                                            <h6 className='text-primary text-center'>স্থাপনের অনুমতি</h6>
                                                        </Col>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_build_js">নিম্ন মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_build_js"
                                                                    value={userData.ref_build_js}
                                                                    isInvalid={validated && !!userDataError.ref_build_js}
                                                                    isValid={validated && userData.ref_build_js && !userDataError.ref_build_js}
                                                                    onChange={(e) => handleDataChange('ref_build_js', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_build_js && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_build_js}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_build_ss">মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_build_ss"
                                                                    value={userData.ref_build_ss}
                                                                    isInvalid={validated && !!userDataError.ref_build_ss}
                                                                    isValid={validated && userData.ref_build_ss && !userDataError.ref_build_ss}
                                                                    onChange={(e) => handleDataChange('ref_build_ss', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_build_ss && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_build_ss}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_build_hs">উচ্চ মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_build_hs"
                                                                    value={userData.ref_build_hs}
                                                                    isInvalid={validated && !!userDataError.ref_build_hs}
                                                                    isValid={validated && userData.ref_build_hs && !userDataError.ref_build_hs}
                                                                    onChange={(e) => handleDataChange('ref_build_hs', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_build_hs && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_build_hs}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col md={12}>
                                                    <Row>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্থাপনের আদেশ (নিম্ন মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_build_js && files.order_build_js.name.toLowerCase() === "order_build_js.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_build_js}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_build_js: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_build_js')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_build_js}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_build_js || files.order_build_js.name.toLowerCase() !== "order_build_js.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_build_js', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_build_js || files.order_build_js.name.toLowerCase() !== "order_build_js.pdf") && !userDataError.order_build_js &&
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
                                                                        {userDataError.order_build_js &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_build_js}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্থাপনের আদেশ (মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_build_ss && files.order_build_ss.name.toLowerCase() === "order_build_ss.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_build_ss}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_build_ss: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_build_ss')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_build_ss}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_build_ss || files.order_build_ss.name.toLowerCase() !== "order_build_ss.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_build_ss', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_build_ss || files.order_build_ss.name.toLowerCase() !== "order_build_ss.pdf") && !userDataError.order_build_ss &&
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
                                                                        {userDataError.order_build_ss &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_build_ss}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্থাপনের আদেশ (উচ্চ মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_build_hs && files.order_build_hs.name.toLowerCase() === "order_build_hs.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_build_hs}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_build_hs: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_build_hs')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_build_hs}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_build_hs || files.order_build_hs.name.toLowerCase() !== "order_build_hs.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_build_hs', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_build_hs || files.order_build_hs.name.toLowerCase() !== "order_build_hs.pdf") && !userDataError.order_build_hs &&
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
                                                                        {userDataError.order_build_hs &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_build_hs}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col className='p-0 m-0 mt-5 mb-3' md={12}>
                                                            <h6 className='text-primary text-center'>পাঠদানের অনুমতি</h6>
                                                        </Col>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_commence_js">নিম্ন মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_commence_js"
                                                                    value={userData.ref_commence_js}
                                                                    isInvalid={validated && !!userDataError.ref_commence_js}
                                                                    isValid={validated && userData.ref_commence_js && !userDataError.ref_commence_js}
                                                                    onChange={(e) => handleDataChange('ref_commence_js', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_commence_js && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_commence_js}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_commence_ss">মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_commence_ss"
                                                                    value={userData.ref_commence_ss}
                                                                    isInvalid={validated && !!userDataError.ref_commence_ss}
                                                                    isValid={validated && userData.ref_commence_ss && !userDataError.ref_commence_ss}
                                                                    onChange={(e) => handleDataChange('ref_commence_ss', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_commence_ss && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_commence_ss}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_commence_hs">উচ্চ মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_commence_hs"
                                                                    value={userData.ref_commence_hs}
                                                                    isInvalid={validated && !!userDataError.ref_commence_hs}
                                                                    isValid={validated && userData.ref_commence_hs && !userDataError.ref_commence_hs}
                                                                    onChange={(e) => handleDataChange('ref_commence_hs', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_commence_hs && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_commence_hs}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col md={12}>
                                                    <Row>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>পাঠদানের আদেশ (নিম্ন মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_class_js && files.order_class_js.name.toLowerCase() === "order_class_js.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_class_js}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_class_js: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_class_js')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_class_js}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_class_js || files.order_class_js.name.toLowerCase() !== "order_class_js.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_class_js', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_class_js || files.order_class_js.name.toLowerCase() !== "order_class_js.pdf") && !userDataError.order_class_js &&
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
                                                                        {userDataError.order_class_js &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_class_js}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>পাঠদানের আদেশ (মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_class_ss && files.order_class_ss.name.toLowerCase() === "order_class_ss.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_class_ss}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_class_ss: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_class_ss')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_class_ss}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_class_ss || files.order_class_ss.name.toLowerCase() !== "order_class_ss.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_class_ss', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_class_ss || files.order_class_ss.name.toLowerCase() !== "order_class_ss.pdf") && !userDataError.order_class_ss &&
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
                                                                        {userDataError.order_class_ss &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_class_ss}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>পাঠদানের আদেশ (উচ্চ মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_class_hs && files.order_class_hs.name.toLowerCase() === "order_class_hs.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_class_hs}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_class_hs: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_class_hs')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_class_hs}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_class_hs || files.order_class_hs.name.toLowerCase() !== "order_class_hs.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_class_hs', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_class_hs || files.order_class_hs.name.toLowerCase() !== "order_class_hs.pdf") && !userDataError.order_class_hs &&
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
                                                                        {userDataError.order_class_hs &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_class_hs}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Row>
                                            <Row>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col className='p-0 m-0 mt-5 mb-3' md={12}>
                                                            <h6 className='text-primary text-center'>একাডেমিক স্বীকৃতি</h6>
                                                        </Col>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_recognition_js">নিম্ন মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_recognition_js"
                                                                    value={userData.ref_recognition_js}
                                                                    isInvalid={validated && !!userDataError.ref_recognition_js}
                                                                    isValid={validated && userData.ref_recognition_js && !userDataError.ref_recognition_js}
                                                                    onChange={(e) => handleDataChange('ref_recognition_js', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_recognition_js && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_recognition_js}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_recognition_ss">মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_recognition_ss"
                                                                    value={userData.ref_recognition_ss}
                                                                    isInvalid={validated && !!userDataError.ref_recognition_ss}
                                                                    isValid={validated && userData.ref_recognition_ss && !userDataError.ref_recognition_ss}
                                                                    onChange={(e) => handleDataChange('ref_recognition_ss', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_recognition_ss && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_recognition_ss}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Form.Label className="text-primary" htmlFor="ref_recognition_hs">উচ্চ মাধ্যমিক (স্মারক)</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="ref_recognition_hs"
                                                                    value={userData.ref_recognition_hs}
                                                                    isInvalid={validated && !!userDataError.ref_recognition_hs}
                                                                    isValid={validated && userData.ref_recognition_hs && !userDataError.ref_recognition_hs}
                                                                    onChange={(e) => handleDataChange('ref_recognition_hs', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_recognition_hs && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_recognition_hs}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                                <Col md={12}>
                                                    <Row>
                                                        <div className='d-flex justify-content-center align-items-center gap-3'>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্বীকৃতির আদেশ (নিম্ন মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_recognition_js && files.order_recognition_js.name.toLowerCase() === "order_recognition_js.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_recognition_js}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_recognition_js: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_recognition_js')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_recognition_js}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_recognition_js || files.order_recognition_js.name.toLowerCase() !== "order_recognition_js.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_recognition_js', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_recognition_js || files.order_recognition_js.name.toLowerCase() !== "order_recognition_js.pdf") && !userDataError.order_recognition_js &&
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
                                                                        {userDataError.order_recognition_js &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_recognition_js}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্বীকৃতির আদেশ (মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_recognition_ss && files.order_recognition_ss.name.toLowerCase() === "order_recognition_ss.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_recognition_ss}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_recognition_ss: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_recognition_ss')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_recognition_ss}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_recognition_ss || files.order_recognition_ss.name.toLowerCase() !== "order_recognition_ss.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_recognition_ss', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_recognition_ss || files.order_recognition_ss.name.toLowerCase() !== "order_recognition_ss.pdf") && !userDataError.order_recognition_ss &&
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
                                                                        {userDataError.order_recognition_ss &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_recognition_ss}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                            <div className='my-2 flex-fill'>
                                                                <Card className="m-0 p-0">
                                                                    <Card.Header className="mb-0 p-0 pb-1">
                                                                        <label className="text-primary w-100 ms-2" htmlFor='profile_image'>স্বীকৃতির আদেশ (উচ্চ মাধ্যমিক)</label>
                                                                    </Card.Header>
                                                                    <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                        {files.order_recognition_hs && files.order_recognition_hs.name.toLowerCase() === "order_recognition_hs.pdf" && (
                                                                            <Document
                                                                                className="border p-2 rounded shadow"
                                                                                file={files.order_recognition_hs}
                                                                                onLoadSuccess={({ numPages }) => setFilesPages({
                                                                                    ...filesPages, order_recognition_hs: numPages
                                                                                })}
                                                                                onClick={() => handleFileView('order_recognition_hs')}
                                                                            >
                                                                                <Page
                                                                                    pageNumber={1}
                                                                                    width={75}
                                                                                    renderTextLayer={false}   // ✅ disable text layer
                                                                                    renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                                />
                                                                                <p className='text-center'><i><small>মোট পাতাঃ {filesPages.order_recognition_hs}</small></i></p>
                                                                            </Document>
                                                                        )}
                                                                        {(!files.order_recognition_hs || files.order_recognition_hs.name.toLowerCase() !== "order_recognition_hs.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                        <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                            <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                                <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                            </svg>
                                                                            <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('order_recognition_hs', event.target.files[0])} />
                                                                        </div>
                                                                    </Card.Body>
                                                                    <Card.Footer className="d-flex justify-content-center">
                                                                        {(!files.order_recognition_hs || files.order_recognition_hs.name.toLowerCase() !== "order_recognition_hs.pdf") && !userDataError.order_recognition_hs &&
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
                                                                        {userDataError.order_recognition_hs &&
                                                                            <p className='text-center'>
                                                                                <small>
                                                                                    <i className='text-danger'>
                                                                                        {userDataError.order_recognition_hs}
                                                                                    </i>
                                                                                </small>
                                                                            </p>
                                                                        }
                                                                    </Card.Footer>
                                                                </Card>
                                                            </div>
                                                        </div>
                                                    </Row>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 p-0 mb-5">
                                        <Card.Body className='d-flex flex-column justify-content-center align-items-center mb-5'>
                                            <Col md={12} className='d-flex justify-content-between align-items-center gap-3'>
                                                {setNavigateClassStartApplication && <Button onClick={() => setNavigateClassStartApplication(false)} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>}
                                                {!setNavigateClassStartApplication && <Button onClick={() => {
                                                    if (ceb_session?.ceb_user_id) {
                                                        navigate('/dashboard');
                                                    } else {
                                                        navigate('/');
                                                    }
                                                }} className='flex-fill' type="button" variant="btn btn-warning">হোম</Button>}
                                                <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                                <Button className='flex-fill' type="submit" variant="btn btn-success">আবেদন করুন</Button>
                                            </Col>
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

export default ClassStartAppForm;