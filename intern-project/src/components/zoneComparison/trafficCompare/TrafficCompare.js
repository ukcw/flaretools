import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import LoadBalancers from "./LoadBalancers";

/**
 *
 * @param {*} props
 * @returns
 */

const TrafficCompare = (props) => {
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
        <Heading size="xl">Traffic</Heading>
        <LoadBalancers />
      </Stack>
    </Container>
  );
};

export default React.memo(TrafficCompare);
