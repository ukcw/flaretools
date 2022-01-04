//import logo from "./logo.svg";
import React, { useState } from "react";
import "./App.css";
import DNSViewer from "./components/dnsComponents/DNSViewer";
import SSLTLSViewer from "./components/sslTlsComponents/SSLTLSViewer";

const getZoneSetting = async (query, endpoint) => {
  const url = `https://serverless-api.ulysseskcw96.workers.dev${endpoint}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  return resp.json();
};

function App() {
  const [zoneId, setZoneId] = useState("");
  const [apiToken, setApiToken] = useState("");
  const [dnsData, setDnsData] = useState({});
  const [sslTlsData, setSslTlsData] = useState({});

  const search = async () => {
    const payload = {
      zoneId: zoneId,
      apiToken: apiToken,
    };
    const dnsResults = await getZoneSetting(payload, "/dns");
    setDnsData(dnsResults);
    const sslTlsResults = await getZoneSetting(payload, "/ssl_tls");
    setSslTlsData(sslTlsResults);
  };

  return (
    <div className="App">
      <div className="form">
        <input
          id="zoneId"
          type="text"
          onChange={(e) => setZoneId(e.target.value)}
          placeholder="Zone ID"
          style={{ width: 400 }}
        />
        <input
          id="apiToken"
          type="text"
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="API Token"
          style={{ width: 400 }}
        />
        <button onClick={search}>Search</button>
      </div>
      {dnsData ? <DNSViewer data={dnsData} /> : null}
      {sslTlsData ? <SSLTLSViewer data={sslTlsData} /> : null}
    </div>
  );
}

export default App;
