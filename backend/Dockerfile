FROM node
WORKDIR /app
COPY package.json /app
COPY --from=shared . ../shared
RUN npm install
COPY . /app
RUN npm run build
CMD [ "node", "./dist/src/index.js" ]
