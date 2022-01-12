import React from "react";
import SuccessfulDefault from "../SuccessfulDefault";

const FirewallViewer = (props) => {
  const titles = Object.keys(props.data);

  return titles.map((title) => {
    switch (title) {
      case "firewall_rules":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Firewall Rules"
            key={title}
          />
        );
      case "waf_setting":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="WAF Setting"
            key={title}
          />
        );
      case "setting_opportunistic_encryption":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Opportunistic Encryption"
            key={title}
          />
        );
      case "setting_tls_1_3":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="TLS 1.3"
            key={title}
          />
        );
      case "setting_automatic_https_rewrites":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Automatic HTTPS Rewrites"
            key={title}
          />
        );
      case "ssl_universal_setting":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Universal SSL"
            key={title}
          />
        );
      case "setting_tls_client_auth":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Authenticated Origin Pulls/TLS Client Auth"
            key={title}
          />
        );
      case "custom_hostnames":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title={title}
            key={title}
          />
        );
      default:
        return null;
    }
  });
};

export default FirewallViewer;
