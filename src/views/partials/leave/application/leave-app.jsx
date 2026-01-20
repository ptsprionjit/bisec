import React, { Fragment, useEffect, useState } from 'react';
import Select from 'react-select'

import { Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';

import axiosApi from "../../../../lib/axiosApi.jsx";

import { isValid, differenceInDays, set } from 'date-fns';

import * as InputValidation from '../../input_validation'

const LeaveAppForm = ({ userData, setUserData, permissionData, status, setStatus, prevData, setUpdShow, setDataList }) => {
    const currDate = new Date();
    currDate.setHours(currDate.getUTCHours() + 12);

    const [userDataError, setUserDataError] = useState([]);

    const [validated, setValidated] = useState(false);

    const [leaveAvailed, setLeaveAvailed] = useState([]);

    const [userBnError, setUserBnError] = useState([]);

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    const [leaveType, setLeaveType] = useState([]);
    const [optionLeaveType, setOptionLeaveType] = useState([]);

    const [leaveReason, setLeaveReason] = useState([]);
    const [optionLeaveReason, setOptionLeaveReason] = useState([]);

    const [userList, setUserList] = useState([]);
    const [optionUserList, setOptionUserList] = useState([]);

    const [addressList, setAddressList] = useState([]);
    const [optionDistList, setOptionDistList] = useState([]);
    const [optionUpazilaList, setOptionUpazilaList] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        // ‍Set Bangla Error Values
        setUserBnError({
            id_type: 'ছুটির ধরণ', user_leave: 'ছুুুটি আবেদনকারী কর্মকর্তা/কর্মচারীর আইডি', user_duty: 'ছুুুটিকালীন দায়িত্বপ্রাপ্ত কর্মকর্তা/কর্মচারীর আইডি', id_reason: 'ছুটির কারণ', en_dist: 'জেলা', id_uzps: 'উপজেলা', leave_address: 'ছুটিকালীন ঠিকানা', mobile: 'মোবাইল নম্বর', start_date: 'ছুটি শুরুর তারিখ', end_date: 'ছুটি শেষ তারিখ', total_requested: 'মোট আবেদিত ছুটি', yearly_total: 'বার্ষিক সর্বোচ্চ ছুটি', total_availed: 'মোট ভোগকৃত ছুটি', message: 'বিস্তারিত কারণ'
        })

        if (form.checkValidity() === false) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const requiredFields = [
                'id_type', 'user_duty', 'id_reason', 'en_dist', 'id_uzps', 'leave_address', 'mobile', 'start_date', 'end_date', 'total_requested', 'message'
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                switch (field) {
                    case 'id_type':
                    case 'id_reason':
                    case 'id_uzps':
                    case 'mobile':
                        dataError = InputValidation.numberCheck(userData[field]);
                        break;

                    case 'total_requested':
                        dataError = userData.total_requested > (userData.yearly_total - userData.total_availed) ? 'অবশিষ্ট ছুটির চেয়ে বেশি দিন হতে পারবে না।' : false;
                        break;

                    case 'en_dist':
                        dataError = InputValidation.addressCheck(userData[field]);
                        break;

                    case 'leave_address':
                        dataError = InputValidation.banglaAddressCheck(userData[field]);
                        break;

                    case 'message':
                        dataError = userData[field] ? InputValidation.banglaAddressCheck(userData[field]) : false;
                        break;

                    case 'user_duty':
                        dataError = InputValidation.alphanumCheck(userData[field]);
                        break;

                    case 'start_date':
                    case 'end_date':
                        dataError = InputValidation.dateCheck(userData[field], userData.start_date, userData.end_date);
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
                const response = await axiosApi.post(setUpdShow && userData.id_leave ? `/leave/application/update` : `/leave/application/new`, { userData: userData });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setUserData({ id_type: '', user_leave: '', user_duty: '', id_reason: '', en_dist: '', id_uzps: '', leave_address: '', mobile: '', start_date: '', end_date: '', total_requested: 0, yearly_total: 0, total_availed: 0, message: '', });
                    setUserDataError([]);
                    setValidated(false);
                    if (setUpdShow && setDataList) {
                        setDataList((prev) => prev.map(item => item.id_leave === myData.id_leave ?
                            { id_type: myData.id_type, user_leave: myData.user_leave, user_duty: myData.user_duty, id_reason: myData.id_reason, en_dist: myData.en_dist, id_uzps: myData.id_uzps, leave_address: myData.leave_address, mobile: myData.mobile, start_date: myData.start_date, end_date: myData.end_date, total_requested: myData.total_requested, yearly_total: myData.yearly_total, total_availed: myData.total_availed, message: myData.message } : item));
                        setUpdShow(false);
                    }
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
        setUserData({ id_type: '', user_leave: '', user_duty: '', id_reason: '', en_dist: '', id_uzps: '', leave_address: '', mobile: '', start_date: '', end_date: '', total_requested: 0, yearly_total: 0, total_availed: 0, message: '', });
        setValidated(false);
        setStatus({ loading: false, success: false, error: false });
    };

    // Fetch Address List
    const fetchAddress = async () => {
        setStatus({ loading: "জেলা/উপজেলার তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/address/address-list`);
            if (response.status === 200) {
                setAddressList(response.data);
                setStatus({ loading: false, success: true, error: false });
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

    // Fetch User List
    const fetchUsers = async () => {
        setStatus({ loading: "কর্মকর্তা/কর্মচারীদের তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/user/list/summery`);
            if (response.status) {
                setStatus({ loading: false, success: true, error: false });
                setUserList(response.data.userList);
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

    // Fectch Leave Type List
    const fetchLeaveType = async () => {
        setStatus({ loading: "ছুটির ধরণের তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/leave/type/list`);
            if (response.status === 200) {
                setLeaveType(response.data.leaveType);
                setStatus({ loading: false, success: true, error: false });
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

    // Fectch Leave Reason List
    const fetchLeaveReason = async () => {
        setStatus({ loading: "ছুটির কারণের তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/leave/reason/list`);
            if (response.status === 200) {
                setLeaveReason(response.data.leaveReason);
                setStatus({ loading: false, success: true, error: false });
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

    // Fetch Availed Total
    const fetchLeaveAvailed = async () => {
        setStatus({ loading: "মোট ছুটির তথ্য খুঁজা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/leave/availed/total`, { id_type: userData.id_type });
            if (response.status === 200) {
                setLeaveAvailed(response.data.availedLeave);
                setStatus({ loading: false, success: true, error: false });
            } else {
                setLeaveAvailed([]);
                setStatus({ loading: false, success: false, error: response.data.message });
            }
        } catch (err) {
            if (err.status === 401) {
                navigate("/auth/sign-out");
            }
            setLeaveAvailed([]);
            setStatus({ loading: false, success: false, error: err.response.data.message });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    }

    // Fetch Data
    useEffect(() => {
        fetchAddress();
        fetchUsers();
        fetchLeaveType();
        fetchLeaveReason();
        fetchLeaveAvailed();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Set Total Yearly Leave & Total Availed Leave
    useEffect(() => {
        if (userData.id_type) {
            const data = {};

            // Yearly Total
            if (leaveType.length) {
                const leaveTotal = leaveType.filter(
                    item => item.id_type === userData.id_type
                );
                data.yearlyTotal = leaveTotal[0]?.total_leave || '0';
            } else {
                data.yearlyTotal = '0';
            }

            // Yearly Availed Total
            if (leaveAvailed.length) {
                const leaveAvailedTotal = leaveAvailed.filter(
                    item => item.id_type === userData.id_type
                );
                data.availedTotal = leaveAvailedTotal[0]?.total_availed || 0;
            } else {
                data.availedTotal = 0;
            }

            // Set Data
            setUserData((prev) => ({ ...prev, yearly_total: data.yearlyTotal, total_availed: data.availedTotal }));
        } else {
            setUserData((prev) => ({ ...prev, yearly_total: 0, total_availed: 0 }));
        }
    }, [userData.id_type]); // eslint-disable-line react-hooks/exhaustive-deps

    // Set Requested Total
    useEffect(() => {
        if (isValid(new Date(userData.start_date)) && isValid(new Date(userData.end_date))) {
            const dateDiff = differenceInDays(userData.end_date, userData.start_date);
            if (dateDiff < 0) {
                setUserData((prev) => ({ ...prev, total_requested: 0 }));
            } else {
                setUserData((prev) => ({ ...prev, total_requested: dateDiff + 1 }));
            }
        } else {
            setUserData((prev) => ({ ...prev, total_requested: 0 }));
        }
    }, [userData.start_date, userData.end_date]); // eslint-disable-line react-hooks/exhaustive-deps

    // Option District List
    useEffect(() => {
        if (addressList.length > 0) {
            const newOptions = addressList.map(data => ({
                value: data.en_dist,
                label: String(data.bn_dist).toLocaleUpperCase()
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionDistList(uniqueValues);
        }
    }, [addressList]); // eslint-disable-line react-hooks/exhaustive-deps

    // Option Upazila List
    useEffect(() => {
        if (addressList.length > 0) {
            const filteredData = addressList.filter(
                item => item.en_dist === userData.en_dist
            );
            const newOptions = filteredData.map(data => ({
                value: data.id_uzps,
                label: String(data.bn_uzps).toLocaleUpperCase()
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionUpazilaList(uniqueValues);
        }
    }, [userData.en_dist, addressList]); // eslint-disable-line react-hooks/exhaustive-deps

    // Option User List
    useEffect(() => {
        if (userList.length > 0) {
            const filteredData = userList.filter(
                item => item.id_user !== permissionData.id && item.id_section === permissionData.section
            );

            const newOptions = filteredData.map(data => ({
                value: data.id_user,
                label: String(data.bn_user).toLocaleUpperCase() + " (" + String(data.bn_post).toLocaleUpperCase() + ")"
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionUserList(uniqueValues);
        }
    }, [userList]); // eslint-disable-line react-hooks/exhaustive-deps

    // Option Leave Type List
    useEffect(() => {
        if (leaveType.length > 0) {
            const newOptions = leaveType.map(data => ({
                value: data.id_type,
                label: String(data.bn_type).toLocaleUpperCase()
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionLeaveType(uniqueValues);
        }
    }, [leaveType]); // eslint-disable-line react-hooks/exhaustive-deps

    // Option Reason List
    useEffect(() => {
        if (leaveReason.length > 0) {
            const newOptions = leaveReason.map(data => ({
                value: data.id_reason,
                label: String(data.bn_reason).toLocaleUpperCase()
            }));
            const uniqueValues = Array.from(
                new Map(newOptions.map(item => [item.value, item])).values()
            );
            setOptionLeaveReason(uniqueValues);
        }
    }, [leaveReason]); // eslint-disable-line react-hooks/exhaustive-deps

    // Set Previous Data
    useEffect(() => {
        if (prevData) {
            setUserData({ ...prevData });
        }
    }, [prevData]);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                        <Card className='auth-card'>
                            <Card.Header className="d-flex flex-column justify-content-center align-items-center gap-1">
                                <span className="text-center text-primary fs-4">কর্মকর্তা/কর্মচারীদের ছুটির আবেদন</span>
                                <span className="text-center text-danger fs-6">বিঃদ্রঃ ছুটি অধিকার হিসেবে দাবী করা যাবে না</span>
                                {userData.id_type && <span className="text-center text-warning fs-6">মোট ভোগকৃত ছুটিঃ {InputValidation.E2BDigit(userData.total_availed)} দিন</span>}
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="my-2" md={12}>
                                        {status.loading && <h6 className="text-center card-title w-100 text-info">{status.loading}</h6>}
                                        {status.error && <h6 className="text-center card-title w-100 text-danger">{status.error}</h6>}
                                        {status.success && <h6 className="text-center card-title w-100 text-success">{status.success}</h6>}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='id_type'>ছুটির ধরণ</Form.Label>
                                            <Select
                                                inputId="id_type"
                                                placeholder="--ধরণ সিলেক্ট করুন--"
                                                value={
                                                    optionLeaveType.find(opt => opt.value === userData.id_type) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('id_type', value.value) : handleDataChange('id_type', '')
                                                }
                                                options={optionLeaveType}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.id_type && (
                                                <p className='text-danger'>
                                                    {userDataError.id_type}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='id_reason'>ছুটির কারণ</Form.Label>
                                            <Select
                                                inputId="id_reason"
                                                placeholder="--কারণ সিলেক্ট করুন--"
                                                value={
                                                    optionLeaveReason.find(opt => opt.value === userData.id_reason) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('id_reason', value.value) : handleDataChange('id_reason', '')
                                                }
                                                options={optionLeaveReason}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.id_reason && (
                                                <p className='text-danger'>
                                                    {userDataError.id_reason}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-primary" htmlFor="total_leave">অবশিষ্ট ছুটি (সর্বোচ্চ)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="text"
                                            id="total_leave"
                                            value={InputValidation.E2BDigit(userData.yearly_total - userData.total_availed) + " দিন"}
                                            disabled={true}
                                        />
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-primary" htmlFor="start_date">ছুটি শুরুর তারিখ</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="date"
                                            id="start_date"
                                            value={userData.start_date}
                                            min={currDate.getFullYear() + "-01-01"}
                                            max={currDate.getFullYear() + "-12-31"}
                                            isInvalid={validated && !!userDataError.start_date}
                                            isValid={validated && userData.start_date && !userDataError.start_date}
                                            onChange={(e) => handleDataChange('start_date', e.target.value)}
                                        />
                                        {validated && userDataError.start_date && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.start_date}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-primary" htmlFor="end_date">ছুটির শেষ তারিখ</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="date"
                                            id="end_date"
                                            min={currDate.getFullYear() + "-01-01"}
                                            max={currDate.getFullYear() + "-12-31"}
                                            value={userData.end_date}
                                            isInvalid={validated && !!userDataError.end_date}
                                            isValid={validated && userData.end_date && !userDataError.end_date}
                                            onChange={(e) => handleDataChange('end_date', e.target.value)}
                                        />
                                        {validated && userDataError.end_date && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.end_date}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={4}>
                                        <Form.Label className="text-primary" htmlFor="total_requested">আবেদনকৃত মোট ছুটি</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="text"
                                            id="total_requested"
                                            value={InputValidation.E2BDigit(userData.total_requested) + " দিন"}
                                            disabled={true}
                                            isInvalid={validated && !!userDataError.total_requested}
                                            isValid={validated && userData.total_requested && !userDataError.total_requested}
                                        />
                                        {validated && userDataError.total_requested && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.total_requested}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={12}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='user_duty'>দায়িত্ব প্রহণকারী কর্মকর্তা/কর্মচারী</Form.Label>
                                            <Select
                                                inputId="user_duty"
                                                placeholder="--দায়িত্ব প্রহণকারীর নাম সিলেক্ট করুন--"
                                                value={
                                                    optionUserList.find(opt => opt.value === userData.user_duty) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('user_duty', value.value) : handleDataChange('user_duty', '')
                                                }
                                                options={optionUserList}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.user_duty && (
                                                <p className='text-danger'>
                                                    {userDataError.user_duty}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='en_dist'>জেলা</Form.Label>
                                            <Select
                                                inputId="en_dist"
                                                placeholder="--জেলা সিলেক্ট করুন--"
                                                value={
                                                    optionDistList.find(opt => opt.value === userData.en_dist) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('en_dist', value.value) : handleDataChange('en_dist', '')
                                                }
                                                options={optionDistList}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.en_dist && (
                                                <p className='text-danger'>
                                                    {userDataError.en_dist}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Group className="bg-transparent">
                                            <Form.Label className="text-primary" htmlFor='id_uzps'>উপজেলা</Form.Label>
                                            <Select
                                                inputId="id_uzps"
                                                placeholder="--উপজেলা সিলেক্ট করুন--"
                                                value={
                                                    optionUpazilaList.find(opt => opt.value === userData.id_uzps) || null
                                                }
                                                onChange={(value) =>
                                                    value ? handleDataChange('id_uzps', value.value) : handleDataChange('id_uzps', '')
                                                }
                                                options={optionUpazilaList}
                                                isClearable={true}
                                                isSearchable={true}
                                            />
                                            {validated && userDataError.id_uzps && (
                                                <p className='text-danger'>
                                                    {userDataError.id_uzps}
                                                </p>
                                            )}
                                        </Form.Group>
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-primary" htmlFor="leave_address">ছুটিকালীন ঠিকানা (বাড়ি, রাস্তা, গ্রাম, ডাকঘর)</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-uppercase'
                                            type="text"
                                            id="leave_address"
                                            value={userData.leave_address}
                                            isInvalid={validated && !!userDataError.leave_address}
                                            isValid={validated && userData.leave_address && !userDataError.leave_address}
                                            onChange={(e) => handleDataChange('leave_address', e.target.value)}
                                        />
                                        {validated && userDataError.leave_address && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.leave_address}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className='my-2' md={6}>
                                        <Form.Label className="text-primary" htmlFor="mobile">যোগাযোগের মোবাইল</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-lowercase'
                                            type="text"
                                            // minLength={11}
                                            maxLength={11}
                                            id="mobile"
                                            value={userData.mobile}
                                            isInvalid={validated && !!userDataError.mobile}
                                            isValid={validated && userData.mobile && !userDataError.mobile}
                                            onChange={(e) => handleDataChange('mobile', e.target.value)}
                                        />
                                        {validated && userDataError.mobile && (
                                            <Form.Control.Feedback type="invalid">
                                                {userDataError.mobile}
                                            </Form.Control.Feedback>
                                        )}
                                    </Col>
                                    <Col className="my-2" md={12}>
                                        <Form.Label className="text-primary" htmlFor="message">বিস্তারিত বিবরণ</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={4}
                                            className="bg-transparent"
                                            id="message"
                                            placeholder='বিস্তারিত বিবরণ লিখুন'
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
                                {setUpdShow && <Button className='flex-fill' variant="btn btn-outline-warning" onClick={() => setUpdShow(false)}>ফিরে যান</Button>}
                                <Button className='flex-fill' type="submit" variant="btn btn-outline-success">{setUpdShow ? "আপডেট" : "সাবমিট"}</Button>
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

export default LeaveAppForm;