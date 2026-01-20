import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Image, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import LogoMedium from '../../../components/partials/components/logo-medium'
import GovLogo from '../../../components/partials/components/gov-logo'

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import * as InputValidation from '../input_validation';

import { CLASS_START_FACILITY_RULES, CLASS_START_LAND_RULES } from '../institute/rules/class_rules.jsx';

import { handlePrint } from '../handlers/print.jsx';

const ClassStartOrder = () => {
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const app_bn_name = useSelector(SettingSelector.app_bn_name);
   // const app_bn_address = useSelector(SettingSelector.app_bn_address);
   // const app_phone = useSelector(SettingSelector.app_phone);
   // const app_email = useSelector(SettingSelector.app_email);

   const navigate = useNavigate();
   const handleRedirect = (() => {
      if (prevLink) {
         navigate(prevLink);
      } else {
         navigate('/');
      }
   });

   const [prevLink, setPrevLink] = useState(null);
   const [status, setStatus] = useState({ loading: false, error: false, success: false });

   const [printData, setPrintData] = useState(false);
   const [profileSign, setProfileSign] = useState(null);

   const [instMinAmount, setInstMinAmount] = useState([]);

   const printRef = useRef();

   //Signed Signatute Fetch
   const fetchProfileSign = async (id_signed) => {
      // console.log(id_signed);
      await axiosApi.post(`/signed/sign-fetch?`, { id_signed: id_signed }, { responseType: 'blob' })
         .then(response => {
            const profile_sign = URL.createObjectURL(response.data);
            setProfileSign(profile_sign);
         })
         .catch(err => {
            // console.error(err);
            if (err.status === 401) {
               navigate("/auth/sign-out");
               return null;
            }
         });
   };

   const classStartAppEval = (printData) => {
      const clstLandRule = CLASS_START_LAND_RULES[printData.inst_region]?.[printData.inst_stage];
      const clstFascRule = CLASS_START_FACILITY_RULES[printData.inst_stage];
      setInstMinAmount({ land_total: clstLandRule, ...clstFascRule });
   }

   useEffect(() => {
      const fetchPrintData = async () => {
         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const id_order = params.get('id_order');
         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(null);

         setInstMinAmount([]);

         setStatus({ loading: 'তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...', error: false, success: false });

         if (!id_order) {
            setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
         } else {
            const dataError = InputValidation.addressCheck(id_order);
            if (dataError) {
               setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
            } else {
               try {
                  const response = await axiosApi.post(`/institute/class_start/print_order`, { id_order: id_order });
                  if (response.status === 200) {
                     setPrintData(response.data.data);
                     await fetchProfileSign(response.data.data.id_signed);
                     classStartAppEval(response.data.data);
                     setStatus({ loading: false, error: false, success: true });
                  } else {
                     setStatus({ loading: false, error: "কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!", success: false });
                  }
               } catch (err) {
                  setStatus({ loading: false, error: "কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!", success: false });
               } finally {
                  setStatus((prev) => ({ ...prev, loading: false }));
               }
            }

         }
      };
      const timer = setTimeout(() => {
         fetchPrintData();
      }, 10);

      return () => clearTimeout(timer);
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   useEffect(() => {
      const checkPopupPermission = () => {
         if (status.success) {
            const newWindow = window.open("about:blank", "_blank", "width=1,height=1");
            if (newWindow) {
               newWindow.close(); // Close the test window immediately
               handlePrint();
            } else {
               alert("সরাসরি প্রিন্ট করতে ব্রাইজার সেটিংসে পপআপ ব্লকার বন্ধ করুন...");
            }
         }
      };

      const timer = setTimeout(() => {
         checkPopupPermission();
      }, 1000);

      return () => clearTimeout(timer);
   }, [status.success]);// eslint-disable-line react-hooks/exhaustive-deps

   if (status.success) return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col ref={printRef} id="print-area" md={8} className='m-0 p-2'>
               <Card className="m-0 p-0 card-transparent shadow-none d-flex justify-content-center">
                  <Card.Header className="border-1 border-bottom border-dark d-flex justify-content-around align-items-start m-0 p-0 pb-2 px-5">
                     <LogoMedium color={true} />
                     <div>
                        <h6 className={"logo-title text-center"}>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h6>
                        <h6 className={"logo-title text-center"}>মাধ্যমিক ও উচ্চশিক্ষা বিভাগ</h6>
                        <h6 className={"logo-title text-center"}>{app_bn_name}</h6>
                     </div>
                     <GovLogo color={true} />
                  </Card.Header>
                  <Card.Body className="p-2 m-0">
                     <h6 className={'d-flex flex-row justify-content-between align-items-end pb-2 w-100'}>
                        <span className={'d-block text-center'}>স্মারক নম্বরঃ {InputValidation.E2BDigit(String(printData.id_invoice).split("INVCLST")[1])}
                        </span>
                        <span className={'d-block text-center'}>তারিখঃ {InputValidation.E2BDigit(InputValidation.formatedDate(printData.signed_date))}</span>
                     </h6>
                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-2"}>বিষয়ঃ {printData.bn_dist} জেলার {printData.bn_uzps} উপজেলাধীন {printData.inst_bn_name} এর {printData.clst_status} পর্যায়ে পাঠদানের প্রাথমিক অনুমতি প্রদান প্রসঙ্গে।</h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-2"}>সূত্রঃ বোর্ডের মঞ্জুরি কমিটির {InputValidation.E2BDigit(InputValidation.formatedDate(printData.grant_assembly_date))} তারিখের {InputValidation.E2BDigit(printData.grant_assembly)} সভার সুপারিশ এবং {InputValidation.E2BDigit(InputValidation.formatedDate(printData.board_assembly_date))} তারিখে অনুষ্ঠিত {InputValidation.E2BDigit(printData.board_assembly)} তম বোর্ড সভার অনুমোদিত সিদ্ধান্ত।{printData.board_assebmly}</h6>

                     <h6 style={{ textAlign: 'justify' }} className={' pb-2'}>উপর্যুক্ত বিষয় ও সূত্রের প্রেক্ষিতে নির্দেশক্রমে জানানো যাচ্ছে যে, বর্ণিত প্রতিষ্ঠানটিকে নিচে উল্লেখিত শর্তে <b>বিশেষত অবকাঠামোর শর্ত পূরণ সাপেক্ষে</b> {printData.clst_status} পর্যায়ে পাঠদানের প্রাথমিক অনুমতি প্রদান করা হলো। প্রতিষ্ঠানে জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ডের নির্ধারিত পাঠ্যসূচি ও কেবলমাত্র বোর্ড কর্তৃক অনুমতিপ্রাপ্ত বিষয়সমূহ পাঠদান করতে হবে এবং প্রদত্ত মেয়াদকালের মধ্যে স্বীকৃতির জন্য ফি জমাসহ আবেদন পেশ ও আরোপিত শর্তাদি পূরণের ব্যবস্থা করতে হবে।</h6>

                     <h6 className={'text-decoration-underline'}>শর্তাবলীঃ</h6>

                     <h6 style={{ textAlign: 'justify' }}>
                        <small>
                           ০১। {printData.clst_status} পর্যায়ে পাঠদানের অনুমতি কোনক্রমেই স্বীকৃতি হিসেবে গণ্য করা যাবে না। <br />
                           ০২। নীতিমালা অনুযায়ী কমপক্ষে {InputValidation.E2BDigit(instMinAmount.land_total)} শতক জমি থাকতে হবে এবং উক্ত জমিতে ভবন নির্মাণ করে শিক্ষা কার্যক্রম পরিচালনা করতে হবে। কোন অবস্থায় ভাড়াকৃত বাড়িতে শিক্ষা কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ০৩। নিয়োগকৃত শিক্ষক-কর্মচারীদের বেতন-ভাতাদি সংশ্লিষ্ট শিক্ষা প্রতিষ্ঠানের নিজস্ব তহবিল হতে পরিশোধ করতে হবে। <br />
                           ০৪। গর্ভনিং বডি ও ম্যানেজিং কমিটির প্রবিধানমালা-২০২৪ অনুযায়ী এই স্মারক ইস্যুর ৩০ (ত্রিশ) দিনের মধ্যে নির্বাহী কমিটি গঠন করতে হবে। <br />
                           ০৫। ব্যানবেইস হতে স্ব-উদ্যোগে EIIN সংগ্রহ করে বিদ্যালয়/কলেজ শাখায় জমা দিতে হবে এবং প্রতিষ্ঠানের Password সংগ্রহ করতে হবে। <br />
                           ০৬। বেসরকারি প্রতিষ্ঠানের জনকাঠামো ও এমপিও নীতিমালা এর অনুমোদিত স্টাফিং, প্যাটার্ন অনুযায়ী যোগ্যতাসম্পন্ন জনবল নিয়োগ করতে হবে। <br />
                           ০৭। পর্যায়ক্রমে সকল শিক্ষেককে প্রশিক্ষণ গ্রহণ করতে হবে। <br />
                           ০৮। প্রতিষ্ঠানে ন্যূনতম {InputValidation.E2BDigit(instMinAmount.total_books[0])} বই বিশিষ্ট পাঠাগার এবং ন্যূনতম {InputValidation.E2BDigit(instMinAmount.total_computer[0])} টি কম্পিউটার বিশিষ্ট ল্যাব এবং খেলার মাঠ থাকতে হবে। বিশুদ্ধ খাবার পানি সরবরাহ এবং ছাত্র-ছাত্রীদের পৃথক শৌচাগারের ব্যবস্থা থাকতে হবে। <br />
                           ০৯। প্রতিষ্ঠানের রেকর্ডপত্র সঠিকভাবে সংরক্ষণ করতে হবে। <br />
                           ১০। প্রতিষ্ঠানের নিজস্ব Website এবং Email Address থাকতে হবে। <br />
                           ১১। ছাত্র-ছাত্রীদের কোন অবস্থাতেই বেত্রাঘাত করা যাবে না বরং তাদের সাথে সহনশীল মনোভাব প্রদর্শন করতে হবে।<br />
                           ১২। সাধারণ তহবিলে ={InputValidation.E2BDigit(instMinAmount.general_fund[0])}/- টাকা এবং সংরক্ষিত তহবিলে ={InputValidation.E2BDigit(instMinAmount.reserved_fund[0])}/- টাকা সঞ্চয়পত্র বা স্থায়ী আমানত হিসেবে রাখতে হবে। সংরক্ষিত তহবিলের অর্থ, বোর্ডের অনুমতি ব্যতীত উত্তোলন করা যাবে না। <br />
                           ১৩। জাতীয় দিবস সমূহ, বার্ষিক ক্রীড়া/খেলাধুলা/সাঁতার, সাহিত্য ও সংস্কৃতি বিষয়ক অনুষ্ঠান, বিতর্ক প্রতিযোগীতা, বিজ্ঞান মেলা, বৃক্ষরোপন, স্কাউটিং/গার্ল গাইড, স্টুডেন্ট কেবিনেট, পরিষ্কার-পরিচ্ছন্নতা ইত্যাদি কার্যক্রম প্রহণ এবং সীমানা প্রাচীর নির্মাণ করতে হবে। <br />
                           ১৪। ধর্মীয় এবং সামাজিক মূল্যবোধ ইত্যাদির সাথে সাংঘর্ষিক কোন কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ১৫। বেসরকারি প্রতিষ্ঠানের প্রচলিত নীতিমালার অন্যান্য শর্ত মেনে চলতে হবে এবং কোন শর্ত প্রতিপারনে ব্যর্থ হলে বোর্ড/সরকার যে কোন সময় এ অনুমোদন বাতিল করতে পারে।<br />
                           <i>দাখিলকৃত তথ্য ভূল প্রমাণিত হলে উক্ত আদেশ বাতিল বলে গণ্য হবে।</i>
                        </small>
                     </h6>

                     <h6 className={'d-flex flex-row justify-content-between align-items-end w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/class-start/order?id_order=${printData.id_invoice}`} size={100} />
                        <span className={'d-block text-center'}><br /> <Image className="p-1 w-50" src={profileSign} alt="Authorized Signature" /><br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-2"}><small>{printData.inst_bn_name}, {printData.bn_uzps}, {printData.bn_dist}।</small></h6>

                     <section></section>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-decoration-underline text-uppercase pt-3"}><small >অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরণ করা হলো (জ্যেষ্ঠতার ক্রমানুসারে নয়):</small></h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-2"}>
                        <small>
                           ০১। সিনিয়র সচিব, সিনিয়র সচিবের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা বিভাগ। <br />
                           ০২। মহাপরিপালক, মহাপরিপালকের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর। <br />
                           ০৩। মহাপরিপালক, মহাপরিপালকের দপ্তর, বাংলাদেশ শিক্ষাতথ্য ও পরিসংখ্যান ব্যুরো (ব্যানবেইস)। <br />
                           ০৪। পরীক্ষা নিয়ন্ত্রক, মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা। <br />
                           ০৫। জেলা প্রশাসক, জেলা প্রশাসকের কার্যালয়, {printData.bn_dist}। <br />
                           ০৬। পরিচালক, পরিচালকের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা কুমিল্লা অঞ্চল, কুমিল্লা। <br />
                           ০৭। সিনিয়র সিস্টেম এনালিস্ট, মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা। <br />
                           ০৮। জেলা শিক্ষা কর্মকর্তা, জেলা শিক্ষা অফিস, {printData.bn_dist}। <br />
                           ০৯। সংশ্লিষ্ট নথি।
                        </small>
                     </h6>

                     <h6 className={'d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/class-start/order?id_order=${printData.id_invoice}`} size={100} />
                        <span className={'d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /> <br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>
                  </Card.Body>
               </Card>
            </Col>
            <Col md={8} className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
               {prevLink && <Button className='flex-fill' onClick={handleRedirect} type="button" variant="btn btn-outline-warning">ফিরে যান</Button>}
               <Button className='flex-fill' onClick={() => handlePrint(printRef, 'A4', "প্রিন্ট")} type="button" variant="btn btn-outline-success">প্রিন্ট করুন</Button>
            </Col>
         </Row>
      </Fragment>
   );

   return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-content-center vh-100 vw-100 bg-white">
            <Col md={8} className='d-flex flex-column justify-content-center align-items-center'>
               {status.loading && <h5 className="mb-4 text-center text-info">{status.loading}</h5>}
               {status.error && <h5 className="mb-4 text-center text-danger">{status.error}</h5>}
               {status.error && <Button onClick={() => handleRedirect()} type="button" variant="btn btn-outline-primary">বোর্ড হোম</Button>}
               {status.success && < h4 className="mb-4 text-center text-success">{status.success}</h4>}
            </Col>
         </Row>
      </Fragment>
   );
}

export default ClassStartOrder
