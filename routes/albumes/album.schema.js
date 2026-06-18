import { z } from 'zod';

export const albumSchema = z.object({
  titulo:      z.string().trim().nonempty('El titulo no puede estar vacio').max(200, 'El titulo no puede superar 200 caracteres'),
  artista:     z.string().trim().nonempty('El artista no puede estar vacio').max(200, 'El artista no puede superar 200 caracteres'),
  genero:      z.string().trim().nonempty('El genero no puede estar vacio').max(100, 'El genero no puede superar 100 caracteres'),
  anio:        z.number({ invalid_type_error: 'El anio debe ser un numero' }).int('El anio debe ser un entero').min(1900, 'El anio debe ser 1900 o posterior').max(2100, 'El anio debe ser 2100 o anterior'),
  sello:       z.string().trim().nonempty('El sello no puede estar vacio').max(200, 'El sello no puede superar 200 caracteres'),
  pistas:      z.number({ invalid_type_error: 'Las pistas deben ser un numero' }).int('Las pistas deben ser un entero').positive('Las pistas deben ser un numero positivo'),
  imagen:      z.string().trim().nonempty('La imagen no puede estar vacia'),
  slug:        z.string().trim().nonempty('El slug no puede estar vacio').regex(/^[a-z0-9-]+$/, 'El slug solo puede contener minusculas, numeros y guiones'),
  resumen:     z.string().trim().nonempty('El resumen no puede estar vacio'),
  descripcion: z.string().trim().nonempty('La descripcion no puede estar vacia'),
});
