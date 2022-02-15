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
} from "@chakra-ui/react";
import React from "react";
import { useTable } from "react-table";
import { Humanize } from "../../../utils/utils";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const CustomRules = (props) => {
  const columns = React.useMemo(
    () => [
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Name",
        accessor: "description",
      },
      {
        Header: "Expression",
        accessor: "expression",
      },
      {
        Header: "Enabled",
        accessor: "enabled",
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
    () => (props.data.success ? props.data.result.rules : []),
    [props.data.result.rules, props.data.success]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">{props.title}</Heading>
        {/*!props.data.result.rules.length && (
          <Switch isReadOnly isChecked={false} />
        )*/}
      </HStack>
      {!props.data.result.rules.length && (
        <UnsuccessfulDefault setting="Custom Rules" />
      )}
      {props.data.result.rules.length && (
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

export default CustomRules;
