import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Stack,
  Container,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

const SslTlsWireframe = () => {
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
        <Heading size="xl">SSL/TLS</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">SSL Encryption Mode</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Value</Th>
                <Td></Td>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Th>Certificate</Th>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Edge Certificates</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Hosts</Th>
                <Th>Type</Th>
                <Th>Status</Th>
                <Th>Expires On</Th>
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
          <Heading size="md">HTTP Strict Transport Security (HSTS)</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Max Age</Th>
                <Td></Td>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Th>Include Subdomains</Th>
                <Td></Td>
              </Tr>
              <Tr>
                <Th>Preload</Th>
                <Td></Td>
              </Tr>
              <Tr>
                <Th>Nosniff</Th>
                <Td></Td>
              </Tr>
            </Tbody>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Custom Hostnames</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Custom Hostname</Th>
                <Th>SSL/TLS Certification Status</Th>
                <Th>Expires On</Th>
                <Th>Hostname Status</Th>
                <Th>Origin Server</Th>
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
          <Heading size="md">SSL Subcategories</Heading>
          <Table>
            <Tr>
              <Th>SSL/TLS Recommender</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Always Use HTTPS</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Minimum TLS Version</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Opportunistic Encryption</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>TLS 1.3</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Automatic HTTPS Rewrites</Th>
              <Td>
                <CloseIcon color="red" />
              </Td>
            </Tr>
            <Tr>
              <Th>Universal SSL</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Authenticated Origin Pulls</Th>
              <Td backgroundColor="red">
                <CloseIcon />
              </Td>
            </Tr>
          </Table>
        </Stack>
      </Stack>
    </Container>
  );
};

export default SslTlsWireframe;
