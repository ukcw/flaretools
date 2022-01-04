import React from "react";

const UnsuccessfulDefault = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Error</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        {props.errors.map((error) => (
          <tr key={error.code}>
            <td>{error.code}</td>
            <td>{error.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default UnsuccessfulDefault;
