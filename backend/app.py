# backend/app.py - Professional Version with PDF Report
from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
from utils import get_prediction_and_heatmap, generate_image_report
import os
import json
import uuid
from datetime import datetime
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ROOT_DIR = os.path.dirname(BASE_DIR)
SCANS_DIR = os.path.join(ROOT_DIR, 'scans')
DB_PATH = os.path.join(ROOT_DIR, 'database.json')

app = Flask(__name__)
CORS(app)

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    try:
        image_bytes = file.read()
        label, confidence, heatmap_b64 = get_prediction_and_heatmap(image_bytes)
        
        if label == "ERROR_NOT_XRAY":
            return jsonify({'error': 'please upload lung xray to diagnose'}), 400
        
        # Save to history
        scan_id = str(uuid.uuid4())
        filename = f"{scan_id}.jpg"
        filepath = os.path.join(SCANS_DIR, filename)
        os.makedirs(SCANS_DIR, exist_ok=True)
        with open(filepath, 'wb') as f:
            f.write(image_bytes)
            
        patient_name = request.form.get('patient_name', 'Unknown')
        token_no = request.form.get('token_no', f"TKN-{scan_id[:4].upper()}")
        
        record = {
            'id': scan_id,
            'token_no': token_no,
            'patient_name': patient_name,
            'prediction': label,
            'confidence': confidence,
            'heatmap': heatmap_b64,
            'image_url': f"/scans/{filename}",
            'timestamp': datetime.now().isoformat()
        }
        
        try:
            with open(DB_PATH, 'r') as db_file:
                db_data = json.load(db_file)
        except (FileNotFoundError, json.JSONDecodeError):
            db_data = []
            
        db_data.insert(0, record) # Insert at beginning
        
        with open(DB_PATH, 'w') as db_file:
            json.dump(db_data, db_file)
        
        return jsonify({
            'prediction': label,
            'confidence': confidence,
            'heatmap': heatmap_b64,
            'id': scan_id
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/download_report', methods=['POST'])
def download_report():
    try:
        prediction = request.form.get('prediction')
        confidence = request.form.get('confidence')
        heatmap_b64 = request.form.get('heatmap')
        original_image_bytes = request.files['file'].read() if 'file' in request.files else None
        
        if not original_image_bytes:
            # If file not sent again, return error
            return jsonify({'error': 'Original image required for report'}), 400
        
        filename = generate_image_report(prediction, confidence, heatmap_b64, original_image_bytes)
        
        return send_file(
            os.path.join('..', 'reports', filename),
            as_attachment=True,
            download_name=filename
        )
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/download_history_report/<scan_id>', methods=['GET'])
def download_history_report(scan_id):
    try:
        with open(DB_PATH, 'r') as db_file:
            db_data = json.load(db_file)
            
        record = next((item for item in db_data if item['id'] == scan_id), None)
        if not record:
            return jsonify({'error': 'Scan record not found'}), 404
            
        token_no = record.get('token_no', 'N/A')
        patient_name = record.get('patient_name', 'Unknown')
        prediction = record.get('prediction', 'Unknown')
        confidence = record.get('confidence', 0)
        heatmap_b64 = record.get('heatmap', '')
        timestamp = record.get('timestamp')
        
        # Format timestamp
        if timestamp:
            try:
               dt = datetime.fromisoformat(timestamp)
               date_time = dt.strftime('%d %B, %Y %H:%M')
            except:
               date_time = timestamp
        else:
            date_time = datetime.now().strftime('%d %B, %Y %H:%M')

        # Read original image bytes locally
        image_url = record.get('image_url', '')
        filename = image_url.split('/scans/')[-1] if image_url else f"{scan_id}.jpg"
        filepath = os.path.join(SCANS_DIR, filename)
        if not os.path.exists(filepath):
             return jsonify({'error': f'Original image not found for this scan record. Looked at {filepath}'}), 404
             
        with open(filepath, 'rb') as f:
            original_image_bytes = f.read()

        filename_img = generate_image_report(prediction, confidence, heatmap_b64, original_image_bytes, token_no, patient_name, date_time)
        return send_file(
            os.path.join('..', 'reports', filename_img),
            as_attachment=True,
            download_name=filename_img
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/history', methods=['GET'])
def get_history():
    try:
        with open(DB_PATH, 'r') as db_file:
            db_data = json.load(db_file)
        return jsonify(db_data)
    except (FileNotFoundError, json.JSONDecodeError):
        return jsonify([])

@app.route('/scans/<path:filename>')
def serve_scan(filename):
    return send_from_directory(SCANS_DIR, filename)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        'status': 'ok',
        'model': 'ResNet50 with Real Grad-CAM',
        'features': 'Prediction + Heatmap + PDF Report'
    })

if __name__ == '__main__':
    print("[INFO] PneumoAI Backend Server Started")
    print("[INFO] Features: Real Grad-CAM + Professional PDF Report")
    app.run(host='0.0.0.0', port=5000, debug=False)