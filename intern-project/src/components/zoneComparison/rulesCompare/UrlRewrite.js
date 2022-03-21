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
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const GetExpressionOutput = (expr) => {
  if (/ip.geoip.country /.test(expr)) {
    return "Country";
  } else if (/ip.geoip.continent /.test(expr)) {
    return "Continent";
  } else if (/http.host /.test(expr)) {
    return "Hostname";
  } else if (/ip.geoip.asnum /.test(expr)) {
    return "AS Num";
  } else if (/http.cookie /.test(expr)) {
    return "Cookie";
  } else if (/ip.src /.test(expr)) {
    return "IP Source Address";
  } else if (/http.referer /.test(expr)) {
    return "Referer";
  } else if (/http.request.method /.test(expr)) {
    return "Request Method";
  } else if (/ssl /.test(expr)) {
    return "SSL/HTTPS";
  } else if (/http.request.full_uri /.test(expr)) {
    return "URI Full";
  } else if (/http.request.uri /.test(expr)) {
    return "URI";
  } else if (/http.request.uri.path /.test(expr)) {
    return "URI Path";
  } else if (/http.request.uri.query /.test(expr)) {
    return "URI Query";
  } else if (/http.request.version /.test(expr)) {
    return "HTTP Version";
  } else if (/http.user_agent /.test(expr)) {
    return "User Agent";
  } else if (/http.x_forwarded_for /.test(expr)) {
    return "X-Forwarded-For";
  } else if (/cf.tls_client_auth.cert_verified /.test(expr)) {
    return "Client Certificate Verified";
  } else if (/ip.geoip.is_in_european_union /.test(expr)) {
    return "European Union";
  } else {
    return expr;
  }
};

const makeData = (data) => {
  let priorityCounter = 1;
  data.forEach((row) => {
    row.priority = priorityCounter;
    priorityCounter++;
  });
  return data;
};

const conditionsToMatch = (base, toCompare) => {
  return (
    base.action === toCompare.action &&
    _.isEqual(base.action_parameters, toCompare.action_parameters) &&
    base.enabled === toCompare.enabled &&
    base.expression === toCompare.expression &&
    base.priority === toCompare.priority
  );
};

const UrlRewrite = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [urlRewriteData, setUrlRewriteData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_request_transform/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] =
          zone.resp.result?.rules !== undefined
            ? makeData(zone.resp.result.rules)
            : [];
        return newObj;
      });
      setUrlRewriteData(processedResp);
    }
    setUrlRewriteData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Description",
        accessor: (row) => {
          const exprs = row.expression.split(/\band\b|\bor\b/);
          const output = exprs.map((expr) => GetExpressionOutput(expr));
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              <Text>{row.description}</Text>
              <Text color="grey">{output.join(", ")}</Text>
            </VStack>
          );
        },
      },
      {
        Header: "Expression",
        accessor: "expression",
      },
      {
        Header: "Then...",
        accessor: (row) => {
          if (
            row?.action !== undefined &&
            row?.action_parameters !== undefined &&
            row.action_parameters?.uri !== undefined
          ) {
            return (
              <VStack w="100%" p={0} align={"flex-start"}>
                {row.action_parameters.uri?.path !== undefined ? (
                  <>
                    <Text fontWeight={"bold"}>{`${Humanize(
                      row.action
                    )} Path: `}</Text>
                    <Text>{`${row.action_parameters.uri.path.value}`}</Text>
                  </>
                ) : null}
                {row.action_parameters.uri?.query !== undefined ? (
                  <>
                    <Text fontWeight={"bold"}>{`${Humanize(
                      row.action
                    )} Query: `}</Text>
                    <Text>{`${row.action_parameters.uri.query.value}`}</Text>
                  </>
                ) : null}
              </VStack>
            );
          } else {
            return null;
          }
        },
      },
      {
        Header: "Status",
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
      urlRewriteData && urlRewriteData[0].result.length
        ? HeaderFactory(urlRewriteData.length)
        : urlRewriteData && urlRewriteData[0].result.length === 0
        ? HeaderFactoryWithTags(urlRewriteData.length, false)
        : [];

    return urlRewriteData &&
      urlRewriteData[0].success &&
      urlRewriteData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [urlRewriteData]);

  const data = React.useMemo(
    () =>
      urlRewriteData
        ? CompareData(
            CompareBaseToOthers,
            urlRewriteData,
            conditionsToMatch,
            "URL Rewrite"
          )
        : [],
    [urlRewriteData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          URL Rewrite
        </Heading>
      </HStack>
      {!urlRewriteData && <LoadingBox />}
      {urlRewriteData && (
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

export default UrlRewrite;
