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
  if (name === "tls_1_3") {
    return "TLS 1.3";
  } else if (name === "tls_client_auth") {
    return "Authenticated Origin Pulls";
  } else {
    return Humanize(name);
  }
};

const SslSubcategories = (props) => {
  const keys = Object.keys(props.data);
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">SSL Subcategories</Heading>
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
            } else if (key === "ssl_universal") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>
                    {Humanize(props.data[key].result["certificate_authority"])}
                  </Td>
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

export default SslSubcategories;
