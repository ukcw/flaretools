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
import { Humanize } from "../../utils/utils";

const ValueName = (name) => {
  switch (name) {
    case "off":
      return "Off (not secure)";
    case "flexible":
      return "Flexible";
    case "full":
      return "Full";
    case "strict":
      return "Full (strict)";
    case "origin_pull":
      return "Strict (SSL-Only Origin Pull)";
    default:
      return null;
  }
};

const SslSetting = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">SSL Setting</Heading>
      </HStack>
      <Table>
        <Tbody>
          <Tr>
            <Th>Value</Th>
            <Td>{ValueName(props.data.result.value)}</Td>
          </Tr>
          <Tr>
            <Th>Certificate Status</Th>
            <Td>{Humanize(props.data.result.certificate_status)}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
};

export default SslSetting;
