import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Image, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import LogoMedium from '../../../components/partials/components/logo-medium.jsx'
import GovLogo from '../../../components/partials/components/gov-logo.jsx'

import * as ValidationInput from '../input_validation.js';

import { CLASS_START_LAND_RULES } from '../institute/rules/class_rules.jsx';
import { ESTABLISHMENT_RULES } from '../institute/rules/estb_rules.jsx';

import { handlePrint } from '../handlers/print.jsx';

const EstablishmentOrder = () => {
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const app_bn_name = useSelector(SettingSelector.app_bn_name);

   const navigate = useNavigate();

   const handleRedirect = (() => {
      if (prevLink) {
         navigate(prevLink);
      } else {
         navigate('/');
      }
   });

   const [prevLink, setPrevLink] = useState(null);
   const [printData, setPrintData] = useState(false);
   const [profileSign, setProfileSign] = useState(null);

   const [status, setStatus] = useState({ loading: false, error: false, success: false });

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

   const distancePopulationEval = (printData) => {
      const clstRule = CLASS_START_LAND_RULES[printData.inst_region]?.[printData.inst_status];
      const estbRule = ESTABLISHMENT_RULES[printData.inst_region]?.[printData.inst_status];
      setInstMinAmount({ land: clstRule, ...estbRule });
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
            const dataError = ValidationInput.addressCheck(id_order);
            if (dataError) {
               setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
            } else {
               try {
                  const response = await axiosApi.post(`/institute/establishment/print_order`, { id_order: id_order });
                  if (response.status === 200) {
                     setPrintData(response.data.data);
                     await fetchProfileSign(response.data.data.id_signed);
                     distancePopulationEval(response.data.data);
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
      }, 100);

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
            <Col ref={printRef} id="print-area" md="8" className='m-0 p-2'>
               <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0">
                  <Card.Header className="d-flex border-1 border-bottom border-dark justify-content-around align-items-start m-0 p-2">
                     <LogoMedium color={true} />
                     <div>
                        <h6 className={"logo-title text-center pb-1"}>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h6>
                        <h6 className={"logo-title text-center pb-1"}>মাধ্যমিক ও উচ্চশিক্ষা বিভাগ</h6>
                        <h6 className={"logo-title text-center pb-1"}>{app_bn_name}</h6>
                     </div>
                     <GovLogo color={true} />
                  </Card.Header>
                  <Card.Body className="p-2 m-0">
                     <h6 className={'d-flex flex-row justify-content-between align-items-end m-0 pb-3 w-100'}>
                        <span>স্মারক নম্বরঃ {ValidationInput.E2BDigit(String(printData.id_invoice).split("INVEST")[1])}
                        </span>
                        <span>তারিখঃ {ValidationInput.E2BDigit(ValidationInput.formatedDate(printData.signed_date))}</span>
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-3"}>
                        বিষয়ঃ {printData.bn_dist} জেলার {printData.bn_uzps} উপজেলাধীন {printData.bn_status} পর্যায়ে {printData.inst_bn_name} নামীয় প্রতিষ্ঠান স্থাপনের প্রাথমিক অনুমতি প্রদান প্রসঙ্গে।
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pb-3"}>সূত্রঃ বোর্ডের মঞ্জুরি কমিটির {ValidationInput.E2BDigit(ValidationInput.formatedDate(printData.grant_assembly_date))} তারিখের {ValidationInput.E2BDigit(printData.grant_assembly)} সভার সুপারিশ এবং {ValidationInput.E2BDigit(ValidationInput.formatedDate(printData.board_assembly_date))} তারিখে অনুষ্ঠিত {ValidationInput.E2BDigit(printData.board_assembly)} তম বোর্ড সভার অনুমোদিত সিদ্ধান্ত।{printData.board_assebmly}</h6>

                     <h6 style={{ textAlign: 'justify' }} className={'pb-3'}>উপর্যুক্ত বিষয় ও সূত্রের প্রেক্ষিতে নির্দেশক্রমে জানানো যাচ্ছে যে, বর্ণিত প্রতিষ্ঠানটিকে নিচে উল্লেখিত শর্তে <b>বিশেষত অবকাঠামোর শর্ত পূরণ সাপেক্ষে</b> {printData.clst_status} পর্যায়ে স্থাপনের প্রাথমিক অনুমতি প্রদান করা হলো। নীতিমালা অনুযায়ী অবকাঠামো তৈরি সম্পন্ন হলে পাঠদানের অনুমতির জন্য বোর্ডের নির্ধারিত ফি জমা দিয়ে আবেদন করতে হবে এবং আরোপিত শর্তাদি পূরণের ব্যবস্থা করতে হবে।</h6>

                     <h6 className={'text-decoration-underline'}>শর্তাবলীঃ</h6>
                     <h6 style={{ textAlign: 'justify' }}>
                        <small>
                           ০১। {printData.bn_status} পর্যায়ে স্থাপনের অনুমতি কোনক্রমেই স্বীকৃতি/পাঠদানের অনুমতি হিসেবে গণ্য করা যাবে না। <br />
                           ০২। নীতিমালা অনুযায়ী কমপক্ষে {ValidationInput.E2BDigit(instMinAmount.land)} শতক জমি থাকতে হবে এবং উক্ত জমিতে ভবন নির্মাণ করে শিক্ষা কার্যক্রম পরিচালনা করতে হবে। কোন অবস্থায় ভাড়াকৃত বাড়িতে শিক্ষা কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ০৩। প্রতিষ্ঠানের চতুর্দিকে সমপর্যায়ের অন্য প্রতিষ্ঠানের দূরত্ব কমপক্ষে {ValidationInput.E2BDigit(instMinAmount.distance)} কিলোমিটার এবং প্রতিষ্ঠান এলাকায় জনস্যখ্যা কমপক্ষে {ValidationInput.E2BDigit(instMinAmount.population)} হতে হবে হবে। <br />
                           ০৪। ব্যানবেইস হতে স্ব-উদ্যোগে EIIN সংগ্রহ করে বিদ্যালয়/কলেজ শাখায় জমা দিতে হবে। <br />
                           ০৫। বেসরকারি প্রতিষ্ঠানের জনকাঠামো ও এমপিও নীতিমালা এর অনুমোদিত স্টাফিং, প্যাটার্ন অনুযায়ী যোগ্যতাসম্পন্ন জনবল নিয়োগ করতে হবে। <br />
                           ০৬। পর্যায়ক্রমে সকল শিক্ষেককে প্রশিক্ষণ গ্রহণ করতে হবে। <br />
                           ০৭। প্রতিষ্ঠানে ন্যূনতম {instMinAmount.total_books} বই বিশিষ্ট পাঠাগার এবং ন্যূনতম {instMinAmount.total_computer} টি কম্পিউটার বিশিষ্ট ল্যাব এবং খেলার মাঠ থাকতে হবে। বিশুদ্ধ খাবার পানি সরবরাহ এবং ছাত্র-ছাত্রীদের পৃথক শৌচাগারের ব্যবস্থা থাকতে হবে। <br />
                           ০৮। প্রতিষ্ঠানের রেকর্ডপত্র সঠিকভাবে সংরক্ষণ করতে হবে। <br />
                           ০৯। প্রতিষ্ঠানের নিজস্ব Website এবং Email Address থাকতে হবে। <br />
                           ১০। ছাত্র-ছাত্রীদের কোন অবস্থাতেই বেত্রাঘাত করা যাবে না বরং তাদের সাথে সহনশীল মনোভাব প্রদর্শন করতে হবে।<br />
                           ১১। জাতীয় দিবস সমূহ, বার্ষিক ক্রীড়া/খেলাধুলা/সাঁতার, সাহিত্য ও সংস্কৃতি বিষয়ক অনুষ্ঠান, বিতর্ক প্রতিযোগীতা, বিজ্ঞান মেলা, বৃক্ষরোপন, স্কাউটিং/গার্ল গাইড, স্টুডেন্ট কেবিনেট, পরিষ্কার-পরিচ্ছন্নতা ইত্যাদি কার্যক্রম প্রহণ এবং সীমানা প্রাচীর নির্মাণ করতে হবে। <br />
                           ১২। ধর্মীয় এবং সামাজিক মূল্যবোধ ইত্যাদির সাথে সাংঘর্ষিক কোন কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ১৩। বেসরকারি প্রতিষ্ঠানের প্রচলিত নীতিমালার অন্যান্য শর্ত মেনে চলতে হবে এবং কোন শর্ত প্রতিপালনে ব্যর্থ হলে বোর্ড/সরকার যে কোন সময় এ অনুমোদন বাতিল করতে পারে।<br /><br />
                           <i>দাখিলকৃত তথ্য ভূল প্রমাণিত হলে উক্ত আদেশ বাতিল বলে গণ্য হবে।</i>
                        </small>
                     </h6>

                     <h6 className={'d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment/order?id_order=${printData.id_invoice}`} size={100} />
                        <span className={'d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /><br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase py-2"}><small>{printData.inst_bn_name}, {printData.bn_uzps}, {printData.bn_dist}।</small></h6>

                     <section> <br /> </section>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-decoration-underline text-uppercase pt-3"}><small >অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরণ করা হলো (জ্যেষ্ঠতার ক্রমানুসারে নয়):</small></h6>

                     <h6 style={{ textAlign: 'justify' }} className={"text-left text-uppercase pt-1"}>
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
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment/order?id_order=${printData.id_invoice}`} size={100} />
                        <span className={'d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /> <br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>
                  </Card.Body>
               </Card>
            </Col>
            <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
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

export default EstablishmentOrder
