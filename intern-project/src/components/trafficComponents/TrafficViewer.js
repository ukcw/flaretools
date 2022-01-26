import { Container, Heading, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import LoadBalancers from "./LoadBalancers";
import { useZoneContext } from "../../lib/contextLib";
import { getZoneSetting } from "../../utils/utils";

const TrafficViewer = (props) => {
  const { zoneDetails, apiToken } = useZoneContext();
  const [pools, setPools] = useState();

  useEffect(() => {
    async function getPools() {
      const resp = await getZoneSetting(
        {
          accountId: zoneDetails.account.id,
          apiToken: `Bearer ${apiToken}`,
        },
        "/traffic/load_balancers/pools"
      );
      setPools(resp.load_balancers_pools);
    }
    getPools();
  }, [apiToken, zoneDetails.account.id]);

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
        {console.log(props.data)}
        {console.log("ppppp", pools)}
        {pools && (
          <LoadBalancers data={props.data.load_balancers} pools={pools} />
        )}
      </Stack>
    </Container>
  );
};

export default TrafficViewer;
