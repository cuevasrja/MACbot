#!/bin/bash

# Update npm
npm install -g npm@latest

# Install dependencies
npm install

# Run the bot with nodemon for restarting on file changes
npm run dev
