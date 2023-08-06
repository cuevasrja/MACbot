#!/bin/bash

NODE_ENV=$(cat .env | grep NODE_ENV | awk -F '=' '{print $2}')

# Check if the NODE_ENV is production or development
if [ "$NODE_ENV" == "production" ]; then
    # Rename the docker-package.json to package.json
    mv docker-json/docker-package.json package.json
else
    # Rename the docker-package.dev.json to package.json
    mv docker-json/docker-package.dev.json package.json
fi

# Install dependencies
npm install

# Run the bot based on the NODE_ENV
if [ "$NODE_ENV" == "production" ]; then
    npm run start
else
    npm run dev
fi
