import { Heading, Stack, Text, VStack } from "@chakra-ui/react";
import React from "react";

const RightSidebar = (props) => {
  return (
    <VStack
      spacing={4}
      borderColor="#ccc"
      //borderWidth={0.1}
      borderRadius={10}
      mt={16}
      mr={16}
      //boxShadow="0 0 3px #ccc"
      bg="rgba(255,255,255,1)"
      display={"flex"}
    >
      <Stack
        spacing={2}
        w="100%"
        style={{
          position: "sticky",
          top: 20,
        }}
      >
        <Stack spacing={4} w="100%" p={4} boxShadow="0 0 3px #ccc">
          <Heading size="sm">Zone Name</Heading>
          <Text>{props.zoneName}</Text>
        </Stack>
      </Stack>
    </VStack>
  );
};

export default RightSidebar;
