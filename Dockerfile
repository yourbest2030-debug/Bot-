FROM nginx:alpine

# Copy your HTML
COPY Bot/index.html /usr/share/nginx/html/index.html

# Create nginx config template that uses PORT variable
RUN mkdir -p /etc/nginx/templates
COPY default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
