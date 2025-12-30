import React from 'react'
import { Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'

import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css';

import { useAuthProvider } from "../../../context/AuthContext.jsx";
import axiosApi from "../../../lib/axiosApi.jsx";

const PrintAdmitCard = () => {
   const { permissionData, loading } = useAuthProvider();
   const navigate = useNavigate();

   /* On mount: fetch profile & dashboard (use stored dashBoardData when possible) */
   useEffect(() => {
      let mounted = true;
      (async () => {
         if (!(((permissionData?.office === '03') && (permissionData?.role === '15')) || permissionData?.role === '16' || permissionData?.role === '17' || permissionData?.role === '18' || permissionData?.type === '13')) {
            navigate('/errors/error404', { replace: true });
         }
      })();
      return () => { mounted = false; };
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [permissionData, loading]); // run only once on mount

   return (
      <>
         <div className='bg-white login-content d-flex flex-column justify-content-center align-content-center'>
            <Row className="m-0 d-flex justify-content-center align-items-center bg-white">
               <Col md="8">
                  <Card className="card-transparent shadow-none d-flex justify-content-center mb-0 auth-card">
                     <Card.Body>
                        <h4 className={styles.SolaimanLipiFont + " text-wrap text-center"}>This page is under maintanance!</h4>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </div>
      </>
   )
}

export default PrintAdmitCard
