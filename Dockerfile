FROM node:14-slim
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app

EXPOSE 3306

EXPOSE 5000
CMD ["npm","run","start"]
