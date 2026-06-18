import * as albumes from '../../data/albumes.js';
import { notFound } from '../notFound.js';

export function remove(req, res) {
  const deleted = albumes.remove(req.params.slug);
  if (!deleted) return notFound(res, 'Album no encontrado');
  res.status(204).end();
}
