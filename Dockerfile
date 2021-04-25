FROM node:latest
ENV NODE_ENV=production
ENV PORT=3000
ENV DB_NAME=prod
ENV TABLE_NAME=players
# This info should be stored in a secret manager or CI/CD system
ENV DB_HOST=34.68.135.75
ENV DB_USER=root
ENV DB_PASS=password
###
WORKDIR /

COPY package*.json ./
RUN npm i

COPY . .

EXPOSE ${PORT}
CMD ["npm", "start"]