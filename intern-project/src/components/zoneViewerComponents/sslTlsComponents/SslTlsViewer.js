import React, { useEffect, useState } from "react";
import SslSetting from "./SslSetting";
import { Container, Heading, Stack } from "@chakra-ui/react";
import EdgeCertificates from "./EdgeCertificates";
import SslSubcategories from "./SslSubcategories";
import HttpStrictTransportSecurity from "./HttpStrictTransportSecurity";
import CustomHostnames from "./CustomHostnames";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

/**
 *
 * @param {*} props
 * @returns
 */
const SslTlsViewer = (props) => {
  const { zoneId, apiToken } = useZoneContext();
  const [sslTlsData, setSslTlsData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/ssl_tls"
      );
      setSslTlsData(resp);
    }
    setSslTlsData();
    getData();
  }, [apiToken, zoneId]);

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
        {sslTlsData?.ssl_setting !== undefined ? (
          <SslSetting data={sslTlsData.ssl_setting} />
        ) : (
          <LoadingBox />
        )}
        {sslTlsData?.ssl_certificate_packs !== undefined ? (
          <EdgeCertificates data={sslTlsData.ssl_certificate_packs} />
        ) : (
          <LoadingBox />
        )}
        {sslTlsData?.security_header !== undefined ? (
          <HttpStrictTransportSecurity data={sslTlsData.security_header} />
        ) : (
          <LoadingBox />
        )}
        {sslTlsData?.custom_hostnames !== undefined ? (
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
        )}
      </Stack>
    </Container>
  );
};

export default React.memo(SslTlsViewer);
