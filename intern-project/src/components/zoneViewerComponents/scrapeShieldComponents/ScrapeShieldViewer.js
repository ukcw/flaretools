import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import ScrapeShieldSubcategories from "./ScrapeShieldSubcategories";
import { getZoneSetting } from "../../../utils/utils";
import { useZoneContext } from "../../../lib/contextLib";
import LoadingBox from "../../LoadingBox";

/**
 *
 * @param {*} props
 * @returns
 */

const ScrapeShieldViewer = (props) => {
  //const titles = Object.keys(props.data);
  const { zoneId, apiToken } = useZoneContext();
  const [data, setData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/scrape_shield"
      );
      setData(resp);
    }
    setData();
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
        <Heading size="xl">Scrape Shield</Heading>
        {data ? <ScrapeShieldSubcategories data={data} /> : <LoadingBox />}
      </Stack>
    </Container>
  );
};

export default React.memo(ScrapeShieldViewer);
