import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Flex,
  Heading,
  Link,
  List,
  ListItem,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Humanize, ZoneComparisonLeftSidebarData } from "../../../utils/utils";

const LeftSidebar = (props) => {
  return (
    <VStack
      p={8}
      mt={16}
      ml={16}
      borderColor="#ccc"
      //   borderWidth={0.1}
      borderRadius={10}
      //   boxShadow="0 0 3px #ccc"
    >
      <Accordion allowMultiple allowToggle w="100%">
        {Object.keys(ZoneComparisonLeftSidebarData).map((key) => {
          return (
            <AccordionItem>
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
                      <ListItem>
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
      </Accordion>
    </VStack>
  );
};

export default LeftSidebar;
