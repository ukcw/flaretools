//import logo from "./logo.svg";
import React, { useRef, useState } from "react";
import FirewallViewer from "../components/zoneViewerComponents/firewallComponents/FirewallViewer";
import {
  Button,
  Container,
  Grid,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import SpeedViewer from "../components/zoneViewerComponents/speedComponents/SpeedViewer";
import { ZoneContext } from "../lib/contextLib";
import CachingViewer from "../components/zoneViewerComponents/cachingComponents/CachingViewer";
import WorkersViewer from "../components/zoneViewerComponents/workersComponents/WorkersViewer";
import NetworkViewer from "../components/zoneViewerComponents/networkComponents/NetworkViewer";
import RulesViewer from "../components/zoneViewerComponents/rulesComponents/RulesViewer";
import TrafficViewer from "../components/zoneViewerComponents/trafficComponents/TrafficViewer";
import ScrapeShieldViewer from "../components/zoneViewerComponents/scrapeShieldComponents/ScrapeShieldViewer";
import SpectrumViewer from "../components/zoneViewerComponents/spectrumComponents/SpectrumViewer";
import SslTlsViewer from "../components/zoneViewerComponents/sslTlsComponents/SslTlsViewer";
import DnsViewer from "../components/zoneViewerComponents/dnsComponents/DnsViewer";
import AfterSearch from "../components/zoneComparison/credentialsInputCompare/AfterSearch";
import LeftSidebar from "../components/zoneComparison/leftSidebar/LeftSidebar";
import RightSidebar from "../components/zoneViewerComponents/rightSidebar/RightSidebar";

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
  const [zoneDetails, setZoneDetails] = useState();
  const [credentials, setCredentials] = useState({ zoneId: "", apiToken: "" });
  const searchApiToken = useRef("");
  const searchZoneId = useRef("");
  const [successfulSearch, setSuccessfulSearch] = useState(false);

  const search = async () => {
    const payload = {
      zoneId: searchZoneId.current,
      apiToken: `Bearer ${searchApiToken.current}`,
    };

    const zoneDetailsResults = await getZoneSetting(payload, "/zone_details");
    if (zoneDetailsResults.zone_details.success === false) {
      return alert("You have submitted invalid credentials.");
    } else {
      setCredentials({
        zoneId: searchZoneId.current,
        apiToken: searchApiToken.current,
      });
      setZoneDetails(zoneDetailsResults.zone_details.result);
      setSuccessfulSearch(true);
    }
  };

  return (
    <Grid
      gridTemplateColumns={
        successfulSearch
          ? "minmax(0,0.5fr) minmax(0,2.5fr) minmax(0,0.5fr)"
          : "minmax(0,5fr)"
      }
      justifyContent="center"
    >
      {successfulSearch && <LeftSidebar app="viewer" />}
      <Container maxW="container.xl" p={8}>
        {!successfulSearch && (
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
              <InputLeftAddon children="Zone ID" minWidth={"90"} />
              <Input
                type="text"
                placeholder="Zone ID"
                onChange={(e) => (searchZoneId.current = e.target.value)}
              />
            </InputGroup>
            <InputGroup>
              <InputLeftAddon children="Bearer" minWidth={"90"} />
              <Input
                type="text"
                placeholder="API Token"
                onChange={(e) => (searchApiToken.current = e.target.value)}
              />
            </InputGroup>
            <Button colorScheme={"blue"} onClick={search}>
              Search
            </Button>
          </Stack>
        )}
        {zoneDetails ? (
          <ZoneContext.Provider
            value={{
              zoneDetails,
              zoneId: credentials.zoneId,
              apiToken: credentials.apiToken,
            }}
          >
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
      {successfulSearch && (
        <>
          {console.log(zoneDetails)}
          <RightSidebar
            zoneName={zoneDetails.name}
            style={{ float: "right" }}
          />
        </>
      )}
    </Grid>
  );
}

export default React.memo(ZoneViewer);
