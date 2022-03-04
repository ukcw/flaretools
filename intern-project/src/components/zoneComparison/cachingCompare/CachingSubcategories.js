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
  } else if (data.result.value === "on") {
    return true;
  } else if (data.result.value === "off") {
    return false;
  } else {
    return data.result.value;
  }
};

const CachingSubcategories = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [cachingSubcategoriesData, setCachingSubcategoriesData] = useState();
  useEffect(() => {
    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(zoneKeys, credentials, "/argo/tiered_caching"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/cache/tiered_cache_smart_topology_enable"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/cache_level"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/browser_cache_ttl"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/always_online"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/development_mode"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/sort_query_string_for_cache"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.cache !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.cache.crawlhints_enabled;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setCachingSubcategoriesData(processedResp);
    }
    setCachingSubcategoriesData();
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
      cachingSubcategoriesData && cachingSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            cachingSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return cachingSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [cachingSubcategoriesData]);

  const data = React.useMemo(
    () =>
      cachingSubcategoriesData
        ? cachingSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result?.id !== undefined
                ? data[0].result.id
                : "crawlhints"
            );
          })
        : [],
    [cachingSubcategoriesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Caching Subcategories</Heading>
      {!cachingSubcategoriesData && <LoadingBox />}
      {cachingSubcategoriesData && (
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

export default CachingSubcategories;
