FROM node

# install 
RUN apt update

WORKDIR /book-shop-web/admin/

ADD . /book-shop-web/admin/

ENTRYPOINT [ "npm", "start" ]

# export port
EXPOSE 3001