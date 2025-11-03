import React from 'react';
import { Image } from 'react-bootstrap';

import Signup from '../../../assets/images/auth/registrar2.png';

const SignupLogo = (props) => {

    return (
        <>
            <Image src={Signup} alt='Board Signup Logo' width="100%" height="100%" />
        </>
    )
}

export default SignupLogo;