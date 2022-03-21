import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
  VStack,
  Text,
} from "@chakra-ui/react";
import _ from "lodash";
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
  TimeToText,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const ModeOutput = (actionObj) => {
  if (actionObj.mode === "ban") {
    return `Block for ${TimeToText(actionObj.timeout)}`;
  } else if (actionObj.mode === "js_challenge") {
    return "JS Challenge";
  } else if (actionObj.mode === "simulate") {
    return `${Humanize(actionObj.mode)} for ${TimeToText(actionObj.timeout)}`;
  } else {
    return Humanize(actionObj.mode);
  }
};

const MethodsOutput = (methods) => {
  const outputArr = methods.filter((method) =>
    method !== "_ALL_" ? true : false
  );
  if (outputArr.length) {
    return `, Methods: ${outputArr.join(", ")}`;
  }
  return "";
};

const StatusCodeOutput = (response) => {
  if (response?.status !== undefined) {
    return `, Response code: ${response.status[0]}`;
  }
  return "";
};

const conditionsToMatch = (base, toCompare) => {
  const checkCorrelate = (base, toCompare) => {
    if (base?.correlate === undefined && toCompare?.correlate === undefined) {
      return true;
    } else if (
      base?.correlate === undefined ||
      toCompare?.correlate === undefined
    ) {
      return false;
    } else {
      return _.isEqual(base.correlate, toCompare.correlate);
    }
  };
  return (
    _.isEqual(base.action, toCompare.action) &&
    checkCorrelate(base, toCompare) &&
    _.isEqual(base.match, toCompare.match) &&
    base.period === toCompare.period &&
    base.threshold === toCompare.threshold &&
    base.disabled === toCompare.disabled
  );
};

const RateLimiting = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [rateLimitingData, setRateLimitingData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rate_limits"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setRateLimitingData(processedResp);
    }
    setRateLimitingData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Rule URL/Description",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>
                {row?.description !== undefined
                  ? row.description
                  : row.match.request.url}
              </Text>
              <Text color={"grey"}>{`${row.threshold} requests per ${TimeToText(
                row.period
              )}, ${ModeOutput(row.action)}${MethodsOutput(
                row.match.request.methods
              )}${StatusCodeOutput(row.match.response)}`}</Text>
            </VStack>
          );
        },
      },
      {
        Header: "Enabled",
        accessor: "disabled",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];

    const dynamicHeaders =
      rateLimitingData && rateLimitingData[0].result.length
        ? HeaderFactory(rateLimitingData.length)
        : rateLimitingData && rateLimitingData[0].result.length === 0
        ? HeaderFactoryWithTags(rateLimitingData.length, false)
        : [];

    return rateLimitingData &&
      rateLimitingData[0].success &&
      rateLimitingData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [rateLimitingData]);

  const data = React.useMemo(
    () =>
      rateLimitingData
        ? CompareData(
            CompareBaseToOthers,
            rateLimitingData,
            conditionsToMatch,
            "Rate Limiting"
          )
        : [],
    [rateLimitingData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Rate Limiting
        </Heading>
      </HStack>
      {!rateLimitingData && <LoadingBox />}
      {rateLimitingData && (
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

export default RateLimiting;
