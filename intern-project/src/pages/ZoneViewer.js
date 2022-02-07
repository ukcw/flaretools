//import logo from "./logo.svg";
import React, { useRef, useState } from "react";
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
  //const [searchApiToken, setSearchApiToken] = useState("");
  //const [searchZoneId, setSearchZoneId] = useState("");
  const searchApiToken = useRef("");
  const searchZoneId = useRef("");

  const search = async () => {
    console.log(searchZoneId.current);
    console.log(searchApiToken.current);
    const payload = {
      zoneId: searchZoneId.current,
      apiToken: `Bearer ${searchApiToken.current}`,
    };

    setZoneId(searchZoneId.current);
    setApiToken(searchApiToken.current);
    const zoneDetailsResults = await getZoneSetting(payload, "/zone_details");
    if (zoneDetailsResults.zone_details.success === false) {
      return alert("You have submitted invalid credentials.");
    }

    if (zoneDetailsResults.zone_details) {
      setZoneDetails(zoneDetailsResults.zone_details.result);
    }
  };

  /*const handleChange = (name, text) => {
    name === "zone_id" ? (searchZoneId = text) : (searchApiToken = text);
  };*/

  return (
    <Container maxW="container.xl" p={8}>
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
            onChange={(e) => (searchZoneId.current = e.target.value)}
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Bearer" />
          <Input
            type="text"
            placeholder="API Token"
            onChange={(e) => (searchApiToken.current = e.target.value)}
          />
        </InputGroup>
        <Button onClick={search}>Search</Button>
      </Stack>
      {zoneDetails ? (
        <ZoneContext.Provider value={{ zoneDetails, zoneId, apiToken }}>
          <DnsViewer />
          <SslTlsViewer />
          <FirewallViewer />
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

export default React.memo(ZoneViewer);
