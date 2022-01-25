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
  Switch,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { Humanize } from "../../utils/utils";

const WithTable = (props) => {
  const getDescription = (checkId, resultArray) => {
    for (let i = 0; i < resultArray.length; i++) {
      const current = resultArray[i];
      if (current.id === checkId) {
        return current.name;
      }
    }
    return "Name not found";
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Description",
        accessor: (row) => {
          if (row?.description !== undefined) {
            return row.description;
          } else {
            return getDescription(
              row.action_parameters.id,
              props.data.managed_rulesets_results
            );
          }
        },
      },
      {
        Header: "Enabled",
        accessor: "enabled",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ],
    [props.data.managed_rulesets_results]
  );

  const makeData = (data) => {
    if (data.result?.rules === undefined || data.result.rules.length < 1) {
      return [];
    }
    return data.result.rules;
  };

  const data = React.useMemo(
    () => makeData(props.data.tableData.result),
    [props.data.tableData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Web Application Firewall</Heading>
        {props.data.waf_setting.result.value === "off" && (
          <Switch isReadOnly isChecked={false} />
        )}
      </HStack>
      {props.data.tableData.result.result?.rules !== undefined &&
        props.data.tableData.result.result.rules.length > 0 && (
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

const WithoutTable = (props) => {
  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Web Application Firewall</Heading>
        {props.data.waf_setting.result.value === "off" ? (
          <Switch isReadOnly isChecked={false} />
        ) : (
          <Switch colorScheme={"green"} isReadOnly isChecked={true} />
        )}
      </HStack>
      <DeprecatedPage data={props.data.deprecated_firewall_rules} />
    </Stack>
  );
};

const DeprecatedPage = (props) => {
  console.log("deprecated", props.data);
  if (props.data !== undefined) {
    return (
      <Stack w="100%" spacing={8}>
        {props.data.map((group) => {
          if (group.name !== "USER") {
            return <DashView data={group} />;
          } else {
            return null;
          }
        })}
      </Stack>
    );
  } else {
    return null;
  }
};

const DashView = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Group",
        accessor: "name",
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
    ],
    []
  );

  const makeData = (data) => {
    if (data.dash.result.length < 1) {
      return [];
    }
    return data.dash.result;
  };

  const data = React.useMemo(() => makeData(props.data), [props.data]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const TableTitle = (name) => {
    if (name === "OWASP ModSecurity Core Rule Set") {
      return `Package: ${name}`;
    } else if (name === "CloudFlare") {
      return "Cloudflare Managed Ruleset";
    } else {
      return "Customer Requested Rules";
    }
  };

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">{TableTitle(props.data.name)}</Heading>
        {props.data.dash.result.length < 1 && (
          <Switch isReadOnly isChecked={false} />
        )}
      </HStack>
      {props.data.dash.result.length > 0 && (
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

const WebAppFirewall = (props) => {
  const getWafTableRender = (resultArray) => {
    for (let i = 0; i < resultArray.length; i++) {
      const current = resultArray[i];
      if (
        "source" in current &&
        current.source === "firewall_managed" &&
        current.name === "zone"
      ) {
        return { index: i, found: true };
      }
    }
    return { index: -1, found: false };
  };

  const { index, found } = getWafTableRender(
    props.data.managed_rulesets_results
  );

  return found ? (
    <WithTable
      data={{
        tableData: props.data.managed_rulesets_results[index],
        waf_setting: props.data.waf_setting,
        managed_rulesets_results: props.data.managed_rulesets_results,
      }}
    />
  ) : (
    <WithoutTable
      data={{
        waf_setting: props.data.waf_setting,
        deprecated_firewall_rules: props.data.deprecated_firewall_rules,
      }}
    />
  );
};

export default WebAppFirewall;
