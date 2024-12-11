# Start from the base Node.js image
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Prisma schema and source code
COPY prisma ./prisma
COPY . .

# Generate Prisma client and build the app
RUN npx prisma generate --schema=./prisma/schema.prisma
RUN npm run build

# Use lightweight Node.js image for production
FROM node:20-alpine AS runner

# Set working directory
WORKDIR /app

# Copy build output and dependencies
COPY --from=builder /app ./

# Expose the port and start the app
EXPOSE 3000
CMD ["npm", "start"]
