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

const DeprecatedFirewallOwaspRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [
    deprecatedFirewallOwaspRulesData,
    setDeprecatedFirewallOwaspRulesData,
  ] = useState();

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
            if (ruleset.name === "OWASP ModSecurity Core Rule Set") {
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
      setDeprecatedFirewallOwaspRulesData(processedResp);
    }
    setDeprecatedFirewallOwaspRulesData();
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
      deprecatedFirewallOwaspRulesData &&
      deprecatedFirewallOwaspRulesData[0].result.length
        ? HeaderFactory(deprecatedFirewallOwaspRulesData.length)
        : deprecatedFirewallOwaspRulesData &&
          deprecatedFirewallOwaspRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(deprecatedFirewallOwaspRulesData.length, false)
        : [];

    return deprecatedFirewallOwaspRulesData &&
      deprecatedFirewallOwaspRulesData[0].success &&
      deprecatedFirewallOwaspRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [deprecatedFirewallOwaspRulesData]);

  const data = React.useMemo(
    () =>
      deprecatedFirewallOwaspRulesData
        ? CompareData(
            CompareBaseToOthers,
            deprecatedFirewallOwaspRulesData,
            conditionsToMatch,
            "Cloudflare Managed Ruleset"
          )
        : [],
    [deprecatedFirewallOwaspRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Deprecated: OWASP ModSecurity Core Rule Set
        </Heading>
      </HStack>
      {!deprecatedFirewallOwaspRulesData && <LoadingBox />}
      {deprecatedFirewallOwaspRulesData && (
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

export default DeprecatedFirewallOwaspRules;
