import { WarningTwoIcon } from "@chakra-ui/icons";
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
  HStack,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  UnsuccessfulHeaders,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {};

const CustomHostnames = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [customHostnamesData, setcustomHostnamesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/custom_hostnames"
      );
      const processedResp = resp.map((zone) => zone.resp);
      console.log(processedResp);
      console.log("ADD CONDITIONS TO MATCH");
      setcustomHostnamesData(processedResp);
    }
    setcustomHostnamesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Custom Hostname",
        accessor: "hostname",
      },
      {
        Header: "SSL/TLS Certification Status",
        accessor: (row, _) => {
          if (row.ssl === null) {
            return "SSL Not Requested";
          } else if (row.ssl.status === "active") {
            return <Tag colorScheme={"green"}>Active</Tag>;
          } else if (row.ssl.status === "pending_validation") {
            return (
              <Tag colorScheme={"blue"}>
                <Text>{`Pending Validation (${row.ssl.method.toUpperCase()})`}</Text>
              </Tag>
            );
          } else if (row.ssl.status === "expired") {
            return (
              <Tag colorScheme={"red"}>
                <HStack>
                  <WarningTwoIcon />
                  <Text>Expired (Error)</Text>
                </HStack>
              </Tag>
            );
          } else if (row.ssl.status === "validation_timed_out") {
            return (
              <Tag colorScheme={"red"}>
                <HStack>
                  <Text>{`Timed Out Validation (${row.ssl.method.toUpperCase()})`}</Text>
                </HStack>
              </Tag>
            );
          }
        },
      },
      {
        Header: "Expires On",
        accessor: (row, _) => {
          if (row.ssl === null) {
            return null;
          } else if (row.ssl?.certificates !== undefined) {
            return row.ssl.certificates[0].expires_on.substring(0, 10);
          } else {
            return "Cloudflare";
          }
        },
      },
      {
        Header: "Hostname Status",
        accessor: (row, _) => "Provisioned",
        Cell: (props) => <Tag colorScheme={"green"}>{props.value}</Tag>,
      },
      {
        Header: "Origin Server",
        accessor: (row, _) => {
          if ("custom_origin_server" in row) {
            return row.custom_origin_server;
          } else {
            return "Default";
          }
        },
      },
    ];

    const dynamicHeaders =
      customHostnamesData && customHostnamesData[0].result.length
        ? HeaderFactory(customHostnamesData.length)
        : customHostnamesData && customHostnamesData[0].result.length === 0
        ? HeaderFactoryWithTags(customHostnamesData.length, false)
        : [];

    return customHostnamesData &&
      customHostnamesData[0].success &&
      customHostnamesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [customHostnamesData]);

  const data = React.useMemo(
    () =>
      customHostnamesData
        ? CompareData(
            CompareBaseToOthers,
            customHostnamesData,
            conditionsToMatch,
            "Custom Hostnames"
          )
        : [],
    [customHostnamesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Custom Hostnames</Heading>
      {!customHostnamesData && <LoadingBox />}
      {customHostnamesData && (
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

export default CustomHostnames;
