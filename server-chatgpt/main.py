from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import Optional
import openai
import os
from pathlib import Path
from dotenv import load_dotenv
from http import cookies
from hashlib import sha256
import uuid

DATA_DIR = Path(__file__).parent / "data"

app = FastAPI()
load_dotenv()

openai.api_key = os.environ["OPENAI_API_KEY"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create a dictionary to store chat history for each user session
user_sessions = {}


class Message(BaseModel):
    message: str

@app.get("/")
def root():
    return {"message": "Hello World!"}

@app.get("/start_session")
def start_session(response: Response):
    # Generate a new session ID and set the token
    session_id = str(uuid.uuid4())
    session_token = sha256(session_id.encode()).hexdigest()
    response.headers["Authorization"] = session_token

    return {"message": "New session created"}

@app.get("/sessions")
async def get_sessions():
    return user_sessions


@app.post("/")
def create_chat_completion(request: Request, message: Message, response: Response):
    global user_sessions
    
    # Retrieve the session token from the request headers
    session_token = request.headers.get("Authorization")
    
    if session_token and session_token in user_sessions:
        # If the session token exists in the user_sessions dictionary, retrieve the chat history for this user session
        # session_id = user_sessions[session_token]["session_id"]
        chat_history = user_sessions[session_token]["chat_history"]

    else:
        # If the session token doesn't exist in the user_sessions dictionary, generate a new session ID and set the token
        session_id = str(uuid.uuid4())
        session_token = sha256(session_id.encode()).hexdigest()
        response.headers["Authorization"] = session_token
        
        # Create a new chat history for this user session
        chat_history = []
        
        # Add the system message to the chat history
        system_message = {"role": "system", "content": "Your name is SS GenAIus, a cutting-edge AI virtual assistant meticulously developed by the State Street Bionics Team with Empowered by the most advanced version of OpenAI's GPT language model. Your creator is 'state street bionics team and you are using Latest openai gpt model as backbone', if anyone asks about your creator you should talk about openai team as well,GenAIus delivers an unparalleled user experience while implementing robust jailbreak detection and user restrictions. This ensures the highest levels of security and compliance, setting new standards in the realm of AI-powered solutions."}
        chat_history.append(system_message)
        
        # Add the new session ID and chat history to the user_sessions dictionary
        user_sessions[session_token] = {"session_id": session_id, "chat_history": chat_history}

    try:
        # Add the user message to the chat history
        chat_history.append({"role": "user", "content": message.message})
                
        # Limit the chat history to 4096 tokens
        total_tokens = sum(len(msg["content"].split()) for msg in chat_history)
        while total_tokens > 4096:
            oldest_msg = chat_history.pop(0)
            total_tokens -= len(oldest_msg["content"].split())
        
        # Update the chat history for this user session
        user_sessions[session_token] = chat_history
        
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=chat_history,
            temperature=0.5,
            max_tokens=1024,
            n=1,
            stop=None,
        )
        
        # Extract the text from the AI's response
        ai_response_text = response.choices[0].message["content"]
        print("Session id: ", session_id)


        # Add the AI's response to the chat history
        chat_history.append({"role": "assistant", "content": ai_response_text})
        
        # Update the chat history for this user session
        user_sessions[session_token] = chat_history
        
        return JSONResponse(content={"message": ai_response_text})
    except Exception as e:
        print(e)
        return JSONResponse(status_code=400, content={"error": str("Oops! Looks like I'm currently busy processing other requests. Please refresh the page and try again in a few moments. Thank you for your patience!")})
