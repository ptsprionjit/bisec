import React, { useEffect, Fragment, useRef } from 'react';
import { Row, Col, Button } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import Card from '../../../components/Card';
import LogoMedium from '../../../components/partials/components/logo-medium';
import * as SettingSelector from '../../../store/setting/selectors';
import styles from '../../../assets/custom/css/bisec.module.css';
import * as InputValidation from '../input_validation';

const PaymentFailed = () => {
   const navigate = useNavigate();
   const printRef = useRef();
   const app_name = useSelector(SettingSelector.app_bn_name);
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const params = new URLSearchParams(window.location.search);
   const tokenData = params.get('token');
   const prevLink = params.get('prev_location');
   const errosMessage = params.get('error');
   const statusData = params.get('status');

   const curDateTime = new Date(new Date().getTime() + 12 * 60 * 60 * 1000)
      .toISOString().replace('T', ' ').split('.')[0];

   const handleWindowClose = () => {
      if (prevLink) return navigate(prevLink);
      navigate(ceb_session?.ceb_user_id ? '/dashboard' : '/');
   };

   useEffect(() => {
      if (!tokenData) navigate(ceb_session?.ceb_user_id ? '/dashboard' : '/');
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

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
                    @page { size: A4 portrait !important; margin: 0 !important; padding: 0.5in !important; }
                    * { font-family: 'Siyam Rupali', sans-serif !important; color: #000; }
                    .print-nowrap { white-space: nowrap !important; }
                    .no-print, .print-hide { display: none !important; }
                    .print-show { display: block !important; }
                </style>
            </head>
            <body>
                <div class="d-flex justify-content-center align-items-start">${printContent}</div>
                <script>
                    window.onload = function() { window.print(); window.onafterprint = () => window.close(); }
                </script>
            </body>
            </html>
        `);
      printWindow.document.close();
      window.close();
   };

   if (!tokenData) return (
      <Fragment>
         <Row className='p-0 m-0'>
            <Col md={12} className='p-0 m-0'>
               <Card className="vh-100 p-0 m-0">
                  <Card.Body className="d-flex flex-column justify-content-center">
                     <Col md={12} className={`${styles.dashboard_loader} mt-5`}></Col>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );

   return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-start bg-white vh-100">
            <Col md="8" ref={printRef} className='p-2'>
               <Card className="card-transparent shadow-none auth-card pt-3">
                  <Card.Header className="d-flex flex-column justify-content-center m-0 p-2">
                     <Col md={12} className="border-bottom border-dark d-flex justify-content-center align-items-start">
                        <LogoMedium color={true} />
                        <div className='ms-3'>
                           <h4 className="logo-title text-center p-1">
                              <span className={styles.SiyamRupaliFont}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</span>
                           </h4>
                           <h5 className="logo-title text-center p-1">
                              <span className={styles.SiyamRupaliFont}>লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</span>
                           </h5>
                           <h6 className="logo-title text-center p-1">
                              <small className={styles.SiyamRupaliFont}>
                                 ফোনঃ <i>(+৮৮০) ২৩৩৪৪০৬৩২৮</i>, ইমেইলঃ <i>admin@cumillaboard.gov.bd</i>
                              </small>
                           </h6>
                        </div>
                     </Col>
                     <p className='m-0 p-1 text-end text-dark'>
                        প্রিন্ট তারিখঃ {InputValidation.E2BDigit(curDateTime)}
                     </p>
                  </Card.Header>
                  <Card.Body>
                     <p className='py-3 text-dark' style={{ textAlign: 'justify' }}>
                        আপনার পেমেন্ট রিকুয়েস্ট সফল হয়নি। রিকুয়েস্টটি পেমেন্ট গেটওয়ে থেকে বাতিল হয়েছে।
                        যদি আপনার হিসাব থেকে টাকা কেটে নেয় তবে এই পেজটি প্রিন্ট করে প্রিন্টকপি সহ <b>{app_name}</b> যোগাযোগ করুন।
                     </p>
                     {tokenData.length > 20 && <p className='py-3'>রিকুয়েস্ট টোকেনঃ {tokenData}</p>}
                     {statusData && <p className='py-3' style={{ textAlign: 'justify' }}>রিকুয়েস্ট স্ট্যাটাসঃ {InputValidation.E2BDigit(statusData)}</p>}
                     {errosMessage && <p className='py-3' style={{ textAlign: 'justify' }}>রিকুয়েস্ট মেসেজঃ {errosMessage}</p>}
                  </Card.Body>
               </Card>
            </Col>
            <Col md="8" className='p-2'>
               <Card className="card-transparent shadow-none auth-card pt-3">
                  <Card.Body className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
                     <Button className='flex-fill' onClick={handleWindowClose} variant="warning">ফিরে যান</Button>
                     <Button className='flex-fill' onClick={handlePrint} variant="primary">প্রিন্ট</Button>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );
};

export default PaymentFailed;
