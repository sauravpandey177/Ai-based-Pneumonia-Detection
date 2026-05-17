import os
import numpy as np
from PIL import Image

scans_dir = '../scans'
for file in os.listdir(scans_dir):
    if not file.endswith('.jpg'):
        continue
    path = os.path.join(scans_dir, file)
    img = Image.open(path).convert('RGB').resize((224, 224))
    arr = np.array(img) / 255.0
    mean_val = np.mean(arr)
    std_val = np.std(arr)
    channel_diff = np.mean(np.std(arr, axis=2))
    
    # Check corners (top-left, top-right, bottom-left, bottom-right)
    gray_arr = np.mean(arr, axis=2)
    tl = np.mean(gray_arr[:20, :20])
    tr = np.mean(gray_arr[:20, -20:])
    bl = np.mean(gray_arr[-20:, :20])
    br = np.mean(gray_arr[-20:, -20:])
    corner_mean = (tl + tr + bl + br) / 4.0
    
    # X-rays usually have lungs in the center (brighter than edges)
    center = np.mean(gray_arr[80:-80, 80:-80])
    
    print(f"{file[:8]} - Mean:{mean_val:.2f}, Std:{std_val:.2f}, Corn:{corner_mean:.2f}, Cent:{center:.2f}")
