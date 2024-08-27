#!/bin/bash

# Set permissions for files
sudo chmod 666 /var/www/feelinglovelynow/html/feelinglovelynow/ace/aol.txt &&
sudo chmod 666 /var/www/feelinglovelynow/html/feelinglovelynow/ace/schemas/details.json &&

# Run npm scripts and build
npm run mainWrite && \
npm run check && \
npx --env-file=.env vite build
