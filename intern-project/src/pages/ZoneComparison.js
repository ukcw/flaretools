//import logo from "./logo.svg";
import React, { useRef, useState } from "react";
import {
  Button,
  Container,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  Stack,
} from "@chakra-ui/react";
import { getMultipleZoneSettings } from "../utils/utils";
import { CompareContext } from "../lib/contextLib";
import DnsCompare from "../components/zoneComparison/dnsCompare/DnsCompare";
import SslTlsCompare from "../components/zoneComparison/sslTlsCompare/SslTlsCompare";
import SpeedCompare from "../components/zoneComparison/speedCompare/SpeedCompare";
import CachingCompare from "../components/zoneComparison/cachingCompare/CachingCompare";

function ZoneComparison() {
  const [zoneDetails, setZoneDetails] = useState();
  const [credentials, setCredentials] = useState();
  const [keys, setKeys] = useState();
  const searchDetails = useRef({});

  const search = async () => {
    const zoneKeys = Object.keys(searchDetails.current).sort(
      (a, b) => parseInt(/_(\d+)/.exec(a)[1]) - parseInt(/_(\d+)/.exec(b)[1])
    );

    // check if at least details for two zones was entered
    if (zoneKeys.length < 2) {
      return alert("You need to input a minimum of two zones.");
    }

    // send zone_details API request for all zones provided
    const zoneDetailsResp = await getMultipleZoneSettings(
      zoneKeys,
      searchDetails.current,
      "/zone_details"
    );

    // create flag that will be set to True if any of the zones had an unsuccessful zone_details API request
    let incorrectZoneDetailsFlag = false;
    const incorrectZoneDetailsArray = [];

    // set flag to True if there is an unsuccessful zone_details API request and store the idx of the zone
    zoneDetailsResp.forEach((details, idx) => {
      if (details.zone_details.success === false) {
        incorrectZoneDetailsArray.push(idx + 1);
        incorrectZoneDetailsFlag = true;
      }
    });

    // return an alert if the user had input incorrect details
    if (incorrectZoneDetailsFlag) {
      return alert(
        `Details for ${
          incorrectZoneDetailsArray.length > 1 ? "Zones" : "Zone"
        } ${incorrectZoneDetailsArray.join(", ")} was incorrect.`
      );
    } else {
      const zoneDetailsRenamed = zoneDetailsResp.map((zone, idx) => ({
        [`zone_${idx + 1}`]: zone.zone_details,
      }));
      setCredentials({ ...searchDetails.current });
      setKeys(zoneKeys);
      setZoneDetails(zoneDetailsRenamed);
    }
  };

  const handleChange = (event, zone, setting) => {
    const newObj = { ...searchDetails.current };
    if (zone in newObj === false) {
      newObj[zone] = {};
    }
    newObj[zone][setting] = event.target.value;
    searchDetails.current = newObj;
  };

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
        <Stack spacing={4}>
          <Heading size={"md"}>Zone 1</Heading>
          <InputGroup>
            <InputLeftAddon children="Zone ID" minWidth={"90"} />
            <Input
              type="text"
              placeholder="Zone ID"
              defaultValue={process.env.REACT_APP_PERSONAL_ZONE_ID}
              onChange={(e) => handleChange(e, "zone_1", "zoneId")}
              onBlur={(e) => handleChange(e, "zone_1", "zoneId")} // for testing
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children="Bearer" minWidth={"90"} />
            <Input
              type="text"
              placeholder="API Token"
              defaultValue={process.env.REACT_APP_READ_ONLY_ALL_API_TOKEN}
              onChange={(e) => handleChange(e, "zone_1", "apiToken")}
              onBlur={(e) => handleChange(e, "zone_1", "apiToken")} // for testing
            />
          </InputGroup>
        </Stack>
        <Stack spacing={4}>
          <Heading size={"md"}>Zone 2</Heading>
          <InputGroup>
            <InputLeftAddon children="Zone ID" minWidth={"90"} />
            <Input
              type="text"
              placeholder="Zone ID"
              defaultValue={process.env.REACT_APP_BURRITO_BOT_ZONE_ID}
              onChange={(e) => handleChange(e, "zone_2", "zoneId")}
              onBlur={(e) => handleChange(e, "zone_2", "zoneId")} // for testing
            />
          </InputGroup>
          <InputGroup>
            <InputLeftAddon children="Bearer" minWidth={"90"} />
            <Input
              type="text"
              placeholder="API Token"
              defaultValue={
                process.env.REACT_APP_BURRITO_BOT_READ_ONLY_API_TOKEN
              }
              onChange={(e) => handleChange(e, "zone_2", "apiToken")}
              onBlur={(e) => handleChange(e, "zone_2", "apiToken")} // for testing
            />
          </InputGroup>
        </Stack>
        <Button colorScheme={"blue"} onClick={search}>
          Compare
        </Button>
      </Stack>
      {zoneDetails && (
        <CompareContext.Provider
          value={{
            zoneKeys: keys,
            credentials: credentials,
          }}
        >
          <DnsCompare />
          <SslTlsCompare />
          {/* FIREWALL */}
          <SpeedCompare />
          <CachingCompare />
          {/* <CachingViewer />
          <WorkersViewer />
          <RulesViewer />
          <NetworkViewer />
          <TrafficViewer />
          <ScrapeShieldViewer />
          <SpectrumViewer /> */}
        </CompareContext.Provider>
      )}
    </Container>
  );
}

export default React.memo(ZoneComparison);
