import { Heading, HStack, Spacer, Stack, Switch } from "@chakra-ui/react";
import React from "react";

const RulesSubcategories = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Normalize incoming URLs</Heading>
        {
          <Switch
            isReadOnly
            colorScheme={"green"}
            isChecked={props.data.result.rules[0].enabled}
          />
        }
      </HStack>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Normalize URLs to Origin</Heading>
        {
          <Switch
            isReadOnly
            colorScheme={"green"}
            isChecked={props.data.result.rules[1].enabled}
          />
        }
      </HStack>
    </Stack>
  );
};

export default RulesSubcategories;
