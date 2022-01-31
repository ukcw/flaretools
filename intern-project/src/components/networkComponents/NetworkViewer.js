import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import NetworkSubcategories from "./NetworkSubcategories";
import { getZoneSetting } from "../../utils/utils";
import { useZoneContext } from "../../lib/contextLib";
import LoadingBox from "../LoadingBox";

/**
 *
 * @param {*} props
 * @returns
 */

const NetworkViewer = (props) => {
  //const titles = Object.keys(props.data);
  const { zoneId, apiToken } = useZoneContext();
  const [networkData, setNetworkData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/network"
      );
      setNetworkData(resp);
    }
    getData();
  }, [apiToken, zoneId]);

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
        <Heading size="xl">Network</Heading>
        {networkData ? (
          <NetworkSubcategories data={networkData} />
        ) : (
          <LoadingBox />
        )}
      </Stack>
    </Container>
  );
};

export default NetworkViewer;
