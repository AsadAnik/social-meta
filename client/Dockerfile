# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for installing dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port that the React development server runs on (default is 3000)
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]


# # Base image for building the React app
# FROM node:16-alpine as build

# # Set the working directory
# WORKDIR /usr/src/app

# # Copy package.json and package-lock.json for dependencies
# COPY package*.json ./

# # Install dependencies
# RUN npm install

# # Copy the rest of the application source code
# COPY . .

# # Build the React application for production
# RUN npm run build

# # Serve the application using Nginx
# FROM nginx:alpine

# # Copy the built React app from the previous stage
# COPY --from=build /usr/src/app/build /usr/share/nginx/html

# # Expose port 80
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]