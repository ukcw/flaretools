import React from "react";
import DNSRecords from "./DNSRecords";
import NameServers from "./NameServers";
import CustomNS from "./CustomNS";
import Dnssec from "./Dnssec";
import CNAMEFlattening from "./CNAMEFlattening";
import DnsRecordsRT from "./DnsRecordsRT";
import NameServersRT from "./NameServersRT";
import { Container, Stack } from "@chakra-ui/react";
import CustomNsRT from "./CustomNsRT";

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
        {titles.map((title) => {
          switch (title) {
            case "dns_records":
              return (
                <DnsRecordsRT
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "name_servers":
              return (
                <NameServersRT
                  data={props.data[title]}
                  errors={props.data[title].errors}
                  success={props.data[title].success}
                  key={title}
                />
              );
            case "custom_ns":
              return (
                <CustomNsRT
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
                <CNAMEFlattening
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
