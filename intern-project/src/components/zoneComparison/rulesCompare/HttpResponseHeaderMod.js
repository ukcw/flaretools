import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  VStack,
  Text,
  Divider,
  useDisclosure,
} from "@chakra-ui/react";
import _ from "lodash";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CategoryTitle,
  CompareBaseToOthers,
  CompareData,
  getMultipleZoneSettings,
  getZoneSetting,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  putZoneSetting,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import RecordsErrorPromptModal from "../commonComponents/RecordsErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

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
  if (data === undefined) {
    return [];
  }

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

const HttpResponseHeaderMod = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [httpResponseHeaderModData, setHttpResponseHeaderModData] = useState();
  const {
    isOpen: NonEmptyErrorIsOpen,
    onOpen: NonEmptyErrorOnOpen,
    onClose: NonEmptyErrorOnClose,
  } = useDisclosure(); // NonEmptyErrorModal;
  const {
    isOpen: ErrorPromptIsOpen,
    onOpen: ErrorPromptOnOpen,
    onClose: ErrorPromptOnClose,
  } = useDisclosure(); // RecordsBasedErrorPromptModal;
  const {
    isOpen: SuccessPromptIsOpen,
    onOpen: SuccessPromptOnOpen,
    onClose: SuccessPromptOnClose,
  } = useDisclosure(); // SuccessPromptModal;
  const {
    isOpen: CopyingProgressBarIsOpen,
    onOpen: CopyingProgressBarOnOpen,
    onClose: CopyingProgressBarOnClose,
  } = useDisclosure(); // ProgressBarModal -- Copying;
  const [currentZone, setCurrentZone] = useState();
  const [numberOfZonesToCopy, setNumberOfZonesToCopy] = useState(0);
  const [numberOfZonesCopied, setNumberOfZonesCopied] = useState(0);
  const [errorPromptList, setErrorPromptList] = useState([]);

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_response_headers_transform/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] =
          zone.resp.result?.rules !== undefined
            ? makeData(zone.resp.result.rules)
            : [];
        return newObj;
      });
      setHttpResponseHeaderModData(processedResp);
    }
    setHttpResponseHeaderModData();
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
            <VStack
              w="100%"
              p={0}
              align={"flex-start"}
              overflowWrap={"break-word"}
              wordBreak={"break-word"}
            >
              <Text>{row.description}</Text>
              <Text color="grey">{output.join(", ")}</Text>
            </VStack>
          );
        },
        maxWidth: 150,
      },
      {
        Header: "Expression",
        accessor: "expression",
        maxWidth: 150,
      },
      {
        Header: "Then...",
        accessor: (row) => {
          if (
            row?.action !== undefined &&
            row?.action_parameters !== undefined &&
            row.action_parameters?.headers !== undefined
          ) {
            const headersKeys = Object.keys(row.action_parameters.headers);
            const headersLength = headersKeys.length - 1;
            return headersKeys.map((header, index) => {
              const item = row.action_parameters.headers[header];
              return item?.expression !== undefined &&
                item?.operation !== undefined ? (
                <VStack
                  w="100%"
                  p={0}
                  align={"flex-start"}
                  key={header}
                  overflowWrap={"break-word"}
                  wordBreak={"break-word"}
                >
                  <Text fontWeight={"bold"}>Operation: </Text>
                  <Text>{item.operation}</Text>
                  <Text fontWeight={"bold"}>Header name:</Text>
                  <Text>{header}</Text>
                  <Text fontWeight={"bold"}>Expression: </Text>
                  <Text>{item.expression}</Text>
                  {(index !== 0 && index !== headersLength) ||
                  (headersLength !== 0 && index !== headersLength) ? (
                    <Divider />
                  ) : null}
                </VStack>
              ) : item?.value !== undefined && item?.operation !== undefined ? (
                <VStack
                  w="100%"
                  p={0}
                  align={"flex-start"}
                  key={header}
                  overflowWrap={"break-word"}
                  wordBreak={"break-word"}
                >
                  <Text fontWeight={"bold"}>Operation: </Text>
                  <Text>{item.operation}</Text>
                  <Text fontWeight={"bold"}>Header name:</Text>
                  <Text>{header}</Text>
                  <Text fontWeight={"bold"}>Value: </Text>
                  <Text>{item.value}</Text>
                  {(index !== 0 && index !== headersLength) ||
                  (headersLength !== 0 && index !== headersLength) ? (
                    <Divider />
                  ) : null}
                </VStack>
              ) : null;
            });
          }
        },
        maxWidth: 200,
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
      httpResponseHeaderModData && httpResponseHeaderModData[0].result.length
        ? HeaderFactory(httpResponseHeaderModData.length)
        : httpResponseHeaderModData &&
          httpResponseHeaderModData[0].result.length === 0
        ? HeaderFactoryWithTags(httpResponseHeaderModData.length, false)
        : [];

    return httpResponseHeaderModData &&
      httpResponseHeaderModData[0].success &&
      httpResponseHeaderModData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [httpResponseHeaderModData]);

  const data = React.useMemo(
    () =>
      httpResponseHeaderModData
        ? CompareData(
            CompareBaseToOthers,
            httpResponseHeaderModData,
            conditionsToMatch,
            "HTTP Response Header Modification"
          )
        : [],
    [httpResponseHeaderModData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleDelete = async (data, zoneKeys, credentials) => {
    if (NonEmptyErrorIsOpen) {
      NonEmptyErrorOnClose();
    }

    async function sendPostRequest(data, endpoint) {
      const resp = await putZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_response_headers_transform/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] =
          zone.resp.result?.rules !== undefined
            ? makeData(zone.resp.result.rules)
            : [];
        return newObj;
      });
      setHttpResponseHeaderModData(processedResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)

    const baseZoneData = data[0].result.map((record) => {
      const newObj = {
        action: record.action,
        action_parameters: record.action_parameters,
        expression: record.expression,
        enabled: record.enabled,
        version: record.version,
        description: record.description,
      };
      return newObj;
    });
    const otherZoneKeys = zoneKeys.slice(1);

    setNumberOfZonesCopied(0);
    setNumberOfZonesToCopy(otherZoneKeys.length);

    for (const key of otherZoneKeys) {
      setCurrentZone(key);
      if (!CopyingProgressBarIsOpen) {
        CopyingProgressBarOnOpen();
      }
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const dataWithAuth = { ...authObj, data: { rules: baseZoneData } };
      const { resp: postRequestResp } = await sendPostRequest(
        dataWithAuth,
        "/put/rulesets/phases/http_response_headers_transform/entrypoint"
      );
      if (postRequestResp.success === false) {
        const errorObj = {
          code: postRequestResp.errors[0].code,
          message: postRequestResp.errors[0].message,
          data: "",
        };
        errorCount += 1;
        setErrorPromptList((prev) => [...prev, errorObj]);
      }
      setNumberOfZonesCopied((prev) => prev + 1);
    }
    CopyingProgressBarOnClose();

    // if there is some error at the end of copying, show the records that
    // were not copied
    if (errorCount > 0) {
      ErrorPromptOnOpen();
    } else {
      SuccessPromptOnOpen();
    }
    setHttpResponseHeaderModData();
    getData();
  };

  const putDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await putZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_response_headers_transform/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] =
          zone.resp.result?.rules !== undefined
            ? makeData(zone.resp.result.rules)
            : [];
        return newObj;
      });
      setHttpResponseHeaderModData(processedResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)

    const baseZoneData = data[0].result.map((record) => {
      const newObj = {
        action: record.action,
        action_parameters: record.action_parameters,
        expression: record.expression,
        enabled: record.enabled,
        version: record.version,
        description: record.description,
      };
      return newObj;
    });
    const otherZoneKeys = zoneKeys.slice(1);

    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const { resp: checkIfEmpty } = await getZoneSetting(
        authObj,
        "/rulesets/phases/http_response_headers_transform/entrypoint"
      );

      if (checkIfEmpty.success === true && checkIfEmpty.result.length !== 0) {
        setCurrentZone(key);
        NonEmptyErrorOnOpen();
        return;
      }
    }

    setNumberOfZonesCopied(0);
    setNumberOfZonesToCopy(otherZoneKeys.length);

    for (const key of otherZoneKeys) {
      setCurrentZone(key);
      if (!CopyingProgressBarIsOpen) {
        CopyingProgressBarOnOpen();
      }
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const dataWithAuth = { ...authObj, data: { rules: baseZoneData } };
      const { resp: postRequestResp } = await sendPostRequest(
        dataWithAuth,
        "/put/rulesets/phases/http_response_headers_transform/entrypoint"
      );
      if (postRequestResp.success === false) {
        const errorObj = {
          code: postRequestResp.errors[0].code,
          message: postRequestResp.errors[0].message,
          data: "",
        };
        errorCount += 1;
        setErrorPromptList((prev) => [...prev, errorObj]);
      }
      setNumberOfZonesCopied((prev) => prev + 1);
    }
    CopyingProgressBarOnClose();

    // if there is some error at the end of copying, show the records that
    // were not copied
    if (errorCount > 0) {
      ErrorPromptOnOpen();
    } else {
      SuccessPromptOnOpen();
    }
    setHttpResponseHeaderModData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            httpResponseHeaderModData &&
            httpResponseHeaderModData[0].success &&
            httpResponseHeaderModData[0].result.length
          }
          copy={() =>
            putDataFromBaseToOthers(
              httpResponseHeaderModData,
              zoneKeys,
              credentials
            )
          }
        />
      }
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() =>
            handleDelete(httpResponseHeaderModData, zoneKeys, credentials)
          }
          title={`There are some existing records in ${zoneDetails[currentZone].name}`}
          errorMessage={`To proceed with copying ${Humanize(props.id)} from ${
            zoneDetails.zone_1.name
          } 
          to ${zoneDetails[currentZone].name}, the existing records 
          in ${
            zoneDetails[currentZone].name
          } need to be deleted. This action is irreversible.`}
        />
      )}
      {ErrorPromptIsOpen && (
        <RecordsErrorPromptModal
          isOpen={ErrorPromptIsOpen}
          onOpen={ErrorPromptOnOpen}
          onClose={ErrorPromptOnClose}
          title={`Error`}
          errorList={errorPromptList}
        />
      )}
      {SuccessPromptIsOpen && (
        <SuccessPromptModal
          isOpen={SuccessPromptIsOpen}
          onOpen={SuccessPromptOnOpen}
          onClose={SuccessPromptOnClose}
          title={`${Humanize(props.id)} successfully copied`}
          successMessage={`Your ${Humanize(
            props.id
          )} settings have been successfully copied
          from ${zoneDetails.zone_1.name} to ${zoneDetails[currentZone].name}.`}
        />
      )}
      {CopyingProgressBarIsOpen && (
        <ProgressBarModal
          isOpen={CopyingProgressBarIsOpen}
          onOpen={CopyingProgressBarOnOpen}
          onClose={CopyingProgressBarOnClose}
          title={`Your rules for ${Humanize(props.id)} is being copied from ${
            zoneDetails.zone_1.name
          } to ${zoneDetails[currentZone].name}`}
          progress={numberOfZonesCopied}
          total={numberOfZonesToCopy}
        />
      )}
      {!httpResponseHeaderModData && <LoadingBox />}
      {httpResponseHeaderModData && (
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

export default HttpResponseHeaderMod;
