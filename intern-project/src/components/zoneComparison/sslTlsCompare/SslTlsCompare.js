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
        <SslSetting id="ssl_setting" />
        <EdgeCertificates id="edge_certificates" />
        <HttpStrictTransportSecurity id="http_strict_transport_security" />
        <CustomHostnames id="custom_hostnames" />
        <SslSubcategories id="ssl_subcategories" />
      </Stack>
    </Container>
  );
};

export default React.memo(SslTlsCompare);
