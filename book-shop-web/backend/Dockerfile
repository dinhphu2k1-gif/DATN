FROM node

# install 
RUN apt update

WORKDIR /book-shop-web/back-end/

ADD . /book-shop-web/back-end/

ENTRYPOINT [ "npm", "start" ]

# export port
EXPOSE 10000