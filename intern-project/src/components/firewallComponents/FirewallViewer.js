import { Container, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import CustomRules from "./CustomRules";
import DdosProtection from "./DdosProtection";
import FirewallRules from "./FirewallRules";
import FirewallSubcategories from "./FirewallSubcategories";
import IpAccessRules from "./IpAccessRules";
import PageShield from "./PageShield";
import RateLimiting from "./RateLimits";
import UserAgentBlocking from "./UserAgentBlocking";
import WebAppFirewall from "./WebAppFirewall";
import ZoneLockdown from "./ZoneLockdown";

const FirewallViewer = (props) => {
  const getRulesetId = (name, resultArray) => {
    for (let i = 0; i < resultArray.length; i++) {
      if (resultArray[i].name === name) {
        return i;
      }
    }
    return -1;
  };
  const ddosId = getRulesetId(
    "DDoS L7 ruleset",
    props.data.managed_rulesets_results
  );
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
        <Heading size="xl">Firewall</Heading>
        <WebAppFirewall
          data={{
            waf_setting: props.data.waf_setting,
            managed_rulesets_results: props.data.managed_rulesets_results,
            deprecated_firewall_rules: props.data.deprecatedFirewallRules,
          }}
        />
        {props.data.custom_rules_firewall.success && (
          <CustomRules
            data={props.data.custom_rules_firewall}
            title="Custom Rules Firewall"
          />
        )}
        {props.data.custom_rules_ratelimit.success && (
          <CustomRules
            data={props.data.custom_rules_ratelimit}
            title="Custom Rules Rate Limit"
          />
        )}
        <FirewallRules data={props.data.firewall_rules} />
        {/*<PageShield data={props.data.page_shield} />*/}
        <DdosProtection
          data={{
            ddos_l7: props.data.ddos_l7,
            ddos_ruleset: props.data.managed_rulesets_results[ddosId],
          }}
          title="HTTP DDoS attack protection"
        />
        <IpAccessRules data={props.data.firewall_access_rules} />
        <RateLimiting data={props.data.rate_limits} />
        <UserAgentBlocking data={props.data.firewall_ua_rules} />
        <ZoneLockdown data={props.data.firewall_lockdowns} />
        <FirewallSubcategories
          data={{
            security_level: props.data.security_level,
            challenge_passage: props.data.challenge_ttl,
            browser_integrity_check: props.data.browser_check,
            privacy_pass_support: props.data.privacy_pass,
          }}
        />
      </Stack>
    </Container>
  );
};

export default FirewallViewer;
