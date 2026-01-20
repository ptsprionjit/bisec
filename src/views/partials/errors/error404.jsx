import React from 'react'
import { Container, Image } from 'react-bootstrap'
import { Link } from 'react-router-dom'
// img
import error404 from '../../../assets/images/error/404.png'

const Error404 = (props) => {
    return (
        <>
            <div className="gradient">
                <Container>
                    <h1 className='m-0 p-0 text-white' style={{ fontFamily: 'consolas', fontSize: '384px', fontWeight: 'bolder' }}>404</h1>
                    {props?.customMessage && <h2 className="m-0 p-0 my-2 text-white">{props.customMessage}</h2>}
                    {!props?.customMessage &&
                        <>
                            <h2 className="m-0 p-0 my-2 text-white">দুঃখিত! আপনার পেজটি পাওয়া যায়নি!</h2>
                            <p className="m-0 p-0 my-2 text-white">আপানর আবেদনকৃত পেজটি নেই বা ভুল পেজ (URL) টাইপ করেছেন।</p>
                        </>
                    }
                    <Link className="btn bg-white text-primary d-inline-flex align-items-center my-4" to="/">বোর্ডের হোমে ফিরে যান</Link>
                </Container>
                <div className="box">
                    <div className="c xl-circle">
                        <div className="c lg-circle">
                            <div className="c md-circle">
                                <div className="c sm-circle">
                                    <div className="c xs-circle">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Error404;
