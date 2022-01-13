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

const SpeedWireframe = () => {
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
        <Heading size="xl">Speed</Heading>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Speed Subcategories</Heading>
          <Table>
            <Tr>
              <Th>Enable Mirage</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Image Resizing</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Polish</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Brotli</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Early Hints</Th>
              <Td>
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Automatic Platform Optimization for WordPress</Th>
              <Td>
                <CloseIcon color="red" />
              </Td>
            </Tr>
            <Tr>
              <Th>Enhanced HTTP/2 Prioritization</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>Rocket Loader</Th>
              <Td backgroundColor="red">
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Prefetch URLs</Th>
              <Td backgroundColor="red">
                <CloseIcon />
              </Td>
            </Tr>
            <Tr>
              <Th>Mobile Redirect</Th>
              <Td backgroundColor="red">
                <CloseIcon />
              </Td>
            </Tr>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Minify</Heading>
          <Table>
            <Tr>
              <Th>HTML</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>CSS</Th>
              <Td></Td>
            </Tr>
            <Tr>
              <Th>JS</Th>
              <Td></Td>
            </Tr>
          </Table>
        </Stack>
        <Stack w="100%" spacing={4}>
          <Heading size="md">Railgun</Heading>
          <Table>
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Railgun</Th>
                <Th>Connected to Website</Th>
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
      </Stack>
    </Container>
  );
};

export default SpeedWireframe;
