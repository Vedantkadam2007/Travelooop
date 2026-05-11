#!/usr/bin/env python3
"""
Main Flask application for Vercel deployment
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os

# Create Flask app
app = Flask(__name__)

# Configuration
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
CORS(app)

# Routes
@app.route('/')
def index():
    """Serve the main HTML file"""
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    """Serve static files"""
    return send_from_directory('.', path)

@app.route('/api/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': '2024-01-01T00:00:00Z',
        'message': 'Traveloop API is running'
    })

@app.route('/api/test')
def test_endpoint():
    """Test endpoint"""
    return jsonify({
        'message': 'Traveloop API is working',
        'version': '1.0.0'
    })

# Vercel handler
def handler(environ, start_response):
    """Vercel serverless function handler"""
    return app(environ, start_response)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
