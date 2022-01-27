import { CheckIcon } from "@chakra-ui/icons";
import { Stack, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React from "react";

const SuccessfulDefault = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <Table>
        <Thead>
          <Tr>
            <Th>Setting</Th>
            <Th>Value</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{props.setting}</Td>
            <Td>{<CheckIcon color={"red"} />}</Td>
          </Tr>
        </Tbody>
      </Table>
    </Stack>
  );
};

export default SuccessfulDefault;
