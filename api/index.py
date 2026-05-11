import sys
import os
from flask import Flask, request, jsonify

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

# Import the Flask app
from app import app

# Vercel serverless function handler
def handler(environ, start_response):
    # Create a new Flask app instance for serverless
    with app.app_context():
        return app(environ, start_response)
