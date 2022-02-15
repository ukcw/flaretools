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
  if (name === "argo_tiered_caching") {
    return "Argo Tiered Cache";
  } else if (name === "cache_level") {
    return "Caching Level";
  } else if (name === "browser_cache_ttl") {
    return "Browser Cache TTL";
  } else if (name === "crawlerhints") {
    return "Crawler Hints";
  } else if (name === "query_string_sort") {
    return "Enable Query String Sort";
  } else {
    return Humanize(name);
  }
};

const BrowserCacheOutput = (value) => {
  if (value === 0) {
    return "Respect Existing Headers";
  } else if (value < 60) {
    return `${value} seconds`;
  } else if (value === 60) {
    return `1 minute`;
  } else if (value === 3600) {
    return `1 hour`;
  } else if (value === 86400) {
    return `1 day`;
  } else if (value === 2678400) {
    return `1 month`;
  } else if (value >= 60 && value < 3600) {
    return `${value / 60} minutes`;
  } else if (value >= 3600 && value < 86400) {
    return `${value / 3600} hours`;
  } else if (value >= 86400 && value < 2678400) {
    return `${value / 86400} days`;
  } else if (value >= 2678400 && value < 31536000) {
    return `${value / 2678400} months`;
  } else {
    return "1 year";
  }
};

const CachingSubcategories = (props) => {
  const keys = Object.keys(props.data);
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Caching Subcategories</Heading>
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
            } else if (key === "crawlhints") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>
                    {props.data[key].result.cache.crawlhints_enabled ? (
                      <CheckIcon color={"green"} />
                    ) : (
                      <CloseIcon color={"red"} />
                    )}
                  </Td>
                </Tr>
              );
            } else if (key === "browser_cache_ttl") {
              return (
                <Tr key={key}>
                  <Th>{SettingName(key)}</Th>
                  <Td>{BrowserCacheOutput(props.data[key].result.value)}</Td>
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

export default CachingSubcategories;
