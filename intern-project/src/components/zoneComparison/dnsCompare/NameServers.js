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

// make data.result = newly formatted object
const makeData = (data) => {
  return data.map((nameServer) => {
    const dataObj = {
      type: "NS",
      value: nameServer,
    };
    return dataObj;
  });
};

const conditionsToMatch = (base, toCompare) => {
  return base.value === toCompare.value;
};

const NameServers = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [nameServers, setNameServers] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/zone_details"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.zone_details };
        if (zone.zone_details.result?.name_servers !== undefined) {
          newObj["result"] = makeData(zone.zone_details.result.name_servers);
        } else {
          newObj["result"] = { type: "NS", value: [] };
        }
        return newObj;
      });
      setNameServers(processedResp);
    }
    setNameServers();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Type",
        accessor: "type",
        Cell: (props) => "NS",
      },
      {
        Header: "Value",
        accessor: "value",
      },
    ];

    const dynamicHeaders = nameServers ? HeaderFactory(nameServers.length) : [];

    return nameServers && nameServers[0].success && nameServers[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [nameServers]);

  const data = React.useMemo(
    () =>
      nameServers
        ? compareData(
            CompareBaseToOthers,
            nameServers,
            conditionsToMatch,
            "Cloudflare Nameservers"
          )
        : [],
    [nameServers]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Cloudflare Nameservers</Heading>
      {!nameServers && <LoadingBox />}
      {nameServers && (
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
