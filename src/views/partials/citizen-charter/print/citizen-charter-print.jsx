import React, { useRef, Fragment } from 'react'
import { useSelector } from "react-redux"
import { Row, Col, Button, Card, Table } from 'react-bootstrap'

import { handlePrint } from '../../handlers/print.jsx';
import * as InputValidation from '../../input_validation.js';
import * as SettingSelector from '../../../../store/setting/selectors.ts'

import LogoMedium from '../../../../components/partials/components/logo-medium.jsx';
import GovLogo from '../../../../components/partials/components/gov-logo.jsx';

const CitizenCharterPrint = ({ navigateCitizenCharterPrint, setNavigateCitizenCharterPrint, printData }) => {
    if (!navigateCitizenCharterPrint) return null;

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    // useref Defination for Printing
    const printRef = useRef();

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-3'>
                <Col ref={printRef} md={12} className='m-0 p-0'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Body className='m-0 p-2'>
                            <Table id="citizen-charter-table" className="table table-bordered border-dark m-0 p-0">
                                <tbody>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                            <div className="d-flex justify-content-center align-items-start w-100 gap-3">
                                                <LogoMedium color={true} />
                                                <div className='d-flex flex-column justify-content-center align-items-center'>
                                                    <h6 className="text-center py-1">{app_bn_name}</h6>
                                                    <h6 className="text-center py-1">{app_bn_address}</h6>
                                                    <small className="text-center py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                                                </div>
                                                <GovLogo color={true} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0 py-3 my-3'>
                                            <p className={"text-primary text-wrap m-0 p-0"}>সিটিজেন চার্টার</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>ক্রমিক নম্বর</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>সংশ্লিষ্ট সেবার নাম</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>সেবা প্রদান পদ্ধতি</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>কাগজপত্র প্রাপ্তিস্থান</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>সেবার মূল্য এবং পরিশোধ পদ্ধতি</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>সেবা প্রদানের সময়সীমা</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>দায়িত্বপ্রাপ্ত কর্মকর্তা (পদবি, ফোন নম্বর ও ইমেইল)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(1)}</p>
                                        </td>
                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.bn_citizen_charter)}</p>
                                        </td>
                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.bn_citizen_charter_proc)}</p>
                                        </td>
                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.bn_citizen_charter_docs)}</p>
                                        </td>
                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.bn_citizen_charter_fee)}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.citizen_charter_duration)}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.bn_user}</p>
                                            <p className={"text-wrap m-0 p-0"}>{printData.bn_post}</p>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.user_mobile)}</p>
                                            <p className={"text-wrap m-0 p-0"}>{printData.user_email}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigateCitizenCharterPrint && <Button onClick={() => setNavigateCitizenCharterPrint(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                <Button onClick={() => handlePrint(printRef, 'legal', "সিটিজেন চার্টার প্রিন্ট", 'landscape')} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>)
}

export default CitizenCharterPrint;