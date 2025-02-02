FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package.json ./apps/api/package.json
COPY apps/client/package.json ./apps/client/package.json

COPY prisma ./prisma

# Install dependencies
RUN npm install
RUN npx prisma generate

CMD sh -c "npm run dev --workspace=apps/api & npm run dev --workspace=apps/client"