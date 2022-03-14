import React, { useEffect, useState } from "react";
import { Container, Heading, Stack } from "@chakra-ui/react";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import PageRules from "./PageRules";
import UrlRewrite from "./UrlRewrite";
import HttpRequestHeaderMod from "./HttpRequestHeaderMod";
import HttpResponseHeaderMod from "./HttpResponseHeaderMod";
import NormalizationRules from "./NormalizationRules";

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
        <PageRules id="page_rules" />
        <UrlRewrite id="url_rewrite" />
        <HttpRequestHeaderMod id="http_request_header_modification" />
        <HttpResponseHeaderMod id="http_response_header_modification" />
        <NormalizationRules id="normalization_settings" />
      </Stack>
    </Container>
  );
};

export default React.memo(RulesCompare);
