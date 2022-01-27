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
  VStack,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { TimeToText } from "../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const LoadBalancers = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Hostname",
        accessor: (row) => {
          const output = /(\w+).+/.exec(row.name)[0];
          return output;
        },
      },
      {
        Header: "Pools",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              {row.default_pools.map((poolId) => {
                if (props.pools) {
                  for (let i = 0; i < props.pools.result.length; i++) {
                    if (poolId === props.pools.result[i].id) {
                      return (
                        <div key={poolId}>
                          <Text>{`Name: ${props.pools.result[i].name}, Address: ${props.pools.result[i].origins[0].address}, Weight: ${props.pools.result[i].origins[0].weight}`}</Text>
                        </div>
                      );
                    }
                  }
                } else {
                  return "";
                }
              })}
            </VStack>
          );
        },
      },
      {
        Header: "TTL",
        accessor: (row) => {
          if (row?.ttl !== undefined) {
            return TimeToText(row.ttl);
          }
          return "Automatic";
        },
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
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
    [props.pools]
  );

  const data = React.useMemo(() => props.data.result, [props.data.result]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Load Balancers</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!props.data.result.length && (
        <UnsuccessfulDefault setting="Load Balancers" />
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

export default LoadBalancers;
