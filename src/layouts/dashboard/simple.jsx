import React, { useEffect, memo, Fragment } from 'react'


//SimpleRouter 
// import SimpleRouter from '../../router/simple-router'

// store
import { Outlet } from 'react-router-dom'
import { Button } from 'react-bootstrap';
import SettingOffCanvas from '../../components/setting/SettingOffCanvas';

const Simple = memo((props) => {
    return (
        <Fragment>
            <div id="loading">
            </div>
            <div className="wrapper">
                <Outlet />
                <div id="back-to-top" style={{ display: "none" }}>
                    <Button size="xs" variant="primary  p-0 position-fixed top" href="#top">
                        <svg
                            width="30"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M5 15.5L12 8.5L19 15.5"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            ></path>
                        </svg>
                    </Button>
                </div>
            </div>
            <SettingOffCanvas name={true} />
        </Fragment>
    )
})

export default Simple
