import React from 'react';
import { Image } from 'react-bootstrap';

import cb_logo from '../../../assets/images/brands/cb_logo.jpg';

const Logo = (props) => {

    return (
        <>
            <Image src={cb_logo} alt='Board Logo' width="48px" height="48px" />
        </>
    )
}

export default Logo
