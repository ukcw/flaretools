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
  } else if (
    data.result.id === "enabled" &&
    typeof data.result.value === "object"
  ) {
    return true;
  } else if (data.result.value === "off") {
    return false;
  } else if (
    data.result.id === "cache_by_device_type" &&
    data.result.value?.cache_by_device_type !== undefined
  ) {
    return data.result.value.cache_by_device_type;
  } else if (
    data.result.id === "cache_by_device_type" &&
    data.result.value?.cache_by_device_type === undefined
  ) {
    return false;
  } else {
    return data.result.value;
  }
};

const AutomaticPlatformOptimization = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [
    automaticPlatformOptimizationData,
    setAutomaticPlatformOptimizationData,
  ] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/automatic_platform_optimization"
      );
      const resp2 = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/automatic_platform_optimization"
      );
      const valueResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result.id = "enabled";
        return newObj;
      });
      const cacheByDeviceTypeResp = resp2.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result.id = "cache_by_device_type";
        return newObj;
      });
      const secondaryProcessedResp = [
        [...valueResp],
        [...cacheByDeviceTypeResp],
      ];
      setAutomaticPlatformOptimizationData(secondaryProcessedResp);
    }
    setAutomaticPlatformOptimizationData();
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
      automaticPlatformOptimizationData &&
      automaticPlatformOptimizationData.length
        ? HeaderFactoryOverloaded(
            automaticPlatformOptimizationData[0].length,
            convertOutput
          )
        : [];

    return automaticPlatformOptimizationData
      ? baseHeaders.concat(dynamicHeaders)
      : [];
  }, [automaticPlatformOptimizationData]);

  const data = React.useMemo(
    () =>
      automaticPlatformOptimizationData
        ? automaticPlatformOptimizationData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [automaticPlatformOptimizationData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Automatic Platform Optimization
      </Heading>
      {!automaticPlatformOptimizationData && <LoadingBox />}
      {automaticPlatformOptimizationData && (
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

export default AutomaticPlatformOptimization;
