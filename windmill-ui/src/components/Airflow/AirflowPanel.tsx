import * as React from "react";
import { AirflowOperator } from ".";
import { SidebarTitle, BaseSidebar } from "../Theme";

export const AirflowPanel = () => (
  <BaseSidebar>
    <SidebarTitle>Operator Library</SidebarTitle>
    <AirflowOperator
      type="top/bottom"
      ports={{
        port1: {
          id: "port1",
          type: "top",
          properties: {
            custom: "property"
          }
        },
        port2: {
          id: "port1",
          type: "bottom",
          properties: {
            custom: "property"
          }
        }
      }}
      properties={{
        name: "test1",
        parameters: [{id: "sql", type: "str", default: "SELECT * FROM `TABLE`"}]
      }}
    />
  </BaseSidebar>
);
