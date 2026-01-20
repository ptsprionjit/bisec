import React, { useRef, useEffect, useState, Fragment } from 'react';
import { Row, Col, Table, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import LogoMedium from '../../../components/partials/components/logo-medium.jsx';

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import styles from '../../../assets/custom/css/bisec.module.css';

import * as InputValidation from '../input_validation.js';

import { handlePrint } from '../handlers/print.jsx';

const TcPayResponse = () => {
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;
   const app_bn_name = useSelector(SettingSelector.app_bn_name);
   const app_bn_address = useSelector(SettingSelector.app_bn_address);
   const app_phone = useSelector(SettingSelector.app_phone);
   const app_email = useSelector(SettingSelector.app_email);

   const [prevLink, setPrevLink] = useState(null);

   const navigate = useNavigate();
   const handleRedirect = (() => {
      if (prevLink) {
         navigate(prevLink);
      } else {
         navigate('/');
      }
      window.close();
   });

   const [status, setStatus] = useState({ loading: false, error: false, success: false });

   const [printData, setPrintData] = useState(false);

   const printRef = useRef();

   useEffect(() => {
      const fetchPrintData = async () => {
         setStatus({ loading: 'তথ্য সংগ্রহ করা হচ্ছে... ওয়েবপেজটি বন্ধ/রিফ্রেশ করবেন না!', error: false, success: false });
         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const invoiceNo = params.get('invoiceNo');
         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(null);

         if (!invoiceNo) {
            setStatus({ loading: false, error: 'অনুনোমোদিত প্রবেশ নিষিদ্ধ', success: false });
            return;
         } else {
            const dataStatus = InputValidation.alphanumCheck(invoiceNo);
            if (dataStatus) {
               setStatus({ loading: false, error: dataStatus, success: false });
            } else {
               try {
                  const response = await axiosApi.post(`/student/tc/application/print`, { invoiceNo });
                  setPrintData(response.data);
                  setStatus({ loading: false, error: false, success: 'ছাড়পত্রের আবেদন প্রিন্ট হচ্ছে... অপেক্ষা করুন...' });
               } catch (err) {
                  setStatus({ loading: false, error: 'ছাড়পত্রের আবেদন পাওয়া যায়নি!', success: false });
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
         const newWindow = window.open("about:blank", "_blank", "width=1,height=1");
         if (newWindow) {
            newWindow.close(); // Close the test window immediately
            if (status.success) {
               handlePrint();
            }
         } else {
            alert("সরাসরি প্রিন্ট করতে পপআপ (POP-UP) চালু করুন!");
         }
      };

      const timer = setTimeout(() => {
         checkPopupPermission();
      }, 1000);

      return () => clearTimeout(timer);
   }, [status.success]);// eslint-disable-line react-hooks/exhaustive-deps

   if (status.success) return (
      <Fragment>
         <Row ref={printRef} id="print-area" className="m-0 p-0 d-flex flex-column justify-content-around align-content-center bg-white">
            <Col md={8} className='p-0 m-0'>
               <Card className="card-transparent shadow-none m-0 p-4">
                  <Card.Header className="d-flex justify-content-center align-items-start m-0 p-0 py-2 border-2 border-bottom border-dark">
                     <LogoMedium color={true} />
                     <div className='ms-3'>
                        {/* <p className="text-center border border-1 border-dark fs-6 m-0 p-0">নকলকে না বলি, দিন বদলের দৃঢ় প্রত্যয়ে দেশটাকে গড়ে তুলি</p> */}
                        <h5 className="text-center py-1">{app_bn_name}</h5>
                        <h6 className="text-center py-1">{app_bn_address}</h6>
                        <small className="text-center text-black py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                     </div>
                  </Card.Header>
                  <Card.Body className='m-0 p-0 table-responsive'>
                     <Table className='table table-bordered border-white'>
                        <tbody>
                           <tr>
                              <td scope='col' colSpan={7} className='text-center fs-5 text-decoration-underline m-0 p-0 py-3'>
                                 ট্রান্সফার সার্টিফিকেট (টিসি) আবেদনপত্র
                              </td>
                           </tr>
                           <tr>
                              <td scope='col' colSpan={7} className=' text-wrap fs-6 p-1 m-0' style={{ textAlign: 'justify' }}>
                                 ট্রান্সফার সার্টিফিকেট (টিসি) আবেদনপত্র সফলভাবে সম্পন্ন হয়েছে। বর্তমান প্রতিষ্ঠান এবং গন্তব্য প্রতিষ্ঠান আবেদনটি অনুমোদন করার পরে বোর্ড থেকে যাচাইপূর্বক চূড়ান্ত ট্রান্সফার সার্টিফিকেট (টিসি) আদেশ প্রদান করা হবে। চূড়ান্ত ট্রান্সফার সার্টিফিকেট (টিসি) আদেশ এর কপি অনলাইন থেকে রেজিস্ট্রেশন নম্বর দিয়ে প্রিন্ট করতে হবে।
                              </td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-center fs-5 text-wrap p-2 m-0'>শিক্ষার্থীর তথ্য</td>
                           </tr>
                           <tr>
                              <td className='text-nowrap p-1 m-0'>পেমেন্ট আইডি</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={2} className='text-wrap p-2 m-0'>{printData.id_invoice}</td>
                              <td className='text-wrap p-1 m-0'>সেশন</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.tc_year)}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>শ্রেণী</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={2} className='text-wrap p-1 m-0'>{printData.bn_class} ({printData.rm_class})</td>
                              <td className='text-nowrap p-1 m-0'>রেজিস্ট্রেশন নম্বর</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.st_reg)}</td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-wrap p-2 m-0'></td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_name}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>পিতার নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_father}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>মাতার নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_mother}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>জন্ম তারিখ</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.st_dob)}</td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-center fs-5 text-wrap p-2 m-0'>বর্তমান প্রতিষ্ঠানের তথ্য</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>বোর্ড</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_board}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>প্রতিষ্ঠানের নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_institute} ({printData.src_eiin})</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>পঠিত বিষয়</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              {printData.id_religion === '01' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '02' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '03' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '04' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-center fs-5 text-wrap p-1 m-0'>গন্তব্য প্রতিষ্ঠানের তথ্য</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>বোর্ড</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.dst_board}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>প্রতিষ্ঠানের নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.btc_institute} ({printData.dst_eiin})</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>পঠিত বিষয়</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              {printData.id_religion === '01' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '02' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '03' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                              {printData.id_religion === '04' && <td colSpan={5} className='text-wrap p-2 m-0'>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</td>}
                           </tr>
                        </tbody>
                        <tfoot>
                           <tr>
                              <td colSpan={7} className='text-center text-wrap py-2 m-0'>
                                 <QRCodeSVG value={`${FRONTEND_URL}/student/tc/application/print?invoiceNo=${printData.id_invoice}`} size={100} />
                              </td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-center text-wrap py-1 m-0'>
                                 <small><i className={styles.SiyamRupaliFont}>এই আবেদনপত্রটি স্বয়ংক্রিয়ভাবে কম্পিউটার ডাটাবেইজ থেকে তৈরিকৃত। কোন স্বাক্ষরের প্রয়োজন নেই।</i></small>
                              </td>
                           </tr>
                        </tfoot>
                     </Table>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={8} className='bg-transparent gap-5 d-flex justify-content-center align-items-center py-2 mb-5'>
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

export default TcPayResponse
