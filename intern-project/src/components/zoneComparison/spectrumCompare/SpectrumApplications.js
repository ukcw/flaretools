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

const conditionsToMatch = (base, toCompare) => {};

const OriginOutput = (data) => {
  if (data.origin_dns !== undefined) {
    return data.origin_dns.name;
  } else if (data.origin_direct !== undefined) {
    return data.origin_direct;
  } else {
    return "functionality to be added";
  }
};

const SpectrumApplications = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [spectrumApplicationsData, setSpectrumApplicationsData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/spectrum/apps"
      );
      const processedResp = resp.map((zone) => zone.resp);
      console.log("ADD CONDITIONS TO MATCH");
      setSpectrumApplicationsData(processedResp);
    }
    setSpectrumApplicationsData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Edge Port",
        accessor: "protocol",
      },
      {
        Header: "Origin",
        accessor: (row) => {
          return OriginOutput(row);
        },
        maxWidth: 130,
      },
      {
        Header: "Domain",
        accessor: (row) => {
          return row.dns.name;
        },
        maxWidth: 130,
      },
      {
        Header: "Edge IP Connectivity",
        accessor: (row) => row.edge_ips.connectivity,
        Cell: (props) =>
          props.value === "all" ? "IPv4 + IPv6" : `${Humanize(props.value)}`,
      },
      {
        Header: "TLS",
        accessor: "tls",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Argo Smart Routing",
        accessor: (row) =>
          row?.argo_smart_routing === undefined ? (
            <CloseIcon color={"red"} />
          ) : (
            <CheckIcon color={"green"} />
          ),
        maxWidth: 120,
      },
      {
        Header: "IP Access Rules",
        accessor: "ip_firewall",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
      {
        Header: "Proxy Protocols",
        accessor: "proxy_protocol",
        Cell: (props) => Humanize(props.value),
      },
    ];

    const dynamicHeaders =
      spectrumApplicationsData && spectrumApplicationsData[0].result.length
        ? HeaderFactory(spectrumApplicationsData.length)
        : spectrumApplicationsData &&
          spectrumApplicationsData[0].result.length === 0
        ? HeaderFactoryWithTags(spectrumApplicationsData.length, false)
        : [];

    return spectrumApplicationsData &&
      spectrumApplicationsData[0].success &&
      spectrumApplicationsData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [spectrumApplicationsData]);

  const data = React.useMemo(
    () =>
      spectrumApplicationsData
        ? CompareData(
            CompareBaseToOthers,
            spectrumApplicationsData,
            conditionsToMatch,
            "Spectrum Applications"
          )
        : [],
    [spectrumApplicationsData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Spectrum Applications
      </Heading>
      {!spectrumApplicationsData && <LoadingBox />}
      {spectrumApplicationsData && (
        <Table style={{ tableLayout: "auto" }} {...getTableProps}>
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

export default SpectrumApplications;
