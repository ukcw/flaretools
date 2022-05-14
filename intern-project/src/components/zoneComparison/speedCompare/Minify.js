import {
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  CategoryTitle,
  CompareBaseToOthersCategorical,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactoryOverloaded,
  Humanize,
  patchZoneSetting,
} from "../../../utils/utils";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";
import _ from "lodash";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";

const convertOutput = (value) => {
  return value === true ? (
    <Tag colorScheme={"green"}>Match</Tag>
  ) : value === false ? (
    <Tag colorScheme={"red"}>No Match</Tag>
  ) : (
    value
  );
};

const returnConditions = (data) => {
  if (data.success === false) {
    return data.messages[0];
  } else if (data.result.id === "html") {
    return data.result.value.html === "on" ? true : false;
  } else if (data.result.id === "css") {
    return data.result.value.css === "on" ? true : false;
  } else if (data.result.id === "js") {
    return data.result.value.js === "on" ? true : false;
  } else {
    return data.result.value;
  }
};

const Minify = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [minifyData, setMinifyData] = useState();
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
        "/settings/minify"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))],
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "html";
        return newObj;
      });
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "css";
        return newObj;
      });
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "js";
        return newObj;
      });
      setMinifyData(secondaryProcessedResp);
    }
    setMinifyData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Setting",
        accessor: "setting",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: (props) =>
          props.value === true ? (
            <CheckIcon color={"green"} />
          ) : props.value === false ? (
            <CloseIcon color={"red"} />
          ) : (
            props.value
          ),
      },
    ];
    const dynamicHeaders =
      minifyData && minifyData.length
        ? HeaderFactoryOverloaded(minifyData[0].length, convertOutput)
        : [];

    return minifyData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [minifyData]);

  const data = React.useMemo(
    () =>
      minifyData
        ? minifyData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [minifyData]
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
        "/settings/minify"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))],
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "html";
        return newObj;
      });
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "css";
        return newObj;
      });
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "js";
        return newObj;
      });
      setMinifyData(secondaryProcessedResp);
    }

    SuccessPromptOnClose();
    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0][0];
    const otherZoneKeys = zoneKeys.slice(1);

    const createData = {
      value: baseZoneData.result.value,
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
        "/patch/settings/minify"
      );
      if (postRequestResp.success === false) {
        ErrorPromptOnOpen();
        return;
      }
    }
    SuccessPromptOnOpen();
    setMinifyData();
    getData();
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
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/minify"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))],
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "html";
        return newObj;
      });
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "css";
        return newObj;
      });
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "js";
        return newObj;
      });
      setMinifyData(secondaryProcessedResp);
    }

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data[0][0];
    const otherZoneKeys = zoneKeys.slice(1);

    // initialize state
    setProgress((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          status: "copy",
          totalToCopy: 1,
          progressTotal: 0,
          completed: false,
        },
      };
      return newState;
    });

    const createData = {
      value: baseZoneData.result.value,
    };

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
        "/patch/settings/minify"
      );
      if (postRequestResp.success === false) {
        const errorObj = {
          code: postRequestResp.errors[0].code,
          message: postRequestResp.errors[0].message,
          data: dataToCreate.value,
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
    setMinifyData();
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

  if (!minifyData) {
  } // don't do anything while the app has not loaded
  else if (minifyData && minifyData[0][0].success && minifyData[0][0].result) {
    zoneCopierFunctions[props.id] = (setResults, setProgress) =>
      bulkCopyHandler(
        minifyData,
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
            minifyData && minifyData[0][0].success && minifyData[0][0].result
          }
          copy={() =>
            patchDataFromBaseToOthers(minifyData, zoneKeys, credentials)
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
      {!minifyData && <LoadingBox />}
      {minifyData && (
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

export default Minify;
