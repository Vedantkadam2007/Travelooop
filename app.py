from flask import Flask, jsonify, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_files(path):
    return send_from_directory('.', path)

@app.route('/api/health')
def health():
    return jsonify({'status': 'healthy', 'message': 'Traveloop API is running'})

def handler(environ, start_response):
    return app(environ, start_response)
