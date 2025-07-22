#!/usr/bin/env python3
"""
LotayaAI Backend API Comprehensive Test Suite
Tests all backend endpoints with various scenarios including error handling
"""

import requests
import json
import os
import sys
from typing import Dict, Any
import time

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = "/app/frontend/.env"
    try:
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    except FileNotFoundError:
        print("❌ Frontend .env file not found")
        return None
    return "http://localhost:8001"  # fallback

BASE_URL = get_backend_url()
if not BASE_URL:
    print("❌ Could not determine backend URL")
    sys.exit(1)

print(f"🔗 Testing backend at: {BASE_URL}")

class BackendTester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        
    def log_test(self, test_name: str, success: bool, details: str = ""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        self.test_results.append({
            "test": test_name,
            "success": success,
            "details": details
        })
        
    def test_health_endpoint(self):
        """Test GET /api/health endpoint"""
        print("\n🔍 Testing Health Endpoint...")
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get("status") == "healthy":
                    self.log_test("Health Check", True, f"Status: {data.get('message')}")
                else:
                    self.log_test("Health Check", False, f"Unexpected response: {data}")
            else:
                self.log_test("Health Check", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Health Check", False, f"Connection error: {str(e)}")
            
    def test_models_endpoint(self):
        """Test GET /api/models endpoint"""
        print("\n🔍 Testing Models Endpoint...")
        try:
            response = self.session.get(f"{self.base_url}/api/models", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                
                # Check expected model categories
                expected_keys = ["image_models", "video_models", "effects"]
                missing_keys = [key for key in expected_keys if key not in data]
                
                if not missing_keys:
                    # Verify expected models
                    expected_image_models = ["groq", "xai", "gemini"]
                    expected_video_models = ["runway", "kling", "veo3", "sora", "seedance", "hailuo"]
                    expected_effects = ["ai_hug", "ai_kissing", "french_kiss", "decapitate", "eye_pop"]
                    
                    image_models_ok = all(model in data["image_models"] for model in expected_image_models)
                    video_models_ok = all(model in data["video_models"] for model in expected_video_models)
                    effects_ok = all(effect in data["effects"] for effect in expected_effects)
                    
                    if image_models_ok and video_models_ok and effects_ok:
                        self.log_test("Models Endpoint - Structure", True, "All expected models present")
                    else:
                        self.log_test("Models Endpoint - Structure", False, f"Missing expected models: {data}")
                else:
                    self.log_test("Models Endpoint - Structure", False, f"Missing keys: {missing_keys}")
            else:
                self.log_test("Models Endpoint", False, f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Models Endpoint", False, f"Connection error: {str(e)}")
            
    def test_image_generation_valid(self):
        """Test POST /api/generate/image with valid data"""
        print("\n🔍 Testing Image Generation - Valid Requests...")
        
        test_cases = [
            {
                "name": "GROQ Model",
                "payload": {
                    "prompt": "A beautiful sunset over mountains with vibrant colors",
                    "model": "groq",
                    "style": "realistic",
                    "size": "1024x1024"
                }
            },
            {
                "name": "XAI Model",
                "payload": {
                    "prompt": "Futuristic cityscape with flying cars",
                    "model": "xai",
                    "style": "cyberpunk",
                    "size": "512x512"
                }
            },
            {
                "name": "Gemini Model",
                "payload": {
                    "prompt": "Abstract art with geometric patterns",
                    "model": "gemini"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/generate/image",
                    json=test_case["payload"],
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["success", "message", "model_used", "prompt", "generation_id"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields and data.get("success") is True:
                        self.log_test(f"Image Generation - {test_case['name']}", True, 
                                    f"Model: {data.get('model_used')}, ID: {data.get('generation_id')}")
                    else:
                        self.log_test(f"Image Generation - {test_case['name']}", False, 
                                    f"Missing fields: {missing_fields} or success=False")
                else:
                    self.log_test(f"Image Generation - {test_case['name']}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Image Generation - {test_case['name']}", False, f"Connection error: {str(e)}")
                
    def test_image_generation_invalid(self):
        """Test POST /api/generate/image with invalid data"""
        print("\n🔍 Testing Image Generation - Invalid Requests...")
        
        test_cases = [
            {
                "name": "Missing Prompt",
                "payload": {"model": "groq"},
                "expected_status": 422
            },
            {
                "name": "Invalid Model",
                "payload": {"prompt": "test prompt", "model": "invalid_model"},
                "expected_status": [200, 400, 422]  # Could be handled differently
            },
            {
                "name": "Empty Payload",
                "payload": {},
                "expected_status": 422
            }
        ]
        
        for test_case in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/generate/image",
                    json=test_case["payload"],
                    timeout=10
                )
                
                expected_statuses = test_case["expected_status"]
                if isinstance(expected_statuses, int):
                    expected_statuses = [expected_statuses]
                    
                if response.status_code in expected_statuses:
                    self.log_test(f"Image Generation Error Handling - {test_case['name']}", True, 
                                f"HTTP {response.status_code} as expected")
                else:
                    self.log_test(f"Image Generation Error Handling - {test_case['name']}", False, 
                                f"Expected {expected_statuses}, got {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Image Generation Error Handling - {test_case['name']}", False, 
                            f"Connection error: {str(e)}")
                
    def test_video_generation_valid(self):
        """Test POST /api/generate/video with valid data"""
        print("\n🔍 Testing Video Generation - Valid Requests...")
        
        test_cases = [
            {
                "name": "Runway Model",
                "payload": {
                    "prompt": "A person walking through a bustling city street",
                    "model": "runway",
                    "duration": 15
                }
            },
            {
                "name": "Kling Model",
                "payload": {
                    "prompt": "Ocean waves crashing on a rocky shore",
                    "model": "kling",
                    "duration": 10
                }
            },
            {
                "name": "Sora Model",
                "payload": {
                    "prompt": "A cat playing with a ball of yarn",
                    "model": "sora"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/generate/video",
                    json=test_case["payload"],
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["success", "message", "model_used", "prompt", "generation_id"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields and data.get("success") is True:
                        self.log_test(f"Video Generation - {test_case['name']}", True, 
                                    f"Model: {data.get('model_used')}, ID: {data.get('generation_id')}")
                    else:
                        self.log_test(f"Video Generation - {test_case['name']}", False, 
                                    f"Missing fields: {missing_fields} or success=False")
                else:
                    self.log_test(f"Video Generation - {test_case['name']}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Video Generation - {test_case['name']}", False, f"Connection error: {str(e)}")
                
    def test_text_to_video_valid(self):
        """Test POST /api/convert/text-to-video with valid data"""
        print("\n🔍 Testing Text to Video Conversion - Valid Requests...")
        
        test_cases = [
            {
                "name": "Runway Script Conversion",
                "payload": {
                    "script": "Scene 1: A young entrepreneur sits at a coffee shop, typing on her laptop. She looks determined and focused.",
                    "model": "runway",
                    "style": "cinematic"
                }
            },
            {
                "name": "Kling Script Conversion",
                "payload": {
                    "script": "The camera pans across a beautiful landscape at golden hour, showing rolling hills and a distant mountain range.",
                    "model": "kling"
                }
            }
        ]
        
        for test_case in test_cases:
            try:
                response = self.session.post(
                    f"{self.base_url}/api/convert/text-to-video",
                    json=test_case["payload"],
                    timeout=10
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["success", "message", "script", "model_used", "conversion_id"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields and data.get("success") is True:
                        self.log_test(f"Text to Video - {test_case['name']}", True, 
                                    f"Model: {data.get('model_used')}, ID: {data.get('conversion_id')}")
                    else:
                        self.log_test(f"Text to Video - {test_case['name']}", False, 
                                    f"Missing fields: {missing_fields} or success=False")
                else:
                    self.log_test(f"Text to Video - {test_case['name']}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Text to Video - {test_case['name']}", False, f"Connection error: {str(e)}")
                
    def test_generation_status(self):
        """Test GET /api/generations/{generation_id}"""
        print("\n🔍 Testing Generation Status Endpoint...")
        
        test_ids = ["test_id_123", "temp_id_123", "sample_generation_id"]
        
        for test_id in test_ids:
            try:
                response = self.session.get(f"{self.base_url}/api/generations/{test_id}", timeout=10)
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ["generation_id", "status", "progress"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if not missing_fields:
                        self.log_test(f"Generation Status - {test_id}", True, 
                                    f"Status: {data.get('status')}, Progress: {data.get('progress')}%")
                    else:
                        self.log_test(f"Generation Status - {test_id}", False, 
                                    f"Missing fields: {missing_fields}")
                else:
                    self.log_test(f"Generation Status - {test_id}", False, 
                                f"HTTP {response.status_code}: {response.text}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"Generation Status - {test_id}", False, f"Connection error: {str(e)}")
                
    def test_cors_configuration(self):
        """Test CORS configuration"""
        print("\n🔍 Testing CORS Configuration...")
        
        try:
            # Test preflight request
            response = self.session.options(
                f"{self.base_url}/api/health",
                headers={
                    "Origin": "http://localhost:3000",
                    "Access-Control-Request-Method": "GET",
                    "Access-Control-Request-Headers": "Content-Type"
                },
                timeout=10
            )
            
            cors_headers = {
                "Access-Control-Allow-Origin": response.headers.get("Access-Control-Allow-Origin"),
                "Access-Control-Allow-Methods": response.headers.get("Access-Control-Allow-Methods"),
                "Access-Control-Allow-Headers": response.headers.get("Access-Control-Allow-Headers")
            }
            
            if cors_headers["Access-Control-Allow-Origin"] == "*":
                self.log_test("CORS Configuration", True, "CORS properly configured for all origins")
            else:
                self.log_test("CORS Configuration", False, f"CORS headers: {cors_headers}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("CORS Configuration", False, f"Connection error: {str(e)}")
            
    def test_environment_variables(self):
        """Test that environment variables are loaded"""
        print("\n🔍 Testing Environment Variables...")
        
        required_env_vars = [
            "MONGO_URL",
            "GROQ_API_KEY", 
            "XAI_API_KEY",
            "GEMINI_API_KEY",
            "BLOB_READ_WRITE_TOKEN",
            "STATSIG_SERVER_API_KEY"
        ]
        
        missing_vars = []
        for var in required_env_vars:
            if not os.getenv(var):
                missing_vars.append(var)
                
        if not missing_vars:
            self.log_test("Environment Variables", True, "All required environment variables are set")
        else:
            self.log_test("Environment Variables", False, f"Missing variables: {missing_vars}")
            
    def test_mongodb_connection(self):
        """Test MongoDB connection indirectly through health check"""
        print("\n🔍 Testing MongoDB Connection...")
        
        # Since the backend doesn't expose a direct MongoDB test endpoint,
        # we'll check if the health endpoint works (which requires successful startup)
        try:
            response = self.session.get(f"{self.base_url}/api/health", timeout=10)
            
            if response.status_code == 200:
                self.log_test("MongoDB Connection", True, "Backend started successfully (MongoDB connection likely working)")
            else:
                self.log_test("MongoDB Connection", False, "Backend health check failed")
                
        except requests.exceptions.RequestException as e:
            self.log_test("MongoDB Connection", False, f"Backend not accessible: {str(e)}")
            
    def run_all_tests(self):
        """Run all test suites"""
        print("🚀 Starting LotayaAI Backend API Comprehensive Test Suite")
        print("=" * 60)
        
        # Test basic connectivity first
        self.test_health_endpoint()
        self.test_models_endpoint()
        
        # Test core functionality
        self.test_image_generation_valid()
        self.test_image_generation_invalid()
        self.test_video_generation_valid()
        self.test_text_to_video_valid()
        self.test_generation_status()
        
        # Test configuration
        self.test_cors_configuration()
        self.test_environment_variables()
        self.test_mongodb_connection()
        
        # Print summary
        self.print_summary()
        
    def print_summary(self):
        """Print test summary"""
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result["success"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"✅ Passed: {passed_tests}")
        print(f"❌ Failed: {failed_tests}")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n🔍 FAILED TESTS:")
            for result in self.test_results:
                if not result["success"]:
                    print(f"  ❌ {result['test']}: {result['details']}")
                    
        print("\n" + "=" * 60)
        
        return passed_tests, failed_tests

if __name__ == "__main__":
    tester = BackendTester()
    passed, failed = tester.run_all_tests()
    
    # Exit with appropriate code
    sys.exit(0 if failed == 0 else 1)