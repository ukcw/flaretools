import {
  Box,
  Flex,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link as ReachLink } from "react-router-dom";
import React from "react";

const Navbar = (props) => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");
  return (
    <Box>
      <Flex
        display={{ base: "none", md: "flex" }}
        py={{ base: 2 }}
        px={{ base: 4 }}
        minH={"60px"}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        top={"0"}
        //width={"100%"}
      >
        <Popover trigger={"hover"} placement={"bottom-start"}>
          <PopoverTrigger>
            <Link
              p={2}
              as={ReachLink}
              to="/zone-viewer"
              fontSize={"md"}
              fontWeight={500}
              color={linkColor}
              rounded={"xl"}
              _hover={{
                textDecoration: "none",
                color: linkHoverColor,
                bg: useColorModeValue("gray.300", "gray.900"),
              }}
            >
              Zone Viewer
            </Link>
          </PopoverTrigger>
        </Popover>
      </Flex>
    </Box>
  );
};

export default Navbar;
