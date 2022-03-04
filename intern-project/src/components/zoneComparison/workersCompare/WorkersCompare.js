import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import HttpRoutes from "./HttpRoutes";

/**
 *
 * @param {*} props
 * @returns
 */

const WorkersCompare = (props) => {
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
        <Heading size="xl">Workers</Heading>
        <HttpRoutes />
      </Stack>
    </Container>
  );
};

export default React.memo(WorkersCompare);
