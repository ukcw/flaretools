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
  CountryCodeLookup,
  createZoneSetting,
  deleteZoneSetting,
  getMultipleZoneSettings,
  getZoneSetting,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import RecordsErrorPromptModal from "../commonComponents/RecordsErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  return (
    _.isEqual(base.configuration, toCompare.configuration) &&
    base.mode === toCompare.mode &&
    base.paused === toCompare.paused
  );
  // _.isEqual(base.scope, toCompare.scope)
};

const ActionName = (action) => {
  if (action === "js_challenge") {
    return "JavaScript Challenge";
  } else {
    return Humanize(action);
  }
};

const IpAccessRules = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [ipAccessRulesData, setIpAccessRulesData] = useState();
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

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/access_rules/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setIpAccessRulesData(processedResp);
    }
    setIpAccessRulesData();
    getData();
  }, [credentials, zoneKeys]);
  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Value",
        accessor: (row) => {
          if (row.configuration.target === "country") {
            return (
              <VStack w="100%" p={0} align={"flex-start"}>
                <Text>
                  {`${
                    CountryCodeLookup(row.configuration.value.toLowerCase())
                      .name
                  } 
                    (${row.configuration.value})`}
                </Text>
                <Text color="grey">{row.notes}</Text>
              </VStack>
            );
          } else {
            return row.configuration.value;
          }
        },
      },
      {
        Header: "Applies to",
        accessor: (row) => {
          if (row.scope.type === "organization") {
            return "All websites in account";
          } else if (row.scope.type === "zone") {
            return "This website";
          } else {
            return row.scope.type;
          }
        },
      },
      {
        Header: "Action",
        accessor: "mode",
        Cell: (props) => ActionName(props.value),
      },
    ];
    const dynamicHeaders =
      ipAccessRulesData && ipAccessRulesData[0].result.length
        ? HeaderFactory(ipAccessRulesData.length)
        : ipAccessRulesData && ipAccessRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(ipAccessRulesData.length, false)
        : [];

    return ipAccessRulesData &&
      ipAccessRulesData[0].success &&
      ipAccessRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [ipAccessRulesData]);

  const data = React.useMemo(
    () =>
      ipAccessRulesData
        ? CompareData(
            CompareBaseToOthers,
            ipAccessRulesData,
            conditionsToMatch,
            "IP Access Rules"
          )
        : [],
    [ipAccessRulesData]
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

      const { resp } = await getZoneSetting(
        authObj,
        "/firewall/access_rules/rules"
      );

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
            "/delete/firewall/access_rules/rules"
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
        "/firewall/access_rules/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setIpAccessRulesData(processedResp);
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
        "/firewall/access_rules/rules"
      );

      if (checkIfEmpty.success === true && checkIfEmpty.result.length !== 0) {
        console.log("check", checkIfEmpty);
        setCurrentZone(key);
        NonEmptyErrorOnOpen();
        return;
      }
    }

    setNumberOfRecordsCopied(0);
    setNumberOfRecordsToCopy(data[0].result.length * data.slice(1).length);

    for (const record of baseZoneData.result) {
      const createData = {
        mode: record.mode,
        configuration: record.configuration,
        notes: record.notes,
      };
      if (record?.paused !== undefined) {
        createData["paused"] = record.paused;
      }
      for (const key of otherZoneKeys) {
        const dataToCreate = _.cloneDeep(createData);
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
          "/copy/firewall/access_rules/rules"
        );
        if (postRequestResp.success === false) {
          const errorObj = {
            code: postRequestResp.errors[0].code,
            message: postRequestResp.errors[0].message,
            data: record.id,
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
    setIpAccessRulesData();
    getData();
  };

  const bulkDeleteHandler = async (
    data,
    zoneKeys,
    credentials,
    setResults,
    setProgress
  ) => {
    const otherZoneKeys = zoneKeys.slice(1);
    let bulkErrorCount = 0;

    // reset state for the setting
    setProgress((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          status: "delete",
          totalToCopy: 0,
          progressTotal: 0,
          completed: false,
        },
      };
      return newState;
    });

    for (let i = 1; i < data.length; i++) {
      if (data[i].success === true && data[i].result.length) {
        setProgress((prevState) => {
          const newState = {
            ...prevState,
            [props.id]: {
              ...prevState[props.id],
              totalToCopy:
                prevState[props.id]["totalToCopy"] + data[i].result.length,
            },
          };
          return newState;
        });
      }
    }

    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };

      const { resp } = await getZoneSetting(
        authObj,
        "/firewall/access_rules/rules"
      );

      if (resp.success === false || resp.result.length === 0) {
        const errorObj = {
          code: resp.errors[0].code,
          message: resp.errors[0].message,
          data: "",
        };
        setResults((prevState) => {
          const newState = {
            ...prevState,
            [props.id]: {
              ...prevState[props.id],
              errors: prevState[props.id]["errors"].concat(errorObj),
            },
          };
          return newState;
        });
        bulkErrorCount += 1;
      } else {
        for (const record of resp.result) {
          const createData = _.cloneDeep(authObj);
          createData["identifier"] = record.id; // need to send identifier to API endpoint
          const { resp } = await deleteZoneSetting(
            createData,
            "/delete/firewall/access_rules/rules"
          );

          if (resp.success === false) {
            const errorObj = {
              code: resp.errors[0].code,
              message: resp.errors[0].message,
              data: createData.identifier,
            };
            setResults((prevState) => {
              const newState = {
                ...prevState,
                [props.id]: {
                  ...prevState[props.id],
                  errors: prevState[props.id]["errors"].concat(errorObj),
                },
              };
              return newState;
            });
            bulkErrorCount += 1;
          }
          setProgress((prevState) => {
            const newState = {
              ...prevState,
              [props.id]: {
                ...prevState[props.id],
                progressTotal: prevState[props.id]["progressTotal"] + 1,
              },
            };
            return newState;
          });
        }
      }
    }

    if (bulkErrorCount > 0) {
      return;
    } else {
      bulkCopyHandler(data, zoneKeys, credentials, setResults, setProgress);
    }
  };

  const bulkCopyHandler = async (
    data,
    zoneKeys,
    credentials,
    setResults,
    setProgress
  ) => {
    setProgress((prevState) => {
      // trigger spinner on UI
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          completed: false,
        },
      };
      return newState;
    });

    // initialize state
    setResults((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          errors: [],
          copied: [],
        },
      };
      return newState;
    });

    async function sendPostRequest(data, endpoint) {
      const resp = await createZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/access_rules/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setIpAccessRulesData(processedResp);
    }

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
        "/firewall/access_rules/rules"
      );

      if (checkIfEmpty.success === true && checkIfEmpty.result.length !== 0) {
        return bulkDeleteHandler(
          data,
          zoneKeys,
          credentials,
          setResults,
          setProgress
        );
      }
    }

    // initialize state
    setProgress((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          status: "copy",
          totalToCopy: data[0].result.length * data.slice(1).length,
          progressTotal: 0,
          completed: false,
        },
      };
      return newState;
    });

    for (const record of baseZoneData.result) {
      const createData = {
        mode: record.mode,
        configuration: record.configuration,
        notes: record.notes,
      };
      if (record?.paused !== undefined) {
        createData["paused"] = record.paused;
      }
      for (const key of otherZoneKeys) {
        const dataToCreate = _.cloneDeep(createData);
        const authObj = {
          zoneId: credentials[key].zoneId,
          apiToken: `Bearer ${credentials[key].apiToken}`,
        };
        // setCurrentZone(key);

        const dataWithAuth = { ...authObj, data: dataToCreate };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/copy/firewall/access_rules/rules"
        );
        if (postRequestResp.success === false) {
          const errorObj = {
            code: postRequestResp.errors[0].code,
            message: postRequestResp.errors[0].message,
            data: record.id,
          };
          setResults((prevState) => {
            const newState = {
              ...prevState,
              [props.id]: {
                ...prevState[props.id],
                errors: prevState[props.id]["errors"].concat(errorObj),
              },
            };
            return newState;
          });
        } else {
          setResults((prevState) => {
            const newState = {
              ...prevState,
              [props.id]: {
                ...prevState[props.id],
                copied: prevState[props.id]["copied"].concat(dataToCreate),
              },
            };
            return newState;
          });
        }
        setProgress((prevState) => {
          const newState = {
            ...prevState,
            [props.id]: {
              ...prevState[props.id],
              progressTotal: prevState[props.id]["progressTotal"] + 1,
            },
          };
          return newState;
        });
      }
    }

    setIpAccessRulesData();
    getData();

    setProgress((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          completed: true,
        },
      };
      return newState;
    });
    return;
  };

  if (!ipAccessRulesData) {
  } // don't do anything while the app has not loaded
  else if (
    ipAccessRulesData &&
    ipAccessRulesData[0].success &&
    ipAccessRulesData[0].result.length
  ) {
    zoneCopierFunctions[props.id] = (setResults, setProgress) =>
      bulkCopyHandler(
        ipAccessRulesData,
        zoneKeys,
        credentials,
        setResults,
        setProgress
      );
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
            ipAccessRulesData &&
            ipAccessRulesData[0].success &&
            ipAccessRulesData[0].result.length
          }
          copy={() =>
            copyDataFromBaseToOthers(ipAccessRulesData, zoneKeys, credentials)
          }
        />
      }
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() =>
            handleDelete(ipAccessRulesData, zoneKeys, credentials)
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
      {!ipAccessRulesData && <LoadingBox />}
      {ipAccessRulesData && (
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

export default IpAccessRules;
