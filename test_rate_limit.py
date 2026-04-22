#!/usr/bin/env python3
import requests
import time

BASE_URL = "http://localhost:8000/api"
print("=" * 50)
print("RATE LIMITING TEST")
print("Testing 5 requests per hour/IP limit")
print("=" * 50)

headers = {"X-Forwarded-For": "10.99.99.100"}

print("\nSending 6 requests in quick succession...")
for i in range(6):
    payload = {"name": f"RateTest{i+1}", "email": f"ratetest{i+1}@test.com", "message": f"Test {i+1}"}
    r = requests.post(f"{BASE_URL}/contact", json=payload, headers=headers)
    print(f"  Request {i+1}: {r.status_code}", end="")
    if r.status_code == 429:
        print(f" - {r.json().get('detail', '')}")
    else:
        print()
    time.sleep(0.1)

print("\nPASSED: Rate limiter blocks at 6th request" if r.status_code == 429 else "FAILED: Did not block")