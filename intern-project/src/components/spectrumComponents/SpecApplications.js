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
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { Humanize } from "../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const SpecApplications = (props) => {
  const OriginOutput = (data) => {
    if (data.origin_dns !== undefined) {
      return data.origin_dns.name;
    } else if (data.origin_direct !== undefined) {
      return data.origin_direct;
    } else {
      return "functionality to be added";
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Edge Port",
        accessor: "protocol",
      },
      {
        Header: "Origin",
        accessor: (row) => {
          return OriginOutput(row);
        },
        maxWidth: 150,
      },
      {
        Header: "Domain",
        accessor: (row) => {
          return row.dns.name;
        },
        maxWidth: 150,
      },
      {
        Header: "Edge IP Connectivity",
        accessor: (row) => row.edge_ips.connectivity,
        Cell: (props) =>
          props.value === "all" ? "IPv4 + IPv6" : `${Humanize(props.value)}`,
      },
      {
        Header: "TLS",
        accessor: "tls",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Argo Smart Routing",
        accessor: (row) =>
          row?.argo_smart_routing === undefined ? (
            <CloseIcon color={"red"} />
          ) : (
            <CheckIcon color={"green"} />
          ),
        maxWidth: 120,
      },
      {
        Header: "IP Access Rules",
        accessor: "ip_firewall",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
      {
        Header: "Proxy Protocols",
        accessor: "proxy_protocol",
        Cell: (props) => Humanize(props.value),
      },
    ],
    []
  );

  const data = React.useMemo(() => props.data.result, [props.data.result]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Spectrum Applications</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!props.data.result.length && (
        <UnsuccessfulDefault setting="Spectrum Applications" />
      )}
      {props.data.result.length && (
        <Table style={{ tableLayout: "auto" }} {...getTableProps}>
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
                        {console.log("www", column.maxWidth)}
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

export default SpecApplications;
