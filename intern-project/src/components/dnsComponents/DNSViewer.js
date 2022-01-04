import React from "react";
import DNSRecords from "./DNSRecords";
import NameServers from "./NameServers";
import CustomNS from "./CustomNS";
import DNSSEC from "./DNSSEC";
import CNAMEFlattening from "./CNAMEFlattening";

const DNSViewer = (props) => {
  const titles = Object.keys(props.data);

  return titles.map((title) => {
    switch (title) {
      case "dns_records":
        return (
          <DNSRecords
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
          <CustomNS
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            key={title}
          />
        );
      case "dnssec":
        return (
          <DNSSEC
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
  });
};
export default DNSViewer;
