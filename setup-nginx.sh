#!/bin/bash

# Check if Nginx is installed
if ! command -v nginx &> /dev/null; then
    echo "Nginx is not installed. Installing Nginx..."
    # For macOS using Homebrew
    if command -v brew &> /dev/null; then
        brew install nginx
    else
        echo "Homebrew is not installed. Please install Homebrew first with:"
        echo '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"'
        exit 1
    fi
else
    echo "Nginx is already installed."
fi

# Get the current directory
SITE_DIR="$(pwd)"

# Create a symbolic link to the nginx.conf file
echo "Setting up Nginx configuration..."

# For macOS with Homebrew
if [ -d "/opt/homebrew/etc/nginx/servers" ]; then
    NGINX_CONF_DIR="/opt/homebrew/etc/nginx/servers"
elif [ -d "/usr/local/etc/nginx/servers" ]; then
    NGINX_CONF_DIR="/usr/local/etc/nginx/servers"
else
    echo "Could not find Nginx configuration directory. Creating one..."
    NGINX_CONF_DIR="/opt/homebrew/etc/nginx/servers"
    mkdir -p "$NGINX_CONF_DIR"
fi

# Create the site configuration
cat > "$NGINX_CONF_DIR/slebot.conf" << EOF
server {
    listen 80;
    server_name localhost;
    
    root "$SITE_DIR";
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript image/svg+xml;
    
    # Cache static assets
    location ~* \.(jpg|jpeg|png|webp|gif|ico|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }

    # Main location block
    location / {
        try_files \$uri \$uri/ =404;
    }

    # Error pages
    error_page 404 /404.html;
    error_page 500 502 503 504 /50x.html;
    
    location = /50x.html {
        root /usr/share/nginx/html;
    }
}
EOF

echo "Configuration created at $NGINX_CONF_DIR/slebot.conf"

# Test Nginx configuration
echo "Testing Nginx configuration..."
nginx -t

# If the test is successful, restart Nginx
if [ $? -eq 0 ]; then
    echo "Configuration test successful. Restarting Nginx..."
    
    # For macOS
    if command -v brew &> /dev/null; then
        brew services restart nginx
    else
        sudo nginx -s reload
    fi
    
    echo "Nginx has been configured and restarted."
    echo "Your website should now be accessible at: http://localhost"
else
    echo "Configuration test failed. Please check the error messages above."
fi
