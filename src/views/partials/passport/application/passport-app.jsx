import React, { Fragment, useEffect, useState } from 'react';

import { Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';

import axiosApi from "../../../../lib/axiosApi.jsx";

import * as InputValidation from '../../input_validation.js'

const PassportAppForm = ({ userData, setUserData, status, setStatus, setHide }) => {
    const currDate = new Date();
    currDate.setHours(currDate.getUTCHours() + 12);

    const [profileData, setProfileData] = useState([]);

    const [userDataError, setUserDataError] = useState([]);

    const [validated, setValidated] = useState(false);

    const [userBnError, setUserBnError] = useState([]);

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    const fetchProfileData = async () => {
        setStatus({ loading: "প্রোফাইল তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/user/details`);
            if (response.status === 200) {
                setProfileData(response.data.data);
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

    const fetchPrevApp = async () => {
        setStatus({ loading: "পূর্বের আবেদনের তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/passport/application/list/personal`);
            if (response.status === 200) {
                if (response?.data?.passportList[0]?.id_status === '13') {
                    const myData = response.data.passportList[0];
                    Object.keys(myData).forEach(key => {
                        if (!myData[key]) {
                            myData[key] = "";
                        }
                    });
                    setUserData((prev) => ({ ...prev, ...myData }));
                    setStatus({ loading: false, success: true, error: false });
                }
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
        fetchProfileData();
        fetchPrevApp();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        // ‍Set Bangla Error Values
        setUserBnError({
            bn_spouse: 'স্বামী/স্ত্রীর নাম (বাংলা)', en_spouse: 'স্বামী/স্ত্রীর নাম (ইংরেজি)', dob_spouse: 'স্বামী/স্ত্রীর জন্মতারিখ', id_spouse: 'স্বামী/স্ত্রীর আইডি নম্বর', bn_child1: 'সন্তানের (১) নাম (বাংলা)', en_child1: 'সন্তানের (১) নাম (ইংরেজি)', id_gender_child1: 'সন্তানের (১) জেন্ডার', dob_child1: 'সন্তানের (১) জন্মতারিখ', id_child1: 'সন্তানের (১) আইডি নম্বর', bn_child2: 'সন্তানের (২) নাম (বাংলা)', en_child2: 'সন্তানের (২) নাম (ইংরেজি)', id_gender_child2: 'সন্তানের (২) জেন্ডার', dob_child2: 'সন্তানের (২)জন্মতারিখ', id_child2: 'সন্তানের (২) আইডি নম্বর'
        })

        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'dob_spouse', 'id_spouse', 'bn_child1', 'en_child1', 'id_gender_child1', 'dob_child1', 'id_child1', 'bn_child2', 'en_child2', 'id_gender_child2', 'dob_child2', 'id_child2',
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                switch (field) {
                    case 'id_spouse':
                        dataError = profileData.en_spouse ? InputValidation.numberCheck(userData[field]) : false;
                        break;

                    case 'id_gender_child1':
                    case 'id_gender_child2':
                    case 'id_child1':
                    case 'id_child2':
                        dataError = profileData.en_spouse && userData[field] ? InputValidation.numberCheck(userData[field]) : false;
                        break;

                    case 'en_child1':
                    case 'en_child2':
                        dataError = profileData.en_spouse && userData[field] ? InputValidation.alphaCheck(userData[field]) : false;
                        break;

                    case 'bn_child1':
                    case 'bn_child2':
                        dataError = profileData.en_spouse && userData[field] ? InputValidation.bengaliCheck(userData[field]) : false;
                        break;

                    case 'dob_spouse':
                        dataError = profileData.en_spouse ? InputValidation.dateCheck(userData[field], userData[field], userData[field]) : false;
                        break;

                    case 'dob_child1':
                    case 'dob_child2':
                        dataError = profileData.en_spouse && userData[field] ? InputValidation.dateCheck(userData[field], userData[field], userData[field]) : false;
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
            const myData = userData;
            try {
                const response = await axiosApi.post(userData.id_passport ? `/passport/application/update` : `/passport/application/new`, { userData: userData });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setUserData({ dob_spouse: '', id_spouse: '', bn_child1: '', en_child1: '', id_gender_child1: '', dob_child1: '', id_child1: '', bn_child2: '', en_child2: '', id_gender_child2: '', dob_child2: '', id_child2: '' });
                    setUserDataError([]);
                    setValidated(false);
                    alert(response.data.message);
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                    alert(response.data.message);
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
        setUserData({ ...userData, [dataName]: dataValue });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUserDataError([]);
        setUserData({ dob_spouse: '', id_spouse: '', bn_child1: '', en_child1: '', id_gender_child1: '', dob_child1: '', id_child1: '', bn_child2: '', en_child2: '', id_gender_child2: '', dob_child2: '', id_child2: '', });
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
                                <span className="text-center text-primary fs-4">কর্মকর্তা/কর্মচারীদের পাসপোর্টের অনাপত্তিপত্রের আবেদন</span>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="mb-2" md={12}>
                                        {status.loading && <h6 className="text-center card-title w-100 text-info">{status.loading}</h6>}
                                        {status.error && <h6 className="text-center card-title w-100 text-danger">{status.error}</h6>}
                                        {status.success && <h6 className="text-center card-title w-100 text-success">{status.success}</h6>}
                                        <h6 className='text-center text-primary'>ব্যক্তিগত তথ্য</h6>
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-secondary" htmlFor="bn_user">আবেদনকারীর নাম</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_user"
                                            placeholder={profileData.bn_user}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-secondary" htmlFor="bn_father">পিতার নাম</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="bn_father"
                                            placeholder={profileData.bn_father}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-secondary" htmlFor="current_address">বর্তমান ঠিকানা</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="current_address"
                                            placeholder={profileData.bn_curr_address + ", " + profileData.bn_curr_postoffice + ", " + profileData.bn_curr_uzps + ", " + profileData.bn_curr_dist}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-secondary" htmlFor="parmanent_address">স্থায়ী ঠিকানা</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase text-dark'
                                            type="text"
                                            id="parmanent_address"
                                            placeholder={profileData.bn_parm_address + ", " + profileData.bn_parm_postoffice + ", " + profileData.bn_parm_uzps + ", " + profileData.bn_parm_dist}
                                            disabled={true}
                                        />
                                    </Col>
                                    {profileData.en_spouse && <>
                                        <Col className='my-2 pt-4' md={12}>
                                            <h6 className='text-center text-primary'>{profileData.id_gender === '01' ? "স্ত্রীর " : "স্বামীর "}তথ্য</h6>
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="en_spouse">নাম (ইংরেজি)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="en_spouse"
                                                placeholder={profileData.en_spouse}
                                                disabled={true}
                                            />
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="en_spouse">নাম (বাংলা)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="bn_spouse"
                                                placeholder={profileData.bn_spouse}
                                                disabled={true}
                                            />
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="dob_spouse">জন্মতারিখ</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="date"
                                                id="dob_spouse"
                                                value={userData.dob_spouse}
                                                isInvalid={validated && !!userDataError.dob_spouse}
                                                isValid={validated && userData.dob_spouse && !userDataError.dob_spouse}
                                                onChange={(e) => handleDataChange('dob_spouse', e.target.value)}
                                            />
                                            {validated && userDataError.dob_spouse && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.dob_spouse}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="id_spouse">পরিচয়পত্র নম্বর (এনআইডি/জন্মনিবন্ধন)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="id_spouse"
                                                maxLength={17}
                                                value={userData.id_spouse}
                                                isInvalid={validated && !!userDataError.id_spouse}
                                                isValid={validated && userData.id_spouse && !userDataError.id_spouse}
                                                onChange={(e) => handleDataChange('id_spouse', e.target.value)}
                                            />
                                            {validated && userDataError.id_spouse && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.id_spouse}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2 pt-4' md={12}>
                                            <h6 className='text-center text-primary'>সন্তানের (১ম) তথ্য</h6>
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="en_child1">নাম (ইংরেজি)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="en_child1"
                                                value={userData.en_child1}
                                                isInvalid={validated && !!userDataError.en_child1}
                                                isValid={validated && userData.en_child1 && !userDataError.en_child1}
                                                onChange={(e) => handleDataChange('en_child1', e.target.value)}
                                            />
                                            {validated && userDataError.en_child1 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.en_child1}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="bn_spouse">নাম (বাংলা)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="bn_child1"
                                                value={userData.bn_child1}
                                                isInvalid={validated && !!userDataError.bn_child1}
                                                isValid={validated && userData.bn_child1 && !userDataError.bn_child1}
                                                onChange={(e) => handleDataChange('bn_child1', e.target.value)}
                                            />
                                            {validated && userDataError.bn_child1 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.bn_child1}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={3}>
                                            <Form.Group className="bg-transparent">
                                                <Form.Label className="text-dark" htmlFor='id_gender_child1'>জেন্ডার</Form.Label>
                                                <Form.Select
                                                    id="id_gender_child1"
                                                    value={userData.id_gender_child1}
                                                    isInvalid={validated && !!userDataError.id_gender_child1}
                                                    isValid={validated && userData.id_gender_child1 && !userDataError.id_gender_child1}
                                                    onChange={(e) => handleDataChange('id_gender_child1', e.target.value)}
                                                    className="selectpicker form-control"
                                                    data-style="py-0"
                                                >
                                                    <option value=''>--জেন্ডার সিলেক্ট করুন--</option>
                                                    <option value='01'>পুরুষ</option>
                                                    <option value='02'>মহিলা</option>
                                                    <option value='03'>অন্যান্য</option>
                                                </Form.Select>
                                                {validated && userDataError.id_gender_child1 && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {userDataError.id_gender_child1}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col className='my-2' md={3}>
                                            <Form.Label className="text-secondary" htmlFor="dob_child1">জন্মতারিখ</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="date"
                                                id="dob_child1"
                                                value={userData.dob_child1}
                                                isInvalid={validated && !!userDataError.dob_child1}
                                                isValid={validated && userData.dob_child1 && !userDataError.dob_child1}
                                                onChange={(e) => handleDataChange('dob_child1', e.target.value)}
                                            />
                                            {validated && userDataError.dob_child1 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.dob_child1}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="id_child1">পরিচয়পত্র নম্বর (এনআইডি/জন্মনিবন্ধন)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="id_child1"
                                                maxLength={17}
                                                value={userData.id_child1}
                                                isInvalid={validated && !!userDataError.id_child1}
                                                isValid={validated && userData.id_child1 && !userDataError.id_child1}
                                                onChange={(e) => handleDataChange('id_child1', e.target.value)}
                                            />
                                            {validated && userDataError.id_child1 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.id_child1}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2 pt-4' md={12}>
                                            <h6 className='text-center text-primary'>সন্তানের (২য়) তথ্য</h6>
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="en_child2">নাম (ইংরেজি)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="en_child2"
                                                value={userData.en_child2}
                                                isInvalid={validated && !!userDataError.en_child2}
                                                isValid={validated && userData.en_child2 && !userDataError.en_child2}
                                                onChange={(e) => handleDataChange('en_child2', e.target.value)}
                                            />
                                            {validated && userDataError.en_child2 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.en_child2}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="bn_spouse">নাম (বাংলা)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="bn_child2"
                                                value={userData.bn_child2}
                                                isInvalid={validated && !!userDataError.bn_child2}
                                                isValid={validated && userData.bn_child2 && !userDataError.bn_child2}
                                                onChange={(e) => handleDataChange('bn_child2', e.target.value)}
                                            />
                                            {validated && userDataError.bn_child2 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.bn_child2}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={3}>
                                            <Form.Group className="bg-transparent">
                                                <Form.Label className="text-dark" htmlFor='id_gender_child2'>জেন্ডার</Form.Label>
                                                <Form.Select
                                                    id="id_gender_child2"
                                                    value={userData.id_gender_child2}
                                                    isInvalid={validated && !!userDataError.id_gender_child2}
                                                    isValid={validated && userData.id_gender_child2 && !userDataError.id_gender_child2}
                                                    onChange={(e) => handleDataChange('id_gender_child2', e.target.value)}
                                                    className="selectpicker form-control"
                                                    data-style="py-0"
                                                >
                                                    <option value=''>--জেন্ডার সিলেক্ট করুন--</option>
                                                    <option value='01'>পুরুষ</option>
                                                    <option value='02'>মহিলা</option>
                                                    <option value='03'>অন্যান্য</option>
                                                </Form.Select>
                                                {validated && userDataError.id_gender_child2 && (
                                                    <Form.Control.Feedback type="invalid">
                                                        {userDataError.id_gender_child2}
                                                    </Form.Control.Feedback>
                                                )}
                                            </Form.Group>
                                        </Col>
                                        <Col className='my-2' md={3}>
                                            <Form.Label className="text-secondary" htmlFor="dob_child2">জন্মতারিখ</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="date"
                                                id="dob_child2"
                                                value={userData.dob_child2}
                                                isInvalid={validated && !!userDataError.dob_child2}
                                                isValid={validated && userData.dob_child2 && !userDataError.dob_child2}
                                                onChange={(e) => handleDataChange('dob_child2', e.target.value)}
                                            />
                                            {validated && userDataError.dob_child2 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.dob_child2}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                        <Col className='my-2' md={6}>
                                            <Form.Label className="text-secondary" htmlFor="id_child2">পরিচয়পত্র নম্বর (এনআইডি/জন্মনিবন্ধন)</Form.Label>
                                            <Form.Control
                                                className='bg-transparent text-uppercase text-dark'
                                                type="text"
                                                id="id_child2"
                                                maxLength={17}
                                                value={userData.id_child2}
                                                isInvalid={validated && !!userDataError.id_child2}
                                                isValid={validated && userData.id_child2 && !userDataError.id_child2}
                                                onChange={(e) => handleDataChange('id_child2', e.target.value)}
                                            />
                                            {validated && userDataError.id_child2 && (
                                                <Form.Control.Feedback type="invalid">
                                                    {userDataError.id_child2}
                                                </Form.Control.Feedback>
                                            )}
                                        </Col>
                                    </>}
                                </Row>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-center gap-3">
                                <Button className='flex-fill' type="reset" variant="btn btn-outline-danger">রিসেট</Button>
                                {setHide && <Button className='flex-fill' type="reset" variant="btn btn-outline-warning" onClick={() => setHide(false)}>ফিরে যান</Button>}
                                <Button className='flex-fill' type="submit" variant="btn btn-outline-success">{userData.id_passport ? "আপডেট" : "সাবমিট"}</Button>
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

export default PassportAppForm;