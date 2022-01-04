import React from "react";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const DNSSEC = (props) => {
  return (
    <div>
      <h2>DNSSEC</h2>
      {props.success ? (
        <span>Enabled</span>
      ) : (
        <UnsuccessfulDefault errors={props.errors} />
      )}
    </div>
  );
};

export default DNSSEC;
