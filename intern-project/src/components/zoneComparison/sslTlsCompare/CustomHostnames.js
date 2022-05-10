import { WarningTwoIcon } from "@chakra-ui/icons";
import {
  Stack,
  Table,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
  HStack,
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
  createZoneSetting,
  deleteZoneSetting,
  getMultipleZoneSettings,
  getZoneSetting,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  replaceInstances,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import RecordsErrorPromptModal from "../commonComponents/RecordsErrorPromptModal";
import ReplaceBaseUrlSwitch from "../commonComponents/ReplaceBaseUrlSwitch";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  const checkSslStatus = (base, toCompare) => {
    if (base.ssl?.status === undefined && toCompare.ssl?.status === undefined) {
      return true;
    } else if (
      base.ssl?.status === undefined ||
      toCompare.ssl?.status === undefined
    ) {
      return false;
    } else {
      return base.ssl.status === toCompare.ssl.status;
    }
  };

  return (
    base.hostname === toCompare.hostname && checkSslStatus(base, toCompare)
  );
};

const CustomHostnames = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [customHostnamesData, setCustomHostnamesData] = useState();
  const {
    isOpen: NonEmptyErrorIsOpen,
    onOpen: NonEmptyErrorOnOpen,
    onClose: NonEmptyErrorOnClose,
  } = useDisclosure(); // NonEmptyErrorModal;
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
  const {
    isOpen: DeletionProgressBarIsOpen,
    onOpen: DeletionProgressBarOnOpen,
    onClose: DeletionProgressBarOnClose,
  } = useDisclosure(); // ProgressBarModal -- Deletion;
  const {
    isOpen: CopyingProgressBarIsOpen,
    onOpen: CopyingProgressBarOnOpen,
    onClose: CopyingProgressBarOnClose,
  } = useDisclosure(); // ProgressBarModal -- Copying;
  const [currentZone, setCurrentZone] = useState();
  const [numberOfRecordsToDelete, setNumberOfRecordsToDelete] = useState(0);
  const [numberOfRecordsDeleted, setNumberOfRecordsDeleted] = useState(0);
  const [numberOfRecordsToCopy, setNumberOfRecordsToCopy] = useState(0);
  const [numberOfRecordsCopied, setNumberOfRecordsCopied] = useState(0);
  const [errorPromptList, setErrorPromptList] = useState([]);
  const [replaceBaseUrl, setReplaceBaseUrl] = useState(false);

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/custom_hostnames"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setCustomHostnamesData(processedResp);
    }
    setCustomHostnamesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Custom Hostname",
        accessor: "hostname",
        maxWidth: 130,
      },
      {
        Header: "SSL/TLS Certification Status",
        accessor: (row, _) => {
          if (row.ssl === null) {
            return "SSL Not Requested";
          } else if (row.ssl.status === "active") {
            return <Tag colorScheme={"green"}>Active</Tag>;
          } else if (row.ssl.status === "pending_validation") {
            return (
              <Tag colorScheme={"blue"}>
                <Text>{`Pending Validation (${row.ssl.method.toUpperCase()})`}</Text>
              </Tag>
            );
          } else if (row.ssl.status === "expired") {
            return (
              <Tag colorScheme={"red"}>
                <HStack>
                  <WarningTwoIcon />
                  <Text>Expired (Error)</Text>
                </HStack>
              </Tag>
            );
          } else if (row.ssl.status === "validation_timed_out") {
            return (
              <Tag colorScheme={"red"}>
                <HStack>
                  <Text>{`Timed Out Validation (${row.ssl.method.toUpperCase()})`}</Text>
                </HStack>
              </Tag>
            );
          }
        },
      },
      {
        Header: "Expires On",
        accessor: (row, _) => {
          if (row.ssl === null) {
            return null;
          } else if (row.ssl?.certificates !== undefined) {
            return row.ssl.certificates[0].expires_on.substring(0, 10);
          } else {
            return "Cloudflare";
          }
        },
      },
      {
        Header: "Hostname Status",
        accessor: (row, _) => "Provisioned",
        Cell: (props) => <Tag colorScheme={"green"}>{props.value}</Tag>,
      },
      {
        Header: "Origin Server",
        accessor: (row, _) => {
          if ("custom_origin_server" in row) {
            return row.custom_origin_server;
          } else {
            return "Default";
          }
        },
        maxWidth: 130,
      },
    ];

    const dynamicHeaders =
      customHostnamesData && customHostnamesData[0].result.length
        ? HeaderFactory(customHostnamesData.length)
        : customHostnamesData && customHostnamesData[0].result.length === 0
        ? HeaderFactoryWithTags(customHostnamesData.length, false)
        : [];

    return customHostnamesData &&
      customHostnamesData[0].success &&
      customHostnamesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [customHostnamesData]);

  const data = React.useMemo(
    () =>
      customHostnamesData
        ? CompareData(
            CompareBaseToOthers,
            customHostnamesData,
            conditionsToMatch,
            "Custom Hostnames"
          )
        : [],
    [customHostnamesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const handleDelete = async (data, zoneKeys, credentials) => {
    if (NonEmptyErrorIsOpen) {
      NonEmptyErrorOnClose();
    }

    const otherZoneKeys = zoneKeys.slice(1);

    setNumberOfRecordsDeleted(0);
    setNumberOfRecordsToDelete(0);

    for (let i = 1; i < data.length; i++) {
      if (data[i].success === true && data[i].result.length) {
        setNumberOfRecordsToDelete((prev) => prev + data[i].result.length);
      }
    }

    DeletionProgressBarOnOpen();

    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };

      const { resp } = await getZoneSetting(authObj, "/custom_hostnames");

      if (resp.success === false || resp.result.length === 0) {
        const errorObj = {
          code: resp.errors[0].code,
          message: resp.errors[0].message,
          data: "",
        };
        setErrorPromptList((prev) => [...prev, errorObj]);
        ErrorPromptOnOpen();
        return;
      } else {
        for (const record of resp.result) {
          const createData = _.cloneDeep(authObj);
          createData["identifier"] = record.id; // need to send identifier to API endpoint
          const { resp } = await deleteZoneSetting(
            createData,
            "/delete/custom_hostnames"
          );
          if (resp.success === false) {
            const errorObj = {
              code: resp.errors[0].code,
              message: resp.errors[0].message,
              data: createData.identifier,
            };
            setErrorPromptList((prev) => [...prev, errorObj]);
            ErrorPromptOnOpen();
            return;
          }
          setNumberOfRecordsDeleted((prev) => prev + 1);
        }
      }
    }
    DeletionProgressBarOnClose();
    copyDataFromBaseToOthers(data, zoneKeys, credentials);
  };

  const copyDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await createZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/custom_hostnames"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setCustomHostnamesData(processedResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0];
    const otherZoneKeys = zoneKeys.slice(1);

    // check if other zone has any data prior to create records
    // we want to start the other zone from a clean slate
    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const { resp: checkIfEmpty } = await getZoneSetting(
        authObj,
        "/custom_hostnames"
      );

      if (checkIfEmpty.success === false) {
        const errorObj = {
          code: checkIfEmpty.errors[0].code,
          message: checkIfEmpty.errors[0].message,
          data: "",
        };
        setErrorPromptList((prev) => [...prev, errorObj]);
        ErrorPromptOnOpen();
        return;
      }

      if (checkIfEmpty.success === true && checkIfEmpty.result.length !== 0) {
        setCurrentZone(key);
        NonEmptyErrorOnOpen();
        return;
      }
    }

    setNumberOfRecordsCopied(0);
    setNumberOfRecordsToCopy(data[0].result.length * data.slice(1).length);

    for (const record of baseZoneData.result) {
      const createData = {
        hostname: record.hostname,
        ssl: record.ssl,
      };
      for (const key of otherZoneKeys) {
        let dataToCreate = _.cloneDeep(createData);

        if (replaceBaseUrl) {
          dataToCreate = replaceInstances(
            dataToCreate,
            zoneDetails["zone_1"].name,
            zoneDetails[key].name
          );
        }

        const authObj = {
          zoneId: credentials[key].zoneId,
          apiToken: `Bearer ${credentials[key].apiToken}`,
        };
        setCurrentZone(key);
        if (CopyingProgressBarIsOpen) {
        } else {
          CopyingProgressBarOnOpen();
        }
        const dataWithAuth = { ...authObj, data: dataToCreate };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/copy/custom_hostnames"
        );
        if (postRequestResp.success === false) {
          const errorObj = {
            code: postRequestResp.errors[0].code,
            message: postRequestResp.errors[0].message,
            data: dataToCreate.hostname,
          };
          errorCount += 1;
          setErrorPromptList((prev) => [...prev, errorObj]);
        }
        setNumberOfRecordsCopied((prev) => prev + 1);
      }
    }
    CopyingProgressBarOnClose();

    // if there is some error at the end of copying, show the records that
    // were not copied
    if (errorCount > 0) {
      ErrorPromptOnOpen();
    } else {
      SuccessPromptOnOpen();
    }
    setCustomHostnamesData();
    getData();
  };

  if (!customHostnamesData) {
  } // don't do anything while the app has not loaded
  else if (
    customHostnamesData &&
    customHostnamesData[0].success &&
    customHostnamesData[0].result.length
  ) {
    zoneCopierFunctions[props.id] = () =>
      copyDataFromBaseToOthers(customHostnamesData, zoneKeys, credentials);
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
            customHostnamesData &&
            customHostnamesData[0].success &&
            customHostnamesData[0].result.length
          }
          copy={() =>
            copyDataFromBaseToOthers(customHostnamesData, zoneKeys, credentials)
          }
        />
      }
      <ReplaceBaseUrlSwitch
        switchText="Replace Base Zone Hostname"
        switchState={replaceBaseUrl}
        changeSwitchState={setReplaceBaseUrl}
      />
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() =>
            handleDelete(customHostnamesData, zoneKeys, credentials)
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
      {DeletionProgressBarIsOpen && (
        <ProgressBarModal
          isOpen={DeletionProgressBarIsOpen}
          onOpen={DeletionProgressBarOnOpen}
          onClose={DeletionProgressBarOnClose}
          title={`${Humanize(props.id)} records from ${
            zoneDetails[currentZone].name
          } are being deleted`}
          progress={numberOfRecordsDeleted}
          total={numberOfRecordsToDelete}
        />
      )}
      {CopyingProgressBarIsOpen && (
        <ProgressBarModal
          isOpen={CopyingProgressBarIsOpen}
          onOpen={CopyingProgressBarOnOpen}
          onClose={CopyingProgressBarOnClose}
          title={`${Humanize(props.id)} records are being copied from ${
            zoneDetails.zone_1.name
          } to ${zoneDetails[currentZone].name}`}
          progress={numberOfRecordsCopied}
          total={numberOfRecordsToCopy}
        />
      )}
      {!customHostnamesData && <LoadingBox />}
      {customHostnamesData && (
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

export default CustomHostnames;
