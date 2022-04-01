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
import {
  CategoryTitle,
  CompareBaseToOthers,
  CompareData,
  DisabledOrEnabled,
  getMultipleZoneSettings,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return (
    base.value.strict_transport_security.enabled ===
    toCompare.value.strict_transport_security.enabled
  );
};

const HttpStrictTransportSecurity = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [hstsData, setHstsData] = useState(); // HSTS = HTTP Strict Transport Security

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/security_header"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = [newObj.result];
        return newObj;
      });
      setHstsData(processedResp);
    }
    setHstsData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Setting",
        accessor: "id",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Enabled",
        accessor: (row) => row.value.strict_transport_security.enabled,
        Cell: (props) => DisabledOrEnabled(props.value),
      },
    ];

    const dynamicHeaders = hstsData
      ? HeaderFactoryWithTags(hstsData.length, true)
      : [];

    return hstsData && hstsData[0].success && hstsData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [hstsData]);

  const data = React.useMemo(
    () =>
      hstsData
        ? CompareData(
            CompareBaseToOthers,
            hstsData,
            conditionsToMatch,
            "HTTP Strict Transport Security"
          )
        : [],
    [hstsData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      {<CategoryTitle id={props.id} copyable={false} />}
      {!hstsData && <LoadingBox />}
      {hstsData && (
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

export default HttpStrictTransportSecurity;
