import React from "react";
import { Container, Heading, Stack, useProps } from "@chakra-ui/react";
import PageRules from "./PageRules";
import UrlRewrite from "./UrlRewrite";
import HttpRequestHeaderMod from "./HttpRequestHeaderMod";
import HttpResponseHeaderMod from "./HttpResponseHeaderMod";
import RulesSubcategories from "./RulesSubcategories";

/**
 *
 * @param {*} props
 * @returns
 */

const RulesViewer = (props) => {
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
        <Heading size="xl">Rules</Heading>
        {console.log(props.data)}
        <PageRules data={props.data.pagerules} />
        <UrlRewrite data={props.data.url_rewrite} />
        <HttpRequestHeaderMod
          data={props.data.http_request_late_modification}
        />
        <HttpResponseHeaderMod
          data={props.data.http_response_headers_modification}
        />
        <RulesSubcategories data={props.data.normalization_settings} />
      </Stack>
    </Container>
  );
};

export default RulesViewer;
