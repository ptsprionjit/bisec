import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Error403 = (props) => {
    return (
        <>
            <div className="gradient">
                <Container>
                    <h1 className='m-0 p-0 text-white' style={{ fontFamily: 'consolas', fontSize: '384px', fontWeight: 'bolder' }}>403</h1>
                    {props?.customMessage && <h2 className="m-0 p-0 my-2 text-white">{props.customMessage}</h2>}
                    {!props?.customMessage && <h2 className="m-0 p-0 my-2 text-white">এই সেবাটি আপনার জন্য অনুমোদিত/প্রযোজ্য নয়</h2>}
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

export default Error403;
