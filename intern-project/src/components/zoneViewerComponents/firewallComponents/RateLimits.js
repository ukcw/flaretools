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
import React from "react";
import { useTable } from "react-table";
import { Humanize, TimeToText } from "../../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

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

const RateLimiting = (props) => {
  const columns = React.useMemo(
    () => [
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
    ],
    []
  );

  const data = React.useMemo(
    () => (props.data.success ? props.data.result : []),
    [props.data.result, props.data.success]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Rate Limiting</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!props.data.result.length && (
        <UnsuccessfulDefault setting="Rate Limiting" />
      )}
      {props.data.result.length && (
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
