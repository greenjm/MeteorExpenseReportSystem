# deploy/Dockerfile
# Dockerfile for your app.
# Change "budgeter" in the Dockerfile to your app's name

FROM node:0.10

MAINTAINER Levente Balogh <balogh.levente.hu@gmail.com>

RUN apt-get install -y curl
RUN curl https://install.meteor.com/ | /bin/sh

# Change "budgeter" to your app's name 
ADD . /opt/meteorExpenseReport/app

# Install NPM packages
WORKDIR /opt/meteorExpenseReport/app/programs/server
RUN npm install

# Set environment variables 
WORKDIR /opt/budgeter/app
ENV PORT 80
ENV ROOT_URL http://127.0.0.1

# Expose port 80
EXPOSE 80

# Start the app
CMD node ./main.js