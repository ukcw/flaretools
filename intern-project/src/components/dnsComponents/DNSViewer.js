import React, { useEffect, useState } from "react";
import Dnssec from "./Dnssec";
import DnsRecords from "./DnsRecords";
import NameServers from "./NameServers";
import { Container, Heading, Stack } from "@chakra-ui/react";
import CustomNs from "./CustomNs";
import CnameFlattening from "./CnameFlattening";
import { useZoneContext } from "../../lib/contextLib";
import { getZoneSetting } from "../../utils/utils";

const DnsViewer = (props) => {
  const { zoneId, apiToken } = useZoneContext();
  const [dnsData, setDnsData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/dns"
      );
      setDnsData(resp);
    }
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
        <Heading size="xl">DNS</Heading>
        {dnsData && <DnsRecords data={dnsData.dns_records} />}
        {dnsData && <NameServers data={dnsData.name_servers} />}
        {dnsData && <CustomNs data={dnsData.custom_ns} />}
        {dnsData && <Dnssec data={dnsData.dnssec} />}
        {dnsData && <CnameFlattening data={dnsData.cname_flattening} />}
      </Stack>
    </Container>
  );
};
export default DnsViewer;
