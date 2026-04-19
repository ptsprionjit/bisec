import React, { useRef, Fragment } from 'react'
import { useSelector } from "react-redux"
import { Row, Col, Button, Card, Table } from 'react-bootstrap'
import { replace, useNavigate } from 'react-router-dom';

import { handlePrint } from '../../handlers/print.jsx';
import * as InputValidation from '../../input_validation.js';
import * as SettingSelector from '../../../../store/setting/selectors.js'

import LogoMedium from '../../../../components/partials/components/logo-medium.jsx';
import GovLogo from '../../../../components/partials/components/gov-logo.jsx';

const CitizenCharterFullPrint = ({ navigateCitizenCharterPrint, setNavigateCitizenCharterPrint, printData }) => {
    if (!navigateCitizenCharterPrint) return null;

    const navigate = useNavigate();

    const app_bn_name = useSelector(SettingSelector.app_bn_name);
    const app_bn_address = useSelector(SettingSelector.app_bn_address);
    const app_phone = useSelector(SettingSelector.app_phone);
    const app_email = useSelector(SettingSelector.app_email);

    const dataType = { prevData: null, currData: null, isChange: null, slData: 0, slType: 0 }

    // useref Defination for Printing
    const printRef = useRef();

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
                                                <GovLogo color={true} />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0 py-3'>
                                            <strong className={"text-dark text-wrap m-0 p-0"}>সিটিজেন চার্টার</strong>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-left align-top text-wrap m-0 p-2'>
                                            <strong className={"text-dark text-wrap m-0 p-0"}>{"১) রূপকল্প ও অভিলক্ষ্য"}</strong>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td className='text-left align-top text-wrap m-0 p-0'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"রূপকল্প"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>:</p>
                                        </td>
                                        <td colSpan={5} className='align-top text-wrap m-0 p-0' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"তথ্য ও যোগাযোগ প্রযুক্তি নির্ভর মানসম্মত শিক্ষা ব্যবস্থাপনা নিশ্চিত করা।"}</p>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td className='text-left align-top text-wrap m-0 p-0'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"অভিলক্ষ্য"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-0'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>:</p>
                                        </td>
                                        <td colSpan={5} className='align-top text-wrap m-0 p-0' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"শিক্ষার্থী, শিক্ষক, অভিভাবক ও কমিউনিটির সম্মিলিত অংশগ্রহণে একটি জবাবদিহিমূলক উন্নত ও দক্ষ শিক্ষা ব্যবস্থাপনার মাধ্যমে শিক্ষার্থীদের যুগোপযোগী জ্ঞান অর্জন, দক্ষ ও নৈতিক মূল্যবোধ সম্পন্ন মানব সম্পদ সৃষ্টি এবং মান সম্পন্ন কার্যকর সেবা প্রদান।"}</p>
                                        </td>
                                    </tr>
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-left align-top text-wrap m-0 p-0'>
                                            <strong className={"text-dark text-wrap m-0 p-0"}>{"২) প্রতিশ্রুত সেবাসমূহ"}</strong>
                                        </td>
                                    </tr>
                                    {
                                        printData.map((item, idx) => {
                                            dataType.currData = item.id_charter_type;
                                            if (dataType.currData !== dataType.prevData) {
                                                dataType.prevData = dataType.currData;
                                                dataType.isChange = true;
                                                dataType.slData = 1;
                                                dataType.slType = dataType.slType + 1;
                                            } else {
                                                dataType.slData = dataType.slData + 1;
                                                dataType.isChange = false;
                                            }

                                            return (
                                                <Fragment key={idx}>
                                                    {dataType.isChange && <>
                                                        <tr>
                                                            <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                                            </td>
                                                        </tr>
                                                        <tr>
                                                            <td colSpan={7} className='text-left align-top text-wrap m-0 p-0 p-1'>
                                                                <p className={"text-wrap m-0 p-0"}>{"২) " + InputValidation.E2BDigit(dataType.slType) + ": " + item.bn_charter_type}</p>
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
                                                    </>}
                                                    <tr>
                                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(String(dataType.slData).padStart(2, "0"))}</p>
                                                        </td>
                                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.bn_citizen_charter)}</p>
                                                        </td>
                                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.bn_citizen_charter_proc)}</p>
                                                        </td>
                                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.bn_citizen_charter_docs)}</p>
                                                        </td>
                                                        <td className='align-top text-wrap m-0 p-0 p-1' style={{ 'textAlign': 'justify' }}>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.bn_citizen_charter_fee)}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.citizen_charter_duration)}</p>
                                                        </td>
                                                        <td className='text-center align-top text-wrap m-0 p-0 p-1'>
                                                            <p className={"text-wrap m-0 p-0"}>{item.bn_user}</p>
                                                            <p className={"text-wrap m-0 p-0"}>{item.bn_post}</p>
                                                            <p className={"text-wrap m-0 p-0"}>{InputValidation.E2BDigit(item.user_mobile)}</p>
                                                            <p className={"text-wrap m-0 p-0"}>{item.user_email}</p>
                                                        </td>
                                                    </tr>
                                                </Fragment>
                                            )
                                        })
                                    }
                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-left align-top text-wrap m-0 p-2'>
                                            <strong className={"text-dark text-wrap m-0 p-0"}>{"৩) সেবাপ্রার্থীর কাছে আমাদের প্রত্যাশা"}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"ক্রমিক নম্বর"}</p>
                                        </td>
                                        <td colSpan={6} className='align-top text-wrap m-0 p-2' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"প্রতিশ্রুত/কাঙ্খিত সেবা প্রাপ্তির লক্ষ্যে করণীয়"}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০১"}</p>
                                        </td>
                                        <td colSpan={6} className='align-top text-wrap m-0 p-2' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"স্বয়ংসম্পূর্ণ আবেদন জমা প্রদান"}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০২"}</p>
                                        </td>
                                        <td colSpan={6} className='align-top text-wrap m-0 p-2' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"যথাযথ প্রক্রিয়ায় প্রয়োজনীয় ফিস পরিশোধ করা"}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০৩"}</p>
                                        </td>
                                        <td colSpan={6} className='align-top text-wrap m-0 p-2' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"সাক্ষাতের জন্য নির্ধারিত সময়ের পূর্বেই উপস্থিত থাকা"}</p>
                                        </td>
                                    </tr>

                                    <tr className='border border-white'>
                                        <td colSpan={7} className='text-left align-top text-wrap m-0 p-2'>
                                            <strong className={"text-dark text-wrap m-0 p-0"}>{"৪) অভিযোগ প্রতিকার ব্যবস্থাপনা (GRS)"}</strong>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='text-center align-top text-wrap m-0 p-0'>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td colSpan={7} className='align-top text-wrap m-0 p-2' style={{ 'textAlign': 'justify' }}>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"সেবা প্রাপ্তিতে অসন্তুষ্ট হলে দায়িত্বপ্রাপ্ত কর্মকর্তার সঙ্গে যোগাযোগ করুন। তার কাছ থেকে সমাধান পাওয়া না গেলে নিম্নোক্ত পদ্ধতিতে যোগাযোগ করে আপনার সমস্যা অবহিত করুন।"}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"ক্রমিক নম্বর"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"কখন যোগাযোগ করবেন"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"কার সঙ্গে যোগাযোগ করবেন"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"যোগাযোগের ঠিকানা"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"নিষ্পত্তির সময়সীমা"}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০১"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"দায়িত্বপ্রাপ্ত কর্মকর্তা সমাধান দিতে না পারলে"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"অভিযোগ নিষ্পত্তি কর্মকর্তা (অনিক)"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>খোন্দকার মোহাম্মদ সাদেকুর রহমান<br />সচিব, সচিবের দপ্তর<br />৮৮০৮১৭৬৪৭০<br />secretary@comillaboard.gov.bd
                                            </p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"তিন মাস"}</p><br />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০২"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"অভিযোগ নিষ্পত্তি কর্মকর্তা নির্দিষ্ট সময়ে সমাধান দিতে না পারলে"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"আপিল কর্মকর্তা"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>তানজিলা খানম<br />যুগ্মসচিব, নীতি ও সংস্কার অধিশাখা</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"এক  মাস"}</p><br />
                                        </td>
                                    </tr>

                                    <tr>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"০৩"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"আপিল কর্মকর্তা নির্দিষ্ট সময়ে সমাধান দিতে না পারলে"}</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"মন্ত্রিপরিষদ বিভাগের অভিযোগ ব্যবস্থাপনা সেল"}</p>
                                        </td>
                                        <td colSpan={2} className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>অভিযোগ গ্রহণ কেন্দ্র<br />৫ নম্বর গেইট, বাংলাদেশ সচিবালয়, ঢাকা।<br />ওয়েব: www.grs.gov.bd</p>
                                        </td>
                                        <td className='text-center align-top text-wrap m-0 p-2'>
                                            <p className={"text-dark text-wrap m-0 p-0"}>{"তিন মাস"}</p><br />
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className='m-0 p-1'>
                    <Card className="card-transparent shadow-none d-flex justify-content-center auth-card m-0 py-5">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                            <Col md={12} className='d-flex justify-content-around align-items-center gap-3'>
                                {setNavigateCitizenCharterPrint && <Button onClick={() => setNavigateCitizenCharterPrint(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
                                {!setNavigateCitizenCharterPrint && <Button onClick={() => navigate('/', { replace: true })} className='flex-fill' type="button" variant="btn btn-outline-warning">বোর্ড হোম</Button>}
                                <Button onClick={() => handlePrint(printRef, 'legal', "সিটিজেন চার্টার প্রিন্ট", 'landscape')} className='flex-fill' type="button" variant="btn btn-outline-primary">প্রিন্ট করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )
}

export default CitizenCharterFullPrint;