#!/usr/bin/env python3
import requests

BASE_URL = "http://localhost:8000/api"
print("=" * 50)
print("PAGINATION TEST")
print("=" * 50)

# Test pagination
r = requests.get(f"{BASE_URL}/contact?limit=2&skip=0")
data = r.json()
print(f"Total messages: {data['total']}")
print(f"Page 1 (limit=2, skip=0): {len(data['items'])} items")

r2 = requests.get(f"{BASE_URL}/contact?limit=2&skip=2")
data2 = r2.json()
print(f"Page 2 (limit=2, skip=2): {len(data2['items'])} items")

# Check email_sent field in response
r3 = requests.get(f"{BASE_URL}/contact?limit=1")
data3 = r3.json()
if data3['items']:
    item = data3['items'][0]
    has_email_sent = 'email_sent' in item
    print(f"email_sent field present: {has_email_sent}")
    print(f"email_sent value: {item.get('email_sent')}")
    print("PASSED: All fields present" if has_email_sent else "FAILED: Missing email_sent")
else:
    print("No items to test")