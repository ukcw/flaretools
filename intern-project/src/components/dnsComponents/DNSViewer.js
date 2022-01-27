import React from "react";
import Dnssec from "./Dnssec";
import DnsRecords from "./DnsRecords";
import NameServers from "./NameServers";
import { Container, Heading, Stack } from "@chakra-ui/react";
import CustomNs from "./CustomNs";
import CnameFlattening from "./CnameFlattening";

const DNSViewer = (props) => {
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
        <Heading size="xl">DNS</Heading>
        {titles.map((title) => {
          switch (title) {
            case "dns_records":
              return (
                <DnsRecords
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "name_servers":
              return (
                <NameServers
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "custom_ns":
              return (
                <CustomNs
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "dnssec":
              return (
                <Dnssec
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "cname_flattening":
              return (
                <CnameFlattening
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            default:
              return null;
          }
        })}
      </Stack>
    </Container>
  );
};
export default DNSViewer;
