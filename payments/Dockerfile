FROM node:alpine

WORKDIR /app
COPY package.json .
# avoid loading big data only used for development
RUN npm install --only=prod 

COPY . .

CMD ["npm", "start"]

# docker build -t pkoooo/auth .
# docker push pkoooo/auth