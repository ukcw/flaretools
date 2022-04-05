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
  HeaderFactoryWithTags,
  Humanize,
  patchZoneSetting,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";

const conditionsToMatch = (base, toCompare) => {
  return (
    base.name === toCompare.name &&
    base.connected === toCompare.connected &&
    base.enabled === toCompare.enabled
  );
};

const Railgun = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [railgunData, setRailgunData] = useState();
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
        "/railguns"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setRailgunData(processedResp);
    }
    setRailgunData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Railgun State",
        accessor: "enabled",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
      {
        Header: "Connected to Website",
        accessor: "connected",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];

    const dynamicHeaders =
      railgunData && railgunData[0].result.length
        ? HeaderFactory(railgunData.length)
        : railgunData && railgunData[0].result.length === 0
        ? HeaderFactoryWithTags(railgunData.length, false)
        : [];

    return railgunData && railgunData[0].success && railgunData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [railgunData]);

  const data = React.useMemo(
    () =>
      railgunData
        ? CompareData(
            CompareBaseToOthers,
            railgunData,
            conditionsToMatch,
            "Railguns"
          )
        : [],
    [railgunData]
  );

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
        "/railguns"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setRailgunData(processedResp);
    }

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0];
    const otherZoneKeys = zoneKeys.slice(1);
    for (const record of baseZoneData.result) {
      const createData = {
        name: record.name,
        enabled: record.enabled,
        connected: record.connected,
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
          "/copy/railguns"
        );
        console.log(
          "postRequest",
          postRequestResp,
          postRequestResp.success,
          postRequestResp.result
        );
      }
    }
    SuccessPromptOnOpen();
    setRailgunData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            railgunData &&
            railgunData[0].success &&
            railgunData[0].result.length
          }
          copy={() =>
            patchDataFromBaseToOthers(railgunData, zoneKeys, credentials)
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
          successMessage={`Your ${Humanize(
            props.id
          )} settings have been successfully copied
          from ${zoneDetails.zone_1.name} to ${zoneDetails[currentZone].name}.`}
        />
      )}
      {!railgunData && <LoadingBox />}
      {railgunData && (
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

export default Railgun;
