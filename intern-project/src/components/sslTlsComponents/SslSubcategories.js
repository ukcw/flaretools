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
        {/*<Tbody>
          <Tr>
            <Th>SSL/TLS Recommender</Th>
            <Td>{props.data.ssl_recommendation.result}</Td>
          </Tr>
          <Tr>
            <Th>Always Use HTTPS</Th>
            <Td>{props.data.always_use_https.result}</Td>
          </Tr>
          <Tr>
            <Th>Minimum TLS Version</Th>
            <Td>{props.data.min_tls_version.result}</Td>
          </Tr>
          <Tr>
            <Th>Opportunistic Encryption</Th>
            <Td>{props.data.opportunistic_encryption.result}</Td>
          </Tr>
          <Tr>
            <Th>TLS 1.3</Th>
            <Td>{props.data.tls_1_3.result}</Td>
          </Tr>
          <Tr>
            <Th>Automatic HTTPS Rewrites</Th>
            <Td>{props.data.automatic_https_rewrites.result}</Td>
          </Tr>
          <Tr>
            <Th>Universal SSL</Th>
            <Td>{props.data.ssl_universal.result}</Td>
          </Tr>
          <Tr>
            <Th>Authenticated Origin Pulls</Th>
            <Td backgroundColor="red">{props.data.tls_client_auth.result}</Td>
          </Tr>
        </Tbody>*/}
        {/*<Tbody>
          {props.data.map((key) => {
            if (key.setting === "ssl_universal") {
              return (
                <Tr key={key.setting}>
                  <Th>{Humanize(key.setting)}</Th>
                  <Td>{Humanize(key.data.result["certificate_authority"])}</Td>
                </Tr>
              );
            } else if (key.data.result.value === "on") {
              return (
                <Tr key={key.setting}>
                  <Th>{Humanize(key.setting)}</Th>
                  <Td>
                    <CheckIcon color={"green"} />
                  </Td>
                </Tr>
              );
            } else if (key.data.result.value === "off") {
              return (
                <Tr key={key.setting}>
                  <Th>{Humanize(key.setting)}</Th>
                  <Td>
                    <CloseIcon color={"red"} />
                  </Td>
                </Tr>
              );
            } else {
              return (
                <Tr key={key.setting}>
                  <Th>{Humanize(key.setting)}</Th>
                  <Td>{key.data.result.value}</Td>
                </Tr>
              );
            }
          })}
        </Tbody>*/}
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
