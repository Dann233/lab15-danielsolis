import { albumSchema } from './album.schema.js';
import * as albumes from '../../data/albumes.js';
import { notFound } from '../notFound.js';

export function update(req, res) {
  const slug = req.params.slug;

  if (!albumes.getBySlug(slug)) {
    return notFound(res, 'Album no encontrado');
  }

  const result = albumSchema.safeParse(req.body);
  if (!result.success) {
    const message = result.error.issues[0]?.message ?? 'Datos invalidos';
    return res.status(400).json({ error: message });
  }

  if (result.data.slug !== slug && albumes.getBySlug(result.data.slug)) {
    return res.status(409).json({ error: 'Ya existe un album con ese slug' });
  }

  const updated = albumes.update(slug, result.data);
  res.status(200).json(updated);
}
