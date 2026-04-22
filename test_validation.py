#!/usr/bin/env python3
import requests
import time

BASE_URL = "http://localhost:8000/api"
print("=" * 50)
print("VALIDATION TEST")
print("=" * 50)
print()

tests = [
    ("Missing name", {"email": "test@test.com", "message": "test"}, 422),
    ("Missing email", {"name": "Test"}, 422),
    ("Missing message", {"name": "Test", "email": "test@test.com"}, 422),
    ("Invalid email", {"name": "Test", "email": "not-email", "message": "test"}, 422),
    ("Name too long", {"name": "A" * 101, "email": "test@test.com", "message": "test"}, 422),
    ("Message too long", {"name": "Test", "email": "test@test.com", "message": "A" * 5001}, 422),
]

results = []
for name, payload, expected in tests:
    r = requests.post(f"{BASE_URL}/contact", json=payload)
    ok = r.status_code == expected
    results.append(ok)
    status = "PASS" if ok else "FAIL"
    print(f"  {name:20} -> {r.status_code} (exp {expected}) [{status}]")

print()
passed = sum(results)
print(f"Validation tests: {passed}/{len(tests)} passed")
print("ALL PASSED" if passed == len(tests) else "SOME FAILED")