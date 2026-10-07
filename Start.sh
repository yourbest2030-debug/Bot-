#!/bin/sh

# Replace PORT in nginx config with Railway's assigned port
cat > /etc/nginx/conf.d/default.conf <<EOF
server {
    listen ${PORT};
    location / {
        root /usr/share/nginx/html;
        index index.html;
    }
}
EOF

# Start nginx
nginx -g "daemon off;"
