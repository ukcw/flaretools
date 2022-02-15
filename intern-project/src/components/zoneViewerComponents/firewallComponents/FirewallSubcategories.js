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
import { Humanize, TimeToText } from "../../../utils/utils";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const FirewallSubcategories = (props) => {
  const keys = Object.keys(props.data);
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Firewall Subcategories</Heading>
      </HStack>
      <Table>
        <Tbody>
          {keys.map((key) => {
            if (props.data[key].success === false) {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>{props.data[key].messages}</Td>
                </Tr>
              );
            } else if (key === "challenge_passage") {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>{TimeToText(props.data[key].result.value)}</Td>
                </Tr>
              );
            } else if (key === "security_level") {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>{Humanize(props.data[key].result.value)}</Td>
                </Tr>
              );
            } else if (props.data[key].result.value === "on") {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>
                    <CheckIcon color={"green"} />
                  </Td>
                </Tr>
              );
            } else if (props.data[key].result.value === "off") {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>
                    <CloseIcon color={"red"} />
                  </Td>
                </Tr>
              );
            } else {
              return (
                <Tr key={key}>
                  <Th>{Humanize(key)}</Th>
                  <Td>{props.data[key].result.value}</Td>
                </Tr>
              );
            }
          })}
        </Tbody>
      </Table>
    </Stack>
  );
};

export default FirewallSubcategories;
