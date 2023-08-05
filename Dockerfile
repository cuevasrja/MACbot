FROM node:18-bookworm-slim

# Set working directory
WORKDIR /app

# Copy package.json, .env and project_runner.sh
COPY package.json .env project_runner.sh ./

# Copy src folder
COPY src/ src/

# Run the bash script for building and starting the bot
ENTRYPOINT [ "/bin/bash", "project_runner.sh" ]
