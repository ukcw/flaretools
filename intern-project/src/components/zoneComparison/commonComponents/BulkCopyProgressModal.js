import {
  CheckCircleIcon,
  NotAllowedIcon,
  SpinnerIcon,
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
  Spacer,
  Spinner,
  Stack,
  Table,
  TableContainer,
  Text,
  Thead,
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
  const progressKeys = Object.keys(progress);

  return (
    <>
      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{title}</ModalHeader>
          {/* <ModalCloseButton /> */}
          <ModalBody pb={6}>
            {/* <Text>{}</Text> */}
            {/* <List>
              {progressKeys.map((setting) => {
                if (progress[setting].completed === undefined) {
                  // skip, component has not started copying
                  return
                } else if (progress[setting].completed === false) {
                  // copying has started but has not yet completed
                  const currentCount = progress[setting].progressTotal;
                  const totalCount = progress[setting].totalToCopy;
                  return (
                    <ListItem key={progress[setting]}>
                      <Text>{Humanize(setting)}</Text>
                      <Text>{Humanize(progress[setting].status)}</Text>
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
                  return (
                    <ListItem key={progress[setting]}>
                      <ListIcon as={CheckCircleIcon} color="green" />
                      {Humanize(setting)}
                    </ListItem>
                  );
                }
              })}
            </List> */}
            <Accordion allowMultiple allowToggle w="100%">
              {Object.keys(progress).map((key) => {
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
                    <ListItem key={progress[key]}>
                      <Text>{Humanize(key)}</Text>
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

                  if (data[key].errors.length > 0 && data[key].copied.length) {
                    progressIcon = <WarningIcon />;
                    returnComponent = (
                      <>
                        <Heading size={"sm"}>
                          Some records were copied but these had issues
                        </Heading>
                        <List>
                          {data[key].errors.map((err) => (
                            <ListItem key={err}>
                              <ListIcon as={WarningTwoIcon} color={"red"} />
                              <Stack>
                                <Text>{err.code}</Text>
                                <Text>{err.message}</Text>
                                <Text>{err.data}</Text>
                              </Stack>
                            </ListItem>
                          ))}
                        </List>
                        {/* {insert logic to display records copied} */}
                      </>
                    );
                  } else if (data[key].errors.length > 0) {
                    returnComponent = (
                      <>
                        <Heading size={"sm"}>Errors</Heading>
                        <List>
                          {data[key].errors.map((err) => (
                            <ListItem key={err}>
                              <ListIcon as={WarningTwoIcon} color={"red"} />
                              <Stack>
                                <Text>{err.code}</Text>
                                <Text>{err.message}</Text>
                                <Text>{err.data}</Text>
                              </Stack>
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
                  <AccordionItem key={key}>
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
