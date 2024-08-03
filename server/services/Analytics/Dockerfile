FROM alpine:3.9.2

RUN mkdir /Analytics
WORKDIR /Analytics

RUN mkdir ./bin

COPY ./ .

RUN apk add gcc g++

#the following command is merely a placeholder and
#should be replaced with a cmake compilation
RUN g++ -Wall -O3 server.cpp -o /bin/Analytics_Server

CMD ["/bin/Analytics_Server"]