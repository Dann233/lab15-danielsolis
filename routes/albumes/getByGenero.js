import * as albumes from '../../data/albumes.js';

export function getByGenero(req, res) {
  const results = albumes.getByGenero(req.params.genero);
  res.json(results.map(r => r.slug));
}
