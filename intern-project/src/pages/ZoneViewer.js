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
import TrafficViewer from "../components/trafficComponents/TrafficViewer";
import ScrapeShieldViewer from "../components/scrapeShieldComponents/ScrapeShieldViewer";
import SpectrumViewer from "../components/spectrumComponents/SpectrumViewer";

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

  const [dnsData, setDnsData] = useState();
  const [sslTlsData, setSslTlsData] = useState();
  const [firewallData, setFirewallData] = useState();
  const [speedData, setSpeedData] = useState();
  const [cachingData, setCachingData] = useState();
  const [workersData, setWorkersData] = useState();
  const [rulesData, setRulesData] = useState();
  const [networkData, setNetworkData] = useState();
  const [trafficData, setTrafficData] = useState();

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
    const dnsResults = await getZoneSetting(payload, "/dns");
    setDnsData(dnsResults);
    const sslTlsResults = await getZoneSetting(payload, "/ssl_tls");
    setSslTlsData(sslTlsResults);
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
    //const speedResults = await getZoneSetting(payload, "/speed");
    //setSpeedData(speedResults);
    const cachingResults = await getZoneSetting(payload, "/caching");
    setCachingData(cachingResults);
    const workersResults = await getZoneSetting(payload, "/workers");
    setWorkersData(workersResults);
    const rulesResults = await getZoneSetting(payload, "/rules");
    setRulesData(rulesResults);
    //const networkResults = await getZoneSetting(payload, "/network");
    //setNetworkData(networkResults);
    const trafficResults = await getZoneSetting(
      payload,
      "/traffic/load_balancers"
    );
    setTrafficData(trafficResults);
  };
  /*
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
  */

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
          {dnsData ? <DNSViewer data={dnsData} /> : null}
          {sslTlsData ? <SSLTLSViewer data={sslTlsData} /> : null}
          {firewallData ? <FirewallViewer data={firewallData} /> : null}
          {/*speedData ? <SpeedViewer data={speedData} /> : null*/}
          <SpeedViewer />
          {cachingData ? <CachingViewer data={cachingData} /> : null}
          {workersData ? <WorkersViewer data={workersData} /> : null}
          {rulesData ? <RulesViewer data={rulesData} /> : null}
          {/*networkData ? <NetworkViewer data={networkData} /> : null*/}
          <NetworkViewer />
          {trafficData ? <TrafficViewer data={trafficData} /> : null}
          <ScrapeShieldViewer />
          <SpectrumViewer />
        </ZoneContext.Provider>
      ) : null}
    </Container>
  );
}

export default ZoneViewer;
