import React, { Fragment, useState } from 'react';

import { Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';

import axiosApi from "../../../../lib/axiosApi.jsx";

import * as InputValidation from '../../input_validation.js'

const SubjectAppForm = ({ userData, setUserData, status, setStatus, setHide, subjectList, setSubjectList }) => {
    const [userDataError, setUserDataError] = useState([]);

    const [validated, setValidated] = useState(false);

    const [userBnError, setUserBnError] = useState([]);

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        // ‍Set Bangla Error Values
        setUserBnError({
            id_exam: 'পরীক্ষার নাম', ex_year: 'বছর', sub_code: 'বিষয় কোড', en_full_sub: 'বিষয়ের পূর্ণ নাম (ইংরেজি)', bn_full_sub: 'বিষয়ের পূর্ণ নাম (বাংলা)', en_reg_sub: 'বিষয়ের সংক্ষিপ্ত নাম (ইংরেজি)', bn_reg_sub: 'বিষয়ের সংক্ষিপ্ত নাম (বাংলা)', id_group: 'বিষয়ের বিভাগ', is_reg_compulsory: 'আবশ্যিক বিষয়', is_grp_compulsory: 'আবশ্যিক বিষয় (বিভাগ)', is_rel_compulsory: 'আবশ্যিক বিষয় (ধর্মীয়)', message: 'মন্তব্য'
        })

        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'id_exam', 'ex_year', 'sub_code', 'en_full_sub', 'bn_full_sub', 'en_reg_sub', 'bn_reg_sub', 'id_group', 'is_reg_compulsory', 'is_grp_compulsory', 'is_rel_compulsory', 'message'
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                switch (field) {
                    case 'id_exam':
                    case 'ex_year':
                    case 'sub_code':
                    case 'id_group':
                    case 'is_reg_compulsory':
                    case 'is_grp_compulsory':
                    case 'is_rel_compulsory':
                        dataError = InputValidation.numberCheck(userData[field]);
                        break;

                    case 'en_full_sub':
                    case 'en_reg_sub':
                        dataError = InputValidation.alphanumCheck(userData[field]);
                        break;

                    case 'bn_full_sub':
                    case 'bn_reg_sub':
                        dataError = InputValidation.bengaliCheck(userData[field]);
                        break;

                    case 'message':
                        dataError = userData[field] ? InputValidation.banglaAddressCheck(userData[field]) : false;
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
            setModalError(true);
            event.stopPropagation();
        } else {
            setStatus({ loading: "আপডেট করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
            try {
                const response = await axiosApi.post(`/subject/entry/new`, { userData: userData });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });

                    const exists = subjectList?.length ? subjectList.some(
                        item => item.sub_code === userData.sub_code
                    ) : false;

                    const finalList = exists
                        ? subjectList.map(item =>
                            item.sub_code === userData.sub_code
                                ? { ...item, ...userData }
                                : item
                        )
                        : subjectList?.length ? [...subjectList, { ...userData }] : [{ ...userData }];

                    setSubjectList(finalList);

                    setUserDataError([]);
                    setValidated(false);
                    setHide ? setHide(false) : '';
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate("/auth/sign-out");
                }
                setStatus({ loading: false, success: false, error: err.response.data.message });
                alert(err.response.data.message);
            } finally {
                setStatus((prev) => ({ ...prev, loading: false }));
            }
        }
        setValidated(true);
    };

    //Handle Data Change
    const handleDataChange = (dataName, dataValue) => {
        const dataMap = {
            'is_reg_compulsory': { is_reg_compulsory: dataValue, is_grp_compulsory: 0, is_rel_compulsory: 0, },
            'is_grp_compulsory': { is_reg_compulsory: 0, is_grp_compulsory: dataValue, is_rel_compulsory: 0, },
            'is_rel_compulsory': { is_reg_compulsory: 0, is_grp_compulsory: 0, is_rel_compulsory: dataValue, },
        }

        const dataMapMatched = dataMap[dataName];

        if (dataMapMatched && dataValue) {
            setUserData({ ...userData, ...dataMapMatched });
            setUserDataError(prev => ({ ...prev, is_reg_compulsory: false, is_grp_compulsory: false, is_rel_compulsory: false }));
        } else {
            setUserData({ ...userData, [dataName]: dataValue });
            setUserDataError(prev => ({ ...prev, [dataName]: '' }));
        }
    }

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUserDataError([]);
        setUserData((prev) => ({ ...prev, sub_code: '', en_full_sub: '', bn_full_sub: '', en_reg_sub: '', bn_reg_sub: '', id_group: '', is_reg_compulsory: '', is_grp_compulsory: '', is_rel_compulsory: '', message: '' })); setValidated(false);
        setStatus({ loading: false, success: false, error: false });
    };

    return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                        <Card className='auth-card'>
                            <Card.Header className="d-flex flex-column justify-content-center align-items-center gap-1">
                                <span className="text-center text-primary fs-4">রেজিস্ট্রেশন/পরীক্ষার বিষয় এন্ট্রি/হালনাগাদ</span>
                                {userData.bn_exam && <span className="text-center text-secondary fs-6">পরীক্ষার নামঃ {userData.bn_exam}</span>}
                                {!userData.bn_exam && <span className="text-center text-secondary fs-6">পরীক্ষার নামঃ
                                    {userData.id_exam === '03' && " নিম্নমাধ্যমিক স্কুল সার্টিফিকেট"}
                                    {userData.id_exam === '04' && " নিম্নমাধ্যমিক বৃত্তি পরীক্ষা"}
                                    {userData.id_exam === '05' && " মাধ্যমিক স্কুল সার্টিফিকেট"}
                                    {userData.id_exam === '06' && " মাধ্যমিক বৃত্তি পরীক্ষা"}
                                    {userData.id_exam === '07' && " উচ্চমাধ্যমিক স্কুল সার্টিফিকেট"}
                                    {userData.id_exam === '08' && " উচ্চমাধ্যমিক বৃত্তি  পরীক্ষা"}
                                    {userData.id_exam === '09' && " ষষ্ট শ্রেণীর সমাপনী পরীক্ষা"}
                                    {userData.id_exam === '10' && " সপ্তম শ্রেণীর সমাপনী পরীক্ষা"}
                                </span>}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="mb-2" md={12}>
                                        {status.loading && <h6 className="text-center card-title w-100 text-info">{status.loading}</h6>}
                                        {status.error && <h6 className="text-center card-title w-100 text-danger">{status.error}</h6>}
                                        {status.success && <h6 className="text-center card-title w-100 text-success">{status.success}</h6>}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label className="text-secondary" htmlFor="bn_full_sub">বিষয়ের পূর্ণ নাম (বাংলা)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_full_sub"
                                            maxLength={120}
                                            value={userData.bn_full_sub}
                                            isInvalid={validated && !!userDataError.bn_full_sub}
                                            isValid={validated && userData.bn_full_sub && !userDataError.bn_full_sub}
                                            onChange={(e) => handleDataChange('bn_full_sub', e.target.value)}
                                        />
                                        {validated && userDataError.bn_full_sub && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_full_sub}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label className="text-secondary" htmlFor="en_full_sub">বিষয়ের পূর্ণ নাম (ইংরেজি)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="en_full_sub"
                                            maxLength={120}
                                            value={userData.en_full_sub}
                                            isInvalid={validated && !!userDataError.en_full_sub}
                                            isValid={validated && userData.en_full_sub && !userDataError.en_full_sub}
                                            onChange={(e) => handleDataChange('en_full_sub', e.target.value)}
                                        />
                                        {validated && userDataError.en_full_sub && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.en_full_sub}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label className="text-secondary" htmlFor="bn_reg_sub">বিষয়ের সংক্ষিপ্ত নাম (বাংলা)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_reg_sub"
                                            maxLength={120}
                                            value={userData.bn_reg_sub}
                                            isInvalid={validated && !!userDataError.bn_reg_sub}
                                            isValid={validated && userData.bn_reg_sub && !userDataError.bn_reg_sub}
                                            onChange={(e) => handleDataChange('bn_reg_sub', e.target.value)}
                                        />
                                        {validated && userDataError.bn_reg_sub && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_reg_sub}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label className="text-secondary" htmlFor="en_reg_sub">বিষয়ের সংক্ষিপ্ত নাম (ইংরেজি)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="en_reg_sub"
                                            maxLength={120}
                                            value={userData.en_reg_sub}
                                            isInvalid={validated && !!userDataError.en_reg_sub}
                                            isValid={validated && userData.en_reg_sub && !userDataError.en_reg_sub}
                                            onChange={(e) => handleDataChange('en_reg_sub', e.target.value)}
                                        />
                                        {validated && userDataError.en_reg_sub && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.en_reg_sub}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-dark" htmlFor='id_group'>বিভাগ (গ্রুপ)</Form.Label>
                                            <Form.Select
                                                id="id_group"
                                                className='bg-transparent text-uppercase text-dark'
                                                data-style="py-0"
                                                value={userData.id_group}
                                                isInvalid={validated && !!userDataError.id_group}
                                                isValid={validated && userData.id_group && !userDataError.id_group}
                                                onChange={(e) => handleDataChange('id_group', e.target.value)}
                                            >
                                                <option value=''>-- বিভাগ সিলেক্ট করুন --</option>
                                                <option value='01'>বিজ্ঞান বিভাগ</option>
                                                <option value='02'>মানবিক বিভাগ</option>
                                                <option value='03'>ব্যবসায় শিক্ষা বিভাগ</option>
                                                <option value='10'>সাধারণ বিভাগ</option>
                                            </Form.Select>
                                            {validated && userDataError.id_group && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.id_group}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-secondary" htmlFor="sub_code">বিষয় কোড</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="sub_code"
                                            maxLength={3}
                                            value={userData.sub_code}
                                            isInvalid={validated && !!userDataError.sub_code}
                                            isValid={validated && userData.sub_code && !userDataError.sub_code}
                                            onChange={(e) => handleDataChange('sub_code', e.target.value)}
                                        />
                                        {validated && userDataError.sub_code && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.sub_code}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-secondary" htmlFor="ex_year">পরীক্ষার বছর</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="ex_year"
                                            maxLength={4}
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
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-dark" htmlFor='is_reg_compulsory'>আবশ্যিক বিষয়</Form.Label>
                                            <Form.Select
                                                id="is_reg_compulsory"
                                                className='text-dark'
                                                value={userData.is_reg_compulsory}
                                                isInvalid={validated && !!userDataError.is_reg_compulsory}
                                                isValid={validated && userData.is_reg_compulsory && !userDataError.is_reg_compulsory}
                                                onChange={(e) => handleDataChange('is_reg_compulsory', e.target.value)}
                                            >
                                                <option value=''>--আবশ্যিক বিষয় কিনা সিলেক্ট করুন--</option>
                                                <option value={1}>হ্যাঁ</option>
                                                <option value={0}>না</option>
                                            </Form.Select>
                                            {validated && userDataError.is_reg_compulsory && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.is_reg_compulsory}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-dark" htmlFor='is_rel_compulsory'>আবশ্যিক বিষয় (ধর্মীয়)</Form.Label>
                                            <Form.Select
                                                id="is_rel_compulsory"
                                                className='text-dark'
                                                value={userData.is_rel_compulsory}
                                                isInvalid={validated && !!userDataError.is_rel_compulsory}
                                                isValid={validated && userData.is_rel_compulsory && !userDataError.is_rel_compulsory}
                                                onChange={(e) => handleDataChange('is_rel_compulsory', e.target.value)}
                                            >
                                                <option value=''>--আবশ্যিক বিষয় (ধর্মীয়) কিনা সিলেক্ট করুন--</option>
                                                <option value={1}>হ্যাঁ</option>
                                                <option value={0}>না</option>
                                            </Form.Select>
                                            {validated && userDataError.is_rel_compulsory && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.is_rel_compulsory}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-dark" htmlFor='is_grp_compulsory'>আবশ্যিক বিষয় (বিভাগীয়)</Form.Label>
                                            <Form.Select
                                                id="is_grp_compulsory"
                                                className='text-dark'
                                                value={userData.is_grp_compulsory}
                                                isInvalid={validated && !!userDataError.is_grp_compulsory}
                                                isValid={validated && userData.is_grp_compulsory && !userDataError.is_grp_compulsory}
                                                onChange={(e) => handleDataChange('is_grp_compulsory', e.target.value)}
                                            >
                                                <option value=''>--আবশ্যিক বিষয় (বিভাগীয়) কিনা সিলেক্ট করুন--</option>
                                                <option value={1}>হ্যাঁ</option>
                                                <option value={0}>না</option>
                                            </Form.Select>
                                            {validated && userDataError.is_grp_compulsory && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.is_grp_compulsory}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label className="text-secondary" htmlFor="message">মন্তব্য</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="message"
                                            maxLength={120}
                                            value={userData.message}
                                            isInvalid={validated && !!userDataError.message}
                                            isValid={validated && userData.message && !userDataError.message}
                                            onChange={(e) => handleDataChange('message', e.target.value)}
                                        />
                                        {validated && userDataError.message && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.message}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                </Row>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-center gap-3">
                                <Button className='flex-fill' type="reset" variant="btn btn-outline-danger">রিসেট</Button>
                                {setHide && <Button className='flex-fill' type="reset" variant="btn btn-outline-warning" onClick={() => setHide(false)}>ফিরে যান</Button>}
                                <Button className='flex-fill' type="submit" variant="btn btn-outline-success">{"সাবমিট"}</Button>
                            </Card.Footer>
                        </Card>
                    </Form>
                </Col>
            </Row>
            <Modal
                show={modalError}
                onHide={() => setModalError(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.entries(userDataError).map(([field, error]) => (
                        <i className='text-danger' key={field}>{userBnError[field]}, </i>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalError(false)}>
                        ফিরে যান
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default SubjectAppForm;