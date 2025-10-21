export async function crud(db:any, {action, table, data, filter}:any) {
  switch (action) { 
    case 'create':
      return await db(table).insert(data);
    case 'read':
      return await db(table).where(filter || {});
    case 'update':
      return await db(table).where(filter).update(data);
    case 'delete':
      return await db(table).where(filter).del();
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}