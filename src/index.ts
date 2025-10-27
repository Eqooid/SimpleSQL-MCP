import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createDbConnection } from './db.js';
import { crud } from "./tools/crud.js";
import { createTable } from "./tools/createTable.js";

const server = new McpServer({
  name: "simplesql-mcp-server",
  version: "1.0.0"
});

server.tool(
  "crud_tool",
  "A tool for performing CRUD operations on a SQL database.", 
  {
    action: z.string().describe("The CRUD action to perform: create, read, update, delete."),
    table: z.string().describe("The name of the database table to operate on."),
    data: z.object({}).optional().describe("The data for create or update operations."),
    filter: z.object({}).optional().describe("The filter criteria for read, update, or delete operations."),
  },
  async ({ action, table, data, filter }) => {
    const db = await createDbConnection();
    const result = await crud(db, { action, table, data, filter });
    return {
      content: [
        {
          type: "text",
          text: `Performed ${action} on table ${table}: ${JSON.stringify(result)}`,
        },
      ],
    };
  }
);

server.tool(
  "ping_tool",
  "A simple tool to check server responsiveness.",
  {},
  async () => {
    try {
      const db = await createDbConnection();
      db.raw('SELECT 1');
      return {
        content: [
          {
            type: "text",
            text: "Pong! The SimpleSQL MCP Server is responsive.",
          },
        ],
      };
    }
    catch (error:any) {
      return {
        content: [
          {
            type: "text",
            text: `Error connecting to the database: ${error.message}`,
          }
        ]
      };
    }
  }
);

server.tool(
  "create_table", 
  "Create a new database table with given columns.", 
  {
    table: z.string().describe("The name of the table to create."),
    columns: z.record(z.string(), z.string()).describe("A record of column names and their SQL data types."),
  },
  async ({ table, columns }) => {
    const db = await createDbConnection();
    const result = await createTable(db, table, columns);
    return {
      content: [
        {
          type: "text",
          text: `${result}`,
        },
      ],
    };
  }
);

server.tool(
  "seed_data",
  "Seed a database table with dummy data based on its schema.",
  {
    table: z.string().describe("The name of the table to seed data into."),
    count: z.number().optional().describe("The number of dummy records to insert. Default is 10."),
  },
  async ({ table, count }) => {
    const db = await createDbConnection();
    const { seedData } = await import("./tools/seedData.js");
    const result = await seedData(db, table, count || 10);
    return {
      content: [
        {
          type: "text",
          text: `Inserted ${result.inserted} records into table '${result.table}'.`,
        },
      ],
    };
  }
);

server.tool(
  "get_config",
  "Retrieve current database configuration.",
  {},
  async () => {
    const config = {
      DB_TYPE: process.env.DB_TYPE || 'mysql',
      DB_HOST: process.env.DB_HOST || 'localhost',
      DB_PORT: process.env.DB_PORT || '3306',
      DB_USER: process.env.DB_USER || 'root',
      DB_NAME: process.env.DB_NAME || 'simple_sql_db',
      SSL: process.env.SSL === 'true',
    };
    return {
      content: [
        {
          type: "text",
          text: `Current DB Configuration: ${JSON.stringify(config, null, 2)}`,
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Server is now running and ready to receive requests
}

main().catch((error) => {
  console.error("Error starting SimpleSQL MCP Server:", error);
  process.exit(1);
});





