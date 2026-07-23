# ---------- Stage 1 : Build React App ----------
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json ./

# Using npm install because npm ci fails due to a lockfile/dependency
# resolution mismatch in the current dependency tree.
RUN npm install

COPY . .

RUN npm run build

# ---------- Stage 2 : Serve with Nginx ----------
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]