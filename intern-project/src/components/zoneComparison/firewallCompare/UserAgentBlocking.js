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
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import { Humanize } from "../../../utils/utils";

const conditionsToMatch = (base, toCompare) => {};

const UserAgentBlocking = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [userAgentBlockingData, setUserAgentBlockingData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/ua_rules"
      );
      console.log("ADD CONDITIONS TO MATCH");
      const processedResp = resp.map((zone) => zone.resp);
      setUserAgentBlockingData(processedResp);
    }
    setUserAgentBlockingData();
    getData();
  }, [credentials, zoneKeys]);
  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Rule Name/Description",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>{row.description}</Text>
              <Text color={"grey"}>{row.configuration.value}</Text>
            </VStack>
          );
        },
      },
      {
        Header: "Action",
        accessor: "mode",
        Cell: (props) => Humanize(props.value),
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
    ];

    const dynamicHeaders =
      userAgentBlockingData && userAgentBlockingData[0].result.length
        ? HeaderFactory(userAgentBlockingData.length)
        : userAgentBlockingData && userAgentBlockingData[0].result.length === 0
        ? HeaderFactoryWithTags(userAgentBlockingData.length, false)
        : [];

    return userAgentBlockingData &&
      userAgentBlockingData[0].success &&
      userAgentBlockingData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [userAgentBlockingData]);

  const data = React.useMemo(
    () =>
      userAgentBlockingData
        ? CompareData(
            CompareBaseToOthers,
            userAgentBlockingData,
            conditionsToMatch,
            "User Agent Blocking"
          )
        : [],
    [userAgentBlockingData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          User Agent Blocking
        </Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!userAgentBlockingData && <LoadingBox />}
      {userAgentBlockingData && (
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

export default UserAgentBlocking;
