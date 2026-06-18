import * as albumes from '../../data/albumes.js';

export function getAll(req, res) {
  const data = req.query.include === 'full' ? albumes.getAllFull() : albumes.getAll();
  res.json(data);
}
