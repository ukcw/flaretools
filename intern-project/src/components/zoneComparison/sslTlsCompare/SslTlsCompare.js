import React from "react";
import SslSetting from "./SslSetting";
import { Container, Heading, Stack } from "@chakra-ui/react";
import EdgeCertificates from "./EdgeCertificates";
import HttpStrictTransportSecurity from "./HttpStrictTransportSecurity";
import CustomHostnames from "./CustomHostnames";
import SslSubcategories from "./SslSubcategories";

/**
 *
 * @param {*} props
 * @returns
 */
const SslTlsCompare = (props) => {
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
        <Heading size="xl">SSL</Heading>
        <SslSetting />
        <EdgeCertificates />
        <HttpStrictTransportSecurity />
        <CustomHostnames />
        <SslSubcategories />
      </Stack>
    </Container>
  );
};

export default React.memo(SslTlsCompare);
