#!/bin/sh

# InsightOps Docker Entrypoint Script
# This script handles environment variable injection and service startup

set -e

echo "Starting InsightOps Dashboard..."

# Function to inject environment variables into built files
inject_env_vars() {
    echo "Injecting environment variables..."
    
    # Find all JS files in the dist directory
    find /usr/share/nginx/html -name "*.js" -exec sed -i \
        -e "s|VUE_APP_MOCK_API_PLACEHOLDER|${VUE_APP_USE_MOCK_DATA:-true}|g" \
        -e "s|VUE_APP_HELIX_API_URL_PLACEHOLDER|${VUE_APP_HELIX_API_URL:-}|g" \
        -e "s|VUE_APP_HELIX_API_KEY_PLACEHOLDER|${VUE_APP_HELIX_API_KEY:-}|g" \
        -e "s|VUE_APP_SWIFT_API_URL_PLACEHOLDER|${VUE_APP_SWIFT_API_URL:-}|g" \
        -e "s|VUE_APP_SWIFT_API_KEY_PLACEHOLDER|${VUE_APP_SWIFT_API_KEY:-}|g" \
        -e "s|VUE_APP_ML_BACKEND_URL_PLACEHOLDER|${VUE_APP_ML_BACKEND_URL:-http://localhost:8000}|g" \
        -e "s|VUE_APP_ML_API_KEY_PLACEHOLDER|${VUE_APP_ML_API_KEY:-}|g" \
        -e "s|VUE_APP_AZURE_OPENAI_ENDPOINT_PLACEHOLDER|${VUE_APP_AZURE_OPENAI_ENDPOINT:-}|g" \
        -e "s|VUE_APP_AZURE_OPENAI_KEY_PLACEHOLDER|${VUE_APP_AZURE_OPENAI_KEY:-}|g" \
        -e "s|VUE_APP_OPENAI_API_KEY_PLACEHOLDER|${VUE_APP_OPENAI_API_KEY:-}|g" \
        {} \;
    
    echo "Environment variables injected successfully"
}

# Function to validate required environment variables
validate_env_vars() {
    echo "Validating environment configuration..."
    
    # Log current configuration (without sensitive data)
    echo "Configuration:"
    echo "- Mock Data Mode: ${VUE_APP_USE_MOCK_DATA:-true}"
    echo "- Helix API URL: ${VUE_APP_HELIX_API_URL:-'not configured'}"
    echo "- Swift API URL: ${VUE_APP_SWIFT_API_URL:-'not configured'}"
    echo "- ML Backend URL: ${VUE_APP_ML_BACKEND_URL:-http://localhost:8000}"
    echo "- Azure OpenAI Endpoint: ${VUE_APP_AZURE_OPENAI_ENDPOINT:-'not configured'}"
    
    # Warn about missing API keys in production
    if [ "${VUE_APP_USE_MOCK_DATA:-true}" = "false" ]; then
        echo "Production mode detected - checking API configuration..."
        
        if [ -z "$VUE_APP_HELIX_API_KEY" ] && [ -z "$VUE_APP_SWIFT_API_KEY" ]; then
            echo "WARNING: No API keys configured for production mode!"
        fi
        
        if [ -z "$VUE_APP_AZURE_OPENAI_KEY" ] && [ -z "$VUE_APP_OPENAI_API_KEY" ]; then
            echo "WARNING: No AI API keys configured - AI features will be disabled"
        fi
    fi
    
    echo "Environment validation completed"
}

# Function to setup logging
setup_logging() {
    echo "Setting up logging..."
    
    # Create log directories if they don't exist
    mkdir -p /var/log/nginx
    
    # Set up log rotation (basic)
    if [ ! -f /var/log/nginx/access.log ]; then
        touch /var/log/nginx/access.log
    fi
    
    if [ ! -f /var/log/nginx/error.log ]; then
        touch /var/log/nginx/error.log
    fi
    
    echo "Logging setup completed"
}

# Function to perform health checks
health_check() {
    echo "Performing startup health checks..."
    
    # Check if nginx config is valid
    nginx -t
    
    # Check if required files exist
    if [ ! -f "/usr/share/nginx/html/index.html" ]; then
        echo "ERROR: index.html not found!"
        exit 1
    fi
    
    echo "Health checks passed"
}

# Function to display startup banner
display_banner() {
    cat << 'EOF'
    
 ___           _       _     _    ___           
|_ _|_ __  ___(_) __ _| |__ | |_ / _ \ _ __  ___ 
 | || '_ \/ __| |/ _` | '_ \| __| | | | '_ \/ __|
 | || | | \__ \ | (_| | | | | |_| |_| | |_) \__ \
|___|_| |_|___/_|\__, |_| |_|\__|\___/| .__/|___/
                 |___/                |_|        
                                                 
InsightOps Enhanced Dashboard
Version: 2.0.0
Environment: Production Ready

EOF
}

# Main execution
main() {
    display_banner
    
    # Setup logging
    setup_logging
    
    # Validate environment
    validate_env_vars
    
    # Inject environment variables (if needed)
    if [ "${INJECT_ENV_VARS:-false}" = "true" ]; then
        inject_env_vars
    fi
    
    # Health checks
    health_check
    
    echo "Starting nginx server..."
    echo "Dashboard will be available at http://localhost:8080"
    echo "Enhanced dashboard available at http://localhost:8080/enhanced"
    
    # Execute the main command
    exec "$@"
}

# Run main function
main "$@"
