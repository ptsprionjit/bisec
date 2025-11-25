import React from "react";
import { Accordion, Card, Row, Col } from "react-bootstrap";

import { FaServicestack } from "react-icons/fa";
import { FiUploadCloud } from "react-icons/fi";
import { BiArea } from "react-icons/bi";
import { TbUserPlus } from "react-icons/tb";
import { FaUserLock } from "react-icons/fa";
import { RiListCheck3 } from "react-icons/ri";
import { GrValidate } from "react-icons/gr";
import { BsDatabaseLock } from "react-icons/bs";
import { FaUserShield } from "react-icons/fa6";
import { GrShieldSecurity } from "react-icons/gr";
import { LiaShareAltSolid } from "react-icons/lia";
import { TbExchange } from "react-icons/tb";
import { MdOutlineSyncLock } from "react-icons/md";
import { MdOutlineCancel } from "react-icons/md";
import { GoLaw } from "react-icons/go";
import { MdOutlineContactMail } from "react-icons/md";

const TermsofService = () => {

    const cardHeaders = [
        { title: "ব্যবহারবিধি (Terms of Use)", icon: <FaServicestack color="darkblue" />, bg: "transparent", text: "primary", font: 'fs-5' },
        { title: "সর্বশেষ হালনাগাদঃ ০১ ডিসেম্বর, ২০২৫", icon: <FiUploadCloud color="darkgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "সেবার পরিধি", icon: <BiArea color="blue" />, bg: "transparent", text: "primary", font: 'fs-6' },
        { title: "ব্যবহারকারীর যোগ্যতা ও দায়িত্ব", icon: <TbUserPlus color="black" />, bg: "transparent", text: "dark", font: 'fs-6' },
        { title: "নিবন্ধন ও পরিচয় যাচাইকরণ", icon: <FaUserLock color="darkgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "গ্রহণযোগ্য ব্যবহার", icon: <RiListCheck3 color="darkblue" />, bg: "transparent", text: "primary", font: 'fs-6' },

        { title: "তথ্যের যথার্থতা ও ঘোষণাপত্র", icon: <GrValidate color="green" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "মেধাস্বত্ব", icon: <BsDatabaseLock color="darkcyan" />, bg: "transparent", text: "info", font: 'fs-6' },
        { title: "ব্যক্তিগত তথ্য ব্যবস্থাপনা ও গোপনীয়তা", icon: <FaUserShield color="darkorange" />, bg: "transparent", text: "warning", font: 'fs-6' },
        { title: "ডিজিটাল নিরাপত্তা", icon: <GrShieldSecurity color="darkgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
        { title: "তৃতীয় পক্ষের সেবা", icon: <LiaShareAltSolid color="black" />, bg: "transparent", text: "dark", font: 'fs-6' },
        { title: "সেবার পরিবর্তন", icon: <TbExchange color="darkblue" />, bg: "transparent", text: "secondary", font: 'fs-6' },
        { title: "সীমাবদ্ধতা ও দায়বদ্ধতা", icon: <MdOutlineSyncLock color="darkorange" />, bg: "transparent", text: "warning", font: 'fs-6' },
        { title: "সেবা স্থগিতকরণ ও বাতিল", icon: <MdOutlineCancel color="darkred" />, bg: "transparent", text: "danger", font: 'fs-6' },
        { title: "প্রযোজ্য আইন", icon: <GoLaw color="blue" />, bg: "transparent", text: "primary", font: 'fs-6' },
        { title: "যোগাযোগ", icon: <MdOutlineContactMail color="darkgreen" />, bg: "transparent", text: "success", font: 'fs-6' },
    ];

    return (
        <Card className="p-5 m-0 bg-white">
            <Card.Header className="bg-transparent text-center m-0 p-0 pt-2">
                <p className={`${cardHeaders[0].font} text-${cardHeaders[0].text} m-0 p-0`}>{cardHeaders[0].icon}</p>
                <p className={`${cardHeaders[0].font} text-${cardHeaders[0].text}`}>{cardHeaders[0].title}</p>
            </Card.Header>
            <Card.Body className="bg-transparent text-center m-0 p-0 pb-2">
                <span className={`text-${cardHeaders[1].text} ${cardHeaders[1].font}`}>{cardHeaders[1].icon} {cardHeaders[1].title}</span>
            </Card.Body>
            <Card.Footer className="bg-transparent p-0 m-0 pt-4">
                <Row className="justify-content-center">
                    <Col lg={12}>
                        <Card>
                            <Card.Body className="bg-transparent text-center m-0 p-2">
                                <p style={{ textAlign: 'justify', color: 'black' }}>মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা (“সেবা”) এর সরকারি ওয়েবসাইট, ওয়েব অ্যাপ্লিকেশন ও সংশ্লিষ্ট সকল অনলাইন সেবায় (“সেবা”) আপনাকে স্বাগতম। এই ব্যবহারবিধি (“ব্যবহারবিধি”) সেবার ব্যবহার সংক্রান্ত শর্ত ও বিধান নির্ধারণ করে। সেবা ব্যবহার করলে ধরে নেওয়া হবে যে আপনি এই ব্যবহারবিধি মেনে নিয়েছেন।</p>
                                <p style={{ textAlign: 'justify', color: 'darkred' }}>শর্তাবলীর সাথে অসম্মত হলে অনুগ্রহ করে সেবা ব্যবহার থেকে বিরত থাকুন।</p>
                            </Card.Body>
                        </Card>
                        <Accordion defaultActiveKey="0" flush>
                            {/* প্রস্তাবনা */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[2].bg} text-${cardHeaders[2].text} ${cardHeaders[2].font} p-2 rounded`} > {cardHeaders[2].icon} {cardHeaders[2].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>বোর্ডের অনলাইন সেবা পরীক্ষাসংক্রান্ত তথ্য, ফলাফল, শিক্ষাবিষয়ক রেকর্ড, প্রতিষ্ঠান সংক্রান্ত তথ্য, বিজ্ঞপ্তি, অনলাইন আবেদন ও যাচাইকরণসহ প্রশাসনিক ও শিক্ষাসংক্রান্ত ডিজিটাল সুবিধা প্রদান করে। রক্ষণাবেক্ষণ বা প্রযুক্তিগত কারণে সেবার প্রাপ্যতা সাময়িকভাবে ব্যাহত হতে পারে।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>সেবা ব্যবহারকারী সম্মত থাকেন যে তিনিঃ</p>
                                        <ul>
                                            <li>আইনগতভাবে সেবা ব্যবহারের যোগ্য;</li>
                                            <li>সেবার অপব্যবহার করবেন না;</li>
                                            <li>সংশ্লিষ্ট আইন, বিধিমালা, বোর্ডের নীতিমালা ও শিক্ষা মন্ত্রণালয়ের নির্দেশনা মেনে চলবেন।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>কোনো প্রতিষ্ঠান/সংস্থা সেবাটি ব্যবহার করলে ধরে নেওয়া হবে যে ব্যবহারকারী প্রতিষ্ঠানটির পক্ষ থেকে যথাযথভাবে অনুমোদিত।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>সেবার কিছু অংশ ব্যবহারের পূর্বে অ্যাকাউন্ট তৈরি বা পরিচয় যাচাইকরণ প্রয়োজন হতে পারে। ব্যবহারকারীকেঃ</p>
                                        <ul>
                                            <li>সঠিক ও আপডেটেড তথ্য প্রদান করতে হবে;</li>
                                            <li>ব্যবহারকারী নাম, পাসওয়ার্ড ও অন্যান্য পরিচয় তথ্য গোপন রাখতে হবে;</li>
                                            <li>কোনো অননুমোদিত প্রবেশচেষ্টা বা নিরাপত্তা ঝুঁকি দেখা দিলে তা অবিলম্বে জানাতে হবে।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>কোনো প্রতিষ্ঠান/সংস্থা সেবাটি ব্যবহার করলে ধরে নেওয়া হবে যে ব্যবহারকারী প্রতিষ্ঠানটির পক্ষ থেকে যথাযথভাবে অনুমোদিত।</p>
                                        <p style={{ textAlign: 'justify', color: 'darkred' }}>অস্বাভাবিক, সন্দেহজনক বা ক্ষতিকর কার্যক্রম শনাক্ত হলে বোর্ড প্রয়োজনীয় আইনগত ব্যবস্থা নিতে পারে।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>সেবাকে ঝুঁকির মুখে ফেলে এমন কোনো কর্মকাণ্ড সম্পূর্ণ নিষিদ্ধ। যেমনঃ</p>
                                        <ul>
                                            <li>তথ্য বা সিস্টেমে অননুমোদিত প্রবেশের চেষ্টা;</li>
                                            <li>ফলাফল, নম্বর, সার্টিফিকেট বা কোনো রকম শিক্ষাসংক্রান্ত তথ্য বিকৃতকরণ বা জালিয়াতি;</li>
                                            <li>ক্ষতিকর সফটওয়্যার, স্ক্রিপ্ট, বট বা স্বয়ংক্রিয় টুল ব্যবহার;</li>
                                            <li>ডেটা স্ক্র্যাপিং, বাল্ক ডাউনলোড বা কপি;</li>
                                            <li>বোর্ডের কর্মকর্তা/প্রতিষ্ঠান পরিচয় ভান (Impersonation);</li>
                                            <li>মিথ্যা তথ্য প্রচার বা বিভ্রান্তি সৃষ্টি।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'darkred' }}>এ ধরনের কর্মকাণ্ড আইনগত ব্যবস্থা, অ্যাকাউন্ট স্থগিতকরণ বা স্থায়ী বাতিলের কারণ হতে পারে।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>বোর্ড সঠিক ও হালনাগাদ তথ্য প্রদানে সচেষ্ট থাকে। তবেঃ</p>
                                        <ul>
                                            <li>ডিজিটাল তথ্য ত্রুটিমুক্ত হবে—এমন নিশ্চয়তা দেওয়া হয় না;</li>
                                            <li>কোনো অসঙ্গতি দেখা গেলে বোর্ডের প্রিন্টেড বা ডিজিটালি স্বাক্ষরিত অভ্যন্তরীণ নথিই চূড়ান্ত বলে গণ্য হবে;</li>
                                            <li>যেকোনো সময় তথ্য পরিবর্তন বা হালনাগাদ হতে পারে।</li>
                                        </ul>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>ব্যবহারকারীঃ</p>
                                        <ul>
                                            <li>অনুমতি ছাড়া কোনো উপাদান কপি, পুনঃপ্রকাশ, বিতরণ বা সংশোধন করতে পারবেন না;</li>
                                            <li>সিস্টেম রিভার্স-ইঞ্জিনিয়ারিং বা নিরাপত্তা ভঙ্গের চেষ্টা করতে পারবেন না;</li>
                                            <li>বোর্ডের লোগো বা প্রতীক অনুমতি ছাড়া ব্যবহার করতে পারবেন না।</li>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>ব্যবহারকারীর ব্যক্তিগত তথ্য বোর্ডের গোপনীয়তা নীতিমালা (Privacy Policy) অনুযায়ী সংগ্রহ, সংরক্ষণ ও প্রক্রিয়াকরণ করা হয়। বোর্ডঃ</p>
                                        <ul>
                                            <li>প্রয়োজনের বাইরে অতিরিক্ত তথ্য সংগ্রহ করে না;</li>
                                            <li>অনুমোদন ছাড়া তৃতীয় পক্ষের নিকট তথ্য প্রদান করে না;</li>
                                            <li>যুক্তিযুক্ত নিরাপত্তা ব্যবস্থা অনুসরণ করে তথ্য সুরক্ষা নিশ্চিত করে।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'darkorange' }}>সেবা ব্যবহার মানে আপনি গোপনীয়তা নীতিমালার প্রতি সম্মতি প্রদান করেছেন।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>বোর্ড ডিজিটাল নিরাপত্তা নিশ্চিত করতে উপযুক্ত এনক্রিপশন, সার্ভার নিরাপত্তা, নজরদারি, লগিং এবং মানসম্মত প্রযুক্তি ব্যবহার করে থাকে। তবেঃ</p>
                                        <ul>
                                            <li>ইন্টারনেট-ভিত্তিক সিস্টেম কখনো ১০০% নিরাপদ হতে নয়;</li>
                                            <li>ব্যবহারকারীর দায়িত্ব নিজস্ব ডিভাইস, নেটওয়ার্ক এবং লগইন তথ্য নিরাপদ রাখা।</li>
                                        </ul>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>সেবায় তৃতীয় পক্ষের (যেমন পেমেন্ট গেটওয়ে, আইডি যাচাইকরণ সেবা) লিঙ্ক বা ফিচার থাকতে পারে। বোর্ডঃ</p>
                                        <ul>
                                            <li>এসব প্ল্যাটফর্মের নিরাপত্তা, নীতি বা কার্যক্রমের জন্য দায়ী নয়;</li>
                                            <li>বাহ্যিক সেবা ব্যবহারের ফলে সৃষ্ট ক্ষতির জন্য দায় বহন করে না।</li>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>বোর্ড যেকোনো সময়ঃ</p>
                                        <ul>
                                            <li>নতুন ফিচার যোগ করতে পারে;</li>
                                            <li>বিদ্যমান সেবা সংশোধন করতে পারে;</li>
                                            <li>অথবা কোনো সেবা বন্ধ করতে পারে।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'darkred' }}>এ কারণে ব্যবহারকারীর কোনো ক্ষতি হলে বোর্ড দায়ী থাকবে না।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>আইন দ্বারা অনুমোদিত সীমার মধ্যে বোর্ডঃ</p>
                                        <ul>
                                            <li className="text-dark">সেবা ব্যবহার বা ব্যবহার করতে অক্ষমতা থেকে সৃষ্ট ক্ষতির জন্য দায়ী নয়;</li>
                                            <li className="text-black">তথ্য বিভ্রাট, ডাউনটাইম, সাইবার আক্রমণ, তৃতীয় পক্ষের ত্রুটি বা ব্যবহারকারীর অবহেলাজনিত ঘটনার জন্য দায় বহন করে না।</li>
                                        </ul>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>ব্যবহারকারী নিজ দায়িত্বে সেবা ব্যবহার করবেন।</p>
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
                                        <p style={{ textAlign: 'justify', color: 'black' }}>নিম্নোক্ত ক্ষেত্রে বোর্ড ব্যবহারকারীর সেবা সীমিত, স্থগিত বা বাতিল করতে পারে</p>
                                        <ul>
                                            <li className="text-black">শর্ত লঙ্ঘন;</li>
                                            <li className="text-black">প্রতারণা বা জালিয়াতির অভিযোগ;</li>
                                            <li className="text-black">নিরাপত্তা ঝুঁকি;</li>
                                            <li className="text-black">সরকারি নির্দেশনা বা আইনগত বাধ্যবাধকতা।</li>
                                        </ul>
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
                                        <ul>
                                            <li>এই ব্যবহারবিধি বাংলাদেশের বিদ্যমান আইন দ্বারা পরিচালিত ও নিয়ন্ত্রিত হবে।</li>
                                            <li>ব্যবহারবিধি বা সেবার কারণে সৃষ্ট যেকোনো বিরোধের জন্য বাংলাদেশে অবস্থিত আদালতই একমাত্র এখতিয়ারভুক্ত থাকবে।</li>
                                        </ul>
                                    </Accordion.Body>
                                </Accordion.Item>
                            </Card>

                            { /* যোগাযোগ */}
                            <Card className="mb-3 shadow-sm">
                                <Accordion.Item eventKey="14">
                                    <Accordion.Header>
                                        <span className={`badge bg-${cardHeaders[15].bg} text-${cardHeaders[15].text} ${cardHeaders[15].font} p-2 rounded`} > {cardHeaders[15].icon} {cardHeaders[15].title}</span>
                                    </Accordion.Header>
                                    <Accordion.Body>
                                        <p style={{ textAlign: 'justify', color: 'black' }}>সহায়তা বা অভিযোগ সংক্রান্ত বিষয়ে যোগাযোগ করুনঃ</p>
                                        <ul>
                                            <li className="text-black">ঠিকানাঃ মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, কুমিল্লা, লাকসাম রোড, কান্দিরপাড়, কুমিল্লা।</li>
                                            <li className="text-black">ফোনঃ <a className="text-black" href="tel:+880234406328">+৮৮০-২৩৪৪-০৬৩২৮</a></li>
                                            <li className="text-black">ইমেইলঃ <a className="text-black" href="mailto:admin@cumillaboard.gov.bd">admin@cumillaboard.gov.bd</a></li>
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

export default TermsofService;
