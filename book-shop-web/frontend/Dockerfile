FROM node

# install 
RUN apt update

WORKDIR /book-shop-web/front-end/

ADD . /book-shop-web/front-end/

ENTRYPOINT [ "npm", "start" ]

# export port
EXPOSE 3000