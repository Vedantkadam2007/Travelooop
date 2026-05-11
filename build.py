#!/usr/bin/env python3
"""
Build script for Python Flask deployment on Vercel
This script overrides any Vite build commands
"""

import sys
import os

def main():
    print("Python Flask app - no build required")
    print("Skipping build step for serverless deployment")
    return 0

if __name__ == "__main__":
    sys.exit(main())
