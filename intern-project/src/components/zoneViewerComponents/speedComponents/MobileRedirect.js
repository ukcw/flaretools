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
import { useZoneContext } from "../../../lib/contextLib";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const MobileRedirect = (props) => {
  const { zoneDetails } = useZoneContext();
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Mobile Redirect</Heading>
        {/*props.data.result.value === "off" && (
          <Switch isReadOnly isChecked={false} />
        )*/}
      </HStack>
      {props.data.result.value === "off" && (
        <UnsuccessfulDefault setting="Mobile Redirect" />
      )}
      {props.data.result.value !== "off" && (
        <Table>
          <Tbody>
            <Tr>
              <Th>Mobile Optimized Website</Th>
              <Td>{`${props.data.result.value.mobile_subdomain}.${zoneDetails.name}`}</Td>
            </Tr>
            <Tr>
              <Th>Strip URI</Th>
              <Td>
                {props.data.result.value.strip_uri ? "Drop Path" : "Keep Path"}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default MobileRedirect;
