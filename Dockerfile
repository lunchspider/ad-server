FROM node:18.1.0
WORKDIR /app
COPY package.json /app/package.json
COPY tsconfig.json /app/tsconfig.json
COPY yarn.lock /app/yarn.lock
RUN ["yarn", "install"]

COPY prisma/schema.prisma /app/prisma/schema.prisma
COPY src /app/src
COPY .env /app/.env

RUN ["npx", "prisma", "generate"]
RUN ["yarn", "build"]
EXPOSE  3000
CMD ["yarn" , "start"]

