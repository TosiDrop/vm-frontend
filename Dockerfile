FROM node:16

WORKDIR /app
COPY . .
RUN npm install && npm run build && cp -a build/* /app/public
CMD ["npm", "run", "start-sv"]
