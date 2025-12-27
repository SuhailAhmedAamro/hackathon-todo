#!/usr/bin/env python3
"""
Convenient runner script for Evolution Todo CLI

This allows running the CLI without needing to install the package:
    python run.py add "My task"
    python run.py list
    python run.py --help
"""

import sys
from src.main import main

if __name__ == "__main__":
    sys.exit(main())
