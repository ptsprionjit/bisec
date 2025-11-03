// /mnt/data/institute.jsx
import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Row, Col, Dropdown, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { differenceInDays } from "date-fns";

// components
import Circularprogressbar from "../../components/circularprogressbar";
import Progress from "../../components/progress";

// libs
import AOS from "aos";
import "aos/dist/aos.css";
import Chart from "react-apexcharts";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";
import "swiper/swiper-bundle.min.css";
import CountUp from "react-countup";

// redux selector
import { useSelector } from "react-redux";
import * as SettingSelector from "../../store/setting/selectors";

// local
import styles from '../../assets/custom/css/bisec.module.css';
import * as InputValidation from './input_validation.js';

SwiperCore.use([Navigation]);

// Set axios defaults once
axios.defaults.withCredentials = true;

const IndexInstitute = React.memo(() => {
  const navigate = useNavigate();
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const ceb_session = useMemo(() => {
    try { return JSON.parse(window.localStorage.getItem("ceb_session")); } catch { return null; }
  }, []);
  const storedDash = useMemo(() => {
    try { return JSON.parse(window.localStorage.getItem("dash_data")); } catch { return null; }
  }, []);

  /* State */
  const [regData, setRegData] = useState({});
  const [exmData, setExmData] = useState({});
  const [dateData, setDateData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);
  const [filesMap, setFilesMap] = useState({}); // { file_notice: File | null }
  const [profileData, setProfileData] = useState({});
  const [loadingData, setLoadingData] = useState(true);

  const [chart1, setChart1] = useState({ options: {}, series: [] });
  const [chart2, setChart2] = useState({ options: {}, series: [] });
  const [chart3, setChart3] = useState({ options: {}, series: [] });

  const [chartData1, setChartData1] = useState('01'); // registered students vs examinees
  const [chartData2, setChartData2] = useState('01'); // breakdown type
  const [chartData3, setChartData3] = useState(() => new Date().getFullYear());

  // minor derived date used in original
  const curDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getUTCHours() + 12);
    return d;
  }, []);

  // access theme selector to keep behaviour consistent (this prevents unused-lint)
  useSelector(SettingSelector.theme_color);

  /* Guard & redirect early */
  useEffect(() => {
    if (!ceb_session?.ceb_user_id) {
      navigate("/auth/sign-out");
      return;
    }
    if (ceb_session?.ceb_user_id && ceb_session?.ceb_user_type !== "13" && ceb_session?.ceb_user_role !== "17") {
      navigate("/dashboard");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  /* Get CSS variable colors once */
  const variableColors = useMemo(() => {
    const defaultPrefix = "bs-";
    const prefixRaw = getComputedStyle(document.body).getPropertyValue("--prefix") || defaultPrefix;
    const prefix = prefixRaw.trim() || defaultPrefix;
    const _get = (name) => (getComputedStyle(document.body).getPropertyValue(`--${prefix}${name}`) || "").trim();
    return {
      primary: _get("primary") || "#3a57e8",
      info: _get("info") || "#4bc7d2",
      warning: _get("warning") || "#ffc107",
      primary_light: _get("primary-tint-20") || "#dbe7ff",
    };
  }, []);

  const colors = useMemo(() => [variableColors.primary, variableColors.info], [variableColors]);

  /* AOS init once */
  useEffect(() => {
    AOS.init({
      startEvent: "DOMContentLoaded",
      disable: () => window.innerWidth < 996,
      throttleDelay: 10,
      once: true,
      duration: 700,
      offset: 10,
    });
  }, []);

  /* Utility: Build aggregated reg/exm object from API shape
     The original code created keys like <field>QQ<valueLower>. We'll replicate that aggregation
     in a single pass to avoid repeated loops.
  */
  const aggregateCounts = useCallback((rows) => {
    const out = { active_total: 0 };
    // rows expected: object where each key -> rowData, and rowData is object of fields with st_total, st_session etc.
    // original logic: two passes: init keys to 0 then sum them. We'll safe-guard and do one pass.
    for (const [, rowData] of Object.entries(rows || {})) {
      for (const [fieldName, value] of Object.entries(rowData || {})) {
        const suffix = String(value).toLocaleLowerCase();
        const key = `${fieldName}QQ${suffix}`;
        if (out[key] == null) out[key] = 0;
        const total = Number(rowData.st_total || 0);
        out[key] += total;
        if (fieldName === 'st_session') {
          out.active_total = (out.active_total || 0) + total;
        }
      }
    }
    return out;
  }, []);

  /* File fetch: fetch blobs and convert to File objects, store a map */
  const fetchFiles = useCallback(async (noticeList) => {
    if (!Array.isArray(noticeList)) {
      setFilesMap({});
      return;
    }
    const results = await Promise.all(
      noticeList.map(async (item) => {
        try {
          const res = await axios.post(
            `${BACKEND_URL}/board/notice/fetch_files`,
            { id_notice: item.id_notice, file_notice: item.file_notice },
            { responseType: 'blob' }
          );
          if (res.status === 200) {
            const file = new File([res.data], `${item.file_notice}.pdf`, { type: 'application/pdf' });
            return [item.file_notice, file];
          }
        } catch (err) {
          if (err?.status === 401) navigate("/auth/sign-out");
        }
        return [item.file_notice, null];
      })
    );
    const map = Object.fromEntries(results);
    setFilesMap(map);
  }, [BACKEND_URL, navigate]);

  /* API: fetch profile */
  const fetchProfileData = useCallback(async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/user/details`);
      if (res?.status === 200) setProfileData(res.data.data || {});
    } catch (err) {
      if (err?.status === 401) navigate("/auth/sign-out");
    }
  }, [BACKEND_URL, navigate]);

  /* API: fetch dashboard data and aggregate */
  const getDataFromBackend = useCallback(async () => {
    try {
      const res = await axios.post(`${BACKEND_URL}/dashboard/institute`, {});
      if (res?.status === 200) {
        const response = res.data || {};
        const reg = aggregateCounts(response.activeRegResult || {});
        const exm = aggregateCounts(response.activeExmResult || {});
        setRegData(reg);
        setExmData(exm);
        setDateData(response.dateResult || []);
        setNoticeData(response.noticeResult || []);
        // fetch files for notices
        await fetchFiles(response.noticeResult || []);
        // persist for future loads
        try {
          window.localStorage.setItem("dash_data", JSON.stringify({
            regData: reg, exmData: exm, dateData: response.dateResult || [], noticeData: response.noticeResult || []
          }));
        } catch (e) { /* ignore localStorage write errors */ }
        // build initial charts after setting
        return true;
      }
    } catch (err) {
      if (err?.status === 401) navigate("/auth/sign-out");
      if (err?.status === 403) {
        navigate("/auth/sign-out");
      }
    } finally {
      setLoadingData(false);
    }
    return false;
  }, [BACKEND_URL, aggregateCounts, fetchFiles, navigate]);

  /* Build charts (memoized / only runs when dependencies change) */
  const buildCharts = useCallback(() => {
    // ---------- chart1 (area) ----------
    // dataValue1 & dataTitle1 depend on chartData1
    let dataValue1 = [], dataTitle1 = [];
    if (chartData1 === '01') {
      const st6 = regData.st_classQQ06 || 0;
      const st7 = regData.st_classQQ07 || 0;
      const st8 = regData.st_classQQ08 || 0;
      const st9 = regData.st_classQQ09 || 0;
      const st10 = regData.st_classQQ10 || 0;
      const st11 = regData.st_classQQ11 || 0;
      const st12 = regData.st_classQQ12 || 0;
      dataValue1 = [st6, st7, st8, st9, st10, st11, st12];
      dataTitle1 = ["VI (06)", "VII (07)", "VIII (08)", "IX (09)", "X (10)", "XI (11)", "XII (12)"];
    } else {
      const jsc = exmData.id_examQQ03 || 0;
      const ssc = exmData.id_examQQ05 || 0;
      const hsc = exmData.id_examQQ07 || 0;
      dataValue1 = [jsc, ssc, hsc];
      dataTitle1 = ["JSC", "SSC", "HSC"];
    }

    setChart1({
      options: {
        chart: { fontFamily: '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"', toolbar: { show: true }, sparkline: { enabled: false } },
        colors,
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 3 },
        yaxis: {
          show: true,
          labels: { show: true, minWidth: 50, maxWidth: 50, style: { colors: "#8A92A6" }, offsetX: -5 },
        },
        legend: { show: false },
        xaxis: {
          labels: { minHeight: 22, maxHeight: 22, show: true, style: { colors: "#8A92A6" } },
          lines: { show: false },
          categories: dataTitle1,
        },
        grid: { show: false },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark", type: "vertical", shadeIntensity: 0, inverseColors: true, opacityFrom: 0.4, opacityTo: 0.1, stops: [0, 50, 80], colors,
          },
        },
        tooltip: { enabled: true },
      },
      series: [{ name: "নিবন্ধিত", data: dataValue1 }],
    });

    // ---------- chart2 (radialBar) ----------
    let dataValue2 = [], dataTitle2 = [];
    const safe = (v) => Number(v || 0);
    switch (chartData2) {
      case '01': {
        const male = safe(regData.id_genderQQ01);
        const female = safe(regData.id_genderQQ02);
        const total = (male + female) || 1;
        dataValue2 = [Math.ceil(male / total * 100), Math.ceil(female / total * 100)];
        dataTitle2 = ["ছাত্র", "ছাত্রী"];
        break;
      }
      case '02': {
        const a = safe(regData.id_religionQQ01), b = safe(regData.id_religionQQ02), c = safe(regData.id_religionQQ03), d = safe(regData.id_religionQQ04);
        const total = (a + b + c + d) || 1;
        dataValue2 = [Math.ceil(a / total * 100), Math.ceil(b / total * 100), Math.ceil(c / total * 100), Math.ceil(d / total * 100)];
        dataTitle2 = ["ইসলাম", "সনাতন", "বুদ্ধ", "খ্রিষ্টান"];
        break;
      }
      case '03': {
        const g10 = safe(regData.id_groupQQ10), g1 = safe(regData.id_groupQQ01), g2 = safe(regData.id_groupQQ02), g3 = safe(regData.id_groupQQ03);
        const total = (g10 + g1 + g2 + g3) || 1;
        dataValue2 = [Math.ceil(g10 / total * 100), Math.ceil(g1 / total * 100), Math.ceil(g2 / total * 100), Math.ceil(g3 / total * 100)];
        dataTitle2 = ["সাধারণ", "বিজ্ঞান", "মানবিক", "ব্যবসায় শিক্ষা"];
        break;
      }
      case '04': {
        const v1 = safe(regData.id_versionQQ01), v2 = safe(regData.id_versionQQ02);
        const total = (v1 + v2) || 1;
        dataValue2 = [Math.ceil(v1 / total * 100), Math.ceil(v2 / total * 100)];
        dataTitle2 = ["বাংলা", "ইংরেজি"];
        break;
      }
      default: {
        const val1 = safe(regData.id_genderQQ01), val2 = safe(regData.id_genderQQ02);
        const total = (val1 + val2) || 1;
        dataValue2 = [Math.ceil(val1 / total * 100), Math.ceil(val2 / total * 100)];
        dataTitle2 = ["ছাত্র", "ছাত্রী"];
      }
    }

    setChart2({
      options: {
        chart: { fontFamily: '"Inter", sans-serif, "Apple Color Emoji"', toolbar: { show: true }, sparkline: { enabled: false } },
        colors,
        plotOptions: {
          radialBar: {
            hollow: { margin: 10, size: "50%" },
            track: { margin: 10, strokeWidth: "50%" },
            dataLabels: { show: true },
          },
        },
        labels: dataTitle2,
      },
      series: dataValue2,
    });

    // ---------- chart3 (stacked bar) ----------
    const st_classQQ06 = regData.st_classQQ06 || 0;
    const st_classQQ07 = regData.st_classQQ07 || 0;
    const st_classQQ08 = regData.st_classQQ08 || 0;
    const st_classQQ09 = regData.st_classQQ09 || 0;
    const st_classQQ10 = regData.st_classQQ10 || 0;
    const st_classQQ11 = regData.st_classQQ11 || 0;
    const st_classQQ12 = regData.st_classQQ12 || 0;

    const id_examQQ03 = exmData.id_examQQ03 || 0;
    const id_examQQ05 = exmData.id_examQQ05 || 0;
    const id_examQQ07 = exmData.id_examQQ07 || 0;

    const dataValueReg = [st_classQQ06, st_classQQ07, st_classQQ08, st_classQQ09, st_classQQ10, st_classQQ11, st_classQQ12];
    const dataValueExm = [0, 0, id_examQQ03, 0, id_examQQ05, 0, id_examQQ07];
    const dataTitleReg = ["ষষ্ট", "সপ্তম", "অষ্টম", "নবম", "দশম", "একাদশ", "দ্বাদশ"];

    setChart3({
      options: {
        chart: { stacked: true, toolbar: { show: true } },
        colors,
        plotOptions: { bar: { horizontal: false, columnWidth: "28%", endingShape: "rounded", borderRadius: 5 } },
        legend: { show: false },
        dataLabels: { enabled: false },
        stroke: { show: true, width: 2, colors: ["transparent"] },
        xaxis: { categories: dataTitleReg, labels: { minHeight: 20, maxHeight: 20, style: { colors: "#8A92A6" }, offsetY: -2 } },
        yaxis: { title: { text: "" }, labels: { minWidth: 19, maxWidth: 19, style: { colors: "#8A92A6" }, offsetX: 20 } },
        fill: { opacity: 1 },
        tooltip: { y: { formatter: (val) => `${val} জন` } },
      },
      series: [
        { name: "নিবন্ধিত শিক্ষার্থী", data: dataValueReg },
        { name: "নিবন্ধিত পরীক্ষার্থী", data: dataValueExm },
      ],
    });
  }, [chartData1, chartData2, regData, exmData, colors]);

  /* Rebuild charts when dependencies change */
  useEffect(() => {
    buildCharts();
  }, [buildCharts, filesMap, chartData1, chartData2]);

  /* On mount: fetch profile & dashboard (use stored dash_data when possible) */
  useEffect(() => {
    let mounted = true;
    (async () => {
      // fetch profile immediately (no need to wait)
      if (ceb_session?.ceb_user_id) fetchProfileData();

      if (ceb_session?.ceb_user_id && storedDash?.regData && storedDash?.exmData && storedDash?.dateData && storedDash?.noticeData) {
        if (!mounted) return;
        setRegData(storedDash.regData || {});
        setExmData(storedDash.exmData || {});
        setDateData(storedDash.dateData || []);
        setNoticeData(storedDash.noticeData || []);
        await fetchFiles(storedDash.noticeData || []);
        setLoadingData(false);
        buildCharts();
      } else {
        if (ceb_session?.ceb_user_id) await getDataFromBackend();
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run only once on mount

  /* File view */
  const handleFileView = useCallback((field) => {
    const file = filesMap[field];
    if (file instanceof Blob || file instanceof File) {
      const pdfURL = URL.createObjectURL(file);
      window.open(pdfURL, '_blank');
      // Do not revoke immediately (some browsers will fail) — revoke after short timeout
      setTimeout(() => URL.revokeObjectURL(pdfURL), 10000);
    }
  }, [filesMap]);

  /* If not authorized — render nothing (same as original) */
  if (!(ceb_session?.ceb_user_id || ceb_session?.ceb_user_type === '13' || ceb_session?.ceb_user_role === '17')) {
    return null;
  }

  if (loadingData) {
    return (
      <Row data-aos="fade-up" data-aos-delay="100">
        <Col md={12}>
          <Card className="mb-5">
            <Card.Body>
              <h4 className={styles.SiyamRupaliFont + " text-center"}>অপেক্ষা করুন... ডাটা লোড হচ্ছে...</h4>
            </Card.Body>
          </Card>
        </Col>
        <Col md={12} className={styles.dashboard_loader + " mt-5"}></Col>
      </Row>
    );
  }

  return (
    <Row>
      {/* top slider */}
      <Col md={12} lg="12">
        <Row className="row-cols-1">
          <div className="overflow-hidden d-slider1 " data-aos="fade-up" data-aos-delay="800">
            <Swiper
              className="p-0 m-0 mb-2 list-inline "
              slidesPerView={5}
              spaceBetween={32}
              navigation={{ nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" }}
              breakpoints={{
                320: { slidesPerView: 1 },
                550: { slidesPerView: 2 },
                991: { slidesPerView: 3 },
                1400: { slidesPerView: 3 },
                1500: { slidesPerView: 4 },
                1920: { slidesPerView: 4 },
              }}
            >
              <SwiperSlide className="card card-slide">
                <div className="card-body">
                  <div className="progress-widget">
                    <Circularprogressbar
                      stroke={variableColors.primary}
                      width="60px"
                      height="60px"
                      Linecap="rounded"
                      trailstroke="#ddd"
                      strokewidth="4px"
                      style={{ width: 60, height: 60 }}
                      value={(exmData.active_total || 0) / (regData.active_total || 1) * 100}
                      id="circle-progress-01"
                    >
                      <svg width="24" height="24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                      </svg>
                    </Circularprogressbar>
                    <div className="progress-detail">
                      <p className="mb-2">নিবন্ধিত শিক্ষার্থী</p>
                      <h4 className="counter">
                        <CountUp start={(regData.active_total || 0) * 0.85} end={regData.active_total || 0} duration={3} />
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="card card-slide">
                <div className="card-body">
                  <div className="progress-widget">
                    <Circularprogressbar
                      stroke={variableColors.info}
                      width="60px"
                      height="60px"
                      trailstroke="#ddd"
                      strokewidth="4px"
                      Linecap="rounded"
                      style={{ width: 60, height: 60 }}
                      value={((exmData.id_examQQ03 || 0) + (exmData.id_examQQ05 || 0) + (exmData.id_examQQ07 || 0)) / (exmData.active_total || 1) * 100}
                      id="circle-progress-02"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z" />
                      </svg>
                    </Circularprogressbar>
                    <div className="progress-detail">
                      <p className="mb-2">নিবন্ধিত পরীক্ষার্থী</p>
                      <h4 className="counter">
                        <CountUp start={(exmData.active_total || 0) * 0.85} end={exmData.active_total || 0} duration={3} />
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="card card-slide">
                <div className="card-body">
                  <div className="progress-widget">
                    <Circularprogressbar
                      stroke={variableColors.primary}
                      width="60px"
                      height="60px"
                      trailstroke="#ddd"
                      strokewidth="4px"
                      Linecap="rounded"
                      style={{ width: 60, height: 60 }}
                      value={(exmData.id_examQQ03 || 0) / (exmData.active_total || 1) * 100}
                      id="circle-progress-03"
                    >
                      <svg width="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z" />
                      </svg>
                    </Circularprogressbar>
                    <div className="progress-detail">
                      <p className="mb-2">জেএসসি পরীক্ষার্থী</p>
                      <h4 className="counter">
                        <CountUp start={(exmData.id_examQQ03 || 0) * 0.85} end={exmData.id_examQQ03 || 0} duration={3} />
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="card card-slide">
                <div className="card-body">
                  <div className="progress-widget">
                    <Circularprogressbar
                      stroke={variableColors.info}
                      width="60px"
                      height="60px"
                      trailstroke="#ddd"
                      strokewidth="4px"
                      Linecap="rounded"
                      style={{ width: 60, height: 60 }}
                      value={(exmData.id_examQQ05 || 0) / (exmData.active_total || 1) * 100}
                      id="circle-progress-04"
                    >
                      <svg width="24px" height="24px" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                      </svg>
                    </Circularprogressbar>
                    <div className="progress-detail">
                      <p className="mb-2">এসএসসি পরীক্ষার্থী</p>
                      <h4 className="counter">
                        <CountUp start={(exmData.id_examQQ05 || 0) * 0.85} end={exmData.id_examQQ05 || 0} duration={3} />
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <SwiperSlide className="card card-slide">
                <div className="card-body">
                  <div className="progress-widget">
                    <Circularprogressbar
                      stroke={variableColors.primary}
                      width="60px"
                      height="60px"
                      trailstroke="#ddd"
                      strokewidth="4px"
                      Linecap="rounded"
                      style={{ width: 60, height: 60 }}
                      value={(exmData.id_examQQ07 || 0) / (exmData.active_total || 1) * 100}
                      id="circle-progress-05"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24">
                        <path fill="currentColor" d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z" />
                      </svg>
                    </Circularprogressbar>
                    <div className="progress-detail">
                      <p className="mb-2">এইচএসসি পরীক্ষার্থী</p>
                      <h4 className="counter">
                        <CountUp start={(exmData.id_examQQ07 || 0) * 0.85} end={exmData.id_examQQ07 || 0} duration={3} />
                      </h4>
                    </div>
                  </div>
                </div>
              </SwiperSlide>

              <div className="swiper-button swiper-button-next"></div>
              <div className="swiper-button swiper-button-prev"></div>
            </Swiper>
          </div>
        </Row>
      </Col>

      {/* left large column */}
      <Col md={12} lg="8">
        <Row>
          {/* Notices table */}
          <Col md={12}>
            <div className="overflow-hidden card" data-aos="fade-up" data-aos-delay="600">
              <div className="flex-wrap card-header d-flex justify-content-between">
                <div className="header-title"><h4 className="mb-2 card-title">বোর্ড নোটিশ</h4></div>
              </div>
              <div className="p-0 card-body">
                <div className="mt-4 table-responsive">
                  <table id="basic-table" className="table table-bordered mb-0" role="grid">
                    <thead>
                      <tr>
                        <th className="text-center align-center text-primary">ক্রমিক</th>
                        <th className="text-center align-center text-primary">টাইটেল</th>
                        <th className="text-center align-center text-primary">বিস্তারিত</th>
                        <th className="text-center align-center text-primary">সংযুক্তি</th>
                        <th className="text-center align-center text-primary">অবশিষ্ট সময়</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noticeData.map((noticeItem, idx) => {
                        const daysRemaining = differenceInDays(new Date(noticeItem.dt_end), new Date()) + 1;
                        const totalDays = differenceInDays(new Date(noticeItem.dt_end), new Date(noticeItem.dt_start)) + 1 || 1;
                        const percent = Math.round(Math.abs(daysRemaining / totalDays * 100));
                        return (
                          <tr key={idx}>
                            <td className='text-center align-center text-wrap text_dark'>
                              <h6>{InputValidation.E2BDigit(String(idx + 1).padStart(2, "0"))}</h6>
                            </td>
                            <td className='text-center align-center text-wrap text_dark'><h6>{noticeItem.bn_notice}</h6></td>
                            <td className='text-center align-center text-wrap text_dark'>
                              <h6>{InputValidation.E2BDigit(noticeItem.dt_start)}</h6>
                              <h6>{InputValidation.E2BDigit(noticeItem.dt_end)}</h6>
                            </td>
                            <td className='text-center align-center text-wrap text_dark'>
                              {filesMap[noticeItem.file_notice] && (
                                <Button onClick={() => handleFileView(noticeItem.file_notice)} type='button' variant='btn btn-link' className='w-100 m-0 p-0'>
                                  <span className={styles.SiyamRupaliFont + " text-center text-danger"}>নোটিশ</span>
                                </Button>
                              )}
                            </td>
                            <td className='text-center align-center text-wrap text_dark d-flex flex-column'>
                              <h6 className="text-center text-dark pb-1">{InputValidation.E2BDigit(percent)}%</h6>
                              <Progress
                                softcolors="primary"
                                color="primary"
                                className="shadow-none w-100"
                                value={Math.round(daysRemaining / 365 * 100)}
                                minvalue={0}
                                maxvalue={Math.round(totalDays / 365 * 100)}
                                style={{ height: "4px" }}
                              />
                              <h6 className="text-center text-dark pt-1">{InputValidation.E2BDigit(daysRemaining)} দিন</h6>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </Col>

          {/* Chart area */}
          <Col md={12}>
            <div className="card" data-aos="fade-up" data-aos-delay="800">
              <div className="flex-wrap card-header d-flex justify-content-between">
                <div className="header-title">
                  <h4 className="card-title">{chartData1 === '01' ? (regData.active_total || 0) : (exmData.active_total || 0)}</h4>
                  <p className="mb-0">{chartData1 === '01' ? 'নিবন্ধিত শিক্ষার্থী' : 'নিবন্ধিত পরীক্ষার্থী'}</p>
                </div>
                <Dropdown>
                  <Dropdown.Toggle as={Button} variant="text-gray" type="button" id="dropdownMenuButtonSM">
                    {chartData1 === '01' ? 'নিবন্ধিত শিক্ষার্থী' : 'নিবন্ধিত পরীক্ষার্থী'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#" onClick={() => setChartData1('01')}>নিবন্ধিত শিক্ষার্থী</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => setChartData1('02')}>নিবন্ধিত পরীক্ষার্থী</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="card-body">
                <Chart options={chart1.options} series={chart1.series} type="area" height="245" />
              </div>
            </div>
          </Col>

          {/* student info (radial) */}
          <Col md={12}>
            <div className="card" data-aos="fade-up" data-aos-delay="900">
              <div className="flex-wrap card-header d-flex justify-content-between">
                <div className="header-title"><h4 className="card-title">শিক্ষার্থীদের তথ্য</h4></div>
                <Dropdown>
                  <Dropdown.Toggle as={Button} variant="text-gray" type="button" id="dropdownMenuButtonSM">
                    {chartData2 === '01' && 'লিঙ্গ অনুযায়ী'}
                    {chartData2 === '02' && 'ধর্ম অনুযায়ী'}
                    {chartData2 === '03' && 'বিভাগ অনুযায়ী'}
                    {chartData2 === '04' && 'মাধ্যম অনুযায়ী'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#" onClick={() => setChartData2('01')}>লিঙ্গ অনুযায়ী</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => setChartData2('02')}>ধর্ম অনুযায়ী</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => setChartData2('03')}>বিভাগ অনুযায়ী</Dropdown.Item>
                    <Dropdown.Item href="#" onClick={() => setChartData2('04')}>মাধ্যম অনুযায়ী</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="card-body">
                <div className="flex-wrap d-flex align-items-center justify-content-between">
                  <Chart className="col-md-8 col-lg-8" options={chart2.options} series={chart2.series} type="radialBar" height="300" />
                  <div className="d-grid gap-2 col-md-4 col-lg-4">
                    {chart2?.options?.labels?.map((label, i) => (
                      <div key={i} className="d-flex align-items-start">
                        <svg className="mt-2" xmlns="http://www.w3.org/2000/svg" width="14" viewBox="0 0 24 24" fill={colors[i % colors.length]}>
                          <g><circle cx="12" cy="12" r="8" fill={colors[i % colors.length]}></circle></g>
                        </svg>
                        <div className="ms-3">
                          <span className="text-gray">{label}</span>
                          <h6>{chart2.series?.[i] ?? 0}%</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Col>

          {/* student vs exam stacked bar */}
          <Col md={12}>
            <div className="card" data-aos="fade-up" data-aos-delay="1000">
              <div className="flex-wrap card-header d-flex justify-content-between">
                <div className="header-title"><h4 className="card-title">শিক্ষার্থী ও পরীক্ষার্থী</h4></div>
                <Dropdown>
                  <Dropdown.Toggle as={Button} variant="text-gray" type="button" id="dropdownMenuButtonSM">{chartData3}</Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#" onClick={() => setChartData3(curDate.getFullYear())}>{curDate.getFullYear()}</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
              <div className="card-body">
                <Chart className="d-activity" options={chart3.options} series={chart3.series} type="bar" height="300" />
              </div>
            </div>
          </Col>
        </Row>
      </Col>

      {/* right sidebar */}
      <Col md={12} lg="4">
        <Row>
          <Col md={12} lg="12">
            <div className="card credit-card-widget" data-aos="fade-up" data-aos-delay="700">
              <div className="pb-4 border-0 card-header">
                <div className="p-4 border border-white rounded primary-gradient-card">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <h5 className="font-weight-bold">ACCOUNT DETAILS</h5>
                      <p className="mb-0">{ceb_session.ceb_user_type === '13' ? 'INSTITUTIONAL ACCOUNT' : 'PERSONAL ACCOUNT'}</p>
                    </div>
                    <div className="master-card-content">
                      <svg className="master-card-1" width="60" height="60" viewBox="0 0 24 24"><path fill="#ffffff" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
                      <svg className="master-card-2" width="60" height="60" viewBox="0 0 24 24"><path fill="#ffffff" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" /></svg>
                    </div>
                  </div>
                  <div className="my-2">
                    {profileData?.inst_account && <div className="card-number"><span className="fs-5 me-2">{profileData.inst_account}</span></div>}
                  </div>
                  <div className="mb-2 d-flex align-items-center justify-content-between">
                    {profileData?.en_user && <h6 className="text-uppercase">{profileData.en_user}</h6>}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    {profileData?.en_bank && <p className="text-uppercase">{profileData.en_bank}</p>}
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    {profileData?.inst_branch && <p className="mb-0 text-uppercase">{profileData.inst_branch}</p>}
                  </div>
                </div>
              </div>
            </div>

            <div className="card" data-aos="fade-up" data-aos-delay="500">
              <Row className="m-0 p-0">
                <Col md={12}>
                  <p className="m-0 p-2 text-gray text-start">সর্বশেষ লগইন (Successful):</p>
                  <p className="m-0 px-2 pb-2 text-success text-end">{InputValidation.E2BDigit(profileData.last_login_date)}</p>
                </Col>
                <hr />
                <Col md={12}>
                  <p className="m-0 p-2 pt-0 text-gray text-start">সর্বশেষ লগইন (Failed):</p>
                  <p className="m-0 px-2 pb-2 text-danger text-end">{InputValidation.E2BDigit(profileData.failed_login_date)}</p>
                </Col>
              </Row>
            </div>
          </Col>

          <Col md={12}>
            <div className="card" data-aos="fade-up" data-aos-delay="600">
              <div className="flex-wrap card-header d-flex justify-content-between">
                <div className="header-title"><h4 className="mb-2 card-title">চলমান আবেদন</h4></div>
              </div>
              <div className="card-body">
                {dateData.map((data, idx) => (
                  <div key={idx} className="mb-2 d-flex profile-media align-items-top">
                    <div className="mt-1 profile-dots-pills border-primary"></div>
                    <div className="ms-4 flex-fill">
                      <h6 className="mb-1 ">{String(data.income_code_details).split("ফিস")[0]} ({data.bn_entry} আবেদন)</h6>
                      <small className="mb-0 text-end d-block"><i>{InputValidation.E2BDigit(data.id_authorize_date)}</i></small>
                      <small className="mb-0 d-block">সময়ঃ {InputValidation.E2BDigit(data.dt_start)} থেকে {InputValidation.E2BDigit(data.dt_end)}</small>
                      <small className="mb-0 d-block">সেশনঃ {InputValidation.E2BDigit(data.st_session)}, বিভাগঃ {data.bn_group}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Col>
        </Row>
      </Col>
    </Row>
  );
});

export default IndexInstitute;
