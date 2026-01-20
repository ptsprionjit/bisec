import React, { useEffect, Fragment, useRef, useState } from 'react';
import { Row, Col, Button, Card } from 'react-bootstrap';
import { useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import LogoMedium from '../../../components/partials/components/logo-medium';
import * as SettingSelector from '../../../store/setting/selectors';
import * as InputValidation from '../input_validation';
import { FadeLoader } from 'react-spinners';

import { handlePrint } from '../handlers/print.jsx';

const PaymentFailed = () => {
   const navigate = useNavigate();
   const printRef = useRef();
   const app_name = useSelector(SettingSelector.app_bn_name);

   const app_bn_name = useSelector(SettingSelector.app_bn_name);
   const app_bn_address = useSelector(SettingSelector.app_bn_address);
   const app_phone = useSelector(SettingSelector.app_phone);
   const app_email = useSelector(SettingSelector.app_email);

   const [urlData, setUrlData] = useState({ tokenData: false, prevLink: false, errosMessage: false, statusData: false });

   const curDateTime = new Date(new Date().getTime() + 12 * 60 * 60 * 1000).toISOString().replace('T', ' ').split('.')[0];

   const handleWindowClose = () => {
      if (urlData.prevLink) {
         navigate(urlData.prevLink);
      } else {
         navigate('/');
      }
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const tokenData = params.get('token');
      const prevLink = params.get('prev_location');
      const errosMessage = params.get('error');
      const statusData = params.get('status');

      setUrlData({ tokenData: tokenData, prevLink: prevLink, errosMessage: errosMessage, statusData: statusData });
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   if (urlData.tokenData) return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-start bg-white vh-100">
            <Col md="8" ref={printRef} className='p-2'>
               <Card className="card-transparent shadow-none auth-card pt-3">
                  <Card.Header className="d-flex flex-column justify-content-center m-0 p-2">
                     <Col md={12} className="border-bottom border-dark d-flex justify-content-center align-items-start">
                        <LogoMedium color={true} />
                        <div className='ms-3'>
                           <h5 className="text-center py-1">{app_bn_name}</h5>
                           <h6 className="text-center py-1">{app_bn_address}</h6>
                           <small className="text-center text-black py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                        </div>
                     </Col>
                     <p className='m-0 p-1 text-end'>
                        প্রিন্ট তারিখঃ {InputValidation.E2BDigit(curDateTime)}
                     </p>
                  </Card.Header>
                  <Card.Body>
                     <h6 className='py-3 text-dark' style={{ textAlign: 'justify' }}>
                        আপনার পেমেন্ট রিকুয়েস্ট সফল হয়নি। রিকুয়েস্টটি পেমেন্ট গেটওয়ে থেকে বাতিল হয়েছে।
                        যদি আপনার হিসাব থেকে টাকা কেটে নেয় তবে এই পেজটি প্রিন্ট করে প্রিন্টকপি সহ <b>{app_name}</b> যোগাযোগ করুন।
                     </h6>
                     {String(urlData.tokenData).length > 20 && <h6 className='py-3'>রিকুয়েস্ট টোকেনঃ {urlData.tokenData}</h6>}
                     {urlData.statusData && <h6 className='py-3' style={{ textAlign: 'justify' }}>রিকুয়েস্ট স্ট্যাটাসঃ {InputValidation.E2BDigit(urlData.statusData)}</h6>}
                     {urlData.errosMessage && <h6 className='py-3' style={{ textAlign: 'justify' }}>রিকুয়েস্ট মেসেজঃ {urlData.errosMessage}</h6>}
                  </Card.Body>
               </Card>
            </Col>
            <Col md="8" className='p-2'>
               <Card className="card-transparent shadow-none auth-card pt-3">
                  <Card.Body className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
                     <Button className='flex-fill' onClick={handleWindowClose} variant="btn btn-outline-warning">ফিরে যান</Button>
                     <Button className='flex-fill' onClick={() => handlePrint(printRef, 'A4', "প্রিন্ট")} variant="btn btn-outline-success">প্রিন্ট করুন</Button>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );

   return (
      <Fragment>
         <Row className='m-0 p-0 d-flex flex-column justify-content-center align-items-center vh-100'>
            <p className='text-center text-dark'>অপেক্ষা করুন... সার্ভার থেকে তথ্য সংগ্রহ করা হচ্ছে...</p>
            <FadeLoader
               color="#000000"
               loading={true}
               radius={15}
               width={5}
               height={20}
            />
         </Row>
      </Fragment>
   );
};

export default PaymentFailed;
