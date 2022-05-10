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
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";
import _ from "lodash";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";
import ProgressBarModal from "../commonComponents/ProgressBarModal";

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
  } else if (data.result?.certificate_authority !== undefined) {
    return data.result["certificate_authority"];
  } else if (data.result.value === "on") {
    return true;
  } else if (data.result.value === "off") {
    return false;
  } else {
    return data.result.value;
  }
};

const SslSubcategories = (props) => {
  const { zoneKeys, credentials, zoneDetails, zoneCopierFunctions } =
    useCompareContext();
  const [sslSubcategoriesData, setSslSubcategoriesData] = useState();
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
        getMultipleZoneSettings(zoneKeys, credentials, "/ssl/recommendation"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/always_use_https"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/min_tls_version"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/opportunistic_encryption"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/tls_1_3"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/automatic_https_rewrites"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/ssl/universal/settings"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/tls_client_auth"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      setSslSubcategoriesData(processedResp);
    }
    setSslSubcategoriesData();
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
      sslSubcategoriesData && sslSubcategoriesData.length
        ? HeaderFactoryOverloaded(sslSubcategoriesData[0].length, convertOutput)
        : [];

    return sslSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [sslSubcategoriesData]);

  const data = React.useMemo(
    () =>
      sslSubcategoriesData
        ? sslSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result?.id !== undefined
                ? data[0].result.id
                : data[0].result?.certificate_authority !== undefined
                ? "ssl_universal"
                : "ssl_recommendation"
            );
          })
        : [],
    [sslSubcategoriesData]
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
        getMultipleZoneSettings(zoneKeys, credentials, "/ssl/recommendation"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/always_use_https"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/min_tls_version"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/opportunistic_encryption"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/tls_1_3"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/automatic_https_rewrites"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/ssl/universal/settings"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/tls_client_auth"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      setSslSubcategoriesData(processedResp);
    }

    SuccessPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data;
    const otherZoneKeys = zoneKeys.slice(1);

    setSubcategoriesCopied("");
    const subcategories = {
      ssl_recommendation: undefined,
      always_use_https: undefined,
      min_tls_version: undefined,
      opportunistic_encryption: undefined,
      tls_1_3: undefined,
      automatic_https_rewrites: undefined,
      ssl_universal: undefined,
      tls_client_auth: undefined,
    };

    const subcategoriesEndpoints = {
      ssl_recommendation: "/patch/ssl/recommendation",
      always_use_https: "/patch/settings/always_use_https",
      min_tls_version: "/patch/settings/min_tls_version",
      opportunistic_encryption: "/patch/settings/opportunistic_encryption",
      tls_1_3: "/patch/settings/tls_1_3",
      automatic_https_rewrites: "/patch/settings/automatic_https_rewrites",
      ssl_universal: "/patch/ssl/universal/settings",
      tls_client_auth: "/patch/settings/tls_client_auth",
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
        } else if (
          currentSubcategory.result?.certificate_authority !== undefined
        ) {
          setCurrentProgressSubcategory("SSL Universal");
          const createData = {
            enabled: currentSubcategory.result.enabled, // this case is for SSL Universal
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
              subcategoriesEndpoints.ssl_universal
            );
            if (postRequestResp.success === true) {
              subcategories.ssl_universal = true;
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
    setSslSubcategoriesData();
    getData();
  };

  if (!sslSubcategoriesData) {
  } // don't do anything while the app has not loaded
  else if (sslSubcategoriesData && sslSubcategoriesData.length) {
    zoneCopierFunctions[props.id] = () =>
      patchDataFromBaseToOthers(sslSubcategoriesData, zoneKeys, credentials);
  } else {
    zoneCopierFunctions[props.id] = false;
  }

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={sslSubcategoriesData && sslSubcategoriesData.length}
          copy={() =>
            patchDataFromBaseToOthers(
              sslSubcategoriesData,
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
      {!sslSubcategoriesData && <LoadingBox />}
      {sslSubcategoriesData && (
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

export default SslSubcategories;
