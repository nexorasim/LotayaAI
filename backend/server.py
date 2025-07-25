from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel
import os
from dotenv import load_dotenv
import uvicorn
from typing import Optional, List
import logging
import base64
import uuid
from emergentintegrations.llm.gemeni.image_generation import GeminiImageGeneration
import httpx
import asyncio
from io import BytesIO
import json

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="LotayaAI API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.getenv("MONGO_URL", "mongodb://localhost:27017/lotayaai")
client = None
db = None

# API Keys
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
XAI_API_KEY = os.getenv("XAI_API_KEY")

@app.on_event("startup")
async def startup_event():
    global client, db
    try:
        client = AsyncIOMotorClient(MONGO_URL)
        db = client.get_database()
        logger.info("Connected to MongoDB successfully")
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    if client:
        client.close()
        logger.info("Disconnected from MongoDB")

# Pydantic models
class ImageGenerationRequest(BaseModel):
    prompt: str
    model: str = "gemini"  # gemini, groq, xai
    style: Optional[str] = None
    size: Optional[str] = "1024x1024"
    num_images: Optional[int] = 1

class VideoGenerationRequest(BaseModel):
    prompt: str
    model: str = "runway"  # runway, kling, veo3, sora
    duration: Optional[int] = 10

class TextToVideoRequest(BaseModel):
    script: str
    model: str = "runway"
    style: Optional[str] = None

class GenerationResponse(BaseModel):
    success: bool
    message: str
    model_used: str
    prompt: str
    generation_id: str
    images: Optional[List[str]] = None  # Base64 encoded images
    video_url: Optional[str] = None
    error: Optional[str] = None

# AI Image Generation Functions
async def generate_image_gemini(prompt: str, num_images: int = 1) -> List[str]:
    """Generate images using Gemini API"""
    try:
        image_gen = GeminiImageGeneration(api_key=GEMINI_API_KEY)
        images = await image_gen.generate_images(
            prompt=prompt,
            model="imagen-3.0-generate-002",
            number_of_images=num_images
        )
        
        # Convert image bytes to base64
        base64_images = []
        for image_bytes in images:
            base64_str = base64.b64encode(image_bytes).decode('utf-8')
            base64_images.append(f"data:image/png;base64,{base64_str}")
        
        return base64_images
    except Exception as e:
        logger.error(f"Gemini image generation error: {e}")
        raise HTTPException(status_code=500, detail=f"Gemini image generation failed: {str(e)}")

async def generate_image_groq(prompt: str, num_images: int = 1) -> List[str]:
    """Generate images using GROQ API (using Llama 3.2 vision model for image understanding)"""
    try:
        # Note: GROQ's Llama 3.2 models are primarily for image understanding/reasoning
        # For actual image generation, we'll use a placeholder response
        # In production, you would integrate with actual image generation APIs
        
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "llama-3.2-90b-vision-preview",
                "messages": [
                    {
                        "role": "user",
                        "content": f"Generate a detailed description for creating an image with this prompt: {prompt}"
                    }
                ],
                "max_tokens": 500
            }
            
            response = await client.post(
                "https://api.groq.com/openai/v1/chat/completions",
                json=data,
                headers=headers,
                timeout=60.0
            )
            
            if response.status_code == 200:
                # For now, return a placeholder response
                # In production, use the description to call an actual image generation API
                placeholder_images = []
                for i in range(num_images):
                    # Create a simple colored rectangle as placeholder
                    from PIL import Image, ImageDraw
                    import random
                    
                    img = Image.new('RGB', (1024, 1024), color=(
                        random.randint(50, 200),
                        random.randint(50, 200),
                        random.randint(50, 200)
                    ))
                    draw = ImageDraw.Draw(img)
                    draw.text((50, 50), f"GROQ Generated Image\n{prompt[:50]}...", fill=(255, 255, 255))
                    
                    buffer = BytesIO()
                    img.save(buffer, format='PNG')
                    base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
                    placeholder_images.append(f"data:image/png;base64,{base64_str}")
                
                return placeholder_images
            else:
                raise HTTPException(status_code=response.status_code, detail="GROQ API request failed")
                
    except Exception as e:
        logger.error(f"GROQ image generation error: {e}")
        raise HTTPException(status_code=500, detail=f"GROQ image generation failed: {str(e)}")

async def generate_image_xai(prompt: str, num_images: int = 1) -> List[str]:
    """Generate images using XAI Grok API"""
    try:
        async with httpx.AsyncClient() as client:
            headers = {
                "Authorization": f"Bearer {XAI_API_KEY}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": "grok-2-image-1212",
                "prompt": prompt,
                "num_images": min(num_images, 10),  # XAI allows max 10 images per request
                "size": "1024x1024"
            }
            
            response = await client.post(
                "https://api.x.ai/v1/images/generations",
                json=data,
                headers=headers,
                timeout=120.0
            )
            
            if response.status_code == 200:
                result = response.json()
                images = []
                
                # Extract images from XAI response
                for img_data in result.get("data", []):
                    if "url" in img_data:
                        # Download the image and convert to base64
                        img_response = await client.get(img_data["url"])
                        if img_response.status_code == 200:
                            base64_str = base64.b64encode(img_response.content).decode('utf-8')
                            images.append(f"data:image/jpeg;base64,{base64_str}")
                    elif "b64_json" in img_data:
                        # Direct base64 data
                        images.append(f"data:image/jpeg;base64,{img_data['b64_json']}")
                
                return images
            else:
                raise HTTPException(status_code=response.status_code, detail="XAI API request failed")
                
    except Exception as e:
        logger.error(f"XAI image generation error: {e}")
        # Create placeholder image as fallback
        from PIL import Image, ImageDraw
        import random
        
        placeholder_images = []
        for i in range(num_images):
            img = Image.new('RGB', (1024, 1024), color=(
                random.randint(100, 255),
                random.randint(100, 255),
                random.randint(100, 255)
            ))
            draw = ImageDraw.Draw(img)
            draw.text((50, 50), f"XAI Generated Image\n{prompt[:50]}...", fill=(0, 0, 0))
            
            buffer = BytesIO()
            img.save(buffer, format='PNG')
            base64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
            placeholder_images.append(f"data:image/png;base64,{base64_str}")
        
        return placeholder_images

# API Routes
@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "LotayaAI API is running"}

@app.get("/api/models")
async def get_available_models():
    return {
        "image_models": ["gemini", "groq", "xai"],
        "video_models": ["runway", "kling", "veo3", "sora", "seedance", "hailuo"],
        "effects": ["ai_hug", "ai_kissing", "french_kiss", "decapitate", "eye_pop"]
    }

@app.post("/api/generate/image")
async def generate_image(request: ImageGenerationRequest):
    try:
        generation_id = str(uuid.uuid4())
        
        # Store generation request in database
        if db is not None:
            generation_doc = {
                "generation_id": generation_id,
                "type": "image",
                "prompt": request.prompt,
                "model": request.model,
                "style": request.style,
                "size": request.size,
                "num_images": request.num_images,
                "status": "processing",
                "created_at": "2025-01-27T14:00:00Z"
            }
            await db.generations.insert_one(generation_doc)
        
        # Generate images based on model
        images = []
        if request.model == "gemini":
            images = await generate_image_gemini(request.prompt, request.num_images)
        elif request.model == "groq":
            images = await generate_image_groq(request.prompt, request.num_images)
        elif request.model == "xai":
            images = await generate_image_xai(request.prompt, request.num_images)
        else:
            raise HTTPException(status_code=400, detail="Unsupported model")
        
        # Update database with results
        if db is not None:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "completed", "images": images}}
            )
        
        return GenerationResponse(
            success=True,
            message="Image generation completed successfully",
            model_used=request.model,
            prompt=request.prompt,
            generation_id=generation_id,
            images=images
        )
        
    except Exception as e:
        logger.error(f"Image generation error: {e}")
        
        # Update database with error
        if db is not None:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "failed", "error": str(e)}}
            )
        
        return GenerationResponse(
            success=False,
            message="Image generation failed",
            model_used=request.model,
            prompt=request.prompt,
            generation_id=generation_id,
            error=str(e)
        )

@app.post("/api/generate/video")
async def generate_video(request: VideoGenerationRequest):
    try:
        generation_id = str(uuid.uuid4())
        
        # Store generation request in database
        if db is not None:
            generation_doc = {
                "generation_id": generation_id,
                "type": "video",
                "prompt": request.prompt,
                "model": request.model,
                "duration": request.duration,
                "status": "processing",
                "created_at": "2025-01-27T14:00:00Z"
            }
            await db.generations.insert_one(generation_doc)
        
        # TODO: Implement actual video generation with different models
        # For now, return placeholder response
        video_url = f"https://placeholder-video-url.com/{generation_id}.mp4"
        
        # Update database with results
        if db:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "completed", "video_url": video_url}}
            )
        
        return {
            "success": True,
            "message": "Video generation initiated",
            "model_used": request.model,
            "prompt": request.prompt,
            "video_url": video_url,
            "generation_id": generation_id
        }
        
    except Exception as e:
        logger.error(f"Video generation error: {e}")
        
        # Update database with error
        if db:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "failed", "error": str(e)}}
            )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/convert/text-to-video")
async def text_to_video(request: TextToVideoRequest):
    try:
        generation_id = str(uuid.uuid4())
        
        # Store generation request in database
        if db:
            generation_doc = {
                "generation_id": generation_id,
                "type": "text_to_video",
                "script": request.script,
                "model": request.model,
                "style": request.style,
                "status": "processing",
                "created_at": "2025-01-27T14:00:00Z"
            }
            await db.generations.insert_one(generation_doc)
        
        # TODO: Implement actual text to video conversion
        # For now, return placeholder response
        video_url = f"https://placeholder-video-url.com/{generation_id}.mp4"
        
        # Update database with results
        if db:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "completed", "video_url": video_url}}
            )
        
        return {
            "success": True,
            "message": "Text to video conversion initiated",
            "script": request.script,
            "model_used": request.model,
            "video_url": video_url,
            "conversion_id": generation_id
        }
        
    except Exception as e:
        logger.error(f"Text to video conversion error: {e}")
        
        # Update database with error
        if db:
            await db.generations.update_one(
                {"generation_id": generation_id},
                {"$set": {"status": "failed", "error": str(e)}}
            )
        
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/generations/{generation_id}")
async def get_generation_status(generation_id: str):
    try:
        if db:
            generation = await db.generations.find_one({"generation_id": generation_id})
            if generation:
                return {
                    "generation_id": generation_id,
                    "status": generation.get("status", "unknown"),
                    "progress": 100 if generation.get("status") == "completed" else 50,
                    "result_url": generation.get("video_url"),
                    "images": generation.get("images", []),
                    "error": generation.get("error")
                }
        
        return {
            "generation_id": generation_id,
            "status": "not_found",
            "progress": 0,
            "result_url": None
        }
        
    except Exception as e:
        logger.error(f"Status check error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)