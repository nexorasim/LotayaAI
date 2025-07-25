#!/usr/bin/env python3
"""
LotayaAI Backend API Comprehensive Test Suite - AI Image Generation Focus
Tests AI Image Generation functionality with different models, parameters, and error handling
"""

import requests
import json
import os
import sys
from typing import Dict, Any
import time
import base64
import re

# Load environment variables
from dotenv import load_dotenv
load_dotenv("/app/backend/.env")  # Load backend .env specifically

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
            
    def test_ai_image_generation_comprehensive(self):
        """Comprehensive AI Image Generation Testing - Focus on specific requirements"""
        print("\n🎨 Testing AI Image Generation - Comprehensive Suite...")
        
        # Test Case 1: Generate image with Gemini model
        print("\n🔍 Test Case 1: Gemini Model - Beautiful sunset over mountains")
        try:
            payload = {
                "prompt": "A beautiful sunset over mountains",
                "model": "gemini",
                "style": "realistic",
                "size": "1024x1024",
                "num_images": 1
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120  # Longer timeout for actual AI generation
            )
            
            if response.status_code == 200:
                data = response.json()
                
                # Verify response structure
                required_fields = ["success", "message", "model_used", "prompt", "generation_id", "images"]
                missing_fields = [field for field in required_fields if field not in data]
                
                if not missing_fields and data.get("success") is True:
                    # Verify base64 images are returned
                    images = data.get("images", [])
                    if images and len(images) > 0:
                        # Check if image is base64 encoded
                        first_image = images[0]
                        if first_image.startswith("data:image/") and "base64," in first_image:
                            # Extract base64 part and validate
                            base64_part = first_image.split("base64,")[1]
                            try:
                                base64.b64decode(base64_part)
                                self.log_test("AI Image Generation - Gemini Model", True, 
                                            f"Generated {len(images)} base64 image(s), ID: {data.get('generation_id')}")
                            except Exception as e:
                                self.log_test("AI Image Generation - Gemini Model", False, 
                                            f"Invalid base64 image data: {str(e)}")
                        else:
                            self.log_test("AI Image Generation - Gemini Model", False, 
                                        f"Image not in expected base64 format: {first_image[:100]}...")
                    else:
                        self.log_test("AI Image Generation - Gemini Model", False, 
                                    "No images returned in response")
                else:
                    self.log_test("AI Image Generation - Gemini Model", False, 
                                f"Missing fields: {missing_fields} or success=False")
            else:
                self.log_test("AI Image Generation - Gemini Model", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - Gemini Model", False, f"Connection error: {str(e)}")
        
        # Test Case 2: Generate image with XAI model
        print("\n🔍 Test Case 2: XAI Model - Futuristic city skyline")
        try:
            payload = {
                "prompt": "A futuristic city skyline",
                "model": "xai",
                "style": "cyberpunk",
                "size": "1024x1024",
                "num_images": 1
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("images"):
                    images = data.get("images", [])
                    if images and images[0].startswith("data:image/"):
                        self.log_test("AI Image Generation - XAI Model", True, 
                                    f"Generated {len(images)} base64 image(s), ID: {data.get('generation_id')}")
                    else:
                        self.log_test("AI Image Generation - XAI Model", False, 
                                    "Images not in expected format")
                else:
                    self.log_test("AI Image Generation - XAI Model", False, 
                                f"Generation failed or no images: {data}")
            else:
                self.log_test("AI Image Generation - XAI Model", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - XAI Model", False, f"Connection error: {str(e)}")
        
        # Test Case 3: Generate image with GROQ model
        print("\n🔍 Test Case 3: GROQ Model - Cute cat playing with a ball")
        try:
            payload = {
                "prompt": "A cute cat playing with a ball",
                "model": "groq",
                "style": "cartoon",
                "size": "512x512",
                "num_images": 1
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("images"):
                    images = data.get("images", [])
                    if images and images[0].startswith("data:image/"):
                        self.log_test("AI Image Generation - GROQ Model", True, 
                                    f"Generated {len(images)} base64 image(s), ID: {data.get('generation_id')}")
                    else:
                        self.log_test("AI Image Generation - GROQ Model", False, 
                                    "Images not in expected format")
                else:
                    self.log_test("AI Image Generation - GROQ Model", False, 
                                f"Generation failed or no images: {data}")
            else:
                self.log_test("AI Image Generation - GROQ Model", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - GROQ Model", False, f"Connection error: {str(e)}")
        
        # Test Case 4: Multiple images generation
        print("\n🔍 Test Case 4: Multiple Images Generation (num_images: 2)")
        try:
            payload = {
                "prompt": "Abstract geometric patterns in vibrant colors",
                "model": "gemini",
                "num_images": 2,
                "size": "1024x1024"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("images"):
                    images = data.get("images", [])
                    if len(images) == 2:
                        all_valid = all(img.startswith("data:image/") for img in images)
                        if all_valid:
                            self.log_test("AI Image Generation - Multiple Images", True, 
                                        f"Generated {len(images)} base64 images as requested")
                        else:
                            self.log_test("AI Image Generation - Multiple Images", False, 
                                        "Not all images in valid base64 format")
                    else:
                        self.log_test("AI Image Generation - Multiple Images", False, 
                                    f"Expected 2 images, got {len(images)}")
                else:
                    self.log_test("AI Image Generation - Multiple Images", False, 
                                f"Generation failed: {data}")
            else:
                self.log_test("AI Image Generation - Multiple Images", False, 
                            f"HTTP {response.status_code}: {response.text}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - Multiple Images", False, f"Connection error: {str(e)}")
        
        # Test Case 5: Different sizes and styles
        print("\n🔍 Test Case 5: Different Sizes and Styles")
        test_variations = [
            {"size": "512x512", "style": "photorealistic", "model": "xai"},
            {"size": "1024x1024", "style": "artistic", "model": "groq"},
            {"size": "768x768", "style": "minimalist", "model": "gemini"}
        ]
        
        for i, variation in enumerate(test_variations):
            try:
                payload = {
                    "prompt": f"A serene landscape with {variation['style']} style",
                    "model": variation["model"],
                    "style": variation["style"],
                    "size": variation["size"],
                    "num_images": 1
                }
                
                response = self.session.post(
                    f"{self.base_url}/api/generate/image",
                    json=payload,
                    timeout=120
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if data.get("success") and data.get("images"):
                        self.log_test(f"AI Image Generation - Size/Style Variation {i+1}", True, 
                                    f"Model: {variation['model']}, Size: {variation['size']}, Style: {variation['style']}")
                    else:
                        self.log_test(f"AI Image Generation - Size/Style Variation {i+1}", False, 
                                    f"Generation failed: {data}")
                else:
                    self.log_test(f"AI Image Generation - Size/Style Variation {i+1}", False, 
                                f"HTTP {response.status_code}")
                    
            except requests.exceptions.RequestException as e:
                self.log_test(f"AI Image Generation - Size/Style Variation {i+1}", False, f"Connection error: {str(e)}")
    
    def test_ai_image_generation_error_handling(self):
        """Test AI Image Generation Error Handling"""
        print("\n🚨 Testing AI Image Generation - Error Handling...")
        
        # Test Case 6: Empty prompt
        print("\n🔍 Test Case 6: Error Handling - Empty Prompt")
        try:
            payload = {
                "prompt": "",
                "model": "gemini"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=30
            )
            
            # Should return error for empty prompt
            if response.status_code in [400, 422]:
                self.log_test("AI Image Generation - Empty Prompt Error", True, 
                            f"Properly rejected empty prompt with HTTP {response.status_code}")
            elif response.status_code == 200:
                data = response.json()
                if not data.get("success"):
                    self.log_test("AI Image Generation - Empty Prompt Error", True, 
                                "Properly handled empty prompt with success=false")
                else:
                    self.log_test("AI Image Generation - Empty Prompt Error", False, 
                                "Should not succeed with empty prompt")
            else:
                self.log_test("AI Image Generation - Empty Prompt Error", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - Empty Prompt Error", False, f"Connection error: {str(e)}")
        
        # Test Case 7: Invalid model
        print("\n🔍 Test Case 7: Error Handling - Invalid Model")
        try:
            payload = {
                "prompt": "A beautiful landscape",
                "model": "invalid_model_name"
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=30
            )
            
            if response.status_code in [400, 422]:
                self.log_test("AI Image Generation - Invalid Model Error", True, 
                            f"Properly rejected invalid model with HTTP {response.status_code}")
            elif response.status_code == 200:
                data = response.json()
                if not data.get("success"):
                    self.log_test("AI Image Generation - Invalid Model Error", True, 
                                "Properly handled invalid model with success=false")
                else:
                    self.log_test("AI Image Generation - Invalid Model Error", False, 
                                "Should not succeed with invalid model")
            else:
                self.log_test("AI Image Generation - Invalid Model Error", False, 
                            f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("AI Image Generation - Invalid Model Error", False, f"Connection error: {str(e)}")
    
    def test_database_integration(self):
        """Test Database Integration for Generation Records"""
        print("\n🗄️ Testing Database Integration...")
        
        # Generate an image and get the generation_id
        print("\n🔍 Testing Database Storage of Generation Records")
        try:
            payload = {
                "prompt": "Database integration test image",
                "model": "gemini",
                "num_images": 1
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("generation_id"):
                    generation_id = data.get("generation_id")
                    
                    # Test the status endpoint with this generation_id
                    time.sleep(2)  # Give database time to update
                    
                    status_response = self.session.get(
                        f"{self.base_url}/api/generations/{generation_id}",
                        timeout=30
                    )
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        
                        # Check if the generation record exists and has expected fields
                        expected_fields = ["generation_id", "status", "progress"]
                        missing_fields = [field for field in expected_fields if field not in status_data]
                        
                        if not missing_fields:
                            # Check if the status indicates completion or processing
                            status = status_data.get("status")
                            if status in ["completed", "processing", "failed"]:
                                self.log_test("Database Integration - Generation Storage", True, 
                                            f"Generation record stored and retrieved, Status: {status}")
                            else:
                                self.log_test("Database Integration - Generation Storage", False, 
                                            f"Unexpected status: {status}")
                        else:
                            self.log_test("Database Integration - Generation Storage", False, 
                                        f"Missing fields in status response: {missing_fields}")
                    else:
                        self.log_test("Database Integration - Generation Storage", False, 
                                    f"Status endpoint failed: HTTP {status_response.status_code}")
                else:
                    self.log_test("Database Integration - Generation Storage", False, 
                                "Image generation failed or no generation_id returned")
            else:
                self.log_test("Database Integration - Generation Storage", False, 
                            f"Image generation request failed: HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Database Integration - Generation Storage", False, f"Connection error: {str(e)}")
    
    def test_generation_status_endpoint(self):
        """Test /api/generations/{id} endpoint comprehensively"""
        print("\n📊 Testing Generation Status Endpoint...")
        
        # Test with a real generation ID (from previous test)
        print("\n🔍 Testing Status Endpoint with Real Generation")
        try:
            # First create a generation
            payload = {
                "prompt": "Status endpoint test image",
                "model": "groq",
                "num_images": 1
            }
            
            response = self.session.post(
                f"{self.base_url}/api/generate/image",
                json=payload,
                timeout=120
            )
            
            if response.status_code == 200:
                data = response.json()
                if data.get("generation_id"):
                    generation_id = data.get("generation_id")
                    
                    # Test status endpoint
                    time.sleep(1)  # Brief wait
                    status_response = self.session.get(
                        f"{self.base_url}/api/generations/{generation_id}",
                        timeout=30
                    )
                    
                    if status_response.status_code == 200:
                        status_data = status_response.json()
                        
                        # Verify response structure
                        required_fields = ["generation_id", "status", "progress"]
                        missing_fields = [field for field in required_fields if field not in status_data]
                        
                        if not missing_fields:
                            status = status_data.get("status")
                            progress = status_data.get("progress")
                            
                            # Check if images are included for completed generations
                            if status == "completed" and "images" in status_data:
                                images = status_data.get("images", [])
                                if images:
                                    self.log_test("Generation Status - Real ID", True, 
                                                f"Status: {status}, Progress: {progress}%, Images: {len(images)}")
                                else:
                                    self.log_test("Generation Status - Real ID", True, 
                                                f"Status: {status}, Progress: {progress}% (no images)")
                            else:
                                self.log_test("Generation Status - Real ID", True, 
                                            f"Status: {status}, Progress: {progress}%")
                        else:
                            self.log_test("Generation Status - Real ID", False, 
                                        f"Missing required fields: {missing_fields}")
                    else:
                        self.log_test("Generation Status - Real ID", False, 
                                    f"Status endpoint failed: HTTP {status_response.status_code}")
                else:
                    self.log_test("Generation Status - Real ID", False, 
                                "No generation_id returned from image generation")
            else:
                self.log_test("Generation Status - Real ID", False, 
                            f"Image generation failed: HTTP {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Generation Status - Real ID", False, f"Connection error: {str(e)}")
        
        # Test with non-existent ID
        print("\n🔍 Testing Status Endpoint with Non-existent ID")
        try:
            fake_id = "non_existent_generation_id_12345"
            response = self.session.get(f"{self.base_url}/api/generations/{fake_id}", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                status = data.get("status")
                
                # Should return not_found or similar status
                if status in ["not_found", "unknown"]:
                    self.log_test("Generation Status - Non-existent ID", True, 
                                f"Properly handled non-existent ID with status: {status}")
                else:
                    self.log_test("Generation Status - Non-existent ID", False, 
                                f"Unexpected status for non-existent ID: {status}")
            else:
                # 404 would also be acceptable
                if response.status_code == 404:
                    self.log_test("Generation Status - Non-existent ID", True, 
                                "Properly returned 404 for non-existent ID")
                else:
                    self.log_test("Generation Status - Non-existent ID", False, 
                                f"Unexpected status code: {response.status_code}")
                
        except requests.exceptions.RequestException as e:
            self.log_test("Generation Status - Non-existent ID", False, f"Connection error: {str(e)}")
                
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
            
            if cors_headers["Access-Control-Allow-Origin"] in ["*", "http://localhost:3000"]:
                self.log_test("CORS Configuration", True, "CORS properly configured")
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
        """Run all test suites with focus on AI Image Generation"""
        print("🚀 Starting LotayaAI Backend API - AI Image Generation Test Suite")
        print("=" * 60)
        
        # Test basic connectivity first
        self.test_health_endpoint()
        self.test_models_endpoint()
        
        # Focus on AI Image Generation functionality
        self.test_ai_image_generation_comprehensive()
        self.test_ai_image_generation_error_handling()
        self.test_database_integration()
        self.test_generation_status_endpoint()
        
        # Test other core functionality
        self.test_video_generation_valid()
        self.test_text_to_video_valid()
        
        # Test configuration
        self.test_cors_configuration()
        self.test_environment_variables()
        self.test_mongodb_connection()
        
        # Print summary
        return self.print_summary()
        
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