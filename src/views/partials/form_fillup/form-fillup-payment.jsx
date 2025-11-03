import React, { useRef, Fragment, useEffect, useState } from 'react'
// import FsLightbox from 'fslightbox-react';

import { Row, Col, Image, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import { useNavigate } from 'react-router-dom'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

// import Maintenance from '../errors/maintenance';

const FormFillupPayment = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const navigate = useNavigate();

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   // Set EIIN Value
   let eiin = '';
   if (ceb_session) {
      eiin = ceb_session.ceb_user_type === "13" ? ceb_session.ceb_user_id : '';
   }

   // Modal Variales
   // const [modalError, setModalError] = useState(false);

   // Form Validation Variable
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState(
      {
         user_form: '200020711422330002', user_eiin: eiin, user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', user_paid: '01'
      }
   );
   const [searchDataError, setSearchDataError] = useState([]);
   const [validSearch, setValidSearch] = useState(false);
   const [insName, setInsName] = useState(false);
   const [totalAmount, setTotalAmount] = useState(0);
   const [totalAmountWord, setTotalAmountWord] = useState(0);

   // Search Data Status
   const [searchLoading, setSearchLoading] = useState(false);
   const [searchError, setSearchError] = useState(false);
   const [searchSuccess, setSearchSuccess] = useState(false);

   // Student List Data
   const [stData, setStData] = useState([]);

   const printRef = useRef();

   const handlePrint = async () => {
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
                        color: #000000 !important;
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
                  <div class="d-flex flex-column justify-content-center align-items-center">${printContent}</div>
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
         '', 'এক', 'দুই', 'তিন', 'চার', 'পাঁচ', 'ছয়', 'সাত', 'আট', 'নয়', 'দশ', 'এগারো', 'বারো', 'তেরো', 'চৌদ্দ', 'পনেরো', 'ষোলো', 'সতেরো', 'আঠারো', 'ঊনিশ', 'বিশ', 'একুশ', 'বাইশ', 'তেইশ', 'চব্বিশ', 'পঁচিশ', 'ছাব্বিশ', 'সাতাশ', 'আটাশ', 'ঊনত্রিশ', 'ত্রিশ', 'একত্রিশ', 'বত্রিশ', 'তেত্রিশ', 'চৌত্রিশ', 'পঁয়ত্রিশ', 'ছত্রিশ', 'সাঁইত্রিশ', 'আটত্রিশ', 'ঊনচল্লিশ', 'চল্লিশ', 'একচল্লিশ', 'বিয়াল্লিশ', 'তেতাল্লিশ', 'চুয়াল্লিশ', 'পঁয়তাল্লিশ', 'ছেচল্লিশ', 'সাতচল্লিশ', 'আটচল্লিশ', 'ঊনপঞ্চাশ', 'পঞ্চাশ', 'একান্ন', 'বাহান্ন', 'তিপ্পান্ন', 'চুয়ান্ন', 'পঞ্চান্ন', 'ছাপান্ন', 'সাতান্ন', 'আটান্ন', 'ঊনষাট', 'ষাট', 'একষট্টি', 'বাষট্টি', 'তেষট্টি', 'চৌষট্টি', 'পঁয়ষট্টি', 'ছেষট্টি', 'সাতষট্টি', 'আটষট্টি', 'ঊনসত্তর', 'সত্তর', 'একাত্তর', 'বাহাত্তর', 'তিয়াত্তর', 'চুয়াত্তর', 'পঁচাত্তর', 'ছিয়াত্তর', 'সাতাত্তর', 'আটাত্তর', 'ঊনআশি', 'আশি', 'একাশি', 'বিরাশি', 'তিরাশি', 'চুরাশি', 'পঁচাশি', 'ছিয়াশি', 'সাতাশি', 'আটাশি', 'ঊননব্বই', 'নব্বই', 'নব্বই', 'একানব্বই', 'বিরানব্বই', 'তিরানব্বই', 'চুরানব্বই', 'পঁচানব্বই', 'ছিয়ানব্বই', 'সাতানব্বই', 'আটানব্বই', 'নিরানব্বই'
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

   const removeCookie = (name) => {
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
   };

   const handleSearch = async (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
      const form = event.currentTarget;
      let isValid = true;

      setSearchDataError([]);
      setSearchSuccess(false);
      setSearchError(false);

      const newErrors = {}; // Collect errors in one place
      // console.log(searchData);

      if (form.checkValidity() === false) {
         setValidated(false);
         event.stopPropagation();
      } else {
         const requiredFields = [
            'user_form', 'user_eiin', 'user_session', 'user_class', 'user_group', 'user_version', 'user_application', 'user_paid'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'user_form':
               case 'user_eiin':
               case 'user_session':
               case 'user_class':
               case 'user_group':
               case 'user_version':
               case 'user_application':
               case 'user_paid':
                  dataError = ValidationInput.numberCheck(searchData[field]);
                  break;
               default:
                  break;
            }

            if (dataError) {
               newErrors[field] = dataError;
               isValid = false;
               setValidated(false);
            }
         });

         // Update once
         setSearchDataError(newErrors);
         // console.log(newErrors);

         if (!isValid) {
            event.stopPropagation();
            setValidated(true);
         } else {
            setSearchLoading("তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন...");
            try {
               const user_data = await axios.post(`${BACKEND_URL}/registration/payment-summery?`, { user_form: searchData.user_form, user_eiin: searchData.user_eiin, user_session: searchData.user_session, user_class: searchData.user_class, user_group: searchData.user_group, user_version: searchData.user_version, user_application: searchData.user_application, user_paid: searchData.user_paid });
               // console.log(user_data.data.data);
               if (user_data.status === 200) {
                  setSearchSuccess(`সেশনঃ ${searchData.user_session}, শ্রেণীঃ ${searchData.user_class}, বিভাগঃ ${user_data.data.st_list[0].bn_group}`);
                  setInsName(user_data.data.ins_name);
                  setStData(user_data.data.st_list);
                  setTotalAmount(user_data.data.total_amount);
                  calculateWord(user_data.data.total_amount);
                  setValidSearch(true);
                  setValidated(false);
               } else {
                  setSearchError(`${user_data.data.message}`);
                  setValidSearch(false);
                  setValidated(true);
               }
            } catch (err) {

               setSearchError("নিবন্ধন তথ্য পাওয়া যায়নি!");
               setValidSearch(false);
               setValidated(true);
               // console.log(err);
               if (err.status === 401) {
                  navigate("/auth/sign-out");
                  
               } else if (err.status === 403) {
                  navigate("/registration/temp-list");
                  return null;
               }
            } finally {
               setSearchLoading(false);
            }
         }
      }
   };

   //Handle Search Data Change
   const handleSearchDataChange = (dataName, dataValue) => {
      setSearchData({ ...searchData, [dataName]: dataValue.toUpperCase() });
      setSearchDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   const handleSearchReset = (event) => {
      event.preventDefault();
      removeCookie('jwEntry');
      setSearchDataError([]);
      setValidated(false);

      setSearchSuccess(false);
      setSearchError(false);
      setSearchLoading(false);

      setValidSearch(false);

      setStData([]);
      setInsName('');
      setTotalAmount(0);

      setSearchData({
         user_form: '200020711422330002', user_eiin: eiin, user_session: '', user_class: '', user_group: '', user_version: '', user_application: '', user_paid: '01'
      });
   };

   // Return if no session
   if (!ceb_session) {
      return null;
   }

   // Return if Search is Valid
   if (validSearch && (ceb_session.ceb_user_type === '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17')) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className='p-0 mb-2'>
                  <Card.Body className='py-1 m-0 d-flex flex-column justify-content-center align-items-center'>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title pt-2"}>নিবন্ধিত (অপেক্ষমান/Pending) শিক্ষার্থীদের ফি</h4>
                     {insName && <h5 className="text-uppercase text-center py-1 text-primary">{insName}</h5>}
                     {searchLoading && <h6 className="text-uppercase text-center py-1 text-info">{searchLoading}</h6>}
                     {searchError && <h6 className="text-uppercase text-center py-1 text-danger">{searchError}</h6>}
                     {searchSuccess && <p className="text-uppercase text-center py-1 text-success"><small><i>{searchSuccess}</i></small></p>}
                     <Button type="button" onClick={(e) => handleSearchReset(e)} variant="btn btn-primary"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                  </Card.Body>
               </Card>
            </Col>
            <Col md="12">
               <Card>
                  <Card.Body className="px-0">
                     <Row ref={printRef} className="p-4 d-flex justify-content-center align-items-center">
                        <Col md={12} className={styles.print_show + ' mb-3 pb-1 border-bottom w-100'}>
                           <h4 className={styles.SiyamRupaliFont + " w-100 text-center text-primary text-uppercase py-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড কুমিল্লা</h4>
                           {insName && <h6 className="text-uppercase card-title text-center py-1">{insName} ({searchData.user_eiin})</h6>}
                           <h6 className={styles.SiyamRupaliFont + " text-center text-uppercase py-1"}>নিবন্ধিত (অপেক্ষমান/Pending) শিক্ষার্থীদের ফি বিবরণী</h6>
                        </Col>
                        <Col md={10} className="table-responsive">
                           <table id="user-list-table" className="table table-bordered">
                              <thead>
                                 <tr className='border border-secondary'>
                                    <th className='text-center align-top p-1 m-0'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>ক্রমিক</span>
                                    </th>
                                    <th className='text-center align-top p-1 m-0'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>বিবরণ</span>
                                    </th>
                                    <th className='text-center align-top p-1 m-0'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>পরিমাণ</span>
                                    </th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০১</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>প্রতিষ্ঠানের নাম</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{insName}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০২</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>সেশন/বছর</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{searchData.user_session}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৩</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>শ্রেণী</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{searchData.user_class}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৪</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>মাধ্যম</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{stData[0].bn_version}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৫</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>বিভাগ</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{stData[0].bn_group}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৬</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>নিবন্ধনের ধরণ</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       {searchData.user_application === '01' && (
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>
                                             রেগুলার/সাধারণ নিবন্ধন
                                          </span>
                                       )}
                                       {searchData.user_application === '02' && (
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>
                                             লেট/বিলম্ব নিবন্ধন
                                          </span>
                                       )}
                                       {searchData.user_application === '03' && (
                                          <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>
                                             স্পেশাল/বিশেষ বিবেচনায় নিবন্ধন
                                          </span>
                                       )}
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৭</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>মোট শিক্ষার্থী</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{stData[0].total_student}</span>
                                    </td>
                                 </tr>
                                 <tr className='border border-secondary'>
                                    <td className='text-center align-top text-wrap'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>০৮</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>মোট আবেদন ফি</span>
                                    </td>
                                    <td className='text-center align-top'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>{totalAmount}</span>
                                    </td>
                                 </tr>
                              </tbody>
                              <tfoot>
                                 <tr className='border border-secondary'>
                                    <td colSpan={3} className='text-center align-top py-2'>
                                       <span className={styles.SiyamRupaliFont + " text-center text-dark print-wrap"}>কথায়ঃ {totalAmountWord}</span>
                                    </td>
                                 </tr>
                              </tfoot>
                           </table>
                        </Col>
                     </Row>
                     {stData.length > 0 && <Row className='p-4 d-flex justify-content-center align-items-center'>
                        <Col md="4" className='d-flex'>
                           <Button onClick={() => handlePrint()} className='flex-fill' variant="btn btn-success">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer-check-icon lucide-printer-check"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" /><path d="m16 19 2 2 4-4" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /></svg> Print
                           </Button>
                        </Col>
                        <Col md="4" className='d-flex'>
                           <Button onClick={() => handlePrint()} className='flex-fill' variant="btn btn-primary">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-credit-card-icon lucide-credit-card"><rect width="20" height="14" x="2" y="5" rx="2" /><line x1="2" x2="22" y1="10" y2="10" /></svg> Make Payment
                           </Button>
                        </Col>
                     </Row>}
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment >
   )

   // Return if User is Authorized
   if (ceb_session.ceb_user_type === '13' || ceb_session.ceb_user_office === '05' || ceb_session.ceb_user_role === '17') return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card>
                  <Card.Body>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title"}>নিবন্ধিত (অপেক্ষমান/Pending) শিক্ষার্থীদের ফি</h4>
                  </Card.Body>
               </Card>
            </Col>

            <Col md={12}>
               <Form noValidate onSubmit={handleSearch} onReset={handleSearchReset}>
                  <Card>
                     <Card.Header>
                        <h5 className="text-center w-100 card-title">নিবন্ধনের তথ্য</h5>
                     </Card.Header>
                     <Card.Body>
                        <Row>
                           <Col md={12}>
                              {searchLoading && <h6 className="text-uppercase text-center py-2 text-info">{searchLoading}</h6>}
                              {searchError && <h6 className="text-uppercase text-center py-2 text-danger">{searchError}</h6>}
                              {searchSuccess && <h6 className="text-uppercase text-center py-2 text-success">{searchSuccess}</h6>}
                           </Col>
                           {ceb_session.ceb_user_type !== '13' && <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_eiin">EIIN</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 maxLength={6} minLength={6}
                                 value={searchData.user_eiin}
                                 isInvalid={validated && !!searchDataError.user_eiin}
                                 isValid={validated && searchData.user_eiin && !searchDataError.user_eiin}
                                 onChange={(e) => handleSearchDataChange('user_eiin', e.target.value)}
                              />
                              {validated && searchDataError.user_eiin && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_eiin}
                                 </Form.Control.Feedback>
                              )}
                           </Col>}
                           {ceb_session.ceb_user_type === '13' && <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_eiin">EIIN</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_eiin"
                                 maxLength={6} minLength={6}
                                 value={searchData.user_eiin}
                                 isInvalid={validated && !!searchDataError.user_eiin}
                                 isValid={validated && searchData.user_eiin && !searchDataError.user_eiin}
                                 disabled={ceb_session.ceb_user_type === '13'}
                              />
                              {validated && searchDataError.user_eiin && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_eiin}
                                 </Form.Control.Feedback>
                              )}
                           </Col>}
                           <Col md={4} className='my-2'>
                              <Form.Label className="text-primary" htmlFor="user_session">Session/Year</Form.Label>
                              <Form.Control
                                 className='bg-transparent text-uppercase'
                                 type="text"
                                 id="user_session"
                                 maxLength={4} minLength={4}
                                 value={searchData.user_session}
                                 isInvalid={validated && !!searchDataError.user_session}
                                 isValid={validated && searchData.user_session && !searchDataError.user_session}
                                 onChange={(e) => handleSearchDataChange('user_session', e.target.value)}
                              />
                              {validated && searchDataError.user_session && (
                                 <Form.Control.Feedback type="invalid">
                                    {searchDataError.user_session}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_class'>Class</Form.Label>
                                 <Form.Select
                                    id="user_class"
                                    value={searchData.user_class}
                                    isInvalid={validated && !!searchDataError.user_class}
                                    isValid={validated && searchData.user_class && !searchDataError.user_class}
                                    onChange={(e) => handleSearchDataChange('user_class', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Class--</option>
                                    {(ceb_session.ceb_user_office === "05" || ceb_session.ceb_user_office === "80" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='06'>Six</option>
                                       <option value='07'>Seven</option>
                                       <option value='08'>Eight</option>
                                       <option value='09'>Nine</option>
                                       <option value='10'>Ten</option>
                                    </>}
                                    {(ceb_session.ceb_user_office === "04" || ceb_session.ceb_user_type === "90" || ceb_session.ceb_user_role === "17") && <>
                                       <option value='11'>Eleven</option>
                                       <option value='12'>Twelve</option>
                                    </>}
                                 </Form.Select>
                                 {validated && searchDataError.user_class && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_class}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_group'>Group</Form.Label>
                                 <Form.Select
                                    id="user_group"
                                    value={searchData.user_group}
                                    isInvalid={validated && !!searchDataError.user_group}
                                    isValid={validated && searchData.user_group && !searchDataError.user_group}
                                    onChange={(e) => handleSearchDataChange('user_group', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Group--</option>
                                    {(searchData.user_class < 13 && searchData.user_class > 8) && <>
                                       <option value='01'>Science</option>
                                       <option value='02'>Huminities</option>
                                       <option value='03'>Business Studies</option>
                                    </>}
                                    {(searchData.user_class < 9 && searchData.user_class > 5) &&
                                       <option value='10'>General</option>}
                                 </Form.Select>
                                 {validated && searchDataError.user_group && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_group}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_version'>Version</Form.Label>
                                 <Form.Select
                                    id="user_version"
                                    value={searchData.user_version}
                                    isInvalid={validated && !!searchDataError.user_version}
                                    isValid={validated && searchData.user_version && !searchDataError.user_version}
                                    onChange={(e) => handleSearchDataChange('user_version', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Version--</option>
                                    <option value='01'>Bangla</option>
                                    <option value='02'>English</option>
                                 </Form.Select>
                                 {validated && searchDataError.user_version && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_version}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={4} className='my-2'>
                              <Form.Group className="bg-transparent">
                                 <Form.Label className="text-primary" htmlFor='user_application'>Application Type</Form.Label>
                                 <Form.Select
                                    id="user_application"
                                    value={searchData.user_application}
                                    isInvalid={validated && !!searchDataError.user_application}
                                    isValid={validated && searchData.user_application && !searchDataError.user_application}
                                    onChange={(e) => handleSearchDataChange('user_application', e.target.value)}
                                    className="selectpicker form-control"
                                    data-style="py-0"
                                 >
                                    <option value="">--Select Application Type--</option>
                                    <option value='01'>Regular</option>
                                    <option value='02'>Late</option>
                                    <option value='03'>Special</option>
                                 </Form.Select>
                                 {validated && searchDataError.user_application && (
                                    <Form.Control.Feedback type="invalid">
                                       {searchDataError.user_application}
                                    </Form.Control.Feedback>
                                 )}
                              </Form.Group>
                           </Col>
                           <Col md={12} className="d-flex justify-content-center gap-3 my-5">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit</Button>
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
               </Form>
            </Col>
         </Row>
      </Fragment>
   )

   // Return if User is not Authorized
   return (
      // <Maintenance />
      <div className='d-flex flex-column justify-content-center align-items-center'>
         <h2 className='text-center text-white mb-2'>This page is under development</h2>
         <Image src={error01} alt="Under Development" />
      </div>
   )
}

export default FormFillupPayment;