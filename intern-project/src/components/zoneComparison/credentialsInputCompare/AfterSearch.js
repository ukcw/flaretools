import {
  Button,
  Heading,
  Stack,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";

const AfterSearch = (props) => {
  const {
    isOpen: NotLoadedBarIsOpen,
    onOpen: NotLoadedBarOnOpen,
    onClose: NotLoadedBarOnClose,
  } = useDisclosure(); // Not Fully Loaded App Modal

  function bulkCopySettings(fnObj) {
    const keys = Object.keys(fnObj);

    let doneLoading = true;

    keys.forEach((k) => {
      if (fnObj[k] === undefined) {
        doneLoading = false;
      }
    });

    if (doneLoading) {
      keys.forEach((k) => fnObj[k]());
    } else {
      NotLoadedBarOnOpen();
    }
    console.log("done");
  }
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
        <Button
          size={"sm"}
          onClick={() => bulkCopySettings(props.zoneBulkCopy)}
        >
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
      </Stack>
    </VStack>
  );
};

export default AfterSearch;
