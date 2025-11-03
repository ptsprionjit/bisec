import React from 'react';
import { Image } from 'react-bootstrap';

import gov_logo from '../../../assets/images/board/gov_logo.png';

const GovLogo = (props) => {

    return (
        <>
            <Image src={gov_logo} alt='Govt. Logo' width="96px" height="96px" />
        </>
    )
}

export default GovLogo
