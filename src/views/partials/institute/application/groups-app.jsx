import React, { Fragment, useState, useEffect } from 'react';

import { Row, Col, Button, Form, Card, Modal } from 'react-bootstrap';

import axiosApi from "../../../../lib/axiosApi.jsx";

import { FaCircleLeft, FaCircleRight } from "react-icons/fa6";

import * as InputValidation from '../../input_validation.js'

const InstGroupsApp = ({ userData, setUserData, groupList, subjectList, listGroupSubject, listShift, status, setStatus, setShow }) => {
    const [userDataError, setUserDataError] = useState([]);

    const [selectedData, setSelectedData] = useState(false);

    const [exmGroup, setExmGroup] = useState(null);
    const [exmSubject, setExmSubject] = useState(null);
    const [exmShift, setExmShift] = useState([]);
    const [fieldGroupSub, setFieldGroupSub] = useState([]);

    const [isResetClicked, setIsresetClicked] = useState(false);

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    useEffect(() => {
        if (!userData?.id_exam || !groupList?.length || !subjectList?.length) {
            setStatus({ loading: false, success: false, error: "পরীক্ষা সিলেক্ট করতে হবে!" });
            return;
        }

        const grpSubMap = {
            '03': { 'group': 'id_group_08', 'subject': 'id_sub_08', 'shifts': 'id_shift_08', 'section': 'id_section_08' },
            '04': { 'group': 'id_group_08', 'subject': 'id_sub_08', 'shifts': 'id_shift_08', 'section': 'id_section_08' },
            '05': { 'group': 'id_group_09', 'subject': 'id_sub_09', 'shifts': 'id_shift_09', 'section': 'id_section_09' },
            '06': { 'group': 'id_group_09', 'subject': 'id_sub_09', 'shifts': 'id_shift_09', 'section': 'id_section_09' },
            '07': { 'group': 'id_group_11', 'subject': 'id_sub_11', 'shifts': 'id_shift_11', 'section': 'id_section_11' },
            '08': { 'group': 'id_group_11', 'subject': 'id_sub_11', 'shifts': 'id_shift_11', 'section': 'id_section_11' },
            '09': { 'group': 'id_group_06', 'subject': 'id_sub_06', 'shifts': 'id_shift_06', 'section': 'id_section_06' },
            '10': { 'group': 'id_group_06', 'subject': 'id_sub_06', 'shifts': 'id_shift_06', 'section': 'id_section_06' },
        }

        const groupSubExm = grpSubMap[userData.id_exam];

        if (!groupSubExm) {
            setStatus({ loading: false, success: false, error: "কোন বিভাগ বা বিষয় নেই" });
            return;
        }

        setFieldGroupSub(groupSubExm);

        const groupAuth = listGroupSubject[groupSubExm.group];
        const subAuth = listGroupSubject[groupSubExm.subject];

        const groupMapCombined = {
            '04': ['01', '02', '04'],
            '05': ['01', '03', '05'],
            '06': ['02', '03', '06'],
            '07': ['01', '02', '03', '04', '05', '06', '07'],
        }

        const groupMap = groupMapCombined[groupAuth] || [];

        // Set Exam Group
        const filteredGroup = groupList.filter(item => item.id_exam === userData.id_exam && !groupAuth.includes(item.id_group) && !groupMap.includes(item.id_group) && !userData[groupSubExm.group].includes(item.id_exam));
        const filteredSubject = subjectList.filter(item => item.id_exam === userData.id_exam && !subAuth.includes(item.sub_code) && !userData[groupSubExm.subject].includes(item.sub_code));

        const filteredShift = listShift.filter((item) => !(listGroupSubject[groupSubExm.shifts].includes(item.id_shift) || userData[groupSubExm.shifts].includes(item.id_shift)));

        const groupOptions = filteredGroup.map(data => (data.id_group));
        const subjectOptions = filteredSubject.map(data => (data.sub_code));

        // (groupOptions.length === 0 && subjectOptions.length === 0) ? setIsGroupSubEmpty(true) : setIsGroupSubEmpty(false);

        setExmGroup(groupOptions);
        setExmSubject(subjectOptions);
        setExmShift(filteredShift);

        // }, [isGroupSubEmpty, groupList, subjectList]); // eslint-disable-line react-hooks/exhaustive-deps
    }, [groupList, subjectList, isResetClicked]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleSubmit = async (event) => {
        event.preventDefault();
        let isValidData = true;
        setUserDataError([]);
        setStatus({ loading: false, success: false, error: false });
        const newErrors = {}; // Collect errors in one place

        if (!userData[fieldGroupSub.shifts].length && !userData[fieldGroupSub.section].length && !userData[fieldGroupSub.group].length && !userData[fieldGroupSub.subject].length) {
            setStatus({ loading: false, success: false, error: "কমপক্ষে একটি বিভাগ সিলেক্ট করতে হবে!" });
            isValidData = false;
        }

        if (isValidData) {
            const requiredFields = [
                fieldGroupSub.shifts, fieldGroupSub.section, fieldGroupSub.group, fieldGroupSub.subject,
            ];

            requiredFields.forEach(field => {
                let dataError = false;

                if (userData[field]?.length) {
                    userData[field].forEach(subField => {
                        dataError = field.includes('section') ? InputValidation.alphanumCheck(subField.trim()) : InputValidation.numberCheck(subField.trim());

                        if (dataError) {
                            newErrors[field] = dataError;
                            isValidData = false;
                        }
                    });
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
                const response = await axiosApi.post(`/institute/update/new`, { userData: { id_application: userData.id_application || false, [fieldGroupSub.shifts]: userData[fieldGroupSub.shifts], [fieldGroupSub.section]: userData[fieldGroupSub.section], [fieldGroupSub.group]: userData[fieldGroupSub.group], [fieldGroupSub.subject]: userData[fieldGroupSub.subject] } });
                if (response.status === 200) {
                    setStatus({ loading: false, success: response.data.message, error: false });
                    setUserDataError([]);
                    setUserData((prev) => ({ ...prev, id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '' }));
                    alert(response.data.message);
                    setShow ? setShow(false) : '';
                } else {
                    setStatus({ loading: false, success: false, error: response.data.message });
                    setUserDataError(response.data.errors);
                }
            } catch (err) {
                if (err.status === 401) {
                    navigate("/auth/sign-out");
                }
                setUserDataError(err.response.data.errors);
                setStatus({ loading: false, success: false, error: err.response.data.message });
            } finally {
                setStatus((prev) => ({ ...prev, loading: false }));
            }
        }
    };

    // Handle Insert Data for Group & Subject
    const handleInsert = (field, data) => {
        if (String(field) !== String(data.field)) {
            setSelectedData(false);
            return;
        }

        if (!data?.value || userData[field].includes(data.value)) {
            setSelectedData(false);
            return;
        }


        setUserData(prev => ({
            ...prev,
            [field]: [...prev[field], data.value],
        }));

        let filteredList = [];

        if (String(field).includes('group')) {
            filteredList = exmGroup.filter(item => item !== data.value);
            setExmGroup(filteredList);
        } else if (String(field).includes('sub')) {
            filteredList = exmSubject.filter(item => item !== data.value);
            setExmSubject(filteredList);
        } else if (String(field).includes('shift')) {
            filteredList = exmShift.filter(item => item.id_shift !== data.value);
            setExmShift(filteredList);
        } else {
            setUserData((prev) => ({ ...prev, id_section: '' }));
        }

        setSelectedData(false);
    }

    // Handle Remove Data for Group & Subject
    const handleRemove = (field, data) => {
        if (field !== data.field) {
            setSelectedData(false);
            return;
        }

        if (!data?.value) return;

        setUserData(prev => ({
            ...prev,
            [field]: prev[field].filter(item => item !== data.value),
        }));

        if (String(field).includes('group')) {
            const groupData = exmGroup;
            groupData.push(data.value);
            setExmGroup(groupData);
        } else if (String(field).includes('sub')) {
            const subjectData = exmSubject;
            subjectData.push(data.value);
            setExmSubject(subjectData);
        } else if (String(field).includes('shift')) {
            const shiftRemoved = listShift.filter((item) => item.id_shift === data.value);
            const shiftData = exmShift;
            shiftData.push(shiftRemoved[0]);
            setExmShift(shiftData);
        } else {

        }

        setSelectedData(false);
    }

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setUserDataError([]);
        setUserData((prev) => ({ ...prev, id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '', }));
        setStatus({ loading: false, success: false, error: false });
        setIsresetClicked(!isResetClicked);
    };

    return (
        <Fragment>
            <Row className='d-flex justify-content-center align-items-center m-0 p-0'>
                <Col md={12}>
                    <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                        <Card className='auth-card'>
                            <Card.Header className="d-flex flex-column justify-content-center align-items-center gap-1">
                                <span className="text-center text-primary fs-4">প্রতিষ্ঠানের নতুন শিফট খোলার আবেদন</span>
                                <span className="text-center text-danger fs-6">পরীক্ষার নামঃ {userData.bn_exam}</span>
                            </Card.Header>
                            <Card.Body>
                                <Row>
                                    <Col className="mb-2" md={12}>
                                        {status.loading && <h6 className="text-center text-info">{status.loading}</h6>}
                                        {status.error && <h6 className="text-center text-danger">{status.error}</h6>}
                                        {status.success && <h6 className="text-center text-success">{status.success}</h6>}
                                    </Col>
                                    {/* New Shift */}
                                    {/* <Col className='m-0 p-0 py-3' md={12}>
                                        <h6 className="text-center p-2 m-1 bg-info text-white rounded rounded-3">নতুন শিফটের আবেদন</h6>
                                        {userDataError[fieldGroupSub.shifts] && <small className='text-center py-2 w-100 text-dnager'>{userDataError[fieldGroupSub.shifts]}</small>}
                                    </Col>
                                    <Col className='m-0 p-0 py-2' md={5}>
                                        <h6 className="text-center pb-1 mb-1 border-bottom border-dark">নতুন শিফটসমূহ</h6>
                                        {exmShift.map((item, idx) => {
                                            return (
                                                <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.shifts, value: item.id_shift })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {item.bn_shift}</Button>
                                            )
                                        })}
                                    </Col>
                                    <Col className='m-0 p-0 text-center align-content-center mt-5' md={2}>
                                        <FaCircleLeft title={'বাতিল করুন'} onClick={() => handleRemove(fieldGroupSub.shifts, selectedData)} className='p-2 m-0' size={48} color="#c50000" />
                                        <FaCircleRight title={'যোগ করুন'} onClick={() => handleInsert(fieldGroupSub.shifts, selectedData)} className='p-2 m-0' size={48} color="#198754" />
                                    </Col>
                                    <Col className='m-0 p-0 py-2' md={5}>
                                        <h6 className="text-center text-success pb-1 mb-1 border-bottom border-dark">সিলেক্টেড শিফটসমূহ</h6>
                                        {userData[fieldGroupSub.shifts] && userData[fieldGroupSub.shifts].map((data, idx) => {
                                            const selectedShift = listShift.filter((item) => item.id_shift === data);
                                            return (
                                                <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.shifts, value: selectedShift[0].id_shift })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {selectedShift[0].bn_shift}</Button>
                                            )
                                        })}
                                    </Col> */}
                                    {/* New Section */}
                                    {/* <Col className='m-0 p-0 py-3' md={12}>
                                        <h6 className="text-center p-2 m-1 w-100 bg-primary text-white rounded rounded-3">নতুন শাখার আবেদন</h6>
                                        {userDataError[fieldGroupSub.section] && <small className='text-center py-2 w-100 text-dnager'>{userDataError[fieldGroupSub.section]}</small>}
                                    </Col>
                                    <Col className='m-0 p-0 py-2' md={5}>
                                        <Form.Label className="text-secondary" htmlFor="id_section">নতুন শাখা</Form.Label>
                                        <Form.Control
                                            className='bg-transparent text-dark'
                                            type="text"
                                            id="id_section"
                                            value={userData.id_section}
                                            onChange={(e) => {
                                                setUserData((prev) => ({ ...prev, id_section: String(e.target.value).toUpperCase() }));
                                                setSelectedData({ field: fieldGroupSub.section, value: String(e.target.value).toUpperCase() })
                                            }}
                                        />
                                    </Col>
                                    <Col className='m-0 p-0 text-center align-content-center mt-5' md={2}>
                                        <FaCircleLeft title={'বাতিল করুন'} onClick={() => handleRemove(fieldGroupSub.section, selectedData)} className='p-2 m-0' size={48} color="#c50000" />
                                        <FaCircleRight title={'যোগ করুন'} onClick={() => handleInsert(fieldGroupSub.section, selectedData)} className='p-2 m-0' size={48} color="#198754" />
                                    </Col>
                                    <Col className='m-0 p-0 py-2' md={5}>
                                        <h6 className="text-center text-success pb-1 mb-1 border-bottom border-dark">সিলেক্টেড শাখাসমূহ</h6>
                                        {userData[fieldGroupSub.section] && userData[fieldGroupSub.section].map((data, idx) => {
                                            return (
                                                <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.section, value: data })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {data}</Button>
                                            )
                                        })}
                                    </Col> */}
                                    {/* New Group */}
                                    {exmGroup && <>
                                        <Col className='m-0 p-0 py-3' md={12}>
                                            {/* <h6 className="text-center p-2 m-1 w-100 bg-secondary text-white rounded rounded-3">নতুন বিভাগের আবেদন</h6> */}
                                            {userDataError[fieldGroupSub.group] && <small className='text-center py-2 w-100 text-dnager'>{userDataError[fieldGroupSub.group]}</small>}
                                        </Col>
                                        <Col className='m-0 p-0 py-2' md={5}>
                                            <h6 className="text-center pb-1 mb-1 border-bottom border-dark">নতুন বিভাগসমূহ</h6>
                                            {exmGroup.map((data, idx) => {
                                                const availableData = groupList.filter((item) => item.id_group === data);
                                                if (availableData?.length) return (
                                                    <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.group, value: data })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {availableData[0].bn_group}</Button>
                                                )
                                            })}
                                        </Col>
                                        <Col className='m-0 p-0 text-center align-content-center mt-5' md={2}>
                                            <FaCircleLeft title={'বাতিল করুন'} onClick={() => handleRemove(fieldGroupSub.group, selectedData)} className='p-2 m-0' size={48} color="#c50000" />
                                            <FaCircleRight title={'যোগ করুন'} onClick={() => handleInsert(fieldGroupSub.group, selectedData)} className='p-2 m-0' size={48} color="#198754" />
                                        </Col>
                                        <Col className='m-0 p-0 py-2' md={5}>
                                            <h6 className="text-center text-success pb-1 mb-1 border-bottom border-dark">সিলেক্টেড বিভাগসমূহ</h6>
                                            {userData[fieldGroupSub.group].map((data, idx) => {
                                                const availableData = groupList.filter((item) => item.id_group === data);
                                                if (availableData?.length) return (
                                                    <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.group, value: data })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {availableData[0]?.bn_group}</Button>
                                                )
                                            })}
                                        </Col>
                                    </>}
                                    {/* New Subject */}
                                    {/* {exmSubject && <>
                                        <Col className='m-0 p-0 py-3' md={12}>
                                            <h6 className="text-center p-2 m-1 w-100 bg-dark text-white rounded rounded-3">নতুন বিষয়ের আবেদন</h6>
                                            {userDataError[fieldGroupSub.subject] && <small className='text-center py-2 w-100 text-dnager'>{userDataError[fieldGroupSub.subject]}</small>}
                                        </Col>
                                        <Col className='m-0 p-0' md={5}>
                                            <h6 className="text-center pb-1 mb-1 border-bottom border-dark">নতুন বিষয়সমূহ</h6>
                                            {exmSubject.map((data, idx) => {
                                                const availableData = subjectList.filter((item) => item.sub_code === data);
                                                if (availableData?.length) return (
                                                    <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.subject, value: data })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}. {availableData[0]?.bn_full_sub}</Button>
                                                )
                                            })}
                                        </Col>
                                        <Col className='m-0 p-0 text-center align-content-center mt-5' md={2}>
                                            <FaCircleLeft title={'বাতিল করুন'} onClick={() => handleRemove(fieldGroupSub.subject, selectedData)} className='p-2 m-0' size={48} color="#c50000" />
                                            <FaCircleRight title={'যোগ করুন'} onClick={() => handleInsert(fieldGroupSub.subject, selectedData)} className='p-2 m-0' size={48} color="#198754" />
                                        </Col>
                                        <Col className='m-0 p-0' md={5}>
                                            <h6 className="text-center text-success pb-1 mb-1 border-bottom border-dark">সিলেক্টেড বিষয়সমূহ</h6>
                                            {userData[fieldGroupSub.subject].map((data, idx) => {
                                                const availableData = subjectList.filter((item) => item.sub_code === data);
                                                if (availableData?.length) return (
                                                    <Button key={idx} onClick={() => setSelectedData({ field: fieldGroupSub.subject, value: data })} variant='btn btn-outline-secondary' className="m-1 p-1">{InputValidation.E2BDigit(String(idx + 1).padStart(2, '0'))}.  {availableData[0]?.bn_full_sub}</Button>
                                                )
                                            })}
                                        </Col>
                                    </>} */}
                                </Row>
                            </Card.Body>
                            <Card.Footer className="d-flex justify-content-center gap-3">
                                <Button className='flex-fill' type="reset" variant="btn btn-outline-danger">রিসেট</Button>
                                {setShow && <Button className='flex-fill' type="reset" variant="btn btn-outline-warning" onClick={() => setShow(false)}>ফিরে যান</Button>}
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
                    <Modal.Title>বিষয়/বিভাগের তথ্যগুলো সঠিকভাবে পূরণ করতে হবে</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-danger text-center'>{status.error}</p>
                    {Object.entries(userDataError).map(([field, error]) => (
                        <i className='text-danger' key={field}>{userDataError[field]}, </i>
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

export default InstGroupsApp;