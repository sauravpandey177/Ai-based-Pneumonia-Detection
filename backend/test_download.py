import urllib.request, json
try:
    res = urllib.request.urlopen('http://127.0.0.1:5000/history')
    data = json.loads(res.read())
    if not data:
        print('No data')
    else:
        id = data[0]['id']
        url = f'http://127.0.0.1:5000/download_history_report/{id}'
        res2 = urllib.request.urlopen(url)
        print(res2.status)
        print(res2.read()[:200])
except Exception as e:
    print(f"ERROR: {e}")
