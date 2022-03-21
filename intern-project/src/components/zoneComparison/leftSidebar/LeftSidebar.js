import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Link,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import {
  Humanize,
  ZoneComparisonLeftSidebarData,
  ZoneViewerLeftSidebarData,
} from "../../../utils/utils";

const LeftSidebar = (props) => {
  return (
    <VStack
      mt={16}
      ml={16}
      borderColor="#ccc"
      //   borderWidth={0.1}
      borderRadius={10}
      //   boxShadow="0 0 3px #ccc"
      display="flex"
    >
      <Accordion
        allowMultiple
        allowToggle
        w="100%"
        style={{
          position: "sticky",
          top: "2rem",
        }}
      >
        {props.app === "compare" &&
          Object.keys(ZoneComparisonLeftSidebarData).map((key) => {
            return (
              <AccordionItem key={key}>
                <h2>
                  <AccordionButton>
                    <AccordionIcon />
                    <Box flex="1" textAlign="left">
                      {key}
                    </Box>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <List>
                    {ZoneComparisonLeftSidebarData[key].map((subcategory) => {
                      return (
                        <ListItem key={subcategory}>
                          <Link href={`/zone-comparison/#${subcategory}`}>
                            {Humanize(subcategory)}
                          </Link>
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
        {props.app === "viewer" &&
          Object.keys(ZoneViewerLeftSidebarData).map((key) => {
            return (
              <AccordionItem key={key}>
                <h2>
                  <AccordionButton>
                    <AccordionIcon />
                    <Box flex="1" textAlign="left">
                      {key}
                    </Box>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <List>
                    {ZoneViewerLeftSidebarData[key].map((subcategory) => {
                      return (
                        <ListItem key={subcategory}>
                          <Link href={`/zone-viewer/#${subcategory}`}>
                            {Humanize(subcategory)}
                          </Link>
                        </ListItem>
                      );
                    })}
                  </List>
                </AccordionPanel>
              </AccordionItem>
            );
          })}
      </Accordion>
    </VStack>
  );
};

export default LeftSidebar;
