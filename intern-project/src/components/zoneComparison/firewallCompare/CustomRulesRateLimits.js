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
import ReplaceBaseUrlSwitch from "../commonComponents/ReplaceBaseUrlSwitch";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  const isRateLimitSame = (base, other) => {
    if (base?.ratelimit === undefined && other?.ratelimit === undefined) {
      return true;
    } else if (
      base?.ratelimit === undefined ||
      other?.ratelimit === undefined
    ) {
      return false;
    } else {
      const rateLimitKeys = Object.keys(base.ratelimit);
      let sameFlag = true;
      rateLimitKeys.forEach((key) => {
        if (key === "characteristics" && key in other.ratelimit) {
          base.ratelimit[key].forEach((char) => {
            if (!other.ratelimit[key].includes(char)) {
              sameFlag = false;
            }
          });
        } else if (
          (key === "mitigation_timeout" ||
            key === "period" ||
            key === "requests_per_period") &&
          key in other.ratelimit
        ) {
          if (base.ratelimit[key] !== other.ratelimit[key]) {
            sameFlag = false;
          }
        }
      });
      return sameFlag;
    }
  };

  return (
    base.action === toCompare.action && // action
    base.enabled === toCompare.enabled && // enabled
    base.expression === toCompare.expression && // expression
    isRateLimitSame(base, toCompare)
  );
  // ratelimit -> characteristics
  // ratelimit -> mitigation_timeout
  // ratelimit -> period
  // ratelimit -> requests_per_period
};

const CustomRulesRateLimits = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [customRulesRateLimitsData, setCustomRulesRateLimitsData] = useState();
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
  const [replaceBaseUrl, setReplaceBaseUrl] = useState(false);

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_ratelimit/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result?.rules !== undefined
          ? (newObj.result = newObj.result.rules)
          : (newObj.result = []);
        return newObj;
      });
      setCustomRulesRateLimitsData(processedResp);
    }
    setCustomRulesRateLimitsData();
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
        Header: "Name",
        accessor: "description",
      },
      {
        Header: "Expression",
        accessor: "expression",
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
      customRulesRateLimitsData && customRulesRateLimitsData[0].result.length
        ? HeaderFactory(customRulesRateLimitsData.length)
        : customRulesRateLimitsData &&
          customRulesRateLimitsData[0].result.length === 0
        ? HeaderFactoryWithTags(customRulesRateLimitsData.length, false)
        : [];

    return customRulesRateLimitsData &&
      customRulesRateLimitsData[0].success &&
      customRulesRateLimitsData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [customRulesRateLimitsData]);

  const data = React.useMemo(
    () =>
      customRulesRateLimitsData
        ? CompareData(
            CompareBaseToOthers,
            customRulesRateLimitsData,
            conditionsToMatch,
            "Custom Rules Rate Limits"
          )
        : [],
    [customRulesRateLimitsData]
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
        "/rulesets/phases/http_ratelimit/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result?.rules !== undefined
          ? (newObj.result = newObj.result.rules)
          : (newObj.result = []);
        return newObj;
      });
      setCustomRulesRateLimitsData(processedResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)

    const baseZoneData = data[0].result.map((record) => {
      const newObj = {
        action: record.action,
        description: record.description,
        enabled: record.enabled,
        expression: record.expression,
        ratelimit: record.ratelimit,
        version: record.version,
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
      const replacedUrlData = replaceBaseUrl
        ? baseZoneData.map((record) => {
            record.expression = record.expression.replaceAll(
              zoneDetails["zone_1"].name,
              zoneDetails[key].name
            );
            return record;
          })
        : baseZoneData;
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      console.log(replacedUrlData);
      const dataWithAuth = { ...authObj, data: { rules: replacedUrlData } };
      const { resp: postRequestResp } = await sendPostRequest(
        dataWithAuth,
        "/put/rulesets/phases/http_ratelimit/entrypoint"
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
    setCustomRulesRateLimitsData();
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
        "/rulesets/phases/http_ratelimit/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result?.rules !== undefined
          ? (newObj.result = newObj.result.rules)
          : (newObj.result = []);
        return newObj;
      });
      setCustomRulesRateLimitsData(processedResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)

    const baseZoneData = data[0].result.map((record) => {
      const newObj = {
        action: record.action,
        description: record.description,
        enabled: record.enabled,
        expression: record.expression,
        ratelimit: record.ratelimit,
        version: record.version,
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
        "/rulesets/phases/http_ratelimit/entrypoint"
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
      const replacedUrlData = replaceBaseUrl
        ? baseZoneData.map((record) => {
            record.expression = record.expression.replaceAll(
              zoneDetails["zone_1"].name,
              zoneDetails[key].name
            );
            return record;
          })
        : baseZoneData;
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const dataWithAuth = { ...authObj, data: { rules: replacedUrlData } };
      const { resp: postRequestResp } = await sendPostRequest(
        dataWithAuth,
        "/put/rulesets/phases/http_ratelimit/entrypoint"
      );
      if (postRequestResp.success === false) {
        console.log(postRequestResp);
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
    setCustomRulesRateLimitsData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            customRulesRateLimitsData &&
            customRulesRateLimitsData[0].success &&
            customRulesRateLimitsData[0].result.length
          }
          copy={() =>
            putDataFromBaseToOthers(
              customRulesRateLimitsData,
              zoneKeys,
              credentials
            )
          }
        />
      }
      <ReplaceBaseUrlSwitch
        switchText="Copy using Base Zone URL"
        switchState={replaceBaseUrl}
        changeSwitchState={setReplaceBaseUrl}
      />
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() =>
            handleDelete(customRulesRateLimitsData, zoneKeys, credentials)
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
      {!customRulesRateLimitsData && <LoadingBox />}
      {customRulesRateLimitsData && (
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

export default CustomRulesRateLimits;
