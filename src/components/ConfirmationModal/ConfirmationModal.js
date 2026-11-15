import { Button, Modal, Spinner } from "react-bootstrap";
import "./ConfirmationModal.css";

const ConfirmationModal = ({
  show,
  title,
  message,
  confirmLabel = "Confirm",
  isConfirming = false,
  onCancel,
  onConfirm,
}) => (
  <Modal
    show={show}
    onHide={isConfirming ? undefined : onCancel}
    centered
    backdrop={isConfirming ? "static" : true}
    keyboard={!isConfirming}
    aria-labelledby="confirmation-modal-title"
    className="confirmation-modal"
  >
    <Modal.Header closeButton={!isConfirming}>
      <Modal.Title id="confirmation-modal-title">{title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>{message}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onCancel} disabled={isConfirming}>
        Cancel
      </Button>
      <Button variant="danger" onClick={onConfirm} disabled={isConfirming}>
        {isConfirming ? (
          <>
            <Spinner as="span" animation="border" size="sm" className="me-2" aria-hidden="true" />
            Deleting...
          </>
        ) : (
          confirmLabel
        )}
      </Button>
    </Modal.Footer>
  </Modal>
);

export default ConfirmationModal;
