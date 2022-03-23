FROM node:16

WORKDIR /app
COPY . .
RUN npm run build
CMD ["npm", "run", "start-sv"]
