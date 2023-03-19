# for running cypress inside a docker container
FROM node:16.14.2
WORKDIR /NomadLangCypress
COPY . .
RUN rm -rfv node_modules; rm -rfv ./client/node_modules; rm -rfv ./server/node_modules;
RUN apt-get update
RUN apt-get install -y sudo
RUN sudo apt-get upgrade -y
# install cypress and chrome dependencies
RUN sudo apt-get install -y \
libgtk2.0-0 \
libgtk-3-0 \
libgbm-dev \
libnotify-dev \
libgconf-2-4 \
libnss3 \
libxss1 \
libasound2 \
libxtst6 \
xauth \
xvfb \
psmisc
# install chrome browser
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN sudo apt install -y ./google-chrome-stable_current_amd64.deb
# install npm packages
RUN npm install --verbose
CMD [ "npm", "test" ]
EXPOSE 8080:8080