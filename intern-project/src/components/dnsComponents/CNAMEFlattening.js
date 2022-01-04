import React from "react";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const CNAMEFlattening = (props) => {
  return (
    <div>
      <h2>CNAME Flattening</h2>
      {props.success ? (
        <span>Enabled</span>
      ) : (
        <UnsuccessfulDefault errors={props.errors} />
      )}
    </div>
  );
};

export default CNAMEFlattening;
