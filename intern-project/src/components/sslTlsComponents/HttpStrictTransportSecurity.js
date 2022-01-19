import {
  Heading,
  HStack,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Tr,
} from "@chakra-ui/react";
import React from "react";
import { Humanize } from "../../utils/utils";
import { CloseIcon } from "@chakra-ui/icons";

const SettingValue = (value) => {
  if (value === false) {
    return <CloseIcon color={"red"} />;
  } else if (value === true) {
    return <CloseIcon color={"green"} />;
  } else {
    return value;
  }
};

const HttpStrictTransportSecurity = (props) => {
  const keys = Object.keys(props.data.result.value.strict_transport_security);

  return (
    <Stack w="100%" spacing={4}>
      <HStack w="100%" spacing={4}>
        <Heading size="md">HTTP Strict Transport Security (HSTS)</Heading>
        {props.data.result.value.strict_transport_security.enabled === false ? (
          <Switch isReadOnly isChecked={false} />
        ) : (
          <Switch isReadOnly colorScheme={"green"} isChecked={true} />
        )}
      </HStack>
      {props.data.result.value.strict_transport_security.enabled !== false && (
        <Table>
          <Tbody>
            {keys.map((key) => {
              if (key !== "enabled") {
                return (
                  <Tr key={key}>
                    <Th>{Humanize(key)}</Th>
                    <Td>
                      {SettingValue(
                        props.data.result.value.strict_transport_security[key]
                      )}
                    </Td>
                  </Tr>
                );
              } else {
                return null;
              }
            })}
          </Tbody>
        </Table>
      )}
    </Stack>
  );
};

export default HttpStrictTransportSecurity;
