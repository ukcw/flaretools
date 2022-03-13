import React from "react";
import DnsRecords from "./DnsRecords";
import { Container, Heading, Stack } from "@chakra-ui/react";
import NameServers from "./NameServers";
import CustomNs from "./CustomNs";
import Dnssec from "./Dnssec";
import CnameFlattening from "./CnameFlattening";

const DnsCompare = (props) => {
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
        <DnsRecords id="dns_management" />
        <NameServers id="cloudflare_nameservers" />
        <CustomNs id="custom_nameservers" />
        <Dnssec id="dnssec" />
        <CnameFlattening id="cname_flattening" />
      </Stack>
    </Container>
  );
};
export default React.memo(DnsCompare);
