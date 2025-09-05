#!/bin/sh
set -e

CONFIG_DIR="/app/dist/config"
DEFAULT_CONFIG_DIR="/app/default-config"


init_configs() {
    # Check if config directory is empty or doesn't have required files
    if [ ! -f "$CONFIG_DIR/services.yaml" ] || [ ! -f "$CONFIG_DIR/config.yaml" ]; then
        echo "📋 First run detected! Initializing configuration files..."
        
        # Copy default configs from template directory
        if [ ! -f "$CONFIG_DIR/services.yaml" ] && [ -f "$DEFAULT_CONFIG_DIR/services.yaml" ]; then
            cp "$DEFAULT_CONFIG_DIR/services.yaml" "$CONFIG_DIR/services.yaml"
            echo "✅ Created services.yaml with example services"
        fi
        
        if [ ! -f "$CONFIG_DIR/config.yaml" ] && [ -f "$DEFAULT_CONFIG_DIR/config.yaml" ]; then
            cp "$DEFAULT_CONFIG_DIR/config.yaml" "$CONFIG_DIR/config.yaml"
            echo "✅ Created config.yaml with default settings"
        fi
        
        echo "📁 Configuration files initialized in mounted volume"
        echo "📝 Edit these files to customize your dashboard"
    else
        echo "✅ Using existing configuration files from mounted volume"
    fi
}

# Initialize configs
init_configs

# Handle user/permissions
if [ "$(id -u)" = "0" ]; then
    # Running as root, switch to node user
    echo "🔄 Switching to node user..."
    chown -R node:node "$CONFIG_DIR"
    exec su-exec node "$@"
else
    # Already running as non-root
    exec "$@"
fi