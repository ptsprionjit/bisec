import React, { Fragment, useRef } from 'react';
import { useSelector } from "react-redux"

import { Row, Col, Button, Card, Table } from 'react-bootstrap';

import * as InputValidation from '../../input_validation.js'

import LogoMedium from '../../../../components/partials/components/logo-medium.jsx';

import * as SettingSelector from '../../../../store/setting/selectors.js'

import { handlePrint } from '../../handlers/print.jsx';

const SubjectListPrint = ({ navigateSubjectListPrint, setNavigateSubjectListPrint, printData }) => {
    if (!navigateSubjectListPrint) return null;

    // useref Defination for Printing
    const printRef = useRef();

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    return (
        <Fragment>
            <Row className='bg-transparent d-flex flex-column justify-content-center align-items-center m-0 p-2'>
                <Col ref={printRef} md={12} className='m-0 p-1'>
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
                                                <div className='opacity-0'>
                                                    <LogoMedium color={true} />
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0 py-3'>
                                            <strong className={"text-dark text-wrap m-0 p-1"}>রেজিস্ট্রেশন/পরীক্ষার বিষয় তালিকা</strong><br/>
                                            <span className={"text-dark text-wrap m-0 p-1"}>{printData[0].bn_exam + " (" + InputValidation.E2BDigit(printData[0].ex_year) + ")"}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'></td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                            <p className={"text-wrap m-0 p-0"}>ক্রমিক</p>
                                        </td>
                                        <td className='text-center align-top text-nowrap m-0 p-0 p-1'>
                                            <p className={"text-nowrap m-0 p-0"}>বিষয় কোড</p>
                                            <p className={"text-nowrap m-0 p-0"}>বিষয় বিভাগ</p>
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
                                    {
                                        printData.map((item, idx) =>
                                            <tr key={idx}>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(String(idx + 1).padStart(2, "0"))}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.sub_code)}</p>
                                                    <p className={"text-wrap m-0 p-0"}>{item.bn_group}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{item.bn_full_sub}</p>
                                                    <p className={"text-wrap m-0 p-0 text-uppercase"}>{item.en_full_sub}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{item.bn_reg_sub}</p>
                                                    <p className={"text-wrap m-0 p-0 text-uppercase"}>{item.en_reg_sub}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{item.is_reg_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{item.is_rel_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                                </td>
                                                <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                    <p className={"text-wrap m-0 p-0"}>{item.is_grp_compulsory === 1 ? "হ্যাঁ" : "না"}</p>
                                                </td>
                                            </tr>
                                        )
                                    }
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className='m-0 p-1'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigateSubjectListPrint && <Button onClick={() => setNavigateSubjectListPrint(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                <Button onClick={() => handlePrint(printRef, 'A4', "বিষয় তালিকা প্রিন্ট", 'portrait')} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default SubjectListPrint;