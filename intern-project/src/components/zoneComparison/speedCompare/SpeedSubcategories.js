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
    <Tag colorScheme={"green"}>Match</Tag>
  ) : value === false ? (
    <Tag colorScheme={"red"}>No Match</Tag>
  ) : (
    value
  );
};

const returnConditions = (data) => {
  if (data.success === false) {
    return data.messages[0];
  } else if (data.result.value === "on") {
    return true;
  } else if (data.result.value === "off") {
    return false;
  } else {
    return data.result.value;
  }
};

const SpeedSubcategories = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [speedSubcategoriesData, setSpeedSubcategoriesData] = useState();
  useEffect(() => {
    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/mirage"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/image_resizing"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/polish"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/brotli"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/early_hints"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/h2_prioritization"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/rocket_loader"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/prefetch_preload"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      setSpeedSubcategoriesData(processedResp);
    }
    setSpeedSubcategoriesData();
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
        Cell: (props) =>
          props.value === true ? (
            <CheckIcon color={"green"} />
          ) : props.value === false ? (
            <CloseIcon color={"red"} />
          ) : (
            props.value
          ),
      },
    ];
    const dynamicHeaders =
      speedSubcategoriesData && speedSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            speedSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return speedSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [speedSubcategoriesData]);

  const data = React.useMemo(
    () =>
      speedSubcategoriesData
        ? speedSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [speedSubcategoriesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Speed Subcategories</Heading>
      {!speedSubcategoriesData && <LoadingBox />}
      {speedSubcategoriesData && (
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

export default SpeedSubcategories;
