import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useZoneContext } from "../../../lib/contextLib";
import { getZoneSetting } from "../../../utils/utils";

const RulesSubcategories = (props) => {
  const { zoneId, apiToken } = useZoneContext();
  const [ruleSubcategoriesData, setRuleSubcategoriesData] = useState();

  useEffect(() => {
    async function getData() {
      const payload = {
        zoneId: zoneId,
        apiToken: `Bearer ${apiToken}`,
      };
      const resp = await getZoneSetting(payload, "/url_normalization");
      const processedResp = { ...resp.resp };
      setRuleSubcategoriesData(processedResp);
    }
    setRuleSubcategoriesData();
    getData();
  }, [apiToken, zoneId]);

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Normalization Rules
      </Heading>
      {ruleSubcategoriesData && (
        <Table>
          <Tbody>
            {ruleSubcategoriesData.success && (
              <Tr>
                <Th>Normalization Type</Th>
                <Td>
                  <Text>{ruleSubcategoriesData.result.type}</Text>
                </Td>
              </Tr>
            )}
            <Tr>
              <Th>Normalize incoming URLs</Th>
              <Td>
                {ruleSubcategoriesData.result.scope === "incoming" ||
                ruleSubcategoriesData.result.scope === "both" ? (
                  <CheckIcon color="green" />
                ) : (
                  <CloseIcon color="red" />
                )}
              </Td>
            </Tr>
            <Tr>
              <Th>Normalize URLs to Origin</Th>
              <Td>
                {ruleSubcategoriesData.result.scope === "both" ? (
                  <CheckIcon color="green" />
                ) : (
                  <CloseIcon color="red" />
                )}
              </Td>
            </Tr>
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default RulesSubcategories;
