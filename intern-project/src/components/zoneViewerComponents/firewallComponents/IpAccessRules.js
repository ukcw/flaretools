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
import React from "react";
import { useTable } from "react-table";
import { CountryCodeLookup, Humanize } from "../../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const IpAccessRules = (props) => {
  const ActionName = (action) => {
    if (action === "js_challenge") {
      return "JavaScript Challenge";
    } else {
      return Humanize(action);
    }
  };

  const columns = React.useMemo(
    () => [
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
    ],
    []
  );

  const data = React.useMemo(
    () => (props.data.success ? props.data.result : []),
    [props.data.result, props.data.success]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">IP Access Rules</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!props.data.result.length && (
        <UnsuccessfulDefault setting="IP Access Rules" />
      )}
      {props.data.result.length && (
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
