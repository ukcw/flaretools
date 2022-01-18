import {
  Heading,
  HStack,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { Humanize } from "../../utils/utils";

const CNAMEFlattening = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">CNAME Flattening</Heading>
      </HStack>
      <Table>
        <Thead>
          <Tr>
            <Th>Setting</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Td>CNAME Flattening</Td>
          <Td>{Humanize(props.data.result.value)}</Td>
        </Tbody>
      </Table>
    </Stack>
  );
};

export default CNAMEFlattening;