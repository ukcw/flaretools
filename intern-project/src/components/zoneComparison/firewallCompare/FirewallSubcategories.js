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
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

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

const FirewallSubcategories = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [firewallSubcategoriesData, setFirewallSubcategoriesData] = useState();
  useEffect(() => {
    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/security_level"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/challenge_ttl"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/browser_check"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/privacy_pass"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          return zone.resp;
        })
      );
      setFirewallSubcategoriesData(processedResp);
    }
    setFirewallSubcategoriesData();
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
      firewallSubcategoriesData && firewallSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            firewallSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return firewallSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [firewallSubcategoriesData]);

  const data = React.useMemo(
    () =>
      firewallSubcategoriesData
        ? firewallSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [firewallSubcategoriesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Firewall Subcategories
      </Heading>
      {!firewallSubcategoriesData && <LoadingBox />}
      {firewallSubcategoriesData && (
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

export default FirewallSubcategories;
