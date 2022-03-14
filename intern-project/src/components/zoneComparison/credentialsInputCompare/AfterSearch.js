import {
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

const AfterSearch = (props) => {
  return (
    <VStack
      spacing={8}
      borderColor="#ccc"
      borderWidth={0.1}
      borderRadius={10}
      mt={16}
      mr={16}
      boxShadow="0 0 3px #ccc"
      bg="rgba(255,255,255,1)"
    >
      <Stack spacing={4} w="100%" p={4}>
        <Heading size="md">Zone 1</Heading>
        <Text>{props.zone1name}</Text>
      </Stack>
      <Stack spacing={4} w="100%" p={4}>
        <Heading size="md">Zone 2</Heading>
        <Text>{props.zone2name}</Text>
      </Stack>
    </VStack>
  );
};

export default AfterSearch;
