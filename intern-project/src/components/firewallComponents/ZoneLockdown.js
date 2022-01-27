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
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const ZoneLockdown = (props) => {
  const SubDescription = (result) => {
    let numberOfUrls = null;
    let numberofIps = null;

    if (result?.urls !== undefined && result.urls.length > 0) {
      numberOfUrls = result.urls.length;
    }

    if (
      result?.configurations !== undefined &&
      result.configurations.length > 0
    ) {
      numberofIps = result.configurations.length;
    }

    if (numberOfUrls && numberofIps) {
      return `${numberOfUrls} URLs, ${numberofIps} IP Addresses`;
    } else if (numberOfUrls) {
      return `${numberOfUrls} URLs`;
    } else if (numberofIps) {
      return `${numberofIps} IP Addresses`;
    } else {
      return "";
    }
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "Rule Name/Description",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>{row.description}</Text>
              <Text color={"grey"}>{SubDescription(row)}</Text>
            </VStack>
          );
        },
      },
      {
        Header: "Enabled",
        accessor: "paused",
        Cell: (props) =>
          props.value ? (
            <CloseIcon color={"red"} />
          ) : (
            <CheckIcon color={"green"} />
          ),
      },
    ],
    []
  );

  const data = React.useMemo(() => props.data.result, [props.data.result]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Zone Lockdown</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!props.data.result.length && (
        <UnsuccessfulDefault setting="Zone Lockdown" />
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

export default ZoneLockdown;
