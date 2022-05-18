import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import {
  Box,
  ChakraProvider,
  Container,
  Heading,
  Stack,
  Text,
} from "@chakra-ui/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import WireframeZoneViewer from "./pages/WireframeZoneViewer";
import ZoneViewer from "./pages/ZoneViewer";
import Navbar from "./components/Navbar";
import ZoneComparison from "./pages/ZoneComparison";

const Welcome = () => {
  return (
    <Container maxW={"container.xl"}>
      <Stack
        as={Box}
        textAlign={"center"}
        spacing={{ base: 8, md: 14 }}
        py={{ base: 20, md: 36 }}
      >
        <Heading
          fontWeight={600}
          fontSize={{ base: "2xl", sm: "4xl", md: "6xl" }}
          lineHeight={"110%"}
        >
          Welcome to FlareTools!
          <br />
          <Text as={"span"} color={"green.400"}>
            Click on Zone Viewer or Zone Comparison/Copier to get started.
          </Text>
        </Heading>
      </Stack>
    </Container>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <ChakraProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/zone-viewer" element={<ZoneViewer />} />
          <Route path="/zone-comparison" element={<ZoneComparison />} />
          <Route
            path="/zone-viewer-wireframe"
            element={<WireframeZoneViewer />}
          />
        </Routes>
      </BrowserRouter>
    </ChakraProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
