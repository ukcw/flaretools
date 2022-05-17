import {
  Button,
  Checkbox,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Humanize } from "../../../utils/utils";

const BulkCopyDisplayModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  copyableSettings,
  handleCopy,
  nextModal,
  //   currentCount, // hacky patch for forcing a refresh on state change
}) => {
  const [userChosenSettings, setUserChosenSettings] = useState({});

  const handleOnChange = (settingName, checkBoxSelection, setUserSelection) => {
    setUserSelection((prevState) => {
      const newState = { ...prevState, [settingName]: checkBoxSelection };
      return newState;
    });
  };

  useEffect(() => {
    const initSettings = {};
    Object.keys(copyableSettings).forEach((setting) => {
      if (
        copyableSettings[setting] === undefined ||
        copyableSettings[setting] === false
      ) {
        initSettings[setting] = false;
      } else {
        initSettings[setting] = true;
      }
    });

    setUserChosenSettings(initSettings);
  }, [copyableSettings]);

  return (
    <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <List spacing={2}>
            {Object.keys(copyableSettings).map((setting, idx) => {
              if (
                copyableSettings[setting] === undefined ||
                copyableSettings[setting] === false
              ) {
                return (
                  <ListItem key={idx}>
                    <Checkbox
                      isChecked={userChosenSettings[setting]}
                      isDisabled
                    >
                      {Humanize(setting)}
                    </Checkbox>
                  </ListItem>
                );
              } else {
                return (
                  <ListItem key={idx}>
                    <Checkbox
                      isChecked={userChosenSettings[setting]}
                      onChange={(e) =>
                        handleOnChange(
                          setting,
                          e.target.checked,
                          setUserChosenSettings
                        )
                      }
                    >
                      {Humanize(setting)}
                    </Checkbox>
                  </ListItem>
                );
              }
            })}
          </List>
        </ModalBody>

        <ModalFooter>
          <Button
            onClick={() => {
              handleCopy(userChosenSettings);
              onClose();
              nextModal();
            }}
            mr={3}
          >
            Copy
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default BulkCopyDisplayModal;
