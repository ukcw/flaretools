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

const ScrapeShieldSubcategories = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [scrapeShieldSubcategoriesData, setScrapeShieldSubcategoriesData] =
    useState();

  useEffect(() => {
    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/email_obfuscation"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/server_side_exclude"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/hotlink_protection"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      console.log(processedResp);
      setScrapeShieldSubcategoriesData(processedResp);
    }
    setScrapeShieldSubcategoriesData();
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
      scrapeShieldSubcategoriesData && scrapeShieldSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            scrapeShieldSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return scrapeShieldSubcategoriesData
      ? baseHeaders.concat(dynamicHeaders)
      : [];
  }, [scrapeShieldSubcategoriesData]);

  const data = React.useMemo(
    () =>
      scrapeShieldSubcategoriesData
        ? scrapeShieldSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [scrapeShieldSubcategoriesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Scrape Shield Subcategories</Heading>
      {!scrapeShieldSubcategoriesData && <LoadingBox />}
      {scrapeShieldSubcategoriesData && (
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

export default ScrapeShieldSubcategories;
