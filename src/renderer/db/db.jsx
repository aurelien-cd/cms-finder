import Dexie from 'dexie';

const db = new Dexie('app_db');

db.version(1).stores({
  libraries: '++id, name, path',
});

export default db;