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
import {
  CompareBaseToOthers,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactory,
  Humanize,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return base.value === toCompare.value;
};

const CnameFlattening = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [cnameFlatteningData, setCnameFlatteningData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/cname_flattening"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = [newObj.result];
        return newObj;
      });
      setCnameFlatteningData(processedResp);
    }
    setCnameFlatteningData();
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
        Header: "Value",
        accessor: "value",
        Cell: (props) => Humanize(props.value),
      },
    ];

    const dynamicHeaders = cnameFlatteningData
      ? HeaderFactory(cnameFlatteningData.length)
      : [];

    return cnameFlatteningData &&
      cnameFlatteningData[0].success &&
      cnameFlatteningData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [cnameFlatteningData]);

  const data = React.useMemo(() => {
    return cnameFlatteningData
      ? CompareData(
          CompareBaseToOthers,
          cnameFlatteningData,
          conditionsToMatch,
          "CNAME Flattening"
        )
      : [];
  }, [cnameFlatteningData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          CNAME Flattening
        </Heading>
      </HStack>
      {!cnameFlatteningData && <LoadingBox />}
      {cnameFlatteningData && (
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

export default CnameFlattening;
