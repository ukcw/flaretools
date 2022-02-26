import React, { useEffect, useState } from "react";
//import Dnssec from "./Dnssec";
import DnsRecords from "./DnsRecords";
//import NameServers from "./NameServers";
import { Container, Heading, Stack } from "@chakra-ui/react";
//import CustomNs from "./CustomNs";
//import CnameFlattening from "./CnameFlattening";
import { useCompareContext } from "../../../lib/contextLib";
import { getMultipleZoneSettings } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import NameServers from "./NameServers";

const DnsCompare = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [dnsData, setDnsData] = useState();
  const [dnsRecords, setDnsRecords] = useState();

  useEffect(() => {
    // async function getData() {
    //   const resp = await getMultipleZoneSettings(zoneKeys, credentials, "/dns");
    //   setDnsData(resp);
    // }
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/dns_records"
      );
      setDnsData(resp);
    }
    setDnsData();
    getData();
  }, [credentials, zoneKeys]);

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
        <Heading size="xl" id="DNS">
          DNS
        </Heading>
        <DnsRecords />
        <NameServers />
        {/* {dnsData ? <CustomNs data={dnsData.custom_ns} /> : <LoadingBox />}
        {dnsData ? <Dnssec data={dnsData.dnssec} /> : <LoadingBox />}
        {dnsData ? (
          <CnameFlattening data={dnsData.cname_flattening} />
        ) : (
          <LoadingBox />
        )} */}
      </Stack>
    </Container>
  );
};
export default React.memo(DnsCompare);
