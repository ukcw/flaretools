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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const SettingName = (name) => {
  if (name === "h2_prioritization") {
    return "Enhanced HTTP/2 Prioritization";
  } else if (name === "prefetch_preload") {
    return "Prefetch URLs";
  } else {
    return Humanize(name);
  }
};

const SpeedSubcategories = (props) => {
  const keys = Object.keys(props.data);
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Speed Subcategories</Heading>
      </HStack>
      <Table>
        <Tbody>
          {keys.map((key) => {
            if (props.data[key].success === false) {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>{props.data[key].messages}</Td>
                </Tr>
              );
            } else if (props.data[key].result.value === "on") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>
                    <CheckIcon color={"green"} />
                  </Td>
                </Tr>
              );
            } else if (props.data[key].result.value === "off") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>
                    <CloseIcon color={"red"} />
                  </Td>
                </Tr>
              );
            } else {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
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

export default SpeedSubcategories;
