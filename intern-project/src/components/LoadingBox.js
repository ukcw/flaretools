import { Box, SkeletonCircle, SkeletonText } from "@chakra-ui/react";
import React from "react";

const LoadingBox = () => {
  return <SkeletonText mt="4" noOfLines={4} spacing="4" />;
};

export default LoadingBox;
