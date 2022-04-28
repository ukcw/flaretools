import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";

const CopyExtraModal = ({
  isOpen,
  onOpen,
  onClose,
  handleExtra,
  handleClose,
  title,
  successMessage,
  copyMessage,
  copyButtonText,
}) => {
  return (
    <>
      {/* <Button onClick={onOpen}>Open Modal</Button> */}

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>
            <Text>{successMessage}</Text>
            <Text>{copyMessage}</Text>
          </ModalBody>

          <ModalFooter>
            <Button onClick={handleClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleExtra}>
              {copyButtonText}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CopyExtraModal;
