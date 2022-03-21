import {
  Heading,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const OutputValue = (value) => {
  if (value === "on") {
    return <CheckIcon color={"green"} />;
  } else if (value === "off") {
    return <CloseIcon color={"red"} />;
  } else {
    return "An error has occurred.";
  }
};

const Minify = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Minify
        </Heading>
      </HStack>
      <Table>
        <Tbody>
          <Tr>
            <Th>HTML</Th>
            <Td>{OutputValue(props.data.result.value.html)}</Td>
          </Tr>
          <Tr>
            <Th>CSS</Th>
            <Td>{OutputValue(props.data.result.value.css)}</Td>
          </Tr>
          <Tr>
            <Th>JS</Th>
            <Td>{OutputValue(props.data.result.value.js)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
};

export default Minify;
