# Use Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install bcrypt

# Copy the prisma directory and other necessary files
COPY . .
COPY prisma ./prisma

# Generate Prisma Client
RUN ls -la /app/prisma
RUN npx prisma generate --schema=/app/prisma/schema.prisma

# Build the application
RUN npm run build

# Use a lightweight image for production
FROM node:20-alpine AS runner
WORKDIR /app

# Copy built files and node_modules
COPY --from=builder /app ./

# Expose the port and start the application
EXPOSE 3000
CMD ["npm", "run", "start"]
