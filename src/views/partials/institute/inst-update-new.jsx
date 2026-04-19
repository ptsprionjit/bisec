import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Modal, Card, Table } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom';

import { FadeLoader } from "react-spinners";
import * as InputValidation from '../input_validation';

import InstShiftsApp from './application/shifts-app';
import InstSectionsApp from './application/sections-app';
import InstGroupsApp from './application/groups-app';
import InstSubjectsApp from './application/subjects-app';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const InstUpdateNew = () => {
    const { permissionData, loading } = useAuthProvider();

    const navigate = useNavigate();

    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    const [userData, setUserData] = useState({
        id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '',
    });

    const [listGroupSubject, setListGroupSubject] = useState(false);
    const [currData, setCurrData] = useState(false);

    const [groupList, setGroupList] = useState(false);
    const [subjectList, setSubjectList] = useState(false);
    const [listShift, setListShift] = useState(false);

    const [showShiftApp, setShowShiftApp] = useState(false);
    const [showSectionApp, setShowSectionApp] = useState(false);
    const [showGroupApp, setShowGroupApp] = useState(false);
    const [showSubjectApp, setShowSubjectApp] = useState(false);

    const shiftMap = {
        '09': listGroupSubject.id_shift_06,
        '03': listGroupSubject.id_shift_08,
        '05': listGroupSubject.id_shift_09,
        '07': listGroupSubject.id_shift_11
    };

    const sectionMap = {
        '09': listGroupSubject.id_section_06,
        '03': listGroupSubject.id_section_08,
        '05': listGroupSubject.id_section_09,
        '07': listGroupSubject.id_section_11
    };

    // Fetch Group & Subject Data List
    const fetchDataList = async () => {
        setStatus({ loading: "তথ্য সংগ্রহ করা হচ্ছে... অপেক্ষা করুন...", success: false, error: false });
        try {
            const response = await axiosApi.post(`/institute/data/list`);
            if (response.status === 200) {
                setStatus({ loading: false, success: true, error: false });
                setListGroupSubject(response.data.listGroupSubject);
                setGroupList(response.data.listGroup);
                setSubjectList(response.data.listSubject);
                setListShift(response.data.listShift);
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

    // Check Permission data
    useEffect(() => {
        if (loading) return;

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        } else {
            if (!(permissionData.type === '13' || permissionData.role === '17')) {
                navigate("errors/error403", { replace: true });
            } else {
                fetchDataList();
            }
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    // Map Exam Group Based On Institute Status
    useEffect(() => {
        if (listGroupSubject?.id_status) {
            const mapData = {
                '11': { 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03', },
                '12': { 'id_group_09': '05', 'id_sub_09': '05' },
                '13': { 'id_group_11': '07', 'id_sub_11': '07' },
                '14': { 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03' },
                '17': { 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05' },
                '19': { 'id_group_09': '05', 'id_group_11': '07', 'id_sub_09': '05', 'id_sub_11': '07' },
                '20': { 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_group_11': '07', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05', 'id_sub_11': '07' },
                '26': { 'id_group_11': '07', 'id_sub_11': '07' },
            };
            const currMap = mapData[listGroupSubject.id_status];
            setCurrData(currMap);
        }
    }, [listGroupSubject]); // eslint-disable-line react-hooks/exhaustive-deps

    // Handle Shift Application
    const handleShiftApp = (exam_code, bn_exam, app_name) => {
        setUserData({ id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '', id_exam: exam_code, bn_exam: bn_exam });
        setShowShiftApp(true);
    }

    // Handle Section Application
    const handleSectionApp = (exam_code, bn_exam, app_name) => {
        setUserData({ id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '', id_exam: exam_code, bn_exam: bn_exam });
        setShowSectionApp(true);
    }

    // Handle Group Application
    const handleGroupApp = (exam_code, bn_exam, app_name) => {
        setUserData({ id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '', id_exam: exam_code, bn_exam: bn_exam });
        setShowGroupApp(true);
    }

    // Handle Subject Application
    const handleSubjectApp = (exam_code, bn_exam, app_name) => {
        setUserData({ id_shift_06: [], id_section_06: [], id_shift_08: [], id_section_08: [], id_shift_09: [], id_section_09: [], id_shift_11: [], id_section_11: [], id_group_06: [], id_sub_06: [], id_group_08: [], id_sub_08: [], id_group_09: [], id_sub_09: [], id_group_11: [], id_sub_11: [], id_ref_estb: '', id_ref_clst: '', id_ref_recog: '', id_ref_grp: '', id_ref_sub: '', id_section: '', message: '', id_exam: exam_code, bn_exam: bn_exam });
        setShowSubjectApp(true);
    }

    if (status.loading || !currData) return (
        <Fragment>
            <Row className="bg-transparent m-0 p-0">
                <Col md={12} className="d-flex justify-content-center align-items-center" style={{ height: "95dvh" }} >
                    <FadeLoader
                        color="#000000"
                        loading={true}
                    />
                </Col>
            </Row>
        </Fragment>
    )

    if (permissionData.type === '13') return (
        <Fragment>
            <Row className='m-0 p-0'>
                <Col md={12} className='m-0 p-0'>
                    <Card className='m-0 p-3'>
                        <Card.Header className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
                            <h4 className={"card-title text-center text-primary pb-2"}>অনুমোদিত শিফট, শাখা, বিভাগ ও বিষয়ের তালিকা</h4>
                            {status.error && <h6 className={"text-center text-danger pb-2"}>{status.error}</h6>}
                            {status.success && <h6 className={"text-center text-success pb-2"}>{status.success}</h6>}
                            {status.loading && <h6 className={"text-center text-primary pb-2"}>{status.loading}</h6>}
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            <Col className='m-2' md={12}>
                                <Row className='justify-content-center'>
                                    <Col className='m-2 p-2' md={10}>
                                        <h6 className="text-center text-secondary py-2 text-decoration-underline">অনুমোদিত শিফট, শাখা ও বিভাগসমূহ</h6>
                                        <Table className='m-0 p-0 table table-bordered border-dark'>
                                            <tbody>
                                                {
                                                    Object.entries(currData).map(([en_exm, id_exm], idx_exm) => {
                                                        const tempGroupList = listGroupSubject[en_exm]?.split(',') || [];

                                                        return tempGroupList.map((id_grp, idx_grp) => {
                                                            const matchedGroup = groupList.find(
                                                                item => item.id_group === String(id_grp).trim() && item.id_exam === String(id_exm).trim()
                                                            );

                                                            if (!matchedGroup) return null;

                                                            return (
                                                                <>
                                                                    {idx_exm === 0 && <tr key={`${idx_exm}-${idx_grp}-0`} className="m-0 p-0">
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            ক্রমিক নম্বর
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            পরীক্ষার নাম
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            শিফট
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            শাখা
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            বিভাগ
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            নতুন আবেদন
                                                                        </td>
                                                                    </tr>}
                                                                    <tr key={`${idx_exm}-${idx_grp}`} className="m-0 p-0 ">
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            {InputValidation.E2BDigit(String(idx_exm + 1).padStart(2, '0'))}
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            {matchedGroup.bn_exam}
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            {shiftMap[id_exm]?.split(',').map((id_shift) => {
                                                                                const match = listShift.find(item => item.id_shift === id_shift);
                                                                                return match?.bn_shift || '';
                                                                            })}
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            {sectionMap[id_exm]}
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                                            {matchedGroup.bn_group}
                                                                        </td>
                                                                        <td className='m-0 p-2 text-center border border-1 border-dark d-flex justify-content-evenly'>
                                                                            <Button onClick={() => handleShiftApp(id_exm, matchedGroup.bn_exam)} className={`m-0 p-1`} variant="btn btn-outline-primary">
                                                                                নতুন শিফট
                                                                            </Button>
                                                                            <Button onClick={() => handleSectionApp(id_exm, matchedGroup.bn_exam)} className={`m-0 p-1`} variant="btn btn-outline-success">
                                                                                নতুন শাখা
                                                                            </Button>
                                                                            <Button onClick={() => handleGroupApp(id_exm, matchedGroup.bn_exam)} className={`m-0 p-1`} variant="btn btn-outline-secondary">
                                                                                নতুন বিভাগ
                                                                            </Button>
                                                                            <Button onClick={() => handleSubjectApp(id_exm, matchedGroup.bn_exam)} className={`m-0 p-1`} variant="btn btn-outline-danger">
                                                                                নতুন বিষয়
                                                                            </Button>
                                                                        </td>
                                                                    </tr>
                                                                </>
                                                            );
                                                        });
                                                    })
                                                }
                                            </tbody>
                                        </Table>
                                    </Col>
                                    <Col className='m-2 p-2' md={10}>
                                        <h6 className="text-center text-secondary py-2 text-decoration-underline">অনুমোদিত বিষয়সমূহ</h6>
                                        {
                                            Object.entries(currData).map(([en_exm, id_exm], idx_exm) => {
                                                const tempGroupList = listGroupSubject[en_exm]?.split(',') || [];

                                                return tempGroupList.map((id_sub, idx_sub) => {
                                                    const matchedSubject = subjectList.find(
                                                        item => item.sub_code === String(id_sub).trim() && item.id_exam === String(id_exm).trim()
                                                    );

                                                    if (!matchedSubject) return null;

                                                    return (
                                                        <>
                                                            {idx_sub === 0 && <p key={`${idx_exm}-${idx_sub}-0`} className="m-0 p-2 text-left text-decoration-underline text-danger">
                                                                {InputValidation.E2BDigit(String(idx_exm - 2).padStart(2, '0'))}: {matchedSubject.bn_exam}
                                                            </p>}
                                                            <span key={`${idx_exm}-${idx_sub}`} className="m-0 p-2 text-left text-dark">
                                                                {InputValidation.E2BDigit(String(idx_sub + 1).padStart(2, '0'))}: {matchedSubject.bn_full_sub} ({InputValidation.E2BDigit(matchedSubject.sub_code)}),
                                                            </span>
                                                        </>
                                                    );
                                                });
                                            })
                                        }
                                    </Col>
                                </Row>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {showShiftApp && (
                <Modal
                    show={showShiftApp}
                    onHide={() => setShowShiftApp(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <InstShiftsApp
                            userData={userData}
                            setUserData={setUserData}
                            groupList={groupList}
                            subjectList={subjectList}
                            listGroupSubject={listGroupSubject}
                            listShift={listShift}
                            status={status}
                            setStatus={setStatus}
                            setShow={setShowShiftApp}
                        />
                    </Modal.Body>
                </Modal>
            )}
            {showSectionApp && (
                <Modal
                    show={showSectionApp}
                    onHide={() => setShowSectionApp(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <InstSectionsApp
                            userData={userData}
                            setUserData={setUserData}
                            groupList={groupList}
                            subjectList={subjectList}
                            listGroupSubject={listGroupSubject}
                            listShift={listShift}
                            status={status}
                            setStatus={setStatus}
                            setShow={setShowSectionApp}
                        />
                    </Modal.Body>
                </Modal>
            )}
            {showGroupApp && (
                <Modal
                    show={showGroupApp}
                    onHide={() => setShowGroupApp(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <InstGroupsApp
                            userData={userData}
                            setUserData={setUserData}
                            groupList={groupList}
                            subjectList={subjectList}
                            listGroupSubject={listGroupSubject}
                            listShift={listShift}
                            status={status}
                            setStatus={setStatus}
                            setShow={setShowGroupApp}
                        />
                    </Modal.Body>
                </Modal>
            )}
            {showSubjectApp && (
                <Modal
                    show={showSubjectApp}
                    onHide={() => setShowSubjectApp(false)}
                    backdrop="static"
                    keyboard={false}
                    className='modal-xl m-0 p-0'
                >
                    <Modal.Header closeButton></Modal.Header>
                    <Modal.Body className='m-0 p-0'>
                        <InstSubjectsApp
                            userData={userData}
                            setUserData={setUserData}
                            groupList={groupList}
                            subjectList={subjectList}
                            listGroupSubject={listGroupSubject}
                            listShift={listShift}
                            status={status}
                            setStatus={setStatus}
                            setShow={setShowSubjectApp}
                        />
                    </Modal.Body>
                </Modal>
            )}
        </Fragment>
    )
}

export default InstUpdateNew;