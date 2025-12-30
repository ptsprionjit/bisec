import React, { Fragment } from "react";
import { Navigate } from "react-router-dom";
import { Row, Col } from "react-bootstrap";

import { FadeLoader } from "react-spinners";
import { useAuthProvider } from "./AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
    const { permissionData, loading } = useAuthProvider();
    if (loading) {
        return (
            <Fragment>
                <Row className="bg-white m-0 d-flex justify-content-center align-items-center" style={{ width: "100dvw", height: "100dvh" }}>
                    <Col md="auto" className="text-center">
                        <FadeLoader
                            color="#000000"
                            loading={true}
                        // margin={20}
                        // width={5}
                        // height={40}
                        />
                    </Col>
                </Row>
            </Fragment>
        );
    }

    if (!permissionData?.id) {
        return <Navigate to="/auth/sign-out" replace />;
    }

    return children;
};

export default ProtectedRoute;
