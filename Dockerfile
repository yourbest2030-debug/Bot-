FROM nginx:alpine

# Copy your HTML file
COPY Bot/index.html /usr/share/nginx/html/index.html

# Nginx defaults to port 80, which is fine
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
