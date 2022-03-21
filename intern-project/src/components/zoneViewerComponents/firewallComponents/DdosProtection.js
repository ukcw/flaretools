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
  Tag,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { Humanize } from "../../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const DdosProtection = (props) => {
  let ddosOverride = false;

  if (props.data.ddos_l7.success) {
    ddosOverride =
      props.data.ddos_l7.result.rules[0].action_parameters.overrides.rules;
  }

  const CheckOverride = (id) => {
    for (let i = 0; i < ddosOverride.length; i++) {
      if (ddosOverride[i].id === id) {
        return ddosOverride[i].sensitivity_level;
      }
    }
    return false;
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Rule ID",
        accessor: "id",
        maxWidth: 200,
      },
      {
        Header: "Description",
        accessor: "description",
        maxWidth: 300,
      },
      {
        Header: "Tags",
        accessor: (row) =>
          row.categories.map((category) => (
            <Tag color={"grey.300"} key={category}>
              {category}
            </Tag>
          )),
        maxWidth: 120,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
        maxWidth: 120,
      },
      {
        Header: "Sensitivity",
        accessor: (row) => {
          if (ddosOverride) {
            const overrideValue = CheckOverride(row.id);
            return overrideValue ? Humanize(overrideValue) : "High";
          } else {
            return "High";
          }
        },
        maxWidth: 120,
      },
    ],
    []
  );

  const data = React.useMemo(
    () => props.data.ddos_ruleset.result.result.rules,
    [props.data.ddos_ruleset.result.result.rules]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          {props.title}
        </Heading>
        {/*!props.data.ddos_ruleset.result.result.rules.length && (
          <Switch isReadOnly isChecked={false} />
        )*/}
      </HStack>
      {!props.data.ddos_ruleset.result.result.rules.length && (
        <UnsuccessfulDefault setting={props.title} />
      )}
      {props.data.ddos_ruleset.result.result.rules.length && (
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

export default DdosProtection;
