import React from 'react';
import { Image } from 'react-bootstrap';

import cb_logo from '../../../assets/images/brands/cb_logo.jpg';

const LogoMedium = (props) => {

    return (
        <>
            <Image src={cb_logo} alt='Board Logo' width="96px" height="96px" />
        </>
    )
}

export default LogoMedium
