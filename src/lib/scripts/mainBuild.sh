#!/bin/bash
sudo find ace -type d -exec chmod 755 {} \; &&
npm run mainWrite &&
npm run check &&
npx --env-file=.env vite build
