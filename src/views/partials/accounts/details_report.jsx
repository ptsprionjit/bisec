import React, { useRef, useMemo, useEffect, useState, Fragment } from 'react'
import Select from 'react-select'
import { Row, Col, Form, Button, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import axios from "axios";

import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

const DetailsReport = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const navigate = useNavigate();
   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   useEffect(() => {
      if (!ceb_session?.ceb_user_id) {
         navigate("/auth/sign-out");
         
      }
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const URL = import.meta.env.VITE_BACKEND_URL;

   //Form Validation and Error
   const [validated, setValidated] = useState(false);

   // Search Data Variables
   const [searchData, setSearchData] = useState(
      {
         eco_code: '', new_code: '', online_code: '', report_start: '', report_end: ''
      }
   );
   const [searchDataError, setSearchDataError] = useState([]);

   //Data Fetch Status
   const [loadingSuccess, setLoadingSuccess] = useState(false);
   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [loadingMessage, setLoadingMessage] = useState(false);

   //Fetched Data
   const [reportData, setReportData] = useState([]);
   const [accountCodes, setAccountCodes] = useState([]);
   const [uniqueEcoCode, setUniqueEcoCode] = useState([]);
   const [uniqueNewCode, setUniqueNewCode] = useState([]);
   const [uniqueOnlineCode, setUniqueOnlineCode] = useState([]);
   const [optionOnlineCode, setOptionOnlineCode] = useState([]);

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState('');
   const [totalAmount, setTotalAmount] = useState(0);
   const [totalAmountWord, setTotalAmountWord] = useState(0);

   const maxDate = new Date();
   maxDate.setHours(maxDate.getHours() - 12);

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

   const calculateSubTotal = (data) => {
      let total = 0;
      data.map(item => {
         total = total + Number(item.pay_board);
         return null;
      });
      setTotalAmount(total);
      calculateWord(total);
   }

   const handlePrint = async () => {
      if (searchValue.length === 0) {
         let current_page = currentPage;
         let current_data = currentData;
         let rows_per_page = rowsPerPage;

         await calculateSubTotal(reportData);
         await setCurrentData(reportData);
         await setRowsPerPage(reportData.length);
         await setCurrentPage(1);

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

         // Restore Data
         setRowsPerPage(rows_per_page);
         setCurrentPage(current_page);
         setCurrentData(current_data);
      } else {
         setSearchValue('');
      }
   };

   useEffect(() => {
      if (reportData.length > 0) {
         setCurrentData(reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > reportData.length ? reportData.length : currentPage * rowsPerPage));
         setTotalPage(Math.ceil(reportData.length / rowsPerPage));
      }
   }, [reportData]);// eslint-disable-line react-hooks/exhaustive-deps

   const useDebounce = (value, delay = 500) => {
      const [debouncedValue, setDebouncedValue] = useState(value);
      useEffect(() => {
         const timer = setTimeout(() => {
            setDebouncedValue(value);
         }, delay);

         return () => clearTimeout(timer); // Cleanup if value changes before delay
      }, [value, delay]); // eslint-disable-line react-hooks/exhaustive-deps

      return debouncedValue;
   }

   const debouncedSearchValue = useDebounce(searchValue, 500);

   const filteredData = useMemo(() => {
      if (!debouncedSearchValue) return currentData;      // If no search, show all

      const search = String(debouncedSearchValue).toUpperCase();
      return reportData.filter((item) =>
         [item.income_code_new, item.inv_date, item.pay_date, item.en_pay_mode, item.pay_board].some((field) =>
            String(field).toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, reportData]); // eslint-disable-line react-hooks/exhaustive-deps

   // Calculate Total for Filtered Data
   useEffect(() => {
      if (filteredData.length > 0) {
         let total = 0;
         filteredData.map(item => {
            total = total + Number(item.pay_board);
            
         });
         setTotalAmount(total);
         calculateWord(total);
      }
   }, [filteredData]);// eslint-disable-line react-hooks/exhaustive-deps

   //Handle Page Change
   const handleSetCurrentPage = (page_num) => {
      page_num = Number(page_num);
      if (page_num > 0 && page_num <= totalPage) {
         setCurrentPage(page_num);
         setCurrentData(reportData.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > reportData.length ? reportData.length : page_num * rowsPerPage));
         calculateSubTotal(reportData.slice((page_num - 1) * rowsPerPage, page_num * rowsPerPage > reportData.length ? reportData.length : page_num * rowsPerPage));
      }
   };

   //Handle Page Row Number Change
   const handleRowsPerPageChange = (data_per_page) => {
      data_per_page = Number(data_per_page);
      setRowsPerPage(data_per_page);
      setTotalPage(Math.ceil(reportData.length / data_per_page));
      setCurrentPage(1);
      setCurrentData(reportData.slice(0, data_per_page > reportData.length ? reportData.length : data_per_page));
      calculateSubTotal(reportData.slice(0, data_per_page > reportData.length ? reportData.length : data_per_page));
   };

   //Handle Search Data Change
   const handleSearchDataChange = (dataName, dataValue) => {
      setSearchData({ ...searchData, [dataName]: dataValue });
      setSearchDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   //Fetch Account Code List
   useEffect(() => {
      const fetchAccountCodes = async () => {
         setLoadingData("Loading Account Codes...");
         try {
            const response = await axios.post(`${URL}/account/account-codes?`);
            setAccountCodes(response.data);
            setUniqueEcoCode([...new Map(response.data.map(item => [item.income_code_economic, item])).values()]);
         } catch (err) {
            setLoadingError("Loading Account Codes Failed!");
            // console.error(err);
            if (err.status === 401) {
               navigate("/auth/sign-out");
               
            }
         } finally {
            setLoadingData(false);
         }
      }
      const timer = setTimeout(() => {
         fetchAccountCodes();
      }, 10);

      return () => clearTimeout(timer);
   }, []);// eslint-disable-line react-hooks/exhaustive-deps

   const fetchData = async () => {
      setLoadingMessage(false);
      setLoadingError(false);
      setLoadingData("তথ্য লোড হচ্ছে।");
      try {
         const response = await axios.post(`${URL}/account/report-details?`, { searchData: searchData });
         if (response.status === 200) {
            setReportData(response.data.data);
            setLoadingSuccess(response.data.message);
            setRowsPerPage(10);
            setTotalPage(Math.ceil(response.data.data.length / 10));
            setCurrentPage(1);
            setCurrentData(response.data.data.slice(0, 10));
            setLoadingMessage(response.data.message);
         }
         if (response.status === 202) {
            setLoadingError(`${response.data.message}`);
         }
         setValidated(true);
      } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
if (err.status === 404) {
            setLoadingError(`${err.message}`);
         } else if (err.status === 401) {
            navigate("/auth/sign-out");
            return null;
         } else {
            setLoadingError(`${err.message}`);
         }
         // console.error(err);
      } finally {
         setLoadingData(false);
      }
   };

   //Submit Form Data
   const searchSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      setTotalAmount(0);
      setLoadingSuccess(false);
      setLoadingData(false);
      setLoadingError(false);
      setLoadingMessage(false);
      setReportData([]);

      if (form.checkValidity() === false) {
         setValidated(false);
      } else {
         let isValid = true;
         const newErrors = {}; // Collect errors in one place
         const requiredFields = [
            'eco_code', 'new_code', 'online_code', 'report_start', 'report_end'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'eco_code':
               case 'new_code':
               case 'online_code':
                  dataError = ValidationInput.numberCheck(searchData[field]);
                  break;

               case 'report_start':
               case 'report_end':
                  dataError = ValidationInput.dateCheck(
                     searchData[field],
                     '2024-01-01',
                     new Date().toISOString().split('T')[0]
                  );
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
         if (!isValid) {
            setValidated(true);
         } else {
            if (searchData.report_start > searchData.report_end) {
               setSearchDataError({ ...searchDataError, report_start: ' তারিখটি শেষ তারিখ থেকে ছোট বা সমান হবে', report_end: ' তারিখটি শুরুর তারিখ থেকে বড় বা সমান হবে' });
               setValidated(true);
            } else {
               fetchData();
               setValidated(false);
            }
         }
      }
   };

   //Reset Form
   const formReset = () => {
      setValidated(false);
      setLoadingSuccess(false);
      setLoadingData(false);
      setLoadingError(false);
      setLoadingMessage(false);
      setTotalAmount(0);
      setReportData([]);
      setUniqueNewCode([]);
      setUniqueOnlineCode([]);
      setOptionOnlineCode([]);
      setSearchData({
         eco_code: '', new_code: '', online_code: '', report_start: '', report_end: ''
      });
      setSearchDataError([]);
   };

   //Hancle Change of Economic Code
   const handleEchoCodeChange = async (codeValue) => {
      setSearchData({ ...searchData, new_code: '', online_code: '' });
      setSearchDataError({ ...searchDataError, new_code: '', online_code: '' });
      handleSearchDataChange('eco_code', codeValue);
      setUniqueNewCode([...new Map(accountCodes.filter(item => item.income_code_economic === codeValue).map(item => [item.income_code_new, item])).values()]);
      setUniqueOnlineCode([]);
      setOptionOnlineCode([]);
   }

   // Set Options For Online Code
   useEffect(() => {
      if (uniqueOnlineCode.length > 0) {
         const newOptions = uniqueOnlineCode.map(onlineCode => ({
            value: onlineCode.income_code_online,
            label: `${onlineCode.income_code_online} - ${onlineCode.income_code_details}`
         }));
         setOptionOnlineCode(newOptions);
      }
   }, [uniqueOnlineCode]);

   //Hancle Change of Economic Code
   const handleNewCodeChange = async (codeValue) => {
      setSearchData({ ...searchData, online_code: '' });
      setSearchDataError({ ...searchDataError, online_code: '' });
      handleSearchDataChange('new_code', codeValue);
      setUniqueOnlineCode([...new Map(accountCodes.filter(item => item.income_code_new === codeValue && item.income_code_economic === searchData.eco_code).map(item => [item.income_code_online, item])).values()]);
      setOptionOnlineCode([]);
   }

   //Hancle Change of Economic Code
   const handleOnlineCodeChange = (codeValue) => {
      handleSearchDataChange('online_code', codeValue);
   }

   if (!ceb_session) {
      return null;
   }

   // Return if Search is Valid
   if (loadingSuccess && (ceb_session.ceb_user_office === "06" || ceb_session.ceb_user_role === "17")) return (
      <Fragment>
         <Row>
            <Col md={12}>
               <Card className='p-0 mb-2'>
                  <Card.Body className='py-1 m-0 d-flex flex-column justify-content-center align-items-center'>
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title pt-2"}>বিস্তারিত হিসাব বিবরণী</h4>
                     {loadingData && <h6 className="text-center rounded-1 text-info p-2 mb-2">{loadingData}</h6>}
                     {loadingError && <h6 className="text-center rounded-1 text-danger p-2 mb-2">{loadingError}</h6>}
                     {loadingMessage && <h6 className="text-center rounded-1 text-success p-2 mb-2">{loadingMessage}</h6>}
                     <Button type="button" onClick={(e) => formReset(e)} variant="btn btn-primary my-2"><span className={styles.SiyamRupaliFont + " text-center"}>ফিরে যান</span></Button>
                  </Card.Body>
               </Card>
            </Col>
            <Col sm="12">
               <Card>
                  <Card.Body className="px-0">
                     <Row className='d-flex flex-row justify-content-between align-items-center px-4'>
                        <Col md="5">
                           <Row>
                              <Form.Label className="text-primary" htmlFor="per_page_data"><small className={styles.SiyamRupaliFont + " text-wrap text-center text-primary"}>প্রতি পাতায় ভাউচার সংখ্যা (সর্বমোট ভাউচার {reportData.length})</small></Form.Label>
                              <Col md={6}>
                                 <Form.Select
                                    id="per_page_data"
                                    value={rowsPerPage || 10}
                                    onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                 // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                                 >
                                    <option disabled value="" className={styles.SiyamRupaliFont + " text-wrap text-center"}>-- ভাউচার সংখ্যা সিলেক্ট করুন --</option>
                                    <option value="10">১০</option>
                                    <option value="20">২০</option>
                                    <option value="50">৫০</option>
                                    <option value="100">১০০</option>
                                 </Form.Select>
                              </Col>
                           </Row>
                        </Col>
                        <Col md="2">
                           {totalPage > 0 && <Button onClick={() => handlePrint()} className='flex-fill' variant="btn btn-success">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer-check-icon lucide-printer-check"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" /><path d="m16 19 2 2 4-4" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /></svg>
                           </Button>}
                        </Col>
                        <Col md="5">
                           <Row>
                              <Form.Label className='d-flex justify-content-end text-primary' htmlFor="search_info"> <small className={styles.SiyamRupaliFont + ' text-end text-primary'}>ভাউচার খুঁজতে নিচের বক্সে লিখুন</small> </Form.Label>
                              <Col md={4}>
                                 { }
                              </Col>
                              <Col md={8}>
                                 <Form.Control
                                    className='bg-transparent text-uppercase form-control-sm'
                                    type="search"
                                    id="search_info"
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    placeholder="তথ্য খুঁজুন..."
                                 />
                              </Col>
                           </Row>
                        </Col>
                     </Row>
                     <Row ref={printRef} className="table-responsive p-4">
                        <Col md={12} className={styles.print_show + ' mb-3 border-bottom border-dark'}>
                           <h4 className={styles.SiyamRupaliFont + " w-100 text-center text-primary text-uppercase py-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড কুমিল্লা</h4>
                           <h6 className={styles.SiyamRupaliFont + " text-center text-uppercase py-1"}>{loadingMessage}</h6>
                           <p className='text-center'><small className={styles.SiyamRupaliFont + " w-100 text-center text-uppercase pt-1"}>সর্বমোট ‍ভাউচারঃ {reportData.length}</small></p>
                        </Col>
                        <table id="user-list-table" className="table table-bordered">
                           <thead>
                              <tr className='border border-secondary'>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>ক্রমিক</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>জমাদানকারী</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>নতুন আর্থিক কোড</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>ভাউচারের তারিখ</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>জমার তারিখ</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>জমার মাধ্যম</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>জমার পরিমাণ</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filteredData.map((item, idx) => (
                                 <tr key={idx} className='border border-secondary'>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.pay_user || item.ins_eiin}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.income_code_new}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.inv_date}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.pay_date}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.en_pay_mode}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.pay_board}/-</td>
                                 </tr>
                              ))}
                              <tr className='border-secondary border-0'>
                                 <td colSpan={7} className='align-top text-center pt-5 pb-2'><h5><u className={styles.SiyamRupaliFont + ' text-center text-wrap text-dark'}>মোট জমার পরিমাণ</u></h5></td>
                              </tr>
                              <tr className='border border-secondary'>
                                 <td colSpan={6} className='align-top p-1 m-0'><h6 className={styles.SiyamRupaliFont + ' text-start text-wrap text-dark'}>কথায়ঃ {totalAmountWord}</h6></td>

                                 <td colSpan={1} className='align-top p-1 m-0'><h6 className={styles.SiyamRupaliFont + ' text-center text-nowrap text-dark'}>={totalAmount}/-</h6></td>
                              </tr>
                           </tbody>
                        </table>
                     </Row>
                     <Row className='d-flex justify-content-between px-4'>
                        <Col md="5">
                           {totalPage > 0 && <Button className='flex-fill m-0 p-0 py-1 bg-transparent' variant="btn btn-link"><span className={styles.SiyamRupaliFont}>ভাউচার {((currentPage - 1) * rowsPerPage) + 1} থেকে {currentPage * rowsPerPage > reportData.length ? reportData.length : currentPage * rowsPerPage} পর্যন্ত</span></Button>}
                        </Col>
                        <Col md="2">
                           {totalPage > 0 && <Button onClick={() => handlePrint()} className='flex-fill' variant="btn btn-success">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-printer-check-icon lucide-printer-check"><path d="M13.5 22H7a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v.5" /><path d="m16 19 2 2 4-4" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" /><path d="M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6" /></svg>
                           </Button>}
                        </Col>
                        <Col md="5" className='d-flex justify-content-center gap-1'>
                           {totalPage > 0 && <Button className='flex-fill m-0 p-0 py-1' disabled={currentPage === 1} value={1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<<"}</Button>}
                           {totalPage > 0 && <Button className='flex-fill m-0 p-0 py-1' disabled={currentPage === 1} value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} variant="btn btn-light">{"<"}</Button>}
                           {totalPage > 0 && currentPage > 1 && <Button value={currentPage - 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0  py-1' variant="btn btn-light">{currentPage - 1}</Button>}
                           {totalPage > 0 && <Button value={currentPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-primary">{currentPage}</Button>}
                           {totalPage > 0 && totalPage - currentPage > 0 && <Button value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{currentPage + 1}</Button>}
                           {totalPage > 0 && <Button disabled={currentPage === totalPage} value={currentPage + 1} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{">"}</Button>}
                           {totalPage > 0 && <Button disabled={currentPage === totalPage} value={totalPage} onClick={(e) => handleSetCurrentPage(e.target.value)} className='flex-fill m-0 p-0 py-1' variant="btn btn-light">{">>"}</Button>}
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )

   if (ceb_session.ceb_user_office === "06" || ceb_session.ceb_user_role === "17") return (
      <>
         <div>
            <Row className='d-flex justify-content-center align-items-center'>
               <Col md="12">
                  <Card>
                     <Card.Header className="d-flex justify-content-between">
                        <div className="header-title w-100">
                           <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}> বিস্তারিত হিসাব বিবরণী </span></h4>
                        </div>
                     </Card.Header>
                     <Card.Body className="px-0">
                        <Row className='justify-content-center'>
                           <Col md="8">
                              {loadingData && <h6 className="text-center rounded-1 text-info p-2 mb-2">{loadingData}</h6>}
                              {loadingError && <h6 className="text-center rounded-1 bg-danger text-white p-2 mb-2">{loadingError}</h6>}
                              {loadingSuccess && <h6 className="text-center rounded-1 bg-danger text-white p-2 mb-2">{loadingSuccess}</h6>}
                              <Form noValidate onSubmit={searchSubmit} onReset={formReset}>
                                 <Row>
                                    <Col md="6" className='py-2'>
                                       <Form.Label htmlFor="eco_code">অর্থনৈতিক কোড</Form.Label>
                                       <Form.Select
                                          id="eco_code"
                                          value={searchData.eco_code}
                                          onChange={(e) => handleEchoCodeChange(e.target.value)}
                                          isInvalid={validated && !!searchDataError.eco_code}
                                          isValid={validated && searchData.eco_code && !searchDataError.eco_code}
                                          disabled={!uniqueEcoCode || uniqueEcoCode.length === 0}
                                       >
                                          <option value="">-- Select Economic Code --</option>
                                          {uniqueEcoCode.map((eCode, index) => (
                                             <option key={index} value={eCode.income_code_economic}>
                                                {eCode.income_code_economic}
                                             </option>

                                          ))}
                                       </Form.Select>
                                       {validated && searchDataError.eco_code && (
                                          <Form.Control.Feedback type="invalid">
                                             অর্থনৈতিক কোড {searchDataError.eco_code}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                    <Col md="6" className='py-2'>
                                       <Form.Label htmlFor="new_code">নতুন কোড</Form.Label>
                                       <Form.Select
                                          id="new_code"
                                          value={searchData.new_code}
                                          onChange={(e) => handleNewCodeChange(e.target.value)}
                                          isInvalid={validated && !!searchDataError.new_code}
                                          isValid={validated && searchData.new_code && !searchDataError.new_code}
                                          disabled={!uniqueNewCode || uniqueNewCode.length === 0}
                                       >
                                          <option disabled value="">-- Select New Code --</option>
                                          {uniqueNewCode.map((eCode, index) => (
                                             <option key={index} value={eCode.income_code_new}>
                                                {eCode.income_code_new + "-" + eCode.income_code_sector}
                                             </option>
                                          ))}
                                       </Form.Select>
                                       {validated && searchDataError.new_code && (
                                          <Form.Control.Feedback type="invalid">
                                             নতুন কোড {searchDataError.new_code}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col md="12" className='py-2'>
                                       <Form.Group>
                                          <label htmlFor='online_code' className='mb-2'>অনলাইন কোড</label>
                                          <Select
                                             inputId="online_code"
                                             placeholder="-- Select Online Code --"
                                             value={
                                                optionOnlineCode.find(opt => opt.value === searchData.online_code) || null
                                             }
                                             onChange={(e) => e ? handleOnlineCodeChange(e.value) : handleOnlineCodeChange('')}
                                             options={optionOnlineCode}
                                             isClearable={true}
                                             isSearchable={true}
                                          />
                                       </Form.Group>
                                       {validated && searchDataError.online_code && (
                                          <small className='text-danger'>অনলাইন কোড {searchDataError.online_code}</small>
                                       )}
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col md="6" className='py-2'>
                                       <Form.Label htmlFor="report_start">শুরুর তারিখ</Form.Label>
                                       <Form.Control
                                          type="date"
                                          id="report_start"
                                          value={searchData.report_start}
                                          isInvalid={validated && !!searchDataError.report_start}
                                          isValid={validated && searchData.report_start && !searchDataError.report_start}
                                          onChange={(e) => handleSearchDataChange('report_start', e.target.value)}
                                       />
                                       {validated && searchDataError.report_start && (
                                          <Form.Control.Feedback type="invalid">
                                             শুরুর {searchDataError.report_start}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                    <Col md="6" className='py-2'>
                                       <Form.Label htmlFor="report_end">শেষ তারিখ</Form.Label>
                                       <Form.Control
                                          type="date"
                                          id="report_end"
                                          max={maxDate.toISOString().split('T')[0]}
                                          value={searchData.report_end}
                                          isInvalid={validated && !!searchDataError.report_end}
                                          isValid={validated && searchData.report_end && !searchDataError.report_end}
                                          onChange={(e) => handleSearchDataChange('report_end', e.target.value)}
                                       />
                                       {validated && searchDataError.report_end && (
                                          <Form.Control.Feedback type="invalid">
                                             শেষ {searchDataError.report_end}
                                          </Form.Control.Feedback>
                                       )}
                                    </Col>
                                 </Row>
                                 <Row>
                                    <Col md={12} className='py-5 d-flex justify-content-center gap-5'>
                                       <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset</Button>
                                       <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit</Button>
                                    </Col>
                                 </Row>
                              </Form>
                           </Col>
                        </Row>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </>
   )

   return (
      <>
         <div className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className='text-center text-white mb-2'>This page is under development</h2>
            <Image src={error01} alt="Under Development" />
         </div>
      </>
   )
}

export default DetailsReport
