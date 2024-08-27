#!/bin/bash

# Set permissions for directories
sudo find /var/www/html/feelinglovelynow/ace -type d -exec chmod 755 {} \; && \

# Set permissions for files
sudo find /var/www/html/feelinglovelynow/ace -type f -exec chmod 666 {} \; && \

# Run npm scripts and build
npm run mainWrite && \
npm run check && \
npx --env-file=.env vite build
