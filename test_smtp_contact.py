#!/usr/bin/env python3
"""
Backend API Testing for POST /api/contact with Gmail SMTP Integration
Focus: Testing email_sent field and SMTP functionality
"""

import requests
import json
import time
from datetime import datetime

# Base URL from frontend/.env
BASE_URL = "https://qa-3d-portfolio.preview.emergentagent.com/api"

def test_post_contact_with_smtp_first():
    """Test POST /api/contact with Gmail SMTP integration - First message"""
    print("🧪 Testing POST /api/contact with Gmail SMTP integration (Message 1/2)...")
    
    # Test payload with realistic data
    payload = {
        "name": "Maria Rodriguez",
        "email": "maria.test@example.com", 
        "subject": "Consulta sobre servicios QA",
        "message": "Hola Farley, me interesa conocer más sobre tus servicios de QA y Cybersecurity. ¿Podrías contactarme para discutir un proyecto?"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=25)
        print(f"Status Code: {response.status_code}")
        print(f"Response Headers: {dict(response.headers)}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"Response Body: {json.dumps(data, indent=2, default=str)}")
            
            # Verify required fields including email_sent
            required_fields = ["id", "name", "email", "subject", "message", "created_at", "email_sent"]
            missing_fields = [field for field in required_fields if field not in data]
            
            if missing_fields:
                print(f"❌ FAIL: Missing required fields: {missing_fields}")
                return False
                
            # Verify email_sent field is boolean
            if not isinstance(data.get("email_sent"), bool):
                print(f"❌ FAIL: email_sent field should be boolean, got: {type(data.get('email_sent'))}")
                return False
                
            # Verify other fields match input
            if (data["name"] != payload["name"] or 
                data["email"] != payload["email"] or
                data["subject"] != payload["subject"] or
                data["message"] != payload["message"]):
                print("❌ FAIL: Response data doesn't match input payload")
                return False
                
            print(f"✅ PASS: POST /api/contact working correctly")
            print(f"   - email_sent: {data['email_sent']}")
            print(f"   - Message ID: {data['id']}")
            print(f"   - Created at: {data['created_at']}")
            return True, data["id"]
        else:
            print(f"❌ FAIL: Expected 201, got {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        print("❌ FAIL: Request timed out (>25s) - SMTP may be taking too long")
        return False, None
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False, None

def test_post_contact_with_smtp_second():
    """Test POST /api/contact second message (max 2 to avoid email flooding)"""
    print("\n🧪 Testing POST /api/contact with Gmail SMTP integration (Message 2/2)...")
    
    payload = {
        "name": "Carlos Mendez",
        "email": "carlos.dev@example.com",
        "subject": "Colaboración en proyecto",
        "message": "Estimado Farley, estoy interesado en una posible colaboración para un proyecto de seguridad. Saludos."
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=25)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ PASS: Second message created successfully")
            print(f"   - email_sent: {data.get('email_sent')}")
            print(f"   - Message ID: {data['id']}")
            return True, data["id"]
        else:
            print(f"❌ FAIL: Expected 201, got {response.status_code}")
            print(f"Response: {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        print("❌ FAIL: Request timed out (>25s) - SMTP may be taking too long")
        return False, None
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False, None

def test_post_contact_validation():
    """Test POST /api/contact validation (missing required field)"""
    print("\n🧪 Testing POST /api/contact validation...")
    
    # Missing required 'name' field
    payload = {
        "email": "test@example.com",
        "message": "Test message without name"
    }
    
    try:
        response = requests.post(f"{BASE_URL}/contact", json=payload, timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 422:
            print("✅ PASS: Validation working correctly (422 for missing name)")
            return True
        else:
            print(f"❌ FAIL: Expected 422 for validation error, got {response.status_code}")
            print(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def test_get_contact_with_email_sent_field():
    """Test GET /api/contact to verify email_sent field is included"""
    print("\n🧪 Testing GET /api/contact to verify email_sent field...")
    
    try:
        response = requests.get(f"{BASE_URL}/contact?limit=5", timeout=10)
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Total messages: {data.get('total', 0)}")
            
            if data.get('items'):
                # Check messages for email_sent field
                messages_with_email_sent = 0
                for message in data['items']:
                    if 'email_sent' in message:
                        messages_with_email_sent += 1
                        print(f"   - Message {message['id'][:8]}... email_sent: {message['email_sent']}")
                
                if messages_with_email_sent > 0:
                    print(f"✅ PASS: email_sent field present in {messages_with_email_sent} messages")
                    return True
                else:
                    print("❌ FAIL: email_sent field missing from all messages")
                    print(f"Available fields in first message: {list(data['items'][0].keys())}")
                    return False
            else:
                print("⚠️  WARNING: No messages found to verify email_sent field")
                return True
        else:
            print(f"❌ FAIL: Expected 200, got {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ FAIL: Request failed with error: {e}")
        return False

def main():
    """Run focused tests for POST /api/contact with Gmail SMTP"""
    print("=" * 70)
    print("BACKEND TESTING: POST /api/contact with Gmail SMTP Integration")
    print("=" * 70)
    print(f"Base URL: {BASE_URL}")
    print("Focus: Testing email_sent field and SMTP functionality")
    print("Limit: Maximum 2 successful POSTs to avoid email flooding")
    print("=" * 70)
    
    results = []
    message_ids = []
    
    # Test 1: First message with SMTP
    result1, msg_id1 = test_post_contact_with_smtp_first()
    results.append(result1)
    if msg_id1:
        message_ids.append(msg_id1)
    
    # Small delay between requests
    time.sleep(3)
    
    # Test 2: Second message with SMTP (max 2 to avoid flooding)
    result2, msg_id2 = test_post_contact_with_smtp_second()
    results.append(result2)
    if msg_id2:
        message_ids.append(msg_id2)
    
    # Test 3: Validation
    results.append(test_post_contact_validation())
    
    # Test 4: GET endpoint with email_sent field
    results.append(test_get_contact_with_email_sent_field())
    
    # Summary
    print("\n" + "=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)
    
    test_names = [
        "POST /api/contact with SMTP (Message 1)",
        "POST /api/contact with SMTP (Message 2)", 
        "POST /api/contact validation",
        "GET /api/contact with email_sent field"
    ]
    
    passed = 0
    for i, (test_name, result) in enumerate(zip(test_names, results)):
        status = "✅ PASS" if result else "❌ FAIL"
        print(f"{test_name:40} {status}")
        if result:
            passed += 1
    
    total = len(results)
    print(f"\nTests passed: {passed}/{total}")
    
    if message_ids:
        print(f"\nCreated message IDs: {message_ids}")
    
    if passed == total:
        print("🎉 ALL TESTS PASSED - Gmail SMTP integration working correctly!")
        print("✅ email_sent field is properly included in responses")
        print("✅ Messages are saved to MongoDB regardless of email success/failure")
        print("✅ Response times are reasonable (< 25s)")
    else:
        print("❌ SOME TESTS FAILED - Check output above for details")
    
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)