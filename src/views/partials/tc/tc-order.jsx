import React, { useRef, useEffect, useState } from 'react'
import { Row, Col, Table, Button } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import { useSelector } from "react-redux"

// import { format } from 'date-fns'

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import Card from '../../../components/Card'

import LogoMedium from '../../../components/partials/components/logo-medium'
// import * as SettingSelector from '../../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as InputValidation from '../input_validation'

const TcOrderPrint = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   // const appName = useSelector(SettingSelector.app_name);

   const URL = import.meta.env.VITE_BACKEND_URL;
   const my_url = import.meta.env.VITE_FRONTEND_URL;

   const [prevLink, setPrevLink] = useState(null);

   const navigate = useNavigate();
   const handleRedirect = (() => {
      const params = new URLSearchParams(window.location.search);
      const prev_location = params.get('prev_location');
      if (prev_location) {
         navigate(prev_location);
      } else {
         window.close();
      }
   });

   const [stLoading, setStLoading] = useState('');
   const [stError, setStError] = useState('');
   const [stRedirect, setStRedirect] = useState('');
   const [printSuccessMsg, setPrintSuccessMsg] = useState('');

   const [printSuccess, setPrintSuccess] = useState(false);
   const [printData, setPrintData] = useState(false);

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
                     padding: 0.5in !important;
                     div, table, tr, th, td, p, span {
                        page-break-inside: avoid !important;
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

   useEffect(() => {
      const fetchPrintData = async () => {
         setStLoading("Loading Data! Don't Close the Window or Reload!");

         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const invoiceNo = params.get('invoiceNo');
         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(null);

         if (!invoiceNo) {
            setStError('Unauthorized Action Detected!');
            setStLoading(false);
            return;
         } else {
            setStLoading("Loading Data...");
            setStRedirect("Do not Close or Reload the Page!");
            try {
               const response = await axios.post(`${URL}/student/tc/order/print`, { invoiceNo });
               setPrintData(response.data);
               setPrintSuccess(true);
               setPrintSuccessMsg("Application Submission Successful");
               setStRedirect("Printing Application...");
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setStRedirect("");
               setStError('Unauthorized Action Detected!');
               // console.error("Unauthorized Action Detected!", err);
            } finally {
               setStLoading(false);
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
            if (printSuccess) {
               handlePrint();
            }
         } else {
            alert("Please allow popups for this site to print the application!");
         }
      };

      const timer = setTimeout(() => {
         checkPopupPermission();
      }, 1000);

      return () => clearTimeout(timer);
   }, [printSuccess]);// eslint-disable-line react-hooks/exhaustive-deps

   if (printSuccess) return (
      <>
         <div ref={printRef} id="print-area">
            <div className='login-content d-flex flex-column justify-content-around align-content-center w-100 h-100'>
               <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
                  <Col md="8" className='border border-dark border-2 p-2'>
                     <Card className="card-transparent shadow-none d-flex justify-content-center auth-card">
                        <Card.Header className="d-flex flex-column justify-content-center m-0 p-0">
                           <div className="py-1 navbar-brand border-2 border-bottom border-dark d-flex justify-content-center align-items-start">
                              <LogoMedium color={true} />
                              <div className='ms-3'>
                                 {/* <p className="logo-title text-center border border-1 border-dark fs-6 m-0  p-0"><span className={styles.SiyamRupaliFont}>নকলকে না বলি, দিন বদলের দৃঢ় প্রত্যয়ে দেশটাকে গড়ে তুলি</span></p> */}
                                 <h4 className="logo-title text-center"><span className={styles.SiyamRupaliFont}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</span></h4>
                                 <h5 className="logo-title text-center"><span className={styles.SiyamRupaliFont}>লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</span></h5>
                                 <h6 className="logo-title text-center"><span className={styles.SiyamRupaliFont}>ফোনঃ (+৮৮০) ২৩৩৪৪০৬৩২৮, ইমেইলঃ admin@cumillaboard.gov.bd</span></h6>
                              </div>
                           </div>
                        </Card.Header>
                        <Card.Body className="pt-0 mt-0">
                           <div>
                              <div className='p-0 pb-3 d-flex justify-content-between align-items-center text-dark'>
                                 <div className='text-left'>
                                    স্মারক নম্বরঃ {InputValidation.E2BDigit(printData.src_bid + printData.src_eiin + printData.dst_bid + printData.dst_eiin + printData.st_reg)}
                                 </div>
                                 <div className='text-right'>
                                    তারিখঃ {InputValidation.E2BDigit(String(printData.src_board_date).split(' ')[0])}
                                 </div>
                              </div>
                              <h5 className="text-center pb-3"><u><span className={styles.SiyamRupaliFont}>প্রতিষ্ঠান পরিবর্তনের প্রত্যয়ন পত্র ({printData.src_board === printData.dst_board ? 'TC' : 'BTC'})</span></u></h5>
                              <h6 style={{ textAlign: 'justify' }}><span className={styles.SiyamRupaliFont}></span>{printData.src_board === printData.dst_board ? "শিক্ষার্থীর আবেদন এবং উভয় প্রতিষ্ঠান প্রধানের সুপারিশের (অনুমোদন) প্রেক্ষিতে ছাড়পত্র/ভর্তির অনুমতি প্রদান করা হলো। ছাড়পত্রের তারিখ হতে ১৫ কার্য দিবসের মধ্যে ভর্তি কার্যক্রম সম্পন্ন করতে হবে অন্যথায় ছাড়পত্রের আদেশ বাতিল বলে গণ্য হবে।" : "শিক্ষার্থীর আবেদন এবং প্রতিষ্ঠান প্রধানের সুপারিশের (অনুমোদন) প্রেক্ষিতে অত্র বোর্ড থেকে ছাড়পত্র প্রদান করা হলো। ছাড়পত্রের তারিখ হতে ১৫ কার্য দিবসের মধ্যে সংশ্লিষ্ট বোর্ডে ভর্তি/রেজিস্ট্রেশন কার্যক্রম সম্পন্ন করতে হবে।"}</h6>
                              <div className='table-fixed pt-2'>
                                 <Table className='table table-bordered'>
                                    <thead>
                                       <tr>
                                          <th scope='col' colSpan={7} className='text-center text-primary fs-5 p-1 m-0'><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর তথ্য</span></th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       {/* <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>অর্ডার নম্বর</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap p-1 m-0'><strong>CBTC{printData.src_bid}{printData.src_eiin}{printData.dst_bid}{printData.dst_eiin}{printData.st_reg}</strong></td>
                                       </tr> */}
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>শ্রেণী</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td className='text-wrap text-start p-1 m-0'><strong><span className={styles.SiyamRupaliFont + " text-uppercase"}>{printData.bn_class} ({printData.rm_class})</span></strong></td>
                                          <td colSpan={2} className='text-wrap text-end p-1 m-0'><span className={styles.SiyamRupaliFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td className='text-wrap text-center p-1 m-0'><strong>{InputValidation.E2BDigit(printData.st_reg + '/' + printData.tc_year)}</strong></td>
                                       </tr>
                                       <tr>
                                          <td colSpan={7} className='text-wrap p-2 m-0'></td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_name}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পিতার নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_father}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>মাতার নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap p-1 m-0'>{printData.st_mother}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>জন্ম তারিখ</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.st_dob)}</td>
                                       </tr>
                                       <tr>
                                          <td colSpan={7} className='text-wrap p-2 m-0'></td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান বোর্ড</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_board}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠানের নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.src_institute} ({printData.src_eiin})</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য বোর্ড</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.dst_board}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠানের নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={5} className='text-wrap text-uppercase p-1 m-0'>{printData.btc_institute} ({printData.dst_eiin})</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পঠিত বিষয়</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          {printData.id_religion === '01' && <td colSpan={5} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {printData.id_religion === '02' && <td colSpan={5} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {printData.id_religion === '03' && <td colSpan={5} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {printData.id_religion === '04' && <td colSpan={5} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                       </tr>
                                    </tbody>
                                 </Table>
                                 <Table className='table'>
                                    <tbody>
                                       <tr>
                                          <td colSpan={7} className='text-wrap p-0 m-0 pt-2'><u><span className={styles.SiyamRupaliFont}>সদয় অবগতি ও প্রয়োজনীয় কার্যার্থেঃ</span></u></td>
                                       </tr>
                                       <tr>
                                          <td colSpan={3} className='text-wrap p-0 m-0 ps-3'><small className={styles.SiyamRupaliFont}>০১। পরীক্ষা নিয়ন্ত্রক <br /> ০২। সিনিয়র সিস্টেম এনালিস্ট  <br /> ০৩। প্রতিষ্ঠান প্রধান  <br /> ০৪। সংশ্লিষ্ট বোর্ড <br /> ০৫। সংশ্লিষ্ট নথি</small></td>
                                          <td colSpan={2} className='align-center text-center text-wrap p-1 m-0'><QRCodeSVG value={`${my_url}/tc/tc-order?invoiceNo=${printData.id_invoice}`} size={100} /></td>
                                          <td colSpan={2} className='text-wrap text-center p-0 m-0'><span className={styles.SiyamRupaliFont}><br /> <br /> <br /> <br /> <br /> বিদ্যালয় পরিদর্শক  <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা <br /> ফোনঃ (+৮৮) ০২৩৩৪৪০২৭৬০</span></td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                           </div>
                        </Card.Body>
                     </Card>
                  </Col>
               </Row>
            </div>
         </div>
         <div>
            <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
               <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center py-2 mb-5'>
                  {prevLink && <Button className='flex-fill' onClick={handleRedirect} type="button" variant="btn btn-secondary">Close</Button>}
                  <Button className='flex-fill' onClick={handlePrint} type="button" variant="btn btn-info">Print</Button>
               </Col>
            </Row>
         </div>
      </>
   );

   return (
      <>
         <div className='login-content d-flex flex-column justify-content-center align-content-center vh-100 vw-100 bg-white'>
            <Row className="m-0 d-flex d-flex flex-column justify-content-center align-content-center vh-100 vw-100 bg-white">
               <Col md="8">
                  <div className='d-flex flex-column justify-content-center align-content-center'>
                     <h4 className="mb-4 text-center text-info">{stLoading}</h4>
                     <h4 className="mb-4 text-center text-danger">{stError}</h4>
                     {stError && <Button onClick={handleRedirect} type="button" variant="btn btn-danger">Close</Button>}
                     <h4 className="mb-4 text-center text-success">{printSuccessMsg}</h4>
                     <h6 className="mb-4 text-center text-primary">{stRedirect}</h6>
                  </div>
               </Col>
            </Row>
         </div>
      </>
   );
}

export default TcOrderPrint
