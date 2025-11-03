import React, { useEffect, useState } from 'react'
import { Row, Col, Form, Button, Table } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

import axios from "axios";

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors'

import styles from '../../../assets/custom/css/bisec.module.css'

const RegistrationCancell = () => {
   // enable axios credentials include
   axios.defaults.withCredentials = true;

   const URL = import.meta.env.VITE_BACKEND_URL;

   const appName = useSelector(SettingSelector.app_name);
   // const navigate = useNavigate();
   var st_sl = 1;

   //Form Validation and Error
   const [validated, setValidated] = useState(false);
   const [error, setError] = useState(null);

   //Student Search Form Data
   const [stClass, setStClass] = useState("");
   const [stReg, setStreg] = useState("");
   const [stDob, setStDob] = useState("");
   const [stSession, setStSession] = useState("");

   //Student Data Fetch Status
   const [stSuccess, setStSuccess] = useState(false);
   const [stLoading, setStLoading] = useState(false);
   const [stError, setStError] = useState(false);

   //Student Fetched Data
   const [stData, setStData] = useState(false);

   //Unpaid Application Set
   const [pendingApplication, setPendingApplication] = useState(false);
   const [pendingResume, setPendingResume] = useState(false);

   //Paid Application Set
   const [paidApplication, setPaidApplication] = useState(false);

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

   //Fetched Data for Board, District, Upazila, Institute 
   // const [srcBoard, setSrcBoard] = useState([]);
   // const [dstBoard, setDstBoard] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [upazilas, setUpazilas] = useState([]);
   const [institutes, setInstitutes] = useState([]);

   //Status for District, Upazila, Institute Fetch
   const [loadingDistricts, setLoadingDistricts] = useState(true);
   const [loadingUpazilas, setLoadingUpazilas] = useState(false);
   const [loadingInstitutes, setLoadingInstitutes] = useState(false);

   //Selected Board, District, Upazila, Institute Data
   // const [selectedSrcBoard, setSelectedSrcBoard] = useState("");
   const [selectedDstBoard, setSelectedDstBoard] = useState("");
   const [selectedDstBoardName, setSelectedDstBoardName] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");
   const [selectedUpazila, setSelectedUpazila] = useState("");
   const [selectedInstitute, setSelectedInstitute] = useState("");
   const [selectedInstituteName, setSelectedInstituteName] = useState("");

   //Set Transfer Request
   const [tcRequest, setTcRequest] = useState(false);

   //Pyament Data
   const [payName, setPayName] = useState("");
   const [payMobile, setPayMobile] = useState("");
   const [payEmail, setPayEmail] = useState("");

   //Pending Application
   const pendingPayment = ((st_data) => {
      // console.log("Payment Pending!", st_data.data);
      setPendingApplication(`পূর্বের আনপেইড আবেদন পাওয়া গেছে। গন্তব্য প্রতিষ্ঠান [${st_data.data.dst_institute} (${st_data.data.dst_eiin})] ঠিক থাকলে সাবমিট অ্যাপ্লিকেশন বাটনে প্রেস করুন অথবা নতুন করে সিলেক্ট করুন।`);
      setPendingResume(true);
      setSelectedDstBoard(st_data.data.dst_board);
      setSelectedDstBoardName(st_data.data.dst_bname);
      setSelectedInstitute(st_data.data.dst_eiin);
      setSelectedInstituteName(st_data.data.dst_institute + " (" + st_data.data.dst_eiin + ")");
      setStData(st_data.data);
   });

   //Previous Application
   const prevApplication = ((st_data) => {
      // console.log("Previous Application Found!", st_data.data);
      setStData(st_data.data);
      setPaidApplication(true);
   });

   //Application Status Set
   const appStatus = (() => {
      switch (stData.src_eiin_auth) {
         case '23':
            setSrcEiinPending("অপেক্ষমান");
            setSrcEiinCancel(false);
            setSrcEiinAuth(false);
            break;
         case '22':
            setSrcEiinPending(false);
            setSrcEiinCancel(false);
            setSrcEiinAuth("অনুমোদিত");
            break;
         case '25':
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
         case '23':
            setDstEiinPending("অপেক্ষমান");
            setDstEiinCancel(false);
            setDstEiinAuth(false);
            break;
         case '22':
            setDstEiinPending(false);
            setDstEiinCancel(false);
            setDstEiinAuth("অনুমোদিত");
            break;
         case '25':
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
         case '23':
            setSrcBoardPending("অপেক্ষমান");
            setSrcBoardCancel(false);
            setSrcBoardAuth(false);
            break;
         case '22':
            setSrcBoardPending(false);
            setSrcBoardCancel(false);
            setSrcBoardAuth("অনুমোদিত");
            break;
         case '25':
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
         case '23':
            setDstBoardPending("অপেক্ষমান");
            setDstBoardCancel(false);
            setDstBoardAuth(false);
            break;
         case '22':
            setDstBoardPending(false);
            setDstBoardCancel(false);
            setDstBoardAuth("অনুমোদিত");
            break;
         case '25':
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

      if (stData.src_board_auth === '22' && stData.dst_board_auth === '22') {
         setTcOrder(true);
      } else {
         setTcOrder(false);
      }
   });

   useEffect(() => {
      if (paidApplication) {
         appStatus();
      }
   }, [paidApplication]);// eslint-disable-line react-hooks/exhaustive-deps

   //Print Application
   const printApplication = (() => {
      window.open(`/tc/tc-pay-response?invoiceNo=${stData.id_invoice}`, '_blank');
      // navigate(`/tc/tc-pay-response?invoiceNo=${stData.id_invoice}`);
   });

   //Print TC Order
   const tcOrderPrint = (() => {
      window.open(`/tc/tc-order?invoiceNo=${stData.id_invoice}`, '_blank');
      // navigate(`/tc/tc-order?invoiceNo=${stData.id_invoice}`);
   });

   // TC Cancel
   const tcStatus = (() => {
      if (stData.src_eiin_auth === '23' && stData.dst_eiin_auth === '23') {
         alert("প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_eiin_auth === '23') {
         alert("বর্তমান প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.dst_eiin_auth === '23') {
         alert("গন্তব্য প্রতিষ্ঠানে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_board_auth === '23' && stData.dst_board_auth === '23') {
         alert("বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_board_auth === '23') {
         alert("বর্তমান বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.dst_board_auth === '23') {
         alert("গন্তব্য বোর্ডে আবেদনটি অপেক্ষমান অবস্থায় আছে");
      } else if (stData.src_eiin_auth === '25' && stData.dst_eiin_auth === '25') {
         alert("প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_eiin_auth === '25') {
         alert("বর্তমান প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.dst_eiin_auth === '25') {
         alert("গন্তব্য প্রতিষ্ঠানে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_board_auth === '25' && stData.dst_board_auth === '25') {
         alert("বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.src_board_auth === '25') {
         alert("বর্তমান বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else if (stData.dst_board_auth === '25') {
         alert("গন্তব্য বোর্ডে আবেদনটি বাতিল করা হয়েছে");
      } else {
         alert("আবেদন প্রসেস হয়নি");
      }
   });

   //Student Data Fetch 
   const fetchStudentData = async () => {
      setStLoading("Loading Data...");
      try {
         const st_data = await axios.post(`${URL}/tc-student-data?`, { stClass, stReg, stDob, stSession });
         if (st_data?.data?.id_invoice) {
            if (st_data.data.id_payment !== "03") {
               pendingPayment(st_data);
            } else if (st_data.data.id_payment === "03") {
               prevApplication(st_data);
            } else {
               setStData(st_data.data);
            }
         } else {
            setStData(st_data.data);
         }
      } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setValidated(false);
         setStError("Please Provide Valid Data");
         // console.log(err);
      } finally {
         setStLoading(false);
      }
   }

   //Reset form
   const formReset = () => {
      setValidated(false);
      setStClass("");
      setStreg("");
      setStDob("");
      setStSession("");
      setSelectedDstBoard("");
      setSelectedDstBoardName("");
      setSelectedDistrict("");
      setSelectedUpazila("");
      setSelectedInstitute("");
      setSelectedInstituteName("");

      setPayName("");
      setPayMobile("");
      setPayEmail("");

      setPendingApplication(false);
      setPendingResume(false);
      setPaidApplication(false);
      setTcRequest(false);
      setStSuccess(false);
      setStLoading(false);
      setStError(false);
      setStData(false);
      setDistricts([]);
      setUpazilas([]);
      setInstitutes([]);
   };

   //Submit Student Form Data
   const searchSubmit = (event) => {
      const form = event.currentTarget;

      setStSuccess(false);
      setStError(false);
      setStData(false);

      if (form.checkValidity() === false) {
         setValidated(false);
      } else {
         fetchStudentData();
      }

      event.preventDefault();
      event.stopPropagation();

      setValidated(true);
   };

   //Handle Board Change
   const handleBoardChange = (e) => {
      const board = e.target.value;
      setSelectedDstBoard(board);
      switch (board) {
         case '10':
            setSelectedDstBoardName("Dhaka Board");
            break;
         case '11':
            setSelectedDstBoardName("Cumilla Board");
            break;
         case '12':
            setSelectedDstBoardName("Rajshahi Board");
            break;
         case '13':
            setSelectedDstBoardName("Jessore Board");
            break;
         case '14':
            setSelectedDstBoardName("Chattagram Board");
            break;
         case '15':
            setSelectedDstBoardName("Sylhet Board");
            break;
         case '16':
            setSelectedDstBoardName("Dinajpur Board");
            break;
         case '17':
            setSelectedDstBoardName("Mymenshingh Board");
            break;
         case '18':
            setSelectedDstBoardName("Madrasha Board");
            break;
         case '19':
            setSelectedDstBoardName("Technical Board");
            break;
         case '20':
            setSelectedDstBoardName("Open University");
            break;
         default:
            setSelectedDstBoardName("Default Board");
            break;
      }
      setPendingApplication(false);
      setSelectedDistrict("");
      setSelectedUpazila("");
      setSelectedInstitute("");
      setSelectedInstituteName("");
      setUpazilas([]);
      setInstitutes([]);
   };

   //Fetch District List
   useEffect(() => {
      const fetchDistrict = async () => {
         if (stData) {
            setLoadingDistricts("Loading Districts...");
            try {
               const response = await axios.get(`${URL}/district-list`);
               setDistricts(response.data);
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setError("Failed to load upazilas");
               // console.error(err);
            } finally {
               setLoadingDistricts(false);
            }
            setSelectedDstBoard("11");
            setSelectedDstBoardName("Cumilla Board");
         }
      }
      fetchDistrict();
   }, [stData]); // eslint-disable-line react-hooks/exhaustive-deps

   //Handle District Change
   const handleDistrictChange = (e) => {
      const district = e.target.value;
      setSelectedDistrict(district);
      setPendingApplication(false);
      setSelectedUpazila("");
      setSelectedInstitute("");
      setSelectedInstituteName("");
      setUpazilas([]);
      setInstitutes([]);
   };

   //Fetch Upazila List
   useEffect(() => {
      const fetchUpazila = async () => {
         if (selectedDistrict) {
            setLoadingUpazilas(true);
            try {
               const response = await axios.post(`${URL}/district-list/upzila?`, { selectedDistrict });
               setUpazilas(response.data);
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error("Error fetching upazilas:", err);
               setError("Failed to load upazilas");
            } finally {
               setLoadingUpazilas(false);
            }
         }
      };
      fetchUpazila();
   }, [selectedDistrict]);// eslint-disable-line react-hooks/exhaustive-deps

   //Handle Upazila Change
   const handleUpazilaChange = (e) => {
      const upazila = e.target.value;
      setSelectedUpazila(upazila);
      setPendingApplication(false);
      setSelectedInstitute("");
      setSelectedInstituteName("");
      setInstitutes([]);
   };

   //Fetch Institute
   useEffect(() => {
      const fetchInstitute = async () => {
         if (selectedUpazila) {
            setLoadingInstitutes(true);
            try {
               const response = await axios.post(`${URL}/upzila-list/institute?`, { selectedUpazila });
               setInstitutes(response.data);
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error("Error fetching institutes:", err);
               setError("Failed to load institutes");
            } finally {
               setLoadingInstitutes(false);
            }
         }
      };
      fetchInstitute();
   }, [selectedUpazila]);// eslint-disable-line react-hooks/exhaustive-deps

   //Handel Institute Change
   const handleInstituteChange = (e) => {
      const institute = e.target.value;
      const instituteName = institute.substr(7);
      setSelectedInstitute(institute);
      setSelectedInstituteName(instituteName);
      setPendingApplication(false);
   }

   //Submit Transfer Request Form Data
   const transferSubmit = (event) => {
      const form = event.currentTarget;
      setStSuccess(false);
      setStError(false);

      if (!selectedInstitute || !selectedDstBoard) {
         setValidated(false);
         alert("Select Destination Board & Destination Institution!");
         event.preventDefault();
         event.stopPropagation();
      } else if (form.checkValidity() === false) {
         setValidated(false);
         event.preventDefault();
         event.stopPropagation();
      } else {
         setTcRequest(true);
         setPayName(stData.st_name);
         event.preventDefault();
      }
      setValidated(true);
   };

   //Submit Payment Initiation Data
   const submitPayment = (e) => {
      e.preventDefault();
      const pendingData = [stData.id_invoice, stData.st_reg, selectedDstBoard, selectedInstitute.split("-")[0],];

      const studentData = [
         stData.st_reg, stData.st_roll, stClass, stSession, stData.id_board, stData.src_eiin, selectedDstBoard, selectedInstitute.split("-")[0],
      ];
      const payData = [
         payName, payMobile, payEmail,
      ];
      const payInitiate = async () => {
         setStLoading("Initiating Payment...");
         setStError(false);
         setStSuccess(false);
         try {
            const response = await axios.post(`${URL}/tc-initiate?`, { studentData, payData });
            setStSuccess("Payment Initiated, Redirecting to Payment Gateway!");
            if (response.data.Status === "200" && response.data.final_status === 200) {
               window.location.href = response.data.RedirectToGateway;
            } else {
               setValidated(false);
               setStError("Payment Initiation Failed!");
               // console.clear();
               // console.log(response.data);
            }
         } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setValidated(false);
            setStError("Payment Initiation Failed!");
            // console.log(err);
         } finally {
            setStLoading(false);
         }
      }
      const payResume = async () => {
         setStLoading("Initiating Pending Payment...");
         setStError(false);
         setStSuccess(false);
         try {
            const response = await axios.post(`${URL}/tc-pending-pay?`, { pendingData, payData });
            setStSuccess("Payment Initiated, Redirecting to Payment Gateway!");
            if (response.data.Status === "200" && response.data.final_status === 200) {
               window.location.href = response.data.RedirectToGateway;
            } else {
               setValidated(false);
               setStError("Payment Initiation Failed!");
               // console.clear();
               // console.log(response.data);
            }
         } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setValidated(false);
            setStError("Payment Initiation Failed!");
            // console.log(err);
         } finally {
            setStLoading(false);
         }
      }
      if (!pendingResume) {
         payInitiate();
      }
      if (pendingResume) {
         payResume();
      }
   };

   //Console Log Error Data
   useEffect(() => {
      if (error) {
         // console.log(error);
      }
   }, [error]);// eslint-disable-line react-hooks/exhaustive-deps

   if (paidApplication) return (
      <>
         <div className='bg-white login-content d-flex flex-column justify-content-around align-content-center vh-100 vw-95'>
            <Row className="m-0 p-0 d-flex justify-content-center align-items-center w-100 bg-white">
               <Col md="12">
                  <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                     <Card.Header className="d-flex flex-column justify-content-center mb-1">
                        <Link to="/tc/new" onClick={formReset} className="navbar-brand d-flex justify-content-center align-items-center">
                           <Logo color={true} />
                        </Link>
                        <h1 className="logo-title text-primary text-wrap text-center">{appName}</h1>
                     </Card.Header>
                     <Card.Body>
                        <h4 className="text-center">Summery of Transfer Certificate (TC)</h4>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            <Row className="m-0 p-0 d-flex justify-content-center align-items-start w-100 bg-white">
               <Col md="5">
                  <Card className="d-flex justify-content-center m-0 p-0 auth-card">
                     <Card.Body>
                        <h6 className="p-2 rounded-1 bg-dark text-center text-white"><span className={styles.SolaimanLipiFont}>শিক্ষার্থীর তথ্য</span></h6>
                        <div className='table-responsive'>
                           <Table className='table table-bordered table-hover'>
                              <tbody>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_reg}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>রোল নম্বর</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_roll}</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>নাম</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'>{stData.st_name}</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>পিতার নাম</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'>{stData.st_father}</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>মাতার নাম</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'>{stData.st_mother}</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>জন্ম তারিখ</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'> {stData.st_dob} </td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>বর্তমান প্রতিষ্ঠান</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'>{stData.src_institute} - [{stData.src_eiin}]</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠান</span></td>
                                    <td colSpan={3} className='text-wrap p-2 m-0'>{stData.dst_institute} - [{stData.dst_eiin}]</td>
                                 </tr>
                                 <tr>
                                    <td className='p-2 m-0'> <span className={styles.SolaimanLipiFont}>পঠিত বিষয়</span></td>
                                    {stData.id_religion === '01' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '02' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '03' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '04' && <td colSpan={3} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                 </tr>
                              </tbody>
                              <tfoot>
                                 <tr>
                                    <th scope='col' colSpan={4} className='p-2 m-0 rounded-1 text-wrap text-center text-success'> <span className={styles.SolaimanLipiFont}>সফলভাবে আবেদন করার পর প্রয়োজনে বর্তমান ও গন্তব্য প্রতিষ্ঠানে যোগাযোগ করা যেতে পারে। বোর্ড অনুমোদন (নির্দিষ্ট সময়ের মধ্যে উভয় প্রতিষ্ঠান থেকে অনুমোদনের পর) প্রাদানের পর ট্রান্সফার আদেশ এর কপি প্রিন্ট করা যাবে।</span></th>
                                 </tr>
                              </tfoot>
                           </Table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Col md="5">
                  <Card className="d-flex justify-content-center m-0 p-0 auth-card">
                     <Card.Body>
                        <h5 className="p-2 rounded-1 text-center bg-secondary text-white"><span className={styles.SolaimanLipiFont}>আবেদনের তথ্য</span></h5>
                        <div className='table-responsive'>
                           <Table className='table table-bordered table-hover'>
                              <thead>
                                 <tr>
                                    <th scope='col' className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>টাইটেল</span></th>
                                    <th scope='col' className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}></span></th>
                                    <th scope='col' className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>বিবরণ</span></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>আবেদন নম্বর</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'><span className={styles.SolaimanLipiFont}>{stData.id_invoice}</span></td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>আবেদনপত্র</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       <Button onClick={printApplication} type='button' variant="btn btn-info" className={styles.SolaimanLipiFont + "p-0 py-2 m-0 w-100 text-white"}>আবেদনপত্র প্রিন্ট</Button>
                                    </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>বর্তমান প্রতিষ্ঠানের অনুমোদন</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       {srcEiinAuth && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-success"}>{srcEiinAuth}</div>}
                                       {srcEiinCancel && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-danger"}>{srcEiinCancel}</div>}
                                       {srcEiinPending && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-warning"}>{srcEiinPending}</div>}
                                    </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠানের অনুমোদন</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       {dstEiinAuth && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-success"}>{dstEiinAuth}</div>}
                                       {dstEiinCancel && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-danger"}>{dstEiinCancel}</div>}
                                       {dstEiinPending && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-warning"}>{dstEiinPending}</div>
                                       }
                                    </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>বর্তমান বোর্ডের অনুমোদন</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       {srcBoardAuth && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-success"}>{srcBoardAuth}</div>}
                                       {srcBoardCancel && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-danger"}>{srcBoardCancel}</div>}
                                       {srcBoardPending && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-warning"}>{srcBoardPending}</div>}
                                    </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>গন্তব্য বোর্ডের অনুমোদন</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       {dstBoardAuth && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-success"}>{dstBoardAuth}</div>}
                                       {dstBoardCancel && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-danger"}>{dstBoardCancel}</div>}
                                       {dstBoardPending && <div className={styles.SolaimanLipiFont + " w-100 py-2 rounded-1 text-warning"}>{dstBoardPending}</div>}
                                    </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' className=' text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>টিসি আদেশ</span></th>
                                    <td className='text-center text-wrap align-top py-2 m-0'><span className={styles.SolaimanLipiFont}>:</span></td>
                                    <td className='text-center text-wrap p-0 m-0 px-1 py-2 m-0'>
                                       <div className='d-flex justify-content-center align-items-center gap-1'>
                                          {!tcOrder && <Button className='p-0 py-2 m-0 flex-fill' type='button' variant="btn btn-danger" onClick={tcStatus}><span className={styles.SolaimanLipiFont + " text-white"}>আবেদনের অবস্থা</span></Button>}

                                          {/* {!tcOrder && <Button className='p-0 py-2 m-0 flex-fill' type='button' variant="btn btn-primary" onClick={() => setPaidApplication(false)}><span className={styles.SolaimanLipiFont + " text-white"}>নতুন আবেদন</span></Button>} */}

                                          {tcOrder && <Button className='p-0 py-2 m-0 flex-fill' type='button' variant="btn btn-success" onClick={tcOrderPrint}><span className={styles.SolaimanLipiFont + " text-white"}>টিসি আদেশ প্রিন্ট</span></Button>}
                                       </div>
                                    </td>
                                 </tr>
                              </tbody>
                           </Table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            <div className="m-0 p-0 d-flex justify-content-center align-items-center w-100 bg-white">
               <Button onClick={formReset} type="reset" variant="btn btn-primary">Return Home</Button>
            </div>
         </div>
      </>
   );

   if (tcRequest) return (
      <>
         <div className='bg-white login-content d-flex flex-column justify-content-around align-content-center vh-100 vw-95'>
            <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
               <Col md="8">
                  <Row>
                     <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className="d-flex flex-column justify-content-center mb-1">
                           <Link to="/tc/new" onClick={formReset} className="navbar-brand d-flex justify-content-center align-items-center">
                              <Logo color={true} />
                           </Link>
                           <h1 className="logo-title text-primary text-wrap text-center">{appName}</h1>
                        </Card.Header>
                        <Card.Body>
                           <div className="mb-4">
                              <h6 className="text-center text-info">{stLoading}</h6>
                              <h6 className="text-center bg-danger text-white">{stError}</h6>
                              <h6 className="text-center bg-success text-white">{stSuccess}</h6>
                           </div>
                           <div className='p-1'>
                              <h5 className="text-center pb-4"><u>Transfer Certificate Application</u></h5>
                              <h6 style={{ textAlign: 'justify' }}><span className={styles.SolaimanLipiFont}>চুড়ান্ত সাবমিটের পূর্বে শিক্ষার্থীর সকল তথ্য সঠিক আছে কিনা যাচাই করুন। সকল তথ্য সঠিক থাকলে <strong>Make Payment</strong> বাটনে ক্লিক করে বোর্ড নির্ধারিত আবেদন ফি প্রদান করুন। আবেদন ফি জমাদান সম্পন্ন হলে আপনার <span className={styles.SolaimanLipiFont+" text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span> বোর্ড নীতিমালা অনুযায়ী সম্পাদন করা হবে। </span></h6>

                              <div className='table-fixed pt-4'>
                                 <Table className='table table-bordered'>
                                    <thead>
                                       <tr>
                                          <th scope='col' colSpan={6} className='text-center text-primary fs-5 p-1 m-0'><span className={styles.SolaimanLipiFont}>শিক্ষার্থীর তথ্য</span></th>
                                       </tr>
                                    </thead>
                                    <tbody>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>শ্রেণী</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td className='text-wrap text-center p-1 m-0'><strong><span className={styles.SolaimanLipiFont + " text-uppercase"}>{stData.en_class} ({stData.rm_class})</span></strong></td>
                                          <td className='text-wrap text-end p-1 m-0'><span className={styles.SolaimanLipiFont}>রেজিস্ট্রেশন নম্বর</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td className='text-wrap text-center p-1 m-0'><strong>{stData.st_reg}</strong></td>
                                       </tr>
                                       <tr>
                                          <td colSpan={6} className='text-wrap p-2 m-0'></td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_name}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>পিতার নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_father}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>মাতার নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_mother}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>জন্ম তারিখ</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.st_dob}</td>
                                       </tr>
                                       <tr>
                                          <td colSpan={6} className='text-center text-info fs-6 text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>বর্তমান প্রতিষ্ঠানের তথ্য</span></td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>বোর্ড</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.src_bname}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>প্রতিষ্ঠানের নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{stData.src_institute} ({stData.src_eiin})</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>পঠিত বিষয়</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          {stData.id_religion === '01' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '02' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '03' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                          {stData.id_religion === '04' && <td colSpan={4} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                       </tr>
                                       <tr>
                                          <td colSpan={6} className='text-center text-primary fs-6 text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠানের তথ্য</span></td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>বোর্ড</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{selectedDstBoardName}</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>প্রতিষ্ঠানের নাম</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap p-1 m-0'>{selectedInstituteName} ({selectedInstitute.split("-")[0]})</td>
                                       </tr>
                                       <tr>
                                          <td className='text-wrap p-1 m-0'><span className={styles.SolaimanLipiFont}>পঠিতব্য বিষয়</span></td>
                                          <td className='text-wrap p-1 m-0'>:</td>
                                          <td colSpan={4} className='text-wrap text-danger p-1 m-0'><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠানের বিষয় সম্পর্কে নিশ্চিত হয়ে পেমেন্ট করুন।</span></td>
                                       </tr>
                                    </tbody>
                                 </Table>
                              </div>
                           </div>
                           <Form noValidate validated={validated} onSubmit={submitPayment} onReset={formReset}>
                              <Row>
                                 {/* <Col md="12">
                                    <Form.Label htmlFor="pay_name">Enter Your Name</Form.Label>
                                    <Form.Control type="text" id="pay_name" value={payName || stData.st_name} maxLength="40" required onChange={(e) => setPayName(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                       Enter Your Name
                                    </Form.Control.Feedback>
                                 </Col> */}
                                 <Col md="6">
                                    <Form.Label htmlFor="pay_number">Mobile Number</Form.Label>
                                    <Form.Control type="text" id="pay_number" value={payMobile} minLength="11" maxLength="11" required onChange={(e) => setPayMobile(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                       Enter Your Mobile Number
                                    </Form.Control.Feedback>
                                 </Col>
                                 <Col md="6">
                                    <Form.Label htmlFor="pay_email">Email Address</Form.Label>
                                    <Form.Control type="email" id="pay_email" value={payEmail} maxLength="30" required onChange={(e) => setPayEmail(e.target.value)} />
                                    <Form.Control.Feedback type="invalid">
                                       Enter Your Email Address
                                    </Form.Control.Feedback>
                                 </Col>
                              </Row>
                              <div className="d-flex justify-content-center mt-4 pt-4 gap-3">
                                 <Button className='flex-fill' type="reset" variant="btn btn-danger">Return Home</Button>
                                 <Button className='flex-fill' type="submit" variant="btn btn-primary">Make Payment</Button>
                              </div>
                           </Form>
                        </Card.Body>
                     </Card>
                  </Row>
               </Col>
            </Row>
         </div>
      </>
   );

   if (stData) return (
      <>
         <div className='bg-white login-content d-flex flex-column justify-content-around align-content-center vh-100 vw-95'>
            <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
               <Col md="12">
                  <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                     <Card.Header className="d-flex flex-column justify-content-center mb-1">
                        <Link to="/tc/new" onClick={formReset} className="navbar-brand d-flex justify-content-center align-items-center">
                           <Logo color={true} />
                        </Link>
                        <h1 className="logo-title text-primary text-wrap text-center">{appName}</h1>
                     </Card.Header>
                     <Card.Body>
                        <h4 className="text-center"><span className={styles.SolaimanLipiFont+" text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                     </Card.Body>
                     <Card.Footer>
                        <h6 className="text-center text-danger"><span className={styles.SolaimanLipiFont+" text-wrap"}>{pendingApplication}</span></h6>
                     </Card.Footer>
                  </Card>
               </Col>
            </Row>
            <Row className="m-0 d-flex justify-content-center align-items-start bg-white">
               <Col lg="5">
                  <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                     <Card.Body>
                        <h6 className="p-2 m-2 rounded-1 text-center bg-secondary text-white"><span className={styles.SolaimanLipiFont}>শিক্ষার্থীর তথ্য</span></h6>
                        <div className='table-responsive'>
                           <Table className='table table-bordered table-hover'>
                              <thead>
                                 <tr>
                                    <th scope='col' className='text-center p-2 m-0'><span className={styles.SolaimanLipiFont}>ক্রম</span></th>
                                    <th scope='col' className='text-center text-wrap align-top p-2 m-0'><span className={styles.SolaimanLipiFont}>টাইটেল</span></th>
                                    <th scope='col' className='text-center text-wrap align-top p-2 m-0'><span className={styles.SolaimanLipiFont}>বিবরণ</span></th>
                                 </tr>
                              </thead>
                              <tbody>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>রেজিঃ নং</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_reg}</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>রোল নং</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_roll}</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>নাম</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_name}</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = st_sl + 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>পিতার নাম</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_father}</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = st_sl + 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>মাতার নাম</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.st_mother}</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = st_sl + 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>জন্ম তারিখ</span></td>
                                    <td className='text-wrap p-2 m-0'> {stData.st_dob} </td>
                                 </tr>
                                 <tr>
                                    <th scope='row' colSpan={3} className='m-0 p-1 fs-6 rounded-1 text-wrap text-dark bg-warning text-center'><span className={styles.SolaimanLipiFont}>বর্তমান প্রতিষ্ঠান</span></th>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = st_sl + 1}</td>
                                    <td className='p-2 m-0'><span className={styles.SolaimanLipiFont}>নাম</span></td>
                                    <td className='text-wrap p-2 m-0'>{stData.src_institute} - [{stData.src_eiin}]</td>
                                 </tr>
                                 <tr>
                                    <td className='text-center p-2 m-0'>{st_sl = st_sl + 1}</td>
                                    <td className='p-2 m-0'> <span className={styles.SolaimanLipiFont}>পঠিত বিষয়</span></td>
                                    {stData.id_religion === '01' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১১, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '02' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১২, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '03' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৩, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                    {stData.id_religion === '04' && <td colSpan={1} className='text-wrap p-2 m-0'><span className={styles.SolaimanLipiFont}>১০১, ১০৭, ১০৯, ১১৪, ১২৭, ১৪৮, ১৫৩, ১৫৪, ১৫৭</span></td>}
                                 </tr>
                              </tbody>
                           </Table>
                        </div>
                     </Card.Body>
                  </Card>
               </Col>
               <Col lg="5">
                  <Card className="card-transparent shadow-none d-flex justify-content-center m-0 p-0 auth-card">
                     <Card.Body>
                        <h6 className="p-2 m-2 rounded-1 text-center bg-dark text-white"><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠানের তথ্য</span></h6>
                        <Form noValidate validated={validated} onSubmit={transferSubmit} onReset={formReset}>
                           <Row>
                              {/* <Col md="6">
                                    <Form.Label htmlFor="src_board">Source Board</Form.Label>
                                    <Form.Select
                                       id="src_board"
                                       value={stData.id_board}
                                       disabled={true}
                                       required
                                    >
                                       <option disabled value={stData.id_board}>{stData.en_board}</option>
                                    </Form.Select>
                                 </Col> */}
                              <Col md="12">
                                 <Form.Label htmlFor="dst_board"><span className={styles.SolaimanLipiFont}>গন্তব্য বোর্ড</span></Form.Label>
                                 <Form.Select
                                    id="dst_board"
                                    value={selectedDstBoard}
                                    onChange={handleBoardChange}
                                    required
                                 >
                                    <option disabled value="">-- Select Board --</option>
                                    <option value="11">Cumilla Board</option>
                                    <option value="10">Dhaka Board</option>
                                    <option value="12">Rajshahi Board</option>
                                    <option value="13">Jessore Board</option>
                                    <option value="14">Chattagram Board</option>
                                    <option value="15">Sylhet Board</option>
                                    <option value="16">Dinajpur Board</option>
                                    <option value="17">Mymenshingh Board</option>
                                    <option value="18">Madrasha Board</option>
                                    <option value="19">Technical Board</option>
                                    <option value="20">Open University</option>
                                 </Form.Select>
                                 <Form.Control.Feedback type="invalid">
                                    <span className={styles.SolaimanLipiFont}> গন্তব্য বোর্ড সিলেক্ট করতে হবে</span>
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_dist">জেলা</Form.Label>
                                 <Form.Select
                                    id="user_dist"
                                    value={selectedDistrict}
                                    onChange={handleDistrictChange}
                                    disabled={!selectedDstBoard || loadingDistricts || districts.length === 0}
                                 >
                                    <option disabled value="">-- Select District --</option>
                                    {districts.map((district, index) => (
                                       <option key={index} value={district.en_dist}>
                                          {district.en_dist}
                                       </option>
                                    ))}
                                 </Form.Select>
                                 {loadingDistricts && <p className="text-gray-500 mt-2">{loadingDistricts}</p>}
                                 <Form.Control.Feedback type="invalid">
                                    <span className={styles.SolaimanLipiFont}>জেলা সিলেক্ট করতে হবে</span>
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_upz"><span className={styles.SolaimanLipiFont}>উপজেলা</span></Form.Label>
                                 <Form.Select
                                    id="user_upz"
                                    value={selectedUpazila}
                                    onChange={handleUpazilaChange}
                                    disabled={!selectedDistrict || loadingUpazilas || upazilas.length === 0}
                                 >
                                    <option disabled value="">-- Select Upazila --</option>
                                    {upazilas.map((upazila, index) => (
                                       <option key={index} value={upazila.en_uzps}>
                                          {upazila.en_uzps}
                                       </option>
                                    ))}
                                 </Form.Select>
                                 {loadingUpazilas && <p className="text-gray-500 mt-2">{loadingUpazilas}</p>}
                                 <Form.Control.Feedback type="invalid">
                                    <span className={styles.SolaimanLipiFont}>উপজেলা সিলেক্ট করতে হবে</span>
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="12">
                                 <Form.Label htmlFor="user_institute"><span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠানের নাম</span></Form.Label>
                                 <Form.Select
                                    id="user_institute"
                                    onChange={handleInstituteChange}
                                    value={selectedInstitute}
                                    required
                                    disabled={!selectedUpazila || loadingInstitutes || institutes.length === 0}
                                 >
                                    <option disabled value="">-- Select Institute --</option>
                                    {institutes.map((institute, index) => (
                                       <option key={index} value={institute.id_institute + "-" + institute.en_institute}>
                                          {institute.id_institute}-({institute.en_institute})
                                       </option>
                                    ))}
                                 </Form.Select>
                                 {loadingInstitutes && <p className="text-gray-500 mt-2">{loadingInstitutes}</p>}
                                 <Form.Control.Feedback type="invalid">
                                    <span className={styles.SolaimanLipiFont}>গন্তব্য প্রতিষ্ঠান সিলেক্ট করতে হবে</span>
                                 </Form.Control.Feedback>
                                 {selectedInstituteName && <small><i>{selectedInstituteName} {selectedInstitute}</i></small>}
                              </Col>
                              <Col md="12" className='p-2 m-2'>
                                 <h6 className="p-2 rounded-1 text-center text-danger"><span className={styles.SolaimanLipiFont+" text-wrap"}>আবেদন করার পূর্বে গন্তব্য প্রতিষ্ঠানে পঠিত (Registered) বিষয়সমূহ আছে কিনা নিশ্চিত হতে হবে</span></h6>
                              </Col>
                           </Row>
                           <div className="d-flex justify-content-center mt-4 pt-4 gap-3">
                              <Button onClick={formReset} className='flex-fill' type="reset" variant="btn btn-danger">Return Home</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit Application</Button>
                           </div>
                        </Form>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </>
   );

   return (
      <>
         <div className='bg-white login-content d-flex flex-column justify-content-center align-content-center vh-100 vw-95'>
            <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
               <Col md="8">
                  <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                     <Card.Header className="d-flex flex-column justify-content-center mb-1">
                        <Link to="/tc/new" onClick={formReset} className="navbar-brand d-flex justify-content-center align-items-center">
                           <Logo color={true} />
                        </Link>
                        <h1 className="logo-title text-primary text-wrap text-center">{appName}</h1>
                     </Card.Header>
                     <Card.Body>
                        <h4 className="text-center"><span className={styles.SolaimanLipiFont+" text-wrap"}>ট্রান্সফার সার্টিফিকেট (TC) এর আবেদন</span></h4>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
            <Row className="m-0 d-flex justify-content-center align-items-start bg-white">
               <Col lg="6">
                  <Row className="justify-content-center">
                     <Col md="12">
                        <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                           <Card.Body>
                              <div className="mb-4">
                                 <h6 className="text-center text-info">{stLoading}</h6>
                                 <h6 className="text-center bg-danger text-white">{stError}</h6>
                                 <h6 className="text-center bg-success text-white">{stSuccess}</h6>
                              </div>
                              <Form noValidate validated={validated} onSubmit={searchSubmit} onReset={formReset}>
                                 <Row>
                                    <Col md="6">
                                       <Form.Label htmlFor="user_class">Class</Form.Label>
                                       <Form.Select id="user_class" value={stClass} required onChange={(e) => setStClass(e.target.value)}>
                                          <option value="">Select Class</option>
                                          <option value="06">Six</option>
                                          <option value="07">Seven</option>
                                          <option value="08">Eight</option>
                                          <option value="09">Nine</option>
                                          <option value="10">Ten</option>
                                          <option value="11">Eleven</option>
                                          <option value="12">Twelve</option>
                                       </Form.Select>
                                       <Form.Control.Feedback type="invalid">
                                          Select Class
                                       </Form.Control.Feedback>
                                    </Col>
                                    <Col md="6">
                                       <Form.Label htmlFor="user_regno">Registration Number</Form.Label>
                                       <Form.Control type="text" id="user_regno" value={stReg} minLength="10" maxLength="10" required onChange={(e) => setStreg(e.target.value)} />
                                       <Form.Control.Feedback type="invalid">
                                          Enter Registration Number
                                       </Form.Control.Feedback>
                                    </Col>
                                    <Col md="6">
                                       <Form.Label htmlFor="user_dob">Date of Birth</Form.Label>
                                       <Form.Control type="date" id="user_dob" value={stDob} required onChange={(e) => setStDob(e.target.value)} />
                                       <Form.Control.Feedback type="invalid">
                                          Enter Date of Birth
                                       </Form.Control.Feedback>
                                    </Col>
                                    <Col md="6">
                                       <Form.Label htmlFor="user_session">Session</Form.Label>
                                       <Form.Control type="text" id="user_session" value={stSession} minLength="4" maxLength="4" required onChange={(e) => setStSession(e.target.value)} />
                                       <Form.Control.Feedback type="invalid">
                                          Enter Session
                                       </Form.Control.Feedback>
                                    </Col>
                                 </Row>
                                 <div className="d-flex justify-content-center mt-4 pt-4 gap-3">
                                    <Button className='flex-fill' type="submit" variant="btn btn-primary">Submit</Button>
                                 </div>
                              </Form>
                           </Card.Body>
                        </Card>
                     </Col>
                  </Row>
               </Col>
            </Row>
         </div>
      </>
   )
}

export default RegistrationCancell
