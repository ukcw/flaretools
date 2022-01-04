import React from "react";
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
    <table>
      <thead>
        <tr>
          {props.tableHeaders.map((header) => (
            <th key={header}>{humanize(header)}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          {props.tableHeaders.map((header) => (
            <td key={header}>
              {props.data[header] ? props.data[header].toString() : "null"}
            </td>
          ))}
        </tr>
      </tbody>
    </table>
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
