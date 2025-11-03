import React, { useState } from 'react'
import { Row, Col, Form, Button } from 'react-bootstrap'
// import { Image, ListGroup } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useSelector } from "react-redux"

import Card from '../../../components/Card'

import Logo from '../../../components/partials/components/logo'
// import SignupLogo from '../../../components/partials/components/signup-logo'
import * as SettingSelector from '../../../store/setting/selectors'
import styles from '../../../assets/custom/css/bisec.module.css'

// img
// import facebook from '../../../assets/images/brands/fb.svg'
// import google from '../../../assets/images/brands/gm.svg'
// import instagram from '../../../assets/images/brands/im.svg'
// import linkedin from '../../../assets/images/brands/li.svg'

import Error404 from '../errors/error404'

const SignUp = () => {
   const [validated, setvalidated] = useState(false);
   const handleSubmit = (event) => {
      const form = event.currentTarget;
      if (form.checkValidity() === false) {
         event.preventDefault();
         event.stopPropagation();
      }
      setvalidated(true);
   };

   const resetWarnings = (event) => {
      // const form = event.currentTarget;
      setvalidated(false);
   };

   const appShortName = useSelector(SettingSelector.app_short_name);

   if (!validated) return (
      <Error404 />
   )

   return (
      <>
         <section className={styles.bgImageLogin + " login-content"}>
            <Row className="m-0 d-flex justify-content-center align-items-center">
               {/* <Col md="6" className="d-md-flex justify-content-center align-items-center d-none bg-dark p-0 mt-n1 vh-100 overflow-hidden">
                  <SignupLogo className="flex-fill" color={true} />
               </Col> */}
               <Col md="6">
                  <Card className={styles.glassCard + " mb-0 auth-card"}>
                     <Card.Header className="bg-transparent d-flex flex-column justify-content-center mb-1">
                        <Link to="/dashboard" className="navbar-brand d-flex justify-content-center align-items-center">
                           <Logo color={true} />
                           <h1 className="logo-title text-white ms-3">{appShortName}</h1>
                        </Link>
                     </Card.Header>
                     <Card.Body>
                        <h4 className="my-3 text-white text-center">Register New Account</h4>
                        <Form noValidate validated={validated} onSubmit={handleSubmit} onReset={resetWarnings}>
                           <Row>
                              <Col md="12">
                                 <Form.Label htmlFor="user_name">Full Name</Form.Label>
                                 <Form.Control className='bg-transparent' type="text" id="user_name" maxLength="100" required />
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1'>
                                    Looks Good!
                                 </Form.Control.Feedback>
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                    Only Letters Allowed!
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_nid">NID</Form.Label>
                                 <Form.Control className='bg-transparent' type="text" id="user_nid" minLength="10" maxLength="17" required />
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1'>
                                    Looks Good!
                                 </Form.Control.Feedback>
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                    Only Numbers Allowed
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_mobile">Mobile</Form.Label>
                                 <Form.Control className='bg-transparent' type="text" id="user_mobile" minLength="11" maxLength="11" required />
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1'>
                                    Looks Good!
                                 </Form.Control.Feedback>
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                    Only Numbers Allowed
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_pass">Password</Form.Label>
                                 <Form.Control className='bg-transparent' type="password" id="user_pass" minLength="6" maxLength="30" required />
                                 {/* <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1'>
                                    Looks Good!
                                 </Form.Control.Feedback> */}
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                    Enter Password
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="6">
                                 <Form.Label htmlFor="user_re_pass">Re-Password</Form.Label>
                                 <Form.Control className='bg-transparent' type="password" id="user_re_pass" minLength="6" maxLength="30" required />
                                 {/* <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1'>
                                    Looks Good!
                                 </Form.Control.Feedback> */}
                                 <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                    Enter Same Password Again
                                 </Form.Control.Feedback>
                              </Col>
                              <Col md="12" className='py-2'>
                                 <Form.Check>
                                    <Form.Check.Input className="invalid" type="checkbox" id="user_cookie" required />
                                    <Form.Check.Label htmlFor="user_cookie">
                                       Agree Terms & Use of Board?
                                    </Form.Check.Label>
                                    <Form.Control.Feedback className='opacity-75 bg-white ps-3 rounded-1' type="invalid">
                                       You Must Accept Terms & Use of Board.
                                    </Form.Control.Feedback>
                                 </Form.Check>
                              </Col>
                           </Row>
                           <div className="d-flex justify-content-center gap-3">
                              <Button className='flex-fill' type="reset" variant="btn btn-danger">Reset</Button>
                              <Button className='flex-fill' type="submit" variant="btn btn-primary">Sign Up</Button>
                           </div>
                           <p className="mt-3 text-center">
                              Already Registered? <Link to="/auth/sign-in" className="text-secondary text-underline">Click here to Sign in.</Link>
                           </p>
                        </Form>
                     </Card.Body>
                  </Card>
               </Col>
            </Row>
         </section>
      </>
   )
}

export default SignUp
