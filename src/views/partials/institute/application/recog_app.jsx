import React, { Fragment } from 'react';

import { Document, Page } from 'react-pdf';

import { Row, Col, Button, Form } from 'react-bootstrap';
import Card from '../../../../components/Card';

import styles from '../../../../assets/custom/css/bisec.module.css';

import ModalView from '../modal_error/modal_error.jsx';

import { HandleFileView } from '../handlers/files';

const RecognitionApp = ({ userData, setUserData, userDataError, setUserDataError, handleDataChange, files, handleFileSelect, filesPages, setFilesPages, validated, updateStatus, setNavigateRecognitionApp, handleRecognitionSubmit, handleRecognitionReset, modalError, setModalError }) => {

    const curDateTime = new Date();
    curDateTime.setHours(curDateTime.getHours() + 12);

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Card className="m-0 p-2 card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Header className='d-flex flex-column justify-content-center align-items-center'>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>একাডেমিক স্বীকৃতি/স্বীকৃতি নবায়নের আবেদনপত্র</h4>
                            {updateStatus?.success && <h6 className="text-uppercase text-center pt-4 text-success">{updateStatus.success}</h6>}
                            {updateStatus?.error && <h6 className="text-uppercase text-center pt-4 text-danger">{updateStatus.error}</h6>}
                            {updateStatus?.loading && <h6 className="text-uppercase text-center pt-4 text-primary">{updateStatus.loading}</h6>}
                        </Card.Header>
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Row>
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
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>{userData.bn_user}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের নাম (ইংরেজি)</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={4} className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-uppercase text-dark"}>{userData.en_user}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-primary"}>ইমেইল</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.inst_email}</span>
                                                            </td>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>মোবাইল</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.inst_mobile}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের ধরণ</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.bn_coed}</span>
                                                            </td>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের মাধ্যম</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.bn_version} মাধ্যম</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের পর্যায়</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.bn_status}</span>
                                                            </td>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>প্রতিষ্ঠানের বিভাগ</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={1} className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.bn_group}</span>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <th className='text-left align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-primary"}>ঠিকানা</span>
                                                            </th>
                                                            <td className='text-center align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-center text-dark"}>:</span>
                                                            </td>
                                                            <td colSpan={1} className='text-left text-uppercase align-top text-wrap p-2 m-0'>
                                                                <span className={styles.SiyamRupaliFont + " text-left text-dark"}>{userData.inst_address}, {userData.en_uzps} ,{userData.en_dist}</span>
                                                            </td>
                                                            <td className='text-primary text-wrap align-top p-2 m-0'>এলাকা</td>
                                                            <td className='text-wrap align-top p-2 m-0'>:</td>
                                                            {userData.inst_region === '01' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>সিটি কর্পোরেশন</td>}
                                                            {userData.inst_region === '02' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>পৌরসভা (প্রথম শ্রেণী)</td>}
                                                            {userData.inst_region === '03' && <td colSpan={1} className='text-wrap align-top p-2 m-0 text-uppercase'>মফস্বল</td>}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={12}>
                                    <Form noValidate onSubmit={handleRecognitionSubmit} onReset={handleRecognitionReset}>
                                        <Card className="m-0 p-0 mb-3">
                                            <Card.Body>
                                                <Row>
                                                    <Col md={9}>
                                                        <Row>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Group className="bg-transparent">
                                                                    <Form.Label className="text-primary" htmlFor='recog_inst_status'>বর্তমান স্বীকৃতির পর্যায়</Form.Label>
                                                                    <Form.Select
                                                                        id="recog_inst_status"
                                                                        value={userData.recog_inst_status}
                                                                        isInvalid={validated && !!userDataError.recog_inst_status}
                                                                        isValid={validated && userData.recog_inst_status && !userDataError.recog_inst_status}
                                                                        onChange={(e) => handleDataChange('recog_inst_status', e.target.value)}
                                                                        className="selectpicker form-control"
                                                                        data-style="py-0"
                                                                    >
                                                                        <option value=''>-- প্রতিষ্ঠানের পর্যায় সিলেক্ট করুন --</option>
                                                                        {(userData.id_status === '11' || userData.id_status === '17' || userData.id_status === '20') && <option value='11'>নিম্ন মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ৮ম শ্রেণী)</option>}
                                                                        {(userData.id_status === '12' || userData.id_status === '17' || userData.id_status === '19' || userData.id_status === '20') && <option value='12'>মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ১০ম শ্রেণী)</option>}
                                                                        {(userData.id_status === '13' || userData.id_status === '19' || userData.id_status === '20') && <option value='13'>উচ্চ মাধ্যমিক মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>}
                                                                        {(userData.id_status === '13' || userData.id_status === '19' || userData.id_status === '20') && <option value='26'>উচ্চ মাধ্যমিক (মহিলা) মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>}
                                                                        {(userData.id_status === '20') && <option value='20'>উচ্চ মাধ্যমিক বিদ্যালয় ও মহাবিদ্যালয় (৬ষ্ঠ থেকে ১২শ শ্রেণী)</option>}
                                                                    </Form.Select>
                                                                    {validated && userDataError.recog_inst_status && (
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {userDataError.recog_inst_status}
                                                                        </Form.Control.Feedback>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="prev_ref">পূর্ববর্তী পাঠদান/স্বীকৃতির স্মারক</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="prev_ref"
                                                                    value={userData.prev_ref}
                                                                    isInvalid={validated && !!userDataError.prev_ref}
                                                                    isValid={validated && userData.prev_ref && !userDataError.prev_ref}
                                                                    onChange={(e) => handleDataChange('prev_ref', e.target.value)}
                                                                />
                                                                {validated && userDataError.prev_ref && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.prev_ref}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={4}>
                                                                <Form.Label className="text-primary" htmlFor="ref_date">স্মারকের তারিখ</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="date"
                                                                    id="ref_date"
                                                                    value={userData.ref_date}
                                                                    isInvalid={validated && !!userDataError.ref_date}
                                                                    isValid={validated && userData.ref_date && !userDataError.ref_date}
                                                                    onChange={(e) => handleDataChange('ref_date', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_date && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_date}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={4}>
                                                                <Form.Label className="text-primary" htmlFor="ref_start">স্মারক কার্যকরের তারিখ</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="date"
                                                                    id="ref_start"
                                                                    value={userData.ref_start}
                                                                    isInvalid={validated && !!userDataError.ref_start}
                                                                    isValid={validated && userData.ref_start && !userDataError.ref_start}
                                                                    onChange={(e) => handleDataChange('ref_start', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_start && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_start}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={4}>
                                                                <Form.Label className="text-primary" htmlFor="ref_end">স্মারক মেয়াদোত্তীর্ণের তারিখ</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="date"
                                                                    id="ref_end"
                                                                    value={userData.ref_end}
                                                                    isInvalid={validated && !!userDataError.ref_end}
                                                                    isValid={validated && userData.ref_end && !userDataError.ref_end}
                                                                    onChange={(e) => handleDataChange('ref_end', e.target.value)}
                                                                />
                                                                {validated && userDataError.ref_end && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.ref_end}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Card className="m-0 p-0">
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='prev_order'>অনুমতি/স্বীকৃতি সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.prev_order && files.prev_order.name.toLowerCase() === 'prev_order.pdf' && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.prev_order}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, prev_order: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.prev_order, files.prev_order.name.toLowerCase())}
                                                                    >
                                                                        <Page
                                                                            pageNumber={1}
                                                                            width={75}
                                                                            renderTextLayer={false}   // ✅ disable text layer
                                                                            renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                        />
                                                                        <p className='text-center'><i><small>মোট পাতাঃ {filesPages.prev_order}</small></i></p>
                                                                    </Document>
                                                                )}
                                                                {(!files.prev_order || files.prev_order.name.toLowerCase() !== 'prev_order.pdf') && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='prev_order' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('prev_order', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {(!files.prev_order || files.prev_order.name.toLowerCase() !== 'prev_order.pdf') && !userDataError.prev_order &&
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
                                                                {userDataError.prev_order &&
                                                                    <p className='text-center'>
                                                                        <small>
                                                                            <i className='text-danger'>
                                                                                {userDataError.prev_order}
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
                                                <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের তহবিল</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={3}>
                                                        <Row>
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
                                                    <Col md={3}>
                                                        <Card className="m-0 p-0">
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='general_fund_details'>সাধারণ তহবিলের প্রমাণক</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.general_fund_details && files.general_fund_details.name.toLowerCase() === "general_fund_details.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.general_fund_details}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, general_fund_details: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.general_fund_details, files.general_fund_details.name.toLowerCase())}
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
                                                                    <input id='general_fund_details' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('general_fund_details', event.target.files[0])} />
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
                                                                <label className="text-primary w-100 text-center" htmlFor='reserved_fund_details'>সংরক্ষিত তহবিলের প্রমাণক</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.reserved_fund_details && files.reserved_fund_details.name.toLowerCase() === "reserved_fund_details.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.reserved_fund_details}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, reserved_fund_details: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.reserved_fund_details, files.reserved_fund_details.name.toLowerCase())}
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
                                                                    <input id='reserved_fund_details' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('reserved_fund_details', event.target.files[0])} />
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
                                                    <Col md={3}>
                                                        <Card className="m-0 p-0">
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='class_routine'>ক্লাস রুটিন সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.class_routine && files.class_routine.name.toLowerCase() === "class_routine.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.class_routine}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, class_routine: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.class_routine, files.class_routine.name.toLowerCase())}
                                                                    >
                                                                        <Page
                                                                            pageNumber={1}
                                                                            width={75}
                                                                            renderTextLayer={false}   // ✅ disable text layer
                                                                            renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                        />
                                                                        <p className='text-center'><i><small>মোট পাতাঃ {filesPages.class_routine}</small></i></p>
                                                                    </Document>
                                                                )}
                                                                {(!files.class_routine || files.class_routine.name.toLowerCase() !== "class_routine.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='class_routine' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('class_routine', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {(!files.class_routine || files.class_routine.name.toLowerCase() !== "class_routine.pdf") && !userDataError.class_routine &&
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
                                                                {userDataError.class_routine &&
                                                                    <p className='text-center'>
                                                                        <small>
                                                                            <i className='text-danger'>
                                                                                {userDataError.class_routine}
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
                                                <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের জমির বিবরণ</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Row>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="total_land">সর্বমোট জমি</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="total_land"
                                                                    value={userData.total_land}
                                                                    isInvalid={validated && !!userDataError.total_land}
                                                                    isValid={validated && userData.total_land && !userDataError.total_land}
                                                                    onChange={(e) => handleDataChange('total_land', e.target.value)}
                                                                />
                                                                {validated && userDataError.total_land && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.total_land}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="mutation_land">নামজারিকৃত জমি</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="mutation_land"
                                                                    value={userData.mutation_land}
                                                                    isInvalid={validated && !!userDataError.mutation_land}
                                                                    isValid={validated && userData.mutation_land && !userDataError.mutation_land}
                                                                    onChange={(e) => handleDataChange('mutation_land', e.target.value)}
                                                                />
                                                                {validated && userDataError.mutation_land && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.mutation_land}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="land_tax_year">সর্বশেষ খাজনার বছর</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="land_tax_year"
                                                                    value={userData.land_tax_year}
                                                                    isInvalid={validated && !!userDataError.land_tax_year}
                                                                    isValid={validated && userData.land_tax_year && !userDataError.land_tax_year}
                                                                    onChange={(e) => handleDataChange('land_tax_year', e.target.value)}
                                                                />
                                                                {validated && userDataError.land_tax_year && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.land_tax_year}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="land_tax_number">সর্বশেষ খাজনার দাখিলা</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="land_tax_number"
                                                                    value={userData.land_tax_number}
                                                                    isInvalid={validated && !!userDataError.land_tax_number}
                                                                    isValid={validated && userData.land_tax_number && !userDataError.land_tax_number}
                                                                    onChange={(e) => handleDataChange('land_tax_number', e.target.value)}
                                                                />
                                                                {validated && userDataError.land_tax_number && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.land_tax_number}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                        </Row>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Card className="m-0 p-0">
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='mutation_details'>জমির দলিল সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.mutation_details && files.mutation_details.name.toLowerCase() === "mutation_details.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.mutation_details}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, mutation_details: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.mutation_details, files.mutation_details.name.toLowerCase())}
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
                                                                {(!files.mutation_details || files.mutation_details.name.toLowerCase() !== "mutation_details.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='mutation_details' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('mutation_details', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {(!files.mutation_details || files.mutation_details.name.toLowerCase() !== "mutation_details.pdf") && !userDataError.mutation_details &&
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
                                                                <label className="text-primary w-100 text-center" htmlFor='dakhila_details'>নামজারি ও খাজনার দাখিলা সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.dakhila_details && files.dakhila_details.name.toLowerCase() === "dakhila_details.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.dakhila_details}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, dakhila_details: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.dakhila_details, files.dakhila_details.name.toLowerCase())}
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
                                                                    <input id='dakhila_details' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('dakhila_details', event.target.files[0])} />
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
                                                <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের কমিটি ও অনুমোদিত শিক্ষার্থী</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col md={6}>
                                                        <Row>
                                                            <Col className='my-2' md={12}>
                                                                <Form.Group className="bg-transparent">
                                                                    <Form.Label className="text-primary" htmlFor='committee_type'>কমিটির ধরণ</Form.Label>
                                                                    <Form.Select
                                                                        id="committee_type"
                                                                        value={userData.committee_type}
                                                                        isInvalid={validated && !!userDataError.committee_type}
                                                                        isValid={validated && userData.committee_type && !userDataError.committee_type}
                                                                        onChange={(e) => handleDataChange('committee_type', e.target.value)}
                                                                        className="selectpicker form-control"
                                                                        data-style="py-0"
                                                                    >
                                                                        <option value=''>-- কমিটি সিলেক্ট করুন --</option>
                                                                        <option value='01'>নির্বাহী কমিটি</option>
                                                                        {(userData.id_status === '19' || userData.id_status === '20') && <option value='02'>গর্ভর্নিং বডি</option>}
                                                                        {(userData.id_status !== '19' || userData.id_status !== '20') && <option value='03'>ম্যানেজিং কমিটি</option>}
                                                                        <option value='04'>এডহক কমিটি</option>
                                                                        <option value='05'>সরকারি বা সংস্থা পরিচালিত প্রতিষ্ঠানের গর্ভর্নিং বডি/ম্যানেজিং কমিটি</option>
                                                                    </Form.Select>
                                                                    {validated && userDataError.committee_type && (
                                                                        <Form.Control.Feedback type="invalid">
                                                                            {userDataError.committee_type}
                                                                        </Form.Control.Feedback>
                                                                    )}
                                                                </Form.Group>
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="committee_expiry">কমিটির মেয়াদ</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="date"
                                                                    id="committee_expiry"
                                                                    value={userData.committee_expiry}
                                                                    isInvalid={validated && !!userDataError.committee_expiry}
                                                                    isValid={validated && userData.committee_expiry && !userDataError.committee_expiry}
                                                                    onChange={(e) => handleDataChange('committee_expiry', e.target.value)}
                                                                />
                                                                {validated && userDataError.committee_expiry && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.committee_expiry}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            <Col className='my-2' md={6}>
                                                                <Form.Label className="text-primary" htmlFor="total_permitted_student">অনুমোদিত শিক্ষার্থীর সংখ্যা</Form.Label>
                                                                <Form.Control
                                                                    className='bg-transparent text-uppercase'
                                                                    type="text"
                                                                    id="total_permitted_student"
                                                                    value={userData.total_permitted_student}
                                                                    isInvalid={validated && !!userDataError.total_permitted_student}
                                                                    isValid={validated && userData.total_permitted_student && !userDataError.total_permitted_student}
                                                                    onChange={(e) => handleDataChange('total_permitted_student', e.target.value)}
                                                                />
                                                                {validated && userDataError.total_permitted_student && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.total_permitted_student}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Col>
                                                            {/* <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="land_tax_number">সর্বমোট শিক্ষার্থীর সংখ্যা</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="land_tax_number"
                                                                value={userData.land_tax_number}
                                                                isInvalid={validated && !!userDataError.land_tax_number}
                                                                isValid={validated && userData.land_tax_number && !userDataError.land_tax_number}
                                                                onChange={(e) => handleDataChange('land_tax_number', e.target.value)}
                                                            />
                                                            {validated && userDataError.land_tax_number && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.land_tax_number}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col> */}
                                                        </Row>
                                                    </Col>
                                                    <Col md={3}>
                                                        <Card className="m-0 p-0">
                                                            <Card.Header className="mb-0 p-0 pb-1">
                                                                <label className="text-primary w-100 text-center" htmlFor='committee_order'>কমিটি অনুমোদন স্মারক সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.committee_order && files.committee_order.name.toLowerCase() === "committee_order.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.committee_order}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, committee_order: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.committee_order, files.committee_order.name.toLowerCase())}
                                                                    >
                                                                        <Page
                                                                            pageNumber={1}
                                                                            width={75}
                                                                            renderTextLayer={false}   // ✅ disable text layer
                                                                            renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                        />
                                                                        <p className='text-center'><i><small>মোট পাতাঃ {filesPages.committee_order}</small></i></p>
                                                                    </Document>
                                                                )}
                                                                {(!files.committee_order || files.committee_order.name.toLowerCase() !== "committee_order.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='committee_order' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('committee_order', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {(!files.committee_order || files.committee_order.name.toLowerCase() !== "committee_order.pdf") && !userDataError.committee_order &&
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
                                                                {userDataError.committee_order &&
                                                                    <p className='text-center'>
                                                                        <small>
                                                                            <i className='text-danger'>
                                                                                {userDataError.committee_order}
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
                                                                <label className="text-primary w-100 text-center" htmlFor='student_order'>অনুমোদিত শিক্ষার্থীর স্মারক সংযুক্তি</label>
                                                            </Card.Header>
                                                            <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                                {files.student_order && files.student_order.name.toLowerCase() === "student_order.pdf" && (
                                                                    <Document
                                                                        className="border p-2 rounded shadow"
                                                                        file={files.student_order}
                                                                        onLoadSuccess={({ numPages }) => setFilesPages({
                                                                            ...filesPages, student_order: numPages
                                                                        })}
                                                                        onClick={() => HandleFileView(files.student_order, files.student_order.name.toLowerCase())}
                                                                    >
                                                                        <Page
                                                                            pageNumber={1}
                                                                            width={75}
                                                                            renderTextLayer={false}   // ✅ disable text layer
                                                                            renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                        />
                                                                        <p className='text-center'><i><small>মোট পাতাঃ {filesPages.student_order}</small></i></p>
                                                                    </Document>
                                                                )}
                                                                {(!files.student_order || files.student_order.name.toLowerCase() !== "student_order.pdf") && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                                <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                    <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                        <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                    </svg>
                                                                    <input id='student_order' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('student_order', event.target.files[0])} />
                                                                </div>
                                                            </Card.Body>
                                                            <Card.Footer className="d-flex justify-content-center">
                                                                {(!files.student_order || files.student_order.name.toLowerCase() !== "student_order.pdf") && !userDataError.student_order &&
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
                                                                {userDataError.student_order &&
                                                                    <p className='text-center'>
                                                                        <small>
                                                                            <i className='text-danger'>
                                                                                {userDataError.student_order}
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
                                                        <Form.Label className="text-primary" htmlFor="total_concrete_building">পাকা ভবন</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_concrete_building"
                                                            value={userData.total_concrete_building}
                                                            isInvalid={validated && !!userDataError.total_concrete_building}
                                                            isValid={validated && userData.total_concrete_building && !userDataError.total_concrete_building}
                                                            onChange={(e) => handleDataChange('total_concrete_building', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_concrete_building && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_concrete_building}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_other_building">অন্যান্য ভবন</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_other_building"
                                                            value={userData.total_other_building}
                                                            isInvalid={validated && !!userDataError.total_other_building}
                                                            isValid={validated && userData.total_other_building && !userDataError.total_other_building}
                                                            onChange={(e) => handleDataChange('total_other_building', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_other_building && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_other_building}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_room">কক্ষের সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-lowecase'
                                                            type="text"
                                                            id="total_room"
                                                            value={userData.total_room}
                                                            isInvalid={validated && !!userDataError.total_room}
                                                            isValid={validated && userData.total_room && !userDataError.total_room}
                                                            onChange={(e) => handleDataChange('total_room', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_room && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_room}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="used_room">ব্যবহৃত কক্ষ</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="used_room"
                                                            value={userData.used_room}
                                                            isInvalid={validated && !!userDataError.used_room}
                                                            isValid={validated && userData.used_room && !userDataError.used_room}
                                                            onChange={(e) => handleDataChange('used_room', e.target.value)}
                                                        />
                                                        {validated && userDataError.used_room && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.used_room}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="researved_room">উদ্বৃত্ত কক্ষ</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="researved_room"
                                                            value={userData.researved_room}
                                                            isInvalid={validated && !!userDataError.researved_room}
                                                            isValid={validated && userData.researved_room && !userDataError.researved_room}
                                                            onChange={(e) => handleDataChange('researved_room', e.target.value)}
                                                        />
                                                        {validated && userDataError.researved_room && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.researved_room}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="area_room">কক্ষসমূহের মোট আয়তন (বর্গফুট)</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="area_room"
                                                            value={userData.area_room}
                                                            isInvalid={validated && !!userDataError.area_room}
                                                            isValid={validated && userData.area_room && !userDataError.area_room}
                                                            onChange={(e) => handleDataChange('area_room', e.target.value)}
                                                        />
                                                        {validated && userDataError.area_room && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.area_room}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_tubewell">টিউবওয়েল সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_tubewell"
                                                            value={userData.total_tubewell}
                                                            isInvalid={validated && !!userDataError.total_tubewell}
                                                            isValid={validated && userData.total_tubewell && !userDataError.total_tubewell}
                                                            onChange={(e) => handleDataChange('total_tubewell', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_tubewell && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_tubewell}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_toilet">টয়লেট সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_toilet"
                                                            value={userData.total_toilet}
                                                            isInvalid={validated && !!userDataError.total_toilet}
                                                            isValid={validated && userData.total_toilet && !userDataError.total_toilet}
                                                            onChange={(e) => handleDataChange('total_toilet', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_toilet && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_toilet}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="electricity_connection">বিদ্যুৎ সংযোগকৃত কক্ষ</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="electricity_connection"
                                                            value={userData.electricity_connection}
                                                            isInvalid={validated && !!userDataError.electricity_connection}
                                                            isValid={validated && userData.electricity_connection && !userDataError.electricity_connection}
                                                            onChange={(e) => handleDataChange('electricity_connection', e.target.value)}
                                                        />
                                                        {validated && userDataError.electricity_connection && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.electricity_connection}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_library">গ্রন্থাগার সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_library"
                                                            value={userData.total_library}
                                                            isInvalid={validated && !!userDataError.total_library}
                                                            isValid={validated && userData.total_library && !userDataError.total_library}
                                                            onChange={(e) => handleDataChange('total_library', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_library && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_library}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="area_library">গ্রন্থাগারের আয়তন (বর্গফুট)</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="area_library"
                                                            value={userData.area_library}
                                                            isInvalid={validated && !!userDataError.area_library}
                                                            isValid={validated && userData.area_library && !userDataError.area_library}
                                                            onChange={(e) => handleDataChange('area_library', e.target.value)}
                                                        />
                                                        {validated && userDataError.area_library && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.area_library}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_books">বইয়ের সংখ্যা</Form.Label>
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
                                                        <Form.Label className="text-primary" htmlFor="total_labratory">বিজ্ঞানাগার সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_labratory"
                                                            value={userData.total_labratory}
                                                            isInvalid={validated && !!userDataError.total_labratory}
                                                            isValid={validated && userData.total_labratory && !userDataError.total_labratory}
                                                            onChange={(e) => handleDataChange('total_labratory', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_labratory && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_labratory}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="area_labratory">বিজ্ঞানাগারের আয়তন (বর্গফুট)</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="area_labratory"
                                                            value={userData.area_labratory}
                                                            isInvalid={validated && !!userDataError.area_labratory}
                                                            isValid={validated && userData.area_labratory && !userDataError.area_labratory}
                                                            onChange={(e) => handleDataChange('area_labratory', e.target.value)}
                                                        />
                                                        {validated && userDataError.area_labratory && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.area_labratory}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_equipment_price">দ্রব্যাদির মূল্য</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_equipment_price"
                                                            value={userData.total_equipment_price}
                                                            isInvalid={validated && !!userDataError.total_equipment_price}
                                                            isValid={validated && userData.total_equipment_price && !userDataError.total_equipment_price}
                                                            onChange={(e) => handleDataChange('total_equipment_price', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_equipment_price && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_equipment_price}
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
                                                        <Form.Label className="text-primary" htmlFor="area_computer_room">কম্পিউটার ল্যাবের আয়তন (বর্গফুট)</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="area_computer_room"
                                                            value={userData.area_computer_room}
                                                            isInvalid={validated && !!userDataError.area_computer_room}
                                                            isValid={validated && userData.area_computer_room && !userDataError.area_computer_room}
                                                            onChange={(e) => handleDataChange('area_computer_room', e.target.value)}
                                                        />
                                                        {validated && userDataError.area_computer_room && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.area_computer_room}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={4}>
                                                        <Form.Label className="text-primary" htmlFor="total_computer">কম্পিউটার সংখ্যা</Form.Label>
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
                                                <h5 className="text-center w-100 card-title">শিক্ষক, কর্মকর্তা ও কর্মচারীদের তথ্য</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row>
                                                    <Col className='my-2' md={3}>
                                                        <Form.Label className="text-primary" htmlFor="total_teacher">শিক্ষকগণের সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_teacher"
                                                            value={userData.total_teacher}
                                                            isInvalid={validated && !!userDataError.total_teacher}
                                                            isValid={validated && userData.total_teacher && !userDataError.total_teacher}
                                                            onChange={(e) => handleDataChange('total_teacher', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_teacher && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_teacher}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={3}>
                                                        <Form.Label className="text-primary" htmlFor="total_mpo_teacher">এমপিওভুক্ত শিক্ষক</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_mpo_teacher"
                                                            value={userData.total_mpo_teacher}
                                                            isInvalid={validated && !!userDataError.total_mpo_teacher}
                                                            isValid={validated && userData.total_mpo_teacher && !userDataError.total_mpo_teacher}
                                                            onChange={(e) => handleDataChange('total_mpo_teacher', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_mpo_teacher && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_mpo_teacher}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={3}>
                                                        <Form.Label className="text-primary" htmlFor="total_staff">কর্মকর্তা/কর্মচারীদের সংখ্যা</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_staff"
                                                            value={userData.total_staff}
                                                            isInvalid={validated && !!userDataError.total_staff}
                                                            isValid={validated && userData.total_staff && !userDataError.total_staff}
                                                            onChange={(e) => handleDataChange('total_staff', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_staff && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_staff}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                    <Col className='my-2' md={3}>
                                                        <Form.Label className="text-primary" htmlFor="total_mpo_staff">এমপিওভুক্ত কর্মকর্তা/কর্মচারী</Form.Label>
                                                        <Form.Control
                                                            className='bg-transparent text-uppercase'
                                                            type="text"
                                                            id="total_mpo_staff"
                                                            value={userData.total_mpo_staff}
                                                            isInvalid={validated && !!userDataError.total_mpo_staff}
                                                            isValid={validated && userData.land_tax_number && !userDataError.total_mpo_staff}
                                                            onChange={(e) => handleDataChange('total_mpo_staff', e.target.value)}
                                                        />
                                                        {validated && userDataError.total_mpo_staff && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.total_mpo_staff}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Col>
                                                </Row>
                                            </Card.Body>
                                        </Card>

                                        <Card className="m-0 p-0 mb-3">
                                            <Card.Header>
                                                <h5 className="text-center w-100 card-title">শিক্ষার্থীদের তথ্য (অপ্রযোজ্য অংশ নিষ্ক্রিয় (Disable) করা আছে, পূরণ করতে হবে না।)</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                <Row className='table-responsive'>
                                                    <table className='m-0 p-0'>
                                                        <tbody className='m-0 p-0'>
                                                            {(!userData?.recog_inst_status || userData.recog_inst_status === '11' || userData.recog_inst_status === '20') && <>

                                                                {/* <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">ষষ্ট শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_science_section"
                                                                            disabled={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.six_science_section}
                                                                            isInvalid={validated && !!userDataError.six_science_section}
                                                                            isValid={validated && userData.six_science_section && !userDataError.six_science_section}
                                                                            onChange={(e) => handleDataChange('six_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.six_science_total}
                                                                            isInvalid={validated && !!userDataError.six_science_total}
                                                                            isValid={validated && userData.six_science_total && !userDataError.six_science_total}
                                                                            onChange={(e) => handleDataChange('six_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.six_humanities_section}
                                                                            isInvalid={validated && !!userDataError.six_humanities_section}
                                                                            isValid={validated && userData.six_humanities_section && !userDataError.six_humanities_section}
                                                                            onChange={(e) => handleDataChange('six_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.six_humanities_total}
                                                                            isValid={validated && userData.six_humanities_total && !userDataError.six_humanities_total}
                                                                            onChange={(e) => handleDataChange('six_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.six_business_section}
                                                                            isInvalid={validated && !!userDataError.six_business_section}
                                                                            isValid={validated && userData.six_business_section && !userDataError.six_business_section}
                                                                            onChange={(e) => handleDataChange('six_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.six_business_total}
                                                                            isValid={validated && userData.six_business_total && !userDataError.six_business_total}
                                                                            onChange={(e) => handleDataChange('six_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">সপ্তম শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_science_section"
                                                                            disabled={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.seven_science_section}
                                                                            isInvalid={validated && !!userDataError.seven_science_section}
                                                                            isValid={validated && userData.seven_science_section && !userDataError.seven_science_section}
                                                                            onChange={(e) => handleDataChange('seven_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.seven_science_total}
                                                                            isInvalid={validated && !!userDataError.seven_science_total}
                                                                            isValid={validated && userData.seven_science_total && !userDataError.seven_science_total}
                                                                            onChange={(e) => handleDataChange('seven_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.seven_humanities_section}
                                                                            isInvalid={validated && !!userDataError.seven_humanities_section}
                                                                            isValid={validated && userData.seven_humanities_section && !userDataError.seven_humanities_section}
                                                                            onChange={(e) => handleDataChange('seven_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.seven_humanities_total}
                                                                            isValid={validated && userData.seven_humanities_total && !userDataError.seven_humanities_total}
                                                                            onChange={(e) => handleDataChange('seven_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.seven_business_section}
                                                                            isInvalid={validated && !!userDataError.seven_business_section}
                                                                            isValid={validated && userData.seven_business_section && !userDataError.seven_business_section}
                                                                            onChange={(e) => handleDataChange('seven_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.seven_business_total}
                                                                            isValid={validated && userData.seven_business_total && !userDataError.seven_business_total}
                                                                            onChange={(e) => handleDataChange('seven_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">অষ্টম শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_science_section"
                                                                            disabled={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.eight_science_section}
                                                                            isInvalid={validated && !!userDataError.eight_science_section}
                                                                            isValid={validated && userData.eight_science_section && !userDataError.eight_science_section}
                                                                            onChange={(e) => handleDataChange('eight_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.eight_science_total}
                                                                            isInvalid={validated && !!userDataError.eight_science_total}
                                                                            isValid={validated && userData.eight_science_total && !userDataError.eight_science_total}
                                                                            onChange={(e) => handleDataChange('eight_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.eight_humanities_section}
                                                                            isInvalid={validated && !!userDataError.eight_humanities_section}
                                                                            isValid={validated && userData.eight_humanities_section && !userDataError.eight_humanities_section}
                                                                            onChange={(e) => handleDataChange('eight_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.eight_humanities_total}
                                                                            isValid={validated && userData.eight_humanities_total && !userDataError.eight_humanities_total}
                                                                            onChange={(e) => handleDataChange('eight_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.eight_business_section}
                                                                            isInvalid={validated && !!userDataError.eight_business_section}
                                                                            isValid={validated && userData.eight_business_section && !userDataError.eight_business_section}
                                                                            onChange={(e) => handleDataChange('eight_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.eight_business_total}
                                                                            isValid={validated && userData.eight_business_total && !userDataError.eight_business_total}
                                                                            onChange={(e) => handleDataChange('eight_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr> */}

                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={2} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">ষষ্ট শ্রেণী</h6>
                                                                    </th>
                                                                    <th colSpan={2} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">সপ্তম শ্রেণী</h6>
                                                                    </th>
                                                                    <th colSpan={2} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">অষ্টম শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_science_section">মোট শাখা</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="six_science_total">মোট শিক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_science_section">মোট শাখা</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="seven_science_total">মোট শিক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_science_section">মোট শাখা</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eight_science_total">মোট শিক্ষার্থী</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_science_section"
                                                                            value={userData.six_science_section}
                                                                            isInvalid={validated && !!userDataError.six_science_section}
                                                                            isValid={validated && userData.six_science_section && !userDataError.six_science_section}
                                                                            onChange={(e) => handleDataChange('six_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="six_science_total"
                                                                            value={userData.six_science_total}
                                                                            isInvalid={validated && !!userDataError.six_science_total}
                                                                            isValid={validated && userData.six_science_total && !userDataError.six_science_total}
                                                                            onChange={(e) => handleDataChange('six_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.six_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.six_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_science_section"
                                                                            value={userData.seven_science_section}
                                                                            isInvalid={validated && !!userDataError.seven_science_section}
                                                                            isValid={validated && userData.seven_science_section && !userDataError.seven_science_section}
                                                                            onChange={(e) => handleDataChange('seven_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="seven_science_total"
                                                                            value={userData.seven_science_total}
                                                                            isInvalid={validated && !!userDataError.seven_science_total}
                                                                            isValid={validated && userData.seven_science_total && !userDataError.seven_science_total}
                                                                            onChange={(e) => handleDataChange('seven_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.seven_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.seven_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_science_section"
                                                                            value={userData.eight_science_section}
                                                                            isInvalid={validated && !!userDataError.eight_science_section}
                                                                            isValid={validated && userData.eight_science_section && !userDataError.eight_science_section}
                                                                            onChange={(e) => handleDataChange('eight_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eight_science_total"
                                                                            value={userData.eight_science_total}
                                                                            isInvalid={validated && !!userDataError.eight_science_total}
                                                                            isValid={validated && userData.eight_science_total && !userDataError.eight_science_total}
                                                                            onChange={(e) => handleDataChange('eight_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eight_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eight_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>}
                                                            {(!userData?.recog_inst_status || userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && <>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">নবম শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="nine_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_science_section"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.nine_science_section}
                                                                            isInvalid={validated && !!userDataError.nine_science_section}
                                                                            isValid={validated && userData.nine_science_section && !userDataError.nine_science_section}
                                                                            onChange={(e) => handleDataChange('nine_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.nine_science_total}
                                                                            isInvalid={validated && !!userDataError.nine_science_total}
                                                                            isValid={validated && userData.nine_science_total && !userDataError.nine_science_total}
                                                                            onChange={(e) => handleDataChange('nine_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.nine_humanities_section}
                                                                            isInvalid={validated && !!userDataError.nine_humanities_section}
                                                                            isValid={validated && userData.nine_humanities_section && !userDataError.nine_humanities_section}
                                                                            onChange={(e) => handleDataChange('nine_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.nine_humanities_total}
                                                                            isValid={validated && userData.nine_humanities_total && !userDataError.nine_humanities_total}
                                                                            onChange={(e) => handleDataChange('nine_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.nine_business_section}
                                                                            isInvalid={validated && !!userDataError.nine_business_section}
                                                                            isValid={validated && userData.nine_business_section && !userDataError.nine_business_section}
                                                                            onChange={(e) => handleDataChange('nine_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="nine_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.nine_business_total}
                                                                            isValid={validated && userData.nine_business_total && !userDataError.nine_business_total}
                                                                            onChange={(e) => handleDataChange('nine_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.nine_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.nine_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">দশম শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ten_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_science_section"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ten_science_section}
                                                                            isInvalid={validated && !!userDataError.ten_science_section}
                                                                            isValid={validated && userData.ten_science_section && !userDataError.ten_science_section}
                                                                            onChange={(e) => handleDataChange('ten_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ten_science_total}
                                                                            isInvalid={validated && !!userDataError.ten_science_total}
                                                                            isValid={validated && userData.ten_science_total && !userDataError.ten_science_total}
                                                                            onChange={(e) => handleDataChange('ten_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ten_humanities_section}
                                                                            isInvalid={validated && !!userDataError.ten_humanities_section}
                                                                            isValid={validated && userData.ten_humanities_section && !userDataError.ten_humanities_section}
                                                                            onChange={(e) => handleDataChange('ten_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.ten_humanities_total}
                                                                            isValid={validated && userData.ten_humanities_total && !userDataError.ten_humanities_total}
                                                                            onChange={(e) => handleDataChange('ten_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ten_business_section}
                                                                            isInvalid={validated && !!userDataError.ten_business_section}
                                                                            isValid={validated && userData.ten_business_section && !userDataError.ten_business_section}
                                                                            onChange={(e) => handleDataChange('ten_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ten_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.ten_business_total}
                                                                            isValid={validated && userData.ten_business_total && !userDataError.ten_business_total}
                                                                            onChange={(e) => handleDataChange('ten_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ten_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ten_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>}
                                                            {(!userData?.recog_inst_status || userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && <>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">একাদশ শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="eleven_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_science_section"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.eleven_science_section}
                                                                            isInvalid={validated && !!userDataError.eleven_science_section}
                                                                            isValid={validated && userData.eleven_science_section && !userDataError.eleven_science_section}
                                                                            onChange={(e) => handleDataChange('eleven_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.eleven_science_total}
                                                                            isInvalid={validated && !!userDataError.eleven_science_total}
                                                                            isValid={validated && userData.eleven_science_total && !userDataError.eleven_science_total}
                                                                            onChange={(e) => handleDataChange('eleven_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.eleven_humanities_section}
                                                                            isInvalid={validated && !!userDataError.eleven_humanities_section}
                                                                            isValid={validated && userData.eleven_humanities_section && !userDataError.eleven_humanities_section}
                                                                            onChange={(e) => handleDataChange('eleven_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.eleven_humanities_total}
                                                                            isValid={validated && userData.eleven_humanities_total && !userDataError.eleven_humanities_total}
                                                                            onChange={(e) => handleDataChange('eleven_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.eleven_business_section}
                                                                            isInvalid={validated && !!userDataError.eleven_business_section}
                                                                            isValid={validated && userData.eleven_business_section && !userDataError.eleven_business_section}
                                                                            onChange={(e) => handleDataChange('eleven_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="eleven_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.eleven_business_total}
                                                                            isValid={validated && userData.eleven_business_total && !userDataError.eleven_business_total}
                                                                            onChange={(e) => handleDataChange('eleven_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.eleven_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.eleven_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th colSpan={6} className='p-0 m-0 py-3 text-wrap align-top text-center text-secondary'>
                                                                        <h6 className="text-center">দ্বাদশ শ্রেণী</h6>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_science_section">মোট শাখা (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_science_total">মোট শিক্ষার্থী (বিজ্ঞান)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_humanities_section">মোট শাখা  (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_humanities_total">মোট শিক্ষার্থী (মানবিক)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_business_section">মোট শাখা (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="twelve_business_total">মোট শিক্ষার্থী (ব্যবসায়)</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr className='p-0 m-0'>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_science_section"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.twelve_science_section}
                                                                            isInvalid={validated && !!userDataError.twelve_science_section}
                                                                            isValid={validated && userData.twelve_science_section && !userDataError.twelve_science_section}
                                                                            onChange={(e) => handleDataChange('twelve_science_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_science_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_science_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_science_total"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.twelve_science_total}
                                                                            isInvalid={validated && !!userDataError.twelve_science_total}
                                                                            isValid={validated && userData.twelve_science_total && !userDataError.twelve_science_total}
                                                                            onChange={(e) => handleDataChange('twelve_science_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_science_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_science_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_humanities_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.twelve_humanities_section}
                                                                            isInvalid={validated && !!userDataError.twelve_humanities_section}
                                                                            isValid={validated && userData.twelve_humanities_section && !userDataError.twelve_humanities_section}
                                                                            onChange={(e) => handleDataChange('twelve_humanities_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_humanities_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_humanities_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_humanities_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.twelve_humanities_total}
                                                                            isValid={validated && userData.twelve_humanities_total && !userDataError.twelve_humanities_total}
                                                                            onChange={(e) => handleDataChange('twelve_humanities_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_humanities_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_humanities_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_business_section"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.twelve_business_section}
                                                                            isInvalid={validated && !!userDataError.twelve_business_section}
                                                                            isValid={validated && userData.twelve_business_section && !userDataError.twelve_business_section}
                                                                            onChange={(e) => handleDataChange('twelve_business_section', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_business_section && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_business_section}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="twelve_business_total"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ref_build_js}
                                                                            isInvalid={validated && !!userDataError.twelve_business_total}
                                                                            isValid={validated && userData.twelve_business_total && !userDataError.twelve_business_total}
                                                                            onChange={(e) => handleDataChange('twelve_business_total', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.twelve_business_total && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.twelve_business_total}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </>}
                                                        </tbody>
                                                    </table>
                                                </Row>
                                            </Card.Body>
                                        </Card>

                                        <Card className="m-0 p-0 mb-3">
                                            <Card.Header>
                                                <h5 className="text-center w-100 card-title">পরীক্ষার তথ্য (অপ্রযোজ্য অংশ নিষ্ক্রিয় (Disable) করা আছে, পূরণ করতে হবে না।)</h5>
                                            </Card.Header>
                                            <Card.Body>
                                                {(!userData?.recog_inst_status || userData.recog_inst_status === '11' || userData.recog_inst_status === '20') && <>
                                                    <Row className='table-responsive'>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার নাম</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার বছর</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="jsc1_science_registered">বিভাগ</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="jsc1_science_registered">নিবন্ধিত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="jsc1_science_appeared">অংশগ্রহণকারী পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="jsc1_science_passed">পাশকৃত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th rowSpan={3} className='p-0 m-0 text-wrap align-top'>
                                                                        <h6 className="text-secondary text-center">জেএসসি/বার্ষিক পরীক্ষা (অষ্টম শ্রেণী)</h6>
                                                                    </th>
                                                                    <td rowSpan={1} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="jsc1_exam_year"
                                                                                value={userData.jsc1_exam_year}
                                                                                isInvalid={validated && !!userDataError.jsc1_exam_year}
                                                                                isValid={validated && userData.jsc1_exam_year && !userDataError.jsc1_exam_year}
                                                                                onChange={
                                                                                    (e) => {
                                                                                        setUserData((prev) => ({ ...prev, 'jsc1_exam_year': e.target.value, 'jsc2_exam_year': (e.target.value - 1), 'jsc3_exam_year': (e.target.value - 2) }));

                                                                                        setUserDataError((prev) => ({ ...prev, 'jsc1_exam_year': '', 'jsc2_exam_year': '', 'jsc3_exam_year': '' }));
                                                                                    }
                                                                                }
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value='' disabled >-- পরীক্ষা বছর --</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option> */}
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option>
                                                                            </Form.Select>
                                                                            {validated && userDataError.jsc1_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.jsc1_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">সাধারণ</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc1_science_registered}
                                                                            isInvalid={validated && !!userDataError.jsc1_science_registered}
                                                                            isValid={validated && userData.jsc1_science_registered && !userDataError.jsc1_science_registered}
                                                                            onChange={(e) => handleDataChange('jsc1_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc1_science_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc1_science_appeared}
                                                                            isValid={validated && userData.jsc1_science_appeared && !userDataError.jsc1_science_appeared}
                                                                            onChange={(e) => handleDataChange('jsc1_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc1_science_passed}
                                                                            isInvalid={validated && !!userDataError.jsc1_science_passed}
                                                                            isValid={validated && userData.jsc1_science_passed && !userDataError.jsc1_science_passed}
                                                                            onChange={(e) => handleDataChange('jsc1_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc1_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.jsc1_humanities_registered}
                                                                            isValid={validated && userData.jsc1_humanities_registered && !userDataError.jsc1_humanities_registered}
                                                                            onChange={(e) => handleDataChange('jsc1_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc1_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc1_humanities_appeared}
                                                                            isValid={validated && userData.jsc1_humanities_appeared && !userDataError.jsc1_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('jsc1_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc1_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.jsc1_humanities_passed}
                                                                            isValid={validated && userData.jsc1_humanities_passed && !userDataError.jsc1_humanities_passed}
                                                                            onChange={(e) => handleDataChange('jsc1_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc1_business_registered}
                                                                            isInvalid={validated && !!userDataError.jsc1_business_registered}
                                                                            isValid={validated && userData.jsc1_business_registered && !userDataError.jsc1_business_registered}
                                                                            onChange={(e) => handleDataChange('jsc1_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc1_business_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc1_business_appeared}
                                                                            isValid={validated && userData.jsc1_business_appeared && !userDataError.jsc1_business_appeared}
                                                                            onChange={(e) => handleDataChange('jsc1_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc1_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc1_business_passed}
                                                                            isInvalid={validated && !!userDataError.jsc1_business_passed}
                                                                            isValid={validated && userData.jsc1_business_passed && !userDataError.jsc1_business_passed}
                                                                            onChange={(e) => handleDataChange('jsc1_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc1_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc1_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr> */}
                                                                <tr>
                                                                    <td rowSpan={1} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="jsc2_exam_year"
                                                                                value={userData.jsc2_exam_year}
                                                                                isInvalid={validated && !!userDataError.jsc2_exam_year}
                                                                                isValid={validated && userData.jsc2_exam_year && !userDataError.jsc2_exam_year}
                                                                                onChange={(e) => handleDataChange('jsc2_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.jsc2_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.jsc2_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.jsc2_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">সাধারণ</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc2_science_registered}
                                                                            isInvalid={validated && !!userDataError.jsc2_science_registered}
                                                                            isValid={validated && userData.jsc2_science_registered && !userDataError.jsc2_science_registered}
                                                                            onChange={(e) => handleDataChange('jsc2_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc2_science_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc2_science_appeared}
                                                                            isValid={validated && userData.jsc2_science_appeared && !userDataError.jsc2_science_appeared}
                                                                            onChange={(e) => handleDataChange('jsc2_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc2_science_passed}
                                                                            isInvalid={validated && !!userDataError.jsc2_science_passed}
                                                                            isValid={validated && userData.jsc2_science_passed && !userDataError.jsc2_science_passed}
                                                                            onChange={(e) => handleDataChange('jsc2_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc2_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.jsc2_humanities_registered}
                                                                            isValid={validated && userData.jsc2_humanities_registered && !userDataError.jsc2_humanities_registered}
                                                                            onChange={(e) => handleDataChange('jsc2_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc2_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc2_humanities_appeared}
                                                                            isValid={validated && userData.jsc2_humanities_appeared && !userDataError.jsc2_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('jsc2_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc2_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.jsc2_humanities_passed}
                                                                            isValid={validated && userData.jsc2_humanities_passed && !userDataError.jsc2_humanities_passed}
                                                                            onChange={(e) => handleDataChange('jsc2_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc2_business_registered}
                                                                            isInvalid={validated && !!userDataError.jsc2_business_registered}
                                                                            isValid={validated && userData.jsc2_business_registered && !userDataError.jsc2_business_registered}
                                                                            onChange={(e) => handleDataChange('jsc2_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc2_business_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc2_business_appeared}
                                                                            isValid={validated && userData.jsc2_business_appeared && !userDataError.jsc2_business_appeared}
                                                                            onChange={(e) => handleDataChange('jsc2_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc2_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc2_business_passed}
                                                                            isInvalid={validated && !!userDataError.jsc2_business_passed}
                                                                            isValid={validated && userData.jsc2_business_passed && !userDataError.jsc2_business_passed}
                                                                            onChange={(e) => handleDataChange('jsc2_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc2_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc2_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr> */}
                                                                <tr>
                                                                    <td rowSpan={1} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="jsc3_exam_year"
                                                                                value={userData.jsc3_exam_year}
                                                                                isInvalid={validated && !!userDataError.jsc3_exam_year}
                                                                                isValid={validated && userData.jsc3_exam_year && !userDataError.jsc3_exam_year}
                                                                                onChange={(e) => handleDataChange('jsc3_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.jsc3_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.jsc3_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.jsc3_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">সাধারণ</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc3_science_registered}
                                                                            isInvalid={validated && !!userDataError.jsc3_science_registered}
                                                                            isValid={validated && userData.jsc3_science_registered && !userDataError.jsc3_science_registered}
                                                                            onChange={(e) => handleDataChange('jsc3_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc3_science_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc3_science_appeared}
                                                                            isValid={validated && userData.jsc3_science_appeared && !userDataError.jsc3_science_appeared}
                                                                            onChange={(e) => handleDataChange('jsc3_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.jsc3_science_passed}
                                                                            isInvalid={validated && !!userDataError.jsc3_science_passed}
                                                                            isValid={validated && userData.jsc3_science_passed && !userDataError.jsc3_science_passed}
                                                                            onChange={(e) => handleDataChange('jsc3_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                {/* <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc3_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.jsc3_humanities_registered}
                                                                            isValid={validated && userData.jsc3_humanities_registered && !userDataError.jsc3_humanities_registered}
                                                                            onChange={(e) => handleDataChange('jsc3_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc3_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc3_humanities_appeared}
                                                                            isValid={validated && userData.jsc3_humanities_appeared && !userDataError.jsc3_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('jsc3_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.jsc3_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.jsc3_humanities_passed}
                                                                            isValid={validated && userData.jsc3_humanities_passed && !userDataError.jsc3_humanities_passed}
                                                                            onChange={(e) => handleDataChange('jsc3_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-danger">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc3_business_registered}
                                                                            isInvalid={validated && !!userDataError.jsc3_business_registered}
                                                                            isValid={validated && userData.jsc3_business_registered && !userDataError.jsc3_business_registered}
                                                                            onChange={(e) => handleDataChange('jsc3_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc3_business_appeared}
                                                                            isInvalid={validated && !!userDataError.jsc3_business_appeared}
                                                                            isValid={validated && userData.jsc3_business_appeared && !userDataError.jsc3_business_appeared}
                                                                            onChange={(e) => handleDataChange('jsc3_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="jsc3_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.jsc3_business_passed}
                                                                            isInvalid={validated && !!userDataError.jsc3_business_passed}
                                                                            isValid={validated && userData.jsc3_business_passed && !userDataError.jsc3_business_passed}
                                                                            onChange={(e) => handleDataChange('jsc3_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.jsc3_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.jsc3_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr> */}
                                                            </tbody>
                                                        </table>
                                                    </Row>
                                                </>}
                                                {(!userData?.recog_inst_status || userData.recog_inst_status === '12' || userData.recog_inst_status === '20') && <>
                                                    <Row className='table-responsive mt-3'>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার নাম</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার বছর</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ssc1_science_registered">বিভাগ</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ssc1_science_registered">নিবন্ধিত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ssc1_science_appeared">অংশগ্রহণকারী পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="ssc1_science_passed">পাশকৃত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th rowSpan={9} className='p-0 m-0 text-wrap align-top'>
                                                                        <h6 className="text-secondary text-center">এসএসসি</h6>
                                                                    </th>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="ssc1_exam_year"
                                                                                value={userData.ssc1_exam_year}
                                                                                isInvalid={validated && !!userDataError.ssc1_exam_year}
                                                                                isValid={validated && userData.ssc1_exam_year && !userDataError.ssc1_exam_year}
                                                                                onChange={
                                                                                    (e) => {
                                                                                        setUserData((prev) => ({ ...prev, 'ssc1_exam_year': e.target.value, 'ssc2_exam_year': (e.target.value - 1), 'ssc3_exam_year': (e.target.value - 2) }));

                                                                                        setUserDataError((prev) => ({ ...prev, 'ssc1_exam_year': e.target.value, 'ssc2_exam_year': (e.target.value - 1), 'ssc3_exam_year': (e.target.value - 2) }));
                                                                                    }
                                                                                }
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value='' disabled >-- পরীক্ষা বছর --</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option> */}
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option>
                                                                            </Form.Select>
                                                                            {validated && userDataError.ssc1_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.ssc1_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc1_science_registered}
                                                                            isInvalid={validated && !!userDataError.ssc1_science_registered}
                                                                            isValid={validated && userData.ssc1_science_registered && !userDataError.ssc1_science_registered}
                                                                            onChange={(e) => handleDataChange('ssc1_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc1_science_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc1_science_appeared}
                                                                            isValid={validated && userData.ssc1_science_appeared && !userDataError.ssc1_science_appeared}
                                                                            onChange={(e) => handleDataChange('ssc1_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc1_science_passed}
                                                                            isInvalid={validated && !!userDataError.ssc1_science_passed}
                                                                            isValid={validated && userData.ssc1_science_passed && !userDataError.ssc1_science_passed}
                                                                            onChange={(e) => handleDataChange('ssc1_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc1_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.ssc1_humanities_registered}
                                                                            isValid={validated && userData.ssc1_humanities_registered && !userDataError.ssc1_humanities_registered}
                                                                            onChange={(e) => handleDataChange('ssc1_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc1_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc1_humanities_appeared}
                                                                            isValid={validated && userData.ssc1_humanities_appeared && !userDataError.ssc1_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('ssc1_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc1_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.ssc1_humanities_passed}
                                                                            isValid={validated && userData.ssc1_humanities_passed && !userDataError.ssc1_humanities_passed}
                                                                            onChange={(e) => handleDataChange('ssc1_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc1_business_registered}
                                                                            isInvalid={validated && !!userDataError.ssc1_business_registered}
                                                                            isValid={validated && userData.ssc1_business_registered && !userDataError.ssc1_business_registered}
                                                                            onChange={(e) => handleDataChange('ssc1_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc1_business_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc1_business_appeared}
                                                                            isValid={validated && userData.ssc1_business_appeared && !userDataError.ssc1_business_appeared}
                                                                            onChange={(e) => handleDataChange('ssc1_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc1_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc1_business_passed}
                                                                            isInvalid={validated && !!userDataError.ssc1_business_passed}
                                                                            isValid={validated && userData.ssc1_business_passed && !userDataError.ssc1_business_passed}
                                                                            onChange={(e) => handleDataChange('ssc1_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc1_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc1_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="ssc2_exam_year"
                                                                                value={userData.ssc2_exam_year}
                                                                                isInvalid={validated && !!userDataError.ssc2_exam_year}
                                                                                isValid={validated && userData.ssc2_exam_year && !userDataError.ssc2_exam_year}
                                                                                onChange={(e) => handleDataChange('ssc2_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.ssc2_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.ssc2_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.ssc2_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc2_science_registered}
                                                                            isInvalid={validated && !!userDataError.ssc2_science_registered}
                                                                            isValid={validated && userData.ssc2_science_registered && !userDataError.ssc2_science_registered}
                                                                            onChange={(e) => handleDataChange('ssc2_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc2_science_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc2_science_appeared}
                                                                            isValid={validated && userData.ssc2_science_appeared && !userDataError.ssc2_science_appeared}
                                                                            onChange={(e) => handleDataChange('ssc2_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc2_science_passed}
                                                                            isInvalid={validated && !!userDataError.ssc2_science_passed}
                                                                            isValid={validated && userData.ssc2_science_passed && !userDataError.ssc2_science_passed}
                                                                            onChange={(e) => handleDataChange('ssc2_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc2_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.ssc2_humanities_registered}
                                                                            isValid={validated && userData.ssc2_humanities_registered && !userDataError.ssc2_humanities_registered}
                                                                            onChange={(e) => handleDataChange('ssc2_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc2_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc2_humanities_appeared}
                                                                            isValid={validated && userData.ssc2_humanities_appeared && !userDataError.ssc2_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('ssc2_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc2_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.ssc2_humanities_passed}
                                                                            isValid={validated && userData.ssc2_humanities_passed && !userDataError.ssc2_humanities_passed}
                                                                            onChange={(e) => handleDataChange('ssc2_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc2_business_registered}
                                                                            isInvalid={validated && !!userDataError.ssc2_business_registered}
                                                                            isValid={validated && userData.ssc2_business_registered && !userDataError.ssc2_business_registered}
                                                                            onChange={(e) => handleDataChange('ssc2_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc2_business_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc2_business_appeared}
                                                                            isValid={validated && userData.ssc2_business_appeared && !userDataError.ssc2_business_appeared}
                                                                            onChange={(e) => handleDataChange('ssc2_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc2_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc2_business_passed}
                                                                            isInvalid={validated && !!userDataError.ssc2_business_passed}
                                                                            isValid={validated && userData.ssc2_business_passed && !userDataError.ssc2_business_passed}
                                                                            onChange={(e) => handleDataChange('ssc2_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc2_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc2_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="ssc3_exam_year"
                                                                                value={userData.ssc3_exam_year}
                                                                                isInvalid={validated && !!userDataError.ssc3_exam_year}
                                                                                isValid={validated && userData.ssc3_exam_year && !userDataError.ssc3_exam_year}
                                                                                onChange={(e) => handleDataChange('ssc3_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.ssc3_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.ssc3_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.ssc3_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc3_science_registered}
                                                                            isInvalid={validated && !!userDataError.ssc3_science_registered}
                                                                            isValid={validated && userData.ssc3_science_registered && !userDataError.ssc3_science_registered}
                                                                            onChange={(e) => handleDataChange('ssc3_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc3_science_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc3_science_appeared}
                                                                            isValid={validated && userData.ssc3_science_appeared && !userDataError.ssc3_science_appeared}
                                                                            onChange={(e) => handleDataChange('ssc3_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.ssc3_science_passed}
                                                                            isInvalid={validated && !!userDataError.ssc3_science_passed}
                                                                            isValid={validated && userData.ssc3_science_passed && !userDataError.ssc3_science_passed}
                                                                            onChange={(e) => handleDataChange('ssc3_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc3_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.ssc3_humanities_registered}
                                                                            isValid={validated && userData.ssc3_humanities_registered && !userDataError.ssc3_humanities_registered}
                                                                            onChange={(e) => handleDataChange('ssc3_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc3_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc3_humanities_appeared}
                                                                            isValid={validated && userData.ssc3_humanities_appeared && !userDataError.ssc3_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('ssc3_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.ssc3_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.ssc3_humanities_passed}
                                                                            isValid={validated && userData.ssc3_humanities_passed && !userDataError.ssc3_humanities_passed}
                                                                            onChange={(e) => handleDataChange('ssc3_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc3_business_registered}
                                                                            isInvalid={validated && !!userDataError.ssc3_business_registered}
                                                                            isValid={validated && userData.ssc3_business_registered && !userDataError.ssc3_business_registered}
                                                                            onChange={(e) => handleDataChange('ssc3_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc3_business_appeared}
                                                                            isInvalid={validated && !!userDataError.ssc3_business_appeared}
                                                                            isValid={validated && userData.ssc3_business_appeared && !userDataError.ssc3_business_appeared}
                                                                            onChange={(e) => handleDataChange('ssc3_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="ssc3_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.ssc3_business_passed}
                                                                            isInvalid={validated && !!userDataError.ssc3_business_passed}
                                                                            isValid={validated && userData.ssc3_business_passed && !userDataError.ssc3_business_passed}
                                                                            onChange={(e) => handleDataChange('ssc3_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.ssc3_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.ssc3_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Row>
                                                </>}
                                                {(!userData?.recog_inst_status || userData.recog_inst_status === '13' || userData.recog_inst_status === '20' || userData.recog_inst_status === '26') && <>
                                                    <Row className='table-responsive mt-3'>
                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার নাম</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <h6 className="text-primary">পরীক্ষার বছর</h6>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="hsc1_science_registered">বিভাগ</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="hsc1_science_registered">নিবন্ধিত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="hsc1_science_appeared">অংশগ্রহণকারী পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                    <th className='p-0 m-0 text-wrap align-top text-center'>
                                                                        <Form.Label className="text-primary" htmlFor="hsc1_science_passed">পাশকৃত পরীক্ষার্থী</Form.Label>
                                                                    </th>
                                                                </tr>
                                                                <tr>
                                                                    <th rowSpan={9} className='p-0 m-0 text-wrap align-top'>
                                                                        <h6 className="text-secondary text-center">এইচএসসি</h6>
                                                                    </th>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="hsc1_exam_year"
                                                                                value={userData.hsc1_exam_year}
                                                                                isInvalid={validated && !!userDataError.hsc1_exam_year}
                                                                                isValid={validated && userData.hsc1_exam_year && !userDataError.hsc1_exam_year}
                                                                                onChange={
                                                                                    (e) => {
                                                                                        setUserData((prev) => ({ ...prev, 'hsc1_exam_year': e.target.value, 'hsc2_exam_year': (e.target.value - 1), 'hsc3_exam_year': (e.target.value - 2) }));

                                                                                        setUserDataError((prev) => ({ ...prev, 'hsc1_exam_year': '', 'hsc2_exam_year': '', 'hsc3_exam_year': '' }));
                                                                                    }
                                                                                }
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value='' disabled >-- পরীক্ষা বছর --</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option> */}
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option>
                                                                            </Form.Select>
                                                                            {validated && userDataError.hsc1_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.hsc1_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc1_science_registered}
                                                                            isInvalid={validated && !!userDataError.hsc1_science_registered}
                                                                            isValid={validated && userData.hsc1_science_registered && !userDataError.hsc1_science_registered}
                                                                            onChange={(e) => handleDataChange('hsc1_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc1_science_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc1_science_appeared}
                                                                            isValid={validated && userData.hsc1_science_appeared && !userDataError.hsc1_science_appeared}
                                                                            onChange={(e) => handleDataChange('hsc1_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc1_science_passed}
                                                                            isInvalid={validated && !!userDataError.hsc1_science_passed}
                                                                            isValid={validated && userData.hsc1_science_passed && !userDataError.hsc1_science_passed}
                                                                            onChange={(e) => handleDataChange('hsc1_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc1_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.hsc1_humanities_registered}
                                                                            isValid={validated && userData.hsc1_humanities_registered && !userDataError.hsc1_humanities_registered}
                                                                            onChange={(e) => handleDataChange('hsc1_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc1_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc1_humanities_appeared}
                                                                            isValid={validated && userData.hsc1_humanities_appeared && !userDataError.hsc1_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('hsc1_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc1_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.hsc1_humanities_passed}
                                                                            isValid={validated && userData.hsc1_humanities_passed && !userDataError.hsc1_humanities_passed}
                                                                            onChange={(e) => handleDataChange('hsc1_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc1_business_registered}
                                                                            isInvalid={validated && !!userDataError.hsc1_business_registered}
                                                                            isValid={validated && userData.hsc1_business_registered && !userDataError.hsc1_business_registered}
                                                                            onChange={(e) => handleDataChange('hsc1_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc1_business_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc1_business_appeared}
                                                                            isValid={validated && userData.hsc1_business_appeared && !userDataError.hsc1_business_appeared}
                                                                            onChange={(e) => handleDataChange('hsc1_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc1_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc1_business_passed}
                                                                            isInvalid={validated && !!userDataError.hsc1_business_passed}
                                                                            isValid={validated && userData.hsc1_business_passed && !userDataError.hsc1_business_passed}
                                                                            onChange={(e) => handleDataChange('hsc1_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc1_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc1_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="hsc2_exam_year"
                                                                                value={userData.hsc2_exam_year}
                                                                                isInvalid={validated && !!userDataError.hsc2_exam_year}
                                                                                isValid={validated && userData.hsc2_exam_year && !userDataError.hsc2_exam_year}
                                                                                onChange={(e) => handleDataChange('hsc2_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.hsc2_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.hsc2_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.hsc2_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc2_science_registered}
                                                                            isInvalid={validated && !!userDataError.hsc2_science_registered}
                                                                            isValid={validated && userData.hsc2_science_registered && !userDataError.hsc2_science_registered}
                                                                            onChange={(e) => handleDataChange('hsc2_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc2_science_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc2_science_appeared}
                                                                            isValid={validated && userData.hsc2_science_appeared && !userDataError.hsc2_science_appeared}
                                                                            onChange={(e) => handleDataChange('hsc2_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc2_science_passed}
                                                                            isInvalid={validated && !!userDataError.hsc2_science_passed}
                                                                            isValid={validated && userData.hsc2_science_passed && !userDataError.hsc2_science_passed}
                                                                            onChange={(e) => handleDataChange('hsc2_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc2_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.hsc2_humanities_registered}
                                                                            isValid={validated && userData.hsc2_humanities_registered && !userDataError.hsc2_humanities_registered}
                                                                            onChange={(e) => handleDataChange('hsc2_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc2_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc2_humanities_appeared}
                                                                            isValid={validated && userData.hsc2_humanities_appeared && !userDataError.hsc2_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('hsc2_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc2_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.hsc2_humanities_passed}
                                                                            isValid={validated && userData.hsc2_humanities_passed && !userDataError.hsc2_humanities_passed}
                                                                            onChange={(e) => handleDataChange('hsc2_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc2_business_registered}
                                                                            isInvalid={validated && !!userDataError.hsc2_business_registered}
                                                                            isValid={validated && userData.hsc2_business_registered && !userDataError.hsc2_business_registered}
                                                                            onChange={(e) => handleDataChange('hsc2_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc2_business_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc2_business_appeared}
                                                                            isValid={validated && userData.hsc2_business_appeared && !userDataError.hsc2_business_appeared}
                                                                            onChange={(e) => handleDataChange('hsc2_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc2_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc2_business_passed}
                                                                            isInvalid={validated && !!userDataError.hsc2_business_passed}
                                                                            isValid={validated && userData.hsc2_business_passed && !userDataError.hsc2_business_passed}
                                                                            onChange={(e) => handleDataChange('hsc2_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc2_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc2_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td rowSpan={3} className='p-0 m-0 px-3 text-wrap align-top text-center'>
                                                                        <Form.Group className="bg-transparent">
                                                                            <Form.Select
                                                                                id="hsc3_exam_year"
                                                                                value={userData.hsc3_exam_year}
                                                                                isInvalid={validated && !!userDataError.hsc3_exam_year}
                                                                                isValid={validated && userData.hsc3_exam_year && !userDataError.hsc3_exam_year}
                                                                                onChange={(e) => handleDataChange('hsc3_exam_year', e.target.value)}
                                                                                readOnly={true}
                                                                                className="selectpicker form-control"
                                                                                data-style="py-0"
                                                                            >
                                                                                <option value=''>{userData.hsc3_exam_year}</option>
                                                                                {/* <option value={curDateTime.getFullYear() - 3}>{curDateTime.getFullYear() - 3}</option>
                                                                                <option value={curDateTime.getFullYear() - 2}>{curDateTime.getFullYear() - 2}</option>
                                                                                <option value={curDateTime.getFullYear() - 1}>{curDateTime.getFullYear() - 1}</option>
                                                                                <option value={curDateTime.getFullYear()}>{curDateTime.getFullYear()}</option> */}
                                                                            </Form.Select>
                                                                            {validated && userDataError.hsc3_exam_year && (
                                                                                <Form.Control.Feedback type="invalid">
                                                                                    {userDataError.hsc3_exam_year}
                                                                                </Form.Control.Feedback>
                                                                            )}
                                                                        </Form.Group>
                                                                    </td>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">{(userData.id_group === '10' || userData.id_group === '99') ? 'সাধারণ' : 'বিজ্ঞান'}</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_science_registered"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc3_science_registered}
                                                                            isInvalid={validated && !!userDataError.hsc3_science_registered}
                                                                            isValid={validated && userData.hsc3_science_registered && !userDataError.hsc3_science_registered}
                                                                            onChange={(e) => handleDataChange('hsc3_science_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_science_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_science_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_science_appeared"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc3_science_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc3_science_appeared}
                                                                            isValid={validated && userData.hsc3_science_appeared && !userDataError.hsc3_science_appeared}
                                                                            onChange={(e) => handleDataChange('hsc3_science_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_science_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_science_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_science_passed"
                                                                            readOnly={userData.id_group === '02' || userData.id_group === '03'}
                                                                            value={userData.hsc3_science_passed}
                                                                            isInvalid={validated && !!userDataError.hsc3_science_passed}
                                                                            isValid={validated && userData.hsc3_science_passed && !userDataError.hsc3_science_passed}
                                                                            onChange={(e) => handleDataChange('hsc3_science_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_science_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_science_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">মানবিক</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_humanities_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc3_humanities_registered}
                                                                            isInvalid={validated && !!userDataError.hsc3_humanities_registered}
                                                                            isValid={validated && userData.hsc3_humanities_registered && !userDataError.hsc3_humanities_registered}
                                                                            onChange={(e) => handleDataChange('hsc3_humanities_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_humanities_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_humanities_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_humanities_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc3_humanities_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc3_humanities_appeared}
                                                                            isValid={validated && userData.hsc3_humanities_appeared && !userDataError.hsc3_humanities_appeared}
                                                                            onChange={(e) => handleDataChange('hsc3_humanities_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_humanities_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_humanities_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_humanities_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '03'}
                                                                            value={userData.hsc3_humanities_passed}
                                                                            isInvalid={validated && !!userDataError.hsc3_humanities_passed}
                                                                            isValid={validated && userData.hsc3_humanities_passed && !userDataError.hsc3_humanities_passed}
                                                                            onChange={(e) => handleDataChange('hsc3_humanities_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_humanities_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_humanities_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <th className='p-0 m-0 text-wrap align-center'>
                                                                        <h6 className="text-secondary">ব্যবসায় শিক্ষা</h6>
                                                                    </th>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_business_registered"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc3_business_registered}
                                                                            isInvalid={validated && !!userDataError.hsc3_business_registered}
                                                                            isValid={validated && userData.hsc3_business_registered && !userDataError.hsc3_business_registered}
                                                                            onChange={(e) => handleDataChange('hsc3_business_registered', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_business_registered && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_business_registered}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_business_appeared"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc3_business_appeared}
                                                                            isInvalid={validated && !!userDataError.hsc3_business_appeared}
                                                                            isValid={validated && userData.hsc3_business_appeared && !userDataError.hsc3_business_appeared}
                                                                            onChange={(e) => handleDataChange('hsc3_business_appeared', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_business_appeared && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_business_appeared}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                    <td className='p-0 m-0 px-3 py-1 text-wrap align-top text-center'>
                                                                        <Form.Control
                                                                            className='bg-transparent text-uppercase'
                                                                            type="text"
                                                                            id="hsc3_business_passed"
                                                                            readOnly={userData.id_group === '01' || userData.id_group === '02'}
                                                                            value={userData.hsc3_business_passed}
                                                                            isInvalid={validated && !!userDataError.hsc3_business_passed}
                                                                            isValid={validated && userData.hsc3_business_passed && !userDataError.hsc3_business_passed}
                                                                            onChange={(e) => handleDataChange('hsc3_business_passed', e.target.value)}
                                                                        />
                                                                        {validated && userDataError.hsc3_business_passed && (
                                                                            <Form.Control.Feedback type="invalid">
                                                                                {userDataError.hsc3_business_passed}
                                                                            </Form.Control.Feedback>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </Row>
                                                </>}
                                            </Card.Body>
                                        </Card>

                                        <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 p-0 mb-2">
                                            <Card.Body className='d-flex flex-column justify-content-center align-items-center mb-5'>
                                                <Col md={12} className='d-flex justify-content-between align-items-center gap-3'>
                                                    <Button onClick={() => setNavigateRecognitionApp(false)} className='flex-fill' type="button" variant="btn btn-warning">ফিরে যান</Button>
                                                    <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                                    <Button className='flex-fill' type="submit" variant="btn btn-success">সাবমিট</Button>
                                                </Col>
                                            </Card.Body>
                                        </Card>
                                    </Form>
                                </Col>
                            </Row>
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
    );
};

export default RecognitionApp;