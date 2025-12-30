import React, { memo, Fragment, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Row, Col } from 'react-bootstrap'

//img
import topHeader from '../../../../assets/images/dashboard/top-header.png'
import topHeader1 from '../../../../assets/images/dashboard/top-header1.png'
import topHeader2 from '../../../../assets/images/dashboard/top-header2.png'
import topHeader3 from '../../../../assets/images/dashboard/top-header3.png'
import topHeader4 from '../../../../assets/images/dashboard/top-header4.png'
import topHeader5 from '../../../../assets/images/dashboard/top-header5.png'
import { useAuthProvider } from '../../../../context/AuthContext'
import { FadeLoader } from "react-spinners";

const SubHeader = memo((props) => {
    const { permissionData, loading } = useAuthProvider();
    const navigate = useNavigate();

    useEffect(() => {
        if (loading) {
            return;
        }

        if (!permissionData) {
            navigate("/auth/sign-out", { replace: true });
        }
    }, [permissionData, loading]);// eslint-disable-line react-hooks/exhaustive-deps

    if (loading) {
        return (
            <Fragment>
                <Row data-aos="fade-up" data-aos-delay="100" className=' m-0 p-0'>
                    <Col md={12} className="vw-100 vh-100 d-flex justify-content-center align-items-center">
                        <FadeLoader
                            color="#000000"
                            loading={true}
                            radius={15}
                            width={5}
                            height={20}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }

    return (
        <Fragment>
            <div className="iq-navbar-header" style={{ height: "150px" }}>
                {/* <Container fluid className=" iq-container">
                    <Row>
                        <Col md="12">
                            <div className="d-flex justify-content-between flex-wrap">
                                <h3>WELCOME <i className='text-uppercase'>{window.localStorage.getItem("ceb_user_name")}</i></h3>
                            </div>
                        </Col>
                    </Row>
                </Container> */}
                {/* {{!-- rounded-bottom if not using animation --}} */}
                <div className="iq-header-img">
                    <img src={topHeader} alt="header" className="theme-color-default-img img-fluid w-100 h-100 animated-scaleX" />
                    <img src={topHeader1} alt="header" className=" theme-color-purple-img img-fluid w-100 h-100 animated-scaleX" />
                    <img src={topHeader2} alt="header" className="theme-color-blue-img img-fluid w-100 h-100 animated-scaleX" />
                    <img src={topHeader3} alt="header" className="theme-color-green-img img-fluid w-100 h-100 animated-scaleX" />
                    <img src={topHeader4} alt="header" className="theme-color-yellow-img img-fluid w-100 h-100 animated-scaleX" />
                    <img src={topHeader5} alt="header" className="theme-color-pink-img img-fluid w-100 h-100 animated-scaleX" />
                </div>
            </div>
        </Fragment>
    )
})

export default SubHeader
