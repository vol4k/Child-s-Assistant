FROM node:18
WORKDIR /build/client
COPY package*.json ./
RUN npm install
RUN mkdir -p node_modules/.cache && chmod -R 777 node_modules/.cache
COPY --chown=node:node . .
USER node
EXPOSE 3000
CMD ["npm", "run", "start"]
