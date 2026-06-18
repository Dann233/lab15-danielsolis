import request from 'supertest';
import app from '../app.js';

const SLUG_EXISTENTE = 'thriller';

describe('GET /albumes', () => {
  it('responde 200 y un arreglo que contiene un slug sembrado', async () => {
    const res = await request(app).get('/albumes');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(a => a.slug === SLUG_EXISTENTE)).toBe(true);
  });
});

describe('GET /album/:slug', () => {
  it('con slug existente responde 200 y el objeto del album', async () => {
    const res = await request(app).get(`/album/${SLUG_EXISTENTE}`);
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe(SLUG_EXISTENTE);
    expect(res.body).toHaveProperty('titulo');
    expect(res.body).toHaveProperty('artista');
  });

  it('con slug inexistente responde 404 en JSON', async () => {
    const res = await request(app).get('/album/no-existe-este-slug');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });
});

describe('GET /search/:text', () => {
  it('con texto de menos de 3 caracteres responde 400 en JSON', async () => {
    const res = await request(app).get('/search/ab');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });
});
