import { Container, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import SpectrumApplications from "./SpectrumApplications";

const SpectrumCompare = (props) => {
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
        <SpectrumApplications />
      </Stack>
    </Container>
  );
};

export default React.memo(SpectrumCompare);
