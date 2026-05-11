import sys
import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

# Create Flask app for Vercel
app = Flask(__name__)

# Configure app
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'your-secret-key-here')
CORS(app)

# Routes
@app.route('/')
def index():
    return send_from_directory('../', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('../', path)

@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy', 
        'timestamp': '2024-01-01T00:00:00Z',
        'message': 'Traveloop API is running'
    })

@app.route('/api/test')
def test_endpoint():
    return jsonify({
        'message': 'Traveloop API is working',
        'version': '1.0.0'
    })

# Vercel handler
def handler(environ, start_response):
    return app(environ, start_response)
