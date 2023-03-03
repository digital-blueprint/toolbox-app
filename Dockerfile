FROM node:14-alpine as node
RUN apk add --no-cache git
ADD . /build
WORKDIR /build
RUN yarn install && APP_ENV=production_test yarn run build

FROM httpd:2.4
COPY --from=node /build/dist /usr/local/apache2/htdocs

# docker run --rm httpd:2.4 cat /usr/local/apache2/conf/httpd.conf > docker/httpd.conf
# then we used "AllowOverride All" instead of "AllowOverride None"
COPY docker/httpd.conf /usr/local/apache2/conf/httpd.conf

