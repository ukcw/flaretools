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
  const [zoneId, setZoneId] = useState("e6bf1f06148cb143e391370e9edf3aef");
  const [apiToken, setApiToken] = useState(
    "HsCys9ldf0ScxEDcza0Sq0dtkQ3wEbTw97RyAmR3"
  );
  const [dnsData, setDnsData] = useState({});
  const [sslTlsData, setSslTlsData] = useState({});
  const [firewallData, setFirewallData] = useState({});

  const search = async () => {
    const payload = {
      zoneId: zoneId,
      apiToken: `Bearer ${apiToken}`,
    };
    const dnsResults = await getZoneSetting(payload, "/dns");
    setDnsData(dnsResults);
    const sslTlsResults = await getZoneSetting(payload, "/ssl_tls");
    setSslTlsData(sslTlsResults);
    const firewallResults = await getZoneSetting(payload, "/firewall");
    setFirewallData(firewallResults);
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
      {dnsData && <DNSViewer data={dnsData} />}
      {sslTlsData && <SSLTLSViewer data={sslTlsData} />}
      {firewallData && <FirewallViewer data={firewallData} />}
    </Container>
  );
}

export default ZoneViewer;
