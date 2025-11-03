import React from 'react'
import { Row, Col } from 'react-bootstrap'

import Card from '../../../components/Card'

import styles from '../../../assets/custom/css/bisec.module.css';

const PrintTcOrder = () => {

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

export default PrintTcOrder
