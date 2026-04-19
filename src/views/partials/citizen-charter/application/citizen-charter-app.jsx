import React, { Fragment, useEffect, useState } from 'react';
import Select from 'react-select'
import { Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';

import axiosApi from "../../../../lib/axiosApi.jsx";
import * as InputValidation from '../../input_validation.js';
import { useAuthProvider } from "../../../../context/AuthContext.jsx";

const CitizenCharterForm = ({ userData, setUserData, status, setStatus, setHide }) => {
    const { permissionData } = useAuthProvider();

    const [userList, setUserList] = useState([]);
    const [optionUserList, setOptionUserList] = useState([]);

    const [userDataError, setUserDataError] = useState([]);

    const [validated, setValidated] = useState(false);

    const [userBnError, setUserBnError] = useState([]);

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    const fetchUserList = async () => {
        setStatus({ loading: "প্রোফাইল তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/user/list/summery`);
            if (response.status === 200) {
                setUserList(response.data.userList);
                setStatus({ loading: false, success: true, error: false });
            } else {
                setStatus({ loading: false, success: true, error: response.data.message });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setStatus({ loading: false, success: true, error: err.response.data.message });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    useEffect(() => {
        fetchUserList();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Option Office List
    useEffect(() => {
        if (userList.length > 0) {
            const filteredData = userList.filter(
                item => item.id_office === permissionData.office
            );
            const newOptions = filteredData.map(data => ({
                value: data.id_user,
                label: data.bn_user + " (" + data.bn_post + ")"
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionUserList(uniqueValues);
        }
    }, [userList]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        // ‍Set Bangla Error Values
        setUserBnError({
            id_charter_type: 'সেবার ধরণ', bn_citizen_charter: 'সেবার নাম', bn_citizen_charter_proc: 'সেবা প্রদান প্রক্রিয়া', bn_citizen_charter_docs: 'সেবা প্রাপ্তির জন্য প্রয়োজনীয় কাগজপত্রাদি', bn_citizen_charter_fee: 'সেবা মূল্য', citizen_charter_duration: 'সেবা প্রদানের সময়', id_user: 'দায়িত্বপ্রাপ্ত কর্মকর্তা', message: 'মন্তব্য',
        })

        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'id_citizen_charter', 'id_charter_type', 'bn_citizen_charter', 'bn_citizen_charter_proc', 'bn_citizen_charter_docs', 'bn_citizen_charter_fee', 'citizen_charter_duration', 'id_user', 'message',
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                switch (field) {
                    case 'id_citizen_charter':
                        dataError = userData[field] ? InputValidation.numberCheck(userData[field]) : false;
                        break;

                    case 'id_charter_type':
                        dataError = InputValidation.numberCheck(userData[field]);
                        break;

                    case 'id_user':
                        dataError = InputValidation.alphanumCheck(userData[field]);
                        break;

                    case 'bn_citizen_charter':
                    case 'bn_citizen_charter_proc':
                    case 'bn_citizen_charter_docs':
                    case 'bn_citizen_charter_fee':
                    case 'citizen_charter_duration':
                        dataError = InputValidation.banglaAddressCheck(userData[field]);
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
                const response = await axiosApi.post(userData.id_citizen_charter ? `/citizen/charter/update` : `/citizen/charter/new`, { userData: userData });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setUserData({ id_charter_type: '', bn_citizen_charter: '', bn_citizen_charter_proc: '', bn_citizen_charter_docs: '', bn_citizen_charter_fee: '', citizen_charter_duration: '', id_user: '', message: '', });
                    setUserDataError([]);
                    setValidated(false);
                    setHide ? setHide(false) : "";
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
        setValidated(true);
    };

    //Handle Data Change
    const handleDataChange = (dataName, dataValue) => {
        setUserData({ ...userData, [dataName]: dataValue });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUserDataError([]);
        setUserData({ id_charter_type: '', bn_citizen_charter: '', bn_citizen_charter_proc: '', bn_citizen_charter_docs: '', bn_citizen_charter_fee: '', citizen_charter_duration: '', id_user: '', message: '', });
        setValidated(false);
        setStatus({ loading: false, success: false, error: false });
    };

    return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                        <Card className='auth-card'>
                            <Card.Header className="d-flex flex-column justify-content-center align-items-center gap-1">
                                <span className="text-center text-primary fs-4">দপ্তরের আওতাধীন সেবা (সিটিজেন চার্টার)</span>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="mb-2" md={12}>
                                        {status.loading && <h6 className="text-center card-title w-100 text-info">{status.loading}</h6>}
                                        {status.error && <h6 className="text-center card-title w-100 text-danger">{status.error}</h6>}
                                        {status.success && <h6 className="text-center card-title w-100 text-success">{status.success}</h6>}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-secondary" htmlFor="id_charter_type">সেবার ধরণ</Form.Label>
                                            <Form.Select
                                                id="id_charter_type"
                                                value={userData.id_charter_type}
                                                isInvalid={validated && !!userDataError.id_charter_type}
                                                isValid={validated && userData.id_charter_type && !userDataError.id_charter_type}
                                                onChange={(e) => handleDataChange('id_charter_type', e.target.value)}
                                                className="selectpicker form-control"
                                                data-style="py-0"
                                            >
                                                <option value=''>-- সেবার ধরণ সিলেক্ট করুন --</option>
                                                <option value='01'>নাগরিক সেবা</option>
                                                <option value='02'>দাপ্তরিক সেবা</option>
                                                <option value='03'>অভ্যন্তরীণ সেবা</option>
                                                <option value='04'>আওতাধীন অধিদপ্তর/সংস্থা/অন্যান্য প্রতিষ্ঠান কর্তৃক প্রদত্ত সেবা</option>
                                            </Form.Select>
                                            {validated && userDataError.id_charter_type && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.id_charter_type}
                                                </Form.Control.Feedback>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={8}>
                                        <Form.Label className="text-secondary" htmlFor="bn_citizen_charter">সেবার নাম</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_citizen_charter"
                                            maxLength={120}
                                            value={userData.bn_citizen_charter}
                                            isInvalid={validated && !!userDataError.bn_citizen_charter}
                                            isValid={validated && userData.bn_citizen_charter && !userDataError.bn_citizen_charter}
                                            onChange={(e) => handleDataChange('bn_citizen_charter', e.target.value)}
                                        />
                                        {validated && userDataError.bn_citizen_charter && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_citizen_charter}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label htmlFor="bn_citizen_charter_proc" className='fw-bold'>সেবা প্রদান প্রক্রিয়া</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            className='bg-transparent text-uppercase text-dark'
                                            maxLength={4096}
                                            id="bn_citizen_charter_proc"
                                            placeholder='সেবা প্রদান প্রক্রিয়া লিখুন'
                                            value={userData.bn_citizen_charter_proc}
                                            isInvalid={validated && !!userDataError.bn_citizen_charter_proc}
                                            isValid={validated && userData.bn_citizen_charter_proc && !userDataError.bn_citizen_charter_proc}
                                            onChange={(e) => handleDataChange('bn_citizen_charter_proc', e.target.value)}
                                            rows={5}
                                        />
                                        {validated && userDataError.bn_citizen_charter_proc && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_citizen_charter_proc}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label htmlFor="bn_citizen_charter_docs" className='fw-bold'>প্রয়োজনীয় কাগজপত্র ও প্রাপ্তিস্থান</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            className='bg-transparent text-uppercase text-dark'
                                            maxLength={4096}
                                            id="bn_citizen_charter_docs"
                                            placeholder='প্রয়োজনীয় কাগজপত্র ও প্রাপ্তিস্থান উল্লেখ'
                                            value={userData.bn_citizen_charter_docs}
                                            isInvalid={validated && !!userDataError.bn_citizen_charter_docs}
                                            isValid={validated && userData.bn_citizen_charter_docs && !userDataError.bn_citizen_charter_docs}
                                            onChange={(e) => handleDataChange('bn_citizen_charter_docs', e.target.value)}
                                            rows={5}
                                        />
                                        {validated && userDataError.bn_citizen_charter_docs && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_citizen_charter_docs}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={9}>
                                        <Form.Label className="text-secondary" htmlFor="bn_citizen_charter_fee">সেবা মূল্য ও পরিশোধ পদ্ধতি</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_citizen_charter_fee"
                                            maxLength={2048}
                                            value={userData.bn_citizen_charter_fee}
                                            isInvalid={validated && !!userDataError.bn_citizen_charter_fee}
                                            isValid={validated && userData.bn_citizen_charter_fee && !userDataError.bn_citizen_charter_fee}
                                            onChange={(e) => handleDataChange('bn_citizen_charter_fee', e.target.value)}
                                        />
                                        {validated && userDataError.bn_citizen_charter_fee && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.bn_citizen_charter_fee}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={3}>
                                        <Form.Label className="text-secondary" htmlFor="citizen_charter_duration">সেবা প্রদানের সর্বোচ্চ সময়</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="citizen_charter_duration"
                                            maxLength={256}
                                            value={userData.citizen_charter_duration}
                                            isInvalid={validated && !!userDataError.citizen_charter_duration}
                                            isValid={validated && userData.citizen_charter_duration && !userDataError.citizen_charter_duration}
                                            onChange={(e) => handleDataChange('citizen_charter_duration', e.target.value)}
                                        />
                                        {validated && userDataError.citizen_charter_duration && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.citizen_charter_duration}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='id_user'>দায়িত্বপ্রাপ্ত কর্মকর্তা</Form.Label>
                                            <Select
                                                inputId="id_user"
                                                placeholder="--কর্মকর্তার নাম সিলেক্ট করুন--"
                                                value={
                                                    optionUserList.find(opt => opt.value === userData.id_user) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('id_user', value.value) : handleDataChange('id_user', '')
                                                }
                                                options={optionUserList}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.id_user && (
                                                <p className='text-danger'>
                                                    {userDataError.id_user}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Label htmlFor="message" className='fw-bold'>মন্তব্য লিখুনঃ </Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            className='bg-transparent text-uppercase text-dark'
                                            maxLength={240}
                                            id="message"
                                            placeholder='মন্তব্য উল্লেখ করুন (যদি থাকে)'
                                            value={userData.message}
                                            isInvalid={validated && !!userDataError.message}
                                            isValid={validated && userData.message && !userDataError.message}
                                            onChange={(e) => handleDataChange('message', e.target.value)}
                                            rows={5}
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
                                <Button className='flex-fill' type="submit" variant="btn btn-outline-success">{userData.id_citizen_charter ? "আপডেট" : "সাবমিট"}</Button>
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

export default CitizenCharterForm;