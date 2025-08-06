import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'], // your backend entry file
  outDir: 'dist',
  format: ['esm'],
  target: 'es2020',
  splitting: false,
  sourcemap: true,
  clean: true,
  dts: true,
  shims: true,
  external: [
    'fsevents', 
    'react', 
    'react-dom',
    '@prisma/client',
    'bcrypt',
    'compression',
    'cors',
    'dotenv',
    'express',
    'express-rate-limit',
    'express-validator',
    'helmet',
    'jsonwebtoken',
    'nodemailer',
    'ts-node',
    'typescript',
    'zod'
  ], // External dependencies
  noExternal: ['none'], // Treat all dependencies as external
})
