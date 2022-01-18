import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  Stack,
  Table,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { Humanize } from "../../utils/utils";

const EdgeCertificates = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Hosts",
        accessor: "hosts",
        Cell: (props) => {
          return props.value.join(", ");
        },
      },
      {
        Header: "Type",
        accessor: "type",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) => (
          <Tag colorScheme={"green"}>{Humanize(props.value)}</Tag>
        ),
      },
      {
        Header: "Expires On",
        accessor: "expires_on",
        Cell: (props) => props.value.substring(0, 10),
      },
    ],
    []
  );

  const makeData = (data) => {
    return data.map((row) => {
      const dataObj = {
        hosts: row.hosts,
        type: row.type,
        status: row.status,
        expires_on: row.certificates[0].expires_on,
      };
      return dataObj;
    });
  };

  const data = React.useMemo(
    () => makeData(props.data.result),
    [props.data.result]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Edge Certificates</Heading>
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

export default EdgeCertificates;
