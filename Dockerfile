# Use the official Node.js image as the base image
FROM node:20-alpine AS builder

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY prisma ./prisma
COPY . .
RUN npx prisma generate

# Build the application
RUN npm run build

# Use a lightweight Node.js image for the production stage
FROM node:18-alpine AS runner

# Set the working directory in the container
WORKDIR /app

# Copy built application and node_modules from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Set environment variables for production
ENV NODE_ENV=production
ENV PORT=3000

# Expose the port Next.js will run on
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
