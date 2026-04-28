import { defineConfig } from 'orval';

export default defineConfig({
  'pack-it-project': {
    input: 'http://localhost:8080/api-json', 
    output: {
      target: './src/api/generated/pack-it.ts',
      client: 'axios',
      mode: 'tags-split',
    },
    hooks: {
      afterAllFilesWrite: 'npx prettier --write src/api/generated',
    },
  },
  
  'pack-it-zod': {
    input: 'http://localhost:8080/api-json',
    output: {
      client: 'zod',
      target: './src/api/generated/pack-it.zod.ts',
    },
  },
});