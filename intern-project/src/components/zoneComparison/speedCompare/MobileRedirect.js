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
  } else if (data.result.id === "mobile_subdomain") {
    return data.result.value.mobile_subdomain;
  } else if (data.result.id === "strip_uri") {
    return data.result.value.strip_uri ? "Drop Path" : "Keep Path";
  } else if (data.result.id === "status" && data.result.value.status === "on") {
    return true;
  } else if (
    data.result.id === "status" &&
    data.result.value.status === "off"
  ) {
    return false;
  } else {
    return data.result.value;
  }
};

const MobileRedirect = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [mobileRedirectData, setMobileRedirectData] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/settings/mobile_redirect"
      );
      const processedResp = resp.map((zone) => zone.resp);
      const secondaryProcessedResp = [
        [JSON.parse(JSON.stringify(processedResp))], // this method does a deep copy of the objects
        [JSON.parse(JSON.stringify(processedResp))],
        [JSON.parse(JSON.stringify(processedResp))],
      ];

      secondaryProcessedResp[0] = secondaryProcessedResp[0][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "status";
        return newObj;
      });
      secondaryProcessedResp[1] = secondaryProcessedResp[1][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "mobile_subdomain";
        return newObj;
      });
      secondaryProcessedResp[2] = secondaryProcessedResp[2][0].map((res) => {
        let newObj = { ...res };
        newObj.result.id = "strip_uri";
        return newObj;
      });
      setMobileRedirectData(secondaryProcessedResp);
    }
    setMobileRedirectData();
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
      mobileRedirectData && mobileRedirectData.length
        ? HeaderFactoryOverloaded(mobileRedirectData[0].length, convertOutput)
        : [];

    return mobileRedirectData ? baseHeaders.concat(dynamicHeaders) : [];
  }, [mobileRedirectData]);

  const data = React.useMemo(
    () =>
      mobileRedirectData
        ? mobileRedirectData.map((data) => {
            return CompareData(
              CompareBaseToOthersCategorical,
              data,
              returnConditions,
              data[0].result.id
            );
          })
        : [],
    [mobileRedirectData]
  );
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">Mobile Redirect</Heading>
      {!mobileRedirectData && <LoadingBox />}
      {mobileRedirectData && (
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

export default MobileRedirect;
