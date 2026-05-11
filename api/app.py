import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import the Flask app
from backend.app import app

# Vercel expects a lambda function handler
def handler(environ, start_response):
    return app(environ, start_response)

# Also export the app directly for Vercel
lambda_handler = handler
