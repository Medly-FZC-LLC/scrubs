FROM nginx:alpine

# Set working directory
WORKDIR /usr/share/nginx/html

# Copy nginx configuration first
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy static website files
COPY css/ ./css/
COPY js/ ./js/
COPY images/ ./images/
COPY *.html ./
COPY *.png ./
COPY *.webp ./

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
