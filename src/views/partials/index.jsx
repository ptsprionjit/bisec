import React, { useEffect, memo, Fragment, useState, useMemo, useCallback } from "react";
import { Modal, Row, Col, Dropdown, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

// import axios from "axios";
import axiosApi from "../../lib/axiosApi.jsx";

import { differenceInDays } from "date-fns";

//circular
import Circularprogressbar from "../../components/circularprogressbar";

import { FadeLoader } from "react-spinners";

// AOS
import AOS from "aos";
import "aos";
import "../../../node_modules/aos/dist/aos.css";
//apexcharts
import Chart from "react-apexcharts";

//swiper
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Navigation } from "swiper";

// Import Swiper styles
import "swiper/swiper-bundle.min.css";
// import 'swiper/components/navigation/navigation.scss';

// progressbar
import Progress from "../../components/progress";

//Count-up
import CountUp from "react-countup";

// Redux Selector / Action
import { useSelector } from "react-redux";

// Import selectors & action from setting store
import * as SettingSelector from "../../store/setting/selectors";

import styles from "../../assets/custom/css/bisec.module.css";

import * as InputValidation from "./input_validation.js";

import { useAuthProvider } from "../../context/AuthContext.jsx";

// install Swiper modules
SwiperCore.use([Navigation]);

const Index = memo((props) => {
  const { permissionData } = useAuthProvider();
  const navigate = useNavigate();

  const [dashBoardData, setDashBoardData] = useState(useMemo(() => {
    try { return JSON.parse(window.sessionStorage.getItem("dashBoardData")); } catch { return null; }
  }, []));

  const [regData, setRegData] = useState([]);
  const [exmData, setExmData] = useState([]);
  const [usrData, setUsrData] = useState([]);
  const [accData, setAccData] = useState([]);
  const [dateData, setDateData] = useState([]);
  const [noticeData, setNoticeData] = useState([]);

  const [chart1, setChart1] = useState([]);
  const [chart2, setChart2] = useState([]);
  const [chart3, setChart3] = useState([]);
  const [chart4, setChart4] = useState([]);

  const [chartData1, setChartData1] = useState("01");
  const [chartData2, setChartData2] = useState("01");
  // const [chartData3, setChartData3] = useState("2025");
  const [chartData4, setChartData4] = useState("01");

  // File Attachment
  const [filesMap, setFilesMap] = useState([]);

  const [profileData, setProfileData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  // const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  // minor derived date used in original
  const curDate = useMemo(() => {
    const d = new Date();
    d.setHours(d.getUTCHours() + 12);
    return d;
  }, []);

  useSelector(SettingSelector.theme_color);

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

  // Set Chart Data
  const setChart = () => {
    var dataValue1 = [];
    var dataTitle1 = [];

    if (chartData1 === "01") {
      const st_classQQ06 = regData.st_classQQ06 || 0;
      const st_classQQ07 = regData.st_classQQ07 || 0;
      const st_classQQ08 = regData.st_classQQ08 || 0;
      const st_classQQ09 = regData.st_classQQ09 || 0;
      const st_classQQ10 = regData.st_classQQ10 || 0;
      const st_classQQ11 = regData.st_classQQ11 || 0;
      const st_classQQ12 = regData.st_classQQ12 || 0;
      dataValue1 = [st_classQQ06, st_classQQ07, st_classQQ08, st_classQQ09, st_classQQ10, st_classQQ11, st_classQQ12,];
      dataTitle1 = ["VI (06)", "VII (07)", "VIII (08)", "IX (09)", "X (10)", "XI (11)", "XII (12)",];
    } else {
      const id_examQQ03 = exmData.id_examQQ03 || 0;
      const id_examQQ05 = exmData.id_examQQ05 || 0;
      const id_examQQ07 = exmData.id_examQQ07 || 0;
      dataValue1 = [id_examQQ03, id_examQQ05, id_examQQ07];
      dataTitle1 = ["JSC", "SSC", "HSC"];
    }

    const myChart1 = {
      options: {
        chart: {
          fontFamily:
            '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          toolbar: {
            show: true,
          },
          sparkline: {
            enabled: false,
          },
        },
        colors: colors,
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
            minWidth: 50,
            maxWidth: 50,
            style: {
              colors: "#8A92A6",
            },
            offsetX: -5,
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          labels: {
            minHeight: 22,
            maxHeight: 22,
            show: true,
            style: {
              colors: "#8A92A6",
            },
          },
          lines: {
            show: false, //or just here to disable only x axis grids
          },
          categories: dataTitle1,
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 50, 80],
            colors: colors,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      series: [
        {
          name: "নিবন্ধিত",
          data: dataValue1,
        },
      ],
    };
    setChart1(myChart1);

    var dataValue2 = [];
    var dataTitle2 = [];
    var total = 1;

    switch (chartData2) {
      case "01":
        const id_genderQQ01 = regData.id_genderQQ01 || 0;
        const id_genderQQ02 = regData.id_genderQQ02 || 0;
        total = id_genderQQ01 + id_genderQQ02 || 1;
        dataValue2 = [
          Math.ceil((id_genderQQ01 / total) * 100),
          Math.ceil((id_genderQQ02 / total) * 100),
        ];
        dataTitle2 = ["ছাত্র", "ছাত্রী"];
        break;
      case "02":
        const id_religionQQ01 = regData.id_religionQQ01 || 0;
        const id_religionQQ02 = regData.id_religionQQ02 || 0;
        const id_religionQQ03 = regData.id_religionQQ03 || 0;
        const id_religionQQ04 = regData.id_religionQQ04 || 0;
        total =
          id_religionQQ01 +
          id_religionQQ02 +
          id_religionQQ03 +
          id_religionQQ04 || 1;
        dataValue2 = [
          Math.ceil((id_religionQQ01 / total) * 100),
          Math.ceil((id_religionQQ02 / total) * 100),
          Math.ceil((id_religionQQ03 / total) * 100),
          Math.ceil((id_religionQQ04 / total) * 100),
        ];
        dataTitle2 = ["ইসলাম", "সনাতন", "বুদ্ধ", "খ্রিষ্টান"];
        break;
      case "03":
        const id_groupQQ10 = regData.id_groupQQ10 || 0;
        const id_groupQQ01 = regData.id_groupQQ01 || 0;
        const id_groupQQ02 = regData.id_groupQQ02 || 0;
        const id_groupQQ03 = regData.id_groupQQ03 || 0;
        total = id_groupQQ10 + id_groupQQ01 + id_groupQQ02 + id_groupQQ03 || 1;
        dataValue2 = [
          Math.ceil((id_groupQQ10 / total) * 100),
          Math.ceil((id_groupQQ01 / total) * 100),
          Math.ceil((id_groupQQ02 / total) * 100),
          Math.ceil((id_groupQQ03 / total) * 100),
        ];
        dataTitle2 = ["সাধারণ", "বিজ্ঞান", "মানবিক", "ব্যবসায় শিক্ষা"];
        break;
      case "04":
        const id_versionQQ01 = regData.id_versionQQ01 || 0;
        const id_versionQQ02 = regData.id_versionQQ02 || 0;
        total = id_versionQQ01 + id_versionQQ02 || 1;
        dataValue2 = [
          Math.ceil((id_versionQQ01 / total) * 100),
          Math.ceil((id_versionQQ02 / total) * 100),
        ];
        dataTitle2 = ["বাংলা", "ইংরেজি"];
        break;
      default:
        const val1 = regData.id_genderQQ01 || 0;
        const val2 = regData.id_genderQQ02 || 0;
        total = val1 + val2 || 1;
        dataValue2 = [
          Math.ceil((val1 / total) * 100),
          Math.ceil((val2 / total) * 100),
        ];
        dataTitle2 = ["ছাত্র", "ছাত্রী"];
        break;
    }

    //chart2
    const myChart2 = {
      options: {
        chart: {
          fontFamily:
            '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          toolbar: {
            show: true,
          },
          sparkline: {
            enabled: false,
          },
        },
        colors: colors,
        plotOptions: {
          radialBar: {
            hollow: {
              margin: 10,
              size: "50%",
            },
            track: {
              margin: 10,
              strokeWidth: "50%",
            },
            dataLabels: {
              show: true,
            },
          },
        },
        labels: dataTitle2,
      },
      series: dataValue2,
    };
    setChart2(myChart2);

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

    var dataValueReg = [
      st_classQQ06,
      st_classQQ07,
      st_classQQ08,
      st_classQQ09,
      st_classQQ10,
      st_classQQ11,
      st_classQQ12,
    ];
    var dataValueExm = [0, 0, id_examQQ03, 0, id_examQQ05, 0, id_examQQ07];
    var dataTitleReg = [
      "ষষ্ট",
      "সপ্তম",
      "অষ্টম",
      "নবম",
      "দশম",
      "একাদশ",
      "দ্বাদশ",
    ];
    //chart3
    const myChart3 = {
      // options: {
      //   chart: {
      //     stacked: true,
      //     toolbar: {
      //       show: true,
      //     },
      //   },
      //   colors: colors,
      //   plotOptions: {
      //     bar: {
      //       horizontal: false,
      //       columnWidth: "25%",
      //       endingShape: "rounded",
      //       borderRadius: 5,
      //       distributed: true
      //     },
      //   },
      //   legend: {
      //     show: true,
      //   },
      //   dataLabels: {
      //     enabled: false,
      //   },
      //   stroke: {
      //     show: true,
      //     width: 2,
      //     colors: ["transparent"],
      //   },
      //   xaxis: {
      //     categories: dataTitleReg,
      //     labels: {
      //       minHeight: 20,
      //       maxHeight: 20,
      //       style: {
      //         colors: "#8A92A6",
      //       },
      //       offsetY: -2,
      //     },
      //   },
      //   yaxis: {
      //     title: {
      //       text: "",
      //     },
      //     labels: {
      //       minWidth: 19,
      //       maxWidth: 19,
      //       style: {
      //         colors: "#8A92A6",
      //       },
      //       offsetX: -5,
      //     },
      //   },
      //   fill: {
      //     opacity: 1,
      //   },
      //   tooltip: {
      //     y: {
      //       formatter: function (val) {
      //         return val + " জন";
      //       },
      //     },
      //   },
      // },
      // series: [
      //   {
      //     name: "নিবন্ধিত শিক্ষার্থী",
      //     data: dataValueReg,
      //   },
      //   {
      //     name: "নিবন্ধিত পরীক্ষার্থী",
      //     data: dataValueExm,
      //   },
      // ],
      options: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '25%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 1,
          colors: ['transparent']
        },
        xaxis: {
          categories: dataTitleReg,
        },
        yaxis: {
          title: {
            text: ''
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val) {
              return val + " জন";
            },
          }
        }
      },
      series: [
        {
          name: "নিবন্ধিত শিক্ষার্থী",
          data: dataValueReg,
        }, {
          name: "নিবন্ধিত পরীক্ষার্থী",
          data: dataValueExm,
        },
      ],
    };
    setChart3(myChart3);

    var dataValue4 = [];

    if (chartData4 === "01") {
      const st_total7 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 7)] || 0;
      const st_total6 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 6)] || 0;
      const st_total5 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 5)] || 0;
      const st_total4 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 4)] || 0;
      const st_total3 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 3)] || 0;
      const st_total2 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 2)] || 0;
      const st_total1 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 1)] || 0;
      const st_total0 =
        regData["st_sessionQQ" + (curDate.getFullYear() - 0)] || 0;
      const st_total8 =
        regData["st_sessionQQ" + (curDate.getFullYear() + 1)] || 0;
      const st_total9 =
        regData["st_sessionQQ" + (curDate.getFullYear() + 2)] || 0;
      dataValue4 = [
        st_total7,
        st_total6,
        st_total5,
        st_total4,
        st_total3,
        st_total2,
        st_total1,
        st_total0,
        st_total8,
        st_total9,
      ];
    } else {
      const st_total7 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 7)] || 0;
      const st_total6 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 6)] || 0;
      const st_total5 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 5)] || 0;
      const st_total4 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 4)] || 0;
      const st_total3 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 3)] || 0;
      const st_total2 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 2)] || 0;
      const st_total1 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 1)] || 0;
      const st_total0 =
        exmData["st_sessionQQ" + (curDate.getFullYear() - 0)] || 0;
      const st_total8 =
        exmData["st_sessionQQ" + (curDate.getFullYear() + 1)] || 0;
      const st_total9 =
        exmData["st_sessionQQ" + (curDate.getFullYear() + 2)] || 0;
      dataValue4 = [
        st_total7,
        st_total6,
        st_total5,
        st_total4,
        st_total3,
        st_total2,
        st_total1,
        st_total0,
        st_total8,
        st_total9,
      ];
    }

    const myChart4 = {
      options: {
        chart: {
          fontFamily:
            '"Inter", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
          toolbar: {
            show: true,
          },
          sparkline: {
            enabled: false,
          },
        },
        colors: colors,
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
          width: 3,
        },
        yaxis: {
          show: true,
          labels: {
            show: true,
            minWidth: 50,
            maxWidth: 50,
            style: {
              colors: "#8A92A6",
            },
            offsetX: -5,
          },
        },
        legend: {
          show: false,
        },
        xaxis: {
          labels: {
            minHeight: 22,
            maxHeight: 22,
            show: true,
            style: {
              colors: "#8A92A6",
            },
          },
          lines: {
            show: false, //or just here to disable only x axis grids
          },
          categories: [
            curDate.getFullYear() - 7,
            curDate.getFullYear() - 6,
            curDate.getFullYear() - 5,
            curDate.getFullYear() - 4,
            curDate.getFullYear() - 3,
            curDate.getFullYear() - 2,
            curDate.getFullYear() - 1,
            curDate.getFullYear(),
            curDate.getFullYear() + 1,
            curDate.getFullYear() + 2,
          ],
        },
        grid: {
          show: false,
        },
        fill: {
          type: "gradient",
          gradient: {
            shade: "dark",
            type: "vertical",
            shadeIntensity: 0,
            gradientToColors: undefined, // optional, if not defined - uses the shades of same color in series
            inverseColors: true,
            opacityFrom: 0.4,
            opacityTo: 0.1,
            stops: [0, 50, 80],
            colors: colors,
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      series: [
        {
          name: "নিবন্ধিত",
          data: dataValue4,
        },
      ],
    };
    setChart4(myChart4);
  };

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

  /* File fetch: fetch blobs and convert to File objects, store a map */
  const fetchFiles = useCallback(async (noticeList) => {
    if (!Array.isArray(noticeList)) {
      setFilesMap({});
      return;
    }
    const results = await Promise.all(
      noticeList.map(async (item) => {
        try {
          const res = await axiosApi.post(`/board/notice/fetch_files`, { id_notice: item.id_notice, file_notice: item.file_notice }, { responseType: 'blob' });
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
  }, [navigate]);

  /* API: fetch profile */
  const fetchProfileData = useCallback(async () => {
    try {
      const res = await axiosApi.post(`/user/details`);
      if (res?.status === 200) setProfileData(res.data.data || {});
    } catch (err) {
      if (err?.status === 401) navigate("/auth/sign-out");
    }
  }, [navigate]);

  // Aggregate Counts & Data
  const aggregateCounts = ({ dataSource, totalKey, extraTotals = [] }) => {
    const result = {
      active_total: 0,
    };

    extraTotals.forEach((k) => (result[k] = 0));

    Object.entries(dataSource).forEach(([fieldKey, rowData]) => {
      Object.entries(rowData).forEach(([fieldKey, colValue]) => {
        const key = `${fieldKey}QQ${String(colValue).toLowerCase()}`;
        result[key] ??= 0;
        result[key] += Number(rowData.st_total);
        if (fieldKey === totalKey) {
          result.active_total += Number(rowData.st_total);

          if (rowData.pay_total != null && result.payment_total != null) {
            result.payment_total += Number(rowData.pay_total);
          }
        }
      });
    });

    return result;
  };

  // Fetch Dashboard Data
  const getData = async () => {
    try {
      const response = await axiosApi.post(`/dashboard/board`, {});
      if (response.status === 200) {
        // Reg Values
        const regData = aggregateCounts({
          dataSource: response.data.activeRegResult,
          totalKey: "st_session",
        });

        // Exam Values
        const exmData = aggregateCounts({
          dataSource: response.data.activeExmResult,
          totalKey: "st_session",
        });

        // User Values
        const usrData = aggregateCounts({
          dataSource: response.data.activeUsrResult,
          totalKey: "st_session",
        });

        // Account Values
        const accData = aggregateCounts({
          dataSource: response.data.activeAccResult,
          totalKey: "st_session",
          extraTotals: ["payment_total"],
        });

        setRegData(regData);
        setExmData(exmData);
        setUsrData(usrData);
        setAccData(accData);
        setDateData(response.data.dateResult);
        setNoticeData(response.data.noticeResult);
        fetchFiles(response.data.noticeResult);

        const dashBoardData = JSON.stringify({
          regData: regData,
          exmData: exmData,
          usrData: usrData,
          accData: accData,
          dateData: response.data.dateResult,
          noticeData: response.data.noticeResult,
        });

        setDashBoardData(dashBoardData);

        window.sessionStorage.setItem("dashBoardData", dashBoardData);
        setChart();
      }
    } catch (err) {
      if (err.status === 401) {
        navigate("/auth/sign-out");
      }
    } finally {
      setLoadingData(false);
    }
  };

  // Set Dashboard Data
  const setData = async () => {
    setRegData(dashBoardData.regData);
    setExmData(dashBoardData.exmData);
    setUsrData(dashBoardData.usrData);
    setAccData(dashBoardData.accData);
    setDateData(dashBoardData.dateData);
    setNoticeData(dashBoardData.noticeData);
    setChart();
    await fetchFiles(dashBoardData.noticeData);
    setLoadingData(false);
  };

  // Ste Chart on Data Change
  useEffect(() => {
    setChart();
  }, [filesMap, chartData1, chartData2, chartData4]); // eslint-disable-line react-hooks/exhaustive-deps

  /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
  useEffect(() => {
    let mounted = true;
    (async () => {
      if (permissionData.type === '13') {
        navigate("/home", { replace: true });
      } else {
        fetchProfileData();
        // Chesk If Data is Present
        if (!dashBoardData?.regData || !dashBoardData?.exmData || !dashBoardData?.usrData || !dashBoardData?.accData || !dashBoardData?.dateData || !dashBoardData?.noticeData) {
          getData();
        } else {
          setData();
        }
      }
    })();
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [permissionData, loading, dashBoardData]); // run only once on mount
  }, [permissionData, dashBoardData]); // run only once on mount

  if (loadingData) {
    return (
      <Fragment>
        <Row data-aos="fade-up" data-aos-delay="100">
          <Modal
            show={true}
            backdrop={"static"}
            keyboard={false}
            className='modal-fullscreen bg-transparent d-flex justify-content-center align-items-center'
          >
            <Modal.Body className="bg-transparent">
              <Card className="bg-transparent">
                <Card.Header className="bg-transparent">
                  <h5 className="text-center">অপেক্ষা করুন... ডাটা লোড হচ্ছে...</h5>
                </Card.Header>
                <Card.Body className="bg-transparent">
                  {/* <Col md={12} className={styles.dashboard_loader + " mt-5"}></Col> */}
                  <Col md={12} className="d-flex justify-content-center align-items-center">
                    <FadeLoader
                      color="#000000"
                      loading={true}
                      radius={15}
                      width={5}
                      height={20}
                    />
                  </Col>
                </Card.Body>
              </Card>
            </Modal.Body>
          </Modal>
        </Row>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <Row>
        <Col md={12} lg="12">
          <Row className="row-cols-1">
            <div
              className="overflow-hidden d-slider1 "
              data-aos="fade-up"
              data-aos-delay="800"
            >
              <Swiper
                className="p-0 m-0 mb-2 list-inline "
                slidesPerView={5}
                spaceBetween={32}
                navigation={{
                  nextEl: ".swiper-button-next",
                  prevEl: ".swiper-button-prev",
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  550: { slidesPerView: 2 },
                  991: { slidesPerView: 3 },
                  1400: { slidesPerView: 3 },
                  1500: { slidesPerView: 4 },
                  1920: { slidesPerView: 4 },
                  2040: { slidesPerView: 7 },
                  2440: { slidesPerView: 8 },
                  2840: { slidesPerView: 9 },
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
                        value={
                          (exmData.active_total / regData.active_total) * 100
                        }
                        id="circle-progress-01"
                      >
                        <svg
                          className=""
                          width="24"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">নিবন্ধিত শিক্ষার্থী</p>
                        <h4 className="counter">
                          <CountUp
                            start={regData.active_total * 0.85}
                            end={regData.active_total || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
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
                        value={
                          ((exmData.id_examQQ03 +
                            exmData.id_examQQ05 +
                            exmData.id_examQQ07) /
                            exmData.active_total) *
                          100
                        }
                        id="circle-progress-02"
                      >
                        <svg
                          className=""
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">নিবন্ধিত পরীক্ষার্থী</p>
                        <h4 className="counter">
                          <CountUp
                            start={exmData.active_total * 0.85}
                            end={exmData.active_total || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
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
                        value={
                          (exmData.id_examQQ03 / exmData.active_total) * 100
                        }
                        id="circle-progress-03"
                      >
                        <svg className="" width="24" viewBox="0 0 24 24">
                          <path
                            fill="currentColor"
                            d="M19,6.41L17.59,5L7,15.59V9H5V19H15V17H8.41L19,6.41Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">জেএসসি পরীক্ষার্থী</p>
                        <h4 className="counter">
                          <CountUp
                            start={exmData.id_examQQ03 * 0.85}
                            end={exmData.id_examQQ03 || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
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
                        value={
                          (exmData.id_examQQ05 / exmData.active_total) * 100
                        }
                        id="circle-progress-04"
                      >
                        <svg
                          className=""
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">এসএসসি পরীক্ষার্থী</p>
                        <h4 className="counter">
                          <CountUp
                            start={exmData.id_examQQ05 * 0.85}
                            end={exmData.id_examQQ05 || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
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
                        value={
                          (exmData.id_examQQ07 / exmData.active_total) * 100
                        }
                        id="circle-progress-05"
                      >
                        <svg
                          className=""
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">এইচএসসি পরীক্ষার্থী</p>
                        <h4 className="counter">
                          <CountUp
                            start={exmData.id_examQQ07 * 0.85}
                            end={exmData.id_examQQ07 || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
                  <div className="card-body">
                    <div className="progress-widget">
                      <Circularprogressbar
                        stroke={variableColors.info}
                        width="60px"
                        height="60px"
                        trailstroke="#ddd"
                        Linecap="rounded"
                        strokewidth="4px"
                        value={
                          (usrData.id_user_entityQQ13 / usrData.active_total) *
                          100
                        }
                        style={{ width: 60, height: 60 }}
                        id="circle-progress-06"
                      >
                        <svg
                          className=""
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">নিবন্ধিত প্রতিষ্ঠান</p>
                        <h4 className="counter">
                          <CountUp
                            start={usrData.id_user_entityQQ13 * 0.85}
                            end={usrData.id_user_entityQQ13 || 0}
                            duration={3}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
                  <div className="card-body">
                    <div className="progress-widget">
                      <Circularprogressbar
                        stroke={colors}
                        Linecap="rounded"
                        trailstroke="#ddd"
                        strokewidth="4px"
                        width="60px"
                        height="60px"
                        value={30}
                        style={{ width: 60, height: 60 }}
                        id="circle-progress-07"
                      >
                        <svg
                          className=""
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">বোর্ড ব্যবহারকারী</p>
                        <h4 className="counter">
                          <CountUp
                            start={
                              (usrData.id_user_entityQQ14 +
                                usrData.id_user_entityQQ15) *
                              0.85
                            }
                            end={
                              usrData.id_user_entityQQ14 +
                              usrData.id_user_entityQQ15 || 0
                            }
                            duration={3}
                          // decimals={1}
                          />
                        </h4>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
                <SwiperSlide className=" card card-slide">
                  <div className="card-body">
                    <div className="progress-widget">
                      <Circularprogressbar
                        stroke={colors}
                        Linecap="rounded"
                        trailstroke="#ddd"
                        strokewidth="4px"
                        width="60px"
                        height="60px"
                        value={100}
                        style={{ width: 60, height: 60 }}
                        id="circle-progress-07"
                      >
                        <svg
                          className=""
                          width="24px"
                          height="24px"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="currentColor"
                            d="M5,17.59L15.59,7H9V5H19V15H17V8.41L6.41,19L5,17.59Z"
                          />
                        </svg>
                      </Circularprogressbar>
                      <div className="progress-detail">
                        <p className="mb-2">মোট লেনদেন</p>
                        <h4 className="counter">
                          ট{" "}
                          <CountUp
                            start={accData.payment_total * 0.85}
                            end={accData.payment_total || 0}
                            duration={3}
                          // decimals={1}
                          />
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
        <Col md={12} lg="8">
          <Row>
            <Col md={12}>
              <div
                className="overflow-hidden card"
                data-aos="fade-up"
                data-aos-delay="600"
              >
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="mb-2 card-title">বোর্ড নোটিশ</h5>
                  </div>
                </div>
                <div className="p-0 card-body">
                  <div className="mt-4 table-responsive">
                    <table
                      id="basic-table"
                      className="table table-bordered mb-0"
                      role="grid"
                    >
                      <thead>
                        <tr>
                          <th className="text-center align-center text-primary">
                            ক্রমিক
                          </th>
                          <th className="text-center align-center text-primary">
                            টাইটেল
                          </th>
                          <th className="text-center align-center text-primary">
                            বিস্তারিত
                          </th>
                          <th className="text-center align-center text-primary">
                            সংযুক্তি
                          </th>
                          <th className="text-center align-center text-primary">
                            অবশিষ্ট সময়
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {noticeData.map((noticeItem, idx) => {
                          const daysRemaining = differenceInDays(new Date(noticeItem.dt_end), new Date()) + 1;
                          const totalDays = differenceInDays(new Date(noticeItem.dt_end), new Date(noticeItem.dt_start)) + 1 || 1;
                          const percent = Math.round(Math.abs(daysRemaining / totalDays * 100));
                          return (
                            <tr key={idx}>
                              <td className="text-center align-center text-wrap text_dark">
                                <h6>
                                  {InputValidation.E2BDigit(String(idx + 1).padStart(2, "0"))}
                                </h6>
                              </td>
                              <td className="text-center align-center text-wrap text_dark">
                                <h6>{noticeItem.bn_notice}</h6>
                              </td>
                              <td className="text-center align-center text-wrap text_dark">
                                <h6>
                                  {InputValidation.E2BDigit(noticeItem.dt_start)}{" "}
                                  থেকে{" "}
                                  {InputValidation.E2BDigit(noticeItem.dt_end)}
                                </h6>
                              </td>
                              <td className="text-center align-center text-wrap text_dark">
                                {filesMap[noticeItem.file_notice] && (
                                  <Button onClick={() => handleFileView(noticeItem.file_notice)} type="button" variant="btn btn-link" className="w-100 m-0 p-0"><span className={styles.SiyamRupaliFont + " text-center text-danger"}>নোটিশ</span></Button>
                                )}
                              </td>
                              <td className="text-center align-center text-wrap text_dark d-flex flex-column">
                                <h6 className="text-center text-dark pb-1">
                                  {InputValidation.E2BDigit(percent)}%
                                </h6>
                                <Progress
                                  softcolors="primary"
                                  color="primary"
                                  className="shadow-none w-100"
                                  value={percent}
                                  minvalue={0}
                                  maxvalue={100}
                                  style={{ height: "4px" }}
                                />
                                <h6 className="text-center text-dark pt-1">
                                  {InputValidation.E2BDigit(differenceInDays(new Date(noticeItem.dt_end), new Date()) + 1)}{" "}দিন
                                </h6>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="card" data-aos="fade-up" data-aos-delay="800">
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="mb-0">
                      {chartData1 === "01"
                        ? "নিবন্ধিত শিক্ষার্থী (শ্রেণী ভিত্তিক)"
                        : "নিবন্ধিত পরীক্ষার্থী"}
                    </h5>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      as={Button}
                      variant="text-gray"
                      type="button"
                      id="dropdownMenuButtonSM"
                    >
                      {chartData1 === "01"
                        ? "নিবন্ধিত শিক্ষার্থী"
                        : "নিবন্ধিত পরীক্ষার্থী"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData1("01")}
                      >
                        নিবন্ধিত শিক্ষার্থী
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData1("02")}
                      >
                        নিবন্ধিত পরীক্ষার্থী
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="card-body">
                  <Chart
                    options={chart1.options}
                    series={chart1.series}
                    type="area"
                    height="245"
                  />
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="card" data-aos="fade-up" data-aos-delay="800">
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="mb-0">
                      {chartData4 === "01"
                        ? "নিবন্ধিত শিক্ষার্থীর"
                        : "নিবন্ধিত পরীক্ষার্থীর"}{" "}
                      (বছর ভিত্তিক তুলনামূলক চিত্র)
                    </h5>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      as={Button}
                      variant="text-gray"
                      type="button"
                      id="dropdownMenuButtonSM"
                    >
                      {chartData4 === "01"
                        ? "নিবন্ধিত শিক্ষার্থী"
                        : "নিবন্ধিত পরীক্ষার্থী"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData4("01")}
                      >
                        নিবন্ধিত শিক্ষার্থী
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData4("02")}
                      >
                        নিবন্ধিত পরীক্ষার্থী
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="card-body">
                  <Chart
                    options={chart4.options}
                    series={chart4.series}
                    type="area"
                    height="245"
                  />
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="card" data-aos="fade-up" data-aos-delay="900">
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="card-title">
                      শিক্ষার্থীদের তুলনামূলক তথ্য (
                      {chartData2 === "01" && "লিঙ্গ অনুযায়ী"}
                      {chartData2 === "02" && "ধর্ম অনুযায়ী"}
                      {chartData2 === "03" && "বিভাগ অনুযায়ী"}
                      {chartData2 === "04" && "মাধ্যম অনুযায়ী"})
                    </h5>
                  </div>
                  <Dropdown>
                    <Dropdown.Toggle
                      as={Button}
                      variant="text-gray"
                      type="button"
                      id="dropdownMenuButtonSM"
                    >
                      {chartData2 === "01" && "লিঙ্গ অনুযায়ী"}
                      {chartData2 === "02" && "ধর্ম অনুযায়ী"}
                      {chartData2 === "03" && "বিভাগ অনুযায়ী"}
                      {chartData2 === "04" && "মাধ্যম অনুযায়ী"}
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData2("01")}
                      >
                        লিঙ্গ অনুযায়ী
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData2("02")}
                      >
                        ধর্ম অনুযায়ী
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData2("03")}
                      >
                        বিভাগ অনুযায়ী
                      </Dropdown.Item>
                      <Dropdown.Item
                        href="#"
                        onClick={() => setChartData2("04")}
                      >
                        মাধ্যম অনুযায়ী
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
                <div className="card-body">
                  <div className="flex-wrap d-flex align-items-center justify-content-between">
                    <Chart
                      className="col-md-8 col-lg-8"
                      options={chart2.options}
                      series={chart2.series}
                      type="radialBar"
                      height="300"
                    />
                    <div className="d-grid gap-2 col-md-4 col-lg-4">
                      {chart2?.options?.labels[0] && (
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="#3a57e8"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="#3a57e8"
                              ></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-gray">
                              {chart2.options.labels[0]}
                            </span>
                            <h6>{chart2.series[0]}%</h6>
                          </div>
                        </div>
                      )}
                      {chart2?.options?.labels[1] && (
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="#4bc7d2"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="#4bc7d2"
                              ></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-gray">
                              {chart2.options.labels[1]}
                            </span>
                            <h6>{chart2.series[1]}%</h6>
                          </div>
                        </div>
                      )}
                      {chart2?.options?.labels[2] && (
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="#922424"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="#922424"
                              ></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-gray">
                              {chart2.options.labels[2]}
                            </span>
                            <h6>{chart2.series[2]}%</h6>
                          </div>
                        </div>
                      )}
                      {chart2?.options?.labels[3] && (
                        <div className="d-flex align-items-start">
                          <svg
                            className="mt-2"
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            viewBox="0 0 24 24"
                            fill="#4ab84a"
                          >
                            <g>
                              <circle
                                cx="12"
                                cy="12"
                                r="8"
                                fill="#4ab84a"
                              ></circle>
                            </g>
                          </svg>
                          <div className="ms-3">
                            <span className="text-gray">
                              {chart2.options.labels[3]}
                            </span>
                            <h6>{chart2.series[3]}%</h6>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col md={12}>
              <div className="card" data-aos="fade-up" data-aos-delay="1000">
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="card-title">
                      শিক্ষার্থী ও পরীক্ষার্থীদের তুলনামূলক চিত্র
                    </h5>
                  </div>
                </div>
                <div className="card-body">
                  <Chart
                    className="d-activity"
                    options={chart3.options}
                    series={chart3.series}
                    type="bar"
                    height="300"
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col md={12} lg="4">
          <Row>
            <Col md={12}>
              <div
                className="card credit-card-widget"
                data-aos="fade-up"
                data-aos-delay="700"
              >
                <div className="pb-4 border-0 card-header">
                  <div className="p-4 border border-white rounded primary-gradient-card">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="font-weight-bold">ACCOUNT DETAILS</h5>
                        <p className="mb-0">
                          {permissionData.type === "13"
                            ? "INSTITUTIONAL ACCOUNT"
                            : "PERSONAL ACCOUNT"}
                        </p>
                      </div>
                      <div className="master-card-content">
                        <svg
                          className="master-card-1"
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ffffff"
                            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                          />
                        </svg>
                        <svg
                          className="master-card-2"
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#ffffff"
                            d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"
                          />
                        </svg>
                      </div>
                    </div>
                    <div className="my-2">
                      {profileData?.profile_account && (
                        <div className="card-number">
                          <span className="fs-5 me-2">
                            {profileData.profile_account}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mb-2 d-flex align-items-center justify-content-between">
                      {profileData?.en_user && (
                        <h6 className="text-uppercase">
                          {profileData.en_user}
                        </h6>
                      )}
                    </div>

                    <div className="d-flex align-items-center justify-content-between">
                      {profileData?.en_bank && (
                        <p className="text-uppercase">{profileData.en_bank}</p>
                      )}
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      {profileData?.profile_branch && (
                        <p className="mb-0 text-uppercase">
                          {profileData.profile_branch}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className="card" data-aos="fade-up" data-aos-delay="500">
                <Row className="m-0 p-0">
                  <Col md={12}>
                    <p className="m-0 p-2 text-gray text-start">
                      সর্বশেষ লগইন (Successful):
                    </p>
                    <p className="m-0 px-2 pb-2 text-success text-end">
                      {InputValidation.E2BDigit(profileData.last_login_date)}
                    </p>
                  </Col>
                  <hr />
                  <Col md={12}>
                    <p className="m-0 p-2 pt-0 text-gray text-start">
                      সর্বশেষ লগইন (Failed):
                    </p>
                    <p className="m-0 px-2 pb-2 text-danger text-end">
                      {InputValidation.E2BDigit(profileData.failed_login_date)}
                    </p>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col md={12}>
              <div className="card" data-aos="fade-up" data-aos-delay="600">
                <div className="flex-wrap card-header d-flex justify-content-between">
                  <div className="header-title">
                    <h5 className="mb-2 card-title">চলমান আবেদন</h5>
                  </div>
                </div>
                <div className="card-body">
                  {dateData.map((data, idx) => (
                    <div
                      key={idx}
                      className="mb-2 d-flex profile-media align-items-top"
                    >
                      <div className="mt-1 profile-dots-pills border-primary"></div>
                      <div className="ms-4 flex-fill">
                        <h6 className="mb-1 ">
                          {String(data.income_code_details).split("ফিস")[0]} (
                          {data.bn_entry} আবেদন)
                        </h6>
                        <small className="mb-0 text-end d-block">
                          <i>
                            {InputValidation.E2BDigit(data.id_authorize_date)}
                          </i>
                        </small>
                        <small className="mb-0 d-block">
                          সময়ঃ {InputValidation.E2BDigit(data.dt_start)} থেকে{" "}
                          {InputValidation.E2BDigit(data.dt_end)}
                        </small>
                        <small className="mb-0 d-block">
                          সেশনঃ {InputValidation.E2BDigit(data.st_session)},
                          বিভাগঃ {data.bn_group}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Fragment>
  );
});

export default Index;
