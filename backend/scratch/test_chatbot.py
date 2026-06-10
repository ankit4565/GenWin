import httpx
import sys
import io
from PIL import Image

BASE_URL = "http://127.0.0.1:8009"

def main():
    print("--- 1. Logging in ---")
    login_payload = {"email": "ansh@example.com", "password": "1234"}
    r = httpx.post(f"{BASE_URL}/auth/login", json=login_payload, timeout=15.0)
    if r.status_code != 200:
        print(f"Login failed: {r.status_code} {r.text}")
        sys.exit(1)
    
    data = r.json()
    token = data["access_token"]
    print(f"Logged in successfully. Token starts with: {token[:20]}...")

    headers = {"Authorization": f"Bearer {token}"}

    print("\n--- 2. Sending first message (no session_id) ---")
    form_data = {
        "message": "Hi, I am planning to visit Bhopal. Can you recommend some places to see?"
    }
    r = httpx.post(f"{BASE_URL}/chatbot/chat", data=form_data, headers=headers, timeout=30.0)
    if r.status_code != 200:
        print(f"Chat 1 failed: {r.status_code} {r.text}")
        sys.exit(1)
    
    response_data = r.json()
    print("Chat 1 Response:")
    print(response_data)
    session_id = response_data["session_id"]
    print(f"Session ID created: {session_id}")

    print("\n--- 3. Sending second message with session_id (history test) ---")
    form_data_2 = {
        "message": "Which of those places is a national park?",
        "session_id": session_id
    }
    r = httpx.post(f"{BASE_URL}/chatbot/chat", data=form_data_2, headers=headers, timeout=30.0)
    if r.status_code != 200:
        print(f"Chat 2 failed: {r.status_code} {r.text}")
        sys.exit(1)
    
    response_data_2 = r.json()
    print("Chat 2 Response:")
    print(response_data_2)

    print("\n--- 4. Fetching sessions ---")
    r = httpx.get(f"{BASE_URL}/chatbot/sessions", headers=headers, timeout=15.0)
    if r.status_code != 200:
        print(f"Fetch sessions failed: {r.status_code} {r.text}")
        sys.exit(1)
    print("Sessions list:")
    print(r.json())

    print("\n--- 5. Fetching session messages ---")
    r = httpx.get(f"{BASE_URL}/chatbot/sessions/{session_id}/messages", headers=headers, timeout=15.0)
    if r.status_code != 200:
        print(f"Fetch messages failed: {r.status_code} {r.text}")
        sys.exit(1)
    print("Messages under session:")
    for msg in r.json():
        print(f"  [{msg['role']}]: {msg['content'][:100]}...")

    print("\n--- 6. Test with a text file upload ---")
    file_content = b"Bhopal is known as the City of Lakes for its various natural as well as artificial lakes."
    files = {"file": ("info.txt", file_content, "text/plain")}
    form_data_3 = {
        "message": "What does the uploaded file say about Bhopal?",
        "session_id": session_id
    }
    r = httpx.post(f"{BASE_URL}/chatbot/chat", data=form_data_3, files=files, headers=headers, timeout=30.0)
    if r.status_code != 200:
        print(f"Chat 3 with file failed: {r.status_code} {r.text}")
        sys.exit(1)
    print("Chat 3 Response:")
    print(r.json())

    print("\n--- 7. Test with a photo/image file upload ---")
    img = Image.new('RGB', (100, 100), color = 'red')
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr = img_byte_arr.getvalue()
    files_img = {"file": ("red_square.png", img_byte_arr, "image/png")}
    form_data_4 = {
        "message": "What color is this image, and what is its shape?",
        "session_id": session_id
    }
    r = httpx.post(f"{BASE_URL}/chatbot/chat", data=form_data_4, files=files_img, headers=headers, timeout=30.0)
    if r.status_code != 200:
        print(f"Chat 4 with image failed: {r.status_code} {r.text}")
        sys.exit(1)
    print("Chat 4 Response:")
    print(r.json())

if __name__ == "__main__":
    main()
