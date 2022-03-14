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

function isObject(obj) {
  return obj === Object(obj);
}

const makeData = (data) => {
  let priorityCounter = 1;
  data.forEach((row) => {
    row.priority = priorityCounter;
    priorityCounter++;
  });
  return data;
};

const ActionsOutput = (actionsArr) => {
  const toBeConcatenatedActions = actionsArr.map((action) => {
    if (isObject(action.value)) {
      if (
        action.value?.url !== undefined &&
        action.value?.status_code !== undefined
      ) {
        return `${Humanize(action.id)}: (Status Code: ${
          action.value.status_code
        }, URL: ${action.value.url})`;
      } else if (action.id === "minify") {
        return `${Humanize(action.id.toString())}: (HTML: ${Humanize(
          action.value.html
        )}, CSS: ${Humanize(action.value.css)}, JS: ${Humanize(
          action.value.js
        )} )`;
      }
    } else {
      if (
        action.id === "resolve_override" ||
        action.id === "host_header_override"
      ) {
        return `${Humanize(action.id.toString())}: ${
          action?.value !== undefined ? action.value.toString() : ""
        }`;
      } else {
        return `${Humanize(action.id.toString())}${
          action?.value !== undefined ? ": " : ""
        }${
          action?.value !== undefined ? Humanize(action.value.toString()) : ""
        }`;
      }
    }
  });
  return toBeConcatenatedActions.join(", ");
};

const conditionsToMatch = (base, toCompare) => {};

const PageRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [pageRulesData, setPageRulesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/pagerules"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = makeData(zone.resp.result);
        return newObj;
      });
      setPageRulesData(processedResp);
    }
    setPageRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "URL/Description",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>{row.targets[0].constraint.value}</Text>
              <Text color="grey">{ActionsOutput(row.actions)}</Text>
            </VStack>
          );
        },
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: (props) =>
          props.value === "active" ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];

    const dynamicHeaders =
      pageRulesData && pageRulesData[0].result.length
        ? HeaderFactory(pageRulesData.length)
        : pageRulesData && pageRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(pageRulesData.length, false)
        : [];

    return pageRulesData &&
      pageRulesData[0].success &&
      pageRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [pageRulesData]);

  const data = React.useMemo(
    () =>
      pageRulesData
        ? CompareData(
            CompareBaseToOthers,
            pageRulesData,
            conditionsToMatch,
            "Page Rules"
          )
        : [],
    [pageRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Page Rules
        </Heading>
      </HStack>
      {console.log("ADD CONDITIONS TO MATCH")}
      {!pageRulesData && <LoadingBox />}
      {pageRulesData && (
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

export default PageRules;
