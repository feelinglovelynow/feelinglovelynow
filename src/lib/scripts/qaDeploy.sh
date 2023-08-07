#!/bin/bash
pnpm ts-node ./src/lib/scripts/gitBranchValidate.ts qa &&
pnpm qaWrite &&
pnpm check &&
pnpm vite build &&
pnpm wrangler deploy --env qa
