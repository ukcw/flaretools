import React from "react";
import UnsuccessfulDefault from "../UnsuccessfulDefault";

const CustomNS = (props) => {
  return (
    <div>
      <h2>Custom NS</h2>
      {props.success ? null : <UnsuccessfulDefault errors={props.errors} />}
    </div>
  );
};

export default CustomNS;
