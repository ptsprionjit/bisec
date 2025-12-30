import React from 'react'
import { Container } from 'react-bootstrap'
import { Link } from 'react-router-dom'

const Error401 = (props) => {
    return (
        <>
            <div className="gradient">
                <Container>
                    <h1 className={'m-0 p-0'} style={{ fontFamily: 'consolas', fontSize: '384px', fontWeight: 'bolder' }}>401</h1>
                    {props?.customMessage && <h2 className="m-0 p-0 my-2 text-white">{props.customMessage}</h2>}
                    {!props?.customMessage && <h2 className="m-0 p-0 my-2 text-white">এই পেইজে অননুমোদিত প্রবেশ নিষেধ</h2>}
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

export default Error401;
