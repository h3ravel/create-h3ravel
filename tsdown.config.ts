import { defineConfig } from 'tsdown'

export default defineConfig({
    entry: ['src/run.ts'],
    format: ['esm'],
    outDir: 'bin',
    dts: true,
    deps: {
        neverBundle: [
            'fs',
            'path',
            'os',
            'dotenv'
        ],
    },
    clean: true
}) 
