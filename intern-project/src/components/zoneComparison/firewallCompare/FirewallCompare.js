import { Container, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import CustomRulesRateLimits from "./CustomRulesRateLimits";
import DdosProtection from "./DdosProtection";
import FirewallRules from "./FirewallRules";
import FirewallSubcategories from "./FirewallSubcategories";
import IpAccessRules from "./IpAccessRules";
import RateLimiting from "./RateLimiting";
import UserAgentBlocking from "./UserAgentBlocking";
import ZoneLockdown from "./ZoneLockdown";

const FirewallViewer = (props) => {
  //   const { zoneId, apiToken } = useZoneContext();
  //   const [firewallData, setFirewallData] = useState();
  //   const [ddosId, setDdosId] = useState();

  //   const getRulesetId = (name, resultArray) => {
  //     for (let i = 0; i < resultArray.length; i++) {
  //       if (resultArray[i].name === name) {
  //         return i;
  //       }
  //     }
  //     return -1;
  //   };

  //   useEffect(() => {
  //     async function getFirewallData() {
  //       const firewallResults = await getZoneSetting(
  //         {
  //           zoneId: zoneId,
  //           apiToken: `Bearer ${apiToken}`,
  //         },
  //         "/firewall"
  //       );
  //       setFirewallData((prevState) => ({
  //         ...prevState,
  //         ...firewallResults,
  //       }));

  //       // check deprecated firewall rules
  //       const deprecatedFirewall = await getZoneSetting(
  //         {
  //           zoneId: zoneId,
  //           apiToken: `Bearer ${apiToken}`,
  //         },
  //         "/firewall/deprecated"
  //       );
  //       setFirewallData((prevState) => ({
  //         ...prevState,
  //         ...deprecatedFirewall,
  //       }));

  //       return firewallResults;
  //     }
  //     setFirewallData();
  //     setDdosId();
  //     getFirewallData().then((data) => {
  //       const tempDdosId = getRulesetId(
  //         "DDoS L7 ruleset",
  //         data.managed_rulesets_results
  //       );
  //       setDdosId(tempDdosId);
  //     });
  //   }, [apiToken, zoneId]);

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
        {/* {firewallData?.waf_setting &&
        "deprecatedFirewallRules" in firewallData ? (
          <WebAppFirewall
            data={{
              waf_setting: firewallData.waf_setting,
              managed_rulesets_results: firewallData.managed_rulesets_results,
              deprecated_firewall_rules: firewallData.deprecatedFirewallRules,
            }}
          />
        ) : (
          <LoadingBox />
        )} */}
        {/* {firewallData?.custom_rules_firewall &&
        firewallData.custom_rules_firewall.success ? (
          <CustomRules
            data={firewallData.custom_rules_firewall}
            title="Custom Rules Firewall"
          />
        ) : (
          firewallData &&
          !("custom_rules_firewall" in firewallData) && <LoadingBox />
        )} */}
        <CustomRulesRateLimits />
        <FirewallRules />
        <DdosProtection />
        <IpAccessRules />
        <RateLimiting />
        <UserAgentBlocking />
        <ZoneLockdown />
        <FirewallSubcategories />
      </Stack>
    </Container>
  );
};

export default React.memo(FirewallViewer);
