import { defineConfig } from 'tsup'

export default defineConfig({
    entry: ['src/run.ts'],
    format: ['esm', 'cjs'],
    outDir: 'bin',
    dts: true,
    sourcemap: true,
    external: [
        'fs',
        'path',
        'os',
        'dotenv'
    ],
    clean: true
}) 
