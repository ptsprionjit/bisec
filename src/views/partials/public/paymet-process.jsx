import React, { useEffect, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { Row, Col } from 'react-bootstrap'

import axiosApi from "../../../lib/axiosApi.jsx";

import Card from '../../../components/Card'

import LogoMedium from '../../../components/partials/components/logo-medium'

import * as ValidationInput from '../input_validation';

import { FadeLoader } from 'react-spinners';

const PaymentProcess = () => {
   const navigate = useNavigate();

   // Fetch Data
   useEffect(() => {
      const updatePayData = async () => {
         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const payData = {};
         payData.pay_token = params.get('session_token');
         payData.pay_status = params.get('status');

         if (!payData?.pay_token || !payData?.pay_status) {
            navigate(`/payment/response/failed?error=পেমেন্ট রিকুয়েস্ট ডাটা পাওয়া যায়নি&status=null&token=${payData.pay_token}&invoiceNo=null&prev_location=/`);
         } else {
            const dataError = ValidationInput.addressCheck(payData.pay_token);
            if (dataError) {
               navigate(`/payment/response/failed?error=পেমেন্ট রিকুয়েস্ট ডাটা সঠিক নয়&status=null&token=${payData.pay_token}&invoiceNo=null&prev_location=/`);
            } else {
               try {
                  const response = await axiosApi.post(`/payment/response`, { payData: payData });
                  const resData = response.data.resData;
                  if (response.status === 200) {
                     navigate(`/payment/response/success?message=${resData.message}&status=${resData.status}&invoiceNo=${resData.id_invoice}&prev_location=${resData.prev_link}`);
                  } else {
                     navigate(`/payment/response/failed?error=${resData.message}&status=${resData.status}&token=${payData.pay_token}&invoiceNo=${resData.id_invoice || 'null'}&prev_location=${resData.prev_link}`);
                  }
               } catch (err) {
                  if (err.status === 401) {
                     navigate("/auth/sign-out");
                  }
                  // console.log(err);
                  navigate(`/payment/response/failed?error=${err?.response?.data?.message}&status=${payData.pay_status}&token=${payData.pay_token}&prev_location=/`);
               }
            }
         }
      };
      const timer = setTimeout(() => {
         updatePayData();
      }, 100);

      return () => clearTimeout(timer);
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   return (
      <Fragment>
         <Row className='p-0 m-0'>
            <Col md={12} className='p-0 m-0'>
               <Card className="vh-100 p-0 m-0">
                  <Card.Body className="d-flex flex-column justify-content-center align-items-center">
                     <LogoMedium color={true} />
                     <h5 className={" text-center text-success py-4"}>অপেক্ষা করুন... পেমেন্ট তথ্য আপডেট হচ্ছে...</h5>
                     <h6 className={" text-center text-danger rounded-1 pb-4"}>পেজটি রিলোড বা বন্ধ করবেন না!</h6>
                     <FadeLoader
                        color="#000000"
                        loading={true}
                        radius={15}
                        width={5}
                        height={20}
                     />
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );
}

export default PaymentProcess
