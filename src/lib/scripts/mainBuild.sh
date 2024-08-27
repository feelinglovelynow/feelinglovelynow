#!/bin/bash
sudo find ace -type d -exec chmod 755 {} \; && # for directories
sudo find ace -type d -exec chmod 666 {} \; && # for files
npm run mainWrite &&
npm run check &&
npx --env-file=.env vite build
