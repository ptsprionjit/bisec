import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import error01 from '../../../assets/images/error/01.png'
import { useAuthProvider } from "../../../context/AuthContext.jsx";
import LeaveAppForm from './application/leave-app.jsx';

const LeaveApp = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        id_type: '', user_leave: '', user_duty: '', id_reason: '', en_dist: '', id_uzps: '', leave_address: '', mobile: '', start_date: '', end_date: '', total_requested: 0, yearly_total: 0, total_availed: 0, message: '',
    });

    //Data Fetch Status
    const [status, setStatus] = useState({ loading: false, success: false, error: false });

    // Check Permission data
    useEffect(() => {
        if (loading) return;

        if (!permissionData?.id) {
            navigate("/auth/sign-out", { replace: true });
        } else {
            if (!(permissionData.type === "14" || permissionData.type === "15")) {
                navigate("errors/error403", { replace: true });
            }
        }
    }, [permissionData, loading]); // eslint-disable-line react-hooks/exhaustive-deps

    if (permissionData.type === '14' || permissionData.type === '15') return (
        <LeaveAppForm
            userData={userData}
            setUserData={setUserData}
            permissionData={permissionData}
            status={status}
            setStatus={setStatus}
            prevData={false}
            setUpdShow={false}
            setDataList={false}
        />
    )

    return (
        // <Maintenance />
        <div className='d-flex flex-column justify-content-center align-items-center'>
            <h2 className='text-center text-white mb-2'>This page is under development</h2>
            <Image src={error01} alt="Under Development" />
        </div>
    )
}

export default LeaveApp;