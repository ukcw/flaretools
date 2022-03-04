import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import SpeedSubcategories from "./SpeedSubcategories";

/**
 *
 * @param {*} props
 * @returns
 */

const SpeedViewer = (props) => {
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
        <SpeedSubcategories />
        {/* {speedData ? (
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
        ) : (
          <LoadingBox />
        )}
        {speedData ? (
          <AutomaticPlatformOptimization
            data={speedData.automatic_platform_optimization}
          />
        ) : (
          <LoadingBox />
        )}
        {speedData ? (
          <MobileRedirect data={speedData.mobile_redirect} />
        ) : (
          <LoadingBox />
        )}
        {speedData ? <Minify data={speedData.minify} /> : <LoadingBox />}
        {speedData ? <Railgun data={speedData.railguns} /> : <LoadingBox />} */}
      </Stack>
    </Container>
  );
};

export default React.memo(SpeedViewer);
