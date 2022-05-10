import {
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
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
  HeaderFactory,
  Humanize,
  patchZoneSetting,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const ValueName = (name) => {
  switch (name) {
    case "off":
      return "Off (not secure)";
    case "flexible":
      return "Flexible";
    case "full":
      return "Full";
    case "strict":
      return "Full (strict)";
    case "origin_pull":
      return "Strict (SSL-Only Origin Pull)";
    default:
      return null;
  }
};

const conditionsToMatch = (base, toCompare) => {
  return (
    base.value === toCompare.value &&
    base.certificate_status === toCompare.certificate_status
  );
};

const SslSetting = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [sslSettingData, setSslSettingData] = useState();
  const {
    isOpen: ErrorPromptIsOpen,
    onOpen: ErrorPromptOnOpen,
    onClose: ErrorPromptOnClose,
  } = useDisclosure(); // ErrorPromptModal;
  const {
    isOpen: SuccessPromptIsOpen,
    onOpen: SuccessPromptOnOpen,
    onClose: SuccessPromptOnClose,
  } = useDisclosure(); // SuccessPromptModal;
  const [currentZone, setCurrentZone] = useState();
  const [errorPromptMessage, setErrorPromptMessage] = useState("");

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/ssl"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = [newObj.result];
        return newObj;
      });
      setSslSettingData(processedResp);
    }
    setSslSettingData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Value",
        accessor: "value",
        Cell: (props) => ValueName(props.value),
      },
      {
        Header: "Certificate Status",
        accessor: "certificate_status",
        Cell: (props) => Humanize(props.value),
      },
    ];

    const dynamicHeaders = sslSettingData
      ? HeaderFactory(sslSettingData.length)
      : [];

    return sslSettingData &&
      sslSettingData[0].success &&
      sslSettingData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [sslSettingData]);

  const data = React.useMemo(() => {
    return sslSettingData
      ? CompareData(
          CompareBaseToOthers,
          sslSettingData,
          conditionsToMatch,
          "SSL Setting"
        )
      : [];
  }, [sslSettingData]);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const patchDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/ssl"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj["result"] = [newObj.result];
        return newObj;
      });
      setSslSettingData(processedResp);
    }

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0];
    const otherZoneKeys = zoneKeys.slice(1);

    for (const record of baseZoneData.result) {
      const createData = {
        value: record.value,
      };
      for (const key of otherZoneKeys) {
        const dataToCreate = _.cloneDeep(createData);
        const authObj = {
          zoneId: credentials[key].zoneId,
          apiToken: `Bearer ${credentials[key].apiToken}`,
        };
        setCurrentZone(key);
        const dataWithAuth = { ...authObj, data: dataToCreate };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/patch/settings/ssl"
        );
        if (postRequestResp.success === false) {
          setErrorPromptMessage(
            `An error has occurred, please close this window and try again.`
          );
          ErrorPromptOnOpen();
        }
      }
    }
    SuccessPromptOnOpen();
    setSslSettingData();
    getData();
  };

  if (!sslSettingData) {
  } // don't do anything while the app has not loaded
  else if (
    sslSettingData &&
    sslSettingData[0].success &&
    sslSettingData[0].result.length
  ) {
    zoneCopierFunctions[props.id] = () =>
      patchDataFromBaseToOthers(sslSettingData, zoneKeys, credentials);
  } else {
    zoneCopierFunctions[props.id] = false;
  }

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            sslSettingData &&
            sslSettingData[0].success &&
            sslSettingData[0].result.length
          }
          copy={() =>
            patchDataFromBaseToOthers(sslSettingData, zoneKeys, credentials)
          }
        />
      }
      {ErrorPromptIsOpen && (
        <ErrorPromptModal
          isOpen={ErrorPromptIsOpen}
          onOpen={ErrorPromptOnOpen}
          onClose={ErrorPromptOnClose}
          title={`Error`}
          errorMessage={errorPromptMessage}
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
      {!sslSettingData && <LoadingBox />}
      {sslSettingData && (
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

export default SslSetting;
