import { Container, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import SuccessfulDefault from "../SuccessfulDefault";
import WebAppFirewall from "./WebAppFirewall";

const FirewallViewer = (props) => {
  const titles = Object.keys(props.data);

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
        <Heading size="xl">Firewall</Heading>
        {console.log(props.data)}
        {console.log("lalal", props.data.managed_rulesets_results)}
        <WebAppFirewall
          data={{
            waf_setting: props.data.waf_setting,
            managed_rulesets_results: props.data.managed_rulesets_results,
          }}
        />
      </Stack>
    </Container>
  );
};

export default FirewallViewer;
