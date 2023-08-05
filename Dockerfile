FROM node:18-bookworm-slim

# Set working directory
WORKDIR /app

# Copy .env and project_runner.sh
COPY .env project_runner.sh ./

# Copy package.json for the docker container (without most of the devDependencies)
COPY docker-package.json package.json

# Run the bash script for building and starting the bot
ENTRYPOINT [ "/bin/bash", "project_runner.sh" ]
