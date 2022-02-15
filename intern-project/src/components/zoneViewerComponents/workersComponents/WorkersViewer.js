import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import HttpRoutes from "./HttpRoutes";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

/**
 *
 * @param {*} props
 * @returns
 */

const WorkersViewer = (props) => {
  const { zoneId, apiToken } = useZoneContext();
  const [workersData, setWorkersData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getZoneSetting(
        {
          zoneId: zoneId,
          apiToken: `Bearer ${apiToken}`,
        },
        "/workers"
      );
      setWorkersData(resp);
    }
    setWorkersData();
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
        <Heading size="xl">Workers</Heading>
        {workersData ? (
          <HttpRoutes data={workersData.workers_routes} />
        ) : (
          <LoadingBox />
        )}
      </Stack>
    </Container>
  );
};

export default React.memo(WorkersViewer);
