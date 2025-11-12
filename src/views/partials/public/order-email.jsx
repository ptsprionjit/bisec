import React, { useRef, useEffect, useState } from 'react'
import { Row, Col, Table, Button, Image } from 'react-bootstrap'

import { useNavigate } from 'react-router-dom'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import Card from '../../../components/Card'

import LogoMedium from '../../../components/partials/components/logo-medium'
// import * as SettingSelector from '../../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import Error404 from '../errors/error404'

const OrderEmail = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   var curDateTime = new Date();
   curDateTime.setHours(curDateTime.getUTCHours() + 12);
   curDateTime = curDateTime.toISOString().split('T')[0] + ' ' + curDateTime.toISOString().split('T')[1].split('.')[0];

   // const appName = useSelector(SettingSelector.app_name);

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const navigate = useNavigate();
   const handleWindowClose = (() => {
      // Use URLSearchParams to parse query params more cleanly
      const params = new URLSearchParams(window.location.search);
      const prev_location = params.get('prev_location');
      if (prev_location) {
         navigate(prev_location);
      } else {
         window.close();
      }
   });

   const [prevLink, setPrevLink] = useState(null);

   const [printSuccess, setPrintSuccess] = useState(false);

   const [fetchedData, setFetchedData] = useState([]);

   const [profileSign, setProfileSign] = useState(null);


   const printRef = useRef();

   const handlePrint = () => {
      const printContent = printRef.current.innerHTML;
      const printWindow = window.open('', '', 'fullscreen=yes');

      printWindow.document.write(`
         <html>
            <head>
               <title>Print</title>
               <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css">
               <link href="https://fonts.maateen.me/siyam-rupali/font.css" rel="stylesheet">
               <style>
                  @page {
                     size: A4 portrait !important;
                     margin: 0 !important;
                     padding: 0.25in !important;
                     div, table, tr, th, td, p, span {
                        page-break-inside: avoid !important;
                     }
                     section {
                        page-break-before: always !important;
                     }
                  }
                  *{
                     font-family: 'Siyam Rupali', sans-serif;
                  }
                  .no-print {
                     display: none;
                  }
               </style>
            </head>
            <body>
               <div class="d-flex justify-content-center align-items-start">${printContent}</div>
               <script>
                  window.onload = function() {
                     window.print();
                     window.onafterprint = function() { 
                        window.close();
                     };
                  };
               </script>
            </body>
         </html>
      `);
      printWindow.document.close();
      window.close();
   };

   //Signed Signatute Fetch
   const fetchProfileSign = async (id_signed) => {
      await axios.post(`${BACKEND_URL}/signed/sign-fetch?`, { id_signed: id_signed }, { responseType: 'blob' })
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

         if (!id_email) {
            setPrintSuccess(false);
         } else {
            try {
               const response = await axios.post(`${BACKEND_URL}/order-emails`, { id_email });
               setFetchedData(response.data);
               fetchProfileSign(response.data.id_sender);
               setPrintSuccess(true);
            } catch (err) {
               if (err.status === 401) {
                  navigate("/auth/sign-out");
               }
               setPrintSuccess(false);
               setFetchedData([]);
               alert("কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!");
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
         const newWindow = window.open("about:blank", "_blank", "width=1,height=1");
         if (newWindow) {
            newWindow.close(); // Close the test window immediately
            if (printSuccess) {
               handlePrint();
            }
         } else {
            alert("সরাসরি প্রিন্ট করতে ব্রাইজার সেটিংসে পপআপ ব্লকার বন্ধ করুন...");
         }
      };

      const timer = setTimeout(() => {
         checkPopupPermission();
      }, 1000);

      return () => clearTimeout(timer);
   }, [printSuccess]);// eslint-disable-line react-hooks/exhaustive-deps

   if (printSuccess) return (
      <Row className="m-0 p-0 d-flex justify-content-center align-items-center bg-white">
         <Col ref={printRef} id="print-area" md="8" className='p-0 m-0'>
            <Card className="card-transparent shadow-none auth-card p-0 m-0">
               <Card.Header className="d-flex flex-column justify-content-center m-0 p-0 pt-2">
                  <Col md={12} className="border-bottom m-0 p-0 pb-1 border-dark d-flex justify-content-center align-items-start">
                     <LogoMedium color={true} />
                     <div className='ms-3'>
                        {/* <p className="text-center border border-1 border-dark fs-6 m-0  p-0"><span className={styles.SiyamRupaliFont}>নকলকে না বলি, দিন বদলের দৃঢ় প্রত্যয়ে দেশটাকে গড়ে তুলি</span></p> */}
                        <h4 className="logo-title text-center"><span className={styles.SiyamRupaliFont}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</span></h4>
                        <h5 className="text-center"><span className={styles.SiyamRupaliFont}>লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</span></h5>
                        <h6 className="text-center"><small className={styles.SiyamRupaliFont}>ফোনঃ <i>(+৮৮০) ২৩৩৪৪০৬৩২৮</i>, ইমেইলঃ <i>admin@cumillaboard.gov.bd</i></small></h6>
                     </div>
                  </Col>
               </Card.Header>
               <Card.Body className="p-2 m-0">
                  <div className='d-flex justify-content-between align-items-center'>
                     <h6 className={styles.SiyamRupaliFont}>স্বারক নংঃ {fetchedData.email_ref}</h6>
                     <h6 className={styles.SiyamRupaliFont}>তারিখঃ {String(fetchedData.email_datetime).split(' ')[0]}</h6>
                  </div>
                  <h6 className={styles.SiyamRupaliFont + "  py-2 text-uppercase"}>{fetchedData.name_recipient}</h6>
                  <h6 className={styles.SiyamRupaliFont + " py-1"}>{fetchedData.recipient_upzila}, {fetchedData.recipient_dist}</h6>
                  <h6 className={styles.SiyamRupaliFont + " py-2 text-decoration-underline"}>বিষয়ঃ {fetchedData.email_subject}</h6>
                  <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " py-2"}>জনাব/মহোদয়,</h6>
                  <h6 style={{ textAlign: 'justify' }} className={styles.text_justify + " py-2"}><span className={styles.SiyamRupaliFont}>{fetchedData.email_message}</span></h6>
                  <h6 style={{ textAlign: 'justify' }} className={styles.text_justify + " py-2 text-decoration-underline"}><span className={styles.SiyamRupaliFont}>{fetchedData.email_topic} এর প্রাথমিক তথ্যঃ</span></h6>

                  <Row className='table-responsive px-2 m-0'>
                     <Table className='table m-0 p-2'>
                        <tbody>
                           <tr>
                              <td className='text-wrap text-left p-0 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                              <td className='text-wrap text-left p-0 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                              <td className='text-wrap text-left p-0 m-0'><span className={styles.SiyamRupaliFont}>{fetchedData.topic_uname}</span></td>
                           </tr>
                           <tr>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>আইডি</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>:</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>{fetchedData.topic_uid}</span></td>
                           </tr>
                           <tr>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>মোবাইল</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>:</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>{fetchedData.topic_umobile}</span></td>
                           </tr>
                           <tr>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>ইমেইল</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>:</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>{fetchedData.topic_uemail}</span></td>
                           </tr>
                           <tr>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>ঠিকানা</span></td>
                              <td className='text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>:</span></td>
                              <td className='text-uppercase text-wrap text-left p-0 m-0 py-1'><span className={styles.SiyamRupaliFont}>{fetchedData.topic_uaddress}</span></td>
                           </tr>
                        </tbody>
                     </Table>
                  </Row>

                  <h6 className={styles.SiyamRupaliFont + ' d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                     <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment-order?order-id=${fetchedData.id_invoice}`} size={100} />
                     <span className={styles.SiyamRupaliFont + ' d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /><br />( {fetchedData.profile_bnname || fetchedData.profile_name} )<br /> {fetchedData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                  </h6>

                  <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " py-2 text-left text-decoration-underline text-uppercase"}><small className={styles.SiyamRupaliFont}>অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরণ করা হলো (জ্যেষ্ঠতার ক্রমানুসারে নয়):</small></h6>

                  <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-uppercase pt-1"}>
                     <small className={styles.SiyamRupaliFont}>
                        <p className={styles.SiyamRupaliFont + " p-0 m-0 ps-4 text-left"}>০১। {fetchedData.name_recipient_cc1}, {fetchedData.recipient_dist}</p>
                        <p className={styles.SiyamRupaliFont + " p-0 m-0 ps-4 text-left"}>০২। {fetchedData.name_recipient_cc2}, {fetchedData.recipient_dist}</p>
                        <p className={styles.SiyamRupaliFont + " p-0 m-0 ps-4 text-left"}>০৩। {fetchedData.name_recipient_cc3}, {fetchedData.recipient_upzila}, {fetchedData.recipient_dist}</p>
                     </small>
                  </h6>

                  <h6 className={styles.SiyamRupaliFont + ' d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                     <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment-order?order-id=${fetchedData.id_invoice}`} size={100} />
                     <span className={styles.SiyamRupaliFont + ' d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /><br />( {fetchedData.profile_bnname || fetchedData.profile_name} )<br /> {fetchedData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                  </h6>
               </Card.Body>
            </Card>
         </Col>
         <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
            {prevLink && <Button className='flex-fill' onClick={handleWindowClose} type="button" variant="btn btn-secondary">Close</Button>}
            <Button className='flex-fill' onClick={handlePrint} type="button" variant="btn btn-info">Print</Button>
         </Col>
      </Row>
   );

   return (
      <Error404 />
   );
}

export default OrderEmail
