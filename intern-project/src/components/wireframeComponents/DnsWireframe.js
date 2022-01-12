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

const DnsWireframe = () => {
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
        <Heading size="xl">DNS</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">DNS Management</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Name</Th>
                <Th>Content</Th>
                <Th>Proxied</Th>
                <Th>TTL</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
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
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Cloudflare Nameservers</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Type</Th>
                <Th>Value</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
              </Tr>
              <Tr>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Custom Nameservers</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Nameserver</Th>
                <Th>IPv4 Address</Th>
                <Th>IPv6 Address</Th>
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
          <Heading size="md">DNSSEC</Heading>
          {/*<Table>
            <Thead>
              <Tr>
                <Th>Algorithm</Th>
                <Th>Digest</Th>
                <Th>Digest Algorithm</Th>
                <Th>Digest Type</Th>
                <Th>DS</Th>
                <Th>Flags</Th>
                <Th>Key Tag</Th>
                <Th>Key Type</Th>
                <Th>Public Key</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>*/}
          <Table>
            <Tr>
              <Th>Algorithm</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Digest</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Digest Algorithm</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Digest Type</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>DS</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Flags</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Key Tag</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Key Type</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Public Key</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Status</Th>
              <Td></Td>
            </Tr>
          </Table>
        </Stack>
        <HStack w="100%" spacing={4}>
          <Heading size="md">CNAME Flattening</Heading>
          <Switch isReadOnly isChecked={false} />
        </HStack>
      </Stack>
    </Container>
  );
};

export default DnsWireframe;
