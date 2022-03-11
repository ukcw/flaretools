import {
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
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
      padding={8}
      margin={8}
      boxShadow="0 0 3px #ccc"
      bg="rgba(255,255,255,1)"
    >
      <Stack spacing={4} w="100%">
        <InputGroup>
          <InputLeftAddon children="Zone 1" minWidth={"90"} />
          <Input
            type="text"
            placeholder="Zone ID"
            defaultValue={props.zone1name}
            isReadOnly
          />
        </InputGroup>
      </Stack>
      <Stack spacing={4} w="100%">
        <InputGroup>
          <InputLeftAddon children="Zone 2" minWidth={"90"} />
          <Input
            type="text"
            placeholder="Zone ID"
            defaultValue={props.zone2name}
            isReadOnly
          />
        </InputGroup>
      </Stack>
    </VStack>
  );
};

export default AfterSearch;
