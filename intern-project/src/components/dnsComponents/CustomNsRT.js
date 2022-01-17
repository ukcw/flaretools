import {
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const CustomNsRT = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Nameserver",
        accessor: "nameserver",
      },
      {
        Header: "IPv4 Address",
        accessor: "ipv4",
      },
      {
        Header: "IPv6 Address",
        accessor: "ipv6",
      },
    ],
    []
  );

  const makeData = (data) => {
    if (
      data.hasOwnProperty("vanity_name_servers") &&
      data.hasOwnProperty("vanity_name_servers_ips")
    ) {
      return data.vanity_name_servers.map((nameServer) => {
        const dataObj = {
          nameserver: nameServer,
          ipv4: data.vanity_name_servers_ips.nameServer["ipv4"],
          ipv6: data.vanity_name_servers_ips.nameServer["ipv6"],
        };
        return dataObj;
      });
    } else {
      return null;
    }
  };

  const data = React.useMemo(() => {
    if (props.success) {
      return makeData(props.data.result);
    } else {
      return [];
    }
  }, [props.data.result, props.success]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Custom Nameservers</Heading>
      {props.data.result.hasOwnProperty("vanity_name_servers") ? null : (
        <UnsuccessfulDefault errors={props.errors} />
      )}
      {props.data.result && (
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

export default CustomNsRT;
