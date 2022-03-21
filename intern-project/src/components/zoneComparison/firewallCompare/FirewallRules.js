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
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  GetExpressionOutput,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const ConcatenateExpressions = (expr) => {
  const exprs = expr.split(/\band\b|\bor\b/);
  const output = exprs.map((expr) => GetExpressionOutput(expr));
  return output.join(", ");
};

const conditionsToMatch = (base, toCompare) => {
  const checkProducts = (base, toCompare) => {
    if (base.action === "bypassed") {
      if (toCompare === "bypassed") {
        const baseProducts = base.products;
        const toCompareProducts = toCompare.products;
        baseProducts.forEach((prod) => {
          if (toCompareProducts.includes(prod) === false) {
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    } else {
      return base.action === toCompare.action ? true : false;
    }
  };

  return (
    base.filter.expression === toCompare.filter.expression && // match on filter->expression
    base.filter.paused === toCompare.filter.paused && // filter->paused
    base.action === toCompare.action && // action
    checkProducts(base, toCompare)
  ); // products (only exists if action == bypassed)
};

const FirewallRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [firewallRulesData, setFirewallRulesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setFirewallRulesData(processedResp);
    }
    setFirewallRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Description",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>{row.description}</Text>
              {/*<Text color="grey">
                {ConcatenateExpressions(row.filter.expression)}
          </Text>*/}
            </VStack>
          );
        },
        maxWidth: 350,
      },
      {
        Header: "Expression",
        accessor: (row) => row.filter.expression,
        Cell: (props) => <Text>{props.value}</Text>,
        maxWidth: 380,
      },
      {
        Header: "Enabled",
        accessor: "paused",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];
    const dynamicHeaders =
      firewallRulesData && firewallRulesData[0].result.length
        ? HeaderFactory(firewallRulesData.length)
        : firewallRulesData && firewallRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(firewallRulesData.length, false)
        : [];

    return firewallRulesData &&
      firewallRulesData[0].success &&
      firewallRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [firewallRulesData]);

  const data = React.useMemo(
    () =>
      firewallRulesData
        ? CompareData(
            CompareBaseToOthers,
            firewallRulesData,
            conditionsToMatch,
            "Firewall Rules"
          )
        : [],
    [firewallRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Firewall Rules
        </Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!firewallRulesData && <LoadingBox />}
      {firewallRulesData && (
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
                      <Th
                        {...column.getHeaderProps({
                          style: {
                            maxWidth: column.maxWidth,
                          },
                        })}
                      >
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
                          <Td
                            {...cell.getCellProps({
                              style: {
                                maxWidth: cell.column.maxWidth,
                              },
                            })}
                          >
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

export default FirewallRules;
