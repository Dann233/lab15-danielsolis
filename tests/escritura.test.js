import request from 'supertest';
import app from '../app.js';

const albumPrueba = {
  titulo: 'Album de Prueba',
  artista: 'Artista Test',
  genero: 'Rock',
  anio: 2020,
  sello: 'Sello Test',
  pistas: 10,
  imagen: 'test-album.avif',
  slug: 'test-album',
  resumen: 'Resumen de prueba.',
  descripcion: 'Descripcion de prueba del album.',
};

const crearAlbumPrueba = () =>
  request(app).post('/albumes').send(albumPrueba);

const borrarAlbumPrueba = () =>
  request(app).delete('/album/test-album');

beforeAll(async () => {
  await borrarAlbumPrueba();
});

afterAll(async () => {
  await borrarAlbumPrueba();
});

describe('POST /albumes', () => {
  it('con cuerpo valido responde 201, cabecera Location y el objeto creado', async () => {
    const res = await crearAlbumPrueba();
    expect(res.status).toBe(201);
    expect(res.headers.location).toBe('/album/test-album');
    expect(res.body.slug).toBe('test-album');
  });

  it('con cuerpo invalido responde 400 en JSON', async () => {
    const res = await request(app).post('/albumes').send({ titulo: '' });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });

  it('con slug duplicado responde 409 en JSON', async () => {
    const bodyDuplicado = { ...albumPrueba, slug: 'thriller' };
    const res = await request(app).post('/albumes').send(bodyDuplicado);
    expect(res.status).toBe(409);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });
});

describe('PUT /album/:slug', () => {
  beforeAll(async () => {
    await borrarAlbumPrueba();
    await crearAlbumPrueba();
  });

  it('existente y valido responde 200 y el objeto actualizado', async () => {
    const res = await request(app)
      .put('/album/test-album')
      .send({ ...albumPrueba, titulo: 'Album Actualizado' });
    expect(res.status).toBe(200);
    expect(res.body.titulo).toBe('Album Actualizado');
  });

  it('inexistente responde 404 en JSON', async () => {
    const res = await request(app)
      .put('/album/no-existe-este-slug')
      .send({ ...albumPrueba, slug: 'no-existe-este-slug' });
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });
});

describe('DELETE /album/:slug', () => {
  beforeAll(async () => {
    await borrarAlbumPrueba();
    await crearAlbumPrueba();
  });

  it('existente responde 204 sin cuerpo', async () => {
    const res = await request(app).delete('/album/test-album');
    expect(res.status).toBe(204);
    expect(res.text).toBe('');
  });

  it('inexistente responde 404 en JSON', async () => {
    const res = await request(app).delete('/album/no-existe-este-slug');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toContain('application/json');
    expect(res.body).toHaveProperty('error');
  });
});
