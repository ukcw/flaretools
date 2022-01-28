import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import SpeedSubcategories from "./SpeedSubcategories";
import AutomaticPlatformOptimization from "./AutomaticPlatformOptimization";
import MobileRedirect from "./MobileRedirect";
import Minify from "./Minify";
import Railgun from "./Railgun";
import { useZoneContext } from "../../lib/contextLib";
import { getZoneSetting } from "../../utils/utils";

/**
 *
 * @param {*} props
 * @returns
 */

const SpeedViewer = (props) => {
  //const titles = Object.keys(props.data);
  const { zoneId, apiToken } = useZoneContext();
  const [speedData, setSpeedData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/speed"
      );
      setSpeedData(resp);
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
        <Heading size="xl">Speed</Heading>
        {speedData && (
          <SpeedSubcategories
            data={{
              mirage: speedData.mirage,
              image_resizing: speedData.image_resizing,
              polish: speedData.polish,
              brotli: speedData.brotli,
              early_hints: speedData.early_hints,
              h2_prioritization: speedData.h2_prioritization,
              rocket_loader: speedData.rocket_loader,
              prefetch_preload: speedData.prefetch_preload,
            }}
          />
        )}
        {speedData && (
          <AutomaticPlatformOptimization
            data={speedData.automatic_platform_optimization}
          />
        )}
        {speedData && <MobileRedirect data={speedData.mobile_redirect} />}
        {speedData && <Minify data={speedData.minify} />}
        {speedData && <Railgun data={speedData.railguns} />}
      </Stack>
    </Container>
  );
};

export default SpeedViewer;
