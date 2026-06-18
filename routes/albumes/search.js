import { searchSchema } from './search.schema.js';
import * as albumes from '../../data/albumes.js';

export function search(req, res) {
  const result = searchSchema.safeParse(req.params);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Busqueda invalida';
    return res.status(400).json({ error: message });
  }
  const results = albumes.search(result.data.text);
  res.json(results.map(r => r.slug));
}
