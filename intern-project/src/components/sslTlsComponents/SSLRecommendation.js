import React from "react";

/* Cannot use UnsuccessfulDefault because error message is not given inside errors array */

const UnsuccessfulRequest = (props) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Error</th>
          <th>Message</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.errorCode}</td>
          <td>{props.errorMessage}</td>
        </tr>
      </tbody>
    </table>
  );
};

const SSLRecommendation = (props) => {
  return (
    <div>
      <h2>SSL Recommendation</h2>
      {props.success ? null : (
        <UnsuccessfulRequest
          errorCode={props.data.errors[0]}
          errorMessage={props.data.messages[0]}
        />
      )}
    </div>
  );
};

export default SSLRecommendation;
