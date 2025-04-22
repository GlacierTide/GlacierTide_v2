from flask import Flask, request, jsonify
import joblib
import os
import sys
import logging
import numpy as np

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Load models with correct absolute paths
base_dir = os.path.dirname(os.path.abspath(__file__))  # D:\PBL-2(3) - Copy\glaciertide\backend
models_dir = os.path.join(base_dir, 'models')  # D:\PBL-2(3) - Copy\glaciertide\backend\models

models = {}
try:
    logger.debug(f"Loading models from: {models_dir}")
    models = {
        'linear': joblib.load(os.path.join(models_dir, 'linear_model.pkl')),
        'decision_tree': joblib.load(os.path.join(models_dir, 'decision_tree_model.pkl')),
        'random_forest': joblib.load(os.path.join(models_dir, 'random_forest_model.pkl')),
        'xgboost': joblib.load(os.path.join(models_dir, 'xgboost_model.pkl'))
    }
    logger.debug("Models loaded successfully")
except Exception as e:
    logger.error(f"Failed to load models: {str(e)}")
    raise

# Placeholder for sea-specific data
def get_sea_data(sea_name):
    current_year = 2025
    base_sea_level = {'Red Sea': 3.2, 'Black Sea': 2.8, 'Arabian Sea': 3.0, 'Caribbean Sea': 2.8}.get(sea_name, 0)
    return [[current_year]], base_sea_level

# Predict function
def predict(sea_name, future_year):
    X, base_sea_level = get_sea_data(sea_name)
    future_year = [[int(future_year)]]
    
    predictions = {}
    for model_name, model in models.items():
        try:
            prediction = model.predict(future_year)[0] + base_sea_level
            # Convert NumPy float32 to standard Python float
            predictions[model_name] = float(prediction)  # Ensure float conversion
        except Exception as e:
            predictions[model_name] = f"Error: {str(e)}"
            logger.error(f"Prediction error for {model_name}: {str(e)}")
    
    return predictions

# API endpoint
@app.route('/predict/<sea_name>/<int:year>', methods=['GET'])
def get_prediction(sea_name, year):
    try:
        logger.debug(f"Received request for sea: {sea_name}, year: {year}")
        result = predict(sea_name, year)
        logger.debug(f"Prediction result: {result}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Endpoint error: {str(e)}")
        return jsonify({'error': 'Failed to process ML prediction', 'details': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)