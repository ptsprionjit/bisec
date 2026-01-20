import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Table, Button, Image, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import LogoMedium from '../../../components/partials/components/logo-medium'

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import * as InputValidation from '../../partials/input_validation';

import { handlePrint } from '../handlers/print.jsx';

const OrderEmail = () => {
   const app_bn_name = useSelector(SettingSelector.app_bn_name);
   const app_bn_address = useSelector(SettingSelector.app_bn_address);
   const app_phone = useSelector(SettingSelector.app_phone);
   const app_email = useSelector(SettingSelector.app_email);

   var curDateTime = new Date();
   curDateTime.setHours(curDateTime.getUTCHours() + 12);
   curDateTime = curDateTime.toISOString().split('T')[0] + ' ' + curDateTime.toISOString().split('T')[1].split('.')[0];

   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const navigate = useNavigate();

   const handleWindowClose = (() => {
      if (prevLink) {
         navigate(prevLink);
      } else {
         navigate('/');
      }
   });

   const [prevLink, setPrevLink] = useState(null);

   const [status, setStatus] = useState({ loading: false, error: false, success: false });

   const [printData, setPrintData] = useState([]);
   const [profileSign, setProfileSign] = useState(null);

   const printRef = useRef();

   //Signed Signatute Fetch
   const fetchProfileSign = async (id_signed) => {
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

   // Fetch Data
   useEffect(() => {
      const fetchPrintData = async () => {
         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const id_email = params.get('id_email');
         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(null);

         setStatus({ loading: 'তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...', error: false, success: false });

         if (!id_email) {
            setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
         } else {
            const dataError = InputValidation.addressCheck(id_email);
            if (dataError) {
               setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
            } else {
               try {
                  const response = await axiosApi.post(`/order-emails`, { id_email });
                  if (response.status === 200) {
                     setPrintData(response.data.emailData);
                     await fetchProfileSign(response.data.emailData.id_sender);
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

   // Check Popup Permission and Print
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
         <Row className="m-0 p-0 d-flex justify-content-center align-items-center bg-white">
            <Col ref={printRef} id="print-area" md={8} className='p-0 m-0'>
               <Card className="card-transparent shadow-none auth-card p-2 m-0">
                  <Card.Header className="d-flex flex-column justify-content-center border-bottom m-0 p-0 border-dark pb-2">
                     <Col md={12} className="m-0 p-0 d-flex justify-content-center align-items-start">
                        <LogoMedium color={true} />
                        <div className='ms-3'>
                           <h5 className="text-center py-1">{app_bn_name}</h5>
                           <h6 className="text-center py-1">{app_bn_address}</h6>
                           <small className="text-center text-black py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                        </div>
                     </Col>
                  </Card.Header>
                  <Card.Body className="p-2 m-0">
                     <div className='d-flex justify-content-between align-items-center mb-2'>
                        <h6>স্বারক নংঃ {InputValidation.E2BDigit(String(printData.email_ref).split("EMAIL")[1])}</h6>
                        <h6 >তারিখঃ {InputValidation.E2BDigit(InputValidation.formatedDate(String(printData.email_datetime).split(' ')[0]))}</h6>
                     </div>
                     <h6 className={"pb-1 text-uppercase"}>{printData.name_recipient}</h6>
                     <h6 className={"pb-3"}>{printData.recipient_upzila}, {printData.recipient_dist}</h6>
                     <h6 className={"pb-3"}>বিষয়ঃ <span className='text-decoration-underline'>{printData.email_subject}</span></h6>
                     <h6 className={"pb-3"}>জনাব/মহোদয়,</h6>
                     <h6 style={{ textAlign: 'justify' }} className={"pb-3"}>{printData.email_message}</h6>
                     <h6 style={{ textAlign: 'justify' }} className={"pb-2 text-decoration-underline"}>{printData.email_topic} সম্পর্কিত প্রাথমিক তথ্যঃ</h6>

                     <Row className='table-responsive m-0 p-0 pb-2'>
                        <Table className='table m-0 p-0'>
                           <tbody>
                              <tr>
                                 <td className='text-wrap text-left p-0 m-0'>নাম</td>
                                 <td className='text-wrap text-left p-0 m-0'>:</td>
                                 <td className='text-wrap text-left p-0 m-0'>{printData.topic_uname}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>আইডি/ইআইআইএন</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>:</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>{InputValidation.E2BDigit(printData.topic_uid)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>মোবাইল</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>:</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>{InputValidation.E2BDigit(printData.topic_umobile)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>ইমেইল</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>:</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>{String(printData.topic_uemail).toLocaleLowerCase()}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>ঠিকানা</td>
                                 <td className='text-wrap text-left p-0 m-0 py-1'>:</td>
                                 <td className='text-wrap text-left text-capitalize p-0 m-0 py-1'>{String(printData.topic_uaddress).toLocaleLowerCase()}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </Row>

                     <h6 className={'d-flex flex-row justify-content-between align-items-end pb-2 w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/order-emails?id_email=${printData.email_ref}`} size={100} />
                        <span className={'d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Authorized Signature" /><br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={"py-2 text-left text-decoration-underline text-uppercase"}></h6>

                     <h6 className={'d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                        <small style={{ textAlign: 'justify' }} className={"text-left text-black m-0 p-0 pb-2"}>
                           <p className={"m-0 p-0 pb-2 text-uppercase"}><u>অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরণ করা হলো (জ্যেষ্ঠতার ক্রমানুসারে নয়):</u></p>
                           <p className={"m-0 p-0 pb-2 ps-4 text-uppercase"}><i>০১। {printData.name_recipient_cc1}, {printData.recipient_dist}</i></p>
                           <p className={"m-0 p-0 pb-2 ps-4 text-uppercase"}><i>০২। {printData.name_recipient_cc2}, {printData.recipient_dist}</i></p>
                           <p className={"m-0 p-0 pb-2 ps-4 text-uppercase"}><i>০৩। {printData.name_recipient_cc3}, {printData.recipient_upzila}, {printData.recipient_dist}</i></p>
                        </small>
                        {/* <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment-order?order-id=${printData.id_invoice}`} size={100} /> */}
                        <span className={'d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Authorized Signature" /><br />( {printData.bn_user} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>
                  </Card.Body>
               </Card>
            </Col>
            <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
               {prevLink && <Button className='flex-fill' onClick={handleWindowClose} type="button" variant="btn btn-warning">ফিরে যান</Button>}
               <Button className='flex-fill' onClick={() => handlePrint(printRef, 'A4', "প্রিন্ট")} type="button" variant="btn btn-info">প্রিন্ট করুন</Button>
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

export default OrderEmail
