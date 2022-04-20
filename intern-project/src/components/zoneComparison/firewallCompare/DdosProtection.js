import {
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Tag,
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
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  return (
    base.id === toCompare.id && // id
    base.sensitivity_level === toCompare.sensitivity_level && // sensitivity level
    base.action === toCompare.action && // action
    base.version === toCompare.version // version
  );
};

const isOverridden = (index, overrideArray, ruleId) => {
  if (
    overrideArray[index].result === null ||
    overrideArray[index].success === false ||
    overrideArray[index].result?.rules === undefined ||
    overrideArray[index].result.rules.length === 0 ||
    overrideArray[index].result.rules[0].action_parameters.overrides?.rules ===
      undefined
  ) {
    return false;
  } else {
    for (
      let i = 0;
      i <
      overrideArray[index].result.rules[0].action_parameters.overrides.rules
        .length;
      i++
    ) {
      if (
        ruleId ===
        overrideArray[index].result.rules[0].action_parameters.overrides.rules[
          i
        ].id
      ) {
        return overrideArray[index].result.rules[0].action_parameters.overrides
          .rules[i];
      }
    }
    return false; // no match for rule id was found meaning this rule was not overriden
  }
};

const DdosProtection = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [ddosProtectionData, setDdosProtectionData] = useState();
  const [overrideData, setOverrideData] = useState();
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
      const overrideResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/ddos_l7/entrypoint"
      );
      const processedOverrideResp = overrideResp.map((zone) => zone.resp);

      const ddosResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/ddos_l7"
      );
      setOverrideData(processedOverrideResp);

      const processedDdosResp = ddosResp.map((zone, idx) => {
        const newObj = { ...zone.resp };
        newObj.result = newObj.result.rules.map((record) => {
          record["sensitivity_level"] = "high"; // this is default value from Cloudflare DASH

          // update values of record if there is an overridden record
          const overrideValue = isOverridden(
            idx,
            processedOverrideResp,
            record.id
          );

          if (overrideValue !== false) {
            const keys = Object.keys(overrideValue);
            keys.forEach((key) => {
              if (key !== "id") {
                record[key] = overrideValue[key];
              }
            });
          }
          return record;
        });
        return newObj;
      });
      setDdosProtectionData(processedDdosResp);
    }
    setOverrideData();
    setDdosProtectionData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Rule ID",
        accessor: "id",
        maxWidth: 180,
      },
      {
        Header: "Description",
        accessor: "description",
        maxWidth: 180,
      },
      {
        Header: "Tags",
        accessor: (row) =>
          row.categories.map((category) => (
            <Tag color={"grey.300"} key={category}>
              {category}
            </Tag>
          )),
        maxWidth: 120,
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
        maxWidth: 100,
      },
      {
        Header: "Sensitivity",
        accessor: "sensitivity_level",
        Cell: (props) => Humanize(props.value),
        maxWidth: 100,
      },
    ];
    const dynamicHeaders =
      ddosProtectionData && ddosProtectionData[0].result.length
        ? HeaderFactory(ddosProtectionData.length)
        : ddosProtectionData && ddosProtectionData[0].result.length === 0
        ? HeaderFactoryWithTags(ddosProtectionData.length, false)
        : [];

    return ddosProtectionData &&
      ddosProtectionData[0].success &&
      ddosProtectionData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [ddosProtectionData]);

  const data = React.useMemo(
    () =>
      ddosProtectionData
        ? CompareData(
            CompareBaseToOthers,
            ddosProtectionData,
            conditionsToMatch,
            "HTTP DDoS attack protection"
          )
        : [],
    [ddosProtectionData]
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
      const overrideResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/ddos_l7/entrypoint"
      );
      const processedOverrideResp = overrideResp.map((zone) => zone.resp);

      const ddosResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/ddos_l7"
      );
      setOverrideData(processedOverrideResp);

      const processedDdosResp = ddosResp.map((zone, idx) => {
        const newObj = { ...zone.resp };
        newObj.result = newObj.result.rules.map((record) => {
          record["sensitivity_level"] = "high"; // this is default value from Cloudflare DASH

          // update values of record if there is an overridden record
          const overrideValue = isOverridden(
            idx,
            processedOverrideResp,
            record.id
          );

          if (overrideValue !== false) {
            const keys = Object.keys(overrideValue);
            keys.forEach((key) => {
              if (key !== "id") {
                record[key] = overrideValue[key];
              }
            });
          }
          return record;
        });
        return newObj;
      });
      setDdosProtectionData(processedDdosResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData =
      data[0].result.rules[0].action_parameters.overrides.rules;
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
        "/put/rulesets/phases/ddos_l7/entrypoint"
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
    setDdosProtectionData();
    getData();
  };

  const putDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await putZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const overrideResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/ddos_l7/entrypoint"
      );
      const processedOverrideResp = overrideResp.map((zone) => zone.resp);

      const ddosResp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/ddos_l7"
      );
      setOverrideData(processedOverrideResp);

      const processedDdosResp = ddosResp.map((zone, idx) => {
        const newObj = { ...zone.resp };
        newObj.result = newObj.result.rules.map((record) => {
          record["sensitivity_level"] = "high"; // this is default value from Cloudflare DASH

          // update values of record if there is an overridden record
          const overrideValue = isOverridden(
            idx,
            processedOverrideResp,
            record.id
          );

          if (overrideValue !== false) {
            const keys = Object.keys(overrideValue);
            keys.forEach((key) => {
              if (key !== "id") {
                record[key] = overrideValue[key];
              }
            });
          }
          return record;
        });
        return newObj;
      });
      setDdosProtectionData(processedDdosResp);
    }

    let errorCount = 0;
    setErrorPromptList([]);

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData =
      data[0].result.rules[0].action_parameters.overrides.rules;
    const otherZoneKeys = zoneKeys.slice(1);

    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };
      const { resp: checkIfEmpty } = await getZoneSetting(
        authObj,
        "/rulesets/phases/ddos_l7/entrypoint"
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
        "/put/rulesets/phases/ddos_l7/entrypoint"
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
    setDdosProtectionData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            overrideData &&
            overrideData[0].success &&
            overrideData[0].result.rules[0].action_parameters.overrides
              ?.rules !== undefined
          }
          copy={() =>
            putDataFromBaseToOthers(overrideData, zoneKeys, credentials)
          }
        />
      }
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() => handleDelete(overrideData, zoneKeys, credentials)}
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
      {!ddosProtectionData && <LoadingBox />}
      {ddosProtectionData && (
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

export default DdosProtection;
