//import logo from "./logo.svg";
import React, { useState } from "react";
import DNSViewer from "../components/dnsComponents/DNSViewer";
import SSLTLSViewer from "../components/sslTlsComponents/SSLTLSViewer";
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
  const [zoneId, setZoneId] = useState("4e6d50a41172bca54f222576aec3fc2b");
  const [zoneDetails, setZoneDetails] = useState();
  const [apiToken, setApiToken] = useState(
    "0lQJ62XyKHdIrIaNvOp1rl8D0FBaDpXPSo7phced"
  );

  const [dnsData, setDnsData] = useState();
  const [sslTlsData, setSslTlsData] = useState();
  const [firewallData, setFirewallData] = useState();
  const [speedData, setSpeedData] = useState();
  const [cachingData, setCachingData] = useState();
  const [workersData, setWorkersData] = useState();
  const [rulesData, setRulesData] = useState();
  const [networkData, setNetworkData] = useState();

  const search = async () => {
    const payload = {
      zoneId: zoneId,
      apiToken: `Bearer ${apiToken}`,
    };
    /*
    const dnsResults = await getZoneSetting(payload, "/dns");
    setDnsData(dnsResults);
    const sslTlsResults = await getZoneSetting(payload, "/ssl_tls");
    setSslTlsData(sslTlsResults);
    const firewallResults = await getZoneSetting(payload, "/firewall");
    setFirewallData(firewallResults);
    */
    const [
      zoneDetailsResults,
      dnsResults,
      sslTlsResults,
      firewallResults,
      speedResults,
      cachingResults,
      workersResults,
      rulesResults,
      networkResults,
    ] = await Promise.all([
      getZoneSetting(payload, "/zone_details"),
      getZoneSetting(payload, "/dns"),
      getZoneSetting(payload, "/ssl_tls"),
      getZoneSetting(payload, "/firewall"),
      getZoneSetting(payload, "/speed"),
      getZoneSetting(payload, "/caching"),
      getZoneSetting(payload, "/workers"),
      getZoneSetting(payload, "/rules"),
      getZoneSetting(payload, "/network"),
    ]);

    if (zoneDetailsResults.zone_details) {
      setZoneDetails(zoneDetailsResults.zone_details.result);
    }
    setDnsData(dnsResults);
    setSslTlsData(sslTlsResults);
    setFirewallData(firewallResults);
    setSpeedData(speedResults);
    setCachingData(cachingResults);
    setWorkersData(workersResults);
    setRulesData(rulesResults);
    setNetworkData(networkResults);
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
            //defaultValue="e6bf1f06148cb143e391370e9edf3aef"
          />
        </InputGroup>
        <InputGroup>
          <InputLeftAddon children="Bearer" />
          <Input
            type="text"
            placeholder="API Token"
            onChange={(e) => setApiToken(e.target.value)}
            //defaultValue="HsCys9ldf0ScxEDcza0Sq0dtkQ3wEbTw97RyAmR3"
          />
        </InputGroup>
        <Button onClick={search}>Search</Button>
      </Stack>
      {zoneDetails ? (
        <ZoneContext.Provider value={{ zoneDetails }}>
          {dnsData ? <DNSViewer data={dnsData} /> : null}
          {sslTlsData ? <SSLTLSViewer data={sslTlsData} /> : null}
          {firewallData ? <FirewallViewer data={firewallData} /> : null}
          {speedData ? <SpeedViewer data={speedData} /> : null}
          {cachingData ? <CachingViewer data={cachingData} /> : null}
          {workersData ? <WorkersViewer data={workersData} /> : null}
          {rulesData ? <RulesViewer data={rulesData} /> : null}
          {networkData ? <NetworkViewer data={networkData} /> : null}
        </ZoneContext.Provider>
      ) : null}
    </Container>
  );
}

export default ZoneViewer;
