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
import UnsuccessfulDefault from "../../zoneViewerComponents/UnsuccessfulDefault";

const NameServers = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Type",
        accessor: "type",
        Cell: (props) => "NS",
      },
      {
        Header: "Value",
        accessor: "value",
      },
    ],
    []
  );

  const makeData = (data) => {
    return data.map((nameServer) => {
      const dataObj = {
        type: "NS",
        value: nameServer,
      };
      return dataObj;
    });
  };

  const data = React.useMemo(
    () =>
      props.data.success && props.data.result?.name_servers !== undefined
        ? makeData(props.data.result.name_servers)
        : [],
    [props.data.result.name_servers, props.data.success]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Cloudflare Nameservers
      </Heading>
      {props.data.result?.name_servers === undefined && (
        <UnsuccessfulDefault setting="Cloudflare Nameservers" />
      )}
      {props.data.result?.name_servers !== undefined && (
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

export default NameServers;
