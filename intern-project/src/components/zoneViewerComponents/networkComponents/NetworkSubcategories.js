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
import { Humanize } from "../../../utils/utils";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

const SettingName = (name) => {
  if (name === "http2") {
    return "HTTP/2";
  } else if (name === "http3") {
    return "HTTP/3 (with QUIC)";
  } else if (name === "zero_rtt") {
    return "0-RTT Connection Resumption";
  } else if (name === "ipv6") {
    return "IPv6 Compatibility";
  } else if (name === "grpc") {
    return "gRPC";
  } else if (name === "websockets") {
    return "WebSockets";
  } else if (name === "opportunistic_onion") {
    return "Onion Routing";
  } else if (name === "pseudo_ipv4") {
    return "Psuedo IPv4";
  } else if (name === "ip_geolocation") {
    return "IP Geolocation";
  } else if (name === "max_upload") {
    return "Maximum Upload Size";
  } else if (name === "true_client_ip_header") {
    return "True-Client-IP-Header";
  } else {
    return Humanize(name);
  }
};

const MaxUploadOutput = (value) => {
  if (value === 100) {
    return "100 MB";
  } else if (value >= 125 && value < 225) {
    return `${value} (Business+)`;
  } else {
    return `${value} (Enterprise)`;
  }
};

const NetworkSubcategories = (props) => {
  const keys = Object.keys(props.data);
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Network Subcategories</Heading>
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
            } else if (key === "grpc") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>
                    {props.data[key].result.protocols.grpc ? (
                      <CheckIcon color={"green"} />
                    ) : (
                      <CloseIcon color={"red"} />
                    )}
                  </Td>
                </Tr>
              );
            } else if (key === "max_upload") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>{MaxUploadOutput(props.data[key].result.value)}</Td>
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

export default NetworkSubcategories;
