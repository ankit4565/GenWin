import os
import io
import uuid
import PIL.Image
import google.generativeai as genai
from typing import Optional, List
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from pydantic import BaseModel
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from shared.db import get_db
from auth_services.app.dependencies.auth import get_current_user
from chatbot_service.app.models.chatbot import ChatSession, ChatMessage

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
    session_id: str

@router.get("/status")
async def get_status():
    api_key = os.getenv("GEMINI_API_KEY")
    return {
        "status": "ok",
        "service": "chatbot_service",
        "gemini_configured": bool(api_key)
    }

@router.get("/sessions")
async def get_sessions(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Retrieve all chat sessions for the logged-in user.
    """
    result = await db.execute(
        select(ChatSession)
        .where(ChatSession.user_id == current_user.id)
        .order_by(ChatSession.created_at.desc())
    )
    sessions = result.scalars().all()
    return [
        {
            "id": str(s.id),
            "session_token": s.session_token,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in sessions
    ]

@router.get("/sessions/{session_id}/messages")
async def get_session_messages(
    session_id: str,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Retrieve all messages in a specific chat session for the logged-in user.
    """
    try:
        session_uuid = uuid.UUID(session_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid session ID format")

    result = await db.execute(
        select(ChatSession).where(ChatSession.id == session_uuid)
    )
    chat_session = result.scalar()
    if not chat_session:
        raise HTTPException(status_code=404, detail="Chat session not found")
    if chat_session.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this session")

    # Fetch messages sorted by created_at
    msg_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == session_uuid)
        .order_by(ChatMessage.created_at.asc())
    )
    messages = msg_result.scalars().all()

    return [
        {
            "id": str(m.id),
            "role": m.role,
            "content": m.content,
            "created_at": m.created_at.isoformat() if m.created_at else None
        }
        for m in messages
    ]

@router.post("/chat", response_model=ChatResponse)
async def chat_with_gemini(
    message: str = Form(...),
    session_id: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Interact with the Gemini AI model, configured with system instructions 
    relevant to Bhopal. Session history is maintained, and file uploads are supported.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(
            status_code=500,
            detail="Gemini API Key is not configured. Please add GEMINI_API_KEY to your backend/.env file."
        )

    # 1. Resolve or create chat session
    if not session_id or session_id == "null" or session_id == "undefined":
        chat_session = ChatSession(
            id=uuid.uuid4(),
            user_id=current_user.id,
            session_token=str(uuid.uuid4())
        )
        db.add(chat_session)
        await db.commit()
        await db.refresh(chat_session)
    else:
        try:
            session_uuid = uuid.UUID(session_id)
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid session ID format")

        result = await db.execute(
            select(ChatSession).where(ChatSession.id == session_uuid)
        )
        chat_session = result.scalar()
        if not chat_session:
            raise HTTPException(status_code=404, detail="Chat session not found")
        if chat_session.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Not authorized to access this chat session")

    # 2. Fetch past session messages to feed as history context
    msg_result = await db.execute(
        select(ChatMessage)
        .where(ChatMessage.session_id == chat_session.id)
        .order_by(ChatMessage.created_at.asc())
    )
    past_messages = msg_result.scalars().all()

    history = []
    for msg in past_messages:
        if msg.role in ["user", "model"]:
            history.append({
                "role": msg.role,
                "parts": [msg.content]
            })

    # 3. Handle file/photo upload
    img = None
    message_content = message

    if file:
        file_bytes = await file.read()
        if file.content_type.startswith("image/"):
            try:
                img = PIL.Image.open(io.BytesIO(file_bytes))
            except Exception as e:
                raise HTTPException(status_code=400, detail=f"Failed to parse uploaded image: {e}")
        else:
            # Try decoding as text file
            try:
                file_text = file_bytes.decode("utf-8")
                message_content = f"Uploaded File Content ({file.filename}):\n{file_text}\n\nUser Question:\n{message}"
            except Exception:
                raise HTTPException(
                    status_code=400,
                    detail=f"Unsupported file format '{file.content_type}'. Only images and text files are supported."
                )

    try:
        # 4. Configure Gemini
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

        # Start a chat with history context
        chat = model.start_chat(history=history)

        # Generate response asynchronously
        if img:
            response = await chat.send_message_async([message_content, img])
        else:
            response = await chat.send_message_async(message_content)

        # 5. Save user message and AI response to the database
        user_msg_content = f"[Attachment: {file.filename}] {message}" if file else message
        
        user_msg = ChatMessage(
            id=uuid.uuid4(),
            session_id=chat_session.id,
            role="user",
            content=user_msg_content
        )
        model_msg = ChatMessage(
            id=uuid.uuid4(),
            session_id=chat_session.id,
            role="model",
            content=response.text
        )
        
        db.add(user_msg)
        db.add(model_msg)
        await db.commit()
        
        return ChatResponse(
            response=response.text,
            success=True,
            session_id=str(chat_session.id)
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error communicating with Gemini API: {str(e)}"
        )
