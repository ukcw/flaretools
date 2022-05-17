import {
  CheckCircleIcon,
  NotAllowedIcon,
  WarningIcon,
  WarningTwoIcon,
} from "@chakra-ui/icons";
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Button,
  Code,
  Divider,
  Heading,
  HStack,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
  Spinner,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Humanize } from "../../../utils/utils";

const BulkCopyProgressModal = ({
  isOpen,
  onOpen,
  onClose,
  title,
  progress,
  data,
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
            <Accordion allowMultiple allowToggle w="100%">
              {Object.keys(progress).map((key, idx) => {
                let returnComponent = null;
                let progressIcon = null;
                if (progress[key].completed === undefined) {
                  // skip, component has not started copying
                  progressIcon = <NotAllowedIcon />;
                } else if (progress[key].completed === false) {
                  // copying has started but has not yet completed
                  progressIcon = <Spinner />;
                  const currentCount = progress[key].progressTotal;
                  const totalCount = progress[key].totalToCopy;
                  const statusDisplay =
                    progress[key].status === "copy"
                      ? "Copying configuration records over"
                      : progress[key].status === "delete"
                      ? "Deleting prior configuration records"
                      : "";
                  returnComponent = (
                    <ListItem key={idx}>
                      <Text>{statusDisplay}</Text>
                      <Progress
                        hasStripe
                        isAnimated
                        value={(currentCount / totalCount) * 100}
                      />
                      <Divider />
                    </ListItem>
                  );
                } else {
                  // copying has completed
                  progressIcon = <CheckCircleIcon color="green" />;

                  if (
                    data[key].errors.length > 0 &&
                    data[key].copied.length > 0
                  ) {
                    progressIcon = <WarningIcon color={"orange"} />;
                    returnComponent = (
                      <>
                        <Heading size={"sm"}>
                          Some records were copied but these had issues
                        </Heading>
                        <List>
                          {data[key].errors.map((err, idx) => (
                            <ListItem key={idx}>
                              <HStack
                                borderColor="#ccc"
                                borderWidth={0.1}
                                borderRadius={10}
                                p={2}
                                m={3}
                                boxShadow="0 0 1px #ccc"
                                overflowWrap={"break-word"}
                                wordBreak={"break-word"}
                              >
                                <Stack>
                                  <ListIcon as={WarningTwoIcon} color={"red"} />
                                </Stack>
                                <Stack>
                                  {/* <Text fontWeight={"bold"}>
                                  {Humanize(err.data)}
                                </Text> */}
                                  <Text fontWeight={"bold"}>Data: </Text>
                                  <Code>
                                    {JSON.stringify(err.data, null, 2)}
                                  </Code>
                                  <Text fontWeight={"bold"}>Code: </Text>
                                  <Text>{err.code}</Text>
                                  <Text fontWeight={"bold"}>Message: </Text>
                                  <Text>{err.message}</Text>
                                </Stack>
                              </HStack>
                              {idx !== data[key].errors.length - 1 ? (
                                <Divider />
                              ) : null}
                            </ListItem>
                          ))}
                        </List>
                        {/* {insert logic to display records copied} */}
                      </>
                    );
                  } else if (data[key].errors.length > 0) {
                    progressIcon = <WarningTwoIcon color="red" />;
                    returnComponent = (
                      <>
                        <Heading size={"sm"}>Errors</Heading>
                        <List>
                          {data[key].errors.map((err) => (
                            <ListItem key={err}>
                              <HStack
                                borderColor="#ccc"
                                borderWidth={0.1}
                                borderRadius={10}
                                p={2}
                                m={3}
                                boxShadow="0 0 1px #ccc"
                                overflowWrap={"break-word"}
                                wordBreak={"break-word"}
                              >
                                <Stack>
                                  <ListIcon as={WarningTwoIcon} color={"red"} />
                                </Stack>
                                <Stack>
                                  {/* <Text fontWeight={"bold"}>{err.data}</Text> */}
                                  <Text fontWeight={"bold"}>Data: </Text>
                                  <Code>
                                    {JSON.stringify(err.data, null, 2)}
                                  </Code>
                                  <Text fontWeight={"bold"}>Code: </Text>
                                  <Text>{err.code}</Text>
                                  <Text fontWeight={"bold"}>Message: </Text>
                                  <Text>{err.message}</Text>
                                </Stack>
                              </HStack>
                              {idx !== data[key].errors.length - 1 ? (
                                <Divider />
                              ) : null}
                            </ListItem>
                          ))}
                        </List>
                      </>
                    );
                  } else {
                    returnComponent = (
                      <Text>
                        Your configuration settings for {Humanize(key)} were
                        successfully copied!
                      </Text>
                      // <ListItem key={progress[key]}>
                      //   <ListIcon as={CheckCircleIcon} color="green" />
                      //   {Humanize(key)}
                      // </ListItem>
                    );
                  }
                }
                return (
                  <AccordionItem key={idx}>
                    <h2>
                      <AccordionButton>
                        <AccordionIcon />
                        <Box
                          flex="1"
                          textAlign="left"
                          display={"flex"}
                          justifyContent={"space-between"}
                        >
                          <Text>{Humanize(key)}</Text>
                          {progressIcon}
                        </Box>
                      </AccordionButton>
                    </h2>
                    <AccordionPanel pb={4}>
                      <List>{returnComponent}</List>
                    </AccordionPanel>
                  </AccordionItem>
                );
              })}
            </Accordion>
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

export default BulkCopyProgressModal;
