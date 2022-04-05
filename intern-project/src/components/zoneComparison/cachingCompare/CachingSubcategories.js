import {
  Heading,
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
import ProgressBarModal from "../commonComponents/ProgressBarModal";
import SuccessPromptModal from "../commonComponents/SuccessPromptModal";
import ErrorPromptModal from "../commonComponents/ErrorPromptModal";
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

const CachingSubcategories = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [cachingSubcategoriesData, setCachingSubcategoriesData] = useState();
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
        getMultipleZoneSettings(zoneKeys, credentials, "/argo/tiered_caching"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/cache/tiered_cache_smart_topology_enable"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/cache_level"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/browser_cache_ttl"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/always_online"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/development_mode"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/sort_query_string_for_cache"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.cache !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.cache.crawlhints_enabled;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setCachingSubcategoriesData(processedResp);
    }
    setCachingSubcategoriesData();
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
      cachingSubcategoriesData && cachingSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            cachingSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return cachingSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [cachingSubcategoriesData]);

  const data = React.useMemo(
    () =>
      cachingSubcategoriesData
        ? cachingSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result?.id !== undefined
                ? data[0].result.id
                : "crawlhints"
            );
          })
        : [],
    [cachingSubcategoriesData]
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
        getMultipleZoneSettings(zoneKeys, credentials, "/argo/tiered_caching"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/cache/tiered_cache_smart_topology_enable"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/cache_level"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/browser_cache_ttl"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/flags"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/always_online"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/development_mode"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/sort_query_string_for_cache"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => {
          if (zone.resp.result?.cache !== undefined) {
            let newObj = { ...zone.resp };
            newObj["result"].value = zone.resp.result.cache.crawlhints_enabled;
            return newObj;
          } else {
            return zone.resp;
          }
        })
      );
      setCachingSubcategoriesData(processedResp);
    }

    SuccessPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data;
    const otherZoneKeys = zoneKeys.slice(1);

    setSubcategoriesCopied("");
    const subcategories = {
      tiered_caching: undefined,
      tiered_cache_smart_topology_enable: undefined,
      cache_level: undefined,
      browser_cache_ttl: undefined,
      crawlhints: undefined,
      always_online: undefined,
      development_mode: undefined,
      sort_query_string_for_cache: undefined,
    };

    const subcategoriesEndpoints = {
      tiered_caching: "/patch/argo/tiered_caching",
      tiered_cache_smart_topology_enable:
        "/patch/cache/tiered_cache_smart_topology_enable",
      cache_level: "/patch/settings/cache_level",
      browser_cache_ttl: "/patch/settings/browser_cache_ttl",
      crawlhints: "/post/flags/products/cache/changes",
      always_online: "/patch/settings/always_online",
      development_mode: "/patch/settings/development_mode",
      sort_query_string_for_cache:
        "/patch/settings/sort_query_string_for_cache",
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
          setCurrentProgressSubcategory("Crawlhints");
          const createData = {
            feature: "crawlhints_enabled",
            value: currentSubcategory.result.value, // this case is for Crawlhints
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
              subcategoriesEndpoints.crawlhints
            );
            if (postRequestResp.success === true) {
              subcategories.crawlhints = true;
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
    setCachingSubcategoriesData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            cachingSubcategoriesData && cachingSubcategoriesData.length
          }
          copy={() =>
            patchDataFromBaseToOthers(
              cachingSubcategoriesData,
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
      {!cachingSubcategoriesData && <LoadingBox />}
      {cachingSubcategoriesData && (
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

export default CachingSubcategories;
