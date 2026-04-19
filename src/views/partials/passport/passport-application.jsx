import React, { useState, useEffect } from 'react'
import { Image } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import error01 from '../../../assets/images/error/01.png'
import { useAuthProvider } from "../../../context/AuthContext.jsx";
import PassportAppForm from './application/passport-app.jsx';

const PassportApp = () => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
        dob_spouse: '', id_spouse: '', bn_child1: '', en_child1: '', id_gender_child1: '', dob_child1: '', id_child1: '', bn_child2: '', en_child2: '', id_gender_child2: '', dob_child2: '', id_child2: '',
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
        <PassportAppForm
            userData={userData}
            setUserData={setUserData}
            permissionData={permissionData}
            status={status}
            setStatus={setStatus}
            setHide={false}
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

export default PassportApp;