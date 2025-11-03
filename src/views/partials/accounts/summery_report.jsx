import React, { useRef, useMemo, useEffect, useState, Fragment } from 'react'
import { Row, Col, Form, Button, Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import axios from "axios";

import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css'

import error01 from '../../../assets/images/error/01.png'

import * as ValidationInput from '../input_validation'

const SummeryReport = () => {
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
         report_start: '', report_end: '', groupby_code: '04'
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

   //Pagination
   const [totalPage, setTotalPage] = useState();
   const [currentPage, setCurrentPage] = useState();
   const [rowsPerPage, setRowsPerPage] = useState();
   const [currentData, setCurrentData] = useState([]);
   const [searchValue, setSearchValue] = useState('');
   const [totalAmount, setTotalAmount] = useState(0);
   const [totalVoucher, setTotalVoucher] = useState(0);
   const [totalAmountWord, setTotalAmountWord] = useState('');

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
      let amount = 0;
      let voucher = 0;
      data.map(item => {
         amount = amount + Number(item.voucher_amount);
         voucher = voucher + Number(item.voucher_number);
         return null;
      });
      setTotalAmount(amount);
      calculateWord(amount);
      setTotalVoucher(voucher);
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

   // Set Total Page
   useEffect(() => {
      if (reportData.length > 0) {
         setCurrentData(reportData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage > reportData.length ? reportData.length : currentPage * rowsPerPage));
         setTotalPage(Math.ceil(reportData.length / rowsPerPage));
      }
   }, [reportData]);// eslint-disable-line react-hooks/exhaustive-deps

   // Set Debounce for Search
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

   // Call Debounce
   const debouncedSearchValue = useDebounce(searchValue, 500);

   // Filter Data Based on Search Input
   const filteredData = useMemo(() => {
      if (!debouncedSearchValue) return currentData;      // If no search, show all

      const search = String(debouncedSearchValue).toUpperCase();

      return reportData.filter((item) =>
         [item.income_code_economic, item.income_code_old, item.income_code_new, item.income_code_sector, item.income_code_details, item.voucher_number, item.voucher_amount].some((field) =>
            String(field).toUpperCase().includes(search)
         )
      );
   }, [debouncedSearchValue, currentData, reportData]); // eslint-disable-line react-hooks/exhaustive-deps

   // Calculate Total for Filtered Data
   useEffect(() => {
      if (filteredData.length > 0) {
         let amount = 0;
         let voucher = 0;
         filteredData.map(item => {
            amount = amount + Number(item.voucher_amount);
            voucher = voucher + Number(item.voucher_number);
            
         });
         setTotalAmount(amount);
         calculateWord(amount);
         setTotalVoucher(voucher);
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

   const fetchData = async () => {
      setLoadingMessage(false);
      setLoadingError(false);
      setLoadingData("তথ্য লোড হচ্ছে।");
      try {
         const response = await axios.post(`${URL}/account/report-summery?`, { searchData: searchData });
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
      setTotalVoucher(0);
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
            'report_start', 'report_end', 'groupby_code'
         ];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'report_start':
                  dataError = ValidationInput.dateCheck(
                     searchData[field],
                     '1961-01-01',
                     searchData.report_end
                  );
                  break;
               case 'report_end':
                  dataError = ValidationInput.dateCheck(
                     searchData[field],
                     searchData.report_start,
                     new Date().toISOString().split('T')[0]
                  );
                  break;

               case 'groupby_code':
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
      setTotalVoucher(0);
      setReportData([]);
      setSearchData({
         report_start: '', report_end: '', groupby_code: '04'
      });
      setSearchDataError([]);
      setTotalAmountWord('');
   };

   // Return if Session Data not Defined
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
                     <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase card-title pt-2"}>হিসাব বিবরণী</h4>
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
                              <Form.Label className="text-primary" htmlFor="per_page_data"><small className={styles.SiyamRupaliFont + " text-wrap text-center text-primary"}>প্রতি পাতায় আয়খাত সংখ্যা (সর্বমোট আয়খাত {reportData.length})</small></Form.Label>
                              <Col md={6}>
                                 <Form.Select
                                    id="per_page_data"
                                    value={rowsPerPage || 10}
                                    onChange={(e) => handleRowsPerPageChange(e.target.value)}
                                 // disabled={!uniqueEcoCode || loadingAccountCodes || uniqueEcoCode.length === 0}
                                 >
                                    <option disabled value="" className={styles.SiyamRupaliFont + " text-wrap text-center"}>-- আয়খাত সংখ্যা সিলেক্ট করুন --</option>
                                    <option value="10">১০</option>
                                    <option value="20">২০</option>
                                    <option value="50">৫০</option>
                                    <option value="100">১০০</option>
                                 </Form.Select>
                              </Col>
                           </Row>
                        </Col>
                        <Col md="2">
                           { }
                        </Col>
                        <Col md="5">
                           <Row>
                              <Form.Label className='d-flex justify-content-end text-primary' htmlFor="search_info"> <small className={styles.SiyamRupaliFont + ' text-end text-primary'}>আয়খাত খুঁজতে নিচের বক্সে লিখুন</small> </Form.Label>
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
                           <h4 className={styles.SiyamRupaliFont + " text-center text-primary text-uppercase py-1"}>মাধ্যমিক ও উচ্চমাধ্যমিক শিক্ষা বোর্ড কুমিল্লা</h4>
                           <h5 className={styles.SiyamRupaliFont + " text-center text-dark text-uppercase py-1"}>হিসাব শাখা (জমা)</h5>
                           <h6 className={styles.SiyamRupaliFont + " text-center text-uppercase py-1"}>{loadingMessage}</h6>
                           <p className='text-center'><small className={styles.SiyamRupaliFont + " text-center text-uppercase pt-1"}>সর্বমোট ‍ভাউচারঃ {totalVoucher}</small></p>
                        </Col>
                        <table id="user-list-table" className="table table-bordered">
                           <thead>
                              <tr className='border border-secondary'>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>ক্রমিক</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>অর্থনৈতিক কোড</th>
                                 {searchData.groupby_code > 1 && <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>পুরনো আর্থিক কোড</th>}
                                 {searchData.groupby_code > 2 && <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>নতুন আর্থিক কোড</th>}
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>আয়খাতের বিবরণী</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>মোট ভাউচার</th>
                                 <th className={styles.SiyamRupaliFont + " text-center align-top text-primary p-1 m-0"}>জমার পরিমাণ</th>
                              </tr>
                           </thead>
                           <tbody>
                              {filteredData.map((item, idx) => (
                                 <tr key={idx} className='border border-secondary'>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.income_code_economic}</td>
                                    {searchData.groupby_code > 1 && <td className='text-center align-top text-wrap p-1 m-0'>{item.income_code_old}</td>}
                                    {searchData.groupby_code > 2 && <td className='text-center align-top text-wrap p-1 m-0'>{item.income_code_new}</td>}
                                    <td className='text-center align-top text-wrap p-1 m-0'>{searchData.groupby_code > 3 ? item.income_code_details : item.income_code_sector}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.voucher_number}</td>
                                    <td className='text-center align-top text-wrap p-1 m-0'>{item.voucher_amount}/-</td>
                                 </tr>
                              ))}
                              <tr className='border-secondary border-0'>
                                 {searchData.groupby_code > 2 && <td colSpan={7} className='align-top text-center pt-5 pb-2'><h5><u className={styles.SiyamRupaliFont + ' text-center text-wrap text-dark'}>মোট জমার পরিমাণ</u></h5></td>}
                                 {searchData.groupby_code === "2" && <td colSpan={6} className='align-top text-center pt-5 pb-2'><h5><u className={styles.SiyamRupaliFont + ' text-center text-wrap text-dark'}>মোট জমার পরিমাণ</u></h5></td>}
                                 {searchData.groupby_code === "1" && <td colSpan={5} className='align-top text-center pt-5 pb-2'><h5><u className={styles.SiyamRupaliFont + ' text-center text-wrap text-dark'}>মোট জমার পরিমাণ</u></h5></td>}
                              </tr>
                              <tr className='border border-secondary'>
                                 {searchData.groupby_code > 2 && <td colSpan={6} className='align-top p-1 m-0'><h6 className={styles.SiyamRupaliFont + ' text-start text-wrap text-dark'}>কথায়ঃ {totalAmountWord}</h6></td>}
                                 {searchData.groupby_code === "2" && <td colSpan={5} className='align-top p-1 m-0'><h6 className={styles.SiyamRupaliFont + ' text-start text-wrap text-dark'}>কথায়ঃ {totalAmountWord}</h6></td>}
                                 {searchData.groupby_code === "1" && <td colSpan={4} className='align-top p-1 m-0'><h6 className={styles.SiyamRupaliFont + ' text-start text-wrap text-dark'}>কথায়ঃ {totalAmountWord}</h6></td>}

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
                           <h4 className="card-title text-center text-primary flex-fill"><span className={styles.SiyamRupaliFont + " text-center"}> হিসাব বিবরণী </span></h4>
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
                                    <Col md="12" className='py-2'>
                                       <Form.Label htmlFor="groupby_code">রিপোর্ট তৈরির ধরণ</Form.Label>
                                       <Form.Select
                                          id="groupby_code"
                                          value={searchData.groupby_code || '04'}
                                          isInvalid={validated && !!searchDataError.groupby_code}
                                          isValid={validated && searchData.groupby_code && !searchDataError.groupby_code}
                                          onChange={(e) => handleSearchDataChange('groupby_code', e.target.value)}
                                       >
                                          <option value="">-- Select Report Type Code --</option>
                                          <option value="1">অর্থনৈতিক খাত অনুযায়ী</option>
                                          <option value="2">পুরাতন খাত অনুযায়ী</option>
                                          <option value="3">নতুন খাত অনুযায়ী</option>
                                          <option value="4">নতুন উপখাত অনুযায়ী</option>
                                       </Form.Select>
                                       {validated && searchDataError.groupby_code && (
                                          <Form.Control.Feedback type="invalid">
                                             খাত {searchDataError.groupby_code}
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

export default SummeryReport
