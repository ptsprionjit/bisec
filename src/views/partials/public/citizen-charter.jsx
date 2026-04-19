import React, { useEffect, useState, Fragment } from 'react'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import { FadeLoader } from "react-spinners";

import CitizenCharterFullPrint from '../citizen-charter/print/citizen-charter-full-print';

import axiosApi from "../../../lib/axiosApi.jsx";

const CitizenCharter = () => {
    const navigate = useNavigate();

    //Student Data Fetch Status
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    //Student Fetched Data
    const [dataList, setDataList] = useState([]);

    //Fetch Leave List Data 
    const fetchDataList = async () => {
        setStatus({ loading: "তথ্য খুঁজা হচ্ছে...! অপেক্ষা করুন।", success: false, error: false });

        try {
            const response = await axiosApi.post(`/citizen/charter/list/approved`);
            if (response.status === 200) {
                setDataList(response.data.charterList);
            } else {
                setDataList([]);
                setStatus({ loading: false, success: false, error: response.data.message });
            }
        } catch (err) {
            setDataList([]);
            setStatus({ loading: false, success: false, error: err.response.data.message });
        } finally {
            setStatus((prev) => ({ ...prev, loading: false }));
        }
    };

    /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
    useEffect(() => {
        fetchDataList();
    }, []); // run only once on mount

    if (status.loading) return (
        <Fragment>
            <Row className="bg-transparent m-0 p-0">
                <Col md={12} className="d-flex justify-content-center align-items-center" style={{ height: "95dvh" }} >
                    <FadeLoader
                        color="#000000"
                        loading={true}
                    />
                </Col>
            </Row>
        </Fragment>
    )

    return (
        <Fragment>
            <CitizenCharterFullPrint
                navigateCitizenCharterPrint={true}
                setNavigateCitizenCharterPrint={false}
                printData={dataList}
            />
        </Fragment>
    )
}

export default CitizenCharter;