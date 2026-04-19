import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Card, Table, ListGroup } from 'react-bootstrap'

import { FadeLoader } from "react-spinners";
import * as InputValidation from '../../input_validation';

import { handlePrint } from '../../handlers/print';

const InstituteUpdatePrint = ({ listGroupSubject, applicationData, groupList, subjectList, listShift, setShow }) => {

    if (!listGroupSubject || !applicationData || !groupList || !subjectList) return;

    const printRef = useRef();

    const [currData, setCurrData] = useState(false);
    const [currDataShow, setCurrDataShow] = useState(false);

    // Map Exam Group Based On Institute Status
    useEffect(() => {
        if (listGroupSubject?.id_status) {
            const mapData = {
                '11': { 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03' },
                '12': { 'id_group_09': '05', 'id_sub_09': '05' },
                '13': { 'id_group_11': '07', 'id_sub_11': '07' },
                '14': { 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03' },
                '17': { 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05' },
                '19': { 'id_group_09': '05', 'id_group_11': '07', 'id_sub_09': '05', 'id_sub_11': '07' },
                '20': { 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_group_11': '07', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05', 'id_sub_11': '07' },
                '26': { 'id_group_11': '07', 'id_sub_11': '07' },
            };

            // const mapData = {
            //     '11': { 'id_shift_06': '09', 'id_shift_08': '03', 'id_section_06': '09', 'id_section_08': '03', 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03' },
            //     '12': { 'id_shift_09': '05', 'id_section_09': '05', 'id_group_09': '05', 'id_sub_09': '05' },
            //     '13': { 'id_shift_11': '07', 'id_section_11': '07', 'id_group_11': '07', 'id_sub_11': '07' },
            //     '14': { 'id_shift_06': '09', 'id_shift_08': '03', 'id_section_06': '09', 'id_section_08': '03', 'id_group_06': '09', 'id_group_08': '03', 'id_sub_06': '09', 'id_sub_08': '03' },
            //     '17': { 'id_shift_06': '09', 'id_shift_08': '03', 'id_shift_09': '05', 'id_section_06': '09', 'id_section_08': '03', 'id_section_09': '05', 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05' },
            //     '19': { 'id_shift_09': '05', 'id_shift_11': '07', 'id_section_09': '05', 'id_section_11': '07', 'id_group_09': '05', 'id_group_11': '07', 'id_sub_09': '05', 'id_sub_11': '07' },
            //     '20': { 'id_shift_06': '09', 'id_shift_08': '03', 'id_shift_09': '05', 'id_shift_11': '07', 'id_section_06': '09', 'id_section_08': '03', 'id_section_09': '05', 'id_section_11': '07', 'id_group_06': '09', 'id_group_08': '03', 'id_group_09': '05', 'id_group_11': '07', 'id_sub_06': '09', 'id_sub_08': '03', 'id_sub_09': '05', 'id_sub_11': '07' },
            //     '26': { 'id_shift_11': '07', 'id_section_11': '07', 'id_group_11': '07', 'id_sub_11': '07' },
            // };

            const currMap = mapData[listGroupSubject.id_status];
            setCurrData(currMap);
        }
    }, [listGroupSubject]); // eslint-disable-line react-hooks/exhaustive-deps

    if (!currData) return (
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

    if (currDataShow) return (
        <Fragment>
            <Row className='m-0 p-0'>
                <Col ref={printRef} md={12} className='m-0 p-0'>
                    <Card className='m-0 p-3'>
                        <Card.Header className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
                            <h4 className={"card-title text-center text-primary pb-2"}>অনুমোদিত শিফট, শাখা, বিভাগ ও বিষয়ের তালিকা</h4>
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            <Row className='justify-content-center'>
                                <Col className='m-2 p-2' md={10}>
                                    <h6 className="text-center text-secondary py-2 text-decoration-underline">অনুমোদিত শিফট, শাখা ও বিভাগসমূহ</h6>
                                    <Table className='m-0 p-0 table table-bordered border-dark'>
                                        <tbody>
                                            <tr className="m-0 p-0">
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    ষষ্ট শ্রেণী (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    জেএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    এসএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    এইচএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                            </tr>
                                            <tr className="m-0 p-0 ">
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {listGroupSubject.id_shift_06 ? listGroupSubject.id_shift_06.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {listGroupSubject.id_section_06 ? String(listGroupSubject.id_section_06).toLocaleUpperCase() : ''}<br />

                                                    {listGroupSubject?.id_group_06 && listGroupSubject.id_group_06.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {listGroupSubject.id_shift_08 ? listGroupSubject.id_shift_08.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {listGroupSubject.id_section_08 ? String(listGroupSubject.id_section_08).toLocaleUpperCase() : ''}<br />

                                                    {listGroupSubject?.id_group_08 && listGroupSubject.id_group_08.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {listGroupSubject.id_shift_09 ? listGroupSubject.id_shift_09.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {listGroupSubject.id_section_09 ? String(listGroupSubject.id_section_09).toLocaleUpperCase() : ''}<br />

                                                    {listGroupSubject?.id_group_09 && listGroupSubject.id_group_09.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {listGroupSubject.id_shift_11 ? listGroupSubject.id_shift_11.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {listGroupSubject.id_section_11 ? String(listGroupSubject.id_section_11).toLocaleUpperCase() : ''}<br />

                                                    {listGroupSubject?.id_group_11 && listGroupSubject.id_group_11.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                            </tr>
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
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className='m-0 p-0'>
                    <Card>
                        <Card.Body>
                            <Row className='justify-content-center'>
                                <Col md={10} className="d-flex justify-content-center gap-3">
                                    <Button className='flex-fill' variant="btn btn-outline-warning"
                                        onClick={() => {
                                            setCurrDataShow(false);
                                        }}
                                    >
                                        ফিরে যান
                                    </Button>
                                    <Button onClick={() => handlePrint(printRef, 'A4', "প্রতিষ্ঠানের বিভাগ ও বিষয়ের তালিকা")} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            <Row className='m-0 p-0'>
                <Col ref={printRef} md={12} className='m-0 p-0'>
                    <Card className='m-0 p-3'>
                        <Card.Header className="d-flex flex-column justify-content-center align-items-center m-0 p-0">
                            <h4 className={"card-title text-center text-primary pb-2"}>আবেদনকৃত শিফট, শাখা, বিভাগ ও বিষয়ের তালিকা</h4>
                        </Card.Header>
                        <Card.Body className="m-0 p-0">
                            <Row className='justify-content-center'>
                                <Col className='m-2 p-2' md={10}>
                                    <h6 className="text-center text-secondary py-2 text-decoration-underline">আবেদনকৃত শিফট, শাখা ও বিভাগসমূহ</h6>
                                    <Table className='m-0 p-0 table table-bordered border-dark'>
                                        <tbody>
                                            <tr className="m-0 p-0">
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    ষষ্ট শ্রেণী (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    জেএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    এসএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    এইচএসসি (শিফট, শাখা, বিভাগ)
                                                </td>
                                            </tr>
                                            <tr className="m-0 p-0 ">
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {applicationData.id_shift_06 ? applicationData.id_shift_06.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {applicationData.id_section_06 ? String(applicationData.id_section_06).toLocaleUpperCase() : ''}<br />

                                                    {applicationData?.id_group_06 && applicationData.id_group_06.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {applicationData.id_shift_08 ? applicationData.id_shift_08.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {applicationData.id_section_08 ? String(applicationData.id_section_08).toLocaleUpperCase() : ''}<br />

                                                    {applicationData?.id_group_08 && applicationData.id_group_08.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {applicationData.id_shift_09 ? applicationData.id_shift_09.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {applicationData.id_section_09 ? String(applicationData.id_section_09).toLocaleUpperCase() : ''}<br />

                                                    {applicationData?.id_group_09 && applicationData.id_group_09.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                                <td className='m-0 p-2 text-center text-dark border border-1 border-dark'>
                                                    {applicationData.id_shift_11 ? applicationData.id_shift_11.split(',').map((id_shift) => {
                                                        const match = listShift.find(item => item.id_shift === id_shift);
                                                        return match?.bn_shift+", " || '';
                                                    }) : ''}<br />

                                                    {applicationData.id_section_11 ? String(applicationData.id_section_11).toLocaleUpperCase() : ''}<br />

                                                    {applicationData?.id_group_11 && applicationData.id_group_11.split(',').map((id_group) => {
                                                        const match = groupList.find(item => item.id_group === id_group);
                                                        return match?.bn_group+", " || '';
                                                    })}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </Col>
                                <Col className='m-2 p-2' md={10}>
                                    <h6 className="text-center text-secondary py-2 text-decoration-underline">আবেদনকৃত বিষয়সমূহ</h6>
                                    {
                                        Object.entries(currData).map(([en_exm, id_exm], idx_exm) => {
                                            const tempGroupList = applicationData[en_exm]?.split(',') || [];

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
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="m-0 p-0">
                    <Card>
                        <Card.Body>
                            <Row className="justify-content-center">
                                <Col md={10} className="d-flex justify-content-center gap-3">
                                    {setShow && <Button className='flex-fill' variant="btn btn-outline-warning" onClick={() => setShow(false)}>ফিরে যান</Button>}
                                    {listGroupSubject && <Button className='flex-fill' variant="btn btn-outline-success"
                                        onClick={() => {
                                            setCurrDataShow(true);
                                        }}
                                    >
                                        অনুমোদিত বিষয়/বিভাগসমূহ
                                    </Button>}
                                    <Button onClick={() => handlePrint(printRef, 'A4', "প্রতিষ্ঠানের বিভাগ ও বিষয়ের তালিকা")} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default InstituteUpdatePrint;