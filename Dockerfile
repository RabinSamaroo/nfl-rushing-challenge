FROM node
ENV NODE_ENV=production
WORKDIR /

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE 3000
CMD ["npm", "start"]