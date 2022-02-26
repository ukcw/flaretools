import {
  Heading,
  HStack,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  compareData,
  getMultipleZoneSettings,
  HeaderFactory,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const makeData = (data) => {
  if (
    data.vanity_name_servers.length !== 0 &&
    data.vanity_name_servers_ips !== null
  ) {
    return data.vanity_name_servers.map((nameServer) => {
      const dataObj = {
        nameserver: nameServer,
        ipv4: data.vanity_name_servers_ips[nameServer]["ipv4"],
        ipv6: data.vanity_name_servers_ips[nameServer]["ipv6"],
      };
      return dataObj;
    });
  } else {
    return [];
  }
};

const conditionsToMatch = (base, toCompare) => {
  return (
    base.nameserver === toCompare.nameserver &&
    base.ipv4 === toCompare.ipv4 &&
    base.ipv6 === toCompare.ipv6
  );
};

const CustomNs = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [customNs, setCustomNs] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/zone_details"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.zone_details };
        if (zone.zone_details.result?.vanity_name_servers !== undefined) {
          newObj["result"] = makeData(zone.zone_details.result);
        } else {
          newObj["result"] = [];
        }
        return newObj;
      });
      setCustomNs(processedResp);
    }
    setCustomNs();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
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
    ];

    const dynamicHeaders = customNs ? HeaderFactory(customNs.length) : [];

    return customNs && customNs[0].success && customNs[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [customNs]);

  const data = React.useMemo(() => {
    return customNs
      ? compareData(
          CompareBaseToOthers,
          customNs,
          conditionsToMatch,
          "Custom Nameservers"
        )
      : [];
  }, [customNs]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Custom Nameservers</Heading>
      </HStack>
      {!customNs && <LoadingBox />}
      {customNs && (
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

export default CustomNs;
