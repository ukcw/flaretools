import { CheckIcon, CloseIcon } from "@chakra-ui/icons";
import {
  Heading,
  Stack,
  Table,
  Text,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useTable } from "react-table";
import { useCompareContext } from "../../../lib/contextLib";
import { getMultipleZoneSettings, HeaderFactory } from "../../../utils/utils";
import LoadingBox from "../../LoadingBox";

const CompareDns = (baseData, restData) => {
  if (baseData.success === true && baseData.result.length) {
    const baseZoneData = baseData.result;
    return baseZoneData.map((baseObj) => {
      for (let j = 0; j < restData.length; j++) {
        if (restData[j].success === true) {
          const currentCompareZoneData = restData[j].result;
          let foundMatch = false;
          console.log(currentCompareZoneData);
          currentCompareZoneData.forEach((compareObj) => {
            if (
              baseObj.type === compareObj.type &&
              baseObj.name === compareObj.name &&
              baseObj.content === compareObj.content &&
              baseObj.proxied === compareObj.proxied
            ) {
              foundMatch = true;
            }
            foundMatch
              ? (baseObj[`zone${j + 2}`] = true)
              : (baseObj[`zone${j + 2}`] = false);
          });
        }
      }
      return baseObj;
    });
  } else {
    // base zone is unsuccessful or has no entries
    let newObj = {
      setting: "DNS Management",
      value: false,
    };
    for (let j = 0; j < restData.length; j++) {
      restData[j].success === true && restData[j].result.length
        ? (newObj[`zone${j + 2}`] = true)
        : (newObj[`zone${j + 2}`] = false);
    }
    return [newObj];
  }
};

const DnsRecords = (props) => {
  const { zoneKeys, credentials } = useCompareContext();
  const [dnsRecords, setDnsRecords] = useState();

  useEffect(() => {
    async function getData() {
      const resp = await getMultipleZoneSettings(
        zoneKeys,
        credentials,
        "/dns_records"
      );
      const processedResp = resp.map((zone) => zone.resp);
      setDnsRecords(processedResp);
    }
    setDnsRecords();
    getData();
  }, [credentials, zoneKeys]);

  const columns = React.useMemo(() => {
    const baseHeaders = [
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Content",
        accessor: "content",
      },
      {
        Header: "Proxied",
        accessor: "proxied",
        Cell: (props) =>
          props.value ? <CheckIcon color="green" /> : <CloseIcon color="red" />,
      },
      {
        Header: "TTL",
        accessor: "ttl",
        Cell: (props) => (props.value === 1 ? <Text>Auto</Text> : props.value),
      },
    ];

    const unsuccessfulHeaders = [
      {
        Header: "Setting",
        accessor: "setting",
      },
      {
        Header: "Value",
        accessor: "value",
        Cell: (props) =>
          props.value ? (
            <CheckIcon color={"green"} />
          ) : (
            <CloseIcon color={"red"} />
          ),
      },
    ];

    const dynamicHeaders =
      dnsRecords !== undefined ? HeaderFactory(dnsRecords.length) : [];

    return dnsRecords && dnsRecords[0].success && dnsRecords[0].result.length
      ? baseHeaders.concat(dynamicHeaders)
      : unsuccessfulHeaders.concat(dynamicHeaders);
  }, [dnsRecords]);

  const makeData = (comp_fn, data) => {
    return comp_fn(data[0], data.slice(1));
  };

  const data = React.useMemo(
    () => (dnsRecords ? makeData(CompareDns, dnsRecords) : []),
    [dnsRecords]
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({ columns, data });

  return (
    <Stack w="100%" spacing={4}>
      <Heading size="md">DNS Management</Heading>
      {!dnsRecords && <LoadingBox />}
      {dnsRecords && (
        <Table style={{ tableLayout: "fixed" }} {...getTableProps}>
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

export default DnsRecords;
