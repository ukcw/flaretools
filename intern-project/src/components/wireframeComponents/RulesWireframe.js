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

const RulesWireframe = () => {
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
        <Heading size="xl">Rules</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Page Rules</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Priority</Th>
                <Th>URL/Description</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Transform Rules: URL Rewrite</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Priority</Th>
                <Th>Description</Th>
                <Th>Target</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">
            Transform Rules: HTTP Request Header Modification
          </Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Priority</Th>
                <Th>Description</Th>
                <Th>Target</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">
            Transform Rules: HTTP Response Header Modification
          </Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Priority</Th>
                <Th>Description</Th>
                <Th>Target</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Rules Subcategories</Heading>
          <Table>
            <Tr>
              <Th>Normalize incoming URLs</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Normalize URLs to origin</Th>
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

export default RulesWireframe;
