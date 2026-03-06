FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY vite.config.ts tsconfig.json index.html ./
COPY src ./src

EXPOSE 5173

CMD ["npm", "run", "dev"]