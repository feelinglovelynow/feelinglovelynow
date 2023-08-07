#!/bin/bash
pnpm ts-node ./src/lib/scripts/gitBranchValidate.ts main &&
pnpm mainWrite &&
pnpm check &&
pnpm vite build &&
pnpm wrangler deploy
