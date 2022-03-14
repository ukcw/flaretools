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
  CompareData,
  getMultipleZoneSettings,
  HeaderFactory,
  Humanize,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const ValueName = (name) => {
  switch (name) {
    case "off":
      return "Off (not secure)";
    case "flexible":
      return "Flexible";
    case "full":
      return "Full";
    case "strict":
      return "Full (strict)";
    case "origin_pull":
      return "Strict (SSL-Only Origin Pull)";
    default:
      return null;
  }
};

const conditionsToMatch = (base, toCompare) => {
  return (
    base.value === toCompare.value &&
    base.certificate_status === toCompare.certificate_status
  );
};

const SslSetting = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [sslSettingData, setSslSettingData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/ssl"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = [newObj.result];
        return newObj;
      });
      setSslSettingData(processedResp);
    }
    setSslSettingData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Value",
        accessor: "value",
        Cell: (props) => ValueName(props.value),
      },
      {
        Header: "Certificate Status",
        accessor: "certificate_status",
        Cell: (props) => Humanize(props.value),
      },
    ];

    const dynamicHeaders = sslSettingData
      ? HeaderFactory(sslSettingData.length)
      : [];

    return sslSettingData &&
      sslSettingData[0].success &&
      sslSettingData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [sslSettingData]);

  const data = React.useMemo(() => {
    return sslSettingData
      ? CompareData(
          CompareBaseToOthers,
          sslSettingData,
          conditionsToMatch,
          "SSL Setting"
        )
      : [];
  }, [sslSettingData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          SSL Setting
        </Heading>
      </HStack>
      {!sslSettingData && <LoadingBox />}
      {sslSettingData && (
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

export default SslSetting;
