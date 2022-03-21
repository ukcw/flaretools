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
import { TimeToText } from "../../../utils/utils";
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
        maxWidth: 250,
      },
      {
        Header: "Pools",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              {row.default_pools.map((poolId) => {
                if (props.pools.success && props.pools) {
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
        maxWidth: 400,
        wordWrap: "break-all",
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

  /*
  const makeData = (data) => {
    return data.map((row) => {
      return row.default_pools.map((poolId) => {
        if (props.pools) {
          for (let i = 0; i < props.pools.result.length; i++) {
            if (poolId === props.pools.result[i].id) {
              return {
                id: poolId,
                name: props.pools.result[i].name,
                address: props.pools.result[i].origins[0].address,
                weight: props.pools.result[i].origins[0].weight,
              };
            }
          }
        }
      });
    });
  };*/

  const data = React.useMemo(
    () => (props.data.success ? props.data.result : []),
    [props.data.result, props.data.success]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Load Balancers
        </Heading>
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
                                wordBreak: cell.column.wordWrap,
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

export default LoadBalancers;
