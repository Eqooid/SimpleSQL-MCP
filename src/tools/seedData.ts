import { faker } from '@faker-js/faker';

export async function seedData(db:any, table:any, count = 10) {
  // Dapatkan kolom dari schema
  const columns = await db(table).columnInfo();

  if (!columns || Object.keys(columns).length === 0) {
    throw new Error(`Table "${table}" not found or has no columns`);
  }

  // Helper untuk generate value berdasarkan nama kolom
  const generateValue = (colName:any, colType:any) => {
    const name = colName.toLowerCase();

    if (name.includes("name")) return faker.person.fullName();
    if (name.includes("email")) return faker.internet.email();
    if (name.includes("phone")) return faker.phone.number();
    if (name.includes("address")) return faker.location.streetAddress();
    if (name.includes("city")) return faker.location.city();
    if (name.includes("country")) return faker.location.country();
    if (name.includes("date")) return faker.date.recent();
    if (name.includes("price") || name.includes("amount")) return faker.finance.amount();
    if (name.includes("id")) return faker.string.uuid();
    if (colType.includes("int")) return faker.number.int({ min: 1, max: 1000 });
    if (colType.includes("char") || colType.includes("text")) return faker.word.words(3);

    // Default random value
    return faker.string.alphanumeric(10);
  };

  // Buat array data dummy
  const rows = Array.from({ length: count }, () => {
    const row:any = {};
    for (const [colName, info] of Object.entries(columns)) {
      const colInfo:any = info;

      if (colInfo.nullable === false && colInfo.defaultValue === null && colName === "id") continue;

      row[colName] = generateValue(colName, colInfo.type || "");
    }
    return row;
  });

  // Insert ke DB
  await db(table).insert(rows);

  return { table, inserted: rows.length };
}
