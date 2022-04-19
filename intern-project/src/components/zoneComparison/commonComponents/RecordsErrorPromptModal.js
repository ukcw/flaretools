import {
  Button,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  UnorderedList,
} from "@chakra-ui/react";

const RecordsErrorPromptModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  errorList,
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
            <Text>
              Some errors have occured, these records were not copied:
            </Text>
            <UnorderedList>
              ={" "}
              {errorList.map((errObj) => (
                <ListItem>
                  <Text fontWeight={"bold"}>{errObj.data}</Text>
                  Code: {errObj.code}
                  <br />
                  Message: {errObj.message}
                </ListItem>
              ))}
            </UnorderedList>
          </ModalBody>

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

export default RecordsErrorPromptModal;
