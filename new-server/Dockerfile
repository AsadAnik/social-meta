# Node-JS for Application..
FROM node:16-alpine

# Set the Working Directory..
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install application dependencies
RUN npm install

# Copy the server directory to the container
COPY ./server /usr/src/app/server

# Expose the port on which the Node.js application will run
EXPOSE 8080

# Start the application from the server folder
CMD ["node", "server/server.js"]
