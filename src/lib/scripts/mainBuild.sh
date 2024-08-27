#!/bin/bash
npm run mainWrite &&
npm run check &&
npx --env-file=.env vite build
