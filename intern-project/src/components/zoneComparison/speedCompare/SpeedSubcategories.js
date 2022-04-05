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

const SpeedSubcategories = (props) => {
  const { zoneKeys, credentials, zoneDetails } = useCompareContext();
  const [speedSubcategoriesData, setSpeedSubcategoriesData] = useState();
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
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/mirage"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/image_resizing"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/polish"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/brotli"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/early_hints"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/h2_prioritization"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/rocket_loader"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/prefetch_preload"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      setSpeedSubcategoriesData(processedResp);
    }
    setSpeedSubcategoriesData();
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
      speedSubcategoriesData && speedSubcategoriesData.length
        ? HeaderFactoryOverloaded(
            speedSubcategoriesData[0].length,
            convertOutput
          )
        : [];

    return speedSubcategoriesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [speedSubcategoriesData]);

  const data = React.useMemo(
    () =>
      speedSubcategoriesData
        ? speedSubcategoriesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [speedSubcategoriesData]
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
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/mirage"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/image_resizing"
        ),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/polish"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/brotli"),
        getMultipleZoneSettings(zoneKeys, credentials, "/settings/early_hints"),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/h2_prioritization"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/rocket_loader"
        ),
        getMultipleZoneSettings(
          zoneKeys,
          credentials,
          "/settings/prefetch_preload"
        ),
      ]);
      const processedResp = resp.map((settingArray) =>
        settingArray.map((zone) => zone.resp)
      );
      setSpeedSubcategoriesData(processedResp);
    }

    SuccessPromptOnClose();

    // not possible for data not to be loaded (logic is at displaying this button)
    const baseZoneData = data;
    const otherZoneKeys = zoneKeys.slice(1);

    setSubcategoriesCopied("");
    const subcategories = {
      mirage: undefined,
      image_resizing: undefined,
      polish: undefined,
      brotli: undefined,
      early_hints: undefined,
      h2_prioritization: undefined,
      rocket_loader: undefined,
      prefetch_preload: undefined,
    };

    const subcategoriesEndpoints = {
      mirage: "/patch/settings/mirage",
      image_resizing: "/patch/settings/image_resizing",
      polish: "/patch/settings/polish",
      brotli: "/patch/settings/brotli",
      early_hints: "/patch/settings/early_hints",
      h2_prioritization: "/patch/settings/h2_prioritization",
      rocket_loader: "/patch/settings/rocket_loader",
      prefetch_preload: "/patch/settings/prefetch_preload",
    };

    setNumberOfSubcategoriesCopied(0);
    setNumberOfSubcategoriesToCopy(data.length * data[0].slice(1).length);
    CopyingProgressBarOnOpen();

    for (const record of baseZoneData) {
      const currentSubcategory = record[0];
      if (currentSubcategory.success === true && currentSubcategory.result) {
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
      } else {
        CopyingProgressBarOnClose();
        ErrorPromptOnOpen();
      }
      setNumberOfSubcategoriesCopied((prev) => prev + 1);
    }
    setSubcategoriesCopied(subcategories);
    CopyingProgressBarOnClose();
    SuccessPromptOnOpen();
    setSpeedSubcategoriesData();
    getData();
  };

  return (
    <Stack w="100%" spacing={4}>
      {
        <CategoryTitle
          id={props.id}
          copyable={true}
          showCopyButton={
            speedSubcategoriesData && speedSubcategoriesData.length
          }
          copy={() =>
            patchDataFromBaseToOthers(
              speedSubcategoriesData,
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
      {!speedSubcategoriesData && <LoadingBox />}
      {speedSubcategoriesData && (
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

export default SpeedSubcategories;
