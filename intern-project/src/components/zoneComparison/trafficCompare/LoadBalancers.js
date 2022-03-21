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
  getMultipleAccountSettings,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  TimeToText,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return (
    _.isEqual(base.default_pools, toCompare.default_pools) &&
    _.isEqual(base.fallback_pool, toCompare.fallback_pool) &&
    base.enabled === toCompare.enabled &&
    base.proxied === toCompare.proxied &&
    base.session_affinity === toCompare.session_affinity &&
    _.isEqual(
      base.session_affinity_attributes,
      toCompare.session_affinity_attributes
    ) &&
    base.steering_policy === toCompare.steering_policy
  );
};

const LoadBalancers = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [loadBalancersData, setLoadBalancersData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/load_balancers"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const resp_pools = await getMultipleAccountSettings(
        zoneKeys,
        credentials,
        zoneDetails,
        "/load_balancers/pools"
      );
      const processRespPool = resp_pools.map((zone) => zone.resp);
      processedResp.forEach((zone, idx) => {
        zone.result.forEach((lb) => {
          lb["pools"] = processRespPool[idx].result;
        });
        setLoadBalancersData(processedResp);
      });
    }
    setLoadBalancersData();
    getData();
  }, [credentials, zoneDetails, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Hostname",
        accessor: (row) => {
          const output = /(\w+).+/.exec(row.name)[0];
          return output;
        },
        maxWidth: 250,
      },
      {
        Header: "Pools",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              {row.default_pools.map((poolId) => {
                if (row.pools) {
                  for (let i = 0; i < row.pools.length; i++) {
                    if (poolId === row.pools[i].id) {
                      return (
                        <div key={poolId}>
                          <Text>{`Name: ${row.pools[i].name}, Address: ${row.pools[i].origins[0].address}, Weight: ${row.pools[i].origins[0].weight}`}</Text>
                        </div>
                      );
                    }
                  }
                } else {
                  return "";
                }
              })}
            </VStack>
          );
        },
        maxWidth: 400,
        wordWrap: "break-all",
      },
      {
        Header: "TTL",
        accessor: (row) => {
          if (row?.ttl !== undefined) {
            return TimeToText(row.ttl);
          }
          return "Automatic";
        },
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
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
    ];
    const dynamicHeaders =
      loadBalancersData && loadBalancersData[0].result.length
        ? HeaderFactory(loadBalancersData.length)
        : loadBalancersData && loadBalancersData[0].result.length === 0
        ? HeaderFactoryWithTags(loadBalancersData.length, false)
        : [];

    return loadBalancersData &&
      loadBalancersData[0].success &&
      loadBalancersData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [loadBalancersData]);

  /*
    const makeData = (data) => {
      return data.map((row) => {
        return row.default_pools.map((poolId) => {
          if (props.pools) {
            for (let i = 0; i < props.pools.result.length; i++) {
              if (poolId === props.pools.result[i].id) {
                return {
                  id: poolId,
                  name: props.pools.result[i].name,
                  address: props.pools.result[i].origins[0].address,
                  weight: props.pools.result[i].origins[0].weight,
                };
              }
            }
          }
        });
      });
    };*/

  const data = React.useMemo(
    () =>
      loadBalancersData
        ? CompareData(
            CompareBaseToOthers,
            loadBalancersData,
            conditionsToMatch,
            "Load Balancers"
          )
        : [],
    [loadBalancersData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Load Balancers
        </Heading>
      </HStack>
      {!loadBalancersData && <LoadingBox />}
      {loadBalancersData && (
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
                                wordBreak: cell.column.wordWrap,
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

export default LoadBalancers;
