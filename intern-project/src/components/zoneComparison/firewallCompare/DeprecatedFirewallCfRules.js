import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return base.id === toCompare.id && base.mode === toCompare.mode;
};

const DeprecatedFirewallCfRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [deprecatedFirewallCfRulesData, setDeprecatedFirewallCfRulesData] =
    useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/deprecated"
      );
      const processedResp = resp.map((zone) => {
        let newObj = { ...zone };
        if (zone.deprecatedFirewallRules) {
          zone.deprecatedFirewallRules.forEach((ruleset) => {
            if (ruleset.name === "CloudFlare") {
              newObj.result = ruleset.dash.result;
              newObj.success = ruleset.dash.success;
            }
          });
        } else {
          newObj.result = [];
          newObj.success = true;
        }
        return newObj;
      });
      setDeprecatedFirewallCfRulesData(processedResp);
    }
    setDeprecatedFirewallCfRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Group",
        accessor: "name",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Mode",
        accessor: "mode",
        Cell: (props) =>
          props.value === "on" ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];
    const dynamicHeaders =
      deprecatedFirewallCfRulesData &&
      deprecatedFirewallCfRulesData[0].result.length
        ? HeaderFactory(deprecatedFirewallCfRulesData.length)
        : deprecatedFirewallCfRulesData &&
          deprecatedFirewallCfRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(deprecatedFirewallCfRulesData.length, false)
        : [];

    return deprecatedFirewallCfRulesData &&
      deprecatedFirewallCfRulesData[0].success &&
      deprecatedFirewallCfRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [deprecatedFirewallCfRulesData]);

  const data = React.useMemo(
    () =>
      deprecatedFirewallCfRulesData
        ? CompareData(
            CompareBaseToOthers,
            deprecatedFirewallCfRulesData,
            conditionsToMatch,
            "Cloudflare Managed Ruleset"
          )
        : [],
    [deprecatedFirewallCfRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Deprecated: Cloudflare Managed Ruleset</Heading>
      </HStack>
      {!deprecatedFirewallCfRulesData && <LoadingBox />}
      {deprecatedFirewallCfRulesData && (
        <Table {...getTableProps}>
          <Thead>
            {
              // Loop over the header rows
              headerGroups.map((headerGroup) => (
                <Tr {...headerGroup.getHeaderGroupProps()}>
                  {
                    // Loop over the headers in each row
                    headerGroup.headers.map((column) => (
                      // Apply the header cell props
                      <Th {...column.getHeaderProps()}>
                        {
                          // Render the header
                          column.render("Header")
                        }
                      </Th>
                    ))
                  }
                </Tr>
              ))
            }
          </Thead>
          {/* Apply the table body props */}
          <Tbody {...getTableBodyProps()}>
            {
              // Loop over the table rows
              rows.map((row) => {
                // Prepare the row for display
                prepareRow(row);
                return (
                  // Apply the row props
                  <Tr {...row.getRowProps()}>
                    {
                      // Loop over the rows cells
                      row.cells.map((cell) => {
                        // Apply the cell props
                        return (
                          <Td {...cell.getCellProps()}>
                            {
                              // Render the cell contents
                              cell.render("Cell")
                            }
                          </Td>
                        );
                      })
                    }
                  </Tr>
                );
              })
            }
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default DeprecatedFirewallCfRules;
