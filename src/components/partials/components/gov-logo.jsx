import React from 'react';
import { Image } from 'react-bootstrap';

import gov_logo from '../../../assets/images/board/gov_logo.png';

const GovLogo = (props) => {

    return (
        <>
            <Image src={gov_logo} alt='Government Logo' style={{ mixBlendMode: 'multiply' }} width="64px" height="64px" />
        </>
    )
}

export default GovLogo
