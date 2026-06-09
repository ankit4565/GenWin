from fastapi.testclient import TestClient
import os

# Import the FastAPI app instance from the backend entrypoint
from ansh import server

def main():
    client = TestClient(server)
    
    # 1. Test Chatbot Status Endpoint
    print("Testing GET /chatbot/status...")
    response = client.get("/chatbot/status")
    print("Response status:", response.status_code)
    print("Response JSON:", response.json())
    print("-" * 50)

    # 2. Test Chatbot Chat Endpoint when GEMINI_API_KEY is missing
    print("Testing POST /chatbot/chat without GEMINI_API_KEY...")
    response = client.post("/chatbot/chat", json={"message": "What is Bhopal famous for?"})
    print("Response status:", response.status_code)
    print("Response JSON:", response.json())
    print("-" * 50)

if __name__ == "__main__":
    main()
