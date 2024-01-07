import React, { useState } from 'react'
import { Modal, Button } from 'react-bootstrap'
import "./TableButton.css"

const ACTIVE = "outline-primary"
const INACTIVE = "outline-secondary"

const TableButton = ({ active, title, modalBody, modalDialogClassName, apply, cancel, ...props }) => {
    
    const [showModal, setShowModal] = useState(false)

    // All the modal components will only run/render if
    // modalBody is provided.
    const handleClose = () => setShowModal(false)
    const handleOpen = () => setShowModal(true)

    let buttonVariant = active ? ACTIVE : INACTIVE 

    const createModalContent = () => (
        <Modal 
        dialogClassName={modalDialogClassName}  
        show={showModal} 
        onHide={() => {
            cancel()
            handleClose()
        }}
        centered>
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
                <Modal.Body className="table-modal-body">
                    <div className="table-modal-body-liner">
                        {modalBody}
                    </div>
                </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-primary" onClick={() => {
                    handleClose()
                    apply()
                }}>
                    Apply
                </Button>
                <Button variant="outline-secondary" onClick={() => {
                    handleClose()
                    cancel()
                }}>
                    Cancel
                </Button>
            </Modal.Footer>
        </Modal>
    )

    return (
        <>
            <Button className="table-button" variant={buttonVariant} onClick={handleOpen}  {...props}>
                {title}
            </Button>
            {modalBody ? createModalContent() : <></>}
        </>

    )
}

export default TableButton