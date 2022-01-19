import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import SpeedSubcategories from "./SpeedSubcategories";
import AutomaticPlatformOptimization from "./AutomaticPlatformOptimization";

/**
 *
 * @param {*} props
 * @returns
 */

const SpeedViewer = (props) => {
  //const titles = Object.keys(props.data);

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
        {console.log(props.data)}
        <SpeedSubcategories
          data={{
            mirage: props.data.mirage,
            image_resizing: props.data.image_resizing,
            polish: props.data.polish,
            brotli: props.data.brotli,
            early_hints: props.data.early_hints,
            h2_prioritization: props.data.h2_prioritization,
            rocket_loader: props.data.rocket_loader,
            prefetch_preload: props.data.prefetch_preload,
          }}
        />
        <AutomaticPlatformOptimization
          data={props.data.automatic_platform_optimization}
        />
      </Stack>
    </Container>
  );
};

export default SpeedViewer;
