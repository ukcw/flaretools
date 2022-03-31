import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Stack,
  Table,
  Text,
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
  CountDeltaDifferences,
  createZoneSetting,
  deleteZoneSetting,
  getMultipleZoneSettings,
  getZoneSetting,
  HeaderFactory,
  Humanize,
  UnsuccessfulHeaders,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import NonEmptyErrorModal from "../commonComponents/NonEmptyErrorModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) =>
  base.type === toCompare.type &&
  base.name === toCompare.name &&
  base.content === toCompare.content &&
  base.proxied === toCompare.proxied &&
  base.ttl === toCompare.ttl;

const DnsRecords = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [dnsRecords, setDnsRecords] = useState();
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
  const [currentZone, setCurrentZone] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/dns_records"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setDnsRecords(processedResp);
    }
    setDnsRecords();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Content",
        accessor: "content",
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? <CheckIcon color="green" /> : <CloseIcon color="red" />,
      },
      {
        Header: "TTL",
        accessor: "ttl",
        Cell: (props) => (props.value === 1 ? <Text>Auto</Text> : props.value),
      },
    ];

    const dynamicHeaders =
      dnsRecords !== undefined ? HeaderFactory(dnsRecords.length) : [];

    return dnsRecords && dnsRecords[0].success && dnsRecords[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeaders.concat(dynamicHeaders);
  }, [dnsRecords]);

  const data = React.useMemo(
    () =>
      dnsRecords
        ? CompareData(
            CompareBaseToOthers,
            dnsRecords,
            conditionsToMatch,
            "DNS Management"
          )
        : [],
    [dnsRecords]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const delta = React.useMemo(
    () => (dnsRecords ? CountDeltaDifferences(zoneKeys, data, dnsRecords) : []),
    [data, dnsRecords, zoneKeys]
  );

  const handleDelete = async (data, zoneKeys, credentials) => {
    const otherZoneKeys = zoneKeys.slice(1);

    for (const key of otherZoneKeys) {
      const authObj = {
        zoneId: credentials[key].zoneId,
        apiToken: `Bearer ${credentials[key].apiToken}`,
      };

      const { resp } = await getZoneSetting(authObj, "/dns_records");

      if (resp.success === false || resp.result.length === 0) {
        ErrorPromptOnOpen();
        return;
      } else {
        for (const record of resp.result) {
          const createData = _.cloneDeep(authObj);
          createData["identifier"] = record.id; // need to send identifier to API endpoint
          const { resp } = await deleteZoneSetting(
            createData,
            "/delete/dns_records"
          );
          if (resp.success === false) {
            NonEmptyErrorOnClose();
            ErrorPromptOnOpen();
          }
        }
        copyDataFromBaseToOthers(data, zoneKeys, credentials);
      }
    }
  };

  const copyDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await createZoneSetting(data, endpoint);
      return resp;
    }

    // if data for base zone hasn't loaded, user clicked the button prior to data loading, prevent
    // the copy function for moving any further
    const baseZoneData = data ? data[0] : [];
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
        console.log(
          "postRequest",
          postRequestResp.success,
          postRequestResp.result
        );
      }
    }
    if (NonEmptyErrorIsOpen) {
      NonEmptyErrorOnClose();
    }
    SuccessPromptOnOpen();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          copy={() =>
            copyDataFromBaseToOthers(dnsRecords, zoneKeys, credentials)
          }
        />
      }
      {NonEmptyErrorIsOpen && (
        <NonEmptyErrorModal
          isOpen={NonEmptyErrorIsOpen}
          onOpen={NonEmptyErrorOnOpen}
          onClose={NonEmptyErrorOnClose}
          handleDelete={() => handleDelete(dnsRecords, zoneKeys, credentials)}
          title={`There are some existing records in ${zoneDetails[currentZone].name}`}
          errorMessage={`To proceed with copying DNS Records from ${zoneDetails.zone_1.name} 
          to ${zoneDetails[currentZone].name}, the existing records 
          in ${zoneDetails[currentZone].name} need to be deleted. This action is irreversible.`}
        />
      )}
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
          successMessage={`Your ${Humanize(
            props.id
          )} settings have been successfully copied
          from ${zoneDetails.zone_1.name} to ${zoneDetails[currentZone].name}.`}
        />
      )}
      {/* <Stack w="100%">
        <HStack>
          <Heading size="md" id={props.id}>
            DNS Management
          </Heading>
          <Spacer />
          <Button
            size={"sm"}
            onClick={() =>
              copyDataFromBaseToOther(dnsRecords, zoneKeys, credentials)
            }
          >
            Copy DNS Records
          </Button>
        </HStack>
        <Tag w="20%" colorScheme={"green"}>
          <TagLeftIcon as={CopyIcon}></TagLeftIcon>
          <TagLabel>Can be copied</TagLabel>
        </Tag>
      </Stack> */}
      {!dnsRecords && <LoadingBox />}
      {dnsRecords && (
        <Table style={{ tableLayout: "fixed" }} {...getTableProps}>
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

export default DnsRecords;
