#!/bin/sh
#
# This script changes the port in the nginx configuration.
#
set -e
#
if [ -z "${PORT}" ]; then
   echo "ENV PORT not set. Using default: '80'"
   PORT=80
fi

echo "adjust PORT in nginx conf"
sed --in-place "s/PORT/$PORT/g" /etc/nginx/conf.d/default.conf

echo "adjust BASE_HREF ${BASE_HREF} in nginx conf"
sed -i -e  "s|BASE_HREF|$BASE_HREF|g" /etc/nginx/conf.d/default.conf

# sed -i -e 's|<script src="assets/env.js">|<script src="'${BASE_HREF}'assets/env.js">|g' /usr/share/nginx/html/index.html
sed -i -e 's|<base href="/"|<base href="'${BASE_HREF}'"|g' /usr/share/nginx/html/index.html

# envsubst < /usr/share/nginx/html/assets/env.template.js > /usr/share/nginx/html/assets/env.js