FROM node:18

WORKDIR /usr/src/app

ADD package.json package-lock.json ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN npm install --legacy-peer-deps 

COPY . /usr/src/app

#COPY healthcheck.js /usr/src/app/healthcheck.js

RUN npm run build

EXPOSE 3000

CMD ["npm", "run","start"]
