import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import PageRules from "./PageRules";
import UrlRewrite from "./UrlRewrite";
import HttpRequestHeaderMod from "./HttpRequestHeaderMod";

/**
 *
 * @param {*} props
 * @returns
 */

const RulesCompare = (props) => {
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
        <Heading size="xl">Rules</Heading>
        <PageRules />
        <UrlRewrite />
        <HttpRequestHeaderMod />
        {/* {rulesData ? (
          <HttpResponseHeaderMod
            data={rulesData.http_response_headers_modification}
          />
        ) : (
          <LoadingBox />
        )} */}
        {/* {rulesData ? (
          <RulesSubcategories data={rulesData.normalization_settings} />
        ) : (
          <LoadingBox />
        )} */}
      </Stack>
    </Container>
  );
};

export default React.memo(RulesCompare);
