import React, { useRef, useEffect, useState, Fragment } from 'react'
import { useNavigate } from 'react-router-dom'

import { Row, Col, Table, Button, Card } from 'react-bootstrap'
//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axiosApi from "../../../lib/axiosApi.jsx";

import LogoMedium from '../../../components/partials/components/logo-medium'

import { useSelector } from "react-redux";
import * as SettingSelector from '../../../store/setting/selectors.js';

import * as InputValidation from '../input_validation';

import { handlePrint } from '../handlers/print.jsx';

const PaymentVoucher = () => {
   const app_bn_name = useSelector(SettingSelector.app_bn_name);
   const app_bn_address = useSelector(SettingSelector.app_bn_address);
   const app_phone = useSelector(SettingSelector.app_phone);
   const app_email = useSelector(SettingSelector.app_email);

   var curDateTime = new Date();
   curDateTime.setHours(curDateTime.getUTCHours() + 12);
   curDateTime = curDateTime.toISOString().split('T')[0] + ' ' + curDateTime.toISOString().split('T')[1].split('.')[0];

   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const navigate = useNavigate();

   const [prevLink, setPrevLink] = useState(null);

   const [printData, setPrintData] = useState([]);

   const [totalAmountWord, setTotalAmountWord] = useState('');

   const [status, setStatus] = useState({ loading: false, error: false, success: false });

   const printRef = useRef();

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

   const handleRedirect = (() => {
      if (prevLink) {
         navigate(prevLink);
      } else {
         navigate('/');
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

         setStatus({ loading: 'তথ্য সংগ্রহ করা হচ্ছে...অপেক্ষা করুন...', error: false, success: false });

         if (!invoiceNo) {
            setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
         } else {
            const dataError = InputValidation.addressCheck(invoiceNo);
            if (dataError) {
               setStatus({ loading: false, error: 'অননুমোদিত প্রবেশ নিষিদ্ধ!', success: false });
            } else {
               try {
                  const response = await axiosApi.post(`/payment-voucher`, { invoiceNo });
                  if (response.status === 200) {
                     setPrintData(response.data.paymentData);
                     calculateWord(response.data.paymentData.pay_board);
                     setStatus({ loading: false, error: false, success: true });
                  } else {
                     setStatus({ loading: false, error: "কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!", success: false });
                  }
               } catch (err) {
                  if (err.status === 401) {
                     navigate("/auth/sign-out");
                  }
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
         <Row ref={printRef} id="print-area" className="m-0 p-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={8} className='m-0 p-0'>
               <Card className="card-transparent shadow-none m-0 p-2">
                  <Card.Header className="d-flex flex-column justify-content-center border-bottom m-0 p-0 border-dark pb-2">
                     <Col md={12} className="m-0 p-0 d-flex justify-content-center align-items-start gap-3">
                        <LogoMedium color={true} />
                        <div >
                           <h5 className="text-center py-1">{app_bn_name}</h5>
                           <h6 className="text-center py-1">{app_bn_address}</h6>
                           <small className="text-center text-black py-1">ফোনঃ {InputValidation.E2BDigit(app_phone)}, ইমেইলঃ {app_email}</small>
                        </div>
                     </Col>
                  </Card.Header>
                  <Card.Body className="p-2 m-0">
                     <p className="text-end py-2">প্রিন্ট তারিখঃ {InputValidation.E2BDigit(InputValidation.formatedDate(curDateTime))}</p>
                     <h4 className="text-center pb-2 text-uppercase text-decoration-underline">ফি পরিশোধের ভাউচার (Payment Voucher)</h4>
                     <Row className='table-responsive pt-2'>
                        <Table className='table border-0 border-white'>
                           <tbody>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-center p-3 fs-5 m-0'>সেবা সম্পর্কিত তথ্য</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>সেবার নাম</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{printData.income_code_details}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>সেবা মূল্য</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>টাকা={InputValidation.E2BDigit(printData.pay_board)}/-</td>
                                 <td className='text-wrap p-1 m-0'>শ্রেণী</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>{printData.bn_class} ({printData.rm_class})</td>
                                 <td className='text-wrap p-1 m-0'>সেশন/বছর</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.st_session)}</td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-center p-3 fs-5 m-0'>পরিশোধকারীর তথ্য</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>নাম/আইডি</td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0 text-uppercase'>{InputValidation.E2BDigit(printData.pay_user)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>পরিশোধের সময়</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.pay_date)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>ইনভয়েস নম্বর</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{printData.pay_invoice}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>ট্রাঞ্জেকশন আইডি</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(printData.pay_txid)}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>পরিশোধের মাধ্যম</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap text-uppercase p-1 m-0'>{printData.bn_pay_mode}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'>মোট পরিশোধ</td>
                                 <td className='text-wrap text-center p-1 m-0'>:</td>
                                 <td colSpan={7} className='text-wrap text-uppercase p-1 m-0'>টাকা={InputValidation.E2BDigit(printData.pay_board)}/-</td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='text-wrap text-center p-0 m-0 py-3'>কথায়ঃ <strong>{totalAmountWord}</strong></td>
                              </tr>
                           </tbody>
                           <tfoot>
                              <tr>
                                 <td colSpan={9} className='align-center text-center text-wrap p-2 m-0'>
                                    <i><small className={"mb-2"}>ভাইচার যাচাই করতে কিউআর কোড স্ক্যান করুন</small></i>
                                 </td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='align-center text-center text-wrap p-2 m-0'>
                                    <QRCodeSVG value={`${FRONTEND_URL}/payment/response/success/?invoiceNo=${printData.pay_invoice}`} size={100} />
                                 </td>
                              </tr>
                              <tr>
                                 <td colSpan={9} className='align-center text-wrap text-center p-1 m-0'><i>কম্পিউটারে সয়ংক্রিয়ভাবে প্রস্তুতকৃত ভাউচারে কোন স্বাক্ষরের প্রয়োজন নেই।</i></td>
                              </tr>
                           </tfoot>
                        </Table>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={8} className='bg-transparent gap-5 d-flex justify-content-center align-items-center py-2 mb-5'>
               <Button className='flex-fill' onClick={handleRedirect} type="button" variant="btn btn-outline-warning">ফিরে যান</Button>
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

export default PaymentVoucher
