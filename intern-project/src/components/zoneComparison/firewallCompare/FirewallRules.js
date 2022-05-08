import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
  VStack,
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
  GetExpressionOutput,
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

const ConcatenateExpressions = (expr) => {
  const exprs = expr.split(/\band\b|\bor\b/);
  const output = exprs.map((expr) => GetExpressionOutput(expr));
  return output.join(", ");
};

const conditionsToMatch = (base, toCompare) => {
  const checkProducts = (base, toCompare) => {
    if (base.action === "bypassed") {
      if (toCompare === "bypassed") {
        const baseProducts = base.products;
        const toCompareProducts = toCompare.products;
        baseProducts.forEach((prod) => {
          if (toCompareProducts.includes(prod) === false) {
            return false;
          }
        });
        return true;
      } else {
        return false;
      }
    } else {
      return base.action === toCompare.action ? true : false;
    }
  };

  return (
    base.filter.expression === toCompare.filter.expression && // match on filter->expression
    base.filter.paused === toCompare.filter.paused && // filter->paused
    base.action === toCompare.action && // action
    checkProducts(base, toCompare)
  ); // products (only exists if action == bypassed)
};

const FirewallRules = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [firewallRulesData, setFirewallRulesData] = useState();
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
  const [replaceBaseUrl, setReplaceBaseUrl] = useState(false);

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/firewall/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setFirewallRulesData(processedResp);
    }
    setFirewallRulesData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Priority",
        accessor: "priority",
      },
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
        maxWidth: 170,
      },
      {
        Header: "Description",
        accessor: (row) => {
          return (
            <VStack
              w="100%"
              p={0}
              align={"flex-start"}
              overflowWrap={"break-word"}
              wordBreak={"break-word"}
            >
              <Text>{row.description}</Text>
              {/*<Text color="grey">
                {ConcatenateExpressions(row.filter.expression)}
          </Text>*/}
            </VStack>
          );
        },
        maxWidth: 170,
      },
      {
        Header: "Expression",
        accessor: (row) => row.filter.expression,
        Cell: (props) => <Text>{props.value}</Text>,
        maxWidth: 170,
      },
      {
        Header: "Enabled",
        accessor: "paused",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];
    const dynamicHeaders =
      firewallRulesData && firewallRulesData[0].result.length
        ? HeaderFactory(firewallRulesData.length)
        : firewallRulesData && firewallRulesData[0].result.length === 0
        ? HeaderFactoryWithTags(firewallRulesData.length, false)
        : [];

    return firewallRulesData &&
      firewallRulesData[0].success &&
      firewallRulesData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [firewallRulesData]);

  const data = React.useMemo(
    () =>
      firewallRulesData
        ? CompareData(
            CompareBaseToOthers,
            firewallRulesData,
            conditionsToMatch,
            "Firewall Rules"
          )
        : [],
    [firewallRulesData]
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

      const { resp } = await getZoneSetting(authObj, "/firewall/rules");

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
            "/delete/firewall/rules"
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
        "/firewall/rules"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setFirewallRulesData(processedResp);
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
        "/firewall/rules"
      );

      if (checkIfEmpty.success === true && checkIfEmpty.result.length !== 0) {
        setCurrentZone(key);
        NonEmptyErrorOnOpen();
        return;
      }
    }

    setNumberOfRecordsCopied(0);
    setNumberOfRecordsToCopy(data[0].result.length * data.slice(1).length);

    for (const record of baseZoneData.result) {
      // need to create filter at copy zone first
      const filterData = {
        expression: record.filter.expression,
      };
      if (record.filter?.description !== undefined) {
        filterData["description"] = record.filter.description;
      }

      // data for creating the rule at copy zone
      const createData = {
        action: record.action,
        filter: {},
      };
      if (record?.id !== undefined) {
        createData["id"] = record.id;
      }
      if (record?.products !== undefined) {
        createData["products"] = record.products;
      }
      if (record?.priority !== undefined) {
        createData["priority"] = record.priority;
      }
      if (record?.paused !== undefined) {
        createData["paused"] = record.paused;
      }
      if (record?.description !== undefined) {
        createData["description"] = record.description;
      }
      if (record?.ref !== undefined) {
        createData["ref"] = record.ref;
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
        if (replaceBaseUrl) {
          filterData.expression = filterData.expression.replaceAll(
            zoneDetails["zone_1"].name,
            zoneDetails[key].name
          );
        }
        const filterDataWithAuth = { ...authObj, data: [filterData] };
        const { resp: filterResp } = await sendPostRequest(
          filterDataWithAuth,
          "/filters"
        );

        if (filterResp.success === true) {
          dataToCreate.filter = filterResp.result[0];
        } else {
          if (
            filterResp.errors[0].code === 10102 &&
            filterResp.errors[0].message ===
              "config duplicates an already existing config"
          ) {
            dataToCreate.filter["id"] = filterResp.errors[0].meta.id;
          } else {
            const errorObj = {
              code: filterResp.errors[0].code,
              message: filterResp.errors[0].message,
              data: record.id,
            };
            errorCount += 1;
            setErrorPromptList((prev) => [...prev, errorObj]);
          }
        }

        if (_.isEmpty(dataToCreate.filter) === false) {
          const dataWithAuth = { ...authObj, data: [dataToCreate] };
          const { resp: postRequestResp } = await sendPostRequest(
            dataWithAuth,
            "/copy/firewall/rules"
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
    }
    CopyingProgressBarOnClose();

    // if there is some error at the end of copying, show the records that
    // were not copied
    if (errorCount > 0) {
      ErrorPromptOnOpen();
    } else {
      SuccessPromptOnOpen();
    }
    setFirewallRulesData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            firewallRulesData &&
            firewallRulesData[0].success &&
            firewallRulesData[0].result.length
          }
          copy={() =>
            copyDataFromBaseToOthers(firewallRulesData, zoneKeys, credentials)
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
            handleDelete(firewallRulesData, zoneKeys, credentials)
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
      {!firewallRulesData && <LoadingBox />}
      {firewallRulesData && (
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

export default FirewallRules;
