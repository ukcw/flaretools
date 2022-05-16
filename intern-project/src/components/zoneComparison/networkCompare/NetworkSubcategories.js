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
  SubcategoriesSuccessMessage,
} from "../../../utils/utils";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import _ from "lodash";

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
  } else if (data.result.value === "on") {
    return true;
  } else if (data.result.value === "off") {
    return false;
  } else {
    return data.result.value;
  }
};

const NetworkSubcategories = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [networkSubcategoriesData, setNetworkSubcategoriesData] = useState();
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
  const [currentProgressSubcategory, setCurrentProgressSubcategory] =
    useState("");
  const [subcategoriesCopied, setSubcategoriesCopied] = useState("");
  const [numberOfSubcategoriesToCopy, setNumberOfSubcategoriesToCopy] =
    useState(0);
  const [numberOfSubcategoriesCopied, setNumberOfSubcategoriesCopied] =
    useState(0);

  useEffect(() => {
    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http2"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http3"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/0rtt"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/ipv6"),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/websockets"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/opportunistic_onion"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/pseudo_ipv4"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/ip_geolocation"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/max_upload"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/response_buffering"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/true_client_ip_header"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.protocols !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.protocols.gRPC;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setNetworkSubcategoriesData(processedResp);
    }
    setNetworkSubcategoriesData();
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
      networkSubcategoriesData && networkSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            networkSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return networkSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [networkSubcategoriesData]);

  const data = React.useMemo(
    () =>
      networkSubcategoriesData
        ? networkSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result?.id !== undefined ? data[0].result.id : "grpc"
            );
          })
        : [],
    [networkSubcategoriesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  const patchDataFromBaseToOthers = async (data, zoneKeys, credentials) => {
    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http2"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http3"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/0rtt"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/ipv6"),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/websockets"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/opportunistic_onion"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/pseudo_ipv4"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/ip_geolocation"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/max_upload"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/response_buffering"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/true_client_ip_header"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.protocols !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.protocols.gRPC;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setNetworkSubcategoriesData(processedResp);
    }

    SuccessPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data;
    const otherZoneKeys = zoneKeys.slice(1);

    setSubcategoriesCopied("");
    const subcategories = {
      http2: undefined,
      http3: undefined,
      "0rtt": undefined,
      ipv6: undefined,
      grpc: undefined,
      websockets: undefined,
      opportunistic_onion: undefined,
      pseudo_ipv4: undefined,
      ip_geolocation: undefined,
      max_upload: undefined,
      response_buffering: undefined,
      true_client_ip_header: undefined,
    };

    const subcategoriesEndpoints = {
      http2: "/patch/settings/http2",
      http3: "/patch/settings/http3",
      "0rtt": "/patch/settings/0rtt",
      ipv6: "/patch/settings/ipv6",
      grpc: "/post/flags/products/protocols/changes",
      websockets: "/patch/settings/websockets",
      opportunistic_onion: "/patch/settings/opportunistic_onion",
      pseudo_ipv4: "/patch/settings/pseudo_ipv4",
      ip_geolocation: "/patch/settings/ip_geolocation",
      max_upload: "/patch/settings/max_upload",
      response_buffering: "/patch/settings/response_buffering",
      true_client_ip_header: "/patch/settings/true_client_ip_header",
    };

    setNumberOfSubcategoriesCopied(0);
    setNumberOfSubcategoriesToCopy(data.length * data[0].slice(1).length);
    CopyingProgressBarOnOpen();

    for (const record of baseZoneData) {
      const currentSubcategory = record[0];
      if (currentSubcategory.success === true && currentSubcategory.result) {
        if (currentSubcategory.result?.id !== undefined) {
          setCurrentProgressSubcategory(currentSubcategory.result.id);
          const createData = {
            value: currentSubcategory.result.value,
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
              subcategoriesEndpoints[currentSubcategory.result.id]
            );
            if (postRequestResp.success === true) {
              subcategories[currentSubcategory.result.id] = true;
            }
          }
        } else if (currentSubcategory.result?.cache !== undefined) {
          setCurrentProgressSubcategory("gRPC");
          const createData = {
            feature: "gRPC",
            value: currentSubcategory.result.value, // this case is for gRPC
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
              subcategoriesEndpoints.grpc
            );
            if (postRequestResp.success === true) {
              subcategories.grpc = true;
            }
          }
        } else {
        }
      } else {
      }
      setNumberOfSubcategoriesCopied((prev) => prev + 1);
    }
    setSubcategoriesCopied(subcategories);
    CopyingProgressBarOnClose();
    SuccessPromptOnOpen();
    setNetworkSubcategoriesData();
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

    async function sendPostRequest(data, endpoint) {
      const resp = await patchZoneSetting(data, endpoint);
      return resp;
    }

    async function getData() {
      const resp = await Promise.all([
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http2"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/http3"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/0rtt"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/ipv6"),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/websockets"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/opportunistic_onion"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/pseudo_ipv4"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/ip_geolocation"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/max_upload"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/response_buffering"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/true_client_ip_header"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.protocols !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.protocols.gRPC;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setNetworkSubcategoriesData(processedResp);
    }

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data;
    const otherZoneKeys = zoneKeys.slice(1);

    const subcategories = {
      http2: undefined,
      http3: undefined,
      "0rtt": undefined,
      ipv6: undefined,
      grpc: undefined,
      websockets: undefined,
      opportunistic_onion: undefined,
      pseudo_ipv4: undefined,
      ip_geolocation: undefined,
      max_upload: undefined,
      response_buffering: undefined,
      true_client_ip_header: undefined,
    };

    const subcategoriesEndpoints = {
      http2: "/patch/settings/http2",
      http3: "/patch/settings/http3",
      "0rtt": "/patch/settings/0rtt",
      ipv6: "/patch/settings/ipv6",
      grpc: "/post/flags/products/protocols/changes",
      websockets: "/patch/settings/websockets",
      opportunistic_onion: "/patch/settings/opportunistic_onion",
      pseudo_ipv4: "/patch/settings/pseudo_ipv4",
      ip_geolocation: "/patch/settings/ip_geolocation",
      max_upload: "/patch/settings/max_upload",
      response_buffering: "/patch/settings/response_buffering",
      true_client_ip_header: "/patch/settings/true_client_ip_header",
    };

    // initialize state
    setProgress((prevState) => {
      const newState = {
        ...prevState,
        [props.id]: {
          ...prevState[props.id],
          status: "copy",
          totalToCopy: data.length * data[0].slice(1).length,
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

    for (const record of baseZoneData) {
      const currentSubcategory = record[0];
      if (currentSubcategory.success === true && currentSubcategory.result) {
        if (currentSubcategory.result?.id !== undefined) {
          // setCurrentProgressSubcategory(currentSubcategory.result.id);
          const createData = {
            value: currentSubcategory.result.value,
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
              subcategoriesEndpoints[currentSubcategory.result.id]
            );
            if (postRequestResp.success === true) {
              subcategories[currentSubcategory.result.id] = true;
            } else {
              const errorObj = {
                code: postRequestResp.errors[0].code,
                message: postRequestResp.errors[0].message,
                data: currentSubcategory.result.id,
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
        } else if (currentSubcategory.result?.cache !== undefined) {
          // setCurrentProgressSubcategory("gRPC");
          const createData = {
            feature: "gRPC",
            value: currentSubcategory.result.value, // this case is for gRPC
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
              subcategoriesEndpoints.grpc
            );
            if (postRequestResp.success === true) {
              subcategories.grpc = true;
            } else {
              const errorObj = {
                code: postRequestResp.errors[0].code,
                message: postRequestResp.errors[0].message,
                data: "ssl_universal",
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
        } else {
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
      const subcategoriesKeys = Object.keys(subcategories);
      const copiedData = [];
      subcategoriesKeys.forEach((k) =>
        copiedData.push({
          name: k,
          success: subcategories[k],
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
    setNetworkSubcategoriesData();
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

  if (!networkSubcategoriesData) {
  } // don't do anything while the app has not loaded
  else if (networkSubcategoriesData && networkSubcategoriesData.length) {
    zoneCopierFunctions[props.id] = (setResults, setProgress) =>
      bulkCopyHandler(
        networkSubcategoriesData,
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
            networkSubcategoriesData && networkSubcategoriesData.length
          }
          copy={() =>
            patchDataFromBaseToOthers(
              networkSubcategoriesData,
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
          successMessage={SubcategoriesSuccessMessage(
            subcategoriesCopied,
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
            currentProgressSubcategory
          )} is being copied from ${zoneDetails.zone_1.name} to ${
            zoneDetails[currentZone].name
          }`}
          progress={numberOfSubcategoriesCopied}
          total={numberOfSubcategoriesToCopy}
        />
      )}
      {!networkSubcategoriesData && <LoadingBox />}
      {networkSubcategoriesData && (
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

export default NetworkSubcategories;
