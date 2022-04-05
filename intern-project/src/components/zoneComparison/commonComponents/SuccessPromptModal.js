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

const SuccessPromptModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  successMessage,
}) => {
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>{successMessage}</ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Close
            </Button>
            {/* <Button colorScheme="red" onClick={handleDelete}>
                Delete
              </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SuccessPromptModal;
