import React from 'react';
import { Image } from 'react-bootstrap';

import Login from '../../../assets/images/auth/login1.png';

const LoginLogo = (props) => {

    return (
        <>
            <Image src={Login} alt='Board Login Logo' width="100%" height="100%"/>
        </>
    )
}

export default LoginLogo;