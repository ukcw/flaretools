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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  CountDeltaDifferences,
  getMultipleZoneSettings,
  HeaderFactory,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) =>
  base.type === toCompare.type &&
  base.name === toCompare.name &&
  base.content === toCompare.content &&
  base.proxied === toCompare.proxied &&
  base.ttl === toCompare.ttl;

const DnsRecords = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [dnsRecords, setDnsRecords] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/dns_records"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setDnsRecords(processedResp);
    }
    setDnsRecords();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Content",
        accessor: "content",
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? <CheckIcon color="green" /> : <CloseIcon color="red" />,
      },
      {
        Header: "TTL",
        accessor: "ttl",
        Cell: (props) => (props.value === 1 ? <Text>Auto</Text> : props.value),
      },
    ];

    const dynamicHeaders =
      dnsRecords !== undefined ? HeaderFactory(dnsRecords.length) : [];

    return dnsRecords && dnsRecords[0].success && dnsRecords[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [dnsRecords]);

  const data = React.useMemo(
    () =>
      dnsRecords
        ? CompareData(
            CompareBaseToOthers,
            dnsRecords,
            conditionsToMatch,
            "DNS Management"
          )
        : [],
    [dnsRecords]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const delta = React.useMemo(
    () => (dnsRecords ? CountDeltaDifferences(zoneKeys, data, dnsRecords) : []),
    [data, dnsRecords, zoneKeys]
  );

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        DNS Management
      </Heading>
      {!dnsRecords && <LoadingBox />}
      {dnsRecords && (
        <Table style={{ tableLayout: "fixed" }} {...getTableProps}>
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

export default DnsRecords;
