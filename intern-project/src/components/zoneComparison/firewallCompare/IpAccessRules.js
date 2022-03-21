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
  VStack,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  CountryCodeLookup,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return (
    _.isEqual(base.configuration === toCompare.configuration) &&
    base.mode === toCompare.mode &&
    base.paused === toCompare.paused &&
    _.isEqual(base.scope, toCompare.scope)
  );
};

const ActionName = (action) => {
  if (action === "js_challenge") {
    return "JavaScript Challenge";
  } else {
    return Humanize(action);
  }
};

const IpAccessRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [ipAccessRulesData, setIpAccessRulesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/access_rules/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setIpAccessRulesData(processedResp);
    }
    setIpAccessRulesData();
    getData();
  }, [credentials, zoneKeys]);
  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Value",
        accessor: (row) => {
          if (row.configuration.target === "country") {
            return (
              <VStack w="100%" p={0} align={"flex-start"}>
                <Text>
                  {`${
                    CountryCodeLookup(row.configuration.value.toLowerCase())
                      .name
                  } 
                    (${row.configuration.value})`}
                </Text>
                <Text color="grey">{row.notes}</Text>
              </VStack>
            );
          } else {
            return row.configuration.value;
          }
        },
      },
      {
        Header: "Applies to",
        accessor: (row) => {
          if (row.scope.type === "organization") {
            return "All websites in account";
          } else if (row.scope.type === "zone") {
            return "This website";
          } else {
            return row.scope.type;
          }
        },
      },
      {
        Header: "Action",
        accessor: "mode",
        Cell: (props) => ActionName(props.value),
      },
    ];
    const dynamicHeaders =
      ipAccessRulesData && ipAccessRulesData[0].result.length
        ? HeaderFactory(ipAccessRulesData.length)
        : ipAccessRulesData && ipAccessRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(ipAccessRulesData.length, false)
        : [];

    return ipAccessRulesData &&
      ipAccessRulesData[0].success &&
      ipAccessRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [ipAccessRulesData]);

  const data = React.useMemo(
    () =>
      ipAccessRulesData
        ? CompareData(
            CompareBaseToOthers,
            ipAccessRulesData,
            conditionsToMatch,
            "IP Access Rules"
          )
        : [],
    [ipAccessRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          IP Access Rules
        </Heading>
      </HStack>
      {!ipAccessRulesData && <LoadingBox />}
      {ipAccessRulesData && (
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

export default IpAccessRules;
