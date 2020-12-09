FROM node:latest AS BUILD

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# copy package.json and install dependencies
COPY package.json package-lock.json /usr/src/app/
RUN npm install

# copy the app and build it
COPY . /usr/src/app
RUN npm run versions-script
RUN npm run build:timeseries:prod
RUN npm run build:trajectories:prod -- --base-href=/trajectories/

FROM nginx:alpine
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=BUILD /usr/src/app/dist/apps/helgoland /usr/share/nginx/html/timeseries
COPY --from=BUILD /usr/src/app/dist/apps/helgoland-trajectories /usr/share/nginx/html/trajectories
# the container can be started like this: docker run -p 80:80 -e PORT=80 helgoland
CMD sed -i -e 's/$PORT/'"$PORT"'/g' /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'