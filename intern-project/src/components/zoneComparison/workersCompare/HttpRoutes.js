import {
  Heading,
  Stack,
  Table,
  Tag,
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
  HeaderFactoryWithTags,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return base.pattern === toCompare.pattern && base.script === toCompare.script;
};

const HttpRoutes = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [httpRoutesData, setHttpRoutesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/workers/routes"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setHttpRoutesData(processedResp);
    }
    setHttpRoutesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Route",
        accessor: "pattern",
      },
      {
        Header: "Service",
        accessor: "script",
        Cell: (props) =>
          props.value ? (
            props.value
          ) : (
            <Tag>Services are disabled on this route</Tag>
          ),
      },
      {
        Header: "Environment",
        accessor: (row) => (row.script ? "production" : null),
      },
    ];

    const dynamicHeaders =
      httpRoutesData && httpRoutesData[0].result.length
        ? HeaderFactory(httpRoutesData.length)
        : httpRoutesData && httpRoutesData[0].result.length === 0
        ? HeaderFactoryWithTags(httpRoutesData.length, false)
        : [];

    return httpRoutesData &&
      httpRoutesData[0].success &&
      httpRoutesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [httpRoutesData]);

  const data = React.useMemo(
    () =>
      httpRoutesData
        ? CompareData(
            CompareBaseToOthers,
            httpRoutesData,
            conditionsToMatch,
            "HTTP Routes"
          )
        : [],
    [httpRoutesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">HTTP Routes</Heading>
      {!httpRoutesData && <LoadingBox />}
      {httpRoutesData && (
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

export default HttpRoutes;
