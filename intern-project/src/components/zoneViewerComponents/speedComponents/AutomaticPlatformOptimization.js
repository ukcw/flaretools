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
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const AutomaticPlatformOptimization = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">
          Automatic Platform Optimization for WordPress
        </Heading>
        {/*props.data.result.value === "off" && (
          <Switch isReadOnly isChecked={false} />
        )*/}
      </HStack>
      {props.data.result.value === "off" && (
        <UnsuccessfulDefault setting="Automatic Platform Optimization for WordPress" />
      )}
      {props.data.result.value !== "off" && (
        <Table>
          <Tbody>
            {Object.keys(props.data.result.value).map((key) => {
              if (key === "hostnames") {
                return (
                  <Tr key={key}>
                    <Th>{Humanize(key)}</Th>
                    <Td>{props.data.result.value.hostnames.join(", ")}</Td>
                  </Tr>
                );
              } else {
                return (
                  <Tr key={key}>
                    <Th>{Humanize(key)}</Th>
                    <Td>
                      {props.data.result.value[key] ? (
                        <CheckIcon color={"green"} />
                      ) : (
                        <CloseIcon color={"red"} />
                      )}
                    </Td>
                  </Tr>
                );
              }
            })}
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default AutomaticPlatformOptimization;
