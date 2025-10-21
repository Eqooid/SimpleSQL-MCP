# SimpleSQL MCP Server

A Model Context Protocol (MCP) server that provides SQL database operations for various database systems. This server enables AI assistants to perform CRUD operations, create tables, and seed data across multiple database backends.

## Features

- **Multi-database support**: MySQL, PostgreSQL, SQLite, and more
- **CRUD operations**: Create, Read, Update, Delete data in any table
- **Table creation**: Dynamically create tables with custom schemas
- **Data seeding**: Generate and insert dummy data for testing
- **Connection testing**: Ping tool to verify database connectivity

## Supported Databases

This MCP server supports the following databases through Knex.js:

- **MySQL** (via `mysql2` driver)
- **PostgreSQL** (via `pg` driver) 
- **SQLite** (via `sqlite3` and `better-sqlite3` drivers)
- **MySQL** (legacy via `mysql` driver)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SimpleSQL
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Configuration

### Environment Variables

```env
# Database Configuration
DB_TYPE=mysql          # Database type: mysql, mysql2, pg, sqlite3, better-sqlite3
DB_HOST=localhost      # Database host (not needed for SQLite)
DB_PORT=3306          # Database port (not needed for SQLite)
DB_USER=root          # Database username (not needed for SQLite)
DB_PASSWORD=          # Database password (not needed for SQLite)
DB_NAME=simple_sql_db # Database name / SQLite file path
SSL=false             # Enable SSL connection (true/false)
```

### Database-Specific Configuration Examples

#### MySQL Configuration
```env
DB_TYPE=mysql2
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
SSL=false
```

#### PostgreSQL Configuration
```env
DB_TYPE=pg
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your_database
SSL=false
```

#### SQLite Configuration
```env
DB_TYPE=sqlite3
DB_NAME=./database.sqlite
# Note: HOST, PORT, USER, PASSWORD, and SSL are not needed for SQLite
```

#### Better SQLite3 Configuration (Recommended for SQLite)
```env
DB_TYPE=better-sqlite3
DB_NAME=./database.sqlite
```

## MCP Server Setup

### Using with Claude Desktop

Add this server to your Claude Desktop configuration file:

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`
**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "simplesql": {
      "command": "node",
      "args": ["path/to/SimpleSQL/build/index.js"],
      "env": {
        "DB_TYPE": "mysql2",
        "DB_HOST": "localhost",
        "DB_PORT": "3306",
        "DB_USER": "your_username",
        "DB_PASSWORD": "your_password",
        "DB_NAME": "your_database",
        "SSL": "false"
      }
    }
  }
}
```

### Using as CLI Tool

You can also use this as a command-line tool:

```bash
# Install globally
npm install -g .

# Or run directly
npx simplesql
```

## Available Tools

### 1. CRUD Operations (`crud_tool`)

Perform Create, Read, Update, Delete operations on database tables.

**Parameters:**
- `action` (string): The operation type - "create", "read", "update", "delete"
- `table` (string): The target table name
- `data` (object, optional): Data for create/update operations
- `filter` (object, optional): Filter criteria for read/update/delete operations

**Examples:**
```javascript
// Create a record
{
  "action": "create",
  "table": "users",
  "data": {"name": "John Doe", "email": "john@example.com"}
}

// Read records
{
  "action": "read",
  "table": "users",
  "filter": {"name": "John Doe"}
}

// Update records
{
  "action": "update",
  "table": "users",
  "data": {"email": "newemail@example.com"},
  "filter": {"id": 1}
}

// Delete records
{
  "action": "delete",
  "table": "users",
  "filter": {"id": 1}
}
```

### 2. Table Creation (`create_table`)

Create new database tables with custom schemas.

**Parameters:**
- `table` (string): The name of the table to create
- `columns` (object): Column definitions with name-type pairs

**Example:**
```javascript
{
  "table": "products",
  "columns": {
    "id": "INTEGER PRIMARY KEY AUTO_INCREMENT",
    "name": "VARCHAR(255) NOT NULL",
    "price": "DECIMAL(10,2)",
    "created_at": "TIMESTAMP DEFAULT CURRENT_TIMESTAMP"
  }
}
```

### 3. Data Seeding (`seed_data`)

Generate and insert dummy data into tables for testing.

**Parameters:**
- `table` (string): The table name to seed
- `count` (number, optional): Number of records to generate (default: 10)

**Example:**
```javascript
{
  "table": "users",
  "count": 50
}
```

### 4. Connection Test (`ping_tool`)

Test database connectivity and server responsiveness.

**Parameters:** None

## Development

### Project Structure

```
SimpleSQL/
├── src/                    # TypeScript source files
│   ├── db.ts              # Database connection logic
│   ├── index.ts           # MCP server setup and tool definitions
│   └── tools/             # Individual tool implementations
│       ├── crud.ts        # CRUD operations
│       ├── createTable.ts # Table creation
│       └── seedData.ts    # Data seeding
├── build/                 # Compiled JavaScript output
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
├── .env                  # Environment variables (create this)
└── .gitignore           # Git ignore rules
```

### Building

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `build/` directory and sets proper permissions for the CLI executable.

### Dependencies

**Runtime Dependencies:**
- `@modelcontextprotocol/sdk`: MCP server implementation
- `knex`: SQL query builder
- `better-sqlite3`, `sqlite3`: SQLite drivers
- `mysql`, `mysql2`: MySQL drivers
- `pg`: PostgreSQL driver
- `dotenv`: Environment variable loading
- `zod`: Schema validation
- `@faker-js/faker`: Dummy data generation

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify your environment variables are correct
   - Ensure the database server is running
   - Check firewall and network connectivity

2. **Permission Denied**
   - For SQLite: Ensure write permissions to the database file location
   - For MySQL/PostgreSQL: Verify user has required privileges

3. **Module Not Found**
   - Run `npm install` to install dependencies
   - Ensure you've built the project with `npm run build`

### Testing Connection

Use the ping tool to test your database connection:

```bash
# The ping_tool will return "Pong!" if connection is successful
# or an error message if there are connection issues
```

## License

MIT License

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request