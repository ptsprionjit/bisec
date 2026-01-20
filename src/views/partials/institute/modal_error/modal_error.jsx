import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";

import styles from "../../../../assets/custom/css/bisec.module.css";

import { DEFAULT_BN_ERROR } from '../data/default_data';

const ModalView = ({ modalError, setModalError, userDataError }) => {
    if (!modalError) return null;

    const [bnError, setBnError] = useState(DEFAULT_BN_ERROR);

    return (
        <Modal
            show={modalError}
            onHide={() => setModalError(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className={styles.SiyamRupaliFont}>
                        নিচের তথ্য/তথ্যগুলো সঠিকভাবে এন্ট্রি করতে হবে
                    </span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {Object.entries(userDataError).map(([field, error]) => (
                    <i className="text-danger" key={field}>
                        {bnError[field]},{" "}
                    </i>
                ))}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalError(false)}>
                    ফিরে যান
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalView;
