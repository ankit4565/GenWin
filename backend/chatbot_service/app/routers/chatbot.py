import os
import google.generativeai as genai
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from dotenv import load_dotenv
from auth_services.app.dependencies.auth import get_current_user

# Resolve and load .env file from the backend root directory
current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, "..", "..", ".."))
dotenv_path = os.path.join(backend_dir, ".env")
load_dotenv(dotenv_path)

router = APIRouter(
    prefix="/chatbot",
    tags=["Chatbot"]
)

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    response: str
    success: bool

@router.get("/status")
async def get_status():
    api_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "ok",
        "service": "chatbot_service",
        "gemini_configured": bool(api_key)
    }

@router.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(payload: ChatRequest, current_user = Depends(get_current_user)):
    """
    Interact with the Gemini AI model, configured with system instructions 
    relevant to Bhopal.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is not configured. Please add GEMINI_API_KEY to your backend/.env file."
        )

    try:
        # Configure the library with the API key
        genai.configure(api_key=api_key)

        # Define system instruction for Bhopal Smart City assistant
        system_instruction = (
            "You are a helpful, friendly, and expert AI assistant named GENWIN for the Bhopal Smart City platform "
            "dedicated to Bhopal (Madhya Pradesh, India).\n"
            "Your main goals are:\n"
            "1. Assist citizens with information regarding Bhopal (local landmarks like Upper Lake/Bhojtal, "
            "Lower Lake, Van Vihar National Park, Taj-ul-Masajid, Shaurya Smarak, and local culture/history).\n"
            "2. Help citizens with queries about municipal services (water supply, electricity, sanitation, "
            "waste disposal, public roads, and traffic in Bhopal).\n"
            "3. Guide citizens on how to file grievances or check their status on the GenWin Grievance Redressal portal "
            "(e.g., they can raise complaints for departments like Public Works, Electricity, Sanitation, and Water Supply).\n"
            "Keep your responses polite, informative, professional, and directly focused on Bhopal. "
            "If a user asks about general topics, politely redirect them or relate the answer to Bhopal where possible."
        )

        # Initialize the model
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction=system_instruction
        )

        # Generate response asynchronously
        response = await model.generate_content_async(payload.message)
        
        return ChatResponse(
            response=response.text,
            success=True
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Gemini API: {str(e)}"
        )


