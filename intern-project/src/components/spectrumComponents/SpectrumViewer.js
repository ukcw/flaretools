import { Container, Heading, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useZoneContext } from "../../lib/contextLib";
import { getZoneSetting } from "../../utils/utils";
import SpecApplications from "./SpecApplications";

const SpectrumViewer = (props) => {
  const { zoneId, apiToken } = useZoneContext();
  const [specApplications, setSpecApplications] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/spectrum/applications"
      );
      setSpecApplications(resp.spectrum_applications);
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
        <Heading size="xl">Spectrum</Heading>
        {specApplications && <SpecApplications data={specApplications} />}
      </Stack>
    </Container>
  );
};

export default SpectrumViewer;
