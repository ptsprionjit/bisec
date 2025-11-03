import React, { useRef, useEffect, useState, Fragment } from 'react'
import { Row, Col, Button, Image } from 'react-bootstrap'
// import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
// import { useSelector } from "react-redux"

//QR Code
import { QRCodeSVG } from 'qrcode.react';

import axios from "axios";

import Card from '../../../components/Card'

import LogoMedium from '../../../components/partials/components/logo-medium'
import GovLogo from '../../../components/partials/components/gov-logo'
// import * as SettingSelector from '../../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

import * as ValidationInput from '../input_validation'

import Error404 from '../errors/error404'

const ClassStartOrder = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   // const appName = useSelector(SettingSelector.app_name);

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
   const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;

   const navigate = useNavigate();
   const handleRedirect = (() => {
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
   const [printData, setPrintData] = useState(false);
   const [profileSign, setProfileSign] = useState(null);

   const [instMinAmount, setInstMinAmount] = useState([]);


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

   // FORMAT DATE AS YYYY-MM-DD
   const formatDate = (myDate) => {
      myDate = new Date(myDate);
      return `${String(myDate.getDate()).padStart(2, '0')}-${String(myDate.getMonth() + 1).padStart(2, '0')}-${myDate.getFullYear()}`;
   }

   //Signed Signatute Fetch
   const fetchProfileSign = async (id_signed) => {
      // console.log(id_signed);
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

   const classStartAppEval = () => {
      let minvalue = {};

      minvalue.computer_room = '১';
      minvalue.khatiyan_total = '১০০';
      minvalue.class_room = '৬';
      minvalue.office_room = '৩';
      minvalue.library_room = '১';
      minvalue.toilet_room = '৫';
      minvalue.common_room = '২';
      minvalue.total_books = '২০০০';
      minvalue.total_computer = '১০';
      minvalue.general_fund = '২,০০,০০০/-';
      minvalue.reserved_fund = '৪,০০,০০০/-';
      minvalue.founder_amount = '২৫,০০,০০০/-';

      switch (printData.inst_region) {
         case '01':
            switch (printData.clst_status) {
               case '11':
                  minvalue.khatiyan_total = '২০';
                  break;

               case '12':
               case '17':
                  minvalue.khatiyan_total = '২৫';
                  break;

               case '20':
               case '13':
               case '19':
                  minvalue.khatiyan_total = '৫০';
                  break;

               default:
                  break;
            }
            break;
         case '02':
            switch (printData.clst_status) {
               case '11':
                  minvalue.khatiyan_total = '৩০';
                  break;

               case '12':
               case '17':
                  minvalue.khatiyan_total = '৫০';
                  break;

               case '20':
               case '13':
               case '19':
                  minvalue.khatiyan_total = '৭৫';
                  break;

               default:
                  break;
            }
            break;
         case '03':
            switch (printData.clst_status) {
               case '11':
                  minvalue.khatiyan_total = '৫০';
                  break;

               case '12':
               case '17':
                  minvalue.khatiyan_total = '৭৫';
                  break;

               case '20':
               case '13':
               case '19':
                  minvalue.khatiyan_total = '১০০';
                  break;

               default:
                  break;
            }
            break;

         default:
            break;
      }

      switch (printData.clst_status) {
         case '11':
            minvalue.class_room = '৩';
            minvalue.office_room = '২';
            minvalue.library_room = '১';
            minvalue.toilet_room = '৩';
            minvalue.common_room = '১';
            minvalue.total_books = '১০০০';
            minvalue.total_computer = '৪';
            minvalue.general_fund = '১,০০,০০০/-';
            minvalue.reserved_fund = '২,০০,০০০/-';
            minvalue.founder_amount = '১৮,০০,০০০/-';
            break;

         case '12':
         case '17':
            minvalue.class_room = '৫';
            minvalue.office_room = '২';
            minvalue.library_room = '১';
            minvalue.toilet_room = '৪';
            minvalue.common_room = '২';
            minvalue.total_books = '২০০০';
            minvalue.total_computer = '৬';
            minvalue.general_fund = '১,৫০,০০০/-';
            minvalue.reserved_fund = '৩,০০,০০০/-';
            minvalue.founder_amount = '২০,০০,০০০/-';
            break;

         case '20':
            minvalue.class_room = '১০';
            minvalue.office_room = '৩';
            minvalue.library_room = '১';
            minvalue.toilet_room = '৬';
            minvalue.common_room = '২';
            minvalue.total_books = '২০০০';
            minvalue.total_computer = '৮';
            minvalue.general_fund = '২,০০,০০০/-';
            minvalue.reserved_fund = '৪,০০,০০০/-';
            minvalue.founder_amount = '২৫,০০,০০০/-';
            break;

         case '13':
         case '19':
            minvalue.class_room = '৬';
            minvalue.office_room = '৩';
            minvalue.library_room = '১';
            minvalue.toilet_room = '৫';
            minvalue.common_room = '২';
            minvalue.total_books = '২০০০';
            minvalue.total_computer = '১০';
            minvalue.general_fund = '২,০০,০০০/-';
            minvalue.reserved_fund = '৪,০০,০০০/-';
            minvalue.founder_amount = '২৫,০০,০০০/-';
            break;

         default:
            break;
      }

      setInstMinAmount(minvalue);
   }

   useEffect(() => {
      const fetchPrintData = async () => {
         setInstMinAmount([]);
         setPrintSuccess(false);
         // Use URLSearchParams to parse query params more cleanly
         const params = new URLSearchParams(window.location.search);
         const id_order = params.get('id_order');
         params.get('prev_location') ? setPrevLink(params.get('prev_location')) : setPrevLink(null);

         if (!id_order) {
            alert("কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!");
            return;
         } else {
            try {
               const response = await axios.post(`${BACKEND_URL}/institute/class_start/print_order`, { id_order: id_order });
               if (response.status === 200) {
                  setPrintData(response.data.data);
                  await fetchProfileSign(response.data.data.id_signed);
                  classStartAppEval();
                  setPrintSuccess(true);
               } else {
                  alert("কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!");
               }
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
alert("কোন তথ্য পাওয়া যায়নি/তথ্য সঠিক নয়!");
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
            alert("সরাসরি প্রিন্ট করতে ব্রাইজার সেটিংসে পপআপ ব্লকার বন্ধ করুন...");
         }
      };

      const timer = setTimeout(() => {
         checkPopupPermission();
      }, 1000);

      return () => clearTimeout(timer);
   }, [printSuccess]);// eslint-disable-line react-hooks/exhaustive-deps

   if (printSuccess) return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col ref={printRef} id="print-area" md="8" className='m-0 p-2'>
               <Card className="card-transparent shadow-none d-flex justify-content-center">
                  <Card.Header className="d-flex flex-column border-1 border-bottom border-dark justify-content-center m-0 p-0">
                     <div className="py-2 navbar-brand d-flex justify-content-around align-items-start">
                        <LogoMedium color={true} />
                        <div className='ms-3'>
                           {/* <p className="logo-title text-center border border-1 border-dark fs-6 m-0  p-0"><span className={styles.SiyamRupaliFont}>নকলকে না বলি, দিন বদলের দৃঢ় প্রত্যয়ে দেশটাকে গড়ে তুলি</span></p> */}
                           {/* <h5 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</h5> */}
                           {/* <h6 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>লাকসাম রোড, কান্দিরপাড়, কুমিল্লা</h6> */}
                           {/* <h6 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>ফোনঃ (+৮৮০) ২৩৩৪৪০৬৩২৮</h6> */}
                           <h6 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h6>
                           <h6 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>মাধ্যমিক ও উচ্চশিক্ষা বিভাগ</h6>
                           <h6 className={styles.SiyamRupaliFont + " logo-title text-center pb-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা</h6>
                        </div>
                        <GovLogo color={true} />
                     </div>
                  </Card.Header>
                  <Card.Body className="p-3 m-0">
                     <h6 className={styles.SiyamRupaliFont + ' d-flex flex-row justify-content-between align-items-end py-1 m-0 w-100'}>
                        <span className={styles.SiyamRupaliFont + ' d-block text-center'}>স্মারক নম্বরঃ {printData.id_invoice}
                        </span>
                        {/* <span className={styles.SiyamRupaliFont + ' d-block text-center'}>তারিখঃ {ValidationInput.E2BDigit(String(printData.authorize_date).split(' ')[0])}</span> */}
                        <span className={styles.SiyamRupaliFont + ' d-block text-center'}>তারিখঃ {ValidationInput.E2BDigit(formatDate(printData.signed_date))}</span>
                     </h6>
                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-uppercase py-2"}>বিষয়ঃ {printData.bn_dist} জেলার {printData.bn_uzps} উপজেলাধীন {printData.inst_bn_name} এর {printData.clst_status} পর্যায়ে পাঠদানের প্রাথমিক অনুমতি প্রদান প্রসঙ্গে।</h6>

                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-uppercase py-2"}>সূত্রঃ বোর্ডের মঞ্জুরি কমিটির {ValidationInput.E2BDigit(formatDate(printData.grant_assembly_date))} তারিখের {ValidationInput.E2BDigit(printData.grant_assembly)} সভার সুপারিশ এবং {ValidationInput.E2BDigit(formatDate(printData.board_assembly_date))} তারিখে অনুষ্ঠিত {ValidationInput.E2BDigit(printData.board_assembly)} তম বোর্ড সভার অনুমোদিত সিদ্ধান্ত।{printData.board_assebmly}</h6>

                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + styles.text_justify + ' py-2'}>উপর্যুক্ত বিষয় ও সূত্রের প্রেক্ষিতে নির্দেশক্রমে জানানো যাচ্ছে যে, বর্ণিত প্রতিষ্ঠানটিকে নিচে উল্লেখিত শর্তে <b>বিশেষত অবকাঠামোর শর্ত পূরণ সাপেক্ষে</b> {printData.clst_status} পর্যায়ে পাঠদানের প্রাথমিক অনুমতি প্রদান করা হলো। প্রতিষ্ঠানে জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ডের নির্ধারিত পাঠ্যসূচি ও কেবলমাত্র বোর্ড কর্তৃক অনুমতিপ্রাপ্ত বিষয়সমূহ পাঠদান করতে হবে এবং প্রদত্ত মেয়াদকালের মধ্যে স্বীকৃতির জন্য ফি জমাসহ আবেদন পেশ ও আরোপিত শর্তাদি পূরণের ব্যবস্থা করতে হবে।</h6>

                     <h6 className={styles.SiyamRupaliFont + ' text-decoration-underline'}>শর্তাবলীঃ</h6>
                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + styles.text_justify}>
                        <small>
                           ০১। {printData.clst_status} পর্যায়ে পাঠদানের অনুমতি কোনক্রমেই স্বীকৃতি হিসেবে গণ্য করা যাবে না। <br />
                           ০২। নীতিমালা অনুযায়ী কমপক্ষে {instMinAmount.khatiyan_total} শতক জমি থাকতে হবে এবং উক্ত জমিতে ভবন নির্মাণ করে শিক্ষা কার্যক্রম পরিচালনা করতে হবে। কোন অবস্থায় ভাড়াকৃত বাড়িতে শিক্ষা কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ০৩। নিয়োগকৃত শিক্ষক-কর্মচারীদের বেতন-ভাতাদি সংশ্লিষ্ট শিক্ষা প্রতিষ্ঠানের নিজস্ব তহবিল হতে পরিশোধ করতে হবে। <br />
                           ০৪। গর্ভনিং বডি ও ম্যানেজিং কমিটির প্রবিধানমালা-২০২৪ অনুযায়ী এই স্মারক ইস্যুর ৩০ (ত্রিশ) দিনের মধ্যে নির্বাহী কমিটি গঠন করতে হবে। <br />
                           ০৫। ব্যানবেইস হতে স্ব-উদ্যোগে EIIN সংগ্রহ করে বিদ্যালয়/কলেজ শাখায় জমা দিতে হবে এবং প্রতিষ্ঠানের Password সংগ্রহ করতে হবে। <br />
                           ০৬। বেসরকারি প্রতিষ্ঠানের জনকাঠামো ও এমপিও নীতিমালা এর অনুমোদিত স্টাফিং, প্যাটার্ন অনুযায়ী যোগ্যতাসম্পন্ন জনবল নিয়োগ করতে হবে। <br />
                           ০৭। পর্যায়ক্রমে সকল শিক্ষেককে প্রশিক্ষণ গ্রহণ করতে হবে। <br />
                           ০৮। প্রতিষ্ঠানে ন্যূনতম {instMinAmount.total_books} বই বিশিষ্ট পাঠাগার এবং ন্যূনতম {instMinAmount.total_computer} টি কম্পিউটার বিশিষ্ট ল্যাব এবং খেলার মাঠ থাকতে হবে। বিশুদ্ধ খাবার পানি সরবরাহ এবং ছাত্র-ছাত্রীদের পৃথক শৌচাগারের ব্যবস্থা থাকতে হবে। <br />
                           ০৯। প্রতিষ্ঠানের রেকর্ডপত্র সঠিকভাবে সংরক্ষণ করতে হবে। <br />
                           ১০। প্রতিষ্ঠানের নিজস্ব Website এবং Email Address থাকতে হবে। <br />
                           ১১। ছাত্র-ছাত্রীদের কোন অবস্থাতেই বেত্রাঘাত করা যাবে না বরং তাদের সাথে সহনশীল মনোভাব প্রদর্শন করতে হবে।<br />
                           ১২। সাধারণ তহবিলে {instMinAmount.general_fund} টাকা এবং সংরক্ষিত তহবিলে {instMinAmount.reserved_fund} টাকা সঞ্চয়পত্র বা স্থায়ী আমানত হিসেবে রাখতে হবে। সংরক্ষিত তহবিলের অর্থ বোর্ডের অনুমতি ব্যতীত উত্তোলন করা যাবে না। <br />
                           ১৩। জাতীয় দিবস সমূহ, বার্ষিক ক্রীড়া/খেলাধুলা/সাঁতার, সাহিত্য ও সংস্কৃতি বিষয়ক অনুষ্ঠান, বিতর্ক প্রতিযোগীতা, বিজ্ঞান মেলা, বৃক্ষরোপন, স্কাউটিং/গার্ল গাইড, স্টুডেন্ট কেবিনেট, পরিষ্কার-পরিচ্ছন্নতা ইত্যাদি কার্যক্রম প্রহণ এবং সীমানা প্রাচীর নির্মাণ করতে হবে। <br />
                           ১৪। ধর্মীয় এবং সামাজিক মূল্যবোধ ইত্যাদির সাথে সাংঘর্ষিক কোন কার্যক্রম পরিচালনা করা যাবে না।<br />
                           ১৫। বেসরকারি প্রতিষ্ঠানের প্রচলিত নীতিমালার অন্যান্য শর্ত মেনে চলতে হবে এবং কোন শর্ত প্রতিপারনে ব্যর্থ হলে বোর্ড/সরকার যে কোন সময় এ অনুমোদন বাতিল করতে পারে।<br />
                           দাখিলকৃত তথ্য ভূল প্রমাণিত হলে উক্ত আদেশ বাতিল বলে গণ্য হবে।
                        </small>
                     </h6>

                     <h6 className={styles.SiyamRupaliFont + ' d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment-order?order-id=${printData.id_invoice}`} size={100} />
                        <span className={styles.SiyamRupaliFont + ' d-block text-center'}><br /> <Image className="p-2 w-75" src={profileSign} alt="Profile Signature" /><br />( {printData.profile_bnname || printData.profile_name} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>

                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-uppercase py-2"}><small>{printData.inst_bn_name}, {printData.bn_uzps}, {printData.bn_dist}।</small></h6>

                     <section></section>

                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-decoration-underline text-uppercase pt-3"}><small className={styles.SiyamRupaliFont}>অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরণ করা হলো (জ্যেষ্ঠতার ক্রমানুসারে নয়):</small></h6>

                     <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " text-left text-uppercase pt-1"}>
                        <small className={styles.SiyamRupaliFont}>
                           ০১। সিনিয়র সচিব, সিনিয়র সচিবের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা বিভাগ। <br />
                           ০২। মহাপরিপালক, মহাপরিপালকের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর। <br />
                           ০৩। মহাপরিপালক, মহাপরিপালকের দপ্তর, বাংলাদেশ শিক্ষাতথ্য ও পরিসংখ্যান ব্যুরো (ব্যানবেইস)। <br />
                           ০৪। পরীক্ষা নিয়ন্ত্রক, মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা। <br />
                           ০৫। জেলা প্রশাসক, জেলা প্রশাসকের কার্যালয়, {printData.bn_dist}। <br />
                           ০৬। পরিচালক, পরিচালকের দপ্তর, মাধ্যমিক ও উচ্চশিক্ষা কুমিল্লা অঞ্চল, কুমিল্লা। <br />
                           ০৭। সিনিয়র সিস্টেম এনালিস্ট, মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা। <br />
                           ০৮। জেলা শিক্ষা কর্মকর্তা, জেলা শিক্ষা অফিস, {printData.bn_dist}। <br />
                           ০৯। সংশ্লিষ্ট নথি।
                        </small>
                     </h6>

                     <h6 className={styles.SiyamRupaliFont + ' d-flex flex-row justify-content-between align-items-end p-0 m-0 w-100'}>
                        <QRCodeSVG className='p-1 d-block' value={`${FRONTEND_URL}/institute/establishment-order?order-id=${printData.id_invoice}`} size={100} />
                        <span className={styles.SiyamRupaliFont + ' d-block text-center'}><br /> <Image className="p-2 w-50" src={profileSign} alt="Profile Signature" /> <br />( {printData.profile_bnname || printData.profile_name} )<br /> {printData.bn_post} <br /> মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা<br /></span>
                     </h6>
                  </Card.Body>
               </Card>
            </Col>
            <Col md="8" className='bg-transparent gap-5 d-flex justify-content-center align-items-center p-2 mb-5'>
               {prevLink && <Button className='flex-fill' onClick={handleRedirect} type="button" variant="btn btn-secondary">Close</Button>}
               <Button className='flex-fill' onClick={handlePrint} type="button" variant="btn btn-info">Print</Button>
            </Col>
         </Row>
      </Fragment>
   );

   return (
      <Error404 />
   );
}

export default ClassStartOrder
