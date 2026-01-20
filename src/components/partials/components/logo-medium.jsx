import React from 'react';
import { Image } from 'react-bootstrap';

import cb_logo from '../../../assets/images/brands/cb_logo.jpg';

const LogoMedium = (props) => {

    return (
        <>
            <Image src={cb_logo} alt='Board Logo' style={{ mixBlendMode: 'multiply' }} width="64px" height="64px" />
        </>
    )
}

export default LogoMedium
