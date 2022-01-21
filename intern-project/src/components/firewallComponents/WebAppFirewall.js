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
  Tag,
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
        {console.log("JK", props.data.tableData.result)}
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
    </Stack>
  );
};

const WebAppFirewall = (props) => {
  console.log("managed", props.data.managed_rulesets_results);
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
    <WithoutTable data={{ waf_setting: props.data.waf_setting }} />
  );
};

export default WebAppFirewall;
