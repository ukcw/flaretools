import {
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import BulkCopyProgressModal from "../commonComponents/BulkCopyProgressModal";
import BulkCopyDisplayModal from "../commonComponents/BulkCopyDisplayModal";
import { BulkCopyResults, BulkCopyProgress } from "../../../utils/utils";
import _ from "lodash";

const AfterSearch = (props) => {
  const {
    isOpen: NotLoadedBarIsOpen,
    onOpen: NotLoadedBarOnOpen,
    onClose: NotLoadedBarOnClose,
  } = useDisclosure(); // Not Fully Loaded App Modal
  const {
    isOpen: NonEmptyPromptIsOpen,
    onOpen: NonEmptyPromptOnOpen,
    onClose: NonEmptyPromptOnClose,
  } = useDisclosure(); // NonEmptyPromptModal;
  const {
    isOpen: BulkCopyProgressIsOpen,
    onOpen: BulkCopyProgressOnOpen,
    onClose: BulkCopyProgressOnClose,
  } = useDisclosure(); // Not Fully Loaded App Modal
  const {
    isOpen: BulkCopyDisplayIsOpen,
    onOpen: BulkCopyDisplayOnOpen,
    onClose: BulkCopyDisplayOnClose,
  } = useDisclosure(); // Checkboxes for copying options

  const [copyResults, setCopyResults] = useState(BulkCopyResults);
  const [copyProgress, setCopyProgress] = useState(BulkCopyProgress);
  const [initiatedCopy, setInitiatedCopy] = useState(false);
  const [userSelection, setUserSelection] = useState({});

  const bulkCopySettings = (fnObj, settingsToCopy) => {
    NonEmptyPromptOnClose();

    const keys = Object.keys(fnObj);
    let doneLoading = true;

    const progKeys = Object.keys(copyProgress);
    progKeys.forEach((k) => {
      const settingKeys = Object.keys(copyProgress[k]);

      settingKeys.forEach((sKey) => {
        copyProgress[k][sKey] = undefined;
      });
    });

    if (doneLoading) {
      BulkCopyProgressOnOpen();
      setInitiatedCopy(true);
      for (let i = 0; i < keys.length; i++) {
        if (
          fnObj[keys[i]] !== undefined &&
          fnObj[keys[i]] !== false &&
          settingsToCopy[keys[i]] === true
        ) {
          fnObj[keys[i]](setCopyResults, setCopyProgress);
        }
      }
      // BulkCopyProgressOnClose();
      // keys.forEach((k) => fnObj[k]());
    } /*else {
      NotLoadedBarOnOpen();
    }*/
  };

  const userPrompt = () => {
    if (initiatedCopy) {
      BulkCopyProgressOnOpen();
      return;
    }

    BulkCopyDisplayOnOpen();
    // NonEmptyPromptOnOpen();
    return;
  };

  return (
    <VStack
      spacing={4}
      borderColor="#ccc"
      //borderWidth={0.1}
      borderRadius={10}
      mt={16}
      mr={16}
      //boxShadow="0 0 3px #ccc"
      bg="rgba(255,255,255,1)"
      display={"flex"}
    >
      <Stack
        spacing={2}
        w="100%"
        style={{
          position: "sticky",
          top: 20,
        }}
      >
        <Stack spacing={4} w="100%" p={4} boxShadow="0 0 3px #ccc">
          <Heading size="sm">Zone 1</Heading>
          <Text>{props.zone1name}</Text>
        </Stack>
        <Stack spacing={4} w="100%" p={4} boxShadow="0 0 3px #ccc">
          <Heading size="sm">Zone 2</Heading>
          <Text>{props.zone2name}</Text>
        </Stack>
        {/* <Button
          size={"sm"}
          onClick={() => bulkCopySettings(props.zoneBulkCopy)}
        > */}
        <Button size={"sm"} onClick={() => userPrompt()}>
          Bulk Copy
        </Button>
        {NotLoadedBarIsOpen && (
          <ErrorPromptModal
            isOpen={NotLoadedBarIsOpen}
            onOpen={NotLoadedBarOnOpen}
            onClose={NotLoadedBarOnClose}
            title={"Bulk Copying will be ready in a bit!"}
            errorMessage={
              "Please wait for the application to fully load the contents of your zones."
            }
          />
        )}
        {BulkCopyDisplayIsOpen && (
          <BulkCopyDisplayModal
            isOpen={BulkCopyDisplayIsOpen}
            onOpen={BulkCopyDisplayOnOpen}
            onClose={BulkCopyDisplayOnClose}
            title={`Configuration settings to copy from ${props.zone1name} to ${props.zone2name}`}
            copyableSettings={props.zoneBulkCopy}
            handleCopy={setUserSelection}
            nextModal={NonEmptyPromptOnOpen}
          />
        )}
        {NonEmptyPromptIsOpen && (
          <NonEmptyErrorModal
            isOpen={NonEmptyPromptIsOpen}
            onOpen={NonEmptyPromptOnOpen}
            onClose={NonEmptyPromptOnClose}
            handleDelete={() =>
              bulkCopySettings(props.zoneBulkCopy, userSelection)
            }
            title={`If there are existing records in ${props.zone2name}, they will be deleted.`}
            errorMessage={`To proceed with bulk copying configuration settings from ${props.zone1name} 
          to ${props.zone2name}, any existing records 
          in ${props.zone2name} needs to be deleted. This action is irreversible.`}
          />
        )}
        {BulkCopyProgressIsOpen && (
          <BulkCopyProgressModal
            isOpen={BulkCopyProgressIsOpen}
            onOpen={BulkCopyProgressOnOpen}
            onClose={BulkCopyProgressOnClose}
            title={"Your configurations are being copied"}
            progress={copyProgress}
            data={copyResults}
          />
        )}
      </Stack>
    </VStack>
  );
};

export default AfterSearch;
