export async function createTable(db:any, table:any, columns:any) {
  const exists = await db.schema.hasTable(table);

  if (exists) return `Table '${table}' already exists`;

  await db.schema.createTable(table, (t:any) => {
    for (const [colName, colType] of Object.entries(columns)) {
      switch (colType) {
        case "id": t.increments(); break;
        case "string": t.string(colName); break;
        case "integer": t.integer(colName); break;
        case "boolean": t.boolean(colName); break;
        case "text": t.text(colName); break;
        default: throw new Error(`Unknown type: ${colType}`);
      }
    }
  });

  return `Table '${table}' created successfully`;
}