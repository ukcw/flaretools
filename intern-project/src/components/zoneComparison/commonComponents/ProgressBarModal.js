import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
} from "@chakra-ui/react";

const ProgressBarModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  progress,
  total,
}) => {
  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>
            {/* <Text>{}</Text> */}
            <Progress hasStripe isAnimated value={(progress / total) * 100} />
          </ModalBody>

          <ModalFooter>
            {/* <Button onClick={onClose} mr={3}>
              Close
            </Button> */}
            {/* <Button colorScheme="red" onClick={handleDelete}>
                  Delete
                </Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProgressBarModal;
