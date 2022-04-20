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
  getMultipleAccountSettings,
  getMultipleZoneSettings,
  getZoneSetting,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  TimeToText,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import RecordsErrorPromptModal from "../commonComponents/RecordsErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  return (
    _.isEqual(base.default_pools, toCompare.default_pools) &&
    _.isEqual(base.fallback_pool, toCompare.fallback_pool) &&
    base.enabled === toCompare.enabled &&
    base.proxied === toCompare.proxied &&
    base.session_affinity === toCompare.session_affinity &&
    _.isEqual(
      base.session_affinity_attributes,
      toCompare.session_affinity_attributes
    ) &&
    base.steering_policy === toCompare.steering_policy
  );
};

const LoadBalancers = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [loadBalancersData, setLoadBalancersData] = useState();
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
        "/load_balancers"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const resp_pools = await getMultipleAccountSettings(
        zoneKeys,
        credentials,
        zoneDetails,
        "/load_balancers/pools"
      );
      const processRespPool = resp_pools.map((zone) => zone.resp);
      processedResp.forEach((zone, idx) => {
        zone.result.forEach((lb) => {
          lb["pools"] = processRespPool[idx].result;
        });
        setLoadBalancersData(processedResp);
      });
    }
    setLoadBalancersData();
    getData();
  }, [credentials, zoneDetails, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Hostname",
        accessor: (row) => {
          const output = /(\w+).+/.exec(row.name)[0];
          return output;
        },
        maxWidth: 250,
      },
      {
        Header: "Pools",
        accessor: (row) => {
          return (
            <VStack w="100%" p={0} align={"flex-start"}>
              {row.default_pools.map((poolId) => {
                if (row.pools) {
                  for (let i = 0; i < row.pools.length; i++) {
                    if (poolId === row.pools[i].id) {
                      return (
                        <div key={poolId}>
                          <Text>{`Name: ${row.pools[i].name}, Address: ${row.pools[i].origins[0].address}, Weight: ${row.pools[i].origins[0].weight}`}</Text>
                        </div>
                      );
                    }
                  }
                } else {
                  return "";
                }
              })}
            </VStack>
          );
        },
        maxWidth: 400,
        wordWrap: "break-all",
      },
      {
        Header: "TTL",
        accessor: (row) => {
          if (row?.ttl !== undefined) {
            return TimeToText(row.ttl);
          }
          return "Automatic";
        },
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
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
      loadBalancersData && loadBalancersData[0].result.length
        ? HeaderFactory(loadBalancersData.length)
        : loadBalancersData && loadBalancersData[0].result.length === 0
        ? HeaderFactoryWithTags(loadBalancersData.length, false)
        : [];

    return loadBalancersData &&
      loadBalancersData[0].success &&
      loadBalancersData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [loadBalancersData]);

  /*
    const makeData = (data) => {
      return data.map((row) => {
        return row.default_pools.map((poolId) => {
          if (props.pools) {
            for (let i = 0; i < props.pools.result.length; i++) {
              if (poolId === props.pools.result[i].id) {
                return {
                  id: poolId,
                  name: props.pools.result[i].name,
                  address: props.pools.result[i].origins[0].address,
                  weight: props.pools.result[i].origins[0].weight,
                };
              }
            }
          }
        });
      });
    };*/

  const data = React.useMemo(
    () =>
      loadBalancersData
        ? CompareData(
            CompareBaseToOthers,
            loadBalancersData,
            conditionsToMatch,
            "Load Balancers"
          )
        : [],
    [loadBalancersData]
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

      const { resp } = await getZoneSetting(authObj, "/load_balancers");

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
            "/delete/load_balancers"
          );
          if (resp.success === false) {
            const errorObj = {
              code: resp.errors[0].code,
              message: resp.errors[0].message,
              data: createData.identifier,
            };
            setErrorPromptList((prev) => [...prev, errorObj]);
            ErrorPromptOnOpen();
          }
          setNumberOfRecordsDeleted((prev) => prev + 1);
        }
      }
    }
    DeletionProgressBarOnClose();
    copyDataFromBaseToOthers(data, zoneKeys, credentials);
  };

  const copyDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    return;
    async function sendPostRequest(data, endpoint) {
      const resp = await createZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/load_balancers"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const resp_pools = await getMultipleAccountSettings(
        zoneKeys,
        credentials,
        zoneDetails,
        "/load_balancers/pools"
      );
      const processRespPool = resp_pools.map((zone) => zone.resp);
      processedResp.forEach((zone, idx) => {
        zone.result.forEach((lb) => {
          lb["pools"] = processRespPool[idx].result;
        });
        setLoadBalancersData(processedResp);
      });
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
        "/dns_records"
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
      const exp = new RegExp("(.*)?." + zoneDetails.zone_1.name);
      const createData = {
        type: record.type,
        name: record.name.match(exp) ? record.name.match(exp)[1] : null,
        content: record.content,
        ttl: record.ttl,
      };
      if (record?.priority !== undefined) {
        createData["priority"] = record.priority;
      }
      if (record?.proxied !== undefined) {
        createData["proxied"] = record.proxied;
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
        if (dataToCreate.name === null) {
          const { zone_details: otherZoneDetails } = await getZoneSetting(
            authObj,
            "/zone_details"
          );
          if (otherZoneDetails.success) {
            dataToCreate.name = otherZoneDetails.result.name;
          } else {
            return alert(
              `Error: Authentication details for ${zoneDetails[key].name} was incorrect`
            );
          }
        }
        const dataWithAuth = { ...authObj, data: dataToCreate };
        const { resp: postRequestResp } = await sendPostRequest(
          dataWithAuth,
          "/copy/dns_records"
        );
        if (postRequestResp.success === false) {
          const errorObj = {
            code: postRequestResp.errors[0].code,
            message: postRequestResp.errors[0].message,
            data: dataToCreate.name,
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
    setLoadBalancersData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            loadBalancersData &&
            loadBalancersData[0].success &&
            loadBalancersData[0].result.length
          }
          copy={() =>
            copyDataFromBaseToOthers(loadBalancersData, zoneKeys, credentials)
          }
        />
      }
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() =>
            handleDelete(loadBalancersData, zoneKeys, credentials)
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
      {!loadBalancersData && <LoadingBox />}
      {loadBalancersData && (
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
                                wordBreak: cell.column.wordWrap,
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

export default LoadBalancers;
