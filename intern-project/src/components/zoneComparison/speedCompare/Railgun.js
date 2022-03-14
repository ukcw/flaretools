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
  UnsuccessfulHeadersWithTags,
} from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const conditionsToMatch = (base, toCompare) => {
  return (
    base.name === toCompare.name &&
    base.connected === toCompare.connected &&
    base.enabled === toCompare.enabled
  );
};

const Railgun = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [railgunData, setRailgunData] = useState();

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

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md" id={props.id}>
        Railguns
      </Heading>
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
