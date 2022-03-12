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

const conditionsToMatch = (base, toCompare) => {};

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

const ZoneLockdown = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [zoneLockdownData, setZoneLockdownData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/lockdowns"
      );
      console.log("ADD CONDITIONS TO MATCH");
      const processedResp = resp.map((zone) => zone.resp);
      setZoneLockdownData(processedResp);
    }
    setZoneLockdownData();
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
    ];
    const dynamicHeaders =
      zoneLockdownData && zoneLockdownData[0].result.length
        ? HeaderFactory(zoneLockdownData.length)
        : zoneLockdownData && zoneLockdownData[0].result.length === 0
        ? HeaderFactoryWithTags(zoneLockdownData.length, false)
        : [];

    return zoneLockdownData &&
      zoneLockdownData[0].success &&
      zoneLockdownData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [zoneLockdownData]);

  const data = React.useMemo(
    () =>
      zoneLockdownData
        ? CompareData(
            CompareBaseToOthers,
            zoneLockdownData,
            conditionsToMatch,
            "Zone Lockdown"
          )
        : [],
    [zoneLockdownData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">Zone Lockdown</Heading>
        {/*!props.data.result.length && <Switch isReadOnly isChecked={false} />*/}
      </HStack>
      {!zoneLockdownData && <LoadingBox />}
      {zoneLockdownData && (
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
