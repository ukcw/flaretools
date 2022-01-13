import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  Heading,
  Stack,
  Container,
  Switch,
  HStack,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const NetworkWireframe = () => {
  return (
    <Container maxW="container.xl">
      <Stack
        spacing={8}
        borderColor="#ccc"
        borderWidth={0.1}
        borderRadius={10}
        padding={8}
        margin={8}
        boxShadow="0 0 3px #ccc"
      >
        <Heading size="xl">Network</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Network Subcategories</Heading>

          <Table>
            <Tr>
              <Th>HTTP/2</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>HTTP/3</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>0-RTT Connection Resumption</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>IPv6 Compatibility</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>gRPC</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>WebSockets</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Onion Routing</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Pseudo IPv4</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>IP Geolocation</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Maximum Upload Size</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Response Buffering</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th> True-Client-IP Header</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
          </Table>
        </Stack>
      </Stack>
    </Container>
  );
};

export default NetworkWireframe;
