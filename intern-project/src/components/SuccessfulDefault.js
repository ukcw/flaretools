import React from "react";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from "@chakra-ui/react";
import UnsuccessfulDefault from "./UnsuccessfulDefault";

function humanize(str) {
  var i,
    frags = str.split("_");
  for (i = 0; i < frags.length; i++) {
    frags[i] = frags[i].charAt(0).toUpperCase() + frags[i].slice(1);
  }
  return frags.join(" ");
}

const SuccessfulRequest = (props) => {
  return (
    <Table>
      <Thead>
        <Tr>
          {props.tableHeaders.map((header) => (
            <Th key={header}>{humanize(header)}</Th>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        <Tr>
          {props.tableHeaders.map((header) => (
            <Td key={header}>{String(props.data[header])}</Td>
          ))}
        </Tr>
      </Tbody>
    </Table>
  );
};

const SuccessfulDefault = (props) => {
  const columnHeaders = Object.keys(props.data.result);

  return (
    <div>
      <h2>{humanize(props.title)}</h2>
      {props.success && props.data.result ? (
        <SuccessfulRequest
          tableHeaders={columnHeaders}
          data={props.data.result}
        />
      ) : (
        <UnsuccessfulDefault errors={props.errors} />
      )}
    </div>
  );
};

export default SuccessfulDefault;
