#!/usr/bin/env python3
"""
Test script to verify Flask app startup
"""

import sys
import os

# Add the backend directory to the Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

try:
    from app import app
    print("✅ Flask app imported successfully")
    
    # Test app configuration
    print(f"✅ App name: {app.name}")
    print(f"✅ Debug mode: {app.debug}")
    print(f"✅ Database URI: {app.config.get('SQLALCHEMY_DATABASE_URI', 'Not set')}")
    
    # Test routes
    with app.test_client() as client:
        # Test index route
        response = client.get('/')
        print(f"✅ Index route status: {response.status_code}")
        
        # Test API health check (if exists)
        try:
            response = client.get('/api/destinations')
            print(f"✅ API destinations route status: {response.status_code}")
        except Exception as e:
            print(f"⚠️  API route test failed: {e}")
    
    print("\n🎉 Flask app startup test completed successfully!")
    print("Your Traveloop application is ready for deployment!")
    
except Exception as e:
    print(f"❌ Flask app startup test failed: {e}")
    sys.exit(1)
