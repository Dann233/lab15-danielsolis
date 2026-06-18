import { albumSchema } from './album.schema.js';
import * as albumes from '../../data/albumes.js';

export function create(req, res) {
  const result = albumSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Datos invalidos';
    return res.status(400).json({ error: message });
  }

  if (albumes.getBySlug(result.data.slug)) {
    return res.status(409).json({ error: 'Ya existe un album con ese slug' });
  }

  const created = albumes.create(result.data);
  res.status(201).location(`/album/${created.slug}`).json(created);
}
