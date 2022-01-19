import React from "react";
import SslSetting from "./SslSetting";
import { Container, Heading, Stack } from "@chakra-ui/react";
import EdgeCertificates from "./EdgeCertificates";
import SslSubcategories from "./SslSubcategories";
import HttpStrictTransportSecurity from "./HttpStrictTransportSecurity";
import CustomHostnames from "./CustomHostnames";

/**
 *
 * @param {*} props
 * @returns
 */
const SSLTLSViewer = (props) => {
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
        <Heading size="xl">SSL</Heading>
        <SslSetting data={props.data.ssl_setting} />
        <EdgeCertificates data={props.data.ssl_certificate_packs} />
        {/*<SslSubcategories
        data={[
          {
            setting: "ssl_recommendation",
            data: props.data.ssl_recommendation,
          },
          {
            setting: "always_use_https",
            data: props.data.always_use_https,
          },
          {
            setting: "min_tls_version",
            data: props.data.min_tls_version,
          },
          {
            setting: "opportunistic_encryption",
            data: props.data.opportunistic_encryption,
          },
          { setting: "tls_1_3", data: props.data.tls_1_3 },
          {
            setting: "automatic_https_rewrites",
            data: props.data.automatic_https_rewrites,
          },
          { setting: "ssl_universal", data: props.data.ssl_universal },
          {
            setting: "tls_client_auth",
            data: props.data.tls_client_auth,
          },
        ]}
      />*/}
        <HttpStrictTransportSecurity data={props.data.security_header} />
        <CustomHostnames data={props.data.custom_hostnames} />
        <SslSubcategories
          data={{
            ssl_recommendation: props.data.ssl_recommendation,
            always_use_https: props.data.always_use_https,
            min_tls_version: props.data.min_tls_version,
            opportunistic_encryption: props.data.opportunistic_encryption,
            tls_1_3: props.data.tls_1_3,
            automatic_https_rewrites: props.data.automatic_https_rewrites,
            ssl_universal: props.data.ssl_universal,
            tls_client_auth: props.data.tls_client_auth,
          }}
        />
      </Stack>
    </Container>
  );
};

export default SSLTLSViewer;
