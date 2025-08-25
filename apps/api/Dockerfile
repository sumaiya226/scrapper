FROM node:20-alpine
WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml* yarn.lock* package-lock.json* ./
RUN if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i; \
    elif [ -f yarn.lock ]; then yarn; else npm i; fi
COPY . .
RUN npm i -g prisma && npx prisma generate || true
EXPOSE 4000
CMD [ "npm", "run", "dev" ]
