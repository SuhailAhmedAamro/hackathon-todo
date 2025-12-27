"""Setup script for Evolution Todo - Phase 1"""

from setuptools import setup, find_packages

setup(
    name="evolution-todo-cli",
    version="1.0.0",
    description="Console CLI todo application - Phase 1 of Evolution of Todo",
    author="Evolution Todo Team",
    python_requires=">=3.11",
    packages=find_packages(),
    install_requires=[
        "typer[all]>=0.9.0",
        "sqlalchemy>=2.0.23",
        "rich>=13.7.0",
        "python-dateutil>=2.8.2",
    ],
    entry_points={
        "console_scripts": [
            "todo=src.main:main",
        ],
    },
    classifiers=[
        "Development Status :: 4 - Beta",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)
