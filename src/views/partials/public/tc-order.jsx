import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Table, Button, Card } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import LogoMedium from '../../../components/partials/components/logo-medium.jsx';

import styles from '../../../assets/custom/css/bisec.module.css';

import * as InputValidation from '../input_validation.js';

import { handlePrint } from '../handlers/print.jsx';

const TcOrderPrint = () => {
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
                  const response = await axiosApi.post(`/student/tc/order/print`, { invoiceNo });
                  setPrintData(response.data);
                  setStatus({ loading: false, error: false, success: 'ছাড়পত্রের আদেশ প্রিন্ট হচ্ছে... অপেক্ষা করুন...' });
               } catch (err) {
                  setStatus({ loading: false, error: 'ছাড়পত্রের আদেশ পাওয়া যায়নি!', success: false });
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
                  <Card.Body className="p-0 m-0">
                     <Table className='table table-bordered border-white'>
                        <thead className='bg-transparent'>
                           <tr className='bg-transparent'>
                              <th scope='col' colSpan={4} className='text-nowrap text-left fs-6 p-1 m-0'>স্মারক নম্বরঃ {InputValidation.E2BDigit(printData.src_bid + printData.src_eiin + printData.dst_bid + printData.dst_eiin + printData.st_reg)}</th>
                              <th scope='col' colSpan={3} className='text-end fs-6 p-1 m-0'>তারিখঃ {InputValidation.E2BDigit(String(printData.src_board_date).split(' ')[0])}</th>
                           </tr>
                        </thead>
                        <tbody>
                           <tr>
                              <td colSpan={7} className='text-wrap text-center fs-5 p-1 py-3 m-0 text-decoration-underline'>প্রতিষ্ঠান পরিবর্তনের প্রত্যয়ন পত্র ({printData.src_board === printData.dst_board ? 'TC' : 'BTC'})</td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-wrap fs-6 p-1 py-3 m-0' style={{ textAlign: 'justify' }}>{printData.src_board === printData.dst_board ? "শিক্ষার্থীর আবেদন এবং উভয় প্রতিষ্ঠান প্রধানের সুপারিশের (অনুমোদন) প্রেক্ষিতে ছাড়পত্র/ভর্তির অনুমতি প্রদান করা হলো। ছাড়পত্রের তারিখ হতে ১৫ কার্য দিবসের মধ্যে ভর্তি কার্যক্রম সম্পন্ন করতে হবে অন্যথায় ছাড়পত্রের আদেশ বাতিল বলে গণ্য হবে।" : "শিক্ষার্থীর আবেদন এবং প্রতিষ্ঠান প্রধানের সুপারিশের (অনুমোদন) প্রেক্ষিতে অত্র বোর্ড থেকে ছাড়পত্র প্রদান করা হলো। ছাড়পত্রের তারিখ হতে ১৫ কার্য দিবসের মধ্যে সংশ্লিষ্ট বোর্ডে ভর্তি/রেজিস্ট্রেশন কার্যক্রম সম্পন্ন করতে হবে।"}</td>
                           </tr>
                           <tr>
                              <td colSpan={7} className='text-wrap text-center fs-5 p-1 m-0'>শিক্ষার্থীর তথ্য</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>শ্রেণী</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td className='text-wrap text-start p-1 m-0'>{printData.bn_class} ({printData.rm_class})</td>
                              <td colSpan={2} className='text-nowrap text-end p-1 m-0'>রেজিস্ট্রেশন নম্বর</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td className='text-wrap text-center p-1 m-0'>{InputValidation.E2BDigit(printData.st_reg + '/' + printData.tc_year)}</td>
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
                              <td colSpan={7} className='text-wrap p-2 m-0'></td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>বর্তমান বোর্ড</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_board}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>বর্তমান প্রতিষ্ঠানের নাম</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_institute} ({printData.src_eiin})</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>গন্তব্য বোর্ড</td>
                              <td className='text-wrap p-1 m-0'>:</td>
                              <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.dst_board}</td>
                           </tr>
                           <tr>
                              <td className='text-wrap p-1 m-0'>গন্তব্য প্রতিষ্ঠানের নাম</td>
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
                              <td colSpan={7} className='text-wrap p-0 m-0 pt-2'><u>সদয় অবগতি ও প্রয়োজনীয় কার্যার্থেঃ</u></td>
                           </tr>
                           <tr>
                              <td colSpan={3} className='text-wrap p-0 m-0 ps-3'><small className={styles.SiyamRupaliFont}>০১। পরীক্ষা নিয়ন্ত্রক <br /> ০২। সিনিয়র সিস্টেম এনালিস্ট  <br /> ০৩। প্রতিষ্ঠান প্রধান  <br /> ০৪। সংশ্লিষ্ট বোর্ড <br /> ০৫। সংশ্লিষ্ট নথি</small></td>
                              <td colSpan={2} className='align-center text-center text-wrap p-1 m-0'><QRCodeSVG value={`${FRONTEND_URL}/student/tc/order?invoiceNo=${printData.id_invoice}`} size={100} /></td>
                              <td colSpan={2} className='text-wrap text-center p-0 m-0'><br /> <br /> <br /> <br /> <br /> বিদ্যালয় পরিদর্শক  <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা <br /> ফোনঃ (+৮৮) ০২৩৩৪৪০২৭৬০</td>
                           </tr>
                        </tfoot>
                     </Table>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center py-2 mb-5'>
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

export default TcOrderPrint
