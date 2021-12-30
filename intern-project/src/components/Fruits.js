import React from "react";

import CardBuilder from "@cloudflare/builder-card";

export default class Fruits extends React.Component {
  render() {
    return (
      <CardBuilder
        id="fruits-card"
        title="Fruit Inventory"
        description="Manage all of your fruit"
      />
    );
  }
}
