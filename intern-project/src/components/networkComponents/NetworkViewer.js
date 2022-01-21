import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import NetworkSubcategories from "./NetworkSubcategories";

/**
 *
 * @param {*} props
 * @returns
 */

const NetworkViewer = (props) => {
  //const titles = Object.keys(props.data);

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
        <NetworkSubcategories data={props.data} />
      </Stack>
    </Container>
  );
};

export default NetworkViewer;
