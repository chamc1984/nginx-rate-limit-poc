FROM nginx:alpine AS build

ENV ECHO_NGINX_MODULE_VERSION 0.63

RUN NGINX_VERSION=`nginx -v 2>&1 | cut -d '/' -f 2` \
  && cd /tmp \
  && wget http://nginx.org/download/nginx-${NGINX_VERSION}.tar.gz -O nginx-${NGINX_VERSION}.tar.gz \
  && wget https://github.com/openresty/echo-nginx-module/archive/refs/tags/v${ECHO_NGINX_MODULE_VERSION}.tar.gz -O echo-nginx-module-${ECHO_NGINX_MODULE_VERSION}.tar.gz \
  && apk add --no-cache --virtual dependency gcc libc-dev make openssl-dev pcre-dev zlib-dev linux-headers \
  && tar zxf nginx-${NGINX_VERSION}.tar.gz \
  && tar zxf echo-nginx-module-${ECHO_NGINX_MODULE_VERSION}.tar.gz  \
  && cd nginx-${NGINX_VERSION} \
  && CONFARGS=$(nginx -V 2>&1 | sed -n -e 's/^configure arguments: //p') \
  && sh -c "./configure --with-compat ${CONFARGS} --add-dynamic-module=../echo-nginx-module-${ECHO_NGINX_MODULE_VERSION}" \
  && make modules \
  && apk del dependency \
  && rm -rf /var/cache/apk/*


FROM nginx:alpine

COPY --from=build /tmp/nginx-${NGINX_VERSION}/objs/ngx_http_echo_module.so /etc/nginx/modules
RUN sed -i '1s/^/load_module \/etc\/nginx\/modules\/ngx_http_echo_module.so;\n/' /etc/nginx/nginx.conf
