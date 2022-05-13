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
  getMultipleZoneSettings,
  getZoneNumber,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  patchZoneSetting,
  RulesetsSuccessMessage,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import CopyExtraModal from "../commonComponents/CopyExtraModal";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  return base.id === toCompare.id && base.mode === toCompare.mode;
};

const DeprecatedFirewallCfRules = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [deprecatedFirewallCfRulesData, setDeprecatedFirewallCfRulesData] =
    useState();
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
    isOpen: CopyingProgressBarIsOpen,
    onOpen: CopyingProgressBarOnOpen,
    onClose: CopyingProgressBarOnClose,
  } = useDisclosure(); // ProgressBarModal -- Copying;
  const [currentZone, setCurrentZone] = useState();
  const [currentProgressRuleset, setCurrentProgressRuleset] = useState("");
  const [rulesCopied, setRulesCopied] = useState("");
  const [numberOfRulesToCopy, setNumberOfRulesToCopy] = useState(0);
  const [numberOfRulesCopied, setNumberOfRulesCopied] = useState(0);
  const {
    isOpen: CopyExtraPromptIsOpen,
    onOpen: CopyExtraPromptOnOpen,
    onClose: CopyExtraPromptOnClose,
  } = useDisclosure(); // CopyExtraPromptModal;

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/deprecated"
      );

      const processedResp = resp.map((zone) => {
        let newObj = { ...zone };
        if (zone.deprecatedFirewallRules) {
          zone.deprecatedFirewallRules.forEach((ruleset) => {
            if (ruleset.name === "CloudFlare") {
              newObj.result = ruleset.dash.result;
              newObj.success = ruleset.dash.success;
            }
          });
        } else {
          newObj.result = [];
          newObj.success = true;
        }
        return newObj;
      });
      setDeprecatedFirewallCfRulesData(processedResp);
    }
    setDeprecatedFirewallCfRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Group",
        accessor: "name",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Description",
        accessor: "description",
      },
      {
        Header: "Mode",
        accessor: "mode",
        Cell: (props) =>
          props.value === "on" ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];
    const dynamicHeaders =
      deprecatedFirewallCfRulesData &&
      deprecatedFirewallCfRulesData[0].result.length
        ? HeaderFactory(deprecatedFirewallCfRulesData.length)
        : deprecatedFirewallCfRulesData &&
          deprecatedFirewallCfRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(deprecatedFirewallCfRulesData.length, false)
        : [];

    return deprecatedFirewallCfRulesData &&
      deprecatedFirewallCfRulesData[0].success &&
      deprecatedFirewallCfRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [deprecatedFirewallCfRulesData]);

  const data = React.useMemo(
    () =>
      deprecatedFirewallCfRulesData
        ? CompareData(
            CompareBaseToOthers,
            deprecatedFirewallCfRulesData,
            conditionsToMatch,
            "Cloudflare Managed Ruleset"
          )
        : [],
    [deprecatedFirewallCfRulesData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const patchExtraFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/deprecated"
      );

      const processedResp = resp.map((zone) => {
        let newObj = { ...zone };
        if (zone.deprecatedFirewallRules) {
          zone.deprecatedFirewallRules.forEach((ruleset) => {
            if (ruleset.name === "CloudFlare") {
              newObj.result = ruleset.dash.result;
              newObj.success = ruleset.dash.success;
            }
          });
        } else {
          newObj.result = [];
          newObj.success = true;
        }
        return newObj;
      });
      setDeprecatedFirewallCfRulesData(processedResp);
    }

    CopyExtraPromptOnClose();
    SuccessPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = _.filter(
      data[0].deprecatedFirewallRules,
      (ruleset) => ruleset.name === "CloudFlare"
    );

    const modifiedRules = _.filter(
      baseZoneData[0].detailed.result,
      (rule) => rule.mode !== "default"
    );

    const otherZoneKeys = zoneKeys.slice(1);

    // setRulesCopied({});
    const rulesCopiedOver = {};

    setNumberOfRulesCopied(0);
    setNumberOfRulesToCopy(modifiedRules.length * data.slice(1).length);
    CopyingProgressBarOnOpen();

    // .result is required because we have result + deprecatedFirewallRules

    for (const record of modifiedRules) {
      if (record?.description !== undefined) {
        setCurrentProgressRuleset(record.description);
        const createData = {
          mode: record.mode,
        };
        const ruleEndpoint = `/${record.package_id}/rules/${record.id}`;
        for (const key of otherZoneKeys) {
          const dataToCreate = _.cloneDeep(createData);
          const authObj = {
            zoneId: credentials[key].zoneId,
            apiToken: `Bearer ${credentials[key].apiToken}`,
          };
          setCurrentZone(key);
          const dataWithAuth = {
            ...authObj,
            data: dataToCreate,
            endpoint: ruleEndpoint,
          };
          const { resp: postRequestResp } = await sendPostRequest(
            dataWithAuth,
            "/patch/firewall/waf/packages"
          );
          if (postRequestResp.success === true) {
            // pass condition
          }
        }
      } else {
      }
      setNumberOfRulesCopied((prev) => prev + 1);
      rulesCopiedOver[record.id] = record.description;
    }
    setRulesCopied(rulesCopiedOver);
    CopyingProgressBarOnClose();
    SuccessPromptOnOpen();
    setDeprecatedFirewallCfRulesData();
    getData();
  };

  const patchDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    CopyExtraPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0];
    const otherZoneKeys = zoneKeys.slice(1);

    setRulesCopied("");
    const rulesets = {
      cloudflare_drupal: undefined,
      cloudflare_flash: undefined,
      cloudflare_joomla: undefined,
      cloudflare_magento: undefined,
      cloudflare_miscellaneous: undefined,
      cloudflare_php: undefined,
      cloudflare_plone: undefined,
      cloudflare_specials: undefined,
      cloudflare_whmcs: undefined,
      cloudflare_wordpress: undefined,
    };

    setNumberOfRulesCopied(0);
    setNumberOfRulesToCopy(data[0].result.length * data.slice(1).length);
    CopyingProgressBarOnOpen();

    // .result is required because we have result + deprecatedFirewallRules

    for (const record of baseZoneData.result) {
      if (record?.name !== undefined) {
        setCurrentProgressRuleset(record.name);
        const recordName = record.name;
        const createData = {
          mode: record.mode,
        };
        const ruleEndpoint = `/${record.package_id}/groups/${record.id}`;
        for (const key of otherZoneKeys) {
          const dataToCreate = _.cloneDeep(createData);
          const authObj = {
            zoneId: credentials[key].zoneId,
            apiToken: `Bearer ${credentials[key].apiToken}`,
          };
          setCurrentZone(key);
          const dataWithAuth = {
            ...authObj,
            data: dataToCreate,
            endpoint: ruleEndpoint,
          };
          const { resp: postRequestResp } = await sendPostRequest(
            dataWithAuth,
            "/patch/firewall/waf/packages"
          );
          if (postRequestResp.success === true) {
            rulesets[recordName.replace(" ", "_").toLowerCase()] = true;
          }
        }
      } else {
      }
      setNumberOfRulesCopied((prev) => prev + 1);
    }
    setRulesCopied(rulesets);
    CopyingProgressBarOnClose();
    CopyExtraPromptOnOpen();
  };

  const handleClose = async () => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/deprecated"
      );

      const processedResp = resp.map((zone) => {
        let newObj = { ...zone };
        if (zone.deprecatedFirewallRules) {
          zone.deprecatedFirewallRules.forEach((ruleset) => {
            if (ruleset.name === "CloudFlare") {
              newObj.result = ruleset.dash.result;
              newObj.success = ruleset.dash.success;
            }
          });
        } else {
          newObj.result = [];
          newObj.success = true;
        }
        return newObj;
      });
      setDeprecatedFirewallCfRulesData(processedResp);
    }

    setDeprecatedFirewallCfRulesData();
    getData();
    CopyExtraPromptOnClose();
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

    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/deprecated"
      );

      const processedResp = resp.map((zone) => {
        let newObj = { ...zone };
        if (zone.deprecatedFirewallRules) {
          zone.deprecatedFirewallRules.forEach((ruleset) => {
            if (ruleset.name === "CloudFlare") {
              newObj.result = ruleset.dash.result;
              newObj.success = ruleset.dash.success;
            }
          });
        } else {
          newObj.result = [];
          newObj.success = true;
        }
        return newObj;
      });
      setDeprecatedFirewallCfRulesData(processedResp);
    }

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0];
    const otherZoneKeys = zoneKeys.slice(1);

    const rulesets = {
      cloudflare_drupal: undefined,
      cloudflare_flash: undefined,
      cloudflare_joomla: undefined,
      cloudflare_magento: undefined,
      cloudflare_miscellaneous: undefined,
      cloudflare_php: undefined,
      cloudflare_plone: undefined,
      cloudflare_specials: undefined,
      cloudflare_whmcs: undefined,
      cloudflare_wordpress: undefined,
    };

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

    // .result is required because we have result + deprecatedFirewallRules

    for (const record of baseZoneData.result) {
      if (record?.name !== undefined) {
        // setCurrentProgressRuleset(record.name);
        const recordName = record.name;
        const createData = {
          mode: record.mode,
        };
        const ruleEndpoint = `/${record.package_id}/groups/${record.id}`;
        for (const key of otherZoneKeys) {
          // do a check if setting to be PATCH is already the same value
          const zoneNumber = getZoneNumber(key) - 1;
          const getRuleValue = (rulesetData, zoneNumber, ruleId) => {
            const zoneRules = rulesetData[zoneNumber];
            for (let i = 0; i < zoneRules.result.length; i++) {
              if (zoneRules.result[i].id === ruleId) {
                return zoneRules.result[i].mode;
              }
            }
            return false;
          };
          if (record.mode === getRuleValue(data, zoneNumber, record.id)) {
            // nothing to do if settings are already the same
            rulesets[recordName.replace(" ", "_").toLowerCase()] = true;
          } else {
            const dataToCreate = _.cloneDeep(createData);
            const authObj = {
              zoneId: credentials[key].zoneId,
              apiToken: `Bearer ${credentials[key].apiToken}`,
            };
            // setCurrentZone(key);
            const dataWithAuth = {
              ...authObj,
              data: dataToCreate,
              endpoint: ruleEndpoint,
            };
            const { resp: postRequestResp } = await sendPostRequest(
              dataWithAuth,
              "/patch/firewall/waf/packages"
            );
            if (postRequestResp.success === true) {
              rulesets[recordName.replace(" ", "_").toLowerCase()] = true;
            } else {
              const errorObj = {
                code: postRequestResp.errors[0].code,
                message: postRequestResp.errors[0].message,
                data: dataToCreate.mode,
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
            }
          }
        }
      } else {
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
    setResults((prevState) => {
      const subcategoriesKeys = Object.keys(rulesets);
      const copiedData = [];
      subcategoriesKeys.forEach((k) =>
        copiedData.push({
          name: k,
          success: rulesets[k],
        })
      );
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          copied: copiedData,
        },
      };
      return newState;
    });

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
    setDeprecatedFirewallCfRulesData();
    getData();
    return;
  };

  if (!deprecatedFirewallCfRulesData) {
  } // don't do anything while the app has not loaded
  else if (
    deprecatedFirewallCfRulesData &&
    deprecatedFirewallCfRulesData[0].success &&
    deprecatedFirewallCfRulesData[0].result.length &&
    // short hack for making a prior check for ONE other zone
    // before allowing to copy over deprecrated settings
    deprecatedFirewallCfRulesData[1].result.length
  ) {
    zoneCopierFunctions[props.id] = (setResults, setProgress) =>
      bulkCopyHandler(
        deprecatedFirewallCfRulesData,
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
            deprecatedFirewallCfRulesData &&
            deprecatedFirewallCfRulesData[0].success &&
            deprecatedFirewallCfRulesData[0].result.length &&
            // short hack for making a prior check for ONE other zone
            // before allowing to copy over deprecrated settings
            deprecatedFirewallCfRulesData[1].result.length
          }
          copy={() =>
            patchDataFromBaseToOthers(
              deprecatedFirewallCfRulesData,
              zoneKeys,
              credentials
            )
          }
        />
      }
      {ErrorPromptIsOpen && (
        <ErrorPromptModal
          isOpen={ErrorPromptIsOpen}
          onOpen={ErrorPromptOnOpen}
          onClose={ErrorPromptOnClose}
          title={`Error`}
          errorMessage={`An error has occurred, please close this window and try again.`}
        />
      )}
      {SuccessPromptIsOpen && (
        <SuccessPromptModal
          isOpen={SuccessPromptIsOpen}
          onOpen={SuccessPromptOnOpen}
          onClose={SuccessPromptOnClose}
          title={`${Humanize(props.id)} successfully copied`}
          successMessage={RulesetsSuccessMessage(
            rulesCopied,
            zoneDetails.zone_1.name,
            zoneDetails[currentZone].name
          )}
        />
      )}
      {CopyingProgressBarIsOpen && (
        <ProgressBarModal
          isOpen={CopyingProgressBarIsOpen}
          onOpen={CopyingProgressBarOnOpen}
          onClose={CopyingProgressBarOnClose}
          title={`Your setting for ${Humanize(
            currentProgressRuleset
          )} is being copied from ${zoneDetails.zone_1.name} to ${
            zoneDetails[currentZone].name
          }`}
          progress={numberOfRulesCopied}
          total={numberOfRulesToCopy}
        />
      )}
      {CopyExtraPromptIsOpen && (
        <CopyExtraModal
          isOpen={CopyExtraPromptIsOpen}
          onOpen={CopyExtraPromptOnOpen}
          onClose={CopyExtraPromptOnClose}
          title={`${Humanize(props.id)} successfully copied.`}
          handleExtra={() =>
            patchExtraFromBaseToOthers(
              deprecatedFirewallCfRulesData,
              zoneKeys,
              credentials
            )
          }
          handleClose={() => handleClose()}
          successMessage={RulesetsSuccessMessage(
            rulesCopied,
            zoneDetails.zone_1.name,
            zoneDetails[currentZone].name
          )}
          copyMessage={`Do you want to copy
        over advanced rules for the Cloudflare Managed Ruleset?`}
          copyButtonText={`Copy`}
        />
      )}
      {!deprecatedFirewallCfRulesData && <LoadingBox />}
      {deprecatedFirewallCfRulesData && (
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

export default DeprecatedFirewallCfRules;
