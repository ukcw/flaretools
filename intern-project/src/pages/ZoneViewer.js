//import logo from "./logo.svg";
import React, { useState } from "react";
import DNSViewer from "../components/dnsComponents/DnsViewer";
import FirewallViewer from "../components/firewallComponents/FirewallViewer";
import {
  Button,
  Container,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import SpeedViewer from "../components/speedComponents/SpeedViewer";
import { ZoneContext } from "../lib/contextLib";
import CachingViewer from "../components/cachingComponents/CachingViewer";
import WorkersViewer from "../components/workersComponents/WorkersViewer";
import NetworkViewer from "../components/networkComponents/NetworkViewer";
import RulesViewer from "../components/rulesComponents/RulesViewer";
import TrafficViewer from "../components/trafficComponents/TrafficViewer";
import ScrapeShieldViewer from "../components/scrapeShieldComponents/ScrapeShieldViewer";
import SpectrumViewer from "../components/spectrumComponents/SpectrumViewer";
import SslTlsViewer from "../components/sslTlsComponents/SslTlsViewer";
import DnsViewer from "../components/dnsComponents/DnsViewer";

const getZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

function ZoneViewer() {
  const [zoneId, setZoneId] = useState("");
  const [zoneDetails, setZoneDetails] = useState();
  const [apiToken, setApiToken] = useState("");

  const [firewallData, setFirewallData] = useState();

  const search = async () => {
    const payload = {
      zoneId: zoneId,
      apiToken: `Bearer ${apiToken}`,
    };

    const zoneDetailsResults = await getZoneSetting(payload, "/zone_details");
    console.log(zoneDetailsResults);
    if (zoneDetailsResults.zone_details.success === false) {
      return alert("You have submitted invalid credentials.");
    }

    if (zoneDetailsResults.zone_details) {
      setZoneDetails(zoneDetailsResults.zone_details.result);
    }
    const firewallResults = await getZoneSetting(payload, "/firewall");
    setFirewallData((prevState) => ({
      ...prevState,
      ...firewallResults,
    }));
    // check deprecated firewall rules
    const deprecatedFirewall = await getZoneSetting(
      payload,
      "/firewall/deprecated"
    );
    setFirewallData((prevState) => ({
      ...prevState,
      ...deprecatedFirewall,
    }));
  };

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
        <InputGroup>
          <InputLeftAddon children="Zone ID" />
          <Input
            type="text"
            placeholder="Zone ID"
            onChange={(e) => setZoneId(e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Bearer" />
          <Input
            type="text"
            placeholder="API Token"
            onChange={(e) => setApiToken(e.target.value)}
          />
        </InputGroup>
        <Button onClick={search}>Search</Button>
      </Stack>
      {zoneDetails ? (
        <ZoneContext.Provider value={{ zoneDetails, zoneId, apiToken }}>
          <DnsViewer />
          <SslTlsViewer />
          {firewallData ? <FirewallViewer data={firewallData} /> : null}
          <SpeedViewer />
          <CachingViewer />
          <WorkersViewer />
          <RulesViewer />
          <NetworkViewer />
          <TrafficViewer />
          <ScrapeShieldViewer />
          <SpectrumViewer />
        </ZoneContext.Provider>
      ) : null}
    </Container>
  );
}

export default ZoneViewer;
