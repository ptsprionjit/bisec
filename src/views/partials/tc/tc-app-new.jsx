import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

import Select from 'react-select'

import axios from "axios";

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'
import { Fragment } from 'react';

import * as InputValidation from '../input_validation'

const TcApplication = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

   const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

   const appName = useSelector(SettingSelector.app_bn_name);
   // const navigate = useNavigate();

   //Form Validation and Error
   const [validated, setValidated] = useState(false);
   // const [error, setError] = useState(null);

   const [userData, setUserData] = useState({
      'st_class': '', 'st_reg': '', 'st_dob': '', 'st_session': '', 'dst_board': '11', 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '', 'st_mobile': '', 'st_email': '',
   });

   // Set BTC Data
   const [btcData, setBtcData] = useState(false);

   const [userDataError, setUserDataError] = useState([]);

   const [loadingData, setLoadingData] = useState(false);
   const [loadingError, setLoadingError] = useState(false);
   const [loadingSuccess, setLoadingSuccess] = useState(false);

   // Student Fetched Data
   const [stData, setStData] = useState(false);
   const [tcData, setTcData] = useState(false);
   const [dateData, setDateData] = useState(false);
   const [instituteList, setInstituteList] = useState([]);
   const [isPrevTc, setIsPrevTc] = useState(false);

   //Unpaid Application Set
   const [pendingApplication, setPendingApplication] = useState(false);
   const [pendingResume, setPendingResume] = useState(false);

   //Paid Application Set
   const [appDetails, setAppDetails] = useState(false);

   //Paid Application Status Set
   const [srcEiinPending, setSrcEiinPending] = useState(false);
   const [srcEiinCancel, setSrcEiinCancel] = useState(false);
   const [srcEiinAuth, setSrcEiinAuth] = useState(false);

   const [dstEiinPending, setDstEiinPending] = useState(false);
   const [dstEiinCancel, setDstEiinCancel] = useState(false);
   const [dstEiinAuth, setDstEiinAuth] = useState(false);

   const [srcBoardPending, setSrcBoardPending] = useState(false);
   const [srcBoardCancel, setSrcBoardCancel] = useState(false);
   const [srcBoardAuth, setSrcBoardAuth] = useState(false);

   const [dstBoardPending, setDstBoardPending] = useState(false);
   const [dstBoardCancel, setDstBoardCancel] = useState(false);
   const [dstBoardAuth, setDstBoardAuth] = useState(false);

   const [tcOrder, setTcOrder] = useState(false);

   // Districts and Upazilas
   const [optionDistricts, setOptionDistricts] = useState([]);
   const [optionUpazilas, setOptionUpazilas] = useState([]);
   const [optionInstitutes, setoptionInstitutes] = useState([]);

   //Set Transfer Request
   const [tcRequest, setTcRequest] = useState(false);

   const curDateTime = new Date();
   curDateTime.setHours(curDateTime.getUTCHours() + 12);

   // Fetch Institute Data
   const fetchInstitute = async () => {
      setLoadingData('প্রতিষ্ঠানের তথ্য লোড হচ্ছে...অপেক্ষা করুন...');
      try {
         const response = await axios.post(`${BACKEND_URL}/institute/list`, {});
         if (response.status === 200) {
            setInstituteList(response.data.instList);
         } else {
            setLoadingError(response.data.message);
         }
      } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setLoadingError("প্রতিষ্ঠানের তথ্য পাওয়া যায়নি! কিছুক্ষণ পর আবার চেষ্টা করুন!");
      } finally {
         setLoadingData(false);
      }
   };

   // Set Previous TC
   const handleSetPrevTc = async (tcData) => {
      const tcDataLength = tcData.length;

      if (tcDataLength) {
         tcData.map((data, idx) => {
            if (!isPrevTc) {
               if (data.src_eiin_auth === '17' && data.src_board_auth === '17' && ((data.dst_eiin_auth === '17' && data.dst_board_auth === '17' && data.src_board === data.dst_board) || data.src_board !== data.dst_board)) {
                  setIsPrevTc(true);
               } else {
                  if (tcDataLength === idx + 1) {
                     if (data.id_payment !== '03' || data.src_eiin_auth === '18' || data.dst_eiin_auth === '18' || data.src_board_auth === '18' || data.dst_board_auth === '18') {
                        setIsPrevTc(false);
                     }
                  }
               }
            } else {
               return null;
            }
            return null;
         });
      }

   }

   //Application Status Set
   const appStatus = (() => {
      switch (stData.src_eiin_auth) {
         case '13':
            setSrcEiinPending("অপেক্ষমান");
            setSrcEiinCancel(false);
            setSrcEiinAuth(false);
            break;
         case '17':
            setSrcEiinPending(false);
            setSrcEiinCancel(false);
            setSrcEiinAuth("অনুমোদিত");
            break;
         case '18':
            setSrcEiinPending(false);
            setSrcEiinCancel("বাতিল");
            setSrcEiinAuth(false);
            break;
         default:
            setSrcEiinPending(false);
            setSrcEiinCancel(false);
            setSrcEiinAuth(false);
            break;
      }
      switch (stData.dst_eiin_auth) {
         case '13':
            setDstEiinPending("অপেক্ষমান");
            setDstEiinCancel(false);
            setDstEiinAuth(false);
            break;
         case '17':
            setDstEiinPending(false);
            setDstEiinCancel(false);
            setDstEiinAuth("অনুমোদিত");
            break;
         case '18':
            setDstEiinPending(false);
            setDstEiinCancel("বাতিল");
            setDstEiinAuth(false);
            break;
         default:
            setDstEiinPending(false);
            setDstEiinCancel(false);
            setDstEiinAuth(false);
            break;
      }
      switch (stData.src_board_auth) {
         case '13':
            setSrcBoardPending("অপেক্ষমান");
            setSrcBoardCancel(false);
            setSrcBoardAuth(false);
            break;
         case '17':
            setSrcBoardPending(false);
            setSrcBoardCancel(false);
            setSrcBoardAuth("অনুমোদিত");
            break;
         case '18':
            setSrcBoardPending(false);
            setSrcBoardCancel("বাতিল");
            setSrcBoardAuth(false);
            break;
         default:
            setSrcBoardPending(false);
            setSrcBoardCancel(false);
            setSrcBoardAuth(false);
            break;
      }
      switch (stData.dst_board_auth) {
         case '13':
            setDstBoardPending("অপেক্ষমান");
            setDstBoardCancel(false);
            setDstBoardAuth(false);
            break;
         case '17':
            setDstBoardPending(false);
            setDstBoardCancel(false);
            setDstBoardAuth("অনুমোদিত");
            break;
         case '18':
            setDstBoardPending(false);
            setDstBoardCancel("বাতিল");
            setDstBoardAuth(false);
            break;
         default:
            setDstBoardPending(false);
            setDstBoardCancel(false);
            setDstBoardAuth(false);
            break;
      }

      if (stData.src_eiin_auth === '17' && stData.src_board_auth === '17' && ((stData.dst_eiin_auth === '17' && stData.dst_board_auth === '17' && stData.src_board === stData.dst_board) || stData.src_board !== stData.dst_board)) {
         setTcOrder(true);
      } else {
         setTcOrder(false);
      }
   });

   // Handle User Data Change
   const handleDataChange = (dataName, dataValue) => {
      setUserData({ ...userData, [dataName]: dataValue });
      setUserDataError(prev => ({ ...prev, [dataName]: '' }));
   }

   // Handle Institute Data Change
   const handleInstDataChange = (instData) => {
      instData?.value ? setUserData({ ...userData, 'id_institute': instData.value, 'en_institute': String(instData.label).split('-[')[0].replaceAll("'", "") }) : setUserData({ ...userData, 'id_institute': '', 'en_institute': '' });
   }

   useEffect(() => {
      if (appDetails) {
         appStatus();
      }
   }, [appDetails]);// eslint-disable-line react-hooks/exhaustive-deps

   //Print Application
   const printApplication = (() => {
      window.open(`/student/tc/application/print?invoiceNo=${stData.id_invoice}`, '_blank', 'noopener noreferrer');
   });

   //Print TC Order
   const tcOrderPrint = (() => {
      window.open(`/tc/tc-order?invoiceNo=${stData.id_invoice}`, '_blank', 'noopener noreferrer');
      // navigate(`/tc/tc-order?invoiceNo=${stData.id_invoice}`);
   });

   // TC Status
   const tcStatus = (() => {
      if (stData.src_eiin_auth === '18' && stData.dst_eiin_auth === '18' && stData.src_board_auth === '18' && stData.dst_board_auth === '18') {
         alert("আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_board_auth === '18' && stData.dst_board_auth === '18') {
         alert("বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_board_auth === '18') {
         alert("বর্তমান বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.dst_board_auth === '18') {
         alert("গন্তব্য বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_eiin_auth === '18' && stData.dst_eiin_auth === '18') {
         alert("প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_eiin_auth === '18') {
         alert("বর্তমান প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.dst_eiin_auth === '18') {
         alert("গন্তব্য প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_eiin_auth === '13' && stData.dst_eiin_auth === '13' && stData.src_board_auth === '13' && stData.dst_board_auth === '13') {
         alert("আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_eiin_auth === '13' && stData.dst_eiin_auth === '13') {
         alert("প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_eiin_auth === '13') {
         alert("বর্তমান প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.dst_eiin_auth === '13') {
         alert("গন্তব্য প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_board_auth === '13' && stData.dst_board_auth === '13') {
         alert("বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_board_auth === '13') {
         alert("বর্তমান বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.dst_board_auth === '13') {
         alert("গন্তব্য বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else {
         alert("আবেদন প্রসেস হয়নি");
      }
   });

   // Student Data Fetch 
   const fetchStudentData = async () => {
      setLoadingData("শিক্ষার্থীর তথ্য লোড হচ্ছে... অপেক্ষা করুন...");

      try {
         const response = await axios.post(`${BACKEND_URL}/student/tc/data`, { userData: userData });
         if (response.status === 200) {
            if (response?.data?.dateData) {
               setDateData(response.data.dateData);
            }
            if (response?.data?.stData) {
               setStData(response.data.stData);
            }
            if (response?.data?.tcData) {
               await handleSetPrevTc(response.data.tcData);
               setTcData(response.data.tcData);
            }
            // console.log(response.data.dateData);
            await fetchInstitute();
         } else {
            setLoadingError("শিক্ষার্থীর তথ্য সঠিক নয়!");
         }
      } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setLoadingError("শিক্ষার্থীর তথ্য সঠিক নয়!");
      } finally {
         setLoadingData(false);
      }
   }

   // Reset form
   const searchReset = () => {
      setValidated(false);
      setUserData({
         'st_class': '', 'st_reg': '', 'st_dob': '', 'st_session': '', 'dst_board': '11', 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '', 'st_mobile': '', 'st_email': '',
      });
      setUserDataError([]);
      setDateData(false);
      setTcData(false);
      setIsPrevTc(false);

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      setPendingApplication(false);
      setPendingResume(false);
      setAppDetails(false);
      setTcRequest(false);
      setStData(false);
   };

   // Submit Student Form Data
   const searchSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      let isValid = true;
      const newErrors = {}; // Collect errors in one place

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      if (form.checkValidity() === false) {
         setValidated(false);
         setLoadingError('শিক্ষার্থীর তথ্য সঠিকভাবে পূরণ করতে হবে!');
      } else {
         const requiredFields = ['st_class', 'st_reg', 'st_dob', 'st_session'];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'st_class':
               case 'st_reg':
               case 'st_session':
                  dataError = InputValidation.numberCheck(userData[field]);
                  break;

               case 'st_dob':
                  dataError = InputValidation.dateCheck(userData[field], userData[field], userData[field]);
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
         setUserDataError(newErrors);

         if (!isValid) {
            setLoadingError("শিক্ষার্থীর তথ্য সঠিকভাবে পূরণ করতে হবে!");
         } else {
            fetchStudentData();
         }
      }
   };

   //Submit Transfer Request Form Data
   const transferSubmit = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      let isValid = true;
      const newErrors = {}; // Collect errors in one place

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      if (form.checkValidity() === false) {
         setValidated(false);
         setLoadingError('শিক্ষার্থীর তথ্য সঠিকভাবে পূরণ করতে হবে!');
      } else {
         const requiredFields = ['dst_board', 'en_dist', 'id_uzps', 'id_institute', 'en_institute'];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'dst_board':
               case 'id_institute':
                  dataError = InputValidation.numberCheck(userData[field]);
                  break;

               case 'id_uzps':
                  dataError = !btcData ? InputValidation.numberCheck(userData[field]) : "";
                  break;

               case 'en_dist':
                  dataError = !btcData ? InputValidation.alphaCheck(userData[field]) : "";
                  break;

               case 'en_institute':
                  dataError = InputValidation.addressCheck(userData[field]);
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
         setUserDataError(newErrors);

         if (!isValid) {
            setLoadingError("শিক্ষার্থীর তথ্য সঠিকভাবে পূরণ করতে হবে!");
         } else {
            setTcRequest(true);
         }
      }
   };

   //Submit Transfer Request Form Data
   const transferReset = (event) => {
      event.preventDefault();
      event.stopPropagation();

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      setPendingApplication(false);

      // setValidated(true);

      setUserData({ ...userData, 'dst_board': '11', 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '' });
      setUserDataError([]);
   };

   // Submit Payment Initiation Data
   const submitPayment = (event) => {
      const form = event.currentTarget;
      event.preventDefault();
      event.stopPropagation();
      let isValid = true;
      const newErrors = {}; // Collect errors in one place

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      if (form.checkValidity() === false) {
         setValidated(false);
         setLoadingError('পেমেন্ট তথ্য সঠিকভাবে পূরণ করতে হবে!');
      } else {
         const requiredFields = ['st_mobile', 'st_email'];

         requiredFields.forEach(field => {
            let dataError = null;

            switch (field) {
               case 'st_mobile':
                  dataError = InputValidation.numberCheck(userData[field]);
                  break;

               case 'st_email':
                  dataError = InputValidation.emailCheck(userData[field]);
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
         setUserDataError(newErrors);

         if (!isValid) {
            setLoadingError("পেমেন্ট তথ্য সঠিকভাবে পূরণ করতে হবে!");
         } else {
            const myData = {
               id_invoice: stData.id_invoice, st_reg: stData.st_reg, st_roll: stData.st_roll, st_class: userData.st_class, st_year: userData.st_session, src_board: stData.id_board, src_eiin: stData.src_eiin, dst_board: userData.dst_board, dst_eiin: userData.id_institute, btc_institute: userData.en_institute, payName: stData.st_name, payMobile: userData.st_mobile, payEmail: userData.st_email
            };

            const payInitiate = async () => {
               setLoadingData("পেমেন্ট এর জন্য তথ্য প্রসেস হচ্ছে... অপেক্ষা করুন...");
               try {
                  const response = !pendingResume ? await axios.post(`${BACKEND_URL}/student/tc/payment/initiate?`, { userData: myData }) : await axios.post(`${BACKEND_URL}/student/tc/payment/resume?`, { userData: myData });
                  if (response.status === 200) {
                     setLoadingSuccess(response.data.message);
                     window.location.href = response.data.responseData.RedirectToGateway;
                  } else {
                     setValidated(false);
                     setLoadingError(response.data.message);
                  }
               } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setValidated(false);
                  setLoadingError("পেমেন্ট গেটওয়েতে সমস্যা। কিছুক্ষণ পর আবার চেষ্টা করুন!");
               } finally {
                  setLoadingData(false);
               }
            }

            // Initiate Payment
            payInitiate();
         }
      }
   };

   // Reset Payment Data
   const resetPayment = (event) => {
      event.preventDefault();
      event.stopPropagation();

      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);

      setUserData({ ...userData, 'st_mobile': '', 'st_email': '' });
      setUserDataError([]);
   }

   // Reset Paid Application
   const resetAppDetails = () => {
      setAppDetails(false);
      setStData(false);
      setLoadingData(false);
      setLoadingError(false);
      setLoadingSuccess(false);
   }

   // Option District List
   useEffect(() => {
      setUserData({ ...userData, 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '' });
      if (instituteList.length > 0 && userData.dst_board) {
         const newOptions = instituteList.map(data => ({
            value: data.en_dist,
            label: data.bn_dist
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionDistricts(uniqueValues);
      } else {
         setOptionDistricts([]);
      }
   }, [instituteList, userData.dst_board]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Upazila List
   useEffect(() => {
      setUserData({ ...userData, 'id_uzps': '', 'id_institute': '', 'en_institute': '' });
      if (instituteList.length > 0) {
         const filteredData = instituteList.filter(
            item => item.en_dist === userData.en_dist
         );
         const newOptions = filteredData.map(data => ({
            value: data.id_uzps,
            label: data.bn_uzps
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setOptionUpazilas(uniqueValues);
      }
   }, [userData.en_dist]); // eslint-disable-line react-hooks/exhaustive-deps

   // Destination Board Change
   useEffect(() => {
      if (userData?.dst_board === '11') {
         setUserData({ ...userData, 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '' });
         setBtcData(false);
      }
      if (userData?.dst_board !== '11') {
         setUserData({ ...userData, 'en_dist': '', 'id_uzps': '', 'id_institute': '', 'en_institute': '' });
         setBtcData(true);
      }
   }, [userData.dst_board]); // eslint-disable-line react-hooks/exhaustive-deps

   // Option Institute List
   useEffect(() => {
      setUserData({ ...userData, 'id_institute': '', 'en_institute': '' });
      if (instituteList.length > 0) {
         const filteredData = instituteList.filter(
            item => item.id_uzps === userData.id_uzps
         );
         const newOptions = filteredData.map(data => ({
            value: data.id_institute,
            label: `${data.en_institute}-[${data.id_institute}]`
         }));
         const uniqueValues = Array.from(
            new Map(newOptions.map(item => [item.value, item])).values()
         );
         setoptionInstitutes(uniqueValues);
      }
   }, [userData.id_uzps]); // eslint-disable-line react-hooks/exhaustive-deps

   if (appDetails) return (
      <Fragment>
         <Row className="m-0 p-0 d-flex justify-content-center align-items-center w-100 bg-white">
            <Col md="12">
               <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                  <Card.Header className="d-flex flex-column justify-content-center mb-1">
                     {!ceb_session && <Link to="/tc/new-app" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     <h4 className="text-center pb-2"><span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                  </Card.Header>
                  <Card.Body>
                     <Row>
                        <Col md={6}>
                           <Card className="d-flex justify-content-center m-0 p-0 auth-card">
                              <Card.Body className='table-responsive'>
                                 <Table className='table table-bordered table-hover'>
                                    <tbody>
                                       <tr>
                                          <td colSpan={3} className='p-2 rounded-1 bg-dark text-center text-white'><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর তথ্য</span></td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_reg}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রোল নম্বর</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_roll}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_name}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>পিতার নাম</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_father}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>মাতার নাম</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_mother}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>জন্ম তারিখ</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'> {stData.st_dob} </td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠান</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.src_institute} - [{stData.src_eiin}]</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠান</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.dst_institute} - [{stData.dst_eiin}]</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}>পঠিত বিষয়</span></td>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          {stData.id_religion === '01' && <td className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '02' && <td className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '03' && <td className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '04' && <td className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                       </tr>
                                    </tbody>
                                 </Table>
                              </Card.Body>
                           </Card>
                        </Col>
                        <Col md={6}>
                           <Card className="d-flex justify-content-center m-0 p-0 auth-card">
                              <Card.Body className='table-responsive'>
                                 <Table className='table table-bordered table-hover'>
                                    <tbody>
                                       <tr>
                                          <th scope='col' colSpan={3} className='p-2 rounded-1 text-center bg-secondary text-white'> <span className={styles.SiyamRupaliFont}>আবেদনের তথ্য</span></th>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>আবেদন নম্বর</span></th>
                                          <td style={{ width: "24px" }} className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'><span className={styles.SiyamRupaliFont}>{stData.id_invoice}</span></td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>আবেদনপত্র</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='d-flex text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             <Button onClick={printApplication} type='button' variant="btn btn-outline-primary" className={styles.SiyamRupaliFont + " flex-fill p-2 m-0"}>আবেদনপত্র প্রিন্ট</Button>
                                          </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠানের অনুমোদন</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             {srcEiinAuth && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>{srcEiinAuth}</div>}
                                             {srcEiinCancel && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-danger"}>{srcEiinCancel}</div>}
                                             {srcEiinPending && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-warning"}>{srcEiinPending}</div>}
                                          </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠানের অনুমোদন</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             {stData.src_board !== stData.dst_board && <>
                                                <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>বোর্ড ট্রান্সফার</div>
                                             </>}
                                             {stData.src_board === stData.dst_board && <>
                                                {dstEiinAuth && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>{dstEiinAuth}</div>}
                                                {dstEiinCancel && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-danger"}>{dstEiinCancel}</div>}
                                                {dstEiinPending && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-warning"}>{dstEiinPending}</div>
                                                }
                                             </>}
                                          </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান বোর্ডের অনুমোদন</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             {srcBoardAuth && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>{srcBoardAuth}</div>}
                                             {srcBoardCancel && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-danger"}>{srcBoardCancel}</div>}
                                             {srcBoardPending && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-warning"}>{srcBoardPending}</div>}
                                          </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য বোর্ডের অনুমোদন</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             {stData.src_board !== stData.dst_board && <>
                                                <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>বোর্ড ট্রান্সফার</div>
                                             </>}
                                             {stData.src_board === stData.dst_board && <>
                                                {dstBoardAuth && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-success"}>{dstBoardAuth}</div>}
                                                {dstBoardCancel && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-danger"}>{dstBoardCancel}</div>}
                                                {dstBoardPending && <div className={styles.SiyamRupaliFont + " w-100 py-2 rounded-1 text-warning"}>{dstBoardPending}</div>}
                                             </>}
                                          </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>{tcOrder ? "টিসি আদেশ" : "সর্বশেষ অবস্থা"}</span></th>
                                          <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SiyamRupaliFont}>:</span></td>
                                          <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                             <div className='d-flex justify-content-center align-items-center gap-1'>
                                                {!tcOrder && <Button className={styles.SiyamRupaliFont + ' flex-fill p-2 m-0'} type='button' variant="btn btn-outline-secondary" onClick={tcStatus}>আবেদনের অবস্থা</Button>}
                                                {tcOrder && <Button className={styles.SiyamRupaliFont + ' flex-fill p-2 m-0'} type='button' variant="btn btn-outline-success" onClick={tcOrderPrint}>টিসি আদেশ প্রিন্ট</Button>}
                                             </div>
                                          </td>
                                       </tr>
                                       <tr>
                                          <th colSpan={3} className=' text-wrap text-center align-top p-1 m-0'>
                                             <Button onClick={resetAppDetails} className='w-100' type="reset" variant="btn btn-outline-danger">ফিরে যান</Button>
                                          </th>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );

   if (tcRequest) return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={10} className='mb-5'>
               <Row>
                  <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                     <Card.Header className="d-flex flex-column justify-content-center mb-1">
                        {!ceb_session && <Link to="/tc/new-app" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                           <Logo color={true} />
                           <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                        </Link>}
                        {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                           <Logo color={true} />
                           <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                        </Link>}
                        <h4 className="text-center pb-2"><span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                     </Card.Header>
                     <Card.Body>
                        <h6 style={{ textAlign: 'justify' }} className={styles.SiyamRupaliFont + " py-2"}><span>চুড়ান্ত সাবমিটের পূর্বে শিক্ষার্থীর সকল তথ্য সঠিক আছে কিনা যাচাই করুন। সকল তথ্য সঠিক থাকলে <strong>পেমেন্ট</strong> বাটনে ক্লিক করে বোর্ড নির্ধারিত আবেদন ফি প্রদান করুন। আবেদন ফি জমাদান সম্পন্ন হলে আপনার <span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span> বোর্ড নীতিমালা অনুযায়ী সম্পাদন করা হবে। </span></h6>
                        <Table className='table table-bordered'>
                           <thead>
                              <tr>
                                 <th scope='col' colSpan={6} className='text-center text-primary fs-6 p-1 m-0'><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর তথ্য</span></th>
                              </tr>
                           </thead>
                           <tbody>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>শ্রেণী</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td className='text-wrap text-center p-1 m-0'><strong><span className={styles.SiyamRupaliFont + " text-uppercase"}>{stData.bn_class} ({stData.rm_class})</span></strong></td>
                                 <td className='text-wrap text-end p-1 m-0'><span className={styles.SiyamRupaliFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td className='text-wrap text-center p-1 m-0'><strong>{InputValidation.E2BDigit(stData.st_reg)}</strong></td>
                              </tr>
                              <tr>
                                 <td colSpan={6} className='text-wrap p-2 m-0'></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_name}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পিতার নাম</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_father}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>মাতার নাম</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_mother}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>জন্ম তারিখ</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap p-1 m-0'>{InputValidation.E2BDigit(stData.st_dob)}</td>
                              </tr>
                              <tr>
                                 <td colSpan={6} className='text-center text-info fs-6 text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠানের তথ্য</span></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>বোর্ড</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>{stData.src_bname}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>প্রতিষ্ঠানের নাম</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>{stData.src_institute} ({stData.src_eiin})</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পঠিত বিষয়</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 {stData.id_religion === '01' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                 {stData.id_religion === '02' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                 {stData.id_religion === '03' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                 {stData.id_religion === '04' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                              </tr>
                              <tr>
                                 <td colSpan={6} className='text-center text-primary fs-6 text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠানের তথ্য</span></td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>বোর্ড</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 {userData.dst_board === '11' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Cumilla Board</td>}
                                 {userData.dst_board === '10' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Dhaka Board</td>}
                                 {userData.dst_board === '12' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Rajshahi Board</td>}
                                 {userData.dst_board === '13' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Jessore Board</td>}
                                 {userData.dst_board === '14' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Chattagram Board</td>}
                                 {userData.dst_board === '15' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Sylhet Board</td>}
                                 {userData.dst_board === '16' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Dinajpur Board</td>}
                                 {userData.dst_board === '17' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Mymenshingh Board</td>}
                                 {userData.dst_board === '18' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Madrasha Board</td>}
                                 {userData.dst_board === '19' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Technical Board</td>}
                                 {userData.dst_board === '20' && <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>Open University</td>}
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>প্রতিষ্ঠানের নাম</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-uppercase text-wrap p-1 m-0'>{btcData ? `${userData.en_institute}(${userData.id_institute})` : userData.en_institute}</td>
                              </tr>
                              <tr>
                                 <td className='text-wrap p-1 m-0'><span className={styles.SiyamRupaliFont}>পঠিতব্য বিষয়</span></td>
                                 <td className='text-wrap p-1 m-0'>:</td>
                                 <td colSpan={4} className='text-wrap text-danger p-1 m-0'><span className={styles.SiyamRupaliFont}>গন্তব্য প্রতিষ্ঠানের বিষয় সম্পর্কে নিশ্চিত হয়ে পেমেন্ট করুন।</span></td>
                              </tr>
                           </tbody>
                        </Table>
                        <Form noValidate validated={validated} onSubmit={submitPayment} onReset={resetPayment}>
                           <Row>
                              <Col md={12} className='my-2'>
                                 {loadingData && <h6 className="text-center text-primary">{loadingData}</h6>}
                                 {loadingError && <h6 className="text-center text-danger">{loadingError}</h6>}
                                 {loadingSuccess && <h6 className="text-center text-success">{loadingSuccess}</h6>}
                              </Col>
                              <Col md={6}>
                                 <Form.Label htmlFor="st_mobile" className="text-primary">মোবাইল নম্বর</Form.Label>
                                 <Form.Control
                                    type="text"
                                    id="st_mobile"
                                    className='text-dark'
                                    value={userData.st_mobile}
                                    maxLength="11"
                                    onChange={(e) => handleDataChange('st_mobile', e.target.value)}
                                    isInvalid={!validated && !!userDataError.st_mobile}
                                    isValid={validated && userData.st_mobile && !userDataError.st_mobile}
                                 />
                                 {!validated && userDataError.st_mobile && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.st_mobile}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                              <Col md={6}>
                                 <Form.Label htmlFor="st_email" className="text-primary">ইমেইল</Form.Label>
                                 <Form.Control
                                    type="text"
                                    id="st_email"
                                    className='text-dark'
                                    value={userData.st_email}
                                    onChange={(e) => handleDataChange('st_email', e.target.value)}
                                    isInvalid={!validated && !!userDataError.st_email}
                                    isValid={validated && userData.st_email && !userDataError.st_email}
                                 />
                                 {!validated && userDataError.st_email && (
                                    <Form.Control.Feedback type="invalid">
                                       {userDataError.st_email}
                                    </Form.Control.Feedback>
                                 )}
                              </Col>
                           </Row>
                           <div className="d-flex justify-content-center mt-4 pt-4 gap-3">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                              <Button onClick={() => setTcRequest(false)} className='flex-fill' type="button" variant="btn btn-outline-warning">ফিরে যান</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-success">পেমেন্ট</Button>
                           </div>
                        </Form>
                     </Card.Body>
                  </Card>
               </Row>
            </Col>
         </Row>
      </Fragment>
   );

   if (stData) return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
            <Col md={12}>
               <Card className="card-transparent shadow-none d-flex justify-content-center m-0 auth-card">
                  <Card.Header className="d-flex flex-column justify-content-center m-0 p-0 pt-4">
                     {!ceb_session && <Link to="/tc/new-app" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     <h4 className="text-center pb-2"><span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                  </Card.Header>
                  <Card.Body className="p-0 m-0">
                     <Row>
                        <Col md={6}>
                           <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                              <Card.Body className='table-responsive'>
                                 <Table className='table table-bordered'>
                                    <tbody>
                                       <tr>
                                          <th scope='row' colSpan={2} className='m-0 p-1 fs-6 rounded-1 text-wrap text-center bg-secondary text-white'><span className={styles.SiyamRupaliFont}>শিক্ষার্থীর তথ্য</span></th>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_reg}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>রোল নং</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_roll}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_name}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>পিতার নাম</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_father}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>মাতার নাম</span></td>
                                          <td className='text-wrap p-2 m-0'>{stData.st_mother}</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>জন্ম তারিখ</span></td>
                                          <td className='text-wrap p-2 m-0'> {stData.st_dob} </td>
                                       </tr>
                                       <tr>
                                          <th scope='row' colSpan={2} className='m-0 p-1 fs-6 rounded-1 text-wrap text-white bg-secondary text-center'><span className={styles.SiyamRupaliFont}>বর্তমান প্রতিষ্ঠান</span></th>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'><span className={styles.SiyamRupaliFont}>নাম</span></td>
                                          <td className='text-wrap text-uppercase p-2 m-0'>{stData.src_institute} - [{stData.src_eiin}]</td>
                                       </tr>
                                       <tr>
                                          <td className='p-2 m-0'> <span className={styles.SiyamRupaliFont}>পঠিত বিষয়</span></td>
                                          {stData.id_religion === '01' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '02' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '03' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '04' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SiyamRupaliFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                       </tr>
                                    </tbody>
                                 </Table>
                              </Card.Body>
                           </Card>
                        </Col>
                        <Col md={6}>
                           <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                              <Card.Body className='table-responsive'>
                                 <Form noValidate validated={validated} onSubmit={transferSubmit} onReset={transferReset}>
                                    <Row>
                                       <Col md={12} className='mb-2'>
                                          <h6 className='m-0 mb-2 py-2 rounded-1 text-wrap text-white bg-success text-center'>গন্তব্য প্রতিষ্ঠানের তথ্য</h6>
                                          {loadingData && <h6 className="text-center text-primary">{loadingData}</h6>}
                                          {loadingError && <h6 className="text-center text-danger">{loadingError}</h6>}
                                          {pendingApplication && <h6 className={styles.SiyamRupaliFont + " text-wrap text-uppercase text-secondary"} style={{ textAlign: "justify" }}>{pendingApplication}</h6>}
                                       </Col>
                                       <Col md={12}>
                                          <Form.Label htmlFor="dst_board" className='text-primary'><span className={styles.SiyamRupaliFont}>গন্তব্য বোর্ড</span></Form.Label>
                                          <Form.Select
                                             id="dst_board"
                                             className='text-dark'
                                             value={userData.dst_board}
                                             onChange={(e) => handleDataChange('dst_board', e.target.value)}
                                             isInvalid={!validated && !!userDataError.dst_board}
                                             isValid={validated && userData.dst_board && !userDataError.dst_board}
                                          >
                                             <option disabled value="">-- বোর্ড সিলেক্ট করুন --</option>
                                             <option value="11" className='text-dark'>কুমিল্লা বোর্ড</option>
                                             <option value="10" className='text-dark'>ঢাকা বোর্ড</option>
                                             <option value="12" className='text-dark'>রাজশাহী বোর্ড</option>
                                             <option value="13" className='text-dark'>যশোর বোর্ড</option>
                                             <option value="14" className='text-dark'>চট্টগ্রাম বোর্ড</option>
                                             <option value="15" className='text-dark'>সিলেট বোর্ড</option>
                                             <option value="16" className='text-dark'>দিনাজপুর বোর্ড</option>
                                             <option value="17" className='text-dark'>ময়মনসিংহ বোর্ড</option>
                                             <option value="18" className='text-dark'>মাদ্রাসা বোর্ড</option>
                                             <option value="19" className='text-dark'>কারিগরি বোর্ড</option>
                                             <option value="20" className='text-dark'>উন্মুক্ত বিশ্ববিদ্যালয়</option>
                                          </Form.Select>
                                          {!validated && userDataError.dst_board && (
                                             <Form.Control.Feedback type="invalid">
                                                {userDataError.dst_board}
                                             </Form.Control.Feedback>
                                          )}
                                       </Col>
                                       {!btcData && <>
                                          <Col md={6}>
                                             <Form.Group>
                                                <Form.Label htmlFor="en_dist" className="text-primary">জেলা</Form.Label>
                                                <Select
                                                   inputId="en_dist"
                                                   classNamePrefix={`react-select ${!validated && userDataError.en_dist ? 'is-invalid' : validated && userData.en_dist ? 'is-valid' : ''}`}
                                                   placeholder="-- জেলা সিলেক্ট করুন --"
                                                   value={
                                                      optionDistricts.find(opt => opt.value === userData.en_dist) || null
                                                   }
                                                   onChange={(e) =>
                                                      e ? handleDataChange('en_dist', e.value) : handleDataChange('en_dist', '')
                                                   }
                                                   options={optionDistricts}
                                                   isClearable={true}
                                                   isSearchable={true}
                                                />
                                                {!validated && userDataError.en_dist && (
                                                   <div className="invalid-feedback d-block">
                                                      {userDataError.en_dist}
                                                   </div>
                                                )}
                                             </Form.Group>
                                          </Col>
                                          <Col md={6}>
                                             <Form.Group>
                                                <Form.Label htmlFor="id_uzps" className='text-primary'>উপজেলা</Form.Label>
                                                <Select
                                                   inputId="id_uzps"
                                                   placeholder="-- উপজেলা সিলেক্ট করুন --"
                                                   classNamePrefix={`react-select ${!validated && userDataError.id_uzps ? 'is-invalid' : validated && userData.id_uzps ? 'is-valid' : ''}`}
                                                   value={
                                                      optionUpazilas.find(opt => opt.value === userData.id_uzps) || null
                                                   }
                                                   onChange={(e) =>
                                                      e ? handleDataChange('id_uzps', e.value) : handleDataChange('id_uzps', '')
                                                   }
                                                   options={optionUpazilas}
                                                   isClearable={true}
                                                   isSearchable={true}
                                                />
                                             </Form.Group>
                                             {!validated && userDataError.id_uzps && (
                                                <div className="invalid-feedback d-block">
                                                   {userDataError.id_uzps}
                                                </div>
                                             )}
                                          </Col>
                                          <Col md={12}>
                                             <Form.Group>
                                                <Form.Label htmlFor="id_institute" className='text-primary'>গন্তব্য প্রতিষ্ঠানের নাম</Form.Label>
                                                <Select
                                                   inputId="id_institute"
                                                   placeholder="-- প্রতিষ্ঠান সিলেক্ট করুন --"
                                                   classNamePrefix={`react-select ${!validated && userDataError.id_institute ? 'is-invalid' : validated && userData.id_institute ? 'is-valid' : ''}`}
                                                   value={
                                                      optionInstitutes.find(opt => opt.value === userData.id_institute) || null
                                                   }
                                                   onChange={(instData) => handleInstDataChange(instData)}
                                                   options={optionInstitutes}
                                                   isClearable={true}
                                                   isSearchable={true}
                                                />
                                             </Form.Group>
                                             {!validated && userDataError.id_institute && (
                                                <div className="invalid-feedback d-block">
                                                   {userDataError.id_institute}
                                                </div>
                                             )}
                                          </Col>
                                       </>}
                                       {btcData && <>
                                          <Col md={12}>
                                             <Form.Label htmlFor="en_institute" className='text-primary'>গন্তব্য প্রতিষ্ঠানের নাম</Form.Label>
                                             <Form.Control
                                                type="text"
                                                id="en_institute"
                                                className='text-dark'
                                                value={userData.en_institute}
                                                maxLength="80"
                                                onChange={(e) => handleDataChange('en_institute', e.target.value)}
                                                isInvalid={!validated && !!userDataError.en_institute}
                                                isValid={validated && userData.en_institute && !userDataError.en_institute}
                                             />
                                             {!validated && userDataError.en_institute && (
                                                <Form.Control.Feedback type="invalid">
                                                   {userDataError.en_institute}
                                                </Form.Control.Feedback>
                                             )}
                                          </Col>
                                          <Col md={12}>
                                             <Form.Label htmlFor="id_institute" className='text-primary'>প্রতিষ্ঠানের ইআইআইএন</Form.Label>
                                             <Form.Control
                                                type="text"
                                                id="id_institute"
                                                className='text-dark'
                                                value={userData.id_institute}
                                                maxLength="6"
                                                onChange={(e) => handleDataChange('id_institute', e.target.value)}
                                                isInvalid={!validated && !!userDataError.id_institute}
                                                isValid={validated && userData.id_institute && !userDataError.id_institute}
                                             />
                                             {!validated && userDataError.id_institute && (
                                                <Form.Control.Feedback type="invalid">
                                                   {userDataError.id_institute}
                                                </Form.Control.Feedback>
                                             )}
                                          </Col>
                                       </>}
                                       <Col md={12} className='p-2 m-2'>
                                          <h6 className={styles.SiyamRupaliFont + "px-2 text-danger text-wrap"} style={{ textAlign: "justify" }}>গন্তব্য প্রতিষ্ঠানে পঠিত (Registered) বিষয়সমূহ আছে কিনা নিশ্চিত হয়ে আবেদন করতে হবে। অন্যথায় আবেদন বাতিল বলে গণ্য হবে।</h6>
                                       </Col>
                                    </Row>
                                    <div className="d-flex justify-content-center pb-5 gap-3">
                                       <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                       <Button
                                          onClick={() => {
                                             setLoadingData(false);
                                             setLoadingError(false);
                                             setLoadingSuccess(false);
                                             setStData(false);
                                          }}
                                          className='flex-fill'
                                          type="button"
                                          variant="btn btn-outline-warning"
                                       >
                                          ফিরে যান
                                       </Button>
                                       <Button className='flex-fill' type="submit" variant="btn btn-success">সাবমিট</Button>
                                    </div>
                                 </Form>
                              </Card.Body>
                           </Card>
                        </Col>
                     </Row>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   );

   if (tcData) return (
      <Fragment>
         <Row className="m-0 p-0 d-flex justify-content-center align-items-center w-100 bg-white">
            <Col md="12">
               <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                  <Card.Header className="d-flex flex-column justify-content-center mb-1">
                     {!ceb_session && <Link to="/tc/new-app" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     <h4 className="text-center pb-2"><span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                  </Card.Header>
                  <Card.Body className="d-flex justify-content-center m-0 p-0">
                     <Col md={12}>
                        <Card className="d-flex justify-content-center m-0 p-0 auth-card">
                           <Card.Body className='table-responsive'>
                              <Table className='table table-bordered'>
                                 <thead>
                                    <tr>
                                       <th colSpan={7} className={styles.SiyamRupaliFont + ' rounded-2 text-center bg-dark text-wrap align-top py-2 m-0'}>
                                          <h4 className='text-white'>
                                             আবেদনের তালিকা
                                          </h4>
                                       </th>
                                    </tr>
                                    <tr>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>ক্রমিক</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>নাম</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>রেজিস্ট্রেশন নম্বর</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>আবেদনের তারিখ</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>পেমেন্ট</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>সর্বশেষ অবস্থা</th>
                                       <th className={styles.SiyamRupaliFont + ' text-primary text-center text-wrap align-top py-2 m-0'}>সম্পাদনা</th>
                                    </tr>
                                 </thead>
                                 <tbody>
                                    {tcData.map((data, idx) => (
                                       <tr key={idx}>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>{InputValidation.E2BDigit(idx + 1).padStart(3, "০০০")}</td>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>{data.st_name}</td>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>{data.st_reg}</td>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>{data.entry_date}</td>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>
                                             {data.id_payment === "03" && "পেইড"}
                                             {data.id_payment !== "03" && "আনপেইড"}
                                          </td>
                                          <td className={styles.SiyamRupaliFont + ' text-dark text-center text-wrap align-top py-2 m-0'}>
                                             {(data.src_eiin_auth === '18' || data.dst_eiin_auth === '18' || data.src_board_auth === '18' || data.dst_board_auth === '18') && <span className='text-danger'>বাতিলকৃত</span>}

                                             {(data.src_eiin_auth === '17' && data.src_board_auth === '17') && ((data.dst_eiin_auth === '17' && data.dst_board_auth === '17' && data.src_board === data.dst_board) || data.src_board !== data.dst_board) && <span className='text-success'>অনুমোদিত</span>}

                                             {(!(data.src_eiin_auth === '18' || data.dst_eiin_auth === '18' || data.src_board_auth === '18' || data.dst_board_auth === '18') && !(data.src_eiin_auth === '17' && data.src_board_auth === '17') && ((data.dst_eiin_auth === '17' && data.dst_board_auth === '17' && data.src_board === data.dst_board) || data.src_board !== data.dst_board)) && <span className='text-primary'>অপেক্ষমান</span>}
                                          </td>
                                          <td className={styles.SiyamRupaliFont + ' d-flex gap-2 text-dark text-center text-wrap align-top py-2 m-0'}>
                                             {data.id_payment === "03" &&
                                                <Button
                                                   className='flex-fill'
                                                   variant="btn btn-outline-success"
                                                   onClick={() => {
                                                      setStData(data);
                                                      setAppDetails(true);
                                                   }}>
                                                   আবেদনের বিস্তারিত
                                                </Button>
                                             }
                                             {tcData.length === idx + 1 && !isPrevTc && dateData.dt_end >= curDateTime.toISOString().split('T')[0] && (
                                                <Button
                                                   className='flex-fill'
                                                   variant="btn btn-outline-primary"
                                                   onClick={async () => {
                                                      if (data.id_payment === "03") {
                                                         setPendingResume(false);
                                                      } else {
                                                         if (data.dst_board === '11') {
                                                            await setUserData({ ...userData, 'dst_board': data.dst_board, 'id_institute': data.dst_eiin, 'en_institute': data.dst_institute });
                                                            await setPendingApplication(`${data.dst_institute}(${data.dst_eiin}) প্রতিষ্ঠানের জন্য আনপেইড আবেদন পাওয়া গেছে। প্রতিষ্ঠান পরিবর্তন করতে চাইলে আবার প্রতিষ্ঠান সিলেক্ট করুন অথবা প্রতিষ্ঠান একই হলে সরাসরি সাবমিট বাটনে ক্লিক করুন।`);
                                                         } else {
                                                            await setUserData({ ...userData, 'dst_board': data.dst_board, 'id_institute': data.dst_eiin, 'en_institute': data.btc_institute });
                                                            await setPendingApplication(`${data.btc_institute}(${data.dst_eiin}) প্রতিষ্ঠানের জন্য আনপেইড আবেদন পাওয়া গেছে। প্রতিষ্ঠান পরিবর্তন করতে চাইলে আবার প্রতিষ্ঠান সিলেক্ট করুন অথবা প্রতিষ্ঠান একই হলে সরাসরি সাবমিট বাটনে ক্লিক করুন।`);
                                                         }
                                                         setPendingResume(true);
                                                      }
                                                      setStData(data);
                                                   }}
                                                >
                                                   {data.id_payment !== '03' ? "পেমেন্ট করুন" : "পুনঃ আবেদন"}
                                                </Button>
                                             )}
                                          </td>
                                       </tr>
                                    ))}
                                 </tbody>
                                 <tfoot>
                                    <tr>
                                       <th colSpan={7} className={styles.SiyamRupaliFont + ' text-wrap text-center align-top py-2 m-0'}>
                                          <Button onClick={() => setTcData(false)} className='flex-fill w-100' type="reset" variant="btn btn-outline-warning">ফিরে যান</Button>
                                       </th>
                                    </tr>
                                 </tfoot>
                              </Table>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )

   return (
      <Fragment>
         <Row className="m-0 d-flex justify-content-center align-items-center bg-white vh-100">
            <Col md="8">
               <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                  <Card.Header className="d-flex flex-column justify-content-center mb-5">
                     {!ceb_session && <Link to="/tc/new-app" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                        <Logo color={true} />
                        <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                     </Link>}
                     <h4 className="text-center my-4"><span className={styles.SiyamRupaliFont + " text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                     {loadingData && <h6 className="text-center text-primary">{loadingData}</h6>}
                     {loadingError && <h6 className="text-center text-danger">{loadingError}</h6>}
                     {loadingSuccess && <h6 className="text-center text-success">{loadingSuccess}</h6>}
                  </Card.Header>
                  <Card.Body>
                     <Form noValidate validated={validated} onSubmit={searchSubmit} onReset={searchReset}>
                        <Row>
                           <Col md={6}>
                              <Form.Label htmlFor="st_class" className='text-primary'>শ্রেণী</Form.Label>
                              <Form.Select
                                 id="st_class"
                                 className='text-dark'
                                 value={userData.st_class}
                                 onChange={(e) => handleDataChange('st_class', e.target.value)}
                                 isInvalid={!validated && !!userDataError.st_class}
                                 isValid={validated && userData.st_class && !userDataError.st_class}
                              >
                                 <option value="">শ্রেণী সিলেক্ট করুন</option>
                                 <option value="06">ষষ্ট শ্রেণী</option>
                                 <option value="07">সপ্তম শ্রেণী</option>
                                 <option value="08">অষ্টম শ্রেণী</option>
                                 <option value="09">নবম শ্রেণী</option>
                                 <option value="10">দশম শ্রেণী</option>
                                 <option value="11">একাদশ শ্রেণী</option>
                                 <option value={12}>দ্বাদশ শ্রেণী</option>
                              </Form.Select>
                              {!validated && userDataError.st_class && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.st_class}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={6}>
                              <Form.Label htmlFor="st_reg" className='text-primary'>রেজিস্ট্রেশন নম্বর</Form.Label>
                              <Form.Control
                                 type="text"
                                 id="st_reg"
                                 className='text-dark'
                                 value={userData.st_reg}
                                 maxLength="10"
                                 onChange={(e) => handleDataChange('st_reg', e.target.value)}
                                 isInvalid={!validated && !!userDataError.st_reg}
                                 isValid={validated && userData.st_reg && !userDataError.st_reg}
                              />
                              {!validated && userDataError.st_reg && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.st_reg}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={6}>
                              <Form.Label htmlFor="st_dob" className='text-primary'>জন্ম তারিখ</Form.Label>
                              <Form.Control
                                 type="date"
                                 id="st_dob"
                                 className='text-dark'
                                 value={userData.st_dob}
                                 onChange={(e) => handleDataChange('st_dob', e.target.value)}
                                 isInvalid={!validated && !!userDataError.st_dob}
                                 isValid={validated && userData.st_dob && !userDataError.st_dob}
                              />
                              {!validated && userDataError.st_dob && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.st_dob}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={6}>
                              <Form.Label htmlFor="st_session" className='text-primary'>সেশন</Form.Label>
                              <Form.Control
                                 type="text"
                                 id="st_session"
                                 className='text-dark'
                                 maxLength={4}
                                 value={userData.st_session}
                                 onChange={(e) => handleDataChange('st_session', e.target.value)}
                                 isInvalid={!validated && !!userDataError.st_session}
                                 isValid={validated && userData.st_session && !userDataError.st_session}
                              />
                              {!validated && userDataError.st_session && (
                                 <Form.Control.Feedback type="invalid">
                                    {userDataError.st_session}
                                 </Form.Control.Feedback>
                              )}
                           </Col>
                           <Col md={12} className='d-flex py-5 gap-5'>
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                           </Col>
                        </Row>
                     </Form>
                  </Card.Body>
               </Card>
            </Col>
         </Row>
      </Fragment>
   )
}

export default TcApplication
