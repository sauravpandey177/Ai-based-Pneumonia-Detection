import json
with open('../database.json', 'r') as f:
    text = f.read().strip()
if text.startswith('{'):
    text = '[' + text + ']'
with open('../database.json', 'w') as f:
    f.write(text)
