    from fastapi import FastAPI, Request, Depends
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel
    from typing import Optional
    import openai
    import os
    import json
    from pathlib import Path
    from dotenv import load_dotenv
    from starlette.middleware.sessions import SessionMiddleware
    from fastapi_sessions.backends.implementations import InMemoryBackend
    from uuid import uuid4

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

    # Set up session middleware
    app.add_middleware(SessionMiddleware, secret_key=str(uuid4()), backend=InMemoryBackend())

    # Create a variable to store chat history
    chat_history = [{"role": "system", "content": "Your name is SS GenAIus, a cutting-edge AI virtual assistant meticulously developed by the State Street Bionics Team with Empowered by the most advanced version of OpenAI's GPT language model. Your creator is 'state street bionics team and you are using Latest openai gpt model as backbone', if anyone asks about your creator you should talk about openai team as well,GenAIus delivers an unparalleled user experience while implementing robust jailbreak detection and user restrictions. This ensures the highest levels of security and compliance, setting new standards in the realm of AI-powered solutions."}]

   
    class Message(BaseModel):
        message: str

    @app.get("/")
    def root():
        return {"message": "Hello World!"}

    @app.post("/",response_model=None)
    async def create_chat_completion(request: Request, message: Message, session=Depends(SessionMiddleware)):
        try:
            # Get the chat history from the session
            chat_history = session.get("chat_history", [])

            # Append the user's message to the chat history
            chat_history.append({"role": "user", "content": message.message})

            # Generate a response using OpenAI's GPT model
            prompt = "\n".join([f"{msg['role']}: {msg['content']}" for msg in chat_history])
            response = openai.Completion.create(
                model="gpt-3.5-turbo",
                messages=prompt,
                temperature=0.5,
                max_tokens=2048,
                n = 4,
                stop=None,
            )
            response_text = response.choices[0].message["content"]

            # Append the chatbot's response to the chat history
            chat_history.append({"role": "system", "content": response_text})

            # Store the updated chat history in the session
            session["chat_history"] = chat_history

            return JSONResponse({"message": response_text})
        except Exception as e:
            print(e)
            return JSONResponse(status_code=400, content={"error": str("hi I'm busy write now")})
