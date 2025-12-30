import React from "react";
import { Link } from 'react-router-dom'

import { Accordion, Card, Row, Col, Button } from "react-bootstrap";

import { FcPrivacy } from "react-icons/fc";
import { FiUploadCloud } from "react-icons/fi";
import { GoLaw } from "react-icons/go";
import { AiOutlineNodeIndex } from "react-icons/ai";
import { ImInfo } from "react-icons/im";
import { FaRegCirclePlay } from "react-icons/fa6";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { TbDeviceImacQuestion } from "react-icons/tb";
import { MdOutlineDatasetLinked } from "react-icons/md";
import { GoShareAndroid } from "react-icons/go";
import { IoStorefrontOutline } from "react-icons/io5";
import { MdPublishedWithChanges } from "react-icons/md";
import { MdOutlineSecurity } from "react-icons/md";
import { TbExchange } from "react-icons/tb";
import { MdOutlineContactMail } from "react-icons/md";

const PrivacyPolicy = () => {

    const ceb_session = JSON.parse(window.localStorage.getItem("ceb_session"));

    const cardHeaders = [
        { title: "গোপনীয়তা নীতিমালা (Privacy Policy)", icon: <GoLaw color="darkred" />, bg: "transparent", text: "primary", font: 'fs-4' },
        { title: "সর্বশেষ হালনাগাদঃ ০১ ডিসেম্বর, ২০২৫", icon: <FiUploadCloud color="green" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "প্রস্তাবনা", icon: <AiOutlineNodeIndex color="blue" />, bg: "transparent", text: "primary", font: 'fs-6' },
        { title: "শিরোনাম", icon: <ImInfo color="darkblue" />, bg: "transparent", text: "secondary", font: 'fs-6' },
        { title: "নীতিমালার প্রয়োগ", icon: <FaRegCirclePlay color="darkgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "সংজ্ঞা", icon: <FcPrivacy color="red" />, bg: "transparent", text: "warning", font: 'fs-6' },

        { title: "তথ্য সংগ্রহ", icon: <MdFormatListBulletedAdd color="darkblue" />, bg: "transparent", text: "primary", font: 'fs-6' },
        { title: "তথ্য সংগ্রহের উদ্দেশ্য", icon: <TbDeviceImacQuestion color="darkyellow" />, bg: "transparent", text: "info", font: 'fs-6' },
        { title: "তথ্য প্রক্রিয়করণ", icon: <MdOutlineDatasetLinked color="seagreen" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "তথ্য আদান/প্রদান", icon: <GoShareAndroid color="darkred" />, bg: "transparent", text: "danger", font: 'fs-6' },
        { title: "তথ্য সংরক্ষণ", icon: <IoStorefrontOutline color="green" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "তথ্য প্রকাশ", icon: <MdPublishedWithChanges color="darkorange" />, bg: "transparent", text: "warning", font: 'fs-6' },
        { title: "নিরাপত্তা ও গোপনীয়তা", icon: <MdOutlineSecurity color="red" />, bg: "transparent", text: "danger", font: 'fs-6' },
        { title: "নীতিমালা পরিবর্তন/সংশোধন", icon: <TbExchange color="blue" />, bg: "transparent", text: "primary", font: 'fs-6' },
        { title: "যোগাযোগ", icon: <MdOutlineContactMail color="yellowgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
    ];

    return (
        <Card className="p-5 m-0">
            <Card.Header className="bg-transparent text-center m-0 p-0 pt-2">
                <p className={`${cardHeaders[0].font} text-${cardHeaders[0].text} m-0 p-0`}>{cardHeaders[0].icon}</p>
                <p className={`${cardHeaders[0].font} text-${cardHeaders[0].text} m-0 p-0`}>{cardHeaders[0].title}</p>
            </Card.Header>
            <Card.Body className="bg-transparent text-center m-0 p-0 pb-2">
                <p className={`text-${cardHeaders[1].text} ${cardHeaders[1].font}`}>{cardHeaders[1].icon} {cardHeaders[1].title}</p>
                {!ceb_session?.ceb_user_id && <Link className="text-danger m-0 p-0" to={"/"}>বোর্ড হোম</Link>}
            </Card.Body>
            <Card.Footer className="bg-transparent p-0 m-0 pt-4">
                <Row className="justify-content-center">
                    <Col lg={12}>
                        <Accordion defaultActiveKey="0" flush>
                            {/* প্রস্তাবনা */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[2].bg} text-${cardHeaders[2].text} ${cardHeaders[2].font} p-2 rounded`} > {cardHeaders[2].icon} {cardHeaders[2].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'blue' }}>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা এর অনলাইন সেবার স্বচ্ছ ও জবাবদিহিমূলক ব্যবহার ও আইনি ভিত্তি নিশ্চিত করার জন্য তথ্য সংগ্রহ, ব্যবহার এবং প্রকাশ সম্পর্কে বোর্ডের নীতি ও পদ্ধতির সুনির্দিষ্ট নির্দেশনার জন্য এই গোপনীয়তা নীতি প্রণীত হয়েছে।</p>
                                        <p style={{ textAlign: 'justify', color: 'darkgreen' }}>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা এর যে কোন অনলাইন সেবা ব্যবহার করার মাধ্যমে সেবাগ্রহীতা এই নীতির সাথে সম্মতি দিচ্ছেন।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            {/* শিরোনাম */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="1">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[3].bg} text-${cardHeaders[3].text} ${cardHeaders[3].font} p-2 rounded`} > {cardHeaders[3].icon} {cardHeaders[3].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <span style={{ textAlign: 'justify', color: 'darkblue' }}>এই নীতিমালা <strong>“গোপনীয়তা নীতিমালা, মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা”</strong> নামে অভিহিত হবে।</span>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* নীতিমালার প্রয়োগ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="2">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[4].bg} text-${cardHeaders[4].text} ${cardHeaders[4].font} p-2 rounded`} > {cardHeaders[4].icon} {cardHeaders[4].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>এই নীতিমালা মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা এর আওতাধীন অনলাইন সেবার জন্য প্রযোজ্য হবে।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            {/* সংজ্ঞা */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="3">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[5].bg} text-${cardHeaders[5].text} ${cardHeaders[5].font} p-2 rounded`} > {cardHeaders[5].icon} {cardHeaders[5].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li><strong>সরকারঃ </strong>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার -কে বুঝাবে।</li>
                                            <li><strong>বোর্ডঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -কে বুঝাবে।</li>
                                            <li><strong>আমরা/আমাদেরঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -কে বুঝাবে।</li>
                                            <li><strong>চেয়ারম্যানঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর মাননীয় চেয়ারম্যান মহোদয়কে বুঝাবে।</li>
                                            <li><strong>সচিবঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর মাননীয় সচিব মহোদয়কে বুঝাবে।</li>
                                            <li><strong>কর্মকর্তা/কর্মচারী </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর কর্মরত কর্মকর্তা/কর্মচারী বুঝাবে।</li>
                                            <li><strong>ইউজার/ব্যবহারকারীঃ </strong>যে কোন ব্যক্তি বা প্রতিষ্ঠান যারা মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা এর অনলাইন সেবা ব্যবহারকারীকে বুঝাবে।</li>
                                            <li><strong>অ্যাপ্লিকেশনঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর সফটওয়্যার প্রোগ্রামকে বুঝাবে।</li>
                                            <li><strong>সেবাঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর আওতাধীন সেবা বুঝাবে।</li>
                                            <li><strong>সেবা প্রদানকারীঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর পক্ষে তথ্য প্রক্রিয়াজাতকরণকারী ব্যক্তি/শাখাকে বুঝাবে।</li>
                                            <li><strong>ওয়েবসাইটঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা -এর ওয়েবসাইটঃ <a href="https://www.cumillaboard.gov.bd/">www.cumillaboard.gov.bd</a> বুঝাবে।</li>
                                            <li><strong>দেশঃ </strong>বাংলাদেশ বুঝাবে।</li>
                                            <li><strong>ঠিকানাঃ </strong>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা - এর ঠিকানাঃ লাকসাম রোড, কান্দিরপাড়, কুমিল্লা -কে বুঝাবে।</li>
                                            <li><strong>ডিভাইসঃ </strong>যেকোনো ইলেক্ট্রনিক্স ডিভাইস—যেমন কম্পিউটার, মোবাইল বা ট্যাবলেট—যার মাধ্যমে অনলাইন সেবা ব্যবহার করতে পারে।</li>
                                            <li><strong>সেশন/কুকিঃ </strong>ব্যবহারকারীর ডিভাইসে রাখা ছোট ফাইল, যা ব্যবহারকারীর ব্রাউজিং–সম্পর্কিত তথ্য সংরক্ষণ করে</li>
                                            <li><strong>ব্যক্তিগত তথ্যঃ </strong>এমন যেকোনো তথ্য যা কোনো ব্যক্তিকে শনাক্ত করতে পারে বা করার যোগ্য।</li>
                                            <li><strong>প্রাতিষ্ঠানিক তথ্যঃ </strong>এমন যেকোনো তথ্য যা কোনো প্রতিষ্ঠানকে শনাক্ত করতে পারে বা করার যোগ্য।</li>
                                            <li><strong>অনলাইনঃ </strong>ইন্টারনেট ভিত্তিক যোগাযোগ ব্যবস্থা বুঝাবে।</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য সংগ্রহ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="4">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[6].bg} text-${cardHeaders[6].text} ${cardHeaders[6].font} p-2 rounded`} > {cardHeaders[6].icon} {cardHeaders[6].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>বোর্ড সেবা প্রদানের জন্য অনলাইনের মাধ্যমে নিম্নলিখিত তথ্যাবলি সংগ্রহ করেঃ</p>
                                        <ul>
                                            <li>
                                                <span className="text-primary">ব্যক্তিগত তথ্যঃ </span>
                                                <ul>
                                                    <li>নাম</li>
                                                    <li>পিতার নাম</li>
                                                    <li>মাতার নাম</li>
                                                    <li>জন্ম তারিখ</li>
                                                    <li>জন্ম নিবন্ধন নম্বর</li>
                                                    <li>জাতীয় পরিচয়পত্র নম্বর</li>
                                                    <li>মোবাইল নম্বর</li>
                                                    <li>ইমেইল ঠিকানা</li>
                                                    <li>স্থায়ী ঠিকানা</li>
                                                    <li>বর্তমান ঠিকানা</li>
                                                    <li>অন্যান্য তথ্য</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span className="text-success">প্রাতিষ্ঠানিক তথ্যঃ </span>
                                                <ul>
                                                    <li>প্রতিষ্ঠানের নাম</li>
                                                    <li>প্রতিষ্ঠানের কোড/ইআইআইএন</li>
                                                    <li>প্রতিষ্ঠানের ঠিকানা</li>
                                                    <li>প্রতিষ্ঠানের মোবাইল</li>
                                                    <li>প্রতিষ্ঠানের ইমেইল</li>
                                                    <li>প্রতিষ্ঠানের কমিটির সদস্যদের নাম ও যোগাযোগের তথ্য</li>
                                                    <li>প্রতিষ্ঠানের ধরন, মাধ্যম, পর্যায় এর তথ্য</li>
                                                    <li>অন্যান্য তথ্য</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span className="text-danger">অর্থনৈতিক তথ্যঃ </span>
                                                <ul>
                                                    <li>ব্যাংক অ্যাকাউন্ট নম্বর</li>
                                                    <li>ব্যাংক শাখার নাম ও নম্বর</li>
                                                    <li>অন্যান্য অর্থনৈতিক তথ্য</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <span className="text-info">প্রযুক্তিগত তথ্যঃ </span>
                                                <ul>
                                                    <li>ডিভাইস সম্পর্কিত তথ্য</li>
                                                    <li>ব্রাউজার সম্পর্কিত তথ্য</li>
                                                    <li>লোকেশন তথ্য</li>
                                                    <li>সেশন/কুকি তথ্য</li>
                                                    <li>অন্যান্য প্রাসঙ্গিক তথ্য</li>
                                                </ul>
                                            </li>
                                        </ul>
                                        <i className="text-secondary"><strong>প্রযুক্তিগত তথ্য</strong> ব্যবহারকারীর অনুমতির প্রেক্ষিতে সংগ্রহ করা হয়। ব্যবহারকারী যেকোনো সময় তাদের অনুমতি প্রত্যাহার করতে পারেন। তবে উক্ত তথ্য প্রদান না করলে সেবার কিছু অংশ সীমিত হতে পারে।</i>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য সংগ্রহের উদ্দেশ্য */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="5">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[7].bg} text-${cardHeaders[7].text} ${cardHeaders[7].font} p-2 rounded`} > {cardHeaders[7].icon} {cardHeaders[7].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li>সেবা প্রদান ও রক্ষণাবেক্ষণে</li>
                                            <li>ইউজার/ব্যবহারকারীর একাউন্ট তৈরি ও যাচাই করতে</li>
                                            <li>বেতন/ভাতা বা অন্যান্য আর্থিক লেনদেন পরিচালনা করতে</li>
                                            <li>ব্যবহারকারীর অনুরোধ পরিচালনা করতে</li>
                                            <li>নোটিফিকেশন, আপডেট ও গুরুত্বপূর্ণ বার্তা পাঠাতে</li>
                                            <li>সমস্যা শনাক্ত ও নিরাপত্তা জোরদার করতে</li>
                                            <li>সেবার কার্যকারিতা বিশ্লেষণ ও উন্নত করতে</li>
                                            <li>আইনগত বাধ্যবাধকতা পূরণ করতে</li>
                                            <li>প্রতারণা, নিরাপত্তা হুমকি বা অপব্যবহার প্রতিরোধে</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য প্রক্রিয়করণ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="6">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[8].bg} text-${cardHeaders[8].text} ${cardHeaders[8].font} p-2 rounded`} > {cardHeaders[8].icon} {cardHeaders[8].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>সংগ্রহকৃত তথ্য শুধুমাত্র নির্ধারিত উদ্দেশ্যে (নিবন্ধন প্রদান, পরীক্ষা গ্রহণ ও মূল্যায়ন, ফলাফল প্রদান, সনদ প্রদান, ইত্যাদি) এবং প্রযোজ্য আইন অনুযায়ী প্রক্রিয়াকরণ করা হয়। শুধুমাত্র চেয়ারম্যান, ‍সচিব, অনুমোদিত কর্মকর্তা/কর্মচারীগণ এই তথ্য প্রক্রিয়াকরণ করতে পারেন।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য আদান/প্রদান */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="7">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[9].bg} text-${cardHeaders[9].text} ${cardHeaders[9].font} p-2 rounded`} > {cardHeaders[9].icon} {cardHeaders[9].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>সংগ্রহকৃত তথ্য শুধুমাত্র নির্ধারিত উদ্দেশ্যে এবং প্রযোজ্য আইন অনুযায়ী সরকারি/আধা সরকারি/স্বায়ত্বশাসিত প্রতিষ্ঠানের সাথে আদান/প্রদান করা হয়। তথ্য প্রদানের ক্ষেত্রে শুধুমাত্র সংক্ষেপিত সাধারন তথ্যাবলি প্রদান করা হয়।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য সংরক্ষণ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="8">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[10].bg} text-${cardHeaders[10].text} ${cardHeaders[10].font} p-2 rounded`} > {cardHeaders[10].icon} {cardHeaders[10].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <ul>
                                            <li>
                                                <strong>ব্যক্তিগত তথ্যঃ </strong>
                                                <ul>
                                                    <li>সেবা প্রদান ও রক্ষণাবেক্ষণের জন্য সব সময়ের জন্য সংরক্ষণ করা হবে।</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>প্রাতিষ্ঠানিক তথ্যঃ </strong>
                                                <ul>
                                                    <li>সেবা প্রদান ও রক্ষণাবেক্ষণের জন্য সব সময়ের জন্য সংরক্ষণ করা হবে।</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>অর্থনৈতিক তথ্যঃ </strong>
                                                <ul>
                                                    <li>সেবা প্রদান ও রক্ষণাবেক্ষণের জন্য সব সময়ের জন্য সংরক্ষণ করা হবে।</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>ইউজার/ব্যবহারকারীর তথ্যঃ </strong>
                                                <ul>
                                                    <li>সেবা প্রদান ও রক্ষণাবেক্ষণের জন্য সব সময়ের জন্য সংরক্ষণ করা হবে।</li>
                                                </ul>
                                            </li>
                                            <li>
                                                <strong>অন্যান্য তথ্যঃ </strong>
                                                <ul>
                                                    <li>সাধারণত কম সময়, তবে নিরাপত্তা/বিশ্লেষণের ক্ষেত্রে দীর্ঘ হতে পারে</li>
                                                    <strong>আইনগত বাধ্যবাধকতার ক্ষেত্রেঃ </strong>
                                                    <ul>
                                                        <li>নির্দিষ্ট সময় পর্যন্ত সংরক্ষণ প্রয়োজন হতে পারে</li>
                                                    </ul>
                                                </ul>
                                            </li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* তথ্য প্রকাশ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="10">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[11].bg} text-${cardHeaders[11].text} ${cardHeaders[11].font} p-2 rounded`} > {cardHeaders[11].icon} {cardHeaders[11].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>সংগ্রহকৃত তথ্যের ভিত্তিতে প্রতিবেদন, ফলাফল, আদেশ, সিদ্ধান্ত, ইত্যাদি বোর্ডের ওয়েবসাইটে প্রকাশ করা হয়।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* নিরাপত্তা ও গোপনীয়তা */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="11">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[12].bg} text-${cardHeaders[12].text} ${cardHeaders[12].font} p-2 rounded`} > {cardHeaders[12].icon} {cardHeaders[12].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>নিরাপত্তা ও গোপনীয়তা নিশ্চিত করার জন্য বিভিন্ন প্রযুক্তিগত ও প্রশাসনিক ব্যবস্থা গ্রহণ করা হয়। উল্লেখযোগ্য কিছু ব্যবস্থা হলোঃ</p>
                                        <ul>
                                            <li className="text-warning">ডেটা এনক্রিপশন</li>
                                            <li className="text-primary">ফায়ারওয়াল এবং সুরক্ষিত সার্ভার</li>
                                            <li className="text-success">নিয়মিত নিরাপত্তা অডিট এবং মনিটরিং</li>
                                            <li className="text-danger">কর্মকর্তা/কর্মচারীদের জন্য গোপনীয়তা প্রশিক্ষণ</li>
                                            <li className="text-secondary">অ্যাক্সেস কন্ট্রোল এবং অনুমোদন প্রক্রিয়া</li>
                                        </ul>
                                        <i className="text-danger">ইন্টারনেট-ভিত্তিক সিস্টেম কখনো ১০০% নিরাপদ হতে নয়।</i>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* নীতিমালা পরিবর্তন/সংশোধন */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="12">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[13].bg} text-${cardHeaders[13].text} ${cardHeaders[13].font} p-2 rounded`} > {cardHeaders[13].icon} {cardHeaders[13].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>এই নীতিমালার আংশিক বা সম্পূর্ণ অংশ বোর্ড কর্তৃপক্ষের অনুমোদন সাপেক্ষে পরিবর্তন/পরিবর্ধন/সংশোধন/সংযোজন/বাতিল করা হতে পারে। ওয়েবসাইটে সংশোধিত নীতিমালা প্রকাশের মাধ্যমে তা কার্যকর হবে, যা প্রযোজনে ব্যবহারকারীদের নোটিশ/ইমেইলের মাধ্যমে অবহিত করা হবে।</p>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* যোগাযোগ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="13">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[14].bg} text-${cardHeaders[14].text} ${cardHeaders[14].font} p-2 rounded`} > {cardHeaders[14].icon} {cardHeaders[14].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'darkblue' }}>যে কোন প্রয়োজনে বোর্ডের ঠিকানায় যোগাযোগ করা যেতে পারে। এছাড়া ইমেইল বা ফোনের মাধ্যমে যোগাযোগ করা যেতে পারে।</p>
                                        <ul>
                                            <li className="text-success">ঠিকানাঃ মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা, লাকসাম রোড, কান্দিরপাড়, কুমিল্লা।</li>
                                            <li className="text-primary">ফোনঃ <a className="text-primary" href="tel:+880234406328">+৮৮০-২৩৪৪-০৬৩২৮</a></li>
                                            <li className="text-danger">ইমেইলঃ <a className="text-danger" href="mailto:admin@cumillaboard.gov.bd">admin@cumillaboard.gov.bd</a></li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                        </Accordion>
                    </Col>
                </Row>
            </Card.Footer>
        </Card>
    );
};

export default PrivacyPolicy;
