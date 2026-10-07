FROM nginx:alpine

# Copy your HTML file to nginx's default directory
COPY Bot/index.html /usr/share/nginx/html/index.html

# Configure nginx to use Railway's PORT
RUN echo 'server { \
    listen ${PORT}; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
