import { IAirflowOperator } from "../components";

export const dummyOperators: IAirflowOperator[] = [
  {
    type: "string-param",
    ports: {
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
    },
    properties: {
      name: "test1",
      parameters: [{ id: "sql", type: "str", default: "SELECT * FROM `TABLE`" }]
    }
  },
  {
    type: "bool-param",
    ports: {
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
    },
    properties: {
      name: "test1",
      parameters: [{ id: "useLegacySql", type: "bool", default: "true" }]
    }
  }
];
