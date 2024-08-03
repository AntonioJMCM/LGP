FROM node:11.14.0-alpine

#install yarn
RUN apk add yarn

#create app folder
RUN mkdir /App
WORKDIR /App

#Copy dependency list
COPY ./package.json .
COPY ./yarn.lock .

#install dependencies
RUN yarn install
RUN npm install nodemon -g

#Copy Common Code
RUN mkdir common
COPY ./services/common/ ./common

#Copy Auth Service Code
RUN mkdir Monitoring
COPY ./services/Monitoring/ ./Monitoring

#Copy environment file to node contect
COPY ./services/Monitoring/.env .

#run service
CMD ["yarn","start-monitoring"]