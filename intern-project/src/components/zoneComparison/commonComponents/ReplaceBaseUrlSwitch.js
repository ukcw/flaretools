import { FormControl, FormLabel, Switch } from "@chakra-ui/react";
import React from "react";

const ReplaceBaseUrlSwitch = ({
  switchText,
  switchState,
  changeSwitchState,
}) => {
  return (
    <FormControl display="flex" alignItems="center">
      <FormLabel htmlFor="switch-status" mb="0">
        {switchText}
      </FormLabel>
      <Switch
        id="switch-status"
        isChecked={switchState}
        onChange={(e) => changeSwitchState(e.target.checked)}
      />
    </FormControl>
  );
};

export default ReplaceBaseUrlSwitch;
