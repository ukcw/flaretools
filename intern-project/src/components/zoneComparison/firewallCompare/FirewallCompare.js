import { Container, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import CustomRulesFirewall from "./CustomRulesFirewall";
import CustomRulesRateLimits from "./CustomRulesRateLimits";
import DdosProtection from "./DdosProtection";
import DeprecatedFirewallCfRules from "./DeprecatedFirewallCfRules";
import DeprecatedFirewallOwaspRules from "./DeprecatedFirewallOwaspRules";
import FirewallRules from "./FirewallRules";
import FirewallSubcategories from "./FirewallSubcategories";
import IpAccessRules from "./IpAccessRules";
import ManagedRules from "./ManagedRules";
import RateLimiting from "./RateLimiting";
import UserAgentBlocking from "./UserAgentBlocking";
import ZoneLockdown from "./ZoneLockdown";

const FirewallCompare = (props) => {
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
        <ManagedRules id="managed_rules" />
        <DeprecatedFirewallCfRules id="cloudflare_managed_ruleset" />
        <DeprecatedFirewallOwaspRules id="owasp_modsecurity_core_ruleset" />
        <CustomRulesFirewall id="custom_rules_firewall" />
        <CustomRulesRateLimits id="custom_rules_rate_limits" />
        <FirewallRules id="firewall_rules" />
        <DdosProtection id="http_ddos_attack_protection" />
        <IpAccessRules id="ip_access_rules" />
        <RateLimiting id="rate_limiting" />
        <UserAgentBlocking id="user_agent_blocking" />
        <ZoneLockdown id="zone_lockdown" />
        <FirewallSubcategories id="firewall_subcategories" />
      </Stack>
    </Container>
  );
};

export default React.memo(FirewallCompare);
