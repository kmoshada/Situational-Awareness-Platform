#!/bin/bash

# Get the directory where the script is located (Project Root)
PROJECT_ROOT="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$PROJECT_ROOT"

# Activate Conda Environment
echo "Activating Conda environment 'TF'..."
source ~/.bashrc
eval "$(conda shell.bash hook)"
conda activate TF

# Check if activation worked
if [[ "$CONDA_DEFAULT_ENV" != "TF" ]]; then
    echo "Error: Failed to activate Conda environment 'TF'."
    echo "Please ensure you have created the environment."
    exit 1
fi

# Install Dependencies
echo "Installing/Updating Dependencies..."
pip install -r requirements.txt

# Check/Download Spacy Model
echo "Checking/Downloading Spacy Model..."
if python -c "import spacy; spacy.load('en_core_web_sm')" >/dev/null 2>&1; then
    echo "Spacy model 'en_core_web_sm' is already installed."
else
    echo "Spacy model 'en_core_web_sm' not found. Downloading..."
    python -m spacy download en_core_web_sm
fi

# Run Uvicorn from the project root
echo "Starting Backend Server..."
echo "Command: uvicorn backend.app.main:app --reload --port 8000"
uvicorn backend.app.main:app --reload --port 8000
