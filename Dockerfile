FROM node:16.18-bullseye-slim

WORKDIR /usr/src/app

ADD package.json package-lock.json ./

ENV NEXT_TELEMETRY_DISABLED 1

# Install OS dependencies, install Node packages, and purge OS packages in one step
# to reduce the size of the resulting image.
RUN apt-get update && \
    apt-get install -y python3-minimal build-essential git && \
    # npm install --legacy-peer-deps && \
    yarn install && \
    apt-get clean && \
    apt-get purge -y python3-minimal build-essential git && \
    apt-get -y autoremove

COPY . /usr/src/app

# RUN npm run postinstall
RUN npm run build

EXPOSE 3000

CMD ["npm", "run","start"]
