import React, { useRef, Fragment, useState, useEffect } from 'react'
import { useSelector } from "react-redux"

import { Row, Col, Button, Card, Table, Image } from 'react-bootstrap'

import LogoMedium from '../../../../components/partials/components/logo-medium.jsx';
import GovLogo from '../../../../components/partials/components/gov-logo.jsx';

import * as SettingSelector from '../../../../store/setting/selectors.ts'

import * as InputValidation from '../../input_validation'

import { handlePrint } from '../../handlers/print';

import { FadeLoader } from "react-spinners";

const LeaveAppPrint = ({ navigateLeaveAppPrint, setNavigateLeaveAppPrint, leavePrintData, axiosApi }) => {
    if (!navigateLeaveAppPrint) return null;

    // useref Defination for Printing
    const printRef = useRef();

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    const [loading, setLoading] = useState(true);

    const [signatures, setSignatures] = useState([]);

    const fetchSignatures = async () => {
        const signs = {};

        const fields = ['user_leave', 'user_duty', 'id_verify', 'id_check', 'id_authorize'];

        const promises = fields.map(async (field) => {
            try {
                const response = leavePrintData[field] ? await axiosApi.post(`/signed/sign-fetch`, { id_signed: leavePrintData[field] }, { responseType: 'blob' }) : false;
                if (response && response.status === 200) {
                    signs[field] = URL.createObjectURL(response.data);
                } else {
                    signs[field] = null;
                }
            } catch (error) {
                signs[field] = null;
                console.log(error);
            }
        });

        await Promise.all(promises);
        setSignatures(signs);
        setLoading(false);
    }

    useEffect(() => {
        fetchSignatures();
    }, [leavePrintData]);


    if (loading) return (
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

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-3'>
                <Col ref={printRef} md={12} className='m-0 p-0'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0 table-responsive'>
                            <Table id="leave-app-table" className="table table-bordered border-white m-0 p-0">
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className='text-center align-top text-wrap m-0 p-0'>
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
                                    <tr>
                                        <td colSpan={5} className='text-center align-top text-wrap text-decoration-underline m-0 p-0 py-2'>{leavePrintData.bn_type}র আবেদন</td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap px-1 m-0' style={{ 'width': '30%' }}></td>
                                        <td colSpan={3} className='text-center align-top text-wrap px-1 m-0'></td>
                                        <td className='text-center align-top text-wrap px-1 m-0' style={{ 'width': '30%' }}></td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 px-1 m-0'>১. আবেদনকারীর নাম</td>
                                        <td className='text-center align-top text-wrap p-0 px-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-0 px-1 m-0'>{leavePrintData.bn_user_leave}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 px-1 m-0'>২. পদবী</td>
                                        <td className='text-center align-top text-wrap p-0 px-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-0 px-1 m-0'>{leavePrintData.bn_post_leave}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-1 m-0'>৩. ছুটির সময়কাল</td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-1 m-0'>{InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.start_date))} থেকে {InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.end_date))} (মোটঃ {InputValidation.E2BDigit(leavePrintData.total_requested)} দিন)</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-1 m-0'>৪. ছুটির কারণ</td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-1 m-0'>{leavePrintData.bn_reason}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-1 m-0'>৫. ছুটিকালীন ঠিকানা</td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-1 m-0'>{leavePrintData.leave_address}, {leavePrintData.bn_uzps}, {leavePrintData.bn_dist}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-1 m-0'>৬. দায়ীত্বপালনকারী কর্মকর্তা/কর্মচারী</td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>:</td>
                                        <td colSpan={3} className='text-left align-top text-nowrap p-1 m-0'>{leavePrintData.bn_user_duty}, {leavePrintData.bn_post_duty} ({leavePrintData.user_duty})</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className='text-left align-top text-wrap p-1 m-0'></td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>
                                            {signatures.user_leave && <Image className="p-1 w-50" src={signatures.user_leave} alt="আবেদনকারীর স্বাক্ষর" />}<br />
                                            {leavePrintData.dt_initiate && <small>{InputValidation.E2BDigit(InputValidation.formatedDate(String(leavePrintData.dt_initiate).split(' ')[0]))}</small>}<br />
                                            {leavePrintData.bn_user_leave && <small>{leavePrintData.bn_user_leave} ({leavePrintData.user_duty})</small>}<br />
                                            আবেদনকারীর স্বাক্ষর ও তারিখ
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap p-1 m-0'>
                                            {signatures.id_verify && <Image className="p-1 w-50" src={signatures.id_verify} alt="নিয়ন্ত্রনকারী কর্মকর্তার স্বাক্ষর" />}<br />
                                            {leavePrintData.dt_verify && <small>{InputValidation.E2BDigit(InputValidation.formatedDate(String(leavePrintData.dt_verify).split(' ')[0]))}</small>}<br />
                                            {leavePrintData.bn_user_verify && <small>{leavePrintData.bn_user_verify} ({leavePrintData.id_verify})</small>} <br />
                                            নিয়ন্ত্রনকারী কর্মকর্তার স্বাক্ষর
                                        </td>
                                        <td colSpan={3} className='text-left align-top text-wrap p-1 m-0'>
                                        </td>
                                        <td className='text-center align-top text-wrap p-1 m-0'>
                                            {signatures.id_authorize && <Image className="p-1 w-50" src={signatures.id_authorize} alt="ছুটি মঞ্জুরকারী কর্মকর্তার স্বাক্ষর" />}<br />
                                            {leavePrintData.dt_authorize && <small>{InputValidation.E2BDigit(InputValidation.formatedDate(String(leavePrintData.dt_authorize).split(' ')[0]))}</small>}<br />
                                            {leavePrintData.bn_user_authorize && <small>{leavePrintData.bn_user_authorize} ({leavePrintData.id_authorize})</small>}<br />
                                            ছুটি মঞ্জুরকারী কর্মকর্তার স্বাক্ষর
                                        </td>
                                    </tr>
                                    <tr className='bg-transparent'>
                                        <td colSpan={5} className='text-center align-top text-wrap text-decoration-underline m-0 p-0 py-2'>(বছরে বরাদ্দকৃত {leavePrintData.bn_type} {InputValidation.E2BDigit(leavePrintData.total_leave)} দিন)</td>
                                    </tr>

                                    {leavePrintData.id_check && <>
                                        <tr className='bg-transparent'>
                                            <td colSpan={5} className='text-center align-top text-wrap m-0 p-0'><div className="border-top border-1 border-dark w-100"></div></td>
                                        </tr>
                                        <tr className='bg-transparent'>
                                            <td colSpan={5} className='text-center align-top text-wrap text-decoration-underline m-0 p-0 py-2'>
                                                অফিস রিপোর্ট
                                            </td>
                                        </tr>
                                        <tr className='bg-transparent'>
                                            <td colSpan={5} className='align-top text-wrap m-0 p-0 py-2' style={{ 'textAlign': 'justify' }}>আবেদনকারী {InputValidation.E2BDigit(String(leavePrintData.end_date).split('-')[0])} সালে {(InputValidation.E2BDigit(leavePrintData.total_availed))} দিন (প্রার্থিত ছুটি ব্যতীত) {leavePrintData.bn_type} ভোগ করেছেন। প্রার্থীত ছুটি নোট করা হয়েছে।</td>
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className='text-left align-top text-wrap p-1 m-0'></td>
                                            <td className='text-center align-top text-wrap p-1 m-0'>
                                                {signatures.id_check && <Image className="p-1 w-50" src={signatures.id_check} alt="প্রশাসনিক কর্মকর্তার স্বাক্ষর" />}<br />
                                                {leavePrintData.dt_check && <small>{InputValidation.E2BDigit(InputValidation.formatedDate(String(leavePrintData.dt_check).split(' ')[0]))}</small>}<br />
                                                {leavePrintData.bn_user_check && <small>{leavePrintData.bn_user_check} ({leavePrintData.id_check})</small>} <br />
                                                প্রশাসনিক কর্মকর্তার স্বাক্ষর
                                            </td>
                                        </tr>
                                    </>}
                                    {(leavePrintData.id_status === '17' || leavePrintData.id_status === '18') && <>
                                        <tr className='bg-transparent'>
                                            <td colSpan={5} className='text-center align-top text-wrap m-0 p-0'><div className="border-top border-1 border-dark w-100"></div></td>
                                        </tr>

                                        <tr className='bg-transparent'>
                                            <td colSpan={5} className='text-center align-top text-wrap m-0 p-0 py-3'>
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
                                        <tr>
                                            {leavePrintData.id_status === '17' && <td colSpan={5} className='text-center align-top text-wrap text-decoration-underline p-1 m-0'>ছুটির মঞ্জুরিপত্র (কর্মস্থল ত্যাগসহ)</td>}
                                            {leavePrintData.id_status === '18' && <td colSpan={5} className='text-center align-top text-wrap text-decoration-underline p-1 m-0'>ছুটি বাতিলের আদেশ</td>}
                                        </tr>
                                        <tr>
                                            {leavePrintData.id_status === '17' && <td colSpan={5} className='align-top text-wrap p-1 m-0' style={{ 'textAlign': 'justify' }}>জনাব {leavePrintData.bn_user_leave}, পদবিঃ {leavePrintData.bn_post_leave} কে {InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.start_date))} তারিখ হতে {InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.end_date))} তারিখ পর্যন্ত (মোটঃ {InputValidation.E2BDigit(leavePrintData.total_requested)} দিন) দপ্তর ত্যাগসহ {leavePrintData.bn_type} মঞ্জুর করা হলো।</td>}

                                            {leavePrintData.id_status === '18' && <td colSpan={5} className='align-top text-wrap text-danger p-1 m-0' style={{ 'textAlign': 'justify' }}>জনাব {leavePrintData.bn_user_leave}, পদবিঃ {leavePrintData.bn_post_leave} কে {InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.start_date))} তারিখ হতে {InputValidation.E2BDigit(InputValidation.formatedDate(leavePrintData.end_date))} তারিখ পর্যন্ত (মোটঃ {InputValidation.E2BDigit(leavePrintData.total_requested)} দিন) {leavePrintData.bn_type}র আবেদন “{leavePrintData.comment}” কারণে বাতিল করা হলো।</td>}
                                        </tr>
                                        <tr>
                                            <td colSpan={4} className='text-left align-top text-wrap p-1 m-0'></td>
                                            <td className='text-center align-top text-wrap p-1 m-0'>
                                                {signatures.id_authorize && <Image className="p-1 w-50" src={signatures.id_authorize} alt="ছুটি মঞ্জুরকারী কর্মকর্তার স্বাক্ষর" />}<br />
                                                {leavePrintData.dt_authorize && <small>{InputValidation.E2BDigit(InputValidation.formatedDate(String(leavePrintData.dt_authorize).split(' ')[0]))}</small>}<br />
                                                {leavePrintData.bn_user_authorize && <small>{leavePrintData.bn_user_authorize} ({leavePrintData.id_authorize})</small>}<br />
                                                ছুটি মঞ্জুরকারী কর্মকর্তার স্বাক্ষর
                                            </td>
                                        </tr>
                                    </>}
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigateLeaveAppPrint && <Button onClick={() => setNavigateLeaveAppPrint(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                <Button onClick={() => handlePrint(printRef, 'legal', "প্রতিষ্ঠান স্থাপনের আবেদন প্রিন্ট")} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>)
}

export default LeaveAppPrint;