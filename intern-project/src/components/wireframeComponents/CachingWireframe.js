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

const CachingWireframe = () => {
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
        <Heading size="xl">Caching</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Caching Subcategories</Heading>
          <Table>
            <Tr>
              <Th>Argo Tiered Cache</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Tiered Cache Topology</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Caching Level</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Browser Cache TTL</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Crawler Hints</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Always Online</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Development Mode</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Enable Query String Sort</Th>
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

export default CachingWireframe;
