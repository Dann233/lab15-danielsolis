import * as albumes from '../../data/albumes.js';
import { notFound } from '../notFound.js';

export function getBySlug(req, res) {
  const album = albumes.getBySlug(req.params.slug);
  if (!album) return notFound(res, 'Album no encontrado');
  res.json(album);
}
