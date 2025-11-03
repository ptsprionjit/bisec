import React, { useRef, useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { Row, Col, Table, Button } from 'react-bootstrap'
//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import Card from '../../../components/Card'

import LogoMedium from '../../../components/partials/components/logo-medium'
// import * as SettingSelector from '../../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import Error404 from '../errors/error404'

import * as ValidationInput from '../input_validation'

const PaymentVoucher = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   var curDateTime = new Date();
   curDateTime.setHours(curDateTime.getUTCHours() + 12);
   curDateTime = curDateTime.toISOString().split('T')[0] + ' ' + curDateTime.toISOString().split('T')[1].split('.')[0];

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const navigate = useNavigate();

   const [prevLink, setPrevLink] = useState(null);

   const [printSuccess, setPrintSuccess] = useState(false);

   const [fetchedData, setFetchedData] = useState([]);

   const [totalAmountWord, setTotalAmountWord] = useState('');

   const [loadingData, setLoadingData] = useState(true);

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
                     section {
                        page-break-after: always !important;
                     }
                  }
                  *{
                     font-family: 'Siyam Rupali', sans-serif !important;
                     /* font-size: 15px !important; */
                  }
                  .print-nowrap{
                     white-space: nowrap !important;
                  }
                  .no-print {
                     display: none !important;
                  }
                  .print-hide {
                     display: none !important;
                  }
                  .print-show {
                     display: block !important;
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

   const calculateWord = (totalAmount) => {
      const words = [
         '', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'ঊনিশ', 'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ', 'একান্ন', 'বাহান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
      ];

      let paisa, taka, num_word;
      let wordAmount = "";

      paisa = Math.floor((totalAmount - Math.floor(totalAmount)) * 100);                        // Calculate Total Paisas
      wordAmount = paisa > 0 ? wordAmount + words[paisa] + " পয়সা মাত্র" : wordAmount + " মাত্র";  // Convert Paisa to Word

      taka = Math.floor(totalAmount);                                                           // Calculate Total Takas

      // Convert to Words
      if (taka > 0) {
         num_word = taka % 100;                                                                 // Calculate Takas
         wordAmount = words[num_word] + " টাকা " + wordAmount;
         taka = Math.floor(taka / 100);                                                         // Remove Takas
         if (taka > 0) {
            num_word = taka % 10;                                                               // Calculate Hundreds
            wordAmount = num_word > 0 ? words[num_word] + "শত " + wordAmount : wordAmount;
            taka = Math.floor(taka / 10);                                                       // Remove Hundres
            if (taka > 0) {
               num_word = taka % 100;                                                           // Calculate Thousands
               wordAmount = num_word > 0 ? words[num_word] + " হাজার " + wordAmount : wordAmount;
               taka = Math.floor(taka / 100);                                                   // Remove Thousands
               if (taka > 0) {
                  num_word = taka % 100;                                                        // Calculate Lakhs
                  wordAmount = num_word > 0 ? words[num_word] + " লক্ষ " + wordAmount : wordAmount;
                  taka = Math.floor(taka / 100);                                                // Remove Lakhs
                  if (taka > 0) {
                     num_word = taka % 100;                                                     // Calculate Crores
                     wordAmount = num_word > 0 ? words[num_word] + " কোটি " + wordAmount : wordAmount;
                     taka = Math.floor(taka / 100);                                             // Remove Crores
                     if (taka > 0) {
                        num_word = taka % 10;                                                   // Calculate Crore Hundreds
                        wordAmount = num_word > 0 ? words[num_word] + "শত " + wordAmount : wordAmount;
                        taka = Math.floor(taka / 10);                                           // Remove Crore Hundreds
                        if (taka > 0) {
                           num_word = taka % 100;                                               // Calculate Crore Thousands
                           wordAmount = num_word > 0 ? words[num_word] + " হাজার " + wordAmount : wordAmount;
                           taka = Math.floor(taka / 100);                                       // Remove Crore Thousands
                           if (taka > 0) {
                              num_word = taka % 100;                                            // Calculate Crore Lakhs
                              wordAmount = num_word > 0 ? words[num_word] + " লক্ষ " + wordAmount : wordAmount;
                              taka = Math.floor(taka / 100);                                    // Remove Crore Lakhs
                              if (taka > 0) {
                                 num_word = taka % 100;                                         // Calculate Crore Crore
                                 wordAmount = num_word > 0 ? words[num_word] + " কোটি " + wordAmount : wordAmount;
                                 taka = Math.floor(taka / 100);                                 // Remove Crore Lakhs
                              }
                           }
                        }
                     }
                  }
               }
            }
         }
      }
      setTotalAmountWord(wordAmount);
   }

   const handleWindowClose = (() => {
      if (prevLink) {
         if (prevLink === '/') {
            if (ceb_session?.ceb_user_id) {
               navigate('/dashboard');
            } else {
               navigate('/');
            }
         } else {
            navigate(prevLink);
         }
      } else {
         if (ceb_session?.ceb_user_id) {
            navigate('/dashboard');
         } else {
            navigate('/');
         }
      }
   });

   // Fetch Data
   useEffect(() => {
      const fetchPrintData = async () => {
         setTotalAmountWord('');

         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const invoiceNo = params.get('invoiceNo');

         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(false);

         if (!invoiceNo) {
            setPrintSuccess(false);
         } else {
            try {
               const response = await axios.post(`${BACKEND_URL}/payment-voucher`, { invoiceNo });
               if (response.status === 200) {
                  setFetchedData(response.data.paymentData);
                  calculateWord(response.data.paymentData.pay_board);
                  setPrintSuccess(true);
               } else {
                  setPrintSuccess(false);
               }
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setPrintSuccess(false);
            } finally {
               setLoadingData(false);
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

   if (loadingData) return (
      <Fragment>
         <Row className='p-0 m-0'>
            <Col md={12} className='p-0 m-0'>
               <Card className="vh-100 p-0 m-0">
                  <Card.Body className="d-flex flex-column justify-content-center">
                     <Col md={12} className={styles.dashboard_loader + " mt-5"}></Col>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );

   if (printSuccess) return (
      <Fragment>
         <Row ref={printRef} id="print-area" className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={8} className='border border-dark border-2 p-2'>
               <Card className="card-transparent shadow-none auth-card">
                  <Card.Header className="d-flex flex-column justify-content-center m-0 p-2">
                     <Col md={12} className="border-bottom border-dark d-flex justify-content-center align-items-start">
                        <LogoMedium color={true} />
                        <div className='ms-3'>
                           {/* <p className="logo-title text-center border border-1 border-dark fs-6 m-0  p-0"><span className={styles.SiyamRupaliFont}>নকলকে না বলি, দিন বদলের দৃঢ় প্রত্যয়ে দেশটাকে গড়ে তুলি</span></p> */}
                           <h4 className="logo-title text-center p-1"><span className={styles.SiyamRupaliFont}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</span></h4>
                           <h5 className="logo-title text-center p-1"><span className={styles.SiyamRupaliFont}>লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</span></h5>
                           <h6 className="logo-title text-center p-1"><small className={styles.SiyamRupaliFont}>ফোনঃ <i>(+৮৮০) ২৩৩৪৪০৬৩২৮</i>, ইমেইলঃ <i>admin@cumillaboard.gov.bd</i></small></h6>
                        </div>
                     </Col>
                     <p className='m-0 p-1 text-end'>
                        প্রিন্ট তারিখঃ {ValidationInput.E2BDigit(curDateTime)}
                     </p>
                  </Card.Header>
                  <Card.Body className="p-2 m-0">
                     <h4 className="text-center py-2"><u><span className={styles.SiyamRupaliFont + " text-uppercase"}>পরিশোধের ভাউচার (Payment Voucher)</span></u></h4>
                     <Row className='table-responsive pt-2'>
                        <Table className='table table-bordered'>
                           <tbody>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-center p-3 m-0'><h6 className={styles.SiyamRupaliFont}>সেবা সম্পর্কিত তথ্য</h6></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>সেবার নাম</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>{fetchedData.income_code_details}</span></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>সেবা মূল্য</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>টাকা={ValidationInput.E2BDigit(fetchedData.pay_board)}/-</td>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>শ্রেণী</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>{fetchedData.bn_class} ({fetchedData.rm_class})</td>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>সেশন/বছর</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>{ValidationInput.E2BDigit(fetchedData.st_session)}</td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-center pt-3 m-0'><h6 className={styles.SiyamRupaliFont}>পরিশোধকারীর তথ্য</h6></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>নাম/আইডি</span></td>
                                 <td className='text-wrap p-1 m-0'></td>
                                 <td colSpan={7} className='text-wrap p-1 m-0 text-uppercase'>{ValidationInput.E2BDigit(fetchedData.pay_user)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পরিশোধের সময়</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{ValidationInput.E2BDigit(fetchedData.pay_date)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>ট্রাঞ্জেকশন আইডি</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{ValidationInput.E2BDigit(fetchedData.pay_txid)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পরিশোধের মাধ্যম</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap text-uppercase p-1 m-0'><span className={styles.SiyamRupaliFont}>{fetchedData.bn_pay_mode}</span></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>মোট পরিশোধ</span></td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap text-uppercase p-1 m-0'>টাকা={ValidationInput.E2BDigit(fetchedData.pay_board)}/-</td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-primary text-center py-3 m-0'>কথায়ঃ {totalAmountWord}</td>
                              </tr>
                           </tbody>
                        </Table>
                     </Row>
                     <Row className='table-responsive pt-2'>
                        <Table className='table'>
                           <tbody>
                              <tr>
                                 <td className='align-center text-center text-wrap p-2 m-0'><QRCodeSVG value={`${FRONTEND_URL}/payment/response/success/?invoiceNo=${fetchedData.pay_invoice}`} size={100} /><br /><i><small className={styles.SiyamRupaliFont + " p-2"}>ভাইচার যাচাই করতে কিউআর কোড স্ক্যান করুন</small></i></td>
                              </tr>
                              <tr>
                                 <td className='align-center text-wrap text-center p-1 m-0'><i className={styles.SiyamRupaliFont}>কম্পিউটারে সয়ংক্রিয়ভাবে প্রস্তুতকৃত ভাউচারে কোন স্বাক্ষরের প্রয়োজন নেই।</i></td>
                              </tr>
                           </tbody>
                        </Table>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={8} className='bg-transparent gap-5 d-flex justify-content-center align-items-center py-2 mb-5'>
               <Button className='flex-fill' onClick={handleWindowClose} type="button" variant="btn btn-warning">ফিরে যান</Button>
               <Button className='flex-fill' onClick={handlePrint} type="button" variant="btn btn-info">প্রিন্ট করুন</Button>
            </Col>
         </Row>
      </Fragment>
   );

   return (
      <Error404 customMessage='পেমন্ট তথ্য পাওয়া যায়নি/সঠিক নয়!' />
   );
}

export default PaymentVoucher
