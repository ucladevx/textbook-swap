FROM node:latest

COPY package.json .
RUN npm install
COPY . .

CMD ["node", "app.js"]