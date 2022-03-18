import {
  Heading,
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  HStack,
  Tag,
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
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  // match on id
  // sensitivity level
  // action
  // version
};

const isOverridden = (index, overrideArray, ruleId) => {
  if (
    overrideArray[index].result === null ||
    overrideArray[index].success === false ||
    overrideArray[index].result?.rules === undefined ||
    overrideArray[index].result.rules.length === 0
  ) {
    return false;
  } else {
    for (
      let i = 0;
      i <
      overrideArray[index].result.rules[0].action_parameters.overrides.rules
        .length;
      i++
    ) {
      if (
        ruleId ===
        overrideArray[index].result.rules[0].action_parameters.overrides.rules[
          i
        ].id
      ) {
        return overrideArray[index].result.rules[0].action_parameters.overrides
          .rules[i];
      }
    }
    return false; // no match for rule id was found meaning this rule was not overriden
  }
};

const DdosProtection = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [ddosProtectionData, setDdosProtectionData] = useState();

  useEffect(() => {
    async function getData() {
      const overrideResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/ddos_l7/entrypoint"
      );
      console.log("CHECKED - ADD CONDITIONS TO MATCH");
      const processedOverrideResp = overrideResp.map((zone) => zone.resp);
      const ddosResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/ddos_l7"
      );
      const processedDdosResp = ddosResp.map((zone, idx) => {
        const newObj = { ...zone.resp };
        newObj.result = newObj.result.rules.map((record) => {
          record["sensitivity_level"] = "high"; // this is default value from Cloudflare DASH
          // update values of record if there is an overriden record
          const overrideValue = isOverridden(
            idx,
            processedOverrideResp,
            record.id
          );

          if (overrideValue !== false) {
            const keys = Object.keys(overrideValue);
            keys.forEach((key) => {
              if (key !== "id") {
                record[key] = overrideValue[key];
              }
            });
          }
          return record;
        });
        return newObj;
      });
      setDdosProtectionData(processedDdosResp);
    }
    setDdosProtectionData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Rule ID",
        accessor: "id",
        maxWidth: 200,
      },
      {
        Header: "Description",
        accessor: "description",
        maxWidth: 300,
      },
      {
        Header: "Tags",
        accessor: (row) =>
          row.categories.map((category) => (
            <Tag color={"grey.300"} key={category}>
              {category}
            </Tag>
          )),
        maxWidth: 120,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
        maxWidth: 120,
      },
      {
        Header: "Sensitivity",
        accessor: "sensitivity_level",
        Cell: (props) => Humanize(props.value),
        maxWidth: 120,
      },
    ];
    const dynamicHeaders =
      ddosProtectionData && ddosProtectionData[0].result.length
        ? HeaderFactory(ddosProtectionData.length)
        : ddosProtectionData && ddosProtectionData[0].result.length === 0
        ? HeaderFactoryWithTags(ddosProtectionData.length, false)
        : [];

    return ddosProtectionData &&
      ddosProtectionData[0].success &&
      ddosProtectionData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [ddosProtectionData]);

  const data = React.useMemo(
    () =>
      ddosProtectionData
        ? CompareData(
            CompareBaseToOthers,
            ddosProtectionData,
            conditionsToMatch,
            "HTTP DDoS attack protection"
          )
        : [],
    [ddosProtectionData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          HTTP DDoS attack protection
        </Heading>
      </HStack>
      {!ddosProtectionData && <LoadingBox />}
      {ddosProtectionData && (
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
                      <Th
                        {...column.getHeaderProps({
                          style: {
                            maxWidth: column.maxWidth,
                          },
                        })}
                      >
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
                          <Td
                            {...cell.getCellProps({
                              style: {
                                maxWidth: cell.column.maxWidth,
                              },
                            })}
                          >
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

export default DdosProtection;
