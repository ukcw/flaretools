import { Container } from "@chakra-ui/react";
import React from "react";
import CachingWireframe from "../components/wireframeComponents/CachingWireframe";
import DnsWireframe from "../components/wireframeComponents/DnsWireframe";
import NetworkWireframe from "../components/wireframeComponents/NetworkWireframe";
import RulesWireframe from "../components/wireframeComponents/RulesWireframe";
import SpeedWireframe from "../components/wireframeComponents/SpeedWireframe";
import SslTlsWireframe from "../components/wireframeComponents/SslTlsWireframe";
import WorkersWireframe from "../components/wireframeComponents/WorkersWireframe";

const WireframeZoneViewer = () => {
  return (
    <Container maxW="container.xl" p={0}>
      <DnsWireframe />
      <SslTlsWireframe />
      <SpeedWireframe />
      <CachingWireframe />
      <WorkersWireframe />
      <RulesWireframe />
      <NetworkWireframe />
    </Container>
  );
};

export default WireframeZoneViewer;
