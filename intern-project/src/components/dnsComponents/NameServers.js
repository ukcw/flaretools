import React from "react";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

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
          <th>Name Server</th>
        </tr>
      </thead>
      <tbody>
        {props.data.map((nameServer) => (
          <tr key={nameServer}>
            <td>{String(nameServer)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

const NameServers = (props) => {
  const nameServers = props.data.result["name_servers"];

  return (
    <div>
      <h2>Name Servers</h2>
      {props.success ? (
        <SuccessfulRequest data={nameServers} />
      ) : (
        <UnsuccessfulDefault errors={props.errors} />
      )}
    </div>
  );
};

export default NameServers;
