import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
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
import ReplaceBaseUrlSwitch from "../commonComponents/ReplaceBaseUrlSwitch";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const rulesetMapping = {
  efb7b8c949ac4650a09736fc376e9aee: "Cloudflare Managed Ruleset",
  "4814384a9e5d4991b9815dcfc25d2f1f": "Cloudflare OWASP Core Ruleset",
  c2e184081120413c86c3ab7e14069605:
    "Cloudflare Exposed Credentials Check Ruleset",
};

const conditionsToMatch = (base, toCompare) => {
  return (
    base.action_parameters.id === toCompare.action_parameters.id &&
    base.enabled === toCompare.enabled
  );
};

const ManagedRules = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [managedRulesData, setManagedRulesData] = useState();
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
  const [isDeprecatedWaf, setIsDeprecatedWaf] = useState([]);
  const [replaceBaseUrl, setReplaceBaseUrl] = useState(false);

  useEffect(() => {
    async function getData() {
      // check deprecated WAF or not
      const deprecatedResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/waf/packages"
      );
      let areZonesDeprecated = false;
      deprecatedResp.forEach((zone) => {
        if (zone.resp.success) {
          areZonesDeprecated = true;
        }
      });
      setIsDeprecatedWaf(areZonesDeprecated);

      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        if (zone.resp.success && zone.resp.result?.rules !== undefined) {
          newObj.result = zone.resp.result.rules.map((ruleset) => {
            const replaceRuleWithName = { ...ruleset };
            if (ruleset.action_parameters?.id !== undefined) {
              replaceRuleWithName["name"] =
                rulesetMapping[ruleset.action_parameters.id];
            } else {
              replaceRuleWithName["name"] = ruleset.description;
            }
            return replaceRuleWithName;
          });
        } else {
          newObj.result = [];
        }
        return newObj;
      });
      setManagedRulesData(processedResp);
    }
    setManagedRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Description",
        accessor: "name",
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
      managedRulesData && managedRulesData[0].result.length
        ? HeaderFactory(managedRulesData.length)
        : managedRulesData && managedRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(managedRulesData.length, false)
        : [];

    return managedRulesData &&
      managedRulesData[0].success &&
      managedRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [managedRulesData]);

  const data = React.useMemo(
    () =>
      managedRulesData
        ? CompareData(
            CompareBaseToOthers,
            managedRulesData,
            conditionsToMatch,
            "Managed Rules"
          )
        : [],
    [managedRulesData]
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
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
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
        const rulesetId = resp.result.id;
        for (const record of resp.result.rules) {
          // if (record.action_parameters?.id !== undefined) {
          //   const isDefaultRuleset = defaultManageRulesetIds.includes(
          //     record.action_parameters.id
          //   );
          //   if (isDefaultRuleset) {
          //     continue;
          //   }
          // }
          const createData = _.cloneDeep(authObj);
          createData["identifier"] = record.id; // need to send identifier to API endpoint
          createData["rulesetId"] = rulesetId;
          const { resp } = await deleteZoneSetting(
            createData,
            "/delete/rulesets/rules"
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
      // check deprecated WAF or not
      const deprecatedResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/waf/packages"
      );
      let areZonesDeprecated = false;
      deprecatedResp.forEach((zone) => {
        if (zone.resp.success) {
          areZonesDeprecated = true;
        }
      });
      setIsDeprecatedWaf(areZonesDeprecated);

      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        if (zone.resp.success && zone.resp.result?.rules !== undefined) {
          newObj.result = zone.resp.result.rules.map((ruleset) => {
            const replaceRuleWithName = { ...ruleset };
            if (ruleset.action_parameters?.id !== undefined) {
              replaceRuleWithName["name"] =
                rulesetMapping[ruleset.action_parameters.id];
            } else {
              replaceRuleWithName["name"] = ruleset.description;
            }
            return replaceRuleWithName;
          });
        } else {
          newObj.result = [];
        }
        return newObj;
      });
      setManagedRulesData(processedResp);
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
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
      );

      if (
        checkIfEmpty.success === true &&
        checkIfEmpty.result?.rules !== undefined &&
        checkIfEmpty.result.rules.length !== 0
      ) {
        setCurrentZone(key);
        NonEmptyErrorOnOpen();
        return;
      }
    }

    setNumberOfRecordsCopied(0);
    setNumberOfRecordsToCopy(data[0].result.length * data.slice(1).length);

    for (const record of baseZoneData.result) {
      const createData = {
        action: record.action,
        action_parameters: record.action_parameters,
        enabled: record.enabled,
        expression: record.expression,
        version: record.version,
      };
      if (record?.description !== undefined) {
        createData["description"] = record.description;
      }
      for (const key of otherZoneKeys) {
        const dataToCreate = _.cloneDeep(createData);

        if (replaceBaseUrl) {
          dataToCreate.expression = dataToCreate.expression.replaceAll(
            zoneDetails["zone_1"].name,
            zoneDetails[key].name
          );
        }

        const authObj = {
          zoneId: credentials[key].zoneId,
          apiToken: `Bearer ${credentials[key].apiToken}`,
        };
        const { resp: currentRuleset } = await getZoneSetting(
          authObj,
          "/rulesets/phases/http_request_firewall_managed/entrypoint"
        );
        let rulesetId = "";
        if (currentRuleset.result?.id !== undefined) {
          rulesetId = currentRuleset.result.id;
        }
        setCurrentZone(key);
        if (CopyingProgressBarIsOpen) {
        } else {
          CopyingProgressBarOnOpen();
        }

        const dataWithAuth = {
          ...authObj,
          data: dataToCreate,
          rulesetId: rulesetId,
        };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/copy/rulesets/rules"
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
    setManagedRulesData();
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
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
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
        const rulesetId = resp.result.id;
        for (const record of resp.result.rules) {
          // if (record.action_parameters?.id !== undefined) {
          //   const isDefaultRuleset = defaultManageRulesetIds.includes(
          //     record.action_parameters.id
          //   );
          //   if (isDefaultRuleset) {
          //     continue;
          //   }
          // }
          const createData = _.cloneDeep(authObj);
          createData["identifier"] = record.id; // need to send identifier to API endpoint
          createData["rulesetId"] = rulesetId;
          const { resp } = await deleteZoneSetting(
            createData,
            "/delete/rulesets/rules"
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
      // check deprecated WAF or not
      const deprecatedResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/waf/packages"
      );
      let areZonesDeprecated = false;
      deprecatedResp.forEach((zone) => {
        if (zone.resp.success) {
          areZonesDeprecated = true;
        }
      });
      setIsDeprecatedWaf(areZonesDeprecated);

      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        if (zone.resp.success && zone.resp.result?.rules !== undefined) {
          newObj.result = zone.resp.result.rules.map((ruleset) => {
            const replaceRuleWithName = { ...ruleset };
            if (ruleset.action_parameters?.id !== undefined) {
              replaceRuleWithName["name"] =
                rulesetMapping[ruleset.action_parameters.id];
            } else {
              replaceRuleWithName["name"] = ruleset.description;
            }
            return replaceRuleWithName;
          });
        } else {
          newObj.result = [];
        }
        return newObj;
      });
      setManagedRulesData(processedResp);
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
        "/rulesets/phases/http_request_firewall_managed/entrypoint"
      );

      if (
        checkIfEmpty.success === true &&
        checkIfEmpty.result?.rules !== undefined &&
        checkIfEmpty.result.rules.length !== 0
      ) {
        // setCurrentZone(key)
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
        action: record.action,
        action_parameters: record.action_parameters,
        enabled: record.enabled,
        expression: record.expression,
        version: record.version,
      };
      if (record?.description !== undefined) {
        createData["description"] = record.description;
      }
      for (const key of otherZoneKeys) {
        const dataToCreate = _.cloneDeep(createData);

        if (replaceBaseUrl) {
          dataToCreate.expression = dataToCreate.expression.replaceAll(
            zoneDetails["zone_1"].name,
            zoneDetails[key].name
          );
        }

        const authObj = {
          zoneId: credentials[key].zoneId,
          apiToken: `Bearer ${credentials[key].apiToken}`,
        };
        const { resp: currentRuleset } = await getZoneSetting(
          authObj,
          "/rulesets/phases/http_request_firewall_managed/entrypoint"
        );
        let rulesetId = "";
        if (currentRuleset.result?.id !== undefined) {
          rulesetId = currentRuleset.result.id;
        }
        // setCurrentZone(key);

        const dataWithAuth = {
          ...authObj,
          data: dataToCreate,
          rulesetId: rulesetId,
        };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/copy/rulesets/rules"
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

    setManagedRulesData();
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

  if (!managedRulesData) {
  } // don't do anything while the app has not loaded
  else if (
    managedRulesData &&
    managedRulesData[0].success &&
    managedRulesData[0].result.length &&
    !isDeprecatedWaf
  ) {
    zoneCopierFunctions[props.id] = (setResults, setProgress) =>
      bulkCopyHandler(
        managedRulesData,
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
            managedRulesData &&
            managedRulesData[0].success &&
            managedRulesData[0].result.length &&
            !isDeprecatedWaf
          }
          copy={() =>
            copyDataFromBaseToOthers(managedRulesData, zoneKeys, credentials)
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
            handleDelete(managedRulesData, zoneKeys, credentials)
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
      {!managedRulesData && <LoadingBox />}
      {managedRulesData && (
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

export default ManagedRules;
