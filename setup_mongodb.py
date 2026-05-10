#!/usr/bin/env python3
"""
MongoDB Setup Script for Traveloop
This script helps set up MongoDB for user authentication
"""

import os
import sys
from pymongo import MongoClient
from pymongo.server_api import ServerApi

def test_mongodb_connection():
    """Test MongoDB connection and provide setup guidance"""
    
    print("🔍 MongoDB Connection Test for Traveloop")
    print("=" * 50)
    
    # Check if MongoDB URI is set
    mongo_uri = os.getenv('MONGODB_URI')
    
    if not mongo_uri:
        print("❌ MONGODB_URI not found in environment variables")
        print("\n📋 Setup Options:")
        print("1. Local MongoDB:")
        print("   - Install MongoDB: https://www.mongodb.com/try/download/community")
        print("   - Set MONGODB_URI=mongodb://localhost:27017/")
        print("\n2. MongoDB Atlas (Cloud):")
        print("   - Create free account: https://www.mongodb.com/cloud")
        print("   - Create cluster and get connection string")
        print("   - Set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/")
        print("\n3. Quick Local Setup:")
        print("   - Copy .env.example to .env")
        print("   - Edit .env with your MongoDB URI")
        return False
    
    try:
        # Test connection
        print(f"🔄 Testing connection to: {mongo_uri}")
        client = MongoClient(mongo_uri, server_api=ServerApi('1'))
        
        # Send ping to test connection
        client.admin.command('ping')
        print("✅ MongoDB connection successful!")
        
        # Test database operations
        db = client['traveloop_db']
        test_collection = db['test']
        
        # Insert test document
        test_doc = {"test": "connection", "timestamp": "now"}
        result = test_collection.insert_one(test_doc)
        print("✅ Database write test successful!")
        
        # Read test document
        found_doc = test_collection.find_one({"_id": result.inserted_id})
        print("✅ Database read test successful!")
        
        # Clean up test document
        test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Database cleanup successful!")
        
        print("\n🎉 MongoDB is ready for Traveloop!")
        print("\n📊 Your users will be stored in:")
        print(f"   Database: traveloop_db")
        print(f"   Collection: users")
        
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        print("\n🔧 Troubleshooting:")
        
        if "localhost" in mongo_uri:
            print("1. Make sure MongoDB is running:")
            print("   - Windows: Check MongoDB service in Services")
            print("   - Mac/Linux: Run 'sudo systemctl start mongod' or 'brew services start mongodb-community'")
            print("2. Check if MongoDB is installed: 'mongod --version'")
        
        if "mongodb+srv" in mongo_uri:
            print("1. Verify MongoDB Atlas credentials")
            print("2. Check IP whitelist in Atlas settings")
            print("3. Ensure cluster is running")
        
        return False

def create_env_file():
    """Create .env file from template"""
    if os.path.exists('.env'):
        print("⚠️  .env file already exists")
        return False
    
    if os.path.exists('.env.example'):
        with open('.env.example', 'r') as f:
            content = f.read()
        
        with open('.env', 'w') as f:
            f.write(content)
        
        print("✅ Created .env file from .env.example")
        print("📝 Please edit .env with your MongoDB configuration")
        return True
    
    print("❌ .env.example file not found")
    return False

def main():
    if len(sys.argv) > 1:
        if sys.argv[1] == "create-env":
            create_env_file()
        elif sys.argv[1] == "test":
            test_mongodb_connection()
        else:
            print("Usage:")
            print("  python setup_mongodb.py test     - Test MongoDB connection")
            print("  python setup_mongodb.py create-env - Create .env file")
    else:
        print("MongoDB Setup for Traveloop")
        print("=" * 30)
        print("\nCommands:")
        print("  python setup_mongodb.py test     - Test MongoDB connection")
        print("  python setup_mongodb.py create-env - Create .env file")
        print("\nQuick Start:")
        print("1. python setup_mongodb.py create-env")
        print("2. Edit .env with your MongoDB URI")
        print("3. python setup_mongodb.py test")

if __name__ == "__main__":
    main()
