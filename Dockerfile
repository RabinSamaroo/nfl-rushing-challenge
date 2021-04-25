FROM node:latest
WORKDIR /

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE ${PORT}
CMD ["npm", "start"]