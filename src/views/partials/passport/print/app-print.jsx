import React, { useRef, Fragment, useState, useEffect, useMemo } from 'react'
import { useSelector } from "react-redux"

import { Row, Col, Button, Card, Table, Image } from 'react-bootstrap'

import GovLogo from '../../../../components/partials/components/gov-logo.jsx';

import * as SettingSelector from '../../../../store/setting/selectors.js'

import * as InputValidation from '../../input_validation.js'

import { handlePrint } from '../../handlers/print.jsx';

import { FadeLoader } from "react-spinners";

const PassportAppPrint = ({ navigatePassportAppPrint, setNavigatePassportAppPrint, printData, axiosApi }) => {
    if (!navigatePassportAppPrint) return null;

    // useref Defination for Printing
    const printRef = useRef();

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    const [loading, setLoading] = useState(true);

    const [signatures, setSignatures] = useState([]);

    const fetchSignatures = async () => {
        if(printData.id_status!=='17') return setLoading(false);

        const signs = {};

        const fields = ['id_authorize'];

        const promises = fields.map(async (field) => {
            try {
                const response = printData[field] ? await axiosApi.post(`/signed/sign-fetch`, { id_signed: printData[field] }, { responseType: 'blob' }) : false;
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
    }, [printData]);

    const pensionDate = useMemo(() => {
        const d = new Date(printData.user_dob);
        d.setFullYear(d.getFullYear() + 61);
        return d;
    }, [printData.user_dob]);

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
                        <Card.Body className='m-0 p-2 border border-3 border-dark'>
                            <Table id="passport-noc-table" className="table table-bordered border-white m-0 p-0">
                                <tbody>
                                    <tr>
                                        <td colSpan={5} className='text-center align-top text-wrap m-0 p-0 pb-1'>
                                            <div className="d-flex flex-column justify-content-center align-items-center">
                                                <GovLogo color={false} />
                                                <strong className="text-center m-0 p-0">অনাপত্তি সনদ (NOC)</strong>
                                                <h6 className="text-center m-0 p-0">{app_bn_name}</h6>
                                                <h6 className="text-center m-0 p-0">{app_bn_address}</h6>
                                                <small className="text-center m-0 p-0">ওয়েবসাইটঃ web.comillaboard.gov.bd</small>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className='align-top text-wrap m-0 p-0 pb-1'>
                                            <div className='d-flex justify-content-between align-items-center'>
                                                <span className='text-left'>স্মারক নংঃ- {printData.id_reference}</span>
                                                <span className='text-end'>তারিখঃ {printData.dt_authorize ? InputValidation.E2BDigit(InputValidation.formatedDate(printData.dt_authorize)) : ""}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 pb-1 m-0'>বিষয়ঃ </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 pb-1 m-0'>
                                            <strong>জনাবঃ {printData.bn_user} পিতা/স্বামীঃ {printData.bn_father} এর পাসপোর্ট করার জন্য অনাপত্তি প্রদান।</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className='text-left align-top text-wrap p-0 m-0 pb-1' style={{ 'textAlign': 'justify', 'textIndent':'54px' }}>জনাবঃ {printData.bn_user}; {app_bn_name} কার্যালয়ে স্থায়ী/অস্থায়ী ভিত্তিতে (প্রযোজ্য ক্ষেত্রে দাপ্তরিক পরিচিতি নম্বরঃ {printData.id_user}), {printData.bn_post} পদে নিযুক্ত আছেন। তার পাসপোর্টের আবেদনপত্র প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য এর সঙ্গে প্রেরণ করা হ’লো। পুলিশ বিভাগের মাধ্যমে ইতোপূর্বে তার পূর্ব পরিচয় ও চরিত্র প্রতিপাদিত হয়েছে/হয়নি এবং তার বিরুদ্ধে বিরূপ কোন তথ্য নেই।</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 m-0'>২। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 m-0'>বর্তমান ঠিকানাঃ {printData.bn_curr_address}, {printData.bn_curr_postoffice}, {printData.bn_curr_uzps}, {printData.bn_curr_dist}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 m-0'>৩। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 m-0'>জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন নম্বরঃ {InputValidation.E2BDigit(printData.user_id_number)}</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 m-0'>৪। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 m-0'>অবসর গ্রহণের তারিখঃ {InputValidation.E2BDigit(InputValidation.formatedDate(pensionDate))} খ্রিস্টাব্দ</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 m-0'>৫। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 m-0' style={{ 'textAlign': 'justify' }}>আবেদনকারীর পরিবারবর্গের বিবরণ (নির্ভরশীল স্বামী/স্ত্রী এবং ১৫ বছরের নীচে অপ্রাপ্তবয়স্বক সন্তানদের পাসপোর্ট করার ক্ষেত্রে প্রযোজ্য):</td>
                                    </tr>
                                    <tr className='border-1 border-dark'>
                                        <td colSpan={5} className='text-left align-top text-wrap p-0 m-0'></td>
                                    </tr>
                                    <tr className='border-1 border-dark'>
                                        <td className='text-center align-top text-wrap p-0 px-2 m-0'>ক্রমিক নং</td>
                                        <td className='text-center align-top text-wrap p-0 px-2 m-0' style={{ 'width': '35%' }}>নাম</td>
                                        <td className='text-center align-top text-wrap p-0 px-2 m-0'>সম্পর্ক</td>
                                        <td className='text-center align-top text-wrap p-0 px-2 m-0'>জন্ম তারিখ</td>
                                        <td className='text-center align-top text-nowrap p-0 px-2 m-0'>জাতীয় পরিচয়পত্র/জন্ম নিবন্ধন নম্বর</td>
                                    </tr>
                                    {printData.bn_spouse &&
                                        <tr className='border-1 border-dark'>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>০১</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.bn_spouse}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.id_gender === '01' ? "স্ত্রী" : "স্বামী"}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(InputValidation.formatedDate(printData.dob_spouse))}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(printData.id_spouse)}</td>
                                        </tr>
                                    }
                                    {printData.bn_child1 &&
                                        <tr className='border-1 border-dark'>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>০২</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.bn_child1}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.id_gender_child1 === '01' ? "ছেলে" : "মেয়ে"}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(InputValidation.formatedDate(printData.dob_child1))}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(printData.id_child1)}</td>
                                        </tr>
                                    }
                                    {printData.bn_child2 &&
                                        <tr className='border-1 border-dark'>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>০৩</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.bn_child2}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{printData.id_gender_child2 === '01' ? "ছেলে" : "মেয়ে"}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(InputValidation.formatedDate(printData.dob_child2))}</td>
                                            <td className='text-center align-top text-wrap p-0 px-2 m-0'>{InputValidation.E2BDigit(printData.id_child2)}</td>
                                        </tr>
                                    }
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 pt-1 m-0'>৬। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 pt-1 m-0'>আবেদনকারী/আবেদনকারীগণ বাংলাদেশের নাগরিক। তাকে/তাদেরকে পাসপোর্ট প্রদানে আপত্তি নাই।</td>
                                    </tr>
                                    <tr>
                                        <td className='text-left align-top text-wrap p-0 m-0'>৭। </td>
                                        <td colSpan={4} className='text-left align-top text-wrap p-0 m-0'>অনাপত্তি সনদ (NOC) একবার ব্যবহারযোগ্য এবং ইস্যুর তারিখ হতে ০৬ (মাস) পর্যন্ত কার্যকর থাকবে।</td>
                                    </tr>
                                    <tr>
                                        <td colSpan={4} className='text-end align-top text-wrap p-0 m-0 py-1'>
                                            <div className='d-flex justify-content-end align-items-center gap-1'>
                                                <span>
                                                    এনওসি প্রদানকারী কর্মকর্তার<br />
                                                    নামসহ সীল।<br />
                                                    (মন্ত্রণালয়/অধিদপ্তর/পরিদপ্তর/<br />
                                                    বিভাগ/কর্পোরেশন<br />
                                                    এর প্রধান কর্মকর্তা/জেলার<br />
                                                    দায়িত্বপ্রাপ্ত কর্মকর্তা)<br />
                                                </span>
                                                <small style={{ 'writingMode': 'vertical-lr', 'fontSize': '10px' }}>
                                                    NOC প্রদানকারী কর্মকর্তা কর্তৃক পূরণীয়
                                                </small>
                                            </div>

                                        </td>
                                        <td className='text-left align-top text-wrap p-0 ps-2 py-1 m-0'>
                                            <Table className='table table-bordered border-white m-0 p-0'>
                                                <tbody>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>স্বাক্ষর</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: {signatures.id_authorize && <Image className="w-50" src={signatures.id_authorize} alt="আবেদনকারীর স্বাক্ষর" />}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>নাম</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: {printData.bn_auth_user}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>পদবী</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: {printData.bn_auth_post}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>ফোন নম্বর</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: {InputValidation.E2BDigit(app_phone)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>ই-মেইল</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: {app_email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td className='m-0 p-0 align-top text-nowrap'>ওয়েবসাইট</td>
                                                        <td className='m-0 p-0 align-top text-nowrap'>: web.comillaboard.gov.bd</td>
                                                    </tr>
                                                </tbody>
                                            </Table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={5} className='text-left align-top text-wrap p-0 m-0 pb-1'>
                                            প্রাপক<br />
                                            পরিচালক/উপপরিচালক/সহকারী পরিচালক<br />
                                            বিভাগীয় পাসপোর্ট ও ভিসা অফিস/আঞ্চলিক পাসপোর্ট অফিস,<br />
                                            {printData.bn_curr_div}/{printData.bn_parm_div}/{printData.bn_curr_dist}/{printData.bn_parm_dist}।<br />
                                        </td>
                                    </tr>
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <th colSpan={5} className='text-center align-top text-wrap p-0 pt-2 m-0'>
                                            <h6>বিঃদ্রঃ অনাপত্তি সনদ (NOC) স্ব স্ব প্রতিষ্ঠানের ওয়েবসাইটে আপলোড করতে হবে।</h6>
                                        </th>
                                    </tr>
                                </tfoot>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigatePassportAppPrint && <Button onClick={() => setNavigatePassportAppPrint(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                <Button onClick={() => handlePrint(printRef, 'A4', "প্রতিষ্ঠান স্থাপনের আবেদন প্রিন্ট")} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>)
}

export default PassportAppPrint;