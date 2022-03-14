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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import {
  CompareBaseToOthersCategorical,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactoryOverloaded,
  Humanize,
} from "../../../utils/utils";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import { useCompareContext } from "../../../lib/contextLib";
import { useTable } from "react-table";
import LoadingBox from "../../LoadingBox";

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
  } else if (data.result.id === "normalization_type") {
    return data.result.type;
  } else if (
    data.result.id === "incoming_urls" &&
    data.result.scope === "none"
  ) {
    return false;
  } else if (
    data.result.id === "incoming_urls" &&
    (data.result.scope === "both" || data.result.scope === "incoming")
  ) {
    return true;
  } else if (
    data.result.id === "urls_to_origin" &&
    (data.result.scope === "none" || data.result.scope === "incoming")
  ) {
    return false;
  } else if (
    data.result.id === "urls_to_origin" &&
    data.result.scope === "both"
  ) {
    return true;
  } else {
    return data.result.value;
  }
};

const NormalizationRules = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [normalizationRulesData, setNormalizationRulesData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/url_normalization"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))], // use this for as many times as unique setting values required
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      // NORMALIZE TYPE
      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result["id"] = "normalization_type";
        return newObj;
      });

      // NORMALIZE INCOMING URLS
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result["id"] = "incoming_urls";
        return newObj;
      });

      // NORMALIZE URLS TO ORIGIN
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result["id"] = "urls_to_origin";
        return newObj;
      });
      setNormalizationRulesData(secondaryProcessedResp);
    }
    setNormalizationRulesData();
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
      normalizationRulesData && normalizationRulesData.length
        ? HeaderFactoryOverloaded(
            normalizationRulesData[0].length,
            convertOutput
          )
        : [];

    return normalizationRulesData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [normalizationRulesData]);

  const data = React.useMemo(
    () =>
      normalizationRulesData
        ? normalizationRulesData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [normalizationRulesData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Normalization Settings
      </Heading>
      {!normalizationRulesData && <LoadingBox />}
      {normalizationRulesData && (
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

export default NormalizationRules;
