//import logo from "./logo.svg";
import React, { useState, useEffect } from "react";
import "./App.css";

const getZoneSetting = async (query) => {
  const url = "https://serverless-api.ulysseskcw96.workers.dev";
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
  const [zoneData, setZoneData] = useState([]);

  const search = async () => {
    const payload = {
      zoneId: zoneId,
      apiToken: apiToken,
    };
    const results = await getZoneSetting(payload);
    console.log(results);
    setZoneData(results.result);
  };

  return (
    <div className="App">
      <div className="form">
        <input
          id="zoneId"
          type="text"
          onChange={(e) => setZoneId(e.target.value)}
          placeholder="Zone ID"
        />
        <input
          id="apiToken"
          type="text"
          onChange={(e) => setApiToken(e.target.value)}
          placeholder="API Token"
        />
        <button onClick={search}>Search</button>
      </div>
      {zoneData ? (
        <table>
          <thead>
            <tr>
              <th>Setting</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {zoneData.map((setting, i) => (
              <tbody key={i}>
                {console.log(setting.id)}
                {console.log(setting.value)}
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            ))}
          </tbody>
        </table>
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
