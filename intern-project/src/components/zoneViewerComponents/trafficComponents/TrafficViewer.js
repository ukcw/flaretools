import { Container, Heading, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LoadBalancers from "./LoadBalancers";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const TrafficViewer = (props) => {
  const { zoneDetails, zoneId, apiToken } = useZoneContext();
  const [trafficData, setTrafficData] = useState();

  useEffect(() => {
    async function getTrafficData() {
      const { resp: load_balancers } = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/load_balancers"
      );
      setTrafficData((prevState) => ({ ...prevState, load_balancers }));
      const { resp: load_balancers_pools } = await getZoneSetting(
        {
          accountId: zoneDetails.account.id,
          apiToken: `Bearer ${apiToken}`,
        },
        "/load_balancers/pools"
      );
      setTrafficData((prevState) => ({ ...prevState, load_balancers_pools }));
    }
    setTrafficData();
    getTrafficData();
  }, [apiToken, zoneDetails.account.id, zoneId]);

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
        <Heading size="xl">Traffic</Heading>
        {trafficData?.load_balancers && trafficData?.load_balancers_pools ? (
          <LoadBalancers
            id="load_balancers"
            data={trafficData.load_balancers}
            pools={trafficData.load_balancers_pools}
          />
        ) : (
          <LoadingBox />
        )}
      </Stack>
    </Container>
  );
};

export default React.memo(TrafficViewer);
