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
  CompareBaseToOthersCategorical,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactoryOverloaded,
  Humanize,
} from "../../../utils/utils";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";

const convertOutput = (value) => {
  return value === true ? (
    <CheckIcon color={"green"} />
  ) : value === false ? (
    <CloseIcon color={"red"} />
  ) : (
    value
  );
};

const returnConditions = (data) => {
  if (data.success === false) {
    return data.messages[0];
  } else if (data.result.id === "html") {
    return data.result.value.html === "on" ? true : false;
  } else if (data.result.id === "css") {
    return data.result.value.css === "on" ? true : false;
  } else if (data.result.id === "js") {
    return data.result.value.js === "on" ? true : false;
  } else {
    return data.result.value;
  }
};

const Minify = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [minifyData, setMinifyData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/minify"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))],
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "html";
        return newObj;
      });
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "css";
        return newObj;
      });
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "js";
        return newObj;
      });
      setMinifyData(secondaryProcessedResp);
    }
    setMinifyData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Setting",
        accessor: "setting",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: (props) => convertOutput(props.value),
      },
    ];
    const dynamicHeaders =
      minifyData && minifyData.length
        ? HeaderFactoryOverloaded(minifyData[0].length, convertOutput)
        : [];

    return minifyData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [minifyData]);

  const data = React.useMemo(
    () =>
      minifyData
        ? minifyData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [minifyData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Minify</Heading>
      {!minifyData && <LoadingBox />}
      {minifyData && (
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

export default Minify;
