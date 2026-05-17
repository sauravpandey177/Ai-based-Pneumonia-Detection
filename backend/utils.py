# backend/utils.py - Real Grad-CAM + PDF Report Ready
import torch
import torch.nn.functional as F
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2
import base64
import io
import os
from pytorch_grad_cam import GradCAM
from pytorch_grad_cam.utils.model_targets import ClassifierOutputTarget
from pytorch_grad_cam.utils.image import show_cam_on_image
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime

device = torch.device("cpu")

# Load Model
model = models.resnet50(weights=None)
num_features = model.fc.in_features
model.fc = torch.nn.Linear(num_features, 2)

model_path = '../model/pneumonia_model.pth'
if os.path.exists(model_path):
    model.load_state_dict(torch.load(model_path, map_location=device))
    print("[SUCCESS] Model loaded successfully with Real Grad-CAM!")
else:
    print("[ERROR] Model file not found!")

model = model.to(device)
model.eval()

transform = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225])
])

def get_prediction_and_heatmap(image_bytes):
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    original_img = np.array(image.resize((224, 224))) / 255.0
    
    input_tensor = transform(image).unsqueeze(0).to(device)
    
    # Heuristic for non-Xray images
    # 1. Check if it's too colorful (X-rays are grayscale)
    channel_diff = np.mean(np.std(original_img, axis=2))
    if channel_diff > 0.05:
        return "ERROR_NOT_XRAY", 0, None
        
    # 2. Check pixel distributions (X-rays have dark corners and brighter centers)
    gray_img = np.mean(original_img, axis=2)
    mean_val = np.mean(gray_img)
    if mean_val < 0.15 or mean_val > 0.85: # Too dark or too bright (e.g., diagrams, mostly white/black)
        return "ERROR_NOT_XRAY", 0, None
        
    # Calculate corner brightness
    tl = np.mean(gray_img[:20, :20])
    tr = np.mean(gray_img[:20, -20:])
    bl = np.mean(gray_img[-20:, :20])
    br = np.mean(gray_img[-20:, -20:])
    corner_mean = (tl + tr + bl + br) / 4.0
    
    # Calculate center brightness
    center_mean = np.mean(gray_img[80:-80, 80:-80])
    
    # X-rays typically have dark corners (background air) and brighter centers (tissues/bones)
    # Diagrams/Photos often have bright corners or are uniformly lit
    if corner_mean > 0.45: # Corners are too bright (e.g., white document background)
        return "ERROR_NOT_XRAY", 0, None
        
    if corner_mean >= center_mean: # Corners brighter than center
        return "ERROR_NOT_XRAY", 0, None
    
    # Prediction
    with torch.no_grad():
        output = model(input_tensor)
        probs = F.softmax(output[0], dim=0)
        pred_idx = torch.argmax(probs).item()
        confidence = float(probs[pred_idx]) * 100
    
    class_names = ['NORMAL', 'PNEUMONIA']
    label = class_names[pred_idx]
    
    # Real Grad-CAM
    target_layers = [model.layer4[-1]]
    cam = GradCAM(model=model, target_layers=target_layers)
    targets = [ClassifierOutputTarget(pred_idx)]
    grayscale_cam = cam(input_tensor=input_tensor, targets=targets)[0]
    
    visualization = show_cam_on_image(original_img, grayscale_cam, use_rgb=True)
    superimposed = (visualization * 255).astype(np.uint8)
    
    # Convert to base64
    img_pil = Image.fromarray(superimposed)
    buffered = io.BytesIO()
    img_pil.save(buffered, format="PNG")
    heatmap_b64 = base64.b64encode(buffered.getvalue()).decode('utf-8')
    
    return label, round(confidence, 2), heatmap_b64


def generate_image_report(prediction, confidence, heatmap_b64, original_image_bytes, token_id="N/A", patient_name="Unknown", date_time=None):
    """Generate Professional PNG Image Report"""
    from PIL import ImageDraw, ImageFont
    import io
    
    if not date_time:
        date_time = datetime.now().strftime('%d %B, %Y %H:%M')
        
    try:
        font_large = ImageFont.truetype("arial.ttf", 32)
        font_med = ImageFont.truetype("arial.ttf", 22)
        font_bold = ImageFont.truetype("arialbd.ttf", 22)
        font_small = ImageFont.truetype("arial.ttf", 16)
        font_header = ImageFont.truetype("arialbd.ttf", 36)
    except FileNotFoundError:
        # Fallback if arial is not found on OS path
        font_large = font_med = font_bold = font_small = font_header = ImageFont.load_default()

    # Create slate-50 background canvas
    canvas_w, canvas_h = 900, 1150
    img = Image.new('RGB', (canvas_w, canvas_h), color=(248, 250, 252))
    draw = ImageDraw.Draw(img)
    
    # Draw Header (slate-900 background top)
    draw.rectangle([(0,0), (canvas_w, 120)], fill=(15, 23, 42))
    draw.text((canvas_w//2, 40), "Pneumo-AI Clinical Report", font=font_header, anchor="mt", fill=(255,255,255))
    draw.text((canvas_w//2, 85), "Official Diagnostic AI Assessment", font=font_small, anchor="mt", fill=(148, 163, 184))
    
    # Meta Info
    y = 170
    draw.text((60, y), f"Patient Name: {patient_name}", font=font_bold, fill=(15, 23, 42))
    draw.text((60, y+40), f"Token ID: {token_id}", font=font_med, fill=(71, 85, 105))
    draw.text((60, y+75), f"Date & Time: {date_time}", font=font_med, fill=(71, 85, 105))
    
    # Divider
    draw.line([(60, y+140), (840, y+140)], fill=(203, 213, 225), width=2)
    
    # Analysis Result
    y += 180
    color = (225, 29, 72) if prediction == 'PNEUMONIA' else (16, 185, 129)
    draw.text((60, y), "DIAGNOSTIC RESULT:", font=font_bold, fill=(15, 23, 42))
    draw.text((60, y+40), prediction, font=font_large, fill=color)
    
    draw.text((500, y), "CONFIDENCE SCORE:", font=font_bold, fill=(15, 23, 42))
    draw.text((500, y+40), f"{confidence}%", font=font_large, fill=color)
    
    # X-Ray Images
    y += 140
    draw.text((60, y), "X-Ray Deep Learning Visualization:", font=font_bold, fill=(15, 23, 42))
    
    # Paste the original and heatmap images
    heatmap_bytes = base64.b64decode(heatmap_b64)
    hm_img = Image.open(io.BytesIO(heatmap_bytes)).resize((360, 360))
    orig_img = Image.open(io.BytesIO(original_image_bytes)).convert("RGB").resize((360, 360))
    
    img.paste(orig_img, (60, y+50))
    img.paste(hm_img, (480, y+50))
    
    draw.text((240, y+430), "Original Scanned Image", font=font_med, anchor="mt", fill=(100, 116, 139))
    draw.text((660, y+430), "AI Grad-CAM Spatial Map", font=font_med, anchor="mt", fill=(100, 116, 139))
    
    # Footer
    y += 510
    draw.line([(60, y), (840, y)], fill=(203, 213, 225), width=2)
    draw.text((60, y+30), "Authorized System Signature: Pneumo-AI Diagnostic Engine", font=font_bold, fill=(15, 23, 42))
    draw.text((60, y+65), "Disclaimer: This is an AI-generated auxiliary screening report. Please consult a qualified pulmonary doctor for final clinical correlation.", font=font_small, fill=(100, 116, 139))
    
    # Save Image
    os.makedirs('../reports', exist_ok=True)
    filename = f"PneumoAI_Report_{datetime.now().strftime('%Y%m%d_%H%M%S')}.png"
    filepath = os.path.join('../reports', filename)
    img.save(filepath, format="PNG")
    
    return filename
    return filename