import React from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import ScrapeShieldSubcategories from "./ScrapeShieldSubcategories.js";

/**
 *
 * @param {*} props
 * @returns
 */

const ScrapeShieldCompare = (props) => {
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
        <Heading size="xl">Scrape Shield</Heading>
        <ScrapeShieldSubcategories id="scrape_shield_subcategories" />
      </Stack>
    </Container>
  );
};

export default React.memo(ScrapeShieldCompare);
