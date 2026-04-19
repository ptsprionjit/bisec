import React, { Fragment, useRef } from 'react';
import { useSelector } from "react-redux"

import { Row, Col, Button, Card, Table } from 'react-bootstrap';

import * as InputValidation from '../../input_validation.js'

import LogoMedium from '../../../../components/partials/components/logo-medium.jsx';

import * as SettingSelector from '../../../../store/setting/selectors.js'

import { handlePrint } from '../../handlers/print.jsx';

const SubjectDetails = ({ navigateSubjectDetails, setNavigateSubjectDetails, printData }) => {
    if (!navigateSubjectDetails) return null;

    // useref Defination for Printing
    const printRef = useRef();

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    return (
        <Fragment>
            <Row className='bg-transparent d-flex flex-column justify-content-center align-item-center m-0 p-2'>
                <Col ref={printRef} md={12} className='m-0 p-1'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Body className='m-0 p-2'>
                            <Table id="citizen-charter-table" className="table table-bordered border-dark m-0 p-0">
                                <tbody>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                            <div className="d-flex justify-content-center align-printDatas-start w-100 gap-3">
                                                <LogoMedium color={true} />
                                                <div className='d-flex flex-column justify-content-center align-item-center'>
                                                    <h6 className="text-center py-1">{app_bn_name}</h6>
                                                    <h6 className="text-center py-1">{app_bn_address}</h6>
                                                    <small className="text-center py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                                                </div>
                                                <div className='opacity-0'>
                                                    <LogoMedium color={true} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0 py-3'>
                                            <strong className={"text-dark text-wrap m-0 p-1"}>রেজিস্ট্রেশন/পরীক্ষার বিষয় বিস্তারিত</strong><br/>
                                            <span className={"text-dark text-wrap m-0 p-1"}>{printData.bn_exam + " (" + InputValidation.E2BDigit(printData.ex_year) + ")"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'></td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>ক্রমিক</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>বিষয় কোড</p>
                                            <p className={"text-wrap m-0 p-0"}>বিষয় বিভাগ</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>বিষয়ের পূর্ণ নাম</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>বিষয়ের সংক্ষিপ্ত নাম</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>আবশ্যিক বিষয়</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>আবশ্যিক বিষয় (ধর্মীয়)</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>আবশ্যিক বিষয় (বিভাগীয়)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{"০১"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(printData.sub_code)}</p>
                                            <p className={"text-wrap m-0 p-0"}>{printData.bn_group}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.bn_full_sub}</p>
                                            <p className={"text-wrap m-0 p-0 text-uppercase"}>{printData.en_full_sub}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.bn_reg_sub}</p>
                                            <p className={"text-wrap m-0 p-0 text-uppercase"}>{printData.en_reg_sub}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.is_reg_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.is_rel_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>{printData.is_grp_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className='m-0 p-1'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-item-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-item-center gap-3'>
                                {setNavigateSubjectDetails && <Button onClick={() => setNavigateSubjectDetails(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                <Button onClick={() => handlePrint(printRef, 'A4', "বিষয় বিস্তারিত প্রিন্ট", 'portrait')} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default SubjectDetails;