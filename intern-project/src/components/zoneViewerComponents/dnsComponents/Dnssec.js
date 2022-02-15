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
import UnsuccessfulDefault from "../UnsuccessfulDefault";
import { Humanize } from "../../../utils/utils";
import { CloseIcon } from "@chakra-ui/icons";

const Dnssec = (props) => {
  const keys = Object.keys(props.data.result);

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">DNSSEC</Heading>
        {/*props.data.result.status === "disabled" && (
          <Switch isReadOnly isChecked={false} />
        )*/}
      </HStack>
      {props.data.result.status === "disabled" && (
        <UnsuccessfulDefault setting="DNSSEC" />
      )}
      {props.data.result.status !== "disabled" && (
        <Table>
          <Tbody>
            {keys.map((key) => {
              if (key !== "modified_on") {
                return (
                  <Tr key={key}>
                    <Th>{Humanize(key)}</Th>
                    <Td>
                      {props.data.result[key] ? (
                        props.data.result[key]
                      ) : (
                        <CloseIcon color={"red"} />
                      )}
                    </Td>
                  </Tr>
                );
              } else {
                return null;
              }
            })}
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default Dnssec;
