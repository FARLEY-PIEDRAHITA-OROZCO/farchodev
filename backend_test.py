#!/usr/bin/env python3
"""
Backend API Testing for Farley Portfolio
Tests all 4 endpoints: POST /api/contact, GET /api/contact, GET /api/stats/ping, GET /api/health
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, Any

# Base URL from frontend/.env
BASE_URL = "https://qa-3d-portfolio.preview.emergentagent.com/api"

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
    """Run all backend tests"""
    print("🚀 Starting Farley Portfolio Backend API Tests")
    print(f"Base URL: {BASE_URL}")
    
    results = {}
    
    # Test health endpoint
    results["health"] = test_health_endpoint()
    
    # Test stats ping endpoint
    results["stats_ping"] = test_stats_ping_endpoint()
    
    # Test contact POST with valid payload
    results["contact_post_valid"], created_id = test_contact_post_valid()
    
    # Test contact POST validation
    results["contact_post_validation"] = test_contact_post_validation()
    
    # Test contact GET list
    results["contact_get_list"] = test_contact_get_list()
    
    # Summary
    print("\n" + "="*60)
    print("📊 TEST RESULTS SUMMARY")
    print("="*60)
    
    passed = 0
    total = len(results)
    
    for test_name, result in results.items():
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:25} {status}")
        if result:
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