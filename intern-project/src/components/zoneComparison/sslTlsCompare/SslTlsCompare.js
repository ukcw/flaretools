import React from "react";
import SslSetting from "./SslSetting";
import { Container, Heading, Stack } from "@chakra-ui/react";
import EdgeCertificates from "./EdgeCertificates";
import HttpStrictTransportSecurity from "./HttpStrictTransportSecurity";
import CustomHostnames from "./CustomHostnames";

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
        {/* {sslTlsData?.custom_hostnames !== undefined ? (
          <CustomHostnames data={sslTlsData.custom_hostnames} />
        ) : (
          <LoadingBox />
        )}
        {sslTlsData ? (
          <SslSubcategories
            data={{
              ssl_recommendation: sslTlsData.ssl_recommendation,
              always_use_https: sslTlsData.always_use_https,
              min_tls_version: sslTlsData.min_tls_version,
              opportunistic_encryption: sslTlsData.opportunistic_encryption,
              tls_1_3: sslTlsData.tls_1_3,
              automatic_https_rewrites: sslTlsData.automatic_https_rewrites,
              ssl_universal: sslTlsData.ssl_universal,
              tls_client_auth: sslTlsData.tls_client_auth,
            }}
          />
        ) : (
          <LoadingBox />
        )} */}
      </Stack>
    </Container>
  );
};

export default React.memo(SslTlsCompare);
