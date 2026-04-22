#!/usr/bin/env python3
"""
Backend API Testing for Farley Portfolio
Tests all endpoints including anti-spam features: honeypot and rate limiting
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any
from pathlib import Path

# Load environment variables to get the backend URL
def load_env():
    env_path = Path("/app/frontend/.env")
    env_vars = {}
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith('#') and '=' in line:
                    key, value = line.split('=', 1)
                    env_vars[key] = value
    return env_vars

env_vars = load_env()
BASE_URL = env_vars.get('REACT_APP_BACKEND_URL', 'https://qa-3d-portfolio.preview.emergentagent.com') + "/api"

print(f"🔗 Testing against: {BASE_URL}")

def test_honeypot_feature():
    """Test honeypot anti-spam feature"""
    print("\n=== Testing Honeypot Feature ===")
    
    # Test with honeypot field populated
    honeypot_payload = {
        "name": "Test User",
        "email": "test@example.com",
        "subject": "Test Subject",
        "message": "This is a test message from a bot.",
        "website": "http://spam.com"  # Honeypot field populated
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=honeypot_payload,
            headers={
                "Content-Type": "application/json",
                "X-Forwarded-For": "10.99.99.99"
            },
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            data = response.json()
            # Should return 201 but with email_sent: false
            if data.get("email_sent") == False:
                print("✅ Honeypot: Returns 201 with email_sent=false")
                
                # Check that message field is empty (as per implementation)
                if data.get("message") == "":
                    print("✅ Honeypot: Message field emptied correctly")
                    return True
                else:
                    print(f"❌ Honeypot: Message field not emptied, got: '{data.get('message')}'")
                    return False
            else:
                print(f"❌ Honeypot: email_sent should be false, got: {data.get('email_sent')}")
                return False
        else:
            print(f"❌ Honeypot: Expected 201, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Honeypot test failed with error: {e}")
        return False

def test_rate_limiting():
    """Test rate limiting feature"""
    print("\n=== Testing Rate Limiting ===")
    
    # Use same X-Forwarded-For header for all requests to trigger rate limiting
    headers = {
        "Content-Type": "application/json",
        "X-Forwarded-For": "10.99.99.100"
    }
    
    successful_requests = 0
    rate_limited = False
    spanish_error = False
    
    print("Sending 6 requests in quick succession...")
    
    # Send 6 requests in quick succession
    for i in range(6):
        payload = {
            "name": f"Rate Test User {i+1}",
            "email": f"ratetest{i+1}@example.com",
            "subject": f"Rate Test {i+1}",
            "message": f"This is rate test message number {i+1}."
        }
        
        try:
            response = requests.post(
                f"{BASE_URL}/contact",
                json=payload,
                headers=headers,
                timeout=30
            )
            
            if response.status_code == 201:
                successful_requests += 1
                print(f"  Request {i+1}: ✅ 201 Created")
            elif response.status_code == 429:
                rate_limited = True
                detail = response.json().get("detail", "")
                print(f"  Request {i+1}: 🚫 429 Rate Limited - {detail}")
                
                # Check if the error message is in Spanish as expected
                if "demasiados mensajes" in detail.lower() or "intenta de nuevo" in detail.lower():
                    spanish_error = True
                    print("✅ Rate Limit: Spanish error message confirmed")
                else:
                    print(f"❌ Rate Limit: Error message not in Spanish: '{detail}'")
                break
            else:
                print(f"  Request {i+1}: ❓ {response.status_code} - {response.json()}")
            
            # Small delay between requests
            time.sleep(0.1)
            
        except Exception as e:
            print(f"  Request {i+1}: ❌ Error - {e}")
    
    # Validate rate limiting behavior
    if successful_requests == 5 and rate_limited and spanish_error:
        print("✅ Rate limiting working correctly: 5 requests succeeded, 6th failed with 429 in Spanish")
        return True
    else:
        print(f"❌ Rate limiting failed: {successful_requests} successful, rate_limited={rate_limited}, spanish_error={spanish_error}")
        return False

def test_normal_contact_submission():
    """Test that normal contact submissions still work"""
    print("\n=== Testing Normal Contact Submission ===")
    
    normal_payload = {
        "name": "Normal User",
        "email": "normal@example.com",
        "subject": "Normal Subject",
        "message": "This is a normal message without any spam indicators."
        # No website field
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=normal_payload,
            headers={
                "Content-Type": "application/json",
                "X-Forwarded-For": "10.99.99.200"
            },
            timeout=30
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            data = response.json()
            # Should have all required fields
            required_fields = ["id", "name", "email", "subject", "message", "created_at", "email_sent"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if not missing_fields:
                print("✅ Normal Contact: All required fields present")
                
                # Email sending status (may be true or false depending on SMTP config)
                email_sent = data.get("email_sent")
                if isinstance(email_sent, bool):
                    print("✅ Normal Contact: email_sent is boolean")
                    return True
                else:
                    print(f"❌ Normal Contact: email_sent should be boolean, got {type(email_sent)}: {email_sent}")
                    return False
            else:
                print(f"❌ Normal Contact: Missing fields: {missing_fields}")
                return False
        else:
            print(f"❌ Normal Contact: Expected 201, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Normal contact test failed with error: {e}")
        return False

def test_health_endpoint():
    """Test GET /api/health endpoint"""
    print("\n=== Testing GET /api/health ===")
    
    try:
        response = requests.get(f"{BASE_URL}/health", timeout=10)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get("status") == "ok" and data.get("db") == "connected":
                print("✅ Health endpoint working correctly")
                return True
            else:
                print("❌ Health endpoint returned unexpected data")
                return False
        else:
            print(f"❌ Health endpoint returned status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health endpoint failed with error: {e}")
        return False

def test_stats_ping_endpoint():
    """Test GET /api/stats/ping endpoint - should increment counter"""
    print("\n=== Testing GET /api/stats/ping ===")
    
    try:
        # First call
        response1 = requests.get(f"{BASE_URL}/stats/ping", timeout=10)
        print(f"First call - Status Code: {response1.status_code}")
        print(f"First call - Response: {response1.json()}")
        
        if response1.status_code != 200:
            print(f"❌ First ping call failed with status {response1.status_code}")
            return False
            
        visits1 = response1.json().get("visits")
        if visits1 is None:
            print("❌ First ping call missing 'visits' field")
            return False
            
        # Second call
        time.sleep(0.5)  # Small delay
        response2 = requests.get(f"{BASE_URL}/stats/ping", timeout=10)
        print(f"Second call - Status Code: {response2.status_code}")
        print(f"Second call - Response: {response2.json()}")
        
        if response2.status_code != 200:
            print(f"❌ Second ping call failed with status {response2.status_code}")
            return False
            
        visits2 = response2.json().get("visits")
        if visits2 is None:
            print("❌ Second ping call missing 'visits' field")
            return False
            
        if visits2 > visits1:
            print(f"✅ Stats ping working correctly - visits incremented from {visits1} to {visits2}")
            return True
        else:
            print(f"❌ Stats ping not incrementing - visits stayed at {visits1}")
            return False
            
    except Exception as e:
        print(f"❌ Stats ping endpoint failed with error: {e}")
        return False

def test_contact_post_valid():
    """Test POST /api/contact with valid payload"""
    print("\n=== Testing POST /api/contact (Valid Payload) ===")
    
    valid_payload = {
        "name": "John Doe",
        "email": "john.doe@example.com",
        "subject": "Test Subject",
        "message": "This is a test message for the contact form."
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/contact",
            json=valid_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 201:
            data = response.json()
            required_fields = ["id", "name", "email", "subject", "message", "created_at"]
            
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                print(f"❌ Missing required fields: {missing_fields}")
                return False, None
                
            if (data["name"] == valid_payload["name"] and 
                data["email"] == valid_payload["email"] and
                data["subject"] == valid_payload["subject"] and
                data["message"] == valid_payload["message"]):
                print("✅ POST /api/contact working correctly with valid payload")
                return True, data["id"]
            else:
                print("❌ Response data doesn't match input payload")
                return False, None
        else:
            print(f"❌ POST /api/contact failed with status {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ POST /api/contact failed with error: {e}")
        return False, None

def test_contact_post_validation():
    """Test POST /api/contact validation errors"""
    print("\n=== Testing POST /api/contact (Validation Errors) ===")
    
    test_cases = [
        {
            "name": "Missing name",
            "payload": {"email": "test@example.com", "message": "Test message"},
            "expected_status": 422
        },
        {
            "name": "Missing email", 
            "payload": {"name": "John Doe", "message": "Test message"},
            "expected_status": 422
        },
        {
            "name": "Missing message",
            "payload": {"name": "John Doe", "email": "test@example.com"},
            "expected_status": 422
        },
        {
            "name": "Invalid email",
            "payload": {"name": "John Doe", "email": "invalid-email", "message": "Test message"},
            "expected_status": 422
        },
        {
            "name": "Name too long (>100 chars)",
            "payload": {
                "name": "A" * 101,
                "email": "test@example.com", 
                "message": "Test message"
            },
            "expected_status": 422
        },
        {
            "name": "Message too long (>5000 chars)",
            "payload": {
                "name": "John Doe",
                "email": "test@example.com",
                "message": "A" * 5001
            },
            "expected_status": 422
        }
    ]
    
    all_passed = True
    
    for test_case in test_cases:
        print(f"\nTesting: {test_case['name']}")
        
        try:
            response = requests.post(
                f"{BASE_URL}/contact",
                json=test_case["payload"],
                headers={"Content-Type": "application/json"},
                timeout=10
            )
            
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == test_case["expected_status"]:
                print(f"✅ {test_case['name']} validation working correctly")
            else:
                print(f"❌ {test_case['name']} expected {test_case['expected_status']}, got {response.status_code}")
                all_passed = False
                
        except Exception as e:
            print(f"❌ {test_case['name']} failed with error: {e}")
            all_passed = False
    
    return all_passed

def test_contact_get_list():
    """Test GET /api/contact endpoint"""
    print("\n=== Testing GET /api/contact (List Messages) ===")
    
    try:
        # First, create a test message to ensure we have data
        test_payload = {
            "name": "Test User",
            "email": "testuser@example.com", 
            "subject": "Test List Subject",
            "message": "This message is for testing the list endpoint."
        }
        
        create_response = requests.post(
            f"{BASE_URL}/contact",
            json=test_payload,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        if create_response.status_code != 201:
            print(f"❌ Failed to create test message: {create_response.status_code}")
            return False
            
        created_message = create_response.json()
        print(f"Created test message with ID: {created_message['id']}")
        
        # Test basic list endpoint
        response = requests.get(f"{BASE_URL}/contact", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code != 200:
            print(f"❌ GET /api/contact failed with status {response.status_code}")
            return False
            
        data = response.json()
        print(f"Response structure: {list(data.keys())}")
        
        # Check response structure
        if "total" not in data or "items" not in data:
            print("❌ Response missing 'total' or 'items' fields")
            return False
            
        print(f"Total messages: {data['total']}")
        print(f"Items returned: {len(data['items'])}")
        
        # Check if our created message appears in the list
        message_found = False
        for item in data["items"]:
            if item.get("id") == created_message["id"]:
                message_found = True
                print(f"✅ Created message found in list")
                break
                
        if not message_found:
            print("❌ Created message not found in list")
            return False
            
        # Test pagination
        print("\n--- Testing Pagination ---")
        
        # Test with limit=1, skip=0
        page1_response = requests.get(f"{BASE_URL}/contact?limit=1&skip=0", timeout=10)
        if page1_response.status_code != 200:
            print(f"❌ Pagination test 1 failed: {page1_response.status_code}")
            return False
            
        page1_data = page1_response.json()
        print(f"Page 1 (limit=1, skip=0): {len(page1_data['items'])} items")
        
        # Test with limit=1, skip=1
        page2_response = requests.get(f"{BASE_URL}/contact?limit=1&skip=1", timeout=10)
        if page2_response.status_code != 200:
            print(f"❌ Pagination test 2 failed: {page2_response.status_code}")
            return False
            
        page2_data = page2_response.json()
        print(f"Page 2 (limit=1, skip=1): {len(page2_data['items'])} items")
        
        # Verify pagination works (different items or empty second page)
        if data["total"] > 1:
            if (len(page1_data["items"]) == 1 and 
                (len(page2_data["items"]) == 0 or 
                 page1_data["items"][0]["id"] != page2_data["items"][0]["id"])):
                print("✅ Pagination working correctly")
            else:
                print("❌ Pagination not working as expected")
                return False
        else:
            print("✅ Pagination test passed (only one message exists)")
            
        print("✅ GET /api/contact working correctly")
        return True
        
    except Exception as e:
        print(f"❌ GET /api/contact failed with error: {e}")
        return False

def run_all_tests():
    """Run all backend tests including anti-spam features"""
    print("🚀 Starting Farley Portfolio Backend API Tests (Including Anti-Spam)")
    print(f"Base URL: {BASE_URL}")
    
    results = {}
    
    # Test health endpoint first
    results["health"] = test_health_endpoint()
    
    # Test stats ping endpoint
    results["stats_ping"] = test_stats_ping_endpoint()
    
    # Test normal contact submission (baseline)
    results["normal_contact"] = test_normal_contact_submission()
    
    # Test anti-spam features
    results["honeypot"] = test_honeypot_feature()
    results["rate_limiting"] = test_rate_limiting()
    
    # Test contact POST with valid payload (additional validation)
    results["contact_post_valid"], created_id = test_contact_post_valid()
    
    # Test contact POST validation
    results["contact_post_validation"] = test_contact_post_validation()
    
    # Test contact GET list (regression test)
    results["contact_get_list"] = test_contact_get_list()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST RESULTS SUMMARY")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    # Group results by category
    anti_spam_tests = ["normal_contact", "honeypot", "rate_limiting"]
    core_tests = ["health", "stats_ping", "contact_post_valid", "contact_post_validation", "contact_get_list"]
    
    print("\n🛡️  ANTI-SPAM FEATURES:")
    for test_name in anti_spam_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name:20} {status}")
            if results[test_name]:
                passed += 1
    
    print("\n🔧 CORE FUNCTIONALITY:")
    for test_name in core_tests:
        if test_name in results:
            status = "✅ PASS" if results[test_name] else "❌ FAIL"
            print(f"  {test_name:20} {status}")
            if results[test_name]:
                passed += 1
    
    print(f"\nOverall: {passed}/{total} tests passed")
    
    if passed == total:
        print("🎉 All tests passed!")
        return True
    else:
        print("⚠️  Some tests failed!")
        return False

if __name__ == "__main__":
    success = run_all_tests()
    exit(0 if success else 1)