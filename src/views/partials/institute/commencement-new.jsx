import React, { useRef, Fragment, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from "react-redux"

// import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

import { Document, Page } from 'react-pdf';

// import FsLightbox from 'fslightbox-react';
import Select from 'react-select'

import { Modal, Row, Col, Button, Form } from 'react-bootstrap'
import Card from '../../../components/Card'

import * as ValidationInput from '../input_validation'

import axios from 'axios';

import styles from '../../../assets/custom/css/bisec.module.css'

// import cb_logo from '../../../assets/images/board/cb_logo.jpg'

import Logo from '../../../components/partials/components/logo'
import * as SettingSelector from '../../../store/setting/selectors.ts'

const InstClassStartNew = () => {
    // enable axios credentials include
    axios.defaults.withCredentials = true;

    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const appName = useSelector(SettingSelector.app_bn_name);

    // Set Dates
    const toDay = new Date();
    toDay.setHours(toDay.getUTCHours() + 6);
    var start_year = toDay.getFullYear() - 120;
    var end_year = toDay.getFullYear() - 18;
    toDay.setFullYear(start_year);
    var start_dob = toDay.toISOString().split('T')[0];
    toDay.setFullYear(end_year);
    var end_dob = toDay.toISOString().split('T')[0];

    // Modal Variales
    const [modalError, setModalError] = useState(false);

    // Form Validation Variable
    const [validated, setValidated] = useState(false);

    // Student Data Variables
    const [userData, setUserData] = useState({
        applicant_mobile: '', applicant_name: '', inst_founder_dob: '', inst_founder_name: '', inst_founder_nid: '', inst_founder_mobile: '', inst_address: '', inst_bn_name: '', inst_en_name: '', inst_coed: '', inst_dist: '', inst_distance: '', inst_email: '', inst_khatiyan_name: '', inst_khatiyan_number: '', inst_land: '', inst_mobile: '', inst_mouza_name: '', inst_mouza_number: '', institute_named: '', inst_population: '', inst_region: '', inst_status: '', inst_ltax_num: '', inst_ltax_year: '', inst_uzps: '', inst_version: ''
    });

    const [bnError, setBnError] = useState([]);

    const [userDataError, setUserDataError] = useState([]);

    // Districts and Upazilas
    const [districts, setDistricts] = useState([]);
    const [optionDistricts, setOptionDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    // File Attachment
    const [files, setFiles] = useState({
        'applicant_details': null, 'application_form': null, 'founder_details': null, 'land_details': null, 'ltax_details': null, 'distance_cert': null, 'population_cert': null, 'declare_form': null, 'feasibility_details': null
    });

    const [filesPages, setFilesPages] = useState({
        'applicant_details': 0, 'application_form': 0, 'founder_details': 0, 'land_details': 0, 'ltax_details': 0, 'distance_cert': 0, 'population_cert': 0, 'declare_form': 0, 'feasibility_details': 0
    });

    // Student Registration Status
    const [insertSuccess, setInsertSuccess] = useState(false);
    const [insertLoading, setInsertLoading] = useState(false);
    const [insertError, setInsertError] = useState(false);
    const [prevApplication, setPrevApplication] = useState(false);

    // const [printApplication, serPrintApplication] = useState(false);

    const printRef = useRef();

    const navigate = useNavigate();

    // Set bnError
    useEffect(() => {
        setBnError({
            applicant_mobile: 'আবেদনকারীর মোবাইল', applicant_name: 'আবেদনকারীর নাম', inst_founder_dob: 'নামীয় প্রতিষ্ঠানের ব্যক্তির জন্ম তারিখ', inst_founder_name: 'নামীয় প্রতিষ্ঠানের ব্যক্তির নাম', inst_founder_nid: 'নামীয় প্রতিষ্ঠানের ব্যক্তির এনআইডি', inst_address: 'প্রতিষ্ঠানের ঠিকানা', inst_bn_name: 'প্রতিষ্ঠানের বাংলা নাম', inst_en_name: 'প্রতিষ্ঠানের ইংরেজি নাম', inst_coed: 'প্রতিষ্ঠানের ধরণ', inst_dist: 'প্রতিষ্ঠানের জেলা', inst_distance: 'অন্য প্রতিষ্ঠানের দূরত্ব', inst_email: 'প্রতিষ্ঠানের ইমেইল', inst_khatiyan_name: 'খতিয়ানের নাম', inst_khatiyan_number: 'খতিয়ান নম্বর', inst_land: 'সর্বমোট জমি', inst_mobile: 'প্রতিষ্ঠানের মোবাইল', inst_mouza_name: 'মৌজার নাম', inst_mouza_number: 'মৌজা নম্বর', institute_named: 'ব্যক্তি নামীয় প্রতিষ্ঠান', inst_population: 'জনসংখ্যা', inst_region: 'প্রতিষ্ঠানের অবস্থান', inst_status: 'প্রতিষ্ঠানের পর্যায়', inst_ltax_num: 'দাখিলা নম্বর', inst_ltax_year: 'খাজনার বৎসর', inst_uzps: 'প্রতিষ্ঠানের উপজেলা', inst_version: 'প্রতিষ্ঠানের ভার্সান', inst_stage: 'প্রতিষ্ঠানের পর্যায়', founder_amount: 'নামীয় প্রতিষ্ঠানের ব্যক্তির জমাকৃত তহবিল', khatiyan_mutation: 'নামজারি খতিয়ান', khatiyan_mouja: 'নামজারি মৌজা', khatiyan_total: 'মোট জমি', tax_receipt: 'দাখিলা নম্বর', class_room: 'শ্রেণী কক্ষ', office_room: 'অফিস কক্ষ', toilet_room: 'টয়লেট সংখ্যা', common_room: 'কমনরুম', library_room: 'লাইব্রেরি সংখ্যা', total_books: 'মোট বই', computer_room: 'কম্পিউটার রুম', total_computer: 'মোট কম্পিউটার', labratory_room: 'বিজ্ঞানার সংখ্যা', general_fund: 'সাধারণ তহবিল', reserved_fund: 'রিজার্ভ ফান্ড', ref_build_js: 'স্থাপনের স্বারক (নিম্ন মাধ্যমিক)', ref_build_ss: 'স্থাপনের স্বারক (মাধ্যমিক)', ref_build_hs: 'স্থাপনের স্বারক (উচ্চ মাধ্যমিক)', ref_build_sc: 'স্থাপনের স্বারক (মাধ্যমিক ও উচ্চ মাধ্যমিক)', ref_commence_js: 'পাঠদানের স্বারক (নিম্ন মাধ্যমিক)', ref_commence_ss: 'পাঠদানের স্বারক (মাধ্যমিক)', ref_commence_hs: 'পাঠদানের স্বারক (উচ্চ মাধ্যমিক)', ref_commence_sc: 'পাঠদানের স্বারক (মাধ্যমিক ও উচ্চ মাধ্যমিক)', ref_recognition_js: 'একাডেমিক স্বীকৃতির স্বারক (নিম্ন মাধ্যমিক)', ref_recognition_ss: 'একাডেমিক স্বীকৃতির স্বারক (মাধ্যমিক)', ref_recognition_hs: 'একাডেমিক স্বীকৃতির স্বারক (উচ্চ মাধ্যমিক)', ref_recognition_sc: 'একাডেমিক স্বীকৃতির স্বারক (মাধ্যমিক ও উচ্চ মাধ্যমিক)', date_build_js: 'স্বারকের তারিখ (নিম্ন মাধ্যমিক)', date_build_ss: 'স্বারকের তারিখ (মাধ্যমিক)', date_build_hs: 'স্বারকের তারিখ (উচ্চ মাধ্যমিক)', date_build_sc: 'স্বারকের তারিখ (মাধ্যমিক ও উচ্চ মাধ্যমিক)', date_commence_js: 'স্বারকের তারিখ (নিম্ন মাধ্যমিক)', date_commence_ss: 'স্বারকের তারিখ (মাধ্যমিক)', date_commence_hs: 'স্বারকের তারিখ (উচ্চ মাধ্যমিক)', date_commence_sc: 'স্বারকের তারিখ (মাধ্যমিক ও উচ্চ মাধ্যমিক)', date_recognition_ss: 'স্বারকের তারিখ (নিম্ন মাধ্যমিক)', date_recognition_js: 'স্বারকের তারিখ (মাধ্যমিক)', date_recognition_hs: 'স্বারকের তারিখ (উচ্চ মাধ্যমিক)', date_recognition_sc: 'স্বারকের তারিখ (মাধ্যমিক ও উচ্চ মাধ্যমিক)', applicant_details: 'আবেদনকারীগণের বিবরণী', application_form: 'আবেদন ফর্ম', founder_details: 'নামীয় প্রতিষ্ঠানের ব্যক্তির বিবরণী', land_details: 'জমির দলিল ও অন্যান্য', ltax_details: 'খাজনার দাখিলা', distance_cert: 'দূরত্বের সনদ', population_cert: 'জনসংখ্যার সনদ', declare_form: 'অঙ্গীকারনামা ফর্ম', feasibility_details: 'স্থাপনের যৌক্তিকতার বিবরণী', mutation_details: 'নামজারি খতিয়ান', dakhila_details: 'খাজনার দাখিলা', named_fund_details: 'ব্যক্তির জমাকৃত তহবিলের বিবরণী', general_fund_details: 'সাধারণ তহবিলের বিবরণী', reserved_fund_details: 'রিজার্ভ ফান্ডের বিবরণী', order_build_js: 'স্থাপনের আদেশ (নিম্ন মাধ্যমিক)', order_build_ss: 'স্থাপনের আদেশ (মাধ্যমিক)', order_build_hs: 'স্থাপনের আদেশ (উচ্চ মাধ্যমিক)', order_class_js: 'পাঠদানের আদেশ (নিম্ন মাধ্যমিক)', order_class_ss: 'পাঠদানের আদেশ (মাধ্যমিক)', order_class_hs: 'পাঠদানের আদেশ (উচ্চ মাধ্যমিক)', order_recognition_js: 'একাডেমিক স্বীকৃতির আদেশ (নিম্ন মাধ্যমিক)', order_recognition_ss: 'একাডেমিক স্বীকৃতির আদেশ (মাধ্যমিক)', order_recognition_hs: 'একাডেমিক স্বীকৃতির আদেশ (উচ্চ মাধ্যমিক)'
        });
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

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
                        padding: 0.25in !important;
                        div, table, tr, th, td, p, span {
                            page-break-inside: avoid !important;
                        }
                        section {
                            page-break-after: always !important;
                        }
                        *{
                           font-family: 'Siyam Rupali', sans-serif !important;
                           color: #000000 !important;
                           margin: 0 !important;
                           padding: 0.25in !important;
                        }
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
                <div class="d-flex justify-content-center align-items-center">${printContent}</div>
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

    // Check if Distance & Population Criterion is Matched
    const distancePopulationEval = () => {
        let distance_error = '';
        let population_error = '';
        switch (userData.inst_region) {
            case '01':
            case '02':
                switch (userData.inst_status) {
                    case '11':
                    case '12':
                    case '17':
                        if ((userData.inst_distance && userData.inst_distance < 1) && (userData.inst_population && userData.inst_population < 10000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ১ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ১০,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 1)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ১ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 10000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ১০,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    case '13':
                    case '20':
                        if ((userData.inst_distance && userData.inst_distance < 2) && (userData.inst_population && userData.inst_population < 75000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৭৫,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 2)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 75000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৭৫,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    case '19':
                        if ((userData.inst_distance && userData.inst_distance < 2) && (userData.inst_population && userData.inst_population < 65000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৬৫,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 2)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 65000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৬৫,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    default:
                        distance_error = '';
                        population_error = '';
                        break;
                }
                break;
            case '03':
                switch (userData.inst_status) {
                    case '11':
                    case '12':
                    case '17':
                        if ((userData.inst_distance && userData.inst_distance < 2) && (userData.inst_population && userData.inst_population < 10000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ১০,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 2)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ২ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 10000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ১০,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    case '13':
                    case '20':
                        if ((userData.inst_distance && userData.inst_distance < 4) && (userData.inst_population && userData.inst_population < 75000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ৪ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৭৫,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 4)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ৪ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 75000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৭৫,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    case '19':
                        if ((userData.inst_distance && userData.inst_distance < 4) && (userData.inst_population && userData.inst_population < 65000)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ৪ কিমি হতে হবে!';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৬৫,০০০ হতে হবে!';
                        } else if ((userData.inst_distance && userData.inst_distance < 4)) {
                            distance_error = 'প্রতিষ্ঠানটি থেকে নিকটবর্তী প্রতিষ্ঠানের দূরত্ব কমপক্ষে ৪ কিমি হতে হবে!';
                            population_error = '';
                        } else if ((userData.inst_population && userData.inst_population < 65000)) {
                            distance_error = '';
                            population_error = 'প্রতিষ্ঠানের এলাকায় জনসংখ্যা কমপক্ষে ৬৫,০০০ হতে হবে!';
                        } else {
                            distance_error = '';
                            population_error = '';
                        }
                        break;
                    default:
                        distance_error = '';
                        population_error = '';
                        break;
                }
                break;

            default:
                distance_error = '';
                population_error = '';
                break;
        }
        return ({ distance_error: distance_error, population_error: population_error });
    }

    // Demo PDF File Create
    // useEffect(() => {
    //     const createPdf = async () => {
    //         const pdfDoc = await PDFDocument.create();
    //         const userFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    //         const page = pdfDoc.addPage([612, 792]);
    //         const { width, height } = page.getSize();
    //         const fontSizeTitle = 18;
    //         const fontSizeHeader = 16;
    //         const fontSizeBody = 14;
    //         const fontSizeSmall = 12;

    //         const boardTitle = "Board of Intermediate and Secondary Education, Cumilla";
    //         const boardAddress = "Laksam Road, Kandirpar, Cumilla";
    //         const boardContact = "email: chairmen@cumillaboard.gov.bd mobile: +880-2334-406328";
    //         const boardBar = "================================================================================================================";
    //         const demoText = "THIS SAMPLE PDF IS GENERATED IN SERVER!";

    //         const boardTitleWidth = userFont.widthOfTextAtSize(boardTitle, fontSizeTitle);
    //         const boardAddressWidth = userFont.widthOfTextAtSize(boardAddress, fontSizeHeader);
    //         const boardContactWidth = userFont.widthOfTextAtSize(boardContact, fontSizeSmall);
    //         const boardBarWidth = userFont.widthOfTextAtSize(boardBar, fontSizeSmall);
    //         const demoTextWidth = userFont.widthOfTextAtSize(demoText, fontSizeBody);

    //         const response = await fetch(cb_logo);
    //         const imageBytes = await response.arrayBuffer();
    //         const image = await pdfDoc.embedJpg(imageBytes);
    //         const imageWidth = 64;
    //         const margin = 25;
    //         const gap = 10;

    //         page.drawText(boardTitle, {
    //             x: (width - boardTitleWidth) / 2,
    //             y: height - margin * 1.5,
    //             size: fontSizeTitle,
    //             font: userFont,
    //             color: rgb(0, 0, 0),
    //         });

    //         page.drawText(boardAddress, {
    //             x: (width - boardAddressWidth) / 2,
    //             y: height - (margin * 1.5 + fontSizeHeader * 1.5),
    //             size: fontSizeHeader,
    //             font: userFont,
    //             color: rgb(0, 0, 0),
    //         });

    //         page.drawText(boardContact, {
    //             x: (width - boardContactWidth) / 2,
    //             y: height - (margin * 1.5 + fontSizeHeader * 1.5 + fontSizeSmall * 1.5),
    //             size: fontSizeSmall,
    //             font: userFont,
    //             color: rgb(0, 0, 0),
    //         });

    //         page.drawText(boardBar, {
    //             x: (width - boardBarWidth) / 2,
    //             y: height - (margin * 1.5 + fontSizeHeader * 1.5 + fontSizeSmall * 3),
    //             size: fontSizeSmall,
    //             font: userFont,
    //             color: rgb(0, 0, 0),
    //         });

    //         page.drawText(demoText, {
    //             x: (width - demoTextWidth) / 2,
    //             y: height / 2,
    //             size: fontSizeBody,
    //             font: userFont,
    //             color: rgb(0.4, 0.8, 0.4),
    //         });

    //         page.drawImage(image, {
    //             x: (width - boardTitleWidth) / 2 - (imageWidth + gap),
    //             y: height - (imageWidth + margin),
    //             width: imageWidth,
    //             height: imageWidth,
    //         });

    //         const pdfBytes = await pdfDoc.save();

    //         const file = new File([pdfBytes], 'demo_pdf_file', {
    //             type: 'application/pdf',
    //         });

    //     setFiles({
    //         'applicant_details': file, 'application_form': file, 'founder_details': file, 'land_details': file, 'ltax_details': file, 'distance_cert': file, 'population_cert': file, 'declare_form': file, 'feasibility_details': file
    //     });
    // }
    //     createPdf();
    // }, []);// eslint-disable-line react-hooks/exhaustive-deps

    // Check if Distance & Population Criterion is Matched
    useEffect(() => {
        if (userData.inst_region && userData.inst_status) {
            const user_error = distancePopulationEval();
            setUserDataError({ ...userDataError, inst_distance: user_error.distance_error, inst_population: user_error.population_error });
            (user_error.distance_error || user_error.population_error) ? setValidated(true) : setValidated(false);
        } else {
            setUserDataError({ ...userDataError, inst_distance: '', inst_population: '' });
            setValidated(false);
        }
    }, [userData.inst_region, userData.inst_status, userData.inst_distance, userData.inst_population]);// eslint-disable-line react-hooks/exhaustive-deps

    // Reset named institute founder details
    useEffect(() => {
        if (userData.institute_named !== '01') {
            setFiles({ ...files, founder_details: null });
            setFilesPages({ ...files, founder_details: null });
            setUserDataError({ ...files, founder_details: null });
            setUserData({ ...userData, inst_founder_dob: '', inst_founder_name: '', inst_founder_nid: '', inst_founder_mobile: '' });
        }
    }, [userData.institute_named]);// eslint-disable-line react-hooks/exhaustive-deps

    // Handle File View
    const handleFileView = (field) => {
        if (files[field] instanceof Blob) {
            window.open(URL.createObjectURL(files[field]), '_blank');
            URL.revokeObjectURL(files[field]);
        }
    };

    // Handle File Select
    const handleFileSelect = async (fileName, selectedFile) => {
        if (selectedFile && selectedFile.type === 'application/pdf') {
            if (selectedFile.size > 1024 * 1024) {
                setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইলের সাইজ 1mb এর কম হতে হবে!` });
                setFiles({ ...files, [fileName]: null });
            } else {
                const temp_file = new File([selectedFile], `${fileName}.pdf`, {
                    type: selectedFile.type,
                });
                setFiles({ ...files, [fileName]: temp_file });
                setUserDataError({ ...userDataError, [fileName]: null });

            }
        } else {
            setUserDataError({ ...userDataError, [fileName]: `পিডিএফ (PDF) ফাইল সিলেক্ট করতে হবে!` });
            setFiles({ ...files, [fileName]: null });
        }
    }

    // Handle Submit Application
    const handleSubmit = async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        let isValid = true;
        setUserDataError([]);
        setInsertSuccess(false);
        setInsertError(false);
        setPrevApplication(false)
        setInsertLoading("প্রতিষ্ঠানের তথ্য আপলোড করা হচ্ছে! অপেক্ষা করুন...");

        const newErrors = {}; // Collect errors in one place
        if (!form.checkValidity()) {
            setValidated(false);
            event.stopPropagation();
        } else {
            const bengaliName = {
                applicant_details: 'আবেদনকারী/আবেদনকারীগণের পরিচয়পত্র সংযুক্ত করতে হবে',
                application_form: 'আবেদন ফর্ম [ক(১)/ক(২)] সংযুক্ত করতে হবে',
                founder_details: 'প্রতিষ্ঠাতার পরিচিতি সংযুক্ত করতে হবে',
                land_details: 'প্রতিষ্ঠানের ভূমির খতিয়ান ও দলিল সংযুক্ত করতে হবে',
                ltax_details: 'প্রতিষ্ঠানের ভূমির খাজনার দাখিলা সংযুক্ত করতে হবে',
                distance_cert: 'নিকটবর্তী প্রতিষ্ঠানের দূরত্বের সনদ সংযুক্ত করতে হবে',
                population_cert: 'জনসংখ্যার সনদ সংযুক্ত করতে হবে',
                declare_form: '৩০০ টাকার ননজুডিশিয়াল স্ট্যাম্পে অঙ্গীকারনামা (নোটারি) (ফর্ম ক(৩)) সংযুক্ত করতে হবে',
                feasibility_details: 'প্রতিষ্ঠান স্থাপনের যৌক্তিকতার সংক্ষিপ্ত বিবরণী সংযুক্ত করতে হবে'
            };

            const requiredFields = [
                'applicant_name', 'applicant_mobile', 'institute_named', 'inst_founder_name', 'inst_founder_nid', 'inst_founder_dob', 'inst_founder_mobile', 'inst_en_name', 'inst_bn_name', 'inst_email', 'inst_mobile', 'inst_coed', 'inst_status', 'inst_version', 'inst_region', 'inst_dist', 'inst_uzps', 'inst_address', 'inst_mouza_name', 'inst_mouza_number', 'inst_khatiyan_name', 'inst_khatiyan_number', 'inst_land', 'inst_ltax_num', 'inst_ltax_year', 'inst_population', 'inst_distance', 'applicant_details', 'application_form', 'founder_details', 'land_details', 'ltax_details', 'distance_cert', 'population_cert', 'declare_form', 'feasibility_details'
            ];

            requiredFields.forEach(field => {
                let dataError = null;

                switch (field) {
                    case 'applicant_name':
                    case 'inst_en_name':
                        dataError = ValidationInput.alphaCheck(userData[field]);
                        break;

                    case 'inst_bn_name':
                        dataError = ValidationInput.bengaliCheck(userData[field]);
                        break;

                    case 'inst_founder_name':
                        if (userData.institute_named === '01') {
                            dataError = ValidationInput.alphaCheck(userData[field]);
                        }
                        break;

                    case 'inst_founder_nid':
                        if (userData.institute_named === '01') {
                            if (userData[field].length === 10 || userData[field].length === 13 || userData[field].length === 17) {
                                dataError = ValidationInput.numberCheck(userData[field]);
                            } else {
                                dataError = 'এনআইডি নম্বর সঠিক নয়!';
                            }
                        }
                        break;

                    case 'inst_founder_dob':
                        if (userData.institute_named === '01') {
                            dataError = ValidationInput.dateCheck(userData[field], start_dob, end_dob);
                        }
                        break;

                    case 'inst_ltax_year':
                        if (userData[field].length === 4) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        } else {
                            dataError = 'খাজনার সন সঠিক নয়!';
                        }
                        break;
                    case 'applicant_mobile':
                    case 'inst_mobile':
                        if (userData[field].length === 11) {
                            dataError = ValidationInput.numberCheck(userData[field]);
                        } else {
                            dataError = 'মোবাইল নম্বর সঠিক নয়!';
                        }
                        break;
                    case 'inst_founder_mobile':
                        if (userData.institute_named === '01') {
                            if (userData[field].length === 11) {
                                dataError = ValidationInput.numberCheck(userData[field]);
                            } else {
                                dataError = 'মোবাইল নম্বর সঠিক নয়!';
                            }
                        }
                        break;
                    case 'institute_named':
                    case 'inst_coed':
                    case 'inst_status':
                    case 'inst_version':
                    case 'inst_region':
                    case 'inst_uzps':
                    case 'inst_population':
                    case 'inst_distance':
                    case 'inst_mouza_number':
                    case 'inst_khatiyan_number':
                        dataError = ValidationInput.numberCheck(userData[field]);
                        break;

                    case 'inst_address':
                    case 'inst_mouza_name':
                    case 'inst_khatiyan_name':
                    case 'inst_land':
                    case 'inst_ltax_num':
                        dataError = ValidationInput.addressCheck(userData[field]);
                        break;

                    case 'inst_email':
                        dataError = ValidationInput.emailCheck(userData[field]);
                        break;

                    case 'founder_details':
                        if (userData.institute_named === '01') {
                            dataError = files[field] ? '' : bengaliName[field];
                        }
                        break;
                    case 'applicant_details':
                    case 'application_form':
                    case 'land_details':
                    case 'ltax_details':
                    case 'distance_cert':
                    case 'population_cert':
                    case 'declare_form':
                    case 'feasibility_details':
                        dataError = files[field] ? '' : bengaliName[field];
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

            // Distance & Population Validity Check
            const user_error = distancePopulationEval();
            newErrors.inst_distance = newErrors.inst_distance || user_error.distance_error;
            newErrors.inst_population = newErrors.inst_population || user_error.population_error;

            if (user_error.distance_error || user_error.population_error) {
                isValid = false;
            }

            // Update once
            setUserDataError(newErrors);

            // console.log(newErrors);

            if (!isValid) {
                setModalError(true);
                setInsertLoading(false);
                setInsertError("প্রতিষ্ঠানের তথ্য সঠিকভাবে পূরণ করতে হবে!");
                event.stopPropagation();
            } else {
                const formData = new FormData();
                formData.append('institute_data', JSON.stringify(userData));

                // console.log(userData);

                Object.entries(files).forEach(([filename, file]) => {
                    formData.append('files', file); // Field name should match backend
                    // console.log(file);
                });

                // Debug FormData
                // for (let [key, value] of formData.entries()) {
                //     // console.log(`${key}:`, value);
                // }

                try {
                    const user_data = await axios.post(`${BACKEND_URL}/institute/class_start/build_new`, formData, {
                        headers: { 'Content-Type': 'multipart/form-data' },
                    });
                    if (user_data.status === 200) {
                        alert(user_data.data.message);
                        setInsertSuccess(user_data.data.message);
                        setUserData({ ...userData, user_pass: user_data.data.institute_pass });
                        // Reset Form
                        // setUserData({
                        //     applicant_mobile: '', applicant_name: '', inst_founder_dob: '', inst_founder_mobile:'', inst_founder_name: '', inst_founder_nid: '', inst_address: '', inst_bn_name: '', inst_coed: '', inst_dist: '', inst_distance: '', inst_email: '', inst_en_name: '', inst_khatiyan_name: '', inst_khatiyan_number: '', inst_land: '', inst_mobile: '', inst_mouza_name: '', inst_mouza_number: '', institute_named: '', inst_population: '', inst_region: '', inst_status: '', inst_ltax_num: '', inst_ltax_year: '', inst_uzps: '', inst_version: ''
                        // });
                        // Ser Files
                        setFiles({
                            'applicant_details': null, 'application_form': null, 'founder_details': null, 'land_details': null, 'ltax_details': null, 'distance_cert': null, 'population_cert': null, 'declare_form': null, 'feasibility_details': null
                        });
                    } else if (user_data.status === 201) {
                        setPrevApplication(user_data.data.message);
                        alert(user_data.data.message);
                    } else {
                        setInsertError(user_data.data.message);
                        alert(user_data.data.message);
                    }
                } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
setInsertError('প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি!');
                    alert('প্রতিষ্ঠানের তথ্য আপলোড করা সম্ভব হয়নি! কিছুক্ষণ পরে আবার চেষ্টা করুন।');
                } finally {
                    setInsertLoading(false);
                }
            }
        }
        setValidated(true);
    };

    // Handle User Data Change
    const handleDataChange = (dataName, dataValue) => {
        dataName === 'inst_email' ? setUserData({ ...userData, [dataName]: dataValue.toLowerCase() }) : setUserData({ ...userData, [dataName]: dataValue.toUpperCase() });
        setUserDataError(prev => ({ ...prev, [dataName]: '' }));
    }

    const handleReset = (event) => {
        event.preventDefault();
        event.stopPropagation();

        setUserDataError([]);
        setUpazilas([]);
        setValidated(false);

        setInsertSuccess(false);
        setInsertError(false);
        setInsertLoading(false);

        setFiles({
            'applicant_details': null, 'application_form': null, 'founder_details': null, 'land_details': null, 'ltax_details': null, 'distance_cert': null, 'population_cert': null, 'declare_form': null, 'feasibility_details': null
        });

        setFilesPages({
            'applicant_details': 0, 'application_form': 0, 'founder_details': 0, 'land_details': 0, 'ltax_details': 0, 'distance_cert': 0, 'population_cert': 0, 'declare_form': 0, 'feasibility_details': 0
        });

        setUserData({
            applicant_mobile: '', applicant_name: '', inst_founder_dob: '', inst_founder_name: '', inst_founder_nid: '', inst_founder_mobile: '', inst_address: '', inst_bn_name: '', inst_coed: '', inst_dist: '', inst_distance: '', inst_email: '', inst_en_name: '', inst_khatiyan_name: '', inst_khatiyan_number: '', inst_land: '', inst_mobile: '', inst_mouza_name: '', inst_mouza_number: '', institute_named: '', inst_population: '', inst_region: '', inst_status: '', inst_ltax_num: '', inst_ltax_year: '', inst_uzps: '', inst_version: ''
        });
    };

    //Handle District Change
    const handleDistrictChange = (value) => {
        setUserData({ ...userData, inst_dist: value });
        setUpazilas([]);
    };

    // Fetch District
    useEffect(() => {
        const fetchDistrict = async () => {
            setOptionDistricts([]);
            setInsertLoading("জেলার তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
            try {
                const response = await axios.get(`${BACKEND_URL}/district-list`);
                setDistricts(response.data);
            } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error(`Error Fetching Districts: ${err}`);
                setInsertError("জেলার তথ্য খুঁজে পাওয়া যায়নি! আবার প্রথম থেকে চেষ্টা করুন!");
            } finally {
                setInsertLoading(false);
            }
        }

        fetchDistrict();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Districts Option
    useEffect(() => {
        if (districts.length > 0) {
            const newOptions = districts.map(district => ({
                value: district.en_dist,
                label: district.en_dist
            }));
            setOptionDistricts(newOptions);
        }
    }, [districts]); // eslint-disable-line react-hooks/exhaustive-deps

    //Fetch Upazila List
    useEffect(() => {
        const fetchUpazila = async () => {
            if (userData.inst_dist) {
                var selectedDistrict = userData.inst_dist;
                setInsertLoading("উপজেলার তথ্য খুঁজা হচ্ছে! অপেক্ষা করুন!");
                try {
                    const response = await axios.post(`${BACKEND_URL}/district-list/upzila?`, { selectedDistrict });
                    setUpazilas(response.data);
                } catch (err) {


    if (err.status === 401) {
        navigate("/auth/sign-out");
        
    }
// console.error(`Error Fetching Upazilas: ${err}`);
                    setInsertError("উপজেলার তথ্য খুঁজে পাওয়া যায়নি! আবার জেলা নির্বাচন করুন!");
                } finally {
                    setInsertLoading(false);
                }
            }
        };
        fetchUpazila();
    }, [userData.inst_dist]);// eslint-disable-line react-hooks/exhaustive-deps

    if (insertSuccess) return (
        <Fragment>
            <Row ref={printRef} className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            <Link to="/institute/class-start/application" onClick={handleReset} className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}>প্রতিষ্ঠানের পাঠদানের আবেদন</h4>
                        </Card.Header>
                        <hr />
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={8}>
                                <Card className="m-0 p-0">
                                    <Card.Header>
                                        <h5 className={styles.SiyamRupaliFont + " text-success text-center w-100 card-title"}>{insertSuccess}</h5>
                                    </Card.Header>
                                    <Card.Body>
                                        <Row>
                                            <h5 className={styles.SiyamRupaliFont + " text-center py-3"}>আবেদনের সারসংক্ষেপ</h5>
                                            <p className={styles.SiyamRupaliFont + " text-danger text-center m-0 p-0 pt-2"}><small><i>পেমেন্ট ও আবেদনের সকল প্রক্রিয়ায় ইউজার আইডি ও পাসওয়ার্ড ব্যবহার করতে হবে</i></small></p>
                                            <p className={styles.SiyamRupaliFont + " text-danger text-center m-0 pb-4"}><small><i>(প্রিন্ট করে যথাযথভাবে সংরক্ষণ করুন)</i></small></p>
                                        </Row>
                                        <Row className="table-responsive">
                                            <table id="user-list-table" className="table table-bordered">
                                                <tbody>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>ইউজার আইডি</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_mobile}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>ইউজার পাসওয়ার্ড</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.user_pass}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>প্রতিষ্ঠানের নাম (বাংলা)</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_bn_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>প্রতিষ্ঠানের নাম (ইংরেজি)</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.inst_en_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>আবেদনকারীর নাম</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.applicant_name}</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <th className='text-left align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-dark print-nowrap"}>আবেদনকারীর মোবাইল</span>
                                                        </th>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>:</span>
                                                        </td>
                                                        <td className='text-center align-top p-2 m-0'>
                                                            <span className={styles.SiyamRupaliFont + " text-center text-primary print-nowrap"}>{userData.applicant_mobile}</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </Row>
                                    </Card.Body>
                                </Card>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={8} className='d-flex justify-content-center align-items-center gap-3'>
                                <Button onClick={handlePrint} className='flex-fill' type="reset" variant="btn btn-danger">আবেদন প্রিন্ট</Button>
                                <Button onClick={() => navigate('/institute/class-start/application')} className='flex-fill' type="submit" variant="btn btn-primary">পাঠদানের আবেদন করুন</Button>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            <Row className='d-flex flex-column justify-content-center align-items-center m-0 p-0'>
                <Col md={10}>
                    <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                        <Card.Header className='d-flex flex-column mb-2 justify-content-center align-items-center'>
                            {!ceb_session && <Link to="/institute/class-start/application" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>}
                            {ceb_session && <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-start w-100 gap-3">
                                <Logo color={true} />
                                <h2 className="logo-title text-primary text-wrap text-center">{appName}</h2>
                            </Link>}
                            <h4 className={styles.SiyamRupaliFont + " text-center text-uppercase text-secondary card-title pt-2"}> প্রতিষ্ঠানের পাঠদানের আবেদন</h4>
                            {insertSuccess && <h6 className="text-uppercase text-center pt-4 text-success">{insertSuccess}</h6>}
                            {insertError && <h6 className="text-uppercase text-center pt-4 text-danger">{insertError}</h6>}
                            {insertLoading && <h6 className="text-uppercase text-center pt-4 text-primary">{insertLoading}</h6>}
                            {prevApplication && <h6 className="text-uppercase text-center pt-4 text-success">{prevApplication}<Link to="/institute/class-start/application"> লগইন</Link></h6>}
                        </Card.Header>
                        <hr />
                        <Card.Body className='d-flex flex-column justify-content-center align-items-center'>
                            <Col md={12}>
                                <Form noValidate onSubmit={handleSubmit} onReset={handleReset}>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদনকারীর তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={6}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="applicant_name">আবেদনকারীর নাম</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={60}
                                                                id="applicant_name"
                                                                value={userData.applicant_name}
                                                                isInvalid={validated && !!userDataError.applicant_name}
                                                                isValid={validated && userData.applicant_name && !userDataError.applicant_name}
                                                                onChange={(e) => handleDataChange('applicant_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.applicant_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.applicant_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="applicant_mobile">আবেদনকারীর মোবাইল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                minLength={11}
                                                                maxLength={11}
                                                                id="applicant_mobile"
                                                                value={userData.applicant_mobile}
                                                                isInvalid={validated && !!userDataError.applicant_mobile}
                                                                isValid={validated && userData.applicant_mobile && !userDataError.applicant_mobile}
                                                                onChange={(e) => handleDataChange('applicant_mobile', e.target.value)}
                                                            />
                                                            {validated && userDataError.applicant_mobile && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.applicant_mobile}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Group className="bg-transparent">
                                                                <Form.Label className="text-primary" htmlFor='institute_named'>ব্যাক্তি নামের প্রতিষ্ঠান</Form.Label>
                                                                <Form.Select
                                                                    id="institute_named"
                                                                    value={userData.institute_named}
                                                                    isInvalid={validated && !!userDataError.institute_named}
                                                                    isValid={validated && userData.institute_named && !userDataError.institute_named}
                                                                    onChange={(e) => handleDataChange('institute_named', e.target.value)}
                                                                    className="selectpicker form-control"
                                                                    data-style="py-0"
                                                                >
                                                                    <option value=''>-- ব্যাক্তি নামের প্রতিষ্ঠান? --</option>
                                                                    <option value='01'>হ্যাঁ</option>
                                                                    <option value='02'>না</option>
                                                                </Form.Select>
                                                                {validated && userDataError.institute_named && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.institute_named}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>আবেদনকারী/গণের পরিচয়পত্র</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.applicant_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.applicant_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, applicant_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('applicant_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.applicant_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.applicant_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('applicant_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.applicant_details && !userDataError.applicant_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.applicant_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.applicant_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>আবেদন ফর্ম(ক(১)/ক(২))</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.application_form && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.application_form}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, application_form: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('application_form')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.application_form}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.application_form && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('application_form', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.application_form && !userDataError.application_form &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.application_form &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.application_form}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    {userData.institute_named && userData.institute_named === '01' && <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">ব্যক্তির তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={9}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_name">নাম</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={60}
                                                                id="inst_founder_name"
                                                                value={userData.inst_founder_name}
                                                                isInvalid={validated && !!userDataError.inst_founder_name}
                                                                isValid={validated && userData.inst_founder_name && !userDataError.inst_founder_name}
                                                                onChange={(e) => handleDataChange('inst_founder_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_nid">জাতীয় পরিচয়পত্র নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                minLength={10}
                                                                maxLength={17}
                                                                id="inst_founder_nid"
                                                                value={userData.inst_founder_nid}
                                                                isInvalid={validated && !!userDataError.inst_founder_nid}
                                                                isValid={validated && userData.inst_founder_nid && !userDataError.inst_founder_nid}
                                                                onChange={(e) => handleDataChange('inst_founder_nid', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_nid && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_nid}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_dob">জন্ম তারিখ</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="date"
                                                                id="inst_founder_dob"
                                                                min={start_dob}
                                                                max={end_dob}
                                                                value={userData.inst_founder_dob}
                                                                isInvalid={validated && !!userDataError.inst_founder_dob}
                                                                isValid={validated && userData.inst_founder_dob && !userDataError.inst_founder_dob}
                                                                onChange={(e) => handleDataChange('inst_founder_dob', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_dob && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_dob}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_founder_mobile">মোবাইল</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_founder_mobile"
                                                                minLength={11}
                                                                maxLength={11}
                                                                value={userData.inst_founder_mobile}
                                                                isInvalid={validated && !!userDataError.inst_founder_mobile}
                                                                isValid={validated && userData.inst_founder_mobile && !userDataError.inst_founder_mobile}
                                                                onChange={(e) => handleDataChange('inst_founder_mobile', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_founder_mobile && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_founder_mobile}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>ব্যক্তির পরিচিতি সংযুক্তি</label>
                                                        </Card.Header>

                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.founder_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.founder_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, founder_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('founder_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.founder_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.founder_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('founder_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.founder_details && !userDataError.founder_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.founder_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.founder_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>}
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদিত প্রতিষ্ঠানের তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_bn_name">প্রতিষ্ঠানের নাম (বাংলা)</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={120}
                                                        id="inst_bn_name"
                                                        value={userData.inst_bn_name}
                                                        isInvalid={validated && !!userDataError.inst_bn_name}
                                                        isValid={validated && userData.inst_bn_name && !userDataError.inst_bn_name}
                                                        onChange={(e) => handleDataChange('inst_bn_name', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_bn_name && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_bn_name}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_en_name">প্রতিষ্ঠানের নাম (ইংরেজি)</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={120}
                                                        id="inst_en_name"
                                                        value={userData.inst_en_name}
                                                        isInvalid={validated && !!userDataError.inst_en_name}
                                                        isValid={validated && userData.inst_en_name && !userDataError.inst_en_name}
                                                        onChange={(e) => handleDataChange('inst_en_name', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_en_name && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_en_name}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={6}>
                                                    <Form.Label className="text-primary" htmlFor="inst_email">প্রতিষ্ঠানের ইমেইল</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-lowecase'
                                                        type="text"
                                                        maxLength={80}
                                                        id="inst_email"
                                                        value={userData.inst_email}
                                                        isInvalid={validated && !!userDataError.inst_email}
                                                        isValid={validated && userData.inst_email && !userDataError.inst_email}
                                                        onChange={(e) => handleDataChange('inst_email', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_email && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_email}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={6}>
                                                    <Form.Label className="text-primary" htmlFor="inst_mobile">প্রতিষ্ঠানের মোবাইল</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={11}
                                                        minLength={11}
                                                        id="inst_mobile"
                                                        value={userData.inst_mobile}
                                                        isInvalid={validated && !!userDataError.inst_mobile}
                                                        isValid={validated && userData.inst_mobile && !userDataError.inst_mobile}
                                                        onChange={(e) => handleDataChange('inst_mobile', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_mobile && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_mobile}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_status'>প্রতিষ্ঠানের পর্যায়</Form.Label>
                                                        <Form.Select
                                                            id="inst_status"
                                                            value={userData.inst_status}
                                                            isInvalid={validated && !!userDataError.inst_status}
                                                            isValid={validated && userData.inst_status && !userDataError.inst_status}
                                                            onChange={(e) => handleDataChange('inst_status', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের পর্যায় সিলেক্ট করুন --</option>
                                                            <option value='11'>নিম্ন মাধ্যমিক বিদ্যালয় (৬ষ্ঠ থেকে ৮ম শ্রেণী)</option>
                                                            <option value='12'>মাধ্যমিক বিদ্যালয় (৯ম থেকে ১০ম শ্রেণী)</option>
                                                            <option value='13'>উচ্চমাধ্যমিক মহাবিদ্যালয় (১১শ থেকে ১২শ শ্রেণী)</option>
                                                            {/* <option value='17'>নিম্ন মাধ্যমিক এবং মাধ্যমিক (৬ষ্ঠ থেকে ১০ম শ্রেণী)</option> */}
                                                            {/* <option value='19'>মাধ্যমিক এবং উচ্চমাধ্যমিক (৯ম থেকে ১২শ শ্রেণী)</option> */}
                                                            <option value='20'>উচ্চমাধ্যমিক বিদ্যালয় ও মহাবিদ্যালয় (৬ষ্ঠ থেকে ১২শ শ্রেণী)</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_status && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_status}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_coed'>প্রতিষ্ঠানের ধরণ</Form.Label>
                                                        <Form.Select
                                                            id="inst_coed"
                                                            value={userData.inst_coed}
                                                            isInvalid={validated && !!userDataError.inst_coed}
                                                            isValid={validated && userData.inst_coed && !userDataError.inst_coed}
                                                            onChange={(e) => handleDataChange('inst_coed', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের ধরণ সিলেক্ট করুন --</option>
                                                            {userData.inst_status !== '13' && <>
                                                                <option value='01'>বালক</option>
                                                                <option value='02'>বালিকা</option>
                                                            </>}
                                                            <option value='03'>সহশিক্ষা</option>
                                                            {userData.inst_status === '13' && <option value='04'>মহিলা কলেজ</option>}
                                                        </Form.Select>
                                                        {validated && userDataError.inst_coed && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_coed}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_version'>প্রতিষ্ঠানের মাধ্যম</Form.Label>
                                                        <Form.Select
                                                            id="inst_version"
                                                            value={userData.inst_version}
                                                            isInvalid={validated && !!userDataError.inst_version}
                                                            isValid={validated && userData.inst_version && !userDataError.inst_version}
                                                            onChange={(e) => handleDataChange('inst_version', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- প্রতিষ্ঠানের মাধ্যম সিলেক্ট করুন --</option>
                                                            <option value='01'>বাংলা</option>
                                                            <option value='02'>ইংরেজি</option>
                                                            <option value='03'>যৌথ (বাংলা ও ইংরেজি)</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_version && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_version}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">আবেদিত প্রতিষ্ঠানের ঠিকানা</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group className="bg-transparent">
                                                        <Form.Label className="text-primary" htmlFor='inst_region'>প্রতিষ্ঠানের অবস্থান</Form.Label>
                                                        <Form.Select
                                                            id="inst_region"
                                                            value={userData.inst_region}
                                                            isInvalid={validated && !!userDataError.inst_region}
                                                            isValid={validated && userData.inst_region && !userDataError.inst_region}
                                                            onChange={(e) => handleDataChange('inst_region', e.target.value)}
                                                            className="selectpicker form-control"
                                                            data-style="py-0"
                                                        >
                                                            <option value=''>-- অবস্থান সিলেক্ট করুন --</option>
                                                            <option value='01'>সিটি কর্পোরেশন এলাকা</option>
                                                            <option value='02'>পৌরসভা এলাকা (প্রথম শ্রেণী)</option>
                                                            <option value='03'>মফস্বল এলাকা</option>
                                                        </Form.Select>
                                                        {validated && userDataError.inst_region && (
                                                            <Form.Control.Feedback type="invalid">
                                                                {userDataError.inst_region}
                                                            </Form.Control.Feedback>
                                                        )}
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Group>
                                                        <label className="text-primary mb-2" htmlFor='inst_dist'>জেলা</label>
                                                        <Select
                                                            inputId="inst_dist"
                                                            placeholder="--জেলা সিলেক্ট করুন--"
                                                            value={
                                                                optionDistricts.find(opt => opt.value === userData.inst_dist) || null
                                                            }
                                                            onChange={(value) =>
                                                                value ? handleDistrictChange(value.value) : handleDistrictChange('')
                                                            }
                                                            options={optionDistricts}
                                                            isClearable={true}
                                                            isSearchable={true}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                                <Col className='my-2' md={4}>
                                                    <Form.Label className="text-primary" htmlFor="inst_uzps">উপজেলা</Form.Label>
                                                    <Form.Select
                                                        id="inst_uzps"
                                                        value={userData.inst_uzps}
                                                        onChange={(e) => handleDataChange('inst_uzps', e.target.value)}
                                                        isInvalid={validated && !!userDataError.inst_uzps}
                                                        isValid={validated && userData.inst_uzps && !userDataError.inst_uzps}
                                                        disabled={upazilas.length === 0}
                                                    >
                                                        <option value=''>-- উপজেলা ‍সিলেক্ট করুন --</option>
                                                        {upazilas.map((upazila, index) => (
                                                            <option key={index} value={upazila.id_uzps}>
                                                                {upazila.en_uzps}
                                                            </option>
                                                        ))}
                                                    </Form.Select>
                                                    {validated && userDataError.inst_uzps && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_uzps}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                                <Col className='my-2' md={12}>
                                                    <Form.Label className="text-primary" htmlFor="inst_address">প্রতিষ্ঠানের পূর্ণ ঠিকানা</Form.Label>
                                                    <Form.Control
                                                        className='bg-transparent text-uppercase'
                                                        type="text"
                                                        maxLength={80}
                                                        placeholder='হোল্ডিং/বাড়ি নম্বর, রাস্তা, ওয়ার্ড, গ্রাম, ইউনিয়ন, ডাকঘর'
                                                        id="inst_address"
                                                        value={userData.inst_address}
                                                        isInvalid={validated && !!userDataError.inst_address}
                                                        isValid={validated && userData.inst_address && !userDataError.inst_address}
                                                        onChange={(e) => handleDataChange('inst_address', e.target.value)}
                                                    />
                                                    {validated && userDataError.inst_address && (
                                                        <Form.Control.Feedback type="invalid">
                                                            {userDataError.inst_address}
                                                        </Form.Control.Feedback>
                                                    )}
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">প্রতিষ্ঠানের জমির বিবরণ</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={6}>
                                                    <Row>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_mouza_name">মৌজার নাম </Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_mouza_name"
                                                                value={userData.inst_mouza_name}
                                                                isInvalid={validated && !!userDataError.inst_mouza_name}
                                                                isValid={validated && userData.inst_mouza_name && !userDataError.inst_mouza_name}
                                                                onChange={(e) => handleDataChange('inst_mouza_name', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_mouza_name && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_mouza_name}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Group className="bg-transparent">
                                                                <Form.Label className="text-primary" htmlFor='inst_khatiyan_name'>খতিয়ানের নাম</Form.Label>
                                                                <Form.Select
                                                                    id="inst_khatiyan_name"
                                                                    value={userData.inst_khatiyan_name}
                                                                    isInvalid={validated && !!userDataError.inst_khatiyan_name}
                                                                    isValid={validated && userData.inst_khatiyan_name && !userDataError.inst_khatiyan_name}
                                                                    onChange={(e) => handleDataChange('inst_khatiyan_name', e.target.value)}
                                                                    className="selectpicker form-control"
                                                                    data-style="py-0"
                                                                >
                                                                    <option value=''>-- খতিয়ানের নাম সিলেক্ট করুন --</option>
                                                                    <option value='01'>সিএস খতিয়ান</option>
                                                                    <option value='02'>এসএ খতিয়ান</option>
                                                                    <option value='03'>আরএস খতিয়ান</option>
                                                                    <option value='04'>বিআরএস খতিয়ান</option>
                                                                    <option value='05'>বিডিএস খতিয়ান</option>
                                                                    <option value='06'>দিয়ারা খতিয়ান</option>
                                                                    <option value='07'>পেটি খতিয়ান</option>
                                                                    <option value='08'>নামজারি খতিয়ান</option>
                                                                </Form.Select>
                                                                {validated && userDataError.inst_khatiyan_name && (
                                                                    <Form.Control.Feedback type="invalid">
                                                                        {userDataError.inst_khatiyan_name}
                                                                    </Form.Control.Feedback>
                                                                )}
                                                            </Form.Group>
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_mouza_number">মৌজার নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_mouza_number"
                                                                value={userData.inst_mouza_number}
                                                                isInvalid={validated && !!userDataError.inst_mouza_number}
                                                                isValid={validated && userData.inst_mouza_number && !userDataError.inst_mouza_number}
                                                                onChange={(e) => handleDataChange('inst_mouza_number', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_mouza_number && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_mouza_number}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={6}>
                                                            <Form.Label className="text-primary" htmlFor="inst_khatiyan_number">খতিয়ানের নম্বর</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_khatiyan_number"
                                                                value={userData.inst_khatiyan_number}
                                                                isInvalid={validated && !!userDataError.inst_khatiyan_number}
                                                                isValid={validated && userData.inst_khatiyan_number && !userDataError.inst_khatiyan_number}
                                                                onChange={(e) => handleDataChange('inst_khatiyan_number', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_khatiyan_number && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_khatiyan_number}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_land">জমির পরিমাণ (শতক)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_land"
                                                                value={userData.inst_land}
                                                                isInvalid={validated && !!userDataError.inst_land}
                                                                isValid={validated && userData.inst_land && !userDataError.inst_land}
                                                                onChange={(e) => handleDataChange('inst_land', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_land && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_land}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_ltax_year">পরিশোধিত খাজনার সন (সর্বশেষ)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                maxLength={4}
                                                                minLength={4}
                                                                id="inst_ltax_year"
                                                                value={userData.inst_ltax_year}
                                                                isInvalid={validated && !!userDataError.inst_ltax_year}
                                                                isValid={validated && userData.inst_ltax_year && !userDataError.inst_ltax_year}
                                                                onChange={(e) => handleDataChange('inst_ltax_year', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_ltax_year && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_ltax_year}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={4}>
                                                            <Form.Label className="text-primary" htmlFor="inst_ltax_num">খাজনার দাখিলা নম্বর (সর্বশেষ)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_ltax_num"
                                                                value={userData.inst_ltax_num}
                                                                isInvalid={validated && !!userDataError.inst_ltax_num}
                                                                isValid={validated && userData.inst_ltax_num && !userDataError.inst_ltax_num}
                                                                onChange={(e) => handleDataChange('inst_ltax_num', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_ltax_num && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_ltax_num}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>খতিয়ান ও দলিল সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.land_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.land_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, land_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('land_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.land_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.land_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('land_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.land_details && !userDataError.land_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.land_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.land_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>দাখিলা ও ভূমির প্রত্যয়ন সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.ltax_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.ltax_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, ltax_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('ltax_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.ltax_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.ltax_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('ltax_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.ltax_details && !userDataError.ltax_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.ltax_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.ltax_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        <Card.Header>
                                            <h5 className="text-center w-100 card-title">অন্যান্য তথ্য</h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Row>
                                                <Col md={12}>
                                                    <Row>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_distance">বিদ্যমান প্রতিষ্ঠানসূহের নিকটতম দূরত্ব (কিলোমিটার) (উপজেলা নির্বাহী কর্মকর্তা কর্তৃক প্রদত্ত প্রত্যয়ন অনুযায়ী)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_distance"
                                                                value={userData.inst_distance}
                                                                isInvalid={validated && !!userDataError.inst_distance}
                                                                isValid={validated && userData.inst_distance && !userDataError.inst_distance}
                                                                onChange={(e) => handleDataChange('inst_distance', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_distance && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_distance}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                        <Col className='my-2' md={12}>
                                                            <Form.Label className="text-primary" htmlFor="inst_population">প্রতিষ্ঠান এলাকার জনসংখ্যা (জেলা/উপজেলা পরিসংখ্যান কর্মকর্তা কর্তৃক প্রদত্ত প্রত্যয়ন অনুযায়ী)</Form.Label>
                                                            <Form.Control
                                                                className='bg-transparent text-uppercase'
                                                                type="text"
                                                                id="inst_population"
                                                                value={userData.inst_population}
                                                                isInvalid={validated && !!userDataError.inst_population}
                                                                isValid={validated && userData.inst_population && !userDataError.inst_population}
                                                                onChange={(e) => handleDataChange('inst_population', e.target.value)}
                                                            />
                                                            {validated && userDataError.inst_population && (
                                                                <Form.Control.Feedback type="invalid">
                                                                    {userDataError.inst_population}
                                                                </Form.Control.Feedback>
                                                            )}
                                                        </Col>
                                                    </Row>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>দূরত্বের সনদ সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.distance_cert && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.distance_cert}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, distance_cert: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('distance_cert')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.distance_cert}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.distance_cert && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('distance_cert', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.distance_cert && !userDataError.distance_cert &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.distance_cert &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.distance_cert}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>জনসংখ্যার সনদ সংযুক্তি</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.population_cert && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.population_cert}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, population_cert: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('population_cert')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.population_cert}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.population_cert && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('population_cert', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.population_cert && !userDataError.population_cert &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.population_cert &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.population_cert}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>অঙ্গীকারনামা (ফর্ম ক(৩))</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.declare_form && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.declare_form}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, declare_form: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('declare_form')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.declare_form}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.declare_form && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('declare_form', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.declare_form && !userDataError.declare_form &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.declare_form &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.declare_form}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                                <Col md={3}>
                                                    <Card className="m-0 p-0">
                                                        <Card.Header className="mb-0 p-0 pb-1">
                                                            <label className="text-primary w-100 text-center" htmlFor='profile_image'>স্থাপনের যৌক্তিকতার বিবরণ</label>
                                                        </Card.Header>
                                                        <Card.Body className="position-relative m-0 p-0 d-flex justify-content-center align-items-center">
                                                            {files.feasibility_details && (
                                                                <Document
                                                                    className="border p-2 rounded shadow"
                                                                    file={files.feasibility_details}
                                                                    onLoadSuccess={({ numPages }) => setFilesPages({
                                                                        ...filesPages, feasibility_details: numPages
                                                                    })}
                                                                    onClick={() => handleFileView('feasibility_details')}
                                                                >
                                                                    <Page
                                                                        pageNumber={1}
                                                                        width={75}
                                                                        renderTextLayer={false}   // ✅ disable text layer
                                                                        renderAnnotationLayer={false} // ✅ disable links/annotations
                                                                    />
                                                                    <p className='text-center'><i><small>মোট পাতাঃ {filesPages.feasibility_details}</small></i></p>
                                                                </Document>
                                                            )}
                                                            {!files.feasibility_details && <svg xmlns="http://www.w3.org/2000/svg" width="75px" height="75px" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text-icon lucide-file-text"><path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" /><path d="M14 2v4a2 2 0 0 0 2 2h4" /><path d="M10 9H8" /><path d="M16 13H8" /><path d="M16 17H8" /></svg>}
                                                            <div className="upload-icone bg-primary position-absolute top-100 start-50 translate-middle">
                                                                <svg className="upload-button" width="14" height="14" viewBox="0 0 24 24">
                                                                    <path fill="#ffffff" d="M14.06,9L15,9.94L5.92,19H5V18.08L14.06,9M17.66,3C17.41,3 17.15,3.1 16.96,3.29L15.13,5.12L18.88,8.87L20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18.17,3.09 17.92,3 17.66,3M14.06,6.19L3,17.25V21H6.75L17.81,9.94L14.06,6.19Z" />
                                                                </svg>
                                                                <input id='profile_image' className="form-control-file position-absolute top-100 start-50 translate-middle opacity-0" type="file" accept="application/pdf" onChange={(event) => handleFileSelect('feasibility_details', event.target.files[0])} />
                                                            </div>
                                                        </Card.Body>
                                                        <Card.Footer className="d-flex justify-content-center">
                                                            {!files.feasibility_details && !userDataError.feasibility_details &&
                                                                <p className='my-2 pt-2 text-center'>
                                                                    <small>
                                                                        <i>
                                                                            শুধুমাত্র <span className='text-primary'> পিডিএফ (.pdf)</span> ফাইল
                                                                        </i>
                                                                        <br />
                                                                        <i>
                                                                            সর্বোচ্চ <span className='text-primary'>১ (mb)</span> মেগাবাইট
                                                                        </i>
                                                                        <br />
                                                                    </small>
                                                                </p>
                                                            }
                                                            {userDataError.feasibility_details &&
                                                                <p className='text-center'>
                                                                    <small>
                                                                        <i className='text-danger'>
                                                                            {userDataError.feasibility_details}
                                                                        </i>
                                                                    </small>
                                                                </p>
                                                            }
                                                        </Card.Footer>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </Card.Body>
                                    </Card>
                                    <Card className="m-0 p-0 mb-3">
                                        {insertSuccess && <i className="text-uppercase text-center pt-4 text-success">{insertSuccess}</i>}
                                        {insertError && <i className="text-uppercase text-center pt-4 text-danger">{insertError}</i>}
                                        {insertLoading && <i className="text-uppercase text-center pt-4 text-primary">{insertLoading}</i>}
                                        {prevApplication && <i className="text-uppercase text-center pt-4 text-success">{prevApplication}<Link to="/institute/class-start/application"> লগইন</Link></i>}
                                        <Card.Body className="d-flex justify-content-center gap-3">
                                            <Button className='flex-fill' type="reset" variant="btn btn-danger">রিসেট</Button>
                                            <Button className='flex-fill' type="submit" variant="btn btn-primary">সাবমিট</Button>
                                        </Card.Body>
                                    </Card>
                                </Form>
                            </Col>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal
                show={modalError}
                onHide={() => setModalError(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title><span className={styles.SiyamRupaliFont}>প্রতিষ্ঠানের নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে</span></Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {Object.entries(userDataError).map(([field, error]) => (
                        <i className='text-danger' key={field}>{bnError[field]}, </i>
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setModalError(false)}>
                        ফিরে যান
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    )
}

export default InstClassStartNew;