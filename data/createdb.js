import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const sqlScript = readFileSync(join(__dirname, 'CREATE.SQL'), 'utf-8');
const albumes = JSON.parse(readFileSync(join(__dirname, 'albumes.json'), 'utf-8'));

const db = new DatabaseSync(join(__dirname, 'discostore.db'));

db.exec(sqlScript);
db.exec('DELETE FROM albumes');

const stmt = db.prepare(`
  INSERT INTO albumes (titulo, artista, genero, anio, sello, pistas, imagen, slug, resumen, descripcion)
  VALUES (:titulo, :artista, :genero, :anio, :sello, :pistas, :imagen, :slug, :resumen, :descripcion)
`);

for (const album of albumes) {
  stmt.run(album);
}

console.log(`${albumes.length} albumes insertados en discostore.db`);

db.close();
