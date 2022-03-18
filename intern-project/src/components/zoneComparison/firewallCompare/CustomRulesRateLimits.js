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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import {
  CompareBaseToOthers,
  CompareData,
  getMultipleZoneSettings,
  HeaderFactory,
  HeaderFactoryWithTags,
  Humanize,
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  const isRateLimitSame = (base, other) => {
    if (base?.ratelimit === undefined && other?.ratelimit === undefined) {
      return true;
    } else if (
      base?.ratelimit === undefined ||
      other?.ratelimit === undefined
    ) {
      return false;
    } else {
      const rateLimitKeys = Object.keys(base.ratelimit);
      let sameFlag = true;
      rateLimitKeys.forEach((key) => {
        if (key === "characteristics" && key in other.ratelimit) {
          base.ratelimit[key].forEach((char) => {
            if (!other.ratelimit[key].includes(char)) {
              sameFlag = false;
            }
          });
        } else if (
          (key === "mitigation_timeout" ||
            key === "period" ||
            key === "requests_per_period") &&
          key in other.ratelimit
        ) {
          if (base.ratelimit[key] !== other.ratelimit[key]) {
            sameFlag = false;
          }
        }
      });
      return sameFlag;
    }
  };

  return (
    base.action === toCompare.action && // action
    base.enabled === toCompare.enabled && // enabled
    base.expression === toCompare.expression && // expression
    isRateLimitSame(base, toCompare)
  );
  // ratelimit -> characteristics
  // ratelimit -> mitigation_timeout
  // ratelimit -> period
  // ratelimit -> requests_per_period
};

const CustomRulesRateLimits = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [customRulesRateLimitsData, setCustomRulesRateLimitsData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/rulesets/phases/http_ratelimit/entrypoint"
      );
      const processedResp = resp.map((zone) => {
        const newObj = { ...zone.resp };
        newObj.result?.rules !== undefined
          ? (newObj.result = newObj.result.rules)
          : (newObj.result = []);
        return newObj;
      });
      setCustomRulesRateLimitsData(processedResp);
    }
    setCustomRulesRateLimitsData();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Action",
        accessor: "action",
        Cell: (props) => Humanize(props.value),
      },
      {
        Header: "Name",
        accessor: "description",
      },
      {
        Header: "Expression",
        accessor: "expression",
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
      customRulesRateLimitsData && customRulesRateLimitsData[0].result.length
        ? HeaderFactory(customRulesRateLimitsData.length)
        : customRulesRateLimitsData &&
          customRulesRateLimitsData[0].result.length === 0
        ? HeaderFactoryWithTags(customRulesRateLimitsData.length, false)
        : [];

    return customRulesRateLimitsData &&
      customRulesRateLimitsData[0].success &&
      customRulesRateLimitsData[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : UnsuccessfulHeadersWithTags.concat(dynamicHeaders);
  }, [customRulesRateLimitsData]);

  const data = React.useMemo(
    () =>
      customRulesRateLimitsData
        ? CompareData(
            CompareBaseToOthers,
            customRulesRateLimitsData,
            conditionsToMatch,
            "Custom Rules Rate Limits"
          )
        : [],
    [customRulesRateLimitsData]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md" id={props.id}>
          Custom Rules Rate Limits
        </Heading>
      </HStack>
      {!customRulesRateLimitsData && <LoadingBox />}
      {customRulesRateLimitsData && (
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

export default CustomRulesRateLimits;
