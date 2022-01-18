import React from "react";
import SSLRecommendation from "./SSLRecommendation";
import SuccessfulDefault from "../SuccessfulDefault";
import SslSetting from "./SslSetting";

const SSLTLSViewer = (props) => {
  const titles = Object.keys(props.data);

  return titles.map((title) => {
    switch (title) {
      case "ssl_setting":
        return (
          <SslSetting
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="SSL Setting"
            key={title}
          />
        );
      case "ssl_recommendation":
        return (
          <SSLRecommendation
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            key={title}
          />
        );
      case "ssl_certificate_packs":
        return (
          <div>
            <h2>SSL Certificate Packs</h2>
            <p>temp</p>
          </div>
        );
      case "always_use_https":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Always Use HTTPS"
            key={title}
          />
        );
      case "min_tls_version":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Minimum TLS Version"
            key={title}
          />
        );
      case "opportunistic_encryption":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Opportunistic Encryption"
            key={title}
          />
        );
      case "tls_1_3":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="TLS 1.3"
            key={title}
          />
        );
      case "automatic_https_rewrites":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Automatic HTTPS Rewrites"
            key={title}
          />
        );
      case "ssl_universal":
        return (
          <SuccessfulDefault
            data={props.data[title]}
            errors={props.data[title].errors}
            success={props.data[title].success}
            title="Universal SSL"
            key={title}
          />
        );
      case "tls_client_auth":
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

export default SSLTLSViewer;
