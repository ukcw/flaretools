import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { Heading, Stack, Table, Tbody, Td, Th, Tr } from "@chakra-ui/react";
import React from "react";

const RulesSubcategories = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Normalization Rules</Heading>
      <Table>
        <Tbody>
          <Tr>
            <Th>Normalize incoming URLs</Th>
            <Td>
              {props.data.result.rules[0].enabled ? (
                <CheckIcon color="green" />
              ) : (
                <CloseIcon color="red" />
              )}
            </Td>
          </Tr>
          <Tr>
            <Th>Normalize URLs to Origin</Th>
            <Td>
              {props.data.result.rules[1].enabled ? (
                <CheckIcon color="green" />
              ) : (
                <CloseIcon color="red" />
              )}
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
};

export default RulesSubcategories;
